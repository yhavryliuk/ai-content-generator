# AI Content Generator (MVP)

Generate professional LinkedIn and Twitter posts with AI. Built with Next.js 16, Supabase, Prisma, OpenAI, and Stripe.

**[🚀 Live Demo](https://project-298qu.vercel.app/)**

## Features

- **AI-Powered Generation** — GPT-4o mini streams content in real-time
- **Multi-Platform** — Optimized for LinkedIn and Twitter
- **Google OAuth** — Sign in with Supabase Auth
- **Freemium Model** — 3 free posts, unlimited with PRO subscription
- **Stripe Payments** — Secure checkout for plan upgrades
- **Post History** — Browse and revisit all generated content

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Auth:** Supabase Auth (Google OAuth)
- **Database:** PostgreSQL via Supabase + Prisma 7
- **AI:** OpenAI API (GPT-4o mini)
- **Payments:** Stripe (Checkout + Webhooks)
- **UI:** shadcn/ui + Tailwind CSS 4

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Supabase project (with Google OAuth configured)
- OpenAI API key
- Stripe account

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key |
| `SUPABASE_SECRET` | Supabase service role key |
| `DATABASE_URL` | Pooled connection string (port 6543) |
| `DIRECT_URL` | Direct connection string (port 5432) |
| `OPENAI_API_KEY` | OpenAI API key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` | Stripe product ID for PRO plan |
| `NEXT_PUBLIC_APP_URL` | App base URL (`http://localhost:3000` locally) |

### 3. Run database migrations

```bash
pnpm prisma migrate dev
```

### 4. Generate Prisma Client

Run this after schema changes or if you pull fresh changes with updated Prisma models:

```bash
pnpm prisma generate
```

### 5. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## GitHub Actions CI/CD (Vercel)

Workflow file: `.github/workflows/ci-cd-vercel.yml`

- On every PR to `main`: runs `pnpm check`, `pnpm test`, and `pnpm build`
- On every push to `main`: runs CI and then deploys to Vercel

Required GitHub repository secrets:

| Secret | Description |
|---|---|
| `VERCEL_TOKEN` | Vercel API token |
| `VERCEL_ORG_ID` | Vercel team/user org ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |
| `DIRECT_URL` | Direct connection string for migrations |

How to get org/project IDs:

1. Run `vercel link` locally once in the project
2. Use values from `.vercel/project.json`

## Stripe Local Testing

Install the [Stripe CLI](https://docs.stripe.com/stripe-cli) and forward webhooks to your local server:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret (`whsec_...`) from the CLI output into `STRIPE_WEBHOOK_SECRET` in `.env.local`.

## Google OAuth Setup

1. In the [Supabase dashboard](https://supabase.com/dashboard), go to **Authentication → Providers → Google**
2. Enable the Google provider
3. Create OAuth credentials in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
4. Set the authorized redirect URI to: `https://<your-project>.supabase.co/auth/v1/callback`
5. Paste the Client ID and Client Secret into Supabase

## Project Structure

```
app/
  page.tsx              # Landing page
  login/page.tsx        # Google OAuth login
  auth/callback/        # OAuth callback handler
  dashboard/
    page.tsx            # AI content generator
    history/page.tsx    # Post history
    layout.tsx          # Dashboard layout with sidebar
  api/
    generate/route.ts   # OpenAI streaming endpoint
    webhooks/stripe/    # Stripe webhook handler
  actions/
    create-checkout.ts  # Stripe checkout session
    generate-post.ts    # Generation validation
components/
  dashboard-shell.tsx   # Sidebar navigation
  generator-form.tsx    # Content generation form
  upgrade-modal.tsx     # PRO upgrade dialog
lib/
  prisma.ts             # Prisma client singleton
  stripe.ts             # Stripe client singleton
  supabase/             # Supabase server/client/proxy helpers
prisma/
  schema.prisma         # Database schema
```
