# Grandora API

NestJS 11 + GraphQL + PostgreSQL backend for the Grandora website. The project overview, screenshots, backend flow and API list are in the [main README](../README.md).

```bash
docker compose up -d     # PostgreSQL 17 on 127.0.0.1:5432
cp .env.example .env     # set TOKEN_SECRET and PASSWORD_PEPPER; Omise and R2 keys are optional
npm install
npm run db:setup         # migrations + mock data
npm run start:dev        # http://localhost:3000, GraphQL at /api/v1/graph
```

- Without Omise keys the site still works: packages can be bought with MYGG Coins, and online methods show as not configured.
- Without R2 keys, development stores uploads in `./uploads`; production refuses uploads until R2 is set.
- `npm run seed` resets every table and reloads the mock data, including the demo account `demo@grandora.games`.

Deploying: build with the `Dockerfile`, run `npm run release` before start (applies migrations and seeds an empty database), set `ENV=production`, `DATABASE_URL`, `ALLOWED_ORIGIN` and `FRONTEND_URL` to the website's address, and register the Omise webhook at `/api/v1/payments/omise/webhook`.
