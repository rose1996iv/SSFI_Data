# Architecture Notes

## Why this shape

The platform is organized around a member-first relational model so leadership records, graduate records, user access, and communication all connect back to one canonical profile.

## Core decisions

- `members` is the operational source of truth for people-centric data.
- `users` maps application access to Supabase `auth.users`.
- `roles` stays normalized so policy logic and future permission tooling can evolve without schema churn.
- `graduates` is separated from `members` so alumni records can grow independently while preserving the relationship.
- `leadership_records` stores many terms per member to support archive and timeline views.
- `documents` stores metadata in Postgres and files in Supabase Storage.
- `activities` and `notifications` exist now so later audit and messaging modules do not require structural rewrites.

## App behavior

- Pages read through `services/*` instead of querying Supabase directly.
- Server actions handle mutations and revalidation.
- API routes provide a clean base for mobile or third-party integration work.
- Demo mode keeps the UI usable before infrastructure is connected.
