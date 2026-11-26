# Deploying to Vercel

The app is a standard Next.js App Router project, so Vercel auto-detects it.
`vercel.json` pins the framework and build command. No Edge runtime is used;
all DB/auth/payment routes run on the Node.js runtime.

## Option A — Let Arena deploy it (recommended)

1. In Arena, open **Connected apps** and connect **Vercel** (authorize the team/account).
2. Tell the agent "Vercel is connected, deploy".
3. The agent will use the Vercel connector to create/link the project, set environment
   variables, and trigger a production deployment.

> The sandbox itself has no route to `api.vercel.com` and holds no Vercel token,
> so a direct `vercel deploy` from bash is not possible. The connector (or Option B)
> is required.

## Option B — Vercel dashboard / GitHub integration (self-serve)

The branch `arena/07038804-silkcity-tech` and PR #1 are already pushed to
`appsilkcity/silkcity-tech`.

1. Go to https://vercel.com/new and **Import** the `appsilkcity/silkcity-tech` repo.
2. Framework preset: **Next.js** (auto). Build command `npm run build`, install `npm install`.
3. Add the environment variables below **before the first build** (Production + Preview).
4. Deploy. For the custom domain, add `tech.silkcitygroup.com.bd` in Project → Settings → Domains
   and point DNS to Vercel (HTTPS is automatic).

### Required environment variables

| Variable | Value |
| --- | --- |
| `TURSO_DATABASE_URL` | `libsql://<db>-<org>.turso.io` |
| `TURSO_AUTH_TOKEN` | Turso database token |
| `ADMIN_PASSWORD` | Long random password (min 8 chars) |
| `NEXT_PUBLIC_SITE_URL` | `https://tech.silkcitygroup.com.bd` |
| `SSLCOMMERZ_STORE_ID` | Store ID (optional until enabling gateway) |
| `SSLCOMMERZ_STORE_PASSWORD` | Store password (optional until enabling gateway) |
| `SSLCOMMERZ_IS_LIVE` | `false` for sandbox, `true` for live |

> In production the app **requires** `TURSO_DATABASE_URL`. The local file fallback
> (`file:.data/local.db`) is development-only and is never used on Vercel.

### Provision the database (run once from a trusted machine/CI)

```bash
turso db create silkcity-tech --location aws-ap-south-1   # closest to Bangladesh
turso db show silkcity-tech --url
turso db tokens create silkcity-tech

# With TURSO_DATABASE_URL / TURSO_AUTH_TOKEN exported locally:
npm run db:migrate
npm run db:seed
```

Tip: create the Turso DB in `aws-ap-south-1` (Mumbai) and optionally set the Vercel
serverless region to `bom1` for lowest latency from Rajshahi.

### CLI alternative (if you prefer your own terminal)

```bash
npm i -g vercel
vercel login
vercel link
vercel env add TURSO_DATABASE_URL production
vercel env add TURSO_AUTH_TOKEN production
vercel env add ADMIN_PASSWORD production
vercel env add NEXT_PUBLIC_SITE_URL production
vercel --prod
```

## Post-deploy checklist

- [ ] Visit `/` and toggle `বাংলা | EN`.
- [ ] Sign in at `/admin` with `ADMIN_PASSWORD`.
- [ ] Publish real portfolio entries; review counters, packages, legal pages.
- [ ] Configure SSLCommerz (sandbox first) and manual bKash in Admin → Payment Gateways.
- [ ] Place a test bKash order and approve it; place a sandbox SSLCommerz order.
- [ ] Confirm `/sitemap.xml` and `/robots.txt` use the production domain.
- [ ] Set SSLCommerz callback URLs to `https://tech.silkcitygroup.com.bd/api/payment/sslcommerz/{success,fail,cancel,ipn}`.
