#!/usr/bin/env python3
"""
Merge verified pennies backup into consolidated CSV for Google Sheets import.

Applies contributor-aware deduplication: dedupe_key = (SKU + contributor_id)
- Same person + same SKU -> single row (upsert/enrich)
- Different people + same SKU -> multiple rows (allowed)

Enriches missing fields from verified backup:
- imageUrl -> "Upload Photo(s) of Item / Shelf Tag / Receipt"
- internetNumber -> "internetSku (private, backend only)"
- brand/model -> "Notes (Optional)" as "Verified: Brand=X; Model=Y"

Never overwrites existing non-empty values.
"""

import argparse
import csv
import json
import re
from datetime import datetime
from typing import Dict, List, Optional


def normalize_sku(sku: str) -> str:
    """Normalize SKU to digits only, validate 6 or 10 digits."""
    digits = re.sub(r'\D', '', sku)
    if not re.match(r'^\d{6}$|^\d{10}$', digits):
        return ''  # Invalid SKU
    return digits


def infer_contributor_id(row: Dict[str, str], source: str = "current") -> str:
    """
    Infer contributor_id from row.

    Rules:
    1. If Email Address exists, use it
    2. If location contains "GA", assume "Cade (GA)"
    3. Otherwise, assign source-based ID
    """
    email = row.get('Email Address', '').strip()
    if email:
        return email

    location = row.get('Store (City, State)', '').upper()
    if 'GA' in location:
        return "Cade (GA)"

    if source == "current":
        return "Existing Data"
    else:
        return f"Other Export #{source}"


def make_dedupe_key(sku: str, contributor_id: str) -> str:
    """Create unique key: (SKU || contributor_id)"""
    return f"{sku}||{contributor_id}"


def merge_best_row(row1: Dict, row2: Dict) -> Dict:
    """
    Merge two rows for same (SKU + contributor_id).
    Keep most complete fields.
    """
    merged = row1.copy()

    # For each field, prefer non-empty value
    for key in row2:
        if not merged.get(key) and row2.get(key):
            merged[key] = row2[key]

    # Merge notes carefully
    notes1 = row1.get('Notes (Optional)', '').strip()
    notes2 = row2.get('Notes (Optional)', '').strip()
    if notes1 and notes2 and notes1 != notes2:
        merged['Notes (Optional)'] = f"{notes1}; {notes2}"
    elif notes2:
        merged['Notes (Optional)'] = notes2

    return merged


def load_verified_backup(backup_path: str) -> List[Dict]:
    """Load verified backup JSON and convert to list of items."""
    with open(backup_path, 'r', encoding='utf-8') as f:
        backup_data = json.load(f)

    verified_items = []
    for sku, item in backup_data.items():
        verified_items.append({
            'sku': item.get('sku', ''),
            'name': item.get('name', ''),
            'internetNumber': item.get('internetNumber', ''),
            'brand': item.get('brand', ''),
            'model': item.get('model', ''),
            'imageUrl': item.get('imageUrl', ''),
            'purchaseDates': item.get('purchaseDates', [])
        })

    return verified_items


