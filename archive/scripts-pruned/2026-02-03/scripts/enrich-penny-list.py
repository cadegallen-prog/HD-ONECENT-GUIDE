#!/usr/bin/env python3
"""
Enrich Penny List with Purchase Dates and Internet SKUs

This script:
1. Reads the user's pasted data (TSV format)
2. Reads GA purchase data from Penny_Items_Deduplicated.csv
3. Reads existing enrichment data from .local/enrichment-upload.csv
4. Deduplicates GA entries by SKU
5. Fills missing purchase dates for GA items
6. Adds Internet SKUs and Image URLs where available
7. Outputs enriched CSV to project root
"""

import csv
import re
import sys
from collections import OrderedDict
from pathlib import Path

# File paths
PROJECT_ROOT = Path(__file__).parent.parent
USER_PASTE_FILE = Path(
    r"C:\Users\cadeg\Downloads\can you review the current stae of.txt"
)
GA_PURCHASES_FILE = Path(r"C:\Users\cadeg\Downloads\Penny_Items_Deduplicated.csv")
ENRICHMENT_FILE = PROJECT_ROOT / ".local" / "enrichment-upload.csv"
OUTPUT_FILE = PROJECT_ROOT / "enriched-penny-list.csv"


def normalize_sku(sku: str) -> str:
    """Normalize SKU to digits only."""
    if not sku:
        return ""
    return re.sub(r"\D", "", str(sku))


def extract_state(store_field: str) -> str:
    """Extract state abbreviation from store field."""
    if not store_field:
        return ""
    store_field = store_field.strip()
    # Check if it's just a state abbreviation (2 chars)
    if len(store_field) == 2 and store_field.isalpha():
        return store_field.upper()
    # Look for state at end like "City, State" or just "TX"
    parts = store_field.split(",")
    if len(parts) >= 2:
        state_part = parts[-1].strip()
        # Extract just the state code if it has extra text
        state_match = re.search(r"\b([A-Z]{2})\b", state_part.upper())
        if state_match:
            return state_match.group(1)
    # Check if the whole thing ends with a state code
    state_match = re.search(r"\b([A-Z]{2})$", store_field.upper())
    if state_match:
        return state_match.group(1)
    return store_field.upper() if len(store_field) <= 3 else ""


