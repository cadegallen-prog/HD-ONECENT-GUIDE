# Research: Next.js App Router Best Practices for Large Data Lists

## Source Metadata

| Field    | Value                                                  |
| -------- | ------------------------------------------------------ |
| Type     | Docs Research                                          |
| Title    | Next.js App Router Best Practices for Large Data Lists |
| Source   | Next.js Documentation (/vercel/next.js)                |
| Date     | N/A                                                    |
| Analyzed | 2026-03-04                                             |

## Executive Summary

This research analyzes Next.js App Router best practices for managing large, filterable data lists like PennyCentral's penny list. The key finding is that PennyCentral's current implementation follows many best practices but has opportunities to improve caching granularity, implement streaming responses, and add optimistic UI updates. The most actionable recommendation is to implement tagged caching with `unstable_cache` for more efficient cache invalidation when new penny items are added.

## Key Concepts

### 1. Server-Side Rendering with Server Components

**What it is:** Server Components in Next.js App Router allow data fetching on the server before rendering, providing fast initial page loads and reducing client-side JavaScript.

**Relevance to PennyCentral:** The current implementation already uses Server Components effectively in [`app/penny-list/page.tsx`](app/penny-list/page.tsx:69), but could benefit from Partial Prerendering (PPR) for better performance.

**Current state:** Using Server Components with a 5-minute revalidate time, which is appropriate for the penny list's update frequency.

**Relevant files:**

- [`app/penny-list/page.tsx`](app/penny-list/page.tsx:40) - Already using `export const revalidate = 300`
- [`lib/fetch-penny-data.ts`](lib/fetch-penny-data.ts:1) - Server-only data fetching logic

**Recommendation:** Implement Partial Prerendering (PPR) to serve a static shell with dynamic content streaming in.

| Priority | Effort | Risk   |
| -------- | ------ | ------ |
| P2       | M      | Medium |

---

### 2. Advanced Caching Patterns with Tags

**What it is:** Next.js provides `unstable_cache` for caching database queries with tags, allowing targeted cache invalidation instead of time-based revalidation.

**Relevance to PennyCentral:** Currently using simple time-based revalidation, but tagged caching would allow immediate cache updates when new penny items are reported.

**Current state:** Basic revalidate at page level (5 minutes) in [`app/penny-list/page.tsx`](app/penny-list/page.tsx:40).

**Relevant files:**

- [`lib/fetch-penny-data.ts`](lib/fetch-penny-data.ts:4) - Already imports `unstable_cache` but not using it
- [`app/api/penny-list/route.ts`](app/api/penny-list/route.ts:13) - API route with basic caching

**Recommendation:** Implement tagged caching for penny list data using `unstable_cache` with tags like 'penny-list', 'penny-items', and state-specific tags.

| Priority | Effort | Risk |
| -------- | ------ | ---- |
| P0       | M      | Low  |

---

### 3. Pagination vs Infinite Scrolling

**What it is:** Pagination divides large datasets into discrete pages, while infinite scroll continuously loads content as users scroll.

**Relevance to PennyCentral:** Current implementation uses pagination with URL parameters, which is optimal for SEO and user experience.

**Current state:** Traditional pagination implemented in [`components/penny-list-client.tsx`](components/penny-list-client.tsx:1) with URL state management.

**Relevant files:**

- [`app/penny-list/page.tsx`](app/penny-list/page.tsx:95) - Parses pagination params
- [`components/penny-list-client.tsx`](components/penny-list-client.tsx:45) - Client-side pagination logic

**Recommendation:** Stick with current pagination approach for SEO benefits and bookmarkability. Consider adding a "Load More" button as a hybrid approach.

| Priority | Effort | Risk |
| -------- | ------ | ---- |
| P3       | S      | Low  |

---

### 4. Streaming Responses with Suspense

**What it is:** React Suspense boundaries allow components to stream in as data becomes available, improving perceived performance.

**Relevance to PennyCentral:** Large penny list datasets could benefit from streaming to show UI faster while data loads.

**Current state:** No Suspense boundaries implemented for the penny list.

