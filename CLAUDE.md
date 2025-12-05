# Penny Central Development Guide

## Project Overview

PennyCentral.com is a Next.js 15 app serving the Home Depot penny hunting community.
It's the official resource for a 37,000-member Facebook group.

## Tech Stack

- Next.js 15 with App Router
- TypeScript (strict mode)
- Tailwind CSS with custom design tokens
- React-Leaflet for store finder map
- Deployed on [Vercel/wherever]

## Architecture Rules

### NEVER do these things:

- Don't modify globals.css without explicit approval
- Don't add new dependencies without documenting why
- Don't change the map component (store-map.tsx) without testing all 51 store pins
- Don't remove "use client" directives without understanding why they're there

### ALWAYS do these things:

- Run `npm run build` before considering any task complete
- Run `npm run lint` and fix all errors
- When fixing a bug, explain what caused it before implementing the fix
- When adding features, describe the approach first and wait for approval

## File Structure

/app - Next.js app router pages
/components - Reusable React components  
/lib - Utility functions and data
/public - Static assets

## Known Fragile Areas

- React-Leaflet hydration (must use dynamic imports with ssr: false)
- [Add other areas you've had repeated issues with]

## Current Priorities

1. User retention anchors (daily/weekly return reasons)
2. Stability over new features
3. Mobile experience

## What NOT to Work On

- Automation/scraping systems (separate repo)
- Facebook group management
- Anything requiring new API integrations without discussion
