# Development Commands

Run frontend commands from `app/` and backend commands from `server/`.

## Frontend Install

```bash
cd app
pnpm install
```

## Frontend Development Server

```bash
cd app
pnpm dev
```

Starts the Vite development server.

Do not run long-lived dev or preview servers unless the task requires it.

## Frontend Production Build

```bash
cd app
pnpm build
```

Runs TypeScript (`tsc`) and Vite build. This is the current required validation command after frontend code changes.

## Frontend Tests

```bash
cd app
pnpm test
```

Runs Vitest tests. Current tests cover admin queue API DTO mappers, admin mutation payloads, and customer booking API payload/mapping helpers used by frontend/backend integration.

## Frontend Preview Build

```bash
cd app
pnpm preview
```

Serves the built frontend app for local preview. Use only when explicitly needed.


## Frontend Environment

Copy `app/.env.example` if local values need to differ. Current frontend variables:

- `VITE_API_BASE_URL` — defaults to `/api`; Vite dev proxies this to backend port `4000`.
- `VITE_SHOP_SLUG` — defaults to `dream-catcher`.
- `VITE_DEFAULT_STAFF_ID` — defaults to `staff_arm`.
- `VITE_QUEUE_DATE` — defaults to `2026-06-17` while the seed data is date-fixed.

## Backend Install

```bash
cd server
pnpm install
```

## Backend Development Server

```bash
cd server
pnpm dev
```

Starts the Express server with `tsx watch`. Default port is `4000` unless `PORT` is set.

The frontend Vite dev server proxies `/api` to `http://localhost:4000`, so run backend dev before frontend dev when checking live API integration.

Do not run this as a long-lived process unless the task requires it.

## Backend Build

```bash
cd server
pnpm build
```

Generates Prisma Client, then runs TypeScript for the server package. This avoids a fresh checkout failing build before Prisma Client exists.

## Backend Tests

```bash
cd server
pnpm test
```

Runs Vitest route tests. Current tests cover health, public customer routes, admin queue read validation, status update route validation, walk-in creation route, and blocked-time creation route with mocked service boundaries.

## Backend Start

```bash
cd server
pnpm start
```

Runs the built server from `server/dist/index.js`.

## Backend Health Check

After building, the app can be tested without a long-lived server by importing `dist/app.js` and listening on an ephemeral port. Expected health response:

```json
{"ok":true,"service":"dream-catcher-server","env":"development"}
```

The first admin queue route is `GET /api/admin/shops/:shopSlug/queue/today`. It needs a migrated/seeded database for a successful response.

Verified local success case:

```text
GET /api/admin/shops/dream-catcher/queue/today?date=2026-06-17 -> 200
PATCH /api/admin/queue-items/queue_a023/status { "status": "in_progress" } -> 200
POST /api/admin/walk-ins -> 201
POST /api/admin/blocked-times -> 201 / 409 on overlap
GET /api/shops/dream-catcher/public -> 200
GET /api/shops/dream-catcher/queue/today?date=2026-06-17&queueNumber=A023 -> 200
POST /api/shops/dream-catcher/queue/tickets -> 201
POST /api/shops/dream-catcher/appointments -> 201 / 409 on overlap
POST /api/shops/dream-catcher/tattoo-requests -> 201
```

## Prisma Commands

```bash
cd server
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dream_catcher?schema=public" pnpm prisma:generate
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dream_catcher?schema=public" pnpm prisma:migrate
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dream_catcher?schema=public" pnpm seed
```

Current Prisma schema has the initial Dream Catcher models. `prisma:generate`, `prisma:migrate`, and `seed` work with Prisma 6.19.x and a valid local `DATABASE_URL`.

On macOS local PostgreSQL, the default role may be the macOS username rather than `postgres`. In that case use a URL like:

```bash
DATABASE_URL="postgresql://kiattisakmayong@localhost:5432/dream_catcher?schema=public"
```

## Not Established Yet

The repo currently does not define scripts for:

- lint
- format
- e2e tests
- deployment

Do not claim these checks ran unless the scripts are added and executed.

## Suggested Validation Cadence

- Frontend code changes: `pnpm build` and `pnpm test` from `app/`
- Backend code changes: `pnpm build` and `pnpm test` from `server/`
- Docs-only changes: no app/server build required
- Future routing/data changes: still start with the relevant `pnpm build`; add tests only after test tooling exists
