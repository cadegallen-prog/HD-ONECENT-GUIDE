# Store Scraper v1 (Archived)

This folder contains the original Home Depot store scraping experiments:

- `Claude_HD_Scraper_V1/` – early store detail scraper
- `HD_PLACES_GOOGLE_API/` – scripts that pulled Places data for stores
- `MIRACLE_SCRAPER/` – mixed store locator / product experiments
- `ddg_hd.html`, `hd_store_sample*.html`, `hd-launcher.html` – helper HTML used to open many store URLs in a browser

These are kept for historical reference only. The **current source of truth** for store data is:

- `data/stores/store_directory.master.json`
- `data/stores/store_directory.master.csv`

The live app reads from the static store directory instead of calling Google Places or scraping Home Depot at runtime.
