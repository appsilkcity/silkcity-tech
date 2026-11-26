# Deploying to Vercel

The app is a standard Next.js App Router project, so Vercel auto-detects it.
`vercel.json` pins the framework and the serverless **region** (`sin1`, Singapore —
co-located with the Turso DB). The **build command lives in the Vercel project
settings**, not in `vercel.json`, so it can be switched between normal builds and a
one-off database-provisioning build without editing the repo. No Edge runtime is
used; all DB/auth/payment routes run on the Node.js runtime.

> **Live deployment:** project `silkcity-tech` on team `silkcity` is already deployed
> to production. The Turso schema + seed were applied during the first build (see
> "Provision the database" below), and the normal build command was restored
> afterwards. Custom domain `tech.silkcitygroup.com.bd` is attached; point its DNS at
> Vercel to finish (Project → Settings → Domains shows the exact records).

## Option A — Let Arena deploy it (recommended)

1. In Arena, open **Connected apps** and connect **Vercel** (authorize the team/account).
2. Tell the agent "Vercel is connected, deploy".
3. The agent uses the Vercel connector to create/link the project, set environment
   variables, provision the database during the first build, and trigger a production
   deployment.

> The sandbox itself has no route to `api.vercel.com` **or to Turso**, and holds no
> Vercel token, so a direct `vercel deploy` or a local `db:migrate` against Turso from
> bash is not possible. The connector runs migrate + seed **inside the Vercel build**
> (see below), which does have network access to Turso.

## Option B — Vercel dashboard / GitHub integration (self-serve)

The branch `arena/07038804-silkcity-tech` and PR #1 are already pushed to
`appsilkcity/silkcity-tech`.

1. Go to https://vercel.com/new and **Import** the `appsilkcity/silkcity-tech` repo.
2. Framework preset: **Next.js** (auto). Install `npm install`. For the very first
   build, set the build command to `npm run db:migrate && npm run db:seed && npm run build`
   so the database is provisioned (see below); afterwards set it back to `npm run build`.
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

### Provision the database

The schema and bilingual seed only need to run **once**. Two ways:

**A. Inside the Vercel build (used for this deployment — no local Turso access needed).**
Temporarily set the project's build command to:

```
npm run db:migrate && npm run db:seed && npm run build
```

Deploy once. `drizzle-kit migrate` applies `drizzle/0000_*.sql` and the idempotent seed
inserts the default settings, 8 packages, features, stats, nav/footer, payment methods
and legal pages. The build log shows `Seed complete. Packages: 8.` Then **restore the
build command to `npm run build`** so later deploys don't re-run migrations. Both the
migrate and seed steps are safe to re-run (migrations are tracked; the seed is idempotent).

**B. From a trusted machine/CI that can reach Turso.**

```bash
turso db create silkcity-tech --location aws-ap-southeast-1   # Singapore
turso db show silkcity-tech --url
turso db tokens create silkcity-tech

# With TURSO_DATABASE_URL / TURSO_AUTH_TOKEN exported locally:
npm run db:migrate
npm run db:seed
```

> **Region:** the Turso DB for this project is in `aws-ap-southeast-1` (Singapore), so
> `vercel.json` pins functions to `sin1` (Singapore) for lowest latency. Keep the DB and
> the Vercel region on the same continent.

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

- [ ] Point `tech.silkcitygroup.com.bd` DNS at Vercel (CNAME to `cname.vercel-dns.com`) and wait for the cert.
- [ ] Visit `/` and toggle `বাংলা | EN`.
- [ ] Sign in at `/admin` with `ADMIN_PASSWORD`.
- [ ] Publish real portfolio entries; review counters, packages, legal pages.
- [ ] Configure SSLCommerz (sandbox first) and manual bKash in Admin → Payment Gateways.
- [ ] Place a test bKash order and approve it; place a sandbox SSLCommerz order.
- [ ] Confirm `/sitemap.xml` and `/robots.txt` use the production domain.
- [ ] Set SSLCommerz callback URLs to `https://tech.silkcitygroup.com.bd/api/payment/sslcommerz/{success,fail,cancel,ipn}`.
