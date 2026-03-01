These components were identified as unused during the 2026‑03‑01 cleanup audit.
They had no import references anywhere in the TypeScript/JSX codebase and were safely moved
here instead of being deleted outright. They can be permanently removed once we confirm
that nobody needs them.

Fallout:

- share-button.tsx (not imported anywhere)
- clearance-lifecycle-chart.tsx
- store-comparison-table.tsx
- table-of-contents.tsx (duplicate of guide/table-of-contents)
- theme-toggle.tsx (no longer used)
- trackable-next-link.tsx (not referenced)
- ui/skeleton.tsx (not referenced)

If any of these are required again, simply restore from Git history or this archive folder.