def load_ga_purchases(filepath: Path) -> dict:
    """Load GA purchases from deduplicated CSV."""
    ga_data = {}
    if not filepath.exists():
        print(f"Warning: GA purchases file not found: {filepath}")
        return ga_data

    with open(filepath, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            sku = normalize_sku(row.get("SKU Number", ""))
            if sku:
                ga_data[sku] = {
                    "date": row.get("Date", ""),
                    "item_name": row.get("Item Name", ""),
                    "internet_sku": row.get("Internet SKU", ""),
                    "state": row.get("State", "GA"),
                }
    print(f"Loaded {len(ga_data)} GA purchases with dates")
    return ga_data


def load_enrichment_data(filepath: Path) -> dict:
    """Load enrichment data (image URLs and internet SKUs)."""
    enrichment = {}
    if not filepath.exists():
        print(f"Warning: Enrichment file not found: {filepath}")
        return enrichment

    with open(filepath, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            sku = normalize_sku(row.get("Home Depot SKU (6 or 10 digits)", ""))
            if sku:
                enrichment[sku] = {
                    "image_url": row.get("IMAGE URL", ""),
                    "internet_sku": row.get("INTERNET SKU", ""),
                }
    print(f"Loaded {len(enrichment)} enrichment entries")
    return enrichment


def load_user_paste(filepath: Path) -> list:
    """Load user's pasted data from TSV (no header row)."""
    records = []
    if not filepath.exists():
        print(f"Warning: User paste file not found: {filepath}")
        return records

    # Define column names for headerless TSV
    # Format: Timestamp, (empty), Item Name, SKU, Qty, State, Purchase Date, Image URL, Notes, Internet SKU
    fieldnames = [
        "Timestamp",
        "_email",  # empty placeholder
        "Item Name",
        "Home Depot SKU (6 or 10 digits)",
        "Exact Quantity Found",
        "Store (City, State)",
        "Purchase Date",
        "Image URL",
        "Notes (Optional)",
        "Internet SKU",
    ]

    with open(filepath, "r", encoding="utf-8") as f:
        reader = csv.reader(f, delimiter="\t")
        for row in reader:
            if not row or len(row) < 4:
                continue
            # Pad row to expected length
            while len(row) < len(fieldnames):
                row.append("")
            record = {fieldnames[i]: row[i] for i in range(len(fieldnames))}
            records.append(record)
    print(f"Loaded {len(records)} records from user paste")
    return records


def process_records(user_records: list, ga_purchases: dict, enrichment: dict) -> list:
    """Process and enrich records."""
    output = []
    seen_ga_skus = set()

    # Output columns
    columns = [
        "Timestamp",
        "Item Name",
        "Home Depot SKU (6 or 10 digits)",
        "Exact Quantity Found",
        "Store (City, State)",
        "Purchase Date",
        "Image URL",
        "Notes (Optional)",
        "Internet SKU",
    ]

    # Process user pasted records
    for record in user_records:
        sku = normalize_sku(record.get("Home Depot SKU (6 or 10 digits)", ""))
        if not sku:
            continue

        store = record.get("Store (City, State)", "")
        state = extract_state(store)

        # For GA records, deduplicate by SKU
        if state == "GA":
            if sku in seen_ga_skus:
                continue  # Skip duplicate GA SKU
            seen_ga_skus.add(sku)

            # Fill purchase date from GA purchases if missing
            purchase_date = (record.get("Purchase Date") or "").strip()
            if not purchase_date and sku in ga_purchases:
                purchase_date = ga_purchases[sku]["date"]
            record["Purchase Date"] = purchase_date

        # Enrich with image URL and internet SKU if missing
        image_url = (record.get("Image URL") or "").strip()
        internet_sku = (record.get("Internet SKU") or "").strip()

        if sku in enrichment:
            if not image_url:
                image_url = enrichment[sku]["image_url"]
            if not internet_sku:
                internet_sku = enrichment[sku]["internet_sku"]

        # Also check GA purchases for internet SKU
        if not internet_sku and sku in ga_purchases:
            internet_sku = ga_purchases[sku]["internet_sku"]

        record["Image URL"] = image_url
        record["Internet SKU"] = internet_sku

        # Build output record with consistent columns
        out_record = OrderedDict()
        for col in columns:
            out_record[col] = record.get(col, "")
        output.append(out_record)

    print(f"Processed {len(output)} records from user paste")
    print(f"Seen {len(seen_ga_skus)} unique GA SKUs")

    # Add new GA SKUs that weren't in the paste
    new_skus_added = 0
    for sku, data in ga_purchases.items():
        if sku not in seen_ga_skus:
            # Check if this SKU exists in any state in the records
            sku_exists_elsewhere = any(
                normalize_sku(r.get("Home Depot SKU (6 or 10 digits)", "")) == sku
                for r in output
            )

            if not sku_exists_elsewhere:
                # Add as new GA record
                new_record = OrderedDict()
                new_record["Timestamp"] = ""
                new_record["Item Name"] = data["item_name"]
                new_record["Home Depot SKU (6 or 10 digits)"] = sku
                new_record["Exact Quantity Found"] = ""
                new_record["Store (City, State)"] = "GA"
                new_record["Purchase Date"] = data["date"]

                # Get enrichment data
                image_url = ""
                internet_sku = data["internet_sku"]
                if sku in enrichment:
                    image_url = enrichment[sku]["image_url"]
                    if not internet_sku:
                        internet_sku = enrichment[sku]["internet_sku"]

                new_record["Image URL"] = image_url
                new_record["Notes (Optional)"] = ""
                new_record["Internet SKU"] = internet_sku

                output.append(new_record)
                new_skus_added += 1

    print(f"Added {new_skus_added} new GA SKUs from deduplicated list")

    return output, columns


def write_output(records: list, columns: list, filepath: Path):
    """Write enriched records to CSV."""
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=columns)
        writer.writeheader()
        writer.writerows(records)
    print(f"Wrote {len(records)} records to {filepath}")


def main():
    print("=" * 60)
    print("Penny List Enrichment Script")
    print("=" * 60)

    # Load all data sources
    ga_purchases = load_ga_purchases(GA_PURCHASES_FILE)
    enrichment = load_enrichment_data(ENRICHMENT_FILE)
    user_records = load_user_paste(USER_PASTE_FILE)

    if not user_records:
        print("Error: No user records to process")
        sys.exit(1)

    # Process and enrich
    output_records, columns = process_records(user_records, ga_purchases, enrichment)

    # Write output
    write_output(output_records, columns, OUTPUT_FILE)

    print("=" * 60)
    print("Done!")
    print(f"Output file: {OUTPUT_FILE}")
    print("=" * 60)


if __name__ == "__main__":
    main()
