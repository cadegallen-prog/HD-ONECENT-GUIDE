#!/usr/bin/env python3
"""
Staging Warmer: Fills enrichment_staging from scraper_core large-net scrape.

This script:
1. Fetches current Penny List SKUs (to skip known items)
2. Runs scraper_core to fetch bulk penny item data
3. Deduplicates by SKU and internet_number
4. Upserts to enrichment_staging table
5. Logs detailed statistics

Runs Tue-Fri via GitHub Actions (.github/workflows/enrichment-staging-warmer.yml)

Environment variables:
- PENNY_RAW_COOKIE: Cookie string for pro.scouterdev.io API (required)
- PENNY_GUILD_ID: Guild ID for pro.scouterdev.io API (required)
- NEXT_PUBLIC_SUPABASE_URL: Supabase project URL (required)
- SUPABASE_SERVICE_ROLE_KEY: Supabase service role key (required)
- MAX_UNIQUES: Maximum unique items to process (default: 6000)
- BATCH_SIZE: Batch size for DB upserts (default: 50)
- PENNY_ZIP_CODES: Comma-separated zip codes to scrape (optional)
"""

import os
import re
import sys
import time
from typing import Any, Optional, Set

# Load environment variables from .env.local
try:
    from dotenv import load_dotenv

    load_dotenv(".env.local")
except ImportError:
    pass  # dotenv not required if env vars set externally

# Add extracted/ to path for scraper_core import
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "extracted"))

from scraper_core import run_scrape  # noqa: E402

try:
    from supabase import create_client
except ImportError:
    print("ERROR: supabase package not installed. Run: pip install supabase")
    sys.exit(1)


# Default Atlanta metro zip codes for large-net scraping
DEFAULT_ATLANTA_ZIPS = [
    "30301",  # Atlanta Downtown
    "30303",  # Atlanta
    "30305",  # Buckhead
    "30308",  # Midtown
    "30309",  # Midtown
    "30310",  # West End
    "30318",  # West Midtown
    "30324",  # Lindbergh
    "30327",  # Buckhead
    "30339",  # Vinings
]


def get_config() -> dict:
    """Load and validate configuration from environment variables."""
    config = {
        "cookie": os.environ.get("PENNY_RAW_COOKIE"),
        "guild": os.environ.get("PENNY_GUILD_ID"),
        "supabase_url": os.environ.get("NEXT_PUBLIC_SUPABASE_URL"),
        "supabase_key": os.environ.get("SUPABASE_SERVICE_ROLE_KEY"),
        "max_uniques": int(os.environ.get("MAX_UNIQUES", "6000")),
        "batch_size": int(os.environ.get("BATCH_SIZE", "50")),
        "zip_codes": None,
    }

    # Parse optional zip codes
    zip_env = os.environ.get("PENNY_ZIP_CODES", "")
    if zip_env.strip():
        config["zip_codes"] = [z.strip() for z in zip_env.split(",") if z.strip()]

    # Validate required config
    missing = []
    if not config["cookie"]:
        missing.append("PENNY_RAW_COOKIE")
    if not config["guild"]:
        missing.append("PENNY_GUILD_ID")
    if not config["supabase_url"]:
        missing.append("NEXT_PUBLIC_SUPABASE_URL")
    if not config["supabase_key"]:
        missing.append("SUPABASE_SERVICE_ROLE_KEY")

    if missing:
        print(f"ERROR: Missing required environment variables: {', '.join(missing)}")
        sys.exit(1)

    return config


def validate_sku(sku: str) -> bool:
    """Validate SKU format: 6-digit store SKU or 10-digit internet SKU (100/101 prefix)."""
    if not sku:
        return False
    # 6-digit store SKU
    if re.match(r"^\d{6}$", sku):
        return True
    # 10-digit internet SKU starting with 100 or 101
    if re.match(r"^10[01]\d{7}$", sku):
        return True
    return False


def parse_price(val: Any) -> Optional[float]:
    """Parse price from various formats (string, number, cents)."""
    if val is None:
        return None
    if isinstance(val, (int, float)):
        return float(val) if val > 0 else None
    if isinstance(val, str):
        # Remove $ and parse
        cleaned = val.replace("$", "").replace(",", "").strip()
        if cleaned and cleaned.lower() != "n/a":
            try:
                parsed = float(cleaned)
                return parsed if parsed > 0 else None
            except ValueError:
                return None
    return None


