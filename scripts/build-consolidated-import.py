"""\
Build a Sheet-importable consolidated CSV for PennyCentral.

Inputs
- Current Google Sheet export CSV (the site's public feed): ./.local/current-sheet.csv
- Purchase-history-derived sheet-import CSV (public fields only): ./.local/purchase-history-sheet-import.csv
- Optional private sku->internetSku map JSON: ./.local/purchase-history-internet-sku-map.json

Output
- ./.local/consolidated-import.csv

Privacy / policy
- Store numbers and purchaser identifiers are NOT kept.
- `INTERNET SKU` is intended to stay private (backend-only usage).

Dedupe rules
- Purchase history: 1 unique SKU per input file/person is handled upstream by
  scripts/purchase-history-to-sheet-import.py
- Current sheet export: left as-is (cannot reliably dedupe per-person without an identifier)

Usage:
    python scripts/build-consolidated-import.py \
      --current-sheet ./.local/current-sheet.csv \
      --purchase-sheet ./.local/purchase-history-sheet-import.csv \
      --internet-sku-map ./.local/purchase-history-internet-sku-map.json \
      --out ./.local/consolidated-import.csv
"""

from __future__ import annotations

import argparse
import csv
import json
import re
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

FINAL_HEADERS: list[str] = [
    "Timestamp",
    "Email Address",
    "Item Name",
    "Home Depot SKU (6 or 10 digits)",
    "Exact Quantity Found",
    "Store (City, State)",
    "Purchase Date",
    "IMAGE URL",
    "Notes (Optional)",
    "INTERNET SKU",
]


def normalize_header(value: str) -> str:
    return re.sub(r"\s+", " ", (value or "").strip().lower())


def get_first(row: dict[str, Any], candidate: str) -> str:
    target = normalize_header(candidate)
    for k in row.keys():
        if normalize_header(k) == target:
            v = row.get(k)
            return "" if v is None else str(v)
    return ""


def to_digits(value: str) -> str:
    return re.sub(r"\D+", "", value or "")


def read_csv_rows(path: str) -> list[dict[str, str]]:
    p = Path(path)
    if not p.exists():
        return []
    with p.open("r", encoding="utf-8", newline="") as f:
        return [dict(r) for r in csv.DictReader(f)]


def load_internet_sku_map(path: str) -> dict[str, str]:
    if not path:
        return {}
    p = Path(path)
    if not p.exists():
        return {}
    try:
        raw = json.loads(p.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}

    out: dict[str, str] = {}
    if isinstance(raw, dict):
        for k, v in raw.items():
            sku = to_digits(str(k))
            internet = to_digits(str(v))
            if sku and internet and internet != "0":
                out[sku] = internet
    return out


def build_rows_from_current_sheet(
    current_sheet_csv: str,
    internet_sku_map: dict[str, str],
) -> list[dict[str, str]]:
    rows = read_csv_rows(current_sheet_csv)
    parsed: list[dict[str, str]] = []

    for r in rows:
        sku = to_digits(get_first(r, "Home Depot SKU (6 or 10 digits)"))
        if not sku:
            continue

        parsed.append(
            {
                "Timestamp": get_first(r, "Timestamp").strip(),
                "Email Address": get_first(r, "Email Address").strip(),
                "Item Name": get_first(r, "Item Name").strip(),
                "Home Depot SKU (6 or 10 digits)": sku,
                "Exact Quantity Found": get_first(r, "Exact Quantity Found").strip(),
                "Store (City, State)": get_first(r, "Store (City, State)").strip(),
                "Purchase Date": get_first(r, "Purchase Date").strip(),
                "IMAGE URL": get_first(r, "IMAGE URL").strip(),
                "Notes (Optional)": get_first(r, "Notes (Optional)").strip(),
                "INTERNET SKU": internet_sku_map.get(sku, ""),
            }
        )

    # Dedupe GA (user's items): keep the row with the best note/qty for each SKU.
    ga_rows = [r for r in parsed if r.get("Store (City, State)") == "GA"]
    non_ga_rows = [r for r in parsed if r.get("Store (City, State)") != "GA"]

    by_sku: dict[str, dict[str, str]] = {}
    for r in ga_rows:
        sku = r.get("Home Depot SKU (6 or 10 digits)", "")
        existing = by_sku.get(sku)
        if existing is None:
            by_sku[sku] = r
            continue

        # Prefer row with a note, then higher qty, then earlier timestamp.
        existing_note = existing.get("Notes (Optional)", "").strip()
        r_note = r.get("Notes (Optional)", "").strip()
        existing_qty = int(existing.get("Exact Quantity Found") or "0")
        r_qty = int(r.get("Exact Quantity Found") or "0")

        if (len(r_note) > len(existing_note)) or (
            len(r_note) == len(existing_note) and r_qty > existing_qty
        ):
            by_sku[sku] = r

    ga_deduped = list(by_sku.values())
    return non_ga_rows + ga_deduped


