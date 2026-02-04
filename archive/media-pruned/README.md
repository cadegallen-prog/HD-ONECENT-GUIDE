# Pruned Media Archive

Archive-first storage for large, non-production media assets removed from the active repo surface area.

## Policy

- This folder is **cold storage**: do not use by default in day-to-day work.
- Keep restore explicit and intentional.
- Prefer keeping production assets in `public/` and code/docs in their canonical locations.

## Restore

Restore by moving files back to their original paths.

Example:

- `git mv archive/media-pruned/2026-02-04-pass1/PICTURES_PENNY_CENTRAL PICTURES_PENNY_CENTRAL`
