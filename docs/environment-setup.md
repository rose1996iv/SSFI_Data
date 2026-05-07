# Environment Setup Guide

## Required variables

```env
NEXT_PUBLIC_APP_NAME="SSFI Data Center"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
SUPABASE_STORAGE_MEMBER_BUCKET="member-assets"
SUPABASE_STORAGE_DOCUMENT_BUCKET="organization-documents"
DEFAULT_SUPER_ADMIN_EMAIL="admin@ssfi.org"
RATE_LIMIT_WINDOW_MS="60000"
RATE_LIMIT_MAX_REQUESTS="20"
```

## Meaning

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: browser-safe client key
- `SUPABASE_SERVICE_ROLE_KEY`: server-side privileged key for admin tasks
- `NEXT_PUBLIC_SITE_URL`: absolute app URL used in auth callbacks
- `SUPABASE_STORAGE_MEMBER_BUCKET`: public profile-image bucket
- `SUPABASE_STORAGE_DOCUMENT_BUCKET`: private document bucket

## Recommended production practice

- Keep `.env.local` out of source control.
- Store production secrets in Vercel project settings.
- Rotate service role keys if they are ever exposed.
- Restrict auth signups and approve users through the `public.users.is_approved` field.
