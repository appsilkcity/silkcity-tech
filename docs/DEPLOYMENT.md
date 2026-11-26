# Deployment checklist

## Before launch

- [ ] Set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` to a production Turso database.
- [ ] Set a long random `ADMIN_PASSWORD`.
- [ ] Set `NEXT_PUBLIC_SITE_URL=https://tech.silkcitygroup.com.bd`.
- [ ] Run `npm run db:migrate && npm run db:seed` against production.
- [ ] Sign in to `/admin` and update brand/logo/favicon/social links.
- [ ] Replace hidden sample portfolio entries with real completed sites and publish them.
- [ ] Review counters, hero trust badge, packages, prices and features.
- [ ] Review About / Privacy Policy / Terms / Contact content in Bangla and English.
- [ ] Configure SSLCommerz sandbox first, then live.
- [ ] Configure manual bKash number and instructions.
- [ ] Place a test order with manual bKash and verify it in Admin.
- [ ] Place a sandbox SSLCommerz order and confirm server-side validation marks it paid.
- [ ] Confirm `/sitemap.xml` and `/robots.txt` use the production domain.
- [ ] Enable HTTPS and verify admin cookie is Secure in production.

## SSLCommerz callback URLs

```text
https://tech.silkcitygroup.com.bd/api/payment/sslcommerz/success
https://tech.silkcitygroup.com.bd/api/payment/sslcommerz/fail
https://tech.silkcitygroup.com.bd/api/payment/sslcommerz/cancel
https://tech.silkcitygroup.com.bd/api/payment/sslcommerz/ipn
```

## Rollback / migrations

- Schema migrations live in `drizzle/`.
- Generate after schema edits: `npm run db:generate`.
- Apply: `npm run db:migrate`.
- For emergency direct push: `npm run db:push` (interactive) or `npm run db:push:force` (CI, accepts data-loss statements — use carefully).

## Backups

- Use Turso backups / export before major schema changes.
- Keep `ADMIN_PASSWORD` and SSLCommerz credentials in a secrets manager, not in Git.
