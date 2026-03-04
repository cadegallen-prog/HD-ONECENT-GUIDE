# Research: Supabase Row Level Security Patterns for Community Features

## Source Metadata

| Field    | Value                                        |
| -------- | -------------------------------------------- |
| Type     | Docs                                         |
| Title    | Supabase RLS Patterns for Community Features |
| Source   | Supabase Documentation (/supabase/supabase)  |
| Date     | N/A                                          |
| Analyzed | 2026-03-04                                   |

## Executive Summary

This research analyzes Supabase Row Level Security (RLS) patterns for implementing community features in PennyCentral, including user-generated penny lists with sharing permissions, comment systems, user profiles with privacy controls, and social features like follow relationships. The key finding is that Supabase provides robust RLS capabilities that can secure multi-tenant data while maintaining performance through proper policy design and indexing strategies.

## Key Concepts

### 1. User-Specific Data Access with RLS

**What it is:** Row Level Security (RLS) is a PostgreSQL feature that allows fine-grained access control at the row level based on user identity and roles. It uses policies to determine which rows each user can see or modify.

**Relevance to PennyCentral:** Essential for ensuring users can only access their own penny lists, profiles, and private data while allowing controlled sharing with others.

**Current state:** PennyCentral has basic RLS implemented for the `lists` table with user isolation, and the `penny_list` table allows anonymous inserts but blocks updates/deletes.

**Relevant files:**

- [`supabase/migrations/001_create_lists_tables.sql`](supabase/migrations/001_create_lists_tables.sql:24-52) — Shows current RLS implementation for user lists
- [`supabase/migrations/008_apply_penny_list_rls.sql`](supabase/migrations/008_apply_penny_list_rls.sql:40-87) — Shows RLS for penny list submissions
- [`lib/supabase/lists.ts`](lib/supabase/lists.ts:36-50) — Client-side list management functions

**Recommendation:** Extend the existing RLS patterns to support community features while maintaining the current user isolation model.

| Priority | Effort | Risk |
| -------- | ------ | ---- |
| P0       | M      | Low  |

---

### 2. Secure Sharing Mechanisms for Penny Lists

**What it is:** A secure sharing system that allows list owners to grant specific users access to their penny lists through token-based or permission-based access control.

**Relevance to PennyCentral:** Critical for community collaboration where users want to share their penny lists with specific people or make them publicly accessible.

**Current state:** PennyCentral has a `list_shares` table with basic sharing functionality using share tokens, but it lacks granular permissions and user-specific sharing.

**Relevant files:**

- [`supabase/migrations/002_create_list_shares.sql`](supabase/migrations/002_create_list_shares.sql:9-50) — Current sharing implementation with token-based access
- [`lib/supabase/lists.ts`](lib/supabase/lists.ts:36-50) — List management functions that need sharing extensions

**Recommendation:** Enhance the sharing system to support:

1. User-specific sharing (not just token-based)
2. Permission levels (view, edit, comment)
3. Public/private list visibility
4. Sharing expiration dates

| Priority | Effort | Risk   |
| -------- | ------ | ------ |
| P1       | M      | Medium |

---

### 3. Comment and Reaction Systems with Proper Permissions

**What it is:** A commenting system that allows users to discuss penny items and lists, with permissions that control who can view, create, and moderate comments based on list ownership and sharing permissions.

**Relevance to PennyCentral:** Essential for community engagement, allowing users to share insights about penny items, store availability, and hunting tips.

**Current state:** No comment system exists in the current implementation.

**Relevant files:**

- New tables needed: `comments`, `reactions`, `comment_threads`
- RLS policies needed for comment visibility based on list access

**Recommendation:** Implement a comment system with these RLS policies:

1. Users can only comment on lists they have access to
2. List owners can moderate comments on their lists
3. Comments inherit the visibility of their parent list
4. Reactions (likes, helpful) are tied to comment permissions

| Priority | Effort | Risk   |
| -------- | ------ | ------ |
| P1       | L      | Medium |

---

### 4. User Profile Management with Privacy Controls

**What it is:** User profile system with configurable privacy settings that control what information is visible to different user groups (public, authenticated users, followed users).

**Relevance to PennyCentral:** Important for building community identity while allowing users to control their privacy.

**Current state:** No user profile system exists beyond basic authentication.

**Relevant files:**

- [`components/auth-provider.tsx`](components/auth-provider.tsx:4-14) — Current auth implementation using email OTP
- [`app/login/page.tsx`](app/login/page.tsx:11-19) — Login flow implementation

**Recommendation:** Create a profiles table with RLS policies for:

1. Public profiles viewable by everyone
2. Private fields only visible to profile owner
3. Selective privacy controls for different user attributes
4. Profile linking to user's public penny lists

| Priority | Effort | Risk |
| -------- | ------ | ---- |
| P1       | M      | Low  |

---

### 5. Performance Optimization for RLS Policies

**What it is:** Techniques to optimize RLS policy performance by avoiding expensive joins, using proper indexing, and structuring policies efficiently.

