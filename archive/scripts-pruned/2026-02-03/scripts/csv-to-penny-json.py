"""
Simple CSV -> Penny JSON converter.

Usage:
  python scripts/csv-to-penny-json.py responses.csv > data/penny-list.json

CSV columns used (exact names from the form):
- SKU
- Item Name
- Photo Proof (file name or link)
- State
- City
- Notes
- Quantity Seen
- Date Found
- Approved (TRUE/FALSE)
- Tier (Very Common/Common/Rare)
- Date Approved

The script groups rows by SKU and merges locations into counts. It only includes rows where Approved == TRUE and Date Approved is within the recent window (default 30 days).
"""

from __future__ import annotations

import csv
import json
import sys
from collections import defaultdict
from datetime import datetime

RECENT_WINDOW_DAYS = 30

# Column alias map (case-insensitive). Add your form column names here if they differ.
FIELD_ALIASES = {
    "timestamp": ["timestamp"],
    "email": ["email address"],
    "name": ["item name", "name", "product name", "  item name  "],
    "sku": [
        "home depot sku (6 or 10 digits)",
        "sku",
        "item sku",
        "product sku",
        "  home depot sku (6 or 10 digits)  ",
    ],
    "quantity": [
        "exact quantity found",
        "quantity",
        "qty",
        "quantity seen",
        "  exact quantity found ",
    ],
    "city_state": ["store (city, state)", "store", "location", "  store (city, state)"],
    "date_found": [
        "purchase date",
        "date found",
        "found date",
        "date",
        "purchase date",
    ],
    "photo": [
        "upload photo(s) of item / shelf tag / receipt",
        "photo proof",
        "photo",
        "image",
        "upload",
        "  upload photo(s) of item / shelf tag / receipt  ",
    ],
    "notes": [
        "notes (optional)",
        "notes",
        "note",
        "comments",
        "comment",
        "  notes (optional)",
    ],
    "approved": ["approved", "is approved"],
    "tier": ["tier", "commonness"],
    "status": ["status", "scope"],
    "date_approved": ["date approved", "approved date"],
}


def build_lookup(row: dict) -> dict:
    """Return a lowercase-keyed dict for easy lookup."""
    return {str(k).strip().lower(): v for k, v in row.items()}


def pick_field(row_lc: dict, key: str) -> str:
    """Fetch first matching alias value for a canonical key."""
    for alias in FIELD_ALIASES.get(key, []):
        if alias in row_lc:
            return row_lc[alias]
    return ""


def parse_bool(value: str) -> bool:
    return str(value).strip().lower() in ("yes", "true", "1", "y", "t")


def normalize_state(value: str) -> str:
    return value.strip().upper() if value else ""


def parse_row(
    row: dict, current_time: datetime, include_window_days: int
) -> dict | None:
    """Return None if this row should not be included (not approved, outside window).
    Else return normalized dict.
    """
    row_lc = build_lookup(row)

    # Use purchase date or fallback to now
    date_found = pick_field(row_lc, "date_found")
    if not date_found:
        parsed_date = current_time
    else:
        try:
            parsed_date = datetime.fromisoformat(date_found)
        except ValueError:
            try:
                parsed_date = datetime.strptime(date_found, "%Y-%m-%d")
            except ValueError:
                parsed_date = current_time

    # Split city/state if present
    city_state_raw = pick_field(row_lc, "city_state").strip()
    city, state = "", ""
    if city_state_raw:
        if "," in city_state_raw:
            parts = city_state_raw.split(",")
            city = parts[0].strip()
            state = parts[1].strip().upper() if len(parts) > 1 else ""
        else:
            city = city_state_raw.strip()
    return {
        "sku": pick_field(row_lc, "sku").strip(),
        "name": pick_field(row_lc, "name").strip(),
        "photo": pick_field(row_lc, "photo"),
        "state": state,
        "city": city,
        "notes": pick_field(row_lc, "notes").strip(),
        "quantity": pick_field(row_lc, "quantity").strip(),
        "date": parsed_date.strftime("%Y-%m-%d"),
        "tier": (pick_field(row_lc, "tier") or "Rare").strip() or "Rare",
        "status": pick_field(row_lc, "status").strip(),
    }


def aggregate_rows(row_list: list[dict]) -> list[dict]:
    grouped = {}

    for r in row_list:
        sku = r.get("sku")
        if not sku:
            continue
        if sku not in grouped:
            grouped[sku] = {
                "id": sku,
                "name": r.get("name", ""),
                "sku": sku,
                "price": 0.01,
                "dateAdded": r.get("date"),
                "tier": r.get("tier", "Rare"),
                "status": r.get("status", ""),
                "quantityFound": r.get("quantity", ""),
                "imageUrl": r.get("photo", "/images/placeholder-product.jpg"),
                "notes": r.get("notes", ""),
                "locations": defaultdict(int),
            }
        # update latest date
        if r.get("date"):
            current = grouped[sku]["dateAdded"]
            if not current or current < r.get("date"):
                grouped[sku]["dateAdded"] = r.get("date")

        # prefer highest tier
        tier_ranks = {"Very Common": 3, "Common": 2, "Rare": 1}
        if tier_ranks.get(r.get("tier", "Rare"), 0) > tier_ranks.get(
            grouped[sku]["tier"], 0
        ):
            grouped[sku]["tier"] = r.get("tier")

        # aggregate states
        st = r.get("state")
        if st:
            grouped[sku]["locations"][st] += 1

    # finalize
    result = []
    for _sku, entry in grouped.items():
        entry["locations"] = dict(entry["locations"])
        result.append(entry)
    return result


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(
            "Usage: python scripts/csv-to-penny-json.py responses.csv > data/penny-list.json"
        )
        sys.exit(1)

    csv_file = sys.argv[1]
    with open(csv_file, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        now_dt = datetime.now()
        parsed_rows = [parse_row(r, now_dt, RECENT_WINDOW_DAYS) for r in reader]
        parsed_rows = [r for r in parsed_rows if r is not None]

    aggregated = aggregate_rows(parsed_rows)

    # add IDs as incremental if not SKU
    for i, item in enumerate(aggregated, start=1):
        item["id"] = str(i)

    print(json.dumps(aggregated, indent=2))
