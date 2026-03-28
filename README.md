
FlowDesk SaaS Dashboard
=======================

Overview
--------

Minimal, production-ready Next.js (App Router) SaaS dashboard example implemented in TypeScript with Tailwind CSS and Prisma (SQLite by default). Built for demos and easy deployment to GitHub + Vercel.

Features
--------

- Role-based demo authentication (cookie-based sessions)
- Multi-step workflow submission
- Dashboard metrics with editable cards
- Prisma ORM for data access (sqlite in development)
- Minimal APIs using Next.js App Router

Tech stack
----------

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Prisma + SQLite (dev)

Quick start (local)
-------------------

1. Copy the example env:

```bash
cp .env.example .env
# set DATABASE_URL in .env (sqlite or production database)
```

2. Install and run locally:

```bash
npm install
npm run dev
```

Open the app in your browser at the local dev port.

Demo credentials
----------------

- admin@saasflow.dev / admin1234
- user@saasflow.dev / user1234

Deployment notes (GitHub + Vercel)
---------------------------------

1. Push your repo to GitHub.
2. On Vercel, import the project and set environment variables (at minimum):

- `DATABASE_URL` — your production database connection string (Postgres recommended).

3. Vercel will run `npm run build` which now runs `prisma generate && next build` to ensure the Prisma client is generated during build.

Important production considerations
---------------------------------

- Use a managed database (Postgres) in production and set `DATABASE_URL` accordingly.
- The app sets cookies with `secure: process.env.NODE_ENV === 'production'`, `sameSite: 'lax'` and `httpOnly: true`.
- API routes that access Prisma are configured to run in the Node.js runtime (not Edge) so Prisma works reliably on Vercel serverless functions.

Repository structure
--------------------

- `src/app` — Next.js App Router pages and API routes
- `src/components` — UI components
- `src/lib` — helpers (Prisma client, auth, workflows)
- `prisma` — Prisma schema and migrations

If you want, I can also run a quick local build check or add CI steps.
  



