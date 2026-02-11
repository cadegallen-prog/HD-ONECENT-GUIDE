# Ads.txt updates (append/remove blocks)

**When to use:** Adding or removing ad network entries in `public/ads.txt`.

## Steps

1. Open `public/ads.txt` and **do not modify existing lines** (especially AdSense lines).
2. Append new network entries **below the custom records section** (after `# ALL CUSTOM RECORDS MUST BE BELOW THIS LINE`).
3. Wrap the new entries in clear comment markers so they can be removed later:
   - `# --- START <NETWORK> ---`
   - `# --- END <NETWORK> ---`
4. Keep **one entry per line** and **no blank lines between entries** inside the block.
5. For removal, delete the entire block between the START/END markers only.

## Notes

- Keep formatting exactly as provided by the network (domain, seller ID, DIRECT/RESELLER, cert ID).
- Avoid reordering or de-duplicating unless explicitly instructed.
