# Silk City Tech — tech.silkcitygroup.com.bd

Production-ready bilingual website + full-control admin dashboard for **Silk City Tech / Tech Silk City Group**.

- **Public site:** Bangla-first (`bn`) with instant `বাংলা | EN` toggle, persisted in `localStorage`, updates `<html lang>`.
- **Visual structure:** clean white/light editorial canvas, soft pastel service cards, centered headings, split hero/CTA, dark 4-column footer — matching the supplied reference layout.
- **Admin:** protected `/admin` dashboard for brand, header/footer, homepage, packages, portfolio, orders, payments, SEO and legal pages.
- **Stack:** Next.js App Router, TypeScript, Tailwind CSS v4, Framer Motion, Turso/libSQL, Drizzle ORM, Zod.
- **Payments:** SSLCommerz gateway init + server-side validation callbacks, and manual bKash Send Money/Payment with sender number + TrxID verification.

> Default seed contact: **01712631560** · WhatsApp **https://wa.me/8801712631560** · **Mango Tower, Sopura, Boalia, Rajshahi-6203**.

---

## 1. Quick start (local)

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Local development can use a file-based libSQL database.
TURSO_DATABASE_URL=file:.data/local.db
TURSO_AUTH_TOKEN=

# Required. Use a long random password.
ADMIN_PASSWORD=change-me-to-a-long-random-password

SSLCOMMERZ_STORE_ID=
SSLCOMMERZ_STORE_PASSWORD=
SSLCOMMERZ_IS_LIVE=false

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Create schema + seed defaults:

```bash
# Option A — push schema directly (interactive confirmation)
npm run db:push
npm run db:seed

# Option B — apply committed SQL migration (recommended for CI/production)
npm run db:setup        # db:migrate + db:seed

# Non-interactive push when you intentionally accept schema changes
npm run db:push:force
```

Run:

```bash
npm run dev             # http://localhost:3000
```

Admin: **http://localhost:3000/admin** → sign in with `ADMIN_PASSWORD`.

Quality checks:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run start
```

---

## 2. Turso production database

Create a Turso database and token:

```bash
turso db create silkcity-tech
turso db show silkcity-tech --url
turso db tokens create silkcity-tech
```

Set production environment variables:

```env
TURSO_DATABASE_URL=libsql://silkcity-tech-<org>.turso.io
TURSO_AUTH_TOKEN=<token>
ADMIN_PASSWORD=<long-random-password>
NEXT_PUBLIC_SITE_URL=https://tech.silkcitygroup.com.bd
SSLCOMMERZ_STORE_ID=<store-id>
SSLCOMMERZ_STORE_PASSWORD=<store-password>
SSLCOMMERZ_IS_LIVE=true
```

Apply schema and seed:

```bash
npm run db:migrate
npm run db:seed
```

Or push schema:

```bash
npm run db:push
npm run db:seed
```

Generate a new migration after schema changes:

```bash
npm run db:generate
npm run db:migrate
```

Inspect data:

```bash
npm run db:studio
```

---

## 3. Admin dashboard controls

| Tab | Controls |
| --- | --- |
| Overview | Counts, pending bKash verifications, new inquiries |
| General & Brand | Site name, logo URL, favicon, phone, WhatsApp, email, BN/EN address, social links, footer text |
| Header & Footer | Add/edit/reorder/hide/delete header + utility links, footer columns and footer links |
| Homepage & Counters | Hero, Why Choose Us (6), section headings, CTA banner, Features (6), live counters |
| Packages | 8 pastel service/package cards: price, BN/EN features, tint, delivery, revisions, visibility, order |
| Portfolio | Previous built sites: thumbnail, live URL, category, tech stack, client trust note, featured/published |
| Orders & Payments | Customer orders, bKash sender/TrxID inspection, approve/reject, SSLCommerz revalidation, status updates |
| Payment Gateways | SSLCommerz Store ID/password, sandbox/live toggle, enable/disable, manual bKash number + BN/EN instructions, payment badges |
| SEO & Legal Pages | Meta title/description, keywords, OG image, Google verification, dynamic sitemap/robots, About/Privacy/Terms/Contact BN/EN content |
| Inquiries | Contact form submissions |

Security notes:

- Admin session is an **httpOnly, SameSite=Lax, signed HMAC cookie** (8-hour expiry).
- `ADMIN_PASSWORD` must be at least 8 characters; use a long random value in production.
- Login attempts are rate-limited per IP in the database.
- Admin mutations check trusted origin and require a valid session.
- SSLCommerz store password is **write-only** in the admin API and never returned to the browser.
- Manual bKash TrxIDs are unique to prevent duplicate submissions.
- SSLCommerz payments are marked paid **only after server-to-server validation** of `val_id`, `tran_id`, amount and currency.

---

## 4. SSLCommerz setup

1. Create a store at SSLCommerz and obtain **Store ID** and **Store Password**.
2. In Admin → Payment Gateways, enable SSLCommerz, enter credentials, and choose Sandbox or Live.
   - Alternatively set `SSLCOMMERZ_STORE_ID`, `SSLCOMMERZ_STORE_PASSWORD`, `SSLCOMMERZ_IS_LIVE`.
3. Set `NEXT_PUBLIC_SITE_URL` to your public HTTPS origin. Callback URLs are generated as:
   - `https://<domain>/api/payment/sslcommerz/success`
   - `https://<domain>/api/payment/sslcommerz/fail`
   - `https://<domain>/api/payment/sslcommerz/cancel`
   - `https://<domain>/api/payment/sslcommerz/ipn`