**Relevance to PennyCentral:** Critical as the community grows and RLS policies are evaluated on every query to shared data.

**Current state:** Current RLS policies are simple and performant, but will need optimization as complexity increases.

**Relevant files:**

- [`supabase/migrations/001_create_lists_tables.sql`](supabase/migrations/001_create_lists_tables.sql:21) — Shows proper indexing pattern
- All RLS policy files need performance review

**Recommendation:** Implement these performance optimizations:

1. Use `IN` clauses instead of joins in RLS policies
2. Wrap `auth.uid()` in `SELECT` to cache the result
3. Add indexes on all columns used in RLS filters
4. Consider materialized views for complex permission checks

| Priority | Effort | Risk |
| -------- | ------ | ---- |
| P2       | M      | Low  |

---

### 6. Multi-Tenant Data Isolation Patterns

**What it is:** Architectural patterns for ensuring data isolation between different user groups while allowing controlled sharing and collaboration.

**Relevance to PennyCentral:** Essential for maintaining data security as users share penny lists and collaborate while keeping private data secure.

**Current state:** Basic user isolation exists but lacks sophisticated multi-tenant patterns for shared resources.

**Relevant files:**

- [`supabase/migrations/001_create_lists_tables.sql`](supabase/migrations/001_create_lists_tables.sql:14) — Shows user reference pattern
- All RLS migration files need multi-tenant review

**Recommendation:** Implement these multi-tenant patterns:

1. Tenant-aware RLS policies using `auth.uid()` and relationship tables
2. Shared resource access through explicit permissions
3. Audit logging for data access across tenant boundaries
4. Data ownership transfer capabilities

| Priority | Effort | Risk   |
| -------- | ------ | ------ |
| P2       | L      | Medium |

---

### 7. Follow/Follower Relationships

**What it is:** Social networking feature where users can follow other users to see their public activity and penny lists.

**Relevance to PennyCentral:** Builds community engagement and allows users to discover active penny hunters and their findings.

**Current state:** No follow system exists.

**Relevant files:**

- New table needed: `user_follows` with follower/followed relationships
- RLS policies needed for follow visibility

**Recommendation:** Implement follow system with:

1. Asymmetric follow relationships (like Twitter)
2. Privacy controls for who can follow whom
3. Feed generation for followed users' public lists
4. Follow notifications

| Priority | Effort | Risk |
| -------- | ------ | ---- |
| P2       | M      | Low  |

---

### 8. Reputation or Karma Systems

**What it is:** System to track user contributions and reputation within the community based on helpful submissions, accurate information, and community engagement.

**Relevance to PennyCentral:** Encourages quality contributions and helps identify reliable sources of penny information.

**Current state:** No reputation system exists.

**Relevant files:**

- New tables needed: `user_reputation`, `reputation_events`
- RLS policies for reputation visibility

**Recommendation:** Implement reputation system with:

1. Points for quality submissions
2. Community voting on helpfulness
3. Reputation-based privileges
4. Anti-gaming mechanisms

| Priority | Effort | Risk   |
| -------- | ------ | ------ |
| P3       | L      | Medium |

## Concepts Not Applicable

- Complex JWT-based multi-tenancy — PennyCentral uses Supabase's built-in auth system
- Row-level encryption — Not needed for penny list data
- Advanced partitioning strategies — Not necessary at current scale
- External authentication providers — Email OTP is sufficient for current needs

## Implementation Sequence

1. **User Profiles (P1)** — Foundation for all community features
2. **Enhanced List Sharing (P1)** — Builds on existing sharing system
3. **Comment System (P1)** — Adds engagement to shared lists
4. **Performance Optimization (P2)** — Ensure scalability as features grow
5. **Follow System (P2)** — Social networking features
6. **Multi-tenant Patterns (P2)** — Advanced security and isolation
7. **Reputation System (P3)** — Gamification and quality incentives

## Connections to Existing Plans

- Overlaps with potential community features in `.ai/BACKLOG.md` — These patterns provide the technical foundation
- Builds on existing authentication in [`app/login/`](app/login/) and [`components/auth-provider.tsx`](components/auth-provider.tsx)
- Extends current list management in [`lib/supabase/lists.ts`](lib/supabase/lists.ts)
- Integrates with existing RLS patterns in [`supabase/migrations/`](supabase/migrations/)

## Raw Notes

- Current RLS implementation uses `auth.uid()` for user identification
- List sharing currently uses token-based access in [`list_shares`](supabase/migrations/002_create_list_shares.sql) table
- Performance optimization critical: avoid joins in RLS policies, use IN clauses
- Wrap `auth.uid()` in SELECT for caching: `(select auth.uid()) = user_id`
- Index all columns used in RLS policy filters
- Consider materialized views for complex permission hierarchies
- Public profiles pattern: `create policy "Public profiles are viewable by everyone" on profiles for select using (true);`
- Comment visibility should inherit from parent list permissions
- Follow relationships use associative table pattern with composite primary keys
- Reputation systems need anti-gaming mechanisms and transparent point allocation
