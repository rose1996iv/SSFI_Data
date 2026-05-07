# SSFI Data Center

SSFI Data Center is a production-ready organizational platform for private member management, leadership history, alumni tracking, secure document storage, and analytics.

## Stack

- Next.js 15 App Router
- React 19 + TypeScript
- Tailwind CSS
- shadcn-style UI primitives
- Supabase Auth, Database, and Storage
- PostgreSQL
- Vercel deployment target

## Key capabilities

- Secure authentication with Supabase Auth
- Role-based application model: `super_admin`, `admin`, `executive`, `member`, `alumni`, `guest`
- Full member CRUD foundation with image upload support
- Leadership timeline and archive
- Graduate and alumni directory linked to member records
- Analytics dashboard with Recharts
- Document library with secure storage-aware download flow
- Communication directory with email, phone, WhatsApp, and Telegram actions
- Demo mode fallback when Supabase is not configured

## Project structure

```text
app/                     App Router pages, layouts, and API routes
components/              UI primitives, forms, dashboard widgets, app shell
hooks/                   Reusable client hooks
lib/                     Auth, env parsing, permissions, mock data, Supabase clients
services/                Data services and server actions
types/                   Domain types and database typings
utils/                   Formatting and link helpers
database/                Canonical SQL schema and seed data
supabase/                Supabase config and migrations
```

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Fill in:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL`

4. Run the app:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Database setup

1. Create a Supabase project.
2. Apply [`database/schema.sql`](./database/schema.sql) or run the migration in `supabase/migrations/`.
3. Optionally apply [`database/seed.sql`](./database/seed.sql) for starter records.
4. Create at least one auth user and promote it by updating the `users.role_id` and `users.is_approved` fields.

## Authentication and authorization

- Authentication uses Supabase email/password auth.
- App roles are stored in `public.roles` and linked through `public.users`.
- Row-level security policies protect every core table.
- Storage policies separate public member images from private organization documents.
- Middleware protects dashboard and API routes when Supabase is configured.

## API surface

- `GET /api/health`
- `GET /api/search?query=...`
- `GET /api/members`
- `POST /api/members`
- `GET /api/members/:id`
- `PATCH /api/members/:id`
- `DELETE /api/members/:id`
- `GET /api/documents/:id/download`

## Quality checks

```bash
npm ci
npm run typecheck
npm run lint
npm run build
```

Or run everything with:

```bash
npm run check
```

## CI/CD

GitHub Actions workflows are included in this repo:

- `CI`: lint, typecheck, and production build on push/PR
- `Vercel Preview Deploy`: preview deployment for pull requests
- `Vercel Production Deploy`: production deployment on push to `main`

Setup details are documented in [docs/ci-cd.md](./docs/ci-cd.md).

## Deployment

### GitHub

1. Create a new GitHub repository.
2. Push this project.
3. Add branch protection and secrets management as needed.

### Supabase

1. Configure Auth redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.com/auth/callback`
2. Apply the SQL schema and confirm storage buckets exist:
   - `member-assets`
   - `organization-documents`
3. Approve initial admins in `public.users`.

### Vercel

1. Import the repo into Vercel.
2. Add the same environment variables from `.env.local`.
3. Set the production URL in `NEXT_PUBLIC_SITE_URL`.
4. Deploy.
5. Add these GitHub Actions secrets for automated preview and production deploys:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

## Future-ready extension points

- Mobile app clients through the existing API and service layers
- Event registration and attendance tracking
- Scholarship tracking
- AI-assisted search
- QR-based member cards
- Notification workflows
- Donations and finance modules

## Notes

- Without Supabase variables, the app runs in a safe demo mode using mock data.
- Member images are designed for a public bucket. Official documents are designed for a private bucket and use signed download URLs.
- The SQL schema includes tables for activity logs and notifications even though the first UI release focuses on the highest-value operational modules.
