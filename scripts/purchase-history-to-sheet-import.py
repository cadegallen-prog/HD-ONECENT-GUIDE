"""\
Import Home Depot purchase-history CSV exports into PennyCentral's Community Penny List pipeline.

CRITICAL PRIVACY MODEL
- We do NOT write store numbers or purchaser identifiers.
- We do NOT generate a repo-committable dataset.
- Output is intended to be pasted/imported into your existing Google Sheet, which Vercel reads
    via the `GOOGLE_SHEET_URL` environment variable.

DATA MODEL / DEDUPE RULES
- 1 unique SKU per 1 unique person.
    - Here, each input CSV file is treated as "one person".
    - If a SKU appears multiple times within the same file on different days, keep ONLY the most
        recent purchase date for that file.
    - If the same SKU appears across multiple files (multiple people), we output one row PER FILE
        so the site counts multiple reports.

INTERNET SKU NOTE
- Internet SKU is useful for backend/product URL matching (outbound HD links only).
- It should NOT be put into the outward-facing Penny List feed.
- Always fall back to regular SKU-based links when the internet SKU map has no entry.
- This script can output a separate private map file (NOT for committing) that you can store
    privately (e.g., Vercel Blob / private Drive) if you later wire it into the site.

Usage:
    python scripts/purchase-history-to-sheet-import.py \
        --out-sheet-csv ./.local/purchase-history-sheet-import.csv \
        --out-internet-sku-map ./.local/purchase-history-internet-sku-map.json \
        "C:\\path\\to\\TEXAS_...csv" "C:\\path\\to\\NEW_HAMPSHIRE_...csv"
"""

from __future__ import annotations

import argparse
import csv
import json
import re
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any, Iterable


STATE_NAME_TO_CODE: dict[str, str] = {
    "ALABAMA": "AL",
    "ALASKA": "AK",
    "ARIZONA": "AZ",
    "ARKANSAS": "AR",
    "CALIFORNIA": "CA",
    "COLORADO": "CO",
    "CONNECTICUT": "CT",
    "DELAWARE": "DE",
    "FLORIDA": "FL",
    "GEORGIA": "GA",
    "HAWAII": "HI",
    "IDAHO": "ID",
    "ILLINOIS": "IL",
    "INDIANA": "IN",
    "IOWA": "IA",
    "KANSAS": "KS",
    "KENTUCKY": "KY",
    "LOUISIANA": "LA",
    "MAINE": "ME",
    "MARYLAND": "MD",
    "MASSACHUSETTS": "MA",
    "MICHIGAN": "MI",
    "MINNESOTA": "MN",
    "MISSISSIPPI": "MS",
    "MISSOURI": "MO",
    "MONTANA": "MT",
    "NEBRASKA": "NE",
    "NEVADA": "NV",
    "NEW_HAMPSHIRE": "NH",
    "NEW_JERSEY": "NJ",
    "NEW_MEXICO": "NM",
    "NEW_YORK": "NY",
    "NORTH_CAROLINA": "NC",
    "NORTH_DAKOTA": "ND",
    "OHIO": "OH",
    "OKLAHOMA": "OK",
    "OREGON": "OR",
    "PENNSYLVANIA": "PA",
    "RHODE_ISLAND": "RI",
    "SOUTH_CAROLINA": "SC",
    "SOUTH_DAKOTA": "SD",
    "TENNESSEE": "TN",
    "TEXAS": "TX",
    "UTAH": "UT",
    "VERMONT": "VT",
    "VIRGINIA": "VA",
    "WASHINGTON": "WA",
    "WEST_VIRGINIA": "WV",
    "WISCONSIN": "WI",
    "WYOMING": "WY",
    "DISTRICT_OF_COLUMBIA": "DC",
}


def infer_state_code_from_filename(path: str) -> str:
    base = Path(path).name
    normalized = re.sub(r"[^A-Z]", "_", base.upper())
    normalized = re.sub(r"_+", "_", normalized).strip("_")

    # Fast path: first token is already a 2-letter code (e.g., "TX_...").
    first = normalized.split("_")[0].strip().upper()
    if len(first) == 2 and first.isalpha():
        return first

    # Fast path: first token is a full state name (e.g., "TEXAS_...").
    direct = STATE_NAME_TO_CODE.get(first, "")
    if direct:
        return direct

    # Robust path: filename may start with multi-token names (e.g., "NEW_HAMPSHIRE_...").
    padded = f"_{normalized}_"
    best_key = ""
    for key in STATE_NAME_TO_CODE.keys():
        if f"_{key}_" in padded and len(key) > len(best_key):
            best_key = key

    return STATE_NAME_TO_CODE.get(best_key, "")


