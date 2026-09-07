# Flow

A Next.js marketing site + authenticated task dashboard, backed by PostgreSQL
(via Prisma) and NextAuth v5 credentials auth.

## Stack

- Next.js 16 (App Router)
- PostgreSQL + Prisma ORM
- NextAuth v5 (credentials/password auth, JWT sessions)
- Tailwind CSS

## Prerequisites

- Node.js 20+
- A PostgreSQL database (local via Docker, or a hosted instance)

## 1. Install dependencies

```bash
npm install
```

`npm install` runs `prisma generate` automatically via the `postinstall` script.

## 2. Configure environment variables

```bash
cp .env.example .env.local
```

Then fill in `.env.local`:

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string, e.g. `postgresql://user:pass@host:5432/db?schema=public` |
| `NEXTAUTH_URL` | Yes | Base URL of the app (`http://localhost:3000` locally) |
| `NEXTAUTH_SECRET` | Yes | Random 32-byte secret. Generate with `openssl rand -base64 32`. The app throws on startup in production if this is missing. |
| `ANTHROPIC_API_KEY` | No | Enables real AI recommendations on the dashboard. Without it, the AI panel is labeled as unavailable rather than showing fake copy. |
| `RESEND_API_KEY`, `CONTACT_NOTIFY_EMAIL`, `CONTACT_FROM_EMAIL` | No | Enables email notifications for contact form submissions via [Resend](https://resend.com). Without them, inquiries are still saved to the database, but no email is sent. |

## 3. Start a local PostgreSQL database

Easiest option, Docker:

```bash
docker run --name flow-postgres \
  -e POSTGRES_USER=flow \
  -e POSTGRES_PASSWORD=flow \
  -e POSTGRES_DB=flow_dev \
  -p 5432:5432 \
  -d postgres:16
```

This matches the default `DATABASE_URL` in `.env.example`. If you use a
different username/password/database name, or a hosted Postgres provider
(Neon, Supabase, Vercel Postgres, RDS, etc.), update `DATABASE_URL`
accordingly.

## 4. Run database migrations

```bash
npm run db:migrate:dev
```

This applies the migrations in `prisma/migrations/` to your local database
and keeps the Prisma Client in sync. Use this command whenever you change
`prisma/schema.prisma` during development — it will generate a new
migration file for you to commit.

For production/CI, use the non-interactive deploy command instead (see
below):

```bash
npm run db:migrate:deploy
```

## 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- `/signup` creates an account (free, no billing is implemented — see
  "Known limitations" below).
- `/login` signs in.
- `/demo` is the authenticated dashboard (task manager + metrics computed
  from your real tasks). It redirects to `/login` if you're not signed in.

## Production deployment

1. **Provision PostgreSQL.** Any managed Postgres works (Neon, Supabase,
   Vercel Postgres, RDS, etc.). Copy its connection string into
   `DATABASE_URL` in your hosting provider's environment variables.
2. **Set required environment variables** in your hosting provider:
   `DATABASE_URL`, `NEXTAUTH_URL` (your production URL, e.g.
   `https://flow.example.com`), `NEXTAUTH_SECRET` (a strong random value —
   **do not reuse the example/dev secret**). Optionally set
   `ANTHROPIC_API_KEY` and the `RESEND_*` variables to enable AI
   recommendations and contact-form email notifications.
3. **Run migrations against the production database** before or during
   deploy:
   ```bash
   npm run db:migrate:deploy
   ```
   On platforms like Vercel, wire this into your build/release step (e.g. a
   pre-deploy command), since `next build` does not apply migrations by
   itself — it only runs `prisma generate`.
4. **Build**:
   ```bash
   npm run build
   ```
5. **Start**:
   ```bash
   npm run start
   ```

### Notes for reverse-proxy / non-Vercel hosts

If you deploy behind a reverse proxy (Docker, Fly.io, Render, a VPS, etc.),
NextAuth v5 may need `AUTH_TRUST_HOST=true` set in the environment so it
trusts the `Host` header from your proxy. Vercel sets this automatically.

## Known limitations / what's not implemented

Being upfront about this so nobody mistakes marketing copy for shipped
functionality:

- **No billing/subscriptions.** The Pricing page displays Starter/Pro/Team
  tiers, but only the free tier is actually functional — there is no
  Stripe (or other) integration, no trial-period tracking, and no plan
  enforcement anywhere in the code. Signing up always creates a plain free
  account.
- **AI recommendations** are only generated when `ANTHROPIC_API_KEY` is
  configured server-side. Without it, the dashboard clearly labels the
  panel as unavailable instead of showing static text as if it were AI
  output.
- **Contact form email** notifications only go out when `RESEND_API_KEY` /
  `CONTACT_NOTIFY_EMAIL` are configured. Submissions are always persisted
  to the database regardless.
- **Dashboard analytics** (focus score, streak, activity breakdown, etc.)
  are computed from real task data (titles, categories, durations,
  completion timestamps) rather than actual time-tracking, since the app
  does not track live work sessions. They are best-effort estimates, not
  precise time-tracking analytics.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | `prisma generate` + production build |
| `npm run start` | Start the production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript type checking, no emit |
| `npm run db:migrate:dev` | Create/apply migrations locally |
| `npm run db:migrate:deploy` | Apply existing migrations (CI/production) |
| `npm run db:studio` | Open Prisma Studio |
