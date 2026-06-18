# Project Overview

A modern, immersive web application built with TanStack Start, React 19, TypeScript, Tailwind CSS, and Supabase. Features scroll-driven 3D depth motion, interactive sections, and full authentication with email verification.

## Tech Stack

- **Framework:** TanStack Start v1 (full-stack React 19 with SSR/SSG)
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS v4
- **Backend / Database / Auth:** Lovable Cloud (Supabase)
- **UI Components:** Radix UI primitives + shadcn patterns
- **Animation:** Motion (formerly Framer Motion), React Three Fiber / Drei
- **Forms:** React Hook Form + Zod

## Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later recommended) or [Bun](https://bun.sh/)
- A Lovable Cloud / Supabase project (auth & database credentials)

## Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```

2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```

3. Configure environment variables (see below).

4. Start the dev server:
   ```bash
   bun run dev
   # or
   npm run dev
   ```

## Environment Variables

The following variables are required. They are injected automatically in the Lovable Cloud environment. For local development, create a `.env` file in the project root:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key (safe for the browser) |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ID |
| `SUPABASE_URL` | Server-side Supabase URL |
| `SUPABASE_PUBLISHABLE_KEY` | Server-side Supabase public key |
| `SUPABASE_PROJECT_ID` | Server-side Supabase project ID |

**Note:** The service role key is managed internally by Lovable Cloud and is not exposed to local `.env` files. If you need it for local admin scripts, retrieve it from your project settings securely and never commit it.

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start the development server with hot reload |
| `bun run build` | Build for production |
| `bun run build:dev` | Build in development mode |
| `bun run preview` | Preview the production build locally |
| `bun run lint` | Run ESLint across the codebase |
| `bun run format` | Auto-format code with Prettier |

## Project Structure

```
src/
  components/         # Reusable React components
    hero/             # Hero section & navigation
    sections/         # Page sections (features, projects, etc.)
    ui/               # Low-level UI primitives (shadcn-style)
  hooks/              # Custom React hooks (auth, scroll reveal, etc.)
  integrations/       # Third-party integrations
    supabase/         # Supabase client, auth middleware, types
    lovable/          # Lovable Cloud helpers
  lib/                # Utility libraries & helpers
  routes/             # TanStack Start file-based routes
    __root.tsx        # Root layout (HTML shell)
    index.tsx         # Homepage
    auth.tsx          # Sign up / Log in page
  start.ts            # TanStack Start instance configuration
  styles.css           # Global styles & Tailwind theme variables
supabase/
  migrations/         # Database migration files
```

## Database Export / Import

Database data is **not** included in Git sync. Use the following methods to move data between environments.

### Export

- **Via Cloud UI:** Go to **Cloud → Database → Tables** and download CSV exports per table.
- **Via SQL (local):**
  ```bash
  psql -c "\copy (SELECT * FROM public.your_table) TO '/tmp/your_table.csv' WITH CSV HEADER;"
  ```

### Import

- **Via Cloud UI:** Use the **Database → Tables → Import** flow to upload CSVs.
- **Via SQL (local):**
  ```bash
  psql -c "\copy public.your_table FROM '/tmp/your_table.csv' WITH CSV HEADER;"
  ```

**Important:** When importing into a fresh project, run migrations first so tables and RLS policies exist before inserting data.

## Authentication

The app uses Lovable Cloud / Supabase Auth with the following flows:

- **Email + Password:** Sign up, log in, and email verification with resend capability.
- **OAuth (Google):** One-click social sign-in configured by default.
- **Session handling:** Managed automatically via the Supabase client with HTTP-only cookies.

Email verification is enforced: users with an unverified email see a verification banner and cannot proceed until confirmed.

## Deployment

This project is designed for deployment on Lovable Cloud / Vercel via the built-in GitHub integration. Every push to the connected branch triggers a preview or production deploy automatically. Database schema changes should be applied through the migration system before or alongside code deploys.