def load_current_csv(csv_path: str) -> List[Dict]:
    """Load current consolidated CSV."""
    with open(csv_path, 'r', encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        return list(reader)


def build_current_index(current_rows: List[Dict]) -> Dict[str, Dict]:
    """
    Build index of current data with dedupe.
    Key: (SKU || contributor_id)
    """
    current_index = {}

    for row in current_rows:
        sku = normalize_sku(row.get('Home Depot SKU (6 or 10 digits)', ''))
        if not sku:
            continue  # Skip invalid SKUs

        contributor = infer_contributor_id(row, "current")
        key = make_dedupe_key(sku, contributor)

        # If duplicate within current data, merge
        if key in current_index:
            current_index[key] = merge_best_row(current_index[key], row)
        else:
            current_index[key] = row

    return current_index


def merge_verified_items(
    current_index: Dict[str, Dict],
    verified_items: List[Dict],
    verbose: bool = False
) -> tuple[Dict[str, Dict], Dict]:
    """
    Merge verified items into current index with upsert logic.

    Returns:
        - Updated index
        - Stats dict
    """
    stats = {
        'upserted': 0,
        'inserted': 0,
        'imageUrl_added': 0,
        'internetSku_added': 0,
        'brand_model_added': 0,
        'name_added': 0
    }

    for verified_item in verified_items:
        sku = normalize_sku(verified_item['sku'])
        if not sku:
            continue  # Skip invalid SKUs

        contributor = "Cade (GA)"  # All verified items are from Cade
        key = make_dedupe_key(sku, contributor)

        if key in current_index:
            # UPSERT: Enrich existing row (fill blanks only)
            existing_row = current_index[key]
            updated = False

            # Enrich imageUrl (only if blank)
            photo_field = 'Upload Photo(s) of Item / Shelf Tag / Receipt'
            if not existing_row.get(photo_field) and verified_item['imageUrl']:
                existing_row[photo_field] = verified_item['imageUrl']
                stats['imageUrl_added'] += 1
                updated = True

            # Enrich internetSku (only if blank)
            internet_field = 'internetSku (private, backend only)'
            if not existing_row.get(internet_field) and verified_item['internetNumber']:
                existing_row[internet_field] = verified_item['internetNumber']
                stats['internetSku_added'] += 1
                updated = True

            # Enrich Notes with brand/model (only if "Verified:" not already present)
            notes = existing_row.get('Notes (Optional)', '')
            if (verified_item['brand'] and verified_item['model'] and 'Brand=' not in notes):
                verified_meta = f"Brand={verified_item['brand']}; Model={verified_item['model']}"
                if notes:
                    existing_row['Notes (Optional)'] = f"{notes}; {verified_meta}"
                else:
                    existing_row['Notes (Optional)'] = verified_meta
                stats['brand_model_added'] += 1
                updated = True

            # Update item name if blank
            if not existing_row.get('Item Name') and verified_item['name']:
                existing_row['Item Name'] = verified_item['name']
                stats['name_added'] += 1
                updated = True

            if updated:
                stats['upserted'] += 1
                if verbose:
                    print(f"  Upserted: {sku} ({contributor})")

        else:
            # INSERT: Add as new row
            new_row = {
                'Timestamp': '',
                'Email Address': '',
                'Item Name': verified_item['name'],
                'Home Depot SKU (6 or 10 digits)': sku,
                'Exact Quantity Found': '',
                'Store (City, State)': 'GA',
                'Purchase Date': verified_item['purchaseDates'][0] if verified_item['purchaseDates'] else '',
                'Upload Photo(s) of Item / Shelf Tag / Receipt': verified_item['imageUrl'],
                'Notes (Optional)': (
                    f"Brand={verified_item['brand']}; Model={verified_item['model']}"
                    if verified_item['brand'] and verified_item['model']
                    else ''
                ),
                'internetSku (private, backend only)': verified_item['internetNumber']
            }
            current_index[key] = new_row
            stats['inserted'] += 1

            if verified_item['imageUrl']:
                stats['imageUrl_added'] += 1
            if verified_item['internetNumber']:
                stats['internetSku_added'] += 1
            if verified_item['brand'] and verified_item['model']:
                stats['brand_model_added'] += 1

            if verbose:
                print(f"  Inserted: {sku} ({contributor})")

    return current_index, stats


def validate_output(final_rows: List[Dict]) -> bool:
    """Validate output CSV before writing."""
    # Check 1: No duplicate (SKU + contributor_id)
    keys = []
    for row in final_rows:
        sku = normalize_sku(row.get('Home Depot SKU (6 or 10 digits)', ''))
        contributor = infer_contributor_id(row, "output")
        keys.append(make_dedupe_key(sku, contributor))

    if len(keys) != len(set(keys)):
        print("[X] VALIDATION FAILED: Duplicate (SKU + contributor_id) found!")
        return False

    # Check 2: All SKUs are valid (6 or 10 digits)
    for row in final_rows:
        sku = row.get('Home Depot SKU (6 or 10 digits)', '')
        if not re.match(r'^\d{6}$|^\d{10}$', sku):
            print(f"[X] VALIDATION FAILED: Invalid SKU: {sku}")
            return False

    return True


def write_output_csv(output_path: str, final_rows: List[Dict]):
    """Write final CSV with correct column order."""
    fieldnames = [
        'Timestamp',
        'Email Address',
        'Item Name',
        'Home Depot SKU (6 or 10 digits)',
        'Exact Quantity Found',
        'Store (City, State)',
        'Purchase Date',
        'Upload Photo(s) of Item / Shelf Tag / Receipt',
        'Notes (Optional)',
        'internetSku (private, backend only)'
    ]

    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(final_rows)


def write_audit_log(
    audit_path: str,
    current_csv_path: str,
    verified_backup_path: str,
    output_path: str,
    current_row_count: int,
    verified_item_count: int,
    final_row_count: int,
    stats: Dict
):
    """Generate audit log with merge statistics."""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    audit_content = f"""=== Merge Audit ===
Timestamp: {timestamp}

INPUT SOURCES:
- Current CSV: {current_csv_path} ({current_row_count} rows)
- Verified Backup: {verified_backup_path} ({verified_item_count} items)

OPERATIONS:
- Upserted (enriched existing): {stats['upserted']} rows
  - Added imageUrl: {stats['imageUrl_added']}
  - Added internetSku: {stats['internetSku_added']}
  - Added brand/model to Notes: {stats['brand_model_added']}
  - Added item name: {stats['name_added']}
- Inserted (new SKU+contributor): {stats['inserted']} rows

OUTPUT:
- Final CSV: {output_path} ({final_row_count} rows)
- Unique (SKU + contributor_id) pairs: {final_row_count} [OK]
- Duplicates found: 0 [OK]

VALIDATION:
- All SKUs valid (6 or 10 digits): [OK]
- No duplicate (SKU + contributor_id): [OK]
"""

    with open(audit_path, 'w', encoding='utf-8') as f:
        f.write(audit_content)

    print(audit_content)


def main():
    parser = argparse.ArgumentParser(
        description='Merge verified pennies backup into consolidated CSV'
    )
    parser.add_argument(
        '--verified-backup',
        required=True,
        help='Path to verified-pennies.backup.json'
    )
    parser.add_argument(
        '--current-csv',
        required=True,
        help='Path to current consolidated-import.csv'
    )
    parser.add_argument(
        '--output',
        required=True,
        help='Path to output merged CSV'
    )
    parser.add_argument(
        '--audit',
        default=None,
        help='Path to audit log file (optional)'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Preview changes without writing output'
    )
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Detailed logging'
    )

    args = parser.parse_args()

    print("Loading verified backup...")
    verified_items = load_verified_backup(args.verified_backup)
    print(f"  Loaded {len(verified_items)} verified items")

    print("\nLoading current CSV...")
    current_rows = load_current_csv(args.current_csv)
    print(f"  Loaded {len(current_rows)} current rows")

    print("\nBuilding current index with deduplication...")
    current_index = build_current_index(current_rows)
    print(f"  Indexed {len(current_index)} unique (SKU + contributor_id) pairs")

    print("\nMerging verified items...")
    current_index, stats = merge_verified_items(
        current_index,
        verified_items,
        verbose=args.verbose
    )

    print(f"\n  Upserted (enriched): {stats['upserted']} rows")
    print(f"  Inserted (new): {stats['inserted']} rows")

    print("\nValidating output...")
    final_rows = list(current_index.values())

    if not validate_output(final_rows):
        print("\n[X] Validation failed. Aborting.")
        return 1

    print(f"  [OK] Validation passed ({len(final_rows)} rows)")

    if args.dry_run:
        print("\n[DRY RUN] No files written")
        print("\nPreview of first 5 upserted rows:")
        # Show preview logic here if needed
        print("\nPreview of first 5 inserted rows:")
        # Show preview logic here if needed
        return 0

    print(f"\nWriting output CSV: {args.output}")
    write_output_csv(args.output, final_rows)
    print("  [OK] Output CSV written")

    if args.audit:
        print(f"\nGenerating audit log: {args.audit}")
        write_audit_log(
            args.audit,
            args.current_csv,
            args.verified_backup,
            args.output,
            len(current_rows),
            len(verified_items),
            len(final_rows),
            stats
        )
        print("  [OK] Audit log written")

    print("\n[DONE] Merge complete!")
    return 0


if __name__ == '__main__':
    exit(main())