def to_digits(value: str) -> str:
    return re.sub(r"\D+", "", value or "")


def parse_money(value: str) -> float | None:
    if value is None:
        return None
    s = str(value).strip()
    if not s:
        return None
    s = s.replace("$", "").replace(",", "").strip()
    try:
        return float(s)
    except ValueError:
        return None


def parse_date_to_iso(value: str) -> str | None:
    if not value:
        return None
    s = str(value).strip()
    if not s:
        return None

    for fmt in ("%m/%d/%Y", "%m/%d/%y", "%Y-%m-%d"):
        try:
            return datetime.strptime(s, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue

    # Try a very forgiving fallback (e.g., "12/1/2025 5:40 PM")
    m = re.match(r"^(\d{1,2}/\d{1,2}/\d{2,4})", s)
    if m:
        return parse_date_to_iso(m.group(1))
    return None


def normalize_header(value: str) -> str:
    return re.sub(r"\s+", " ", (value or "").strip().lower())


def pick_first(row: dict[str, Any], candidates: Iterable[str]) -> str:
    for key in candidates:
        for actual_key in row.keys():
            if normalize_header(actual_key) == normalize_header(key):
                v = row.get(actual_key)
                return "" if v is None else str(v)
    return ""


def open_csv_rows(path: str) -> list[dict[str, str]]:
    """Load CSV rows as dicts.

    Some exports include a few preamble rows before the actual header; we detect the
    header row by scanning for a row containing "SKU" and "Date".
    """

    raw_text = Path(path).read_bytes()
    # Try UTF-8 first; fallback to cp1252 for legacy exports.
    try:
        text = raw_text.decode("utf-8")
    except UnicodeDecodeError:
        text = raw_text.decode("cp1252", errors="replace")

    lines = text.splitlines()
    if not lines:
        return []

    # Scan for header line index
    header_index = None
    csv_reader = csv.reader(lines)
    for i, row in enumerate(csv_reader):
        joined = "|".join([str(c).strip() for c in row])
        if re.search(r"\bsku\b", joined, re.IGNORECASE) and re.search(
            r"\bdate\b", joined, re.IGNORECASE
        ):
            header_index = i
            break

    if header_index is None:
        return []

    # Re-parse as DictReader from header row onward
    sliced = lines[header_index:]
    dict_reader = csv.DictReader(sliced)
    return [dict(r) for r in dict_reader]


@dataclass(frozen=True)
class PurchaseRow:
    sku: str
    name: str
    internet_sku: str
    date_iso: str
    state: str


def parse_purchase_rows(csv_path: str) -> list[PurchaseRow]:
    state = infer_state_code_from_filename(csv_path)
    rows = open_csv_rows(csv_path)
    parsed: list[PurchaseRow] = []

    for row in rows:
        # Map likely column names across different export formats
        date_raw = pick_first(row, ["Date Purchased", "Date"])
        sku_raw = pick_first(row, ["SKU Number", "SKU", "Sku Number"])
        name_raw = pick_first(row, ["Item Name", "SKU Description", "Product Name"])
        internet_raw = pick_first(row, ["Internet SKU", "Internet Sku"])

        price_raw = pick_first(
            row,
            [
                "price",
                "Net Unit Price",
                "Net Unit price",
                "Unit price",
                "Unit Price",
            ],
        )

        date_iso = parse_date_to_iso(date_raw)
        sku = to_digits(sku_raw)
        internet_sku = to_digits(internet_raw)
        price = parse_money(price_raw)

        # Filter rules
        if not date_iso or not sku:
            continue
        if price is None or abs(price - 0.01) > 0.0009:
            continue

        parsed.append(
            PurchaseRow(
                sku=sku,
                name=str(name_raw or "").strip(),
                internet_sku=internet_sku,
                date_iso=date_iso,
                state=state,
            )
        )

    return parsed


def dedupe_within_person_keep_most_recent(rows: list[PurchaseRow]) -> list[PurchaseRow]:
    """Deduplicate rows by SKU within a single file/person."""

    by_sku: dict[str, PurchaseRow] = {}

    for r in rows:
        existing = by_sku.get(r.sku)
        if existing is None:
            by_sku[r.sku] = r
            continue

        if r.date_iso > existing.date_iso:
            by_sku[r.sku] = r
            continue

        if r.date_iso == existing.date_iso:
            # Tie-breakers: prefer a better name / internet sku
            if (len(r.name) > len(existing.name)) or (
                existing.internet_sku in ("", "0") and r.internet_sku not in ("", "0")
            ):
                by_sku[r.sku] = r

    # Newest first
    return sorted(by_sku.values(), key=lambda x: x.date_iso, reverse=True)


SHEET_HEADERS: list[str] = [
    # These headers intentionally match the aliasing in lib/fetch-penny-data.ts
    "Item Name",
    "Home Depot SKU (6 or 10 digits)",
    "Store (City, State)",
    "Purchase Date",
    "Exact Quantity Found",
    "Notes (optional)",
    "INTERNET SKU",
]


def to_sheet_row(r: PurchaseRow) -> dict[str, str]:
    # No store #, no purchaser.
    # We DO include internet SKU now so it flows into the consolidated sheet.
    return {
        "Item Name": r.name,
        "Home Depot SKU (6 or 10 digits)": r.sku,
        "Store (City, State)": r.state,
        "Purchase Date": r.date_iso,
        "Exact Quantity Found": "",
        "Notes (optional)": "",
        "INTERNET SKU": r.internet_sku,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--out-sheet-csv",
        required=True,
        help="Output CSV to import/paste into the Google Sheet (public feed fields only)",
    )
    parser.add_argument(
        "--out-internet-sku-map",
        default="",
        help="Optional: output JSON map of sku->internetSku (keep private; do NOT commit)",
    )
    parser.add_argument(
        "--force-state",
        default="",
        help="Optional: force a 2-letter state code for all rows (e.g., GA). "
        "Useful when the filename does not encode the state.",
    )
    parser.add_argument("csv", nargs="+", help="One or more purchase-history CSV files")
    args = parser.parse_args()

    # Treat each input CSV as "one person".
    sheet_rows: list[dict[str, str]] = []
    internet_sku_map: dict[str, str] = {}

    for csv_path in args.csv:
        per_person_rows = parse_purchase_rows(csv_path)
        if args.force_state:
            forced = args.force_state.strip().upper()
            per_person_rows = [
                PurchaseRow(
                    sku=r.sku,
                    name=r.name,
                    internet_sku=r.internet_sku,
                    date_iso=r.date_iso,
                    state=forced,
                )
                for r in per_person_rows
            ]

        per_person_deduped = dedupe_within_person_keep_most_recent(per_person_rows)
        for r in per_person_deduped:
            sheet_rows.append(to_sheet_row(r))
            if r.internet_sku and r.internet_sku != "0":
                # Prefer to keep the longest/best internet sku if multiple sources disagree.
                existing = internet_sku_map.get(r.sku, "")
                if len(r.internet_sku) > len(existing):
                    internet_sku_map[r.sku] = r.internet_sku

    out_csv_path = Path(args.out_sheet_csv)
    out_csv_path.parent.mkdir(parents=True, exist_ok=True)
    with out_csv_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=SHEET_HEADERS)
        writer.writeheader()
        for row in sheet_rows:
            writer.writerow(row)

    if args.out_internet_sku_map:
        out_map_path = Path(args.out_internet_sku_map)
        out_map_path.parent.mkdir(parents=True, exist_ok=True)
        out_map_path.write_text(
            json.dumps(internet_sku_map, indent=2) + "\n", encoding="utf-8"
        )

    # Print a small, non-sensitive summary.
    print(f"Wrote {len(sheet_rows)} rows to {out_csv_path.as_posix()}")
    if args.out_internet_sku_map:
        print(
            f"Wrote {len(internet_sku_map)} sku->internetSku mappings to {Path(args.out_internet_sku_map).as_posix()}"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
