"""
Extracted scraper core: Minimal portable unit for penny-items data collection.

This module contains ONLY the data-harvest logic from the original scraper.
No UI, no dashboard, no email—just: API calls → parse → normalize → return JSON.

Input: Configuration dict (cookie, guild_id, zip_codes, etc.)
Output: {ok: bool, data: List[dict], error?: str, stage?: str}
"""

import json
import os
import time
from datetime import datetime
from typing import Any, Dict, List, Optional

import pandas as pd
import requests


class PennyScraperCore:
    """Minimal scraper for penny-items API with normalize-on-parse."""

    def __init__(
        self,
        raw_cookie: str,
        guild_id: str,
        zip_codes: Optional[List[str]] = None,
        api_url: str = "https://pro.scouterdev.io/api/penny-items",
        timeout_sec: int = 15,
        rate_limit_sec: float = 1.2,
    ):
        """
        Initialize scraper with required credentials.

        Args:
            raw_cookie: Raw cookie string (from PENNY_RAW_COOKIE env)
            guild_id: Guild ID (from PENNY_GUILD_ID env)
            zip_codes: List of zip codes to scan. If None, uses default GA zips.
            api_url: API endpoint (defaults to pro.scouterdev.io)
            timeout_sec: Request timeout in seconds
            rate_limit_sec: Sleep between requests in seconds
        """
        self.raw_cookie = raw_cookie
        self.guild_id = guild_id
        self.api_url = api_url
        self.timeout_sec = timeout_sec
        self.rate_limit_sec = rate_limit_sec

        # Default Georgia zip codes (same as original)
        self.zip_codes = zip_codes or [
            "30121",
            "30161",
            "30720",
            "30114",
            "30144",
            "30075",
            "30062",
            "30030",
            "30331",
            "30134",
            "30117",
            "30501",
        ]

        self.session: Optional[requests.Session] = None
        self.all_data: List[Dict[str, Any]] = []
        self.zip_results: List[Dict[str, Any]] = []

    def _setup_session(self) -> None:
        """Create and configure session with auth headers."""
        self.session = requests.Session()
        self.session.headers.update(
            {
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json,text/plain,*/*",
                "X-Guild-Id": self.guild_id,
                "Cookie": self.raw_cookie,
            }
        )

    def _peek_text(self, response: requests.Response, limit: int = 220) -> str:
        """Return a small, safe-to-log snippet of the response body."""
        try:
            raw = response.content[:limit]
            return raw.decode("utf-8", errors="replace").replace("\n", " ").replace("\r", " ").strip()
        except Exception:
            return ""

    def _fetch_zip_code(self, zip_code: str) -> int:
        """
        Fetch one zip code from API and append to all_data.

        Args:
            zip_code: The zip code string to fetch

        Returns:
            Number of items fetched for this zip code, or 0 on error
        """
        if not self.session:
            raise RuntimeError("Session not initialized. Call _setup_session() first.")

        started = time.time()
        zip_result: Dict[str, Any] = {
            "zip_code": zip_code,
            "count": 0,
            "status_code": None,
            "content_type": None,
            "looks_like_html": None,
            "was_redirected": None,
            "error": None,
        }

        try:
            r = self.session.get(
                self.api_url,
                params={
                    "zip_code": zip_code,
                    "guildId": self.guild_id,
                    "experimental": "true",
                    "include_out_of_stock": "false",
                },
                timeout=self.timeout_sec,
            )

            zip_result["status_code"] = r.status_code
            zip_result["content_type"] = r.headers.get("content-type")
            zip_result["was_redirected"] = bool(r.history)

            snippet = self._peek_text(r)
            snippet_lower = snippet.lstrip().lower()
            zip_result["looks_like_html"] = (
                ("text/html" in (zip_result["content_type"] or "").lower())
                or snippet_lower.startswith("<!doctype")
                or snippet_lower.startswith("<html")
            )

            if r.status_code == 200:
                try:
                    data = r.json()
                except (ValueError, json.JSONDecodeError):
                    zip_result["error"] = "json_decode_error"
                    # Save a short snippet to help detect HTML/login pages. Never includes secrets.
                    zip_result["response_snippet"] = snippet
                    return 0

                # Ensure it's a list
                if not isinstance(data, list):
                    data = [data] if data else []

                self.all_data.extend(data)
                zip_result["count"] = len(data)
                return len(data)
            else:
                zip_result["error"] = f"http_{r.status_code}"
                zip_result["response_snippet"] = snippet if zip_result["looks_like_html"] else ""
                # Non-200 response; return 0 but don't crash
                return 0

        except requests.RequestException as e:
            # Timeout, connection error, etc.; return 0 but don't crash
            zip_result["error"] = f"request_exception:{type(e).__name__}"
            return 0
        finally:
            zip_result["elapsed_ms"] = int((time.time() - started) * 1000)
            self.zip_results.append(zip_result)

    def _normalize_frame(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Normalize and enrich raw DataFrame (field detection, formatting, etc.).

        This is a direct copy of the original normalize_scan_df logic.

        Args:
            df: Raw DataFrame from API

        Returns:
            Normalized DataFrame with enriched columns
        """
        # --- STOCK FIELD DETECTION ---
        stock_col = next(
            (
                c
                for c in ["stock", "total_stock", "on_hand", "quantity"]
                if c in df.columns
            ),
            None,
        )
        if stock_col:
            df["display_stock"] = (
                pd.to_numeric(df[stock_col], errors="coerce").fillna(0).astype(int)
            )
        else:
            df["display_stock"] = "Check App"

        # --- DATE FIELD DETECTION ---
        date_col = next(
            (
                c
                for c in ["dropped_at", "date_pennied", "updated_at"]
                if c in df.columns
            ),
            None,
        )
        if date_col:
            df["penny_date"] = pd.to_datetime(df[date_col], errors="coerce")
            df["days_old"] = df["penny_date"].apply(
                lambda d: int((datetime.now() - d).days) if pd.notna(d) else 999
            )
        else:
            df["penny_date"] = pd.NaT
            df["days_old"] = 999

        # --- FLEXIBLE FIELD MAPPING ---
        _sku_col = next(
            (c for c in ["store_sku", "sku", "sku_number"] if c in df.columns),
            "store_sku",
        )
        _upc_col = next(
            (c for c in ["upc", "barcode", "gtin"] if c in df.columns), None
        )
        _price_col = next(
            (
                c
                for c in ["price", "current_price", "offer_price", "price_cents"]
                if c in df.columns
            ),
            None,
        )
        _retail_col = next(
            (c for c in ["retail_price", "list_price", "msrp"] if c in df.columns),
            None,
        )
        _img_col = next(
            (
                c
                for c in ["image_link", "image", "image_url", "thumbnail"]
                if c in df.columns
            ),
            None,
        )
        _loc_col = next(
            (
                c
                for c in ["location", "aisle", "location_description"]
                if c in df.columns
            ),
            None,
        )

        df["store_sku"] = df.get(_sku_col, df.get("store_sku", "N/A"))
        df["upc"] = (
            df[_upc_col]
            if _upc_col and _upc_col in df.columns
            else df.get("upc", "N/A")
        )

        # --- PRICE FORMATTING HELPERS ---
        def _format_price(v):
            if pd.isna(v):
                return "N/A"
            try:
                v = float(v)
                if v > 1000:  # Assume cents
                    return f"${v/100:.2f}"
                return f"${v:.2f}"
            except (ValueError, TypeError):
                return str(v)

        def _detect_price_row(row):
            for c in ["price", "current_price", "offer_price", "price_cents"]:
                if c in row and pd.notna(row[c]):
                    v = row[c]
                    if c == "price_cents":
                        try:
                            return f"${float(v)/100:.2f}"
                        except Exception:
                            return "N/A"
                    try:
                        return f"${float(v):.2f}"
                    except Exception:
                        return str(v)
            return "N/A"

        df["price"] = df.apply(_detect_price_row, axis=1)
        df["retail_price"] = (
            df[_retail_col].apply(_format_price)
            if _retail_col and _retail_col in df.columns
            else df.get("retail_price", "N/A")
        )
        df["image_link"] = (
            df[_img_col]
            if _img_col and _img_col in df.columns
            else df.get("image_link", "")
        )
        df["location"] = (
            df[_loc_col]
            if _loc_col and _loc_col in df.columns
            else df.get("location", "Check Aisle")
        )

        # --- RAW FIELD NAMES (FOR DEBUGGING) ---
        def _raw_stock_field(row):
            for c in ["stock", "total_stock", "on_hand", "quantity"]:
                if c in row and pd.notna(row[c]):
                    return c
            return ""

        df["raw_stock_field"] = df.apply(_raw_stock_field, axis=1)
        df["raw_date_field"] = date_col if date_col else ""

        return df

    def run(self) -> Dict[str, Any]:
        """
        Execute the scrape: fetch, normalize, deduplicate, return as structured data.

        Returns:
            {
                "ok": bool,
                "data": List[dict],  # Normalized rows (if ok=True)
                "error": str,        # Error message (if ok=False)
                "stage": str,        # Where it failed (if ok=False)
                "raw_count": int,    # Total items before dedup
                "final_count": int,  # Total items after dedup
            }
        """
        try:
            self.zip_results = []
            # Setup session
            self._setup_session()

            # Fetch all zip codes
            total_fetched = 0
            for zip_code in self.zip_codes:
                count = self._fetch_zip_code(zip_code)
                total_fetched += count
                time.sleep(self.rate_limit_sec)

            # Check if we got any data
            if not self.all_data:
                status_codes = [r.get("status_code") for r in self.zip_results if r.get("status_code") is not None]
                looks_like_html = any(r.get("looks_like_html") for r in self.zip_results)
                has_auth_error = any(code in (401, 403) for code in status_codes)

                cloudflare_block = any(
                    isinstance(r.get("response_snippet"), str)
                    and (
                        "just a moment" in r["response_snippet"].lower()
                        or "cloudflare" in r["response_snippet"].lower()
                    )
                    for r in self.zip_results
                )

                if cloudflare_block:
                    hint = (
                        "Blocked by Cloudflare/bot protection (HTML challenge). "
                        "GitHub Actions IPs may be blocked; cookie refresh alone may not fix it."
                    )
                elif has_auth_error or looks_like_html:
                    hint = "Likely auth failure (cookie expired/invalid) — refresh PENNY_RAW_COOKIE and retry."
                elif status_codes:
                    hint = "API returned no usable data — check upstream availability and response format."
                else:
                    hint = "All requests failed (timeouts/network) — check upstream availability."

                return {
                    "ok": False,
                    "error": f"Empty API response. {hint}",
                    "stage": "fetch",
                    "raw_count": 0,
                    "final_count": 0,
                    "cloudflare_block": cloudflare_block,
                    "zip_results": self.zip_results,
                }

            # Convert to DataFrame and deduplicate
            df = pd.DataFrame(self.all_data)
            raw_count = len(df)

            # Dedup by store_sku and store_name
            if "store_sku" in df.columns and "store_name" in df.columns:
                df = df.drop_duplicates(subset=["store_sku", "store_name"])

            final_count = len(df)

            # Normalize
            df = self._normalize_frame(df)

            # Convert to list of dicts (structured data)
            result = df.to_dict(orient="records")

            return {
                "ok": True,
                "data": result,
                "raw_count": raw_count,
                "final_count": final_count,
                "cloudflare_block": False,
                "zip_results": self.zip_results,
            }

        except Exception as e:
            return {
                "ok": False,
                "error": str(e),
                "stage": "execution",
                "raw_count": len(self.all_data),
                "final_count": 0,
                "cloudflare_block": False,
                "zip_results": self.zip_results,
            }


def run_scrape(
    raw_cookie: str,
    guild_id: str,
    zip_codes: Optional[List[str]] = None,
    api_url: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Convenience function: single entry point for scraping.

    Args:
        raw_cookie: Cookie string (from env or secret store)
        guild_id: Guild ID (from env or secret store)
        zip_codes: Optional list of zip codes (defaults to GA zips)
        api_url: Optional override for the upstream API endpoint (defaults to pro.scouterdev.io)

    Returns:
        {
            "ok": bool,
            "data": List[dict],    # Parsed/normalized items (if ok=True)
            "error": str,          # Error message (if ok=False)
            "stage": str,          # Stage of failure (if ok=False)
        }
    """
    scraper = PennyScraperCore(
        raw_cookie=raw_cookie,
        guild_id=guild_id,
        zip_codes=zip_codes,
        api_url=api_url or "https://pro.scouterdev.io/api/penny-items",
    )
    return scraper.run()


# Backward compat: allow direct execution with env vars
if __name__ == "__main__":
    import sys

    # Try to load from env
    cookie = os.environ.get("PENNY_RAW_COOKIE")
    guild = os.environ.get("PENNY_GUILD_ID")

    if not cookie or not guild:
        print("⚠️ Missing PENNY_RAW_COOKIE or PENNY_GUILD_ID env vars")
        print("   Set them and try again, or pass as arguments to run_scrape()")
        sys.exit(1)

    # Run
    result = run_scrape(raw_cookie=cookie, guild_id=guild)

    # Output as JSON
    print(json.dumps(result, indent=2, default=str))