def extract_staging_row(item: dict) -> dict:
    """Extract staging fields from raw scrape item with field name flexibility."""
    # SKU: try multiple field names
    sku = str(
        item.get("store_sku")
        or item.get("storeSku")
        or item.get("sku")
        or item.get("sku_number")
        or ""
    ).strip()

    # Internet number: try multiple field names
    internet_raw = (
        item.get("internet_sku")
        or item.get("internetNumber")
        or item.get("internet_number")
    )
    internet_number = None
    if internet_raw:
        try:
            internet_number = int(internet_raw)
            if internet_number <= 0:
                internet_number = None
        except (ValueError, TypeError):
            internet_number = None

    # UPC/barcode
    barcode_upc = item.get("upc") or item.get("barcode") or item.get("gtin") or None
    if barcode_upc:
        barcode_upc = str(barcode_upc).strip() or None

    # Item name
    item_name = item.get("item_name") or item.get("name") or item.get("title") or None
    if item_name:
        item_name = str(item_name).strip() or None

    # Brand
    brand = item.get("brand")
    if brand:
        brand = str(brand).strip() or None

    # Retail price
    retail_price = parse_price(
        item.get("retail_price") or item.get("retailPrice") or item.get("list_price")
    )

    # Image URL
    image_url = (
        item.get("image_link")
        or item.get("image_url")
        or item.get("imageUrl")
        or item.get("image")
        or None
    )
    if image_url:
        image_url = str(image_url).strip() or None

    # Product link (Home Depot URL)
    product_link = (
        item.get("home_depot_url")
        or item.get("homeDepotUrl")
        or item.get("productUrl")
        or item.get("product_link")
        or item.get("product_url")
        or None
    )
    if product_link:
        product_link = str(product_link).strip() or None

    return {
        "sku": sku,
        "internet_number": internet_number,
        "barcode_upc": barcode_upc,
        "item_name": item_name,
        "brand": brand,
        "retail_price": retail_price,
        "image_url": image_url,
        "product_link": product_link,
    }


def prune_stale_staging(supabase, retention_days: int = 60):
    """Delete staging rows older than retention period."""
    from datetime import datetime, timedelta

    cutoff = (datetime.utcnow() - timedelta(days=retention_days)).isoformat()

    try:
        result = (
            supabase.table("enrichment_staging")
            .delete()
            .lt("created_at", cutoff)
            .execute()
        )
        deleted_count = len(result.data) if result.data else 0
        if deleted_count > 0:
            print(
                f"Pruned {deleted_count} stale staging rows (> {retention_days} days old)"
            )
        return deleted_count
    except Exception as e:
        print(f"WARNING: Failed to prune staging: {e}")
        return 0


def get_existing_skus(supabase) -> Set[str]:
    """Fetch all existing SKUs from Penny List to skip during upsert."""
    existing_skus: Set[str] = set()

    try:
        # Fetch all SKUs (paginated if large)
        result = (
            supabase.table("Penny List")
            .select("home_depot_sku_6_or_10_digits")
            .execute()
        )

        for row in result.data or []:
            sku = row.get("home_depot_sku_6_or_10_digits")
            if sku:
                existing_skus.add(str(sku).strip())

    except Exception as e:
        print(f"WARNING: Failed to fetch existing SKUs: {e}")
        # Continue anyway - we'll just upsert more rows than needed

    return existing_skus