def build_rows_from_purchase_sheet(
    purchase_sheet_csv: str,
    internet_sku_map: dict[str, str],
) -> list[dict[str, str]]:
    rows = read_csv_rows(purchase_sheet_csv)
    out: list[dict[str, str]] = []

    for r in rows:
        sku = to_digits(get_first(r, "Home Depot SKU (6 or 10 digits)"))
        if not sku:
            continue

        out.append(
            {
                "Timestamp": "",
                "Email Address": "",
                "Item Name": get_first(r, "Item Name").strip(),
                "Home Depot SKU (6 or 10 digits)": sku,
                "Exact Quantity Found": get_first(r, "Exact Quantity Found").strip(),
                "Store (City, State)": get_first(r, "Store (City, State)").strip(),
                "Purchase Date": get_first(r, "Purchase Date").strip(),
                "IMAGE URL": "",
                # Force notes empty for purchase history items (removes "Imported from..." text)
                "Notes (Optional)": "",
                "INTERNET SKU": get_first(r, "INTERNET SKU").strip()
                or internet_sku_map.get(sku, ""),
            }
        )

    return out


def write_csv(path: str, rows: list[dict[str, str]]) -> None:
    out_path = Path(path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=FINAL_HEADERS)
        w.writeheader()
        for r in rows:
            w.writerow({h: r.get(h, "") for h in FINAL_HEADERS})


def audit(rows: list[dict[str, str]]) -> str:
    by_source: dict[str, list[str]] = defaultdict(list)
    source_counts: Counter[str] = Counter()

    for r in rows:
        source = (r.get("Store (City, State)") or "").strip()
        sku = (r.get("Home Depot SKU (6 or 10 digits)") or "").strip()
        source_counts[source] += 1
        if sku:
            by_source[source].append(sku)

    lines: list[str] = []
    lines.append("Rows by Store (City, State):")
    for source, count in source_counts.most_common():
        name = source if source else "(blank)"
        lines.append(f"- {name}: {count}")

    lines.append("")
    lines.append("Duplicate SKUs per source (counts of duplicated SKU values):")
    any_dups = False
    for source, skus in sorted(by_source.items(), key=lambda kv: (-len(kv[1]), kv[0])):
        dup_count = sum(1 for _sku, c in Counter(skus).items() if c > 1)
        if dup_count == 0:
            continue
        any_dups = True
        name = source if source else "(blank)"
        lines.append(f"- {name}: {dup_count}")
    if not any_dups:
        lines.append("- (none)")

    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--current-sheet", required=True)
    parser.add_argument("--purchase-sheet", required=True)
    parser.add_argument("--internet-sku-map", default="")
    parser.add_argument("--out", required=True)
    parser.add_argument(
        "--audit-out",
        default="",
        help="Optional: write an audit report to a text file",
    )
    args = parser.parse_args()

    internet_sku_map = load_internet_sku_map(args.internet_sku_map)

    current_rows = build_rows_from_current_sheet(args.current_sheet, internet_sku_map)
    purchase_rows = build_rows_from_purchase_sheet(
        args.purchase_sheet, internet_sku_map
    )

    combined = current_rows + purchase_rows
    write_csv(args.out, combined)

    report = audit(combined)
    print(f"Wrote {len(combined)} rows to {Path(args.out).as_posix()}")
    print(report)

    if args.audit_out:
        Path(args.audit_out).write_text(report, encoding="utf-8")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