4. Test in sandbox before switching `SSLCOMMERZ_IS_LIVE=true` / Live mode.

Manual bKash flow:

1. Customer selects a package and chooses Manual bKash.
2. Customer sends money/payment to the configured bKash number.
3. Customer submits sender number + TrxID.
4. Admin verifies the transaction in Orders & Payments and approves/rejects.

---

## 5. Public routes

- `/` — homepage in the exact reference section order
- `/about`
- `/contact`
- `/privacy-policy`
- `/terms`
- `/portfolio`
- `/order` — package selection, WhatsApp pre-order chat, SSLCommerz checkout, manual bKash TrxID submission
- `/order/confirmation` — order/payment status
- `/sitemap.xml`, `/robots.txt`
- `/admin`, `/admin/login`

Key API routes:

- `POST /api/orders`
- `POST /api/inquiries`
- `POST /api/payment/sslcommerz/init`
- `POST /api/payment/sslcommerz/success|fail|cancel|ipn`
- `POST /api/admin/login`, `POST /api/admin/logout`
- `GET /api/admin/bootstrap`
- `PUT /api/admin/settings`, `PUT /api/admin/content-blocks`, `PUT /api/admin/pages`, `PUT /api/admin/payment-settings`
- `GET/POST/PATCH/DELETE /api/admin/{nav-links,footer-columns,footer-links,why-items,packages,feature-items,stats,portfolio,payment-methods,inquiries}`
- `GET/PATCH /api/admin/orders`, `POST /api/admin/orders/verify`

---

## 6. Deploy (Vercel example)

1. Push this repository to GitHub.
2. Import the repo in Vercel.
3. Add all production environment variables from `.env.example`.
4. Build command: `npm run build`. Output: Next.js default.
5. Run migrations against Turso from a trusted machine/CI:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
6. Set the custom domain `tech.silkcitygroup.com.bd` and enable HTTPS.
7. Sign in to `/admin`, replace seed portfolio/counter/legal content with real business data, and configure payments.

> The seeded portfolio entries are hidden samples. Publish real completed sites from Admin → Portfolio before launch. Legal pages are editable defaults, not legal advice.

---

## 7. Project structure

```text
src/
  app/
    (site)/                 Public bilingual pages + chrome
    admin/                  Protected dashboard + login
    api/                    Public + admin + payment routes
    layout.tsx              Root metadata/fonts
    sitemap.ts, robots.ts
  components/               Public UI, motion, illustrations, admin UI
  db/
    schema.ts               Drizzle schema
    index.ts                libSQL client
    seed.ts                 Idempotent default seed
    env.ts                  Env loading + local fallback
  lib/                      Auth, validation, data, payments, API helpers
drizzle/                    Generated SQL migrations
```

---

## 8. Local preview note

For the Arena sandbox preview, `.env.local` is configured with a file-based libSQL database and a **local-only** admin password. Do not reuse that password in production. Set your own `ADMIN_PASSWORD` and Turso credentials before deploying.