**Relevant files:**

- [`app/penny-list/page.tsx`](app/penny-list/page.tsx:69) - Main page component
- [`components/penny-list-client.tsx`](components/penny-list-client.tsx:1) - Client component that could be wrapped

**Recommendation:** Wrap the penny list in a Suspense boundary with a loading skeleton to improve perceived performance.

| Priority | Effort | Risk |
| -------- | ------ | ---- |
| P1       | M      | Low  |

---

### 5. Optimistic UI Updates with Server Actions

**What it is:** Server Actions in Next.js allow optimistic UI updates where the UI immediately reflects changes while the server processes mutations in the background.

**Relevance to PennyCentral:** When users report new penny finds, the UI could immediately show the new item without waiting for server confirmation.

**Current state:** Not implemented - current implementation requires full page refresh or manual reload to see new items.

**Relevant files:**

- [`app/penny-list/page.tsx`](app/penny-list/page.tsx:69) - Could add Server Actions for cache invalidation
- [`lib/fetch-penny-data.ts`](lib/fetch-penny-data.ts:1) - Would need `revalidateTag` integration

**Recommendation:** Implement Server Actions with `revalidateTag` for immediate cache updates when new items are submitted.

| Priority | Effort | Risk   |
| -------- | ------ | ------ |
| P1       | L      | Medium |

---

### 6. Route Handler Optimization

**What it is:** Route Handlers in App Router can implement streaming responses and better caching strategies for API endpoints.

**Relevance to PennyCentral:** The existing API route could be optimized for better performance and caching.

**Current state:** Basic API route with simple caching in [`app/api/penny-list/route.ts`](app/api/penny-list/route.ts:1).

**Relevant files:**

- [`app/api/penny-list/route.ts`](app/api/penny-list/route.ts:13) - Current implementation with 5-minute cache

**Recommendation:** Add streaming support and implement tagged caching in the API route for better performance.

| Priority | Effort | Risk |
| -------- | ------ | ---- |
| P2       | M      | Low  |

---

### 7. SEO Optimization for Paginated Content

**What it is:** Dynamic metadata generation and proper pagination links improve SEO for large data lists.

**Relevance to PennyCentral:** Current metadata is static but could be enhanced based on filters and pagination.

**Current state:** Basic metadata in [`app/penny-list/page.tsx`](app/penny-list/page.tsx:12).

**Relevant files:**

- [`app/penny-list/page.tsx`](app/penny-list/page.tsx:12) - Static metadata object

**Recommendation:** Implement dynamic metadata generation based on current filters, page number, and item count.

| Priority | Effort | Risk |
| -------- | ------ | ---- |
| P2       | M      | Low  |

---

## Concepts Not Applicable

- **Static Site Generation (SSG)** - Not applicable because penny list data changes frequently
- **Client-side data fetching only** - Would hurt SEO and initial load performance
- **Full page reloads for filtering** - Poor UX, already handled client-side
- **WebSocket for real-time updates** - Overkill for penny list update frequency

## Implementation Sequence

1. **First**: Implement tagged caching with `unstable_cache` in [`lib/fetch-penny-data.ts`](lib/fetch-penny-data.ts:4) because it provides the foundation for other optimizations
2. **Then**: Add Suspense boundaries in [`app/penny-list/page.tsx`](app/penny-list/page.tsx:69) for immediate performance gains
3. **Next**: Implement Server Actions for optimistic updates when users submit new finds
4. **Finally**: Enhance SEO with dynamic metadata generation

## Connections to Existing Plans

- Overlaps with caching strategies in `.ai/BACKLOG.md` performance optimization items
- No conflicts with existing implementation patterns
- Aligns with the goal of improving user experience for penny list browsing

## Raw Notes

- Next.js 15 changed searchParams to promises - current implementation handles this correctly
- `unstable_cache` is stable enough for production use despite the name
- Partial Prerendering (PPR) is experimental but promising for this use case
- Server Actions require careful security considerations for user submissions
- Tag-based caching requires careful tag design to avoid cache stampede issues