def main():
    print("=" * 60)
    print("ENRICHMENT STAGING WARMER")
    print("=" * 60)

    # Load config
    config = get_config()
    print(
        f"Config: max_uniques={config['max_uniques']}, batch_size={config['batch_size']}"
    )

    # Initialize Supabase client
    supabase = create_client(config["supabase_url"], config["supabase_key"])
    print("Connected to Supabase")

    # Prune stale staging rows before adding new ones
    print("\nPruning stale staging rows...")
    prune_stale_staging(supabase, retention_days=60)

    # Get existing SKUs in Penny List (to skip)
    print("\nFetching existing SKUs from Penny List...")
    existing_skus = get_existing_skus(supabase)
    print(f"Found {len(existing_skus)} existing SKUs in Penny List")

    # Determine zip codes
    zip_codes = config["zip_codes"] or DEFAULT_ATLANTA_ZIPS
    print(f"Using {len(zip_codes)} zip codes: {', '.join(zip_codes[:5])}...")

    # Run scraper
    print("\nRunning scraper_core...")
    scrape_result = run_scrape(
        raw_cookie=config["cookie"],
        guild_id=config["guild"],
        zip_codes=zip_codes,
    )

    if not scrape_result.get("ok"):
        stage = scrape_result.get("stage", "unknown")
        error = scrape_result.get("error", "Unknown error")

        # GitHub Actions annotation (does not include secrets)
        print(f"::error title=Staging warmer scrape failed ({stage})::{error}")
        print(f"ERROR: Scrape failed at stage '{stage}'")
        print(f"  Error: {error}")

        zip_results = scrape_result.get("zip_results") or []
        if zip_results:
            print("\nFetch diagnostics (per zip):")
            for r in zip_results:
                zip_code = r.get("zip_code", "?")
                status = r.get("status_code")
                count = r.get("count")
                content_type = r.get("content_type")
                looks_like_html = r.get("looks_like_html")
                was_redirected = r.get("was_redirected")
                err = r.get("error")
                elapsed_ms = r.get("elapsed_ms")

                print(
                    "  FETCH_DIAGNOSTICS "
                    + f"zip={zip_code} status={status} count={count} "
                    + f"content_type={content_type} looks_like_html={looks_like_html} "
                    + f"redirected={was_redirected} error={err} elapsed_ms={elapsed_ms}"
                )

                snippet = r.get("response_snippet")
                if isinstance(snippet, str) and snippet.strip():
                    safe_snippet = snippet.strip()[:200]
                    print(f"    snippet: {safe_snippet}")

        sys.exit(1)

    items = scrape_result.get("data", [])
    raw_count = scrape_result.get("raw_count", len(items))
    final_count = scrape_result.get("final_count", len(items))
    print(
        f"Scraper returned {len(items)} items (raw: {raw_count}, deduped: {final_count})"
    )

    # Initialize stats
    stats = {
        "fetched_total": len(items),
        "valid_total": 0,
        "deduped_uniques": 0,
        "skipped_invalid_key": 0,
        "skipped_already_in_penny_list": 0,
        "upserted_to_staging": 0,
        "error_count": 0,
    }

    # Dedup by SKU, then internet_number
    seen_skus: Set[str] = set()
    seen_internet: Set[int] = set()
    unique_items: list[dict] = []

    print("\nProcessing and deduplicating items...")
    for item in items:
        row = extract_staging_row(item)
        sku = row["sku"]
        internet = row["internet_number"]

        # Validate SKU format
        if not validate_sku(sku):
            stats["skipped_invalid_key"] += 1
            continue

        stats["valid_total"] += 1

        # Skip if already in Penny List
        if sku in existing_skus:
            stats["skipped_already_in_penny_list"] += 1
            continue

        # Dedup by SKU
        if sku in seen_skus:
            continue

        # Dedup by internet_number (if present)
        if internet and internet in seen_internet:
            continue

        seen_skus.add(sku)
        if internet:
            seen_internet.add(internet)

        unique_items.append(row)

        if len(unique_items) >= config["max_uniques"]:
            print(f"Reached max_uniques limit ({config['max_uniques']})")
            break

    stats["deduped_uniques"] = len(unique_items)
    print(f"Deduped to {len(unique_items)} unique items")

    if not unique_items:
        print("\nNo new items to upsert. Exiting.")
        print_stats(stats)
        return

    # Batch upsert to staging
    print(
        f"\nUpserting {len(unique_items)} items in batches of {config['batch_size']}..."
    )
    batch_size = config["batch_size"]

    for i in range(0, len(unique_items), batch_size):
        batch = unique_items[i : i + batch_size]
        batch_num = (i // batch_size) + 1
        total_batches = (len(unique_items) + batch_size - 1) // batch_size

        try:
            supabase.table("enrichment_staging").upsert(
                batch, on_conflict="sku"
            ).execute()
            stats["upserted_to_staging"] += len(batch)

            if batch_num % 10 == 0 or batch_num == total_batches:
                print(
                    f"  Batch {batch_num}/{total_batches}: {stats['upserted_to_staging']} upserted"
                )

        except Exception as e:
            print(f"  ERROR in batch {batch_num}: {e}")
            stats["error_count"] += len(batch)

        # Rate limit between batches
        time.sleep(0.1)

    print_stats(stats)


def print_stats(stats: dict):
    """Print final statistics."""
    print("\n" + "=" * 60)
    print("STAGING WARMER COMPLETE")
    print("=" * 60)
    for key, value in stats.items():
        print(f"  {key}: {value}")
    print("=" * 60)

    # Exit with error code if too many errors
    if stats["error_count"] > stats["upserted_to_staging"] * 0.1:
        print("WARNING: High error rate detected")
        sys.exit(1)


if __name__ == "__main__":
    main()
