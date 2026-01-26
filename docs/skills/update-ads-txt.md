# Skill: Update ads.txt safely

**When to use:** You need to refresh `public/ads.txt` with partner-provided lines without breaking existing custom records (e.g., Ezoic) or compliance requirements.

## Steps

1. **Locate the source file**
   - `public/ads.txt` is the live file served at `https://www.pennycentral.com/ads.txt`.

2. **Replace with partner-provided content**
   - Overwrite the file with the latest ads.txt payload from the partner (e.g., Monumetric).
   - Preserve any required metadata headers (e.g., `MANAGERDOMAIN`, `CONTACT`).

3. **Keep custom records below the marker**
   - If the partner includes a marker like `# ALL CUSTOM RECORDS MUST BE BELOW THIS LINE`, keep it.
   - Append custom entries (e.g., Ezoic block) **below** that marker so partner compliance remains intact.

4. **Avoid touching Grow/Journey scripts**
   - ads.txt is separate from the Grow (Mediavine Journey) script; no script changes are needed.

5. **Verify locally**
   - Run the required quality gates (`npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e`).
   - Optionally, confirm the file contents by opening `public/ads.txt` or via `curl` once deployed.

## Notes

- Do not delete custom blocks unless explicitly approved by Cade.
- Keep whitespace and comments as provided by the ad partner unless they conflict with the custom-records marker.
