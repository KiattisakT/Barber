# Backend Implementation Plan

This plan turns `docs/backend-api-contract-v0.md` into an implementation path. It should be updated as soon as backend code exists.

## Current Reality

The repo now has:

- frontend app under `app/`
- backend scaffold under `server/`
- Express app setup with `GET /health`
- TypeScript build for the server package
- Prisma 6.19.x dependency setup with initial models in `prisma/schema.prisma`
- seed script at `server/prisma/seed.ts` for Dream Catcher sample data

There is still no migration applied, auth, or frontend API client yet.

Frontend prototype state is local React state using:

- `app/src/lib/mock-data.ts`
- `app/src/lib/queue-system.ts`
- `app/src/lib/queue-display.ts`

## Target Stack

Planned backend stack:

- Node.js + TypeScript
- Express
- Prisma
- PostgreSQL
- pnpm

Auth is intentionally deferred for V0.

## Proposed Repo Shape

Use a separate `server/` package first. Do not merge backend into `app/`.

```txt
server/
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── src/
    ├── index.ts
    ├── app.ts
    ├── config/
    ├── routes/
    │   ├── public-shop-routes.ts
    │   └── admin-queue-routes.ts
    ├── services/
    │   ├── queue-number-service.ts
    │   ├── queue-status-service.ts
    │   ├── appointment-service.ts
    │   ├── tattoo-request-service.ts
    │   └── wait-estimate-service.ts
    ├── repositories/
    └── prisma-client.ts
```

If a pnpm workspace is introduced, update root docs and commands at the same time.

## Phase B1: Backend Scaffold

Status: implemented.

Created `server/` with:

- package scripts
  - `pnpm dev`
  - `pnpm build`
  - `pnpm start`
  - `pnpm prisma:generate`
  - `pnpm prisma:migrate`
  - `pnpm seed`
- Express app setup
- health route `GET /health`
- JSON body parser
- centralized error handler
- env reader for `DATABASE_URL` and `PORT`

Acceptance:

- `server` builds with TypeScript
- `GET /health` returns `{ "ok": true, "service": "dream-catcher-server", "env": "development" }`

## Phase B2: Prisma Schema

Status: schema and seed draft implemented; migration not applied yet.

Created initial Prisma models:

- `Shop`
- `Staff`
- `Service`
- `Customer`
- `QueueItem`
- `TattooRequest`
- `ReferenceImage`
- `BusinessHours`
- `BlockedTime`
- `DailyQueueCounter`

Recommended V0 persistence choice:

- `QueueItem` is the operational table for admin daily queue.
- Advance booking creates a `QueueItem` with `source = online` and `status = confirmed`.
- Walk-in creates a `QueueItem` with `source = walk_in` and `status = checked_in`.
- Tattoo request creates both `TattooRequest` and a linked `QueueItem` with `source = tattoo` and `status = pending_review`.

Acceptance:

- Prisma generate works
- initial migration applies locally — pending live database
- seed creates Dream Catcher data — script written, pending live database run

## Phase B3: Seed Data

Status: seed script draft implemented; pending live database run after migration.

Seed should mirror current prototype enough for frontend replacement:

- Shop: Dream Catcher
- Staff: Arm as barber, Boss as tattoo artist/owner if needed
- Services:
  - ตัดผมชาย
  - Fade / Modern cut
  - แต่งหนวดเครา
  - tattoo consultation/request placeholder
- Queue items similar to current mock data
- Blocked times similar to current mock data
- Business hours assumption: 10:00-20:00, closed Wednesday; mark in docs as assumption until owner confirms

## Phase B4: Services

### Queue number service

Responsibilities:

- generate daily sequence per `shopId` and prefix
- transaction-safe counter
- format `A001` / `T001`

Implementation options:

1. `DailyQueueCounter` table with unique `(shopId, queueDate, prefix)` and transaction increment
2. query max existing queue number inside serializable transaction

Preferred: `DailyQueueCounter` because it is explicit and safer.

### Queue status service

Responsibilities:

- validate status transitions
- enforce one `in_progress` per `staffId`
- update timestamps if added later
- return affected items when auto-reverting current `in_progress`

V0 behavior should match prototype:

- when item becomes `in_progress`, previous `in_progress` for the same staff becomes `checked_in`

### Appointment service

Responsibilities:

- validate service/staff/shop
- compute `endsAt` from service duration
- reject blocked time overlap
- reject active appointment overlap for same staff
- create customer if needed
- create queue item with source `online`

### Tattoo request service

Responsibilities:

- validate contact fields and description
- create customer if needed
- create tattoo request with `pending_review`
- create linked queue item with prefix `T`

### Wait estimate service

Responsibilities:

- calculate queue ahead
- calculate estimated wait
- ignore terminal statuses and tattoo request rows for barber queue wait estimates

## Phase B5: Routes

Implement from `docs/backend-api-contract-v0.md`:

Public:

- `GET /api/shops/:shopSlug/public`
- `GET /api/shops/:shopSlug/queue/today`
- `POST /api/shops/:shopSlug/queue/tickets`
- `POST /api/shops/:shopSlug/appointments`
- `POST /api/shops/:shopSlug/tattoo-requests`

Admin:

- `GET /api/admin/shops/:shopSlug/queue/today`
- `PATCH /api/admin/queue-items/:id/status`
- `POST /api/admin/walk-ins`
- `POST /api/admin/blocked-times`

Keep route handlers thin. They should parse input, call services, and return DTOs.

## Phase B6: Frontend Integration

Add frontend API boundary:

```txt
app/src/lib/api-client.ts
app/src/lib/queue-api.ts
```

Suggested order:

1. read admin queue from API
2. mutate admin queue status via API
3. add admin walk-in via API
4. add blocked time via API
5. customer take ticket via API
6. tattoo request via API
7. advance booking via API

Keep mock fallback only if explicitly useful during development.

## Validation Expectations

Until scripts exist, document the actual commands when added.

Expected future commands:

```bash
cd server
pnpm build
pnpm prisma:generate
pnpm prisma:migrate
pnpm seed
```

Frontend validation remains:

```bash
cd app
pnpm build
```

## Risks

- Queue number generation must be transaction-safe.
- Timezone handling can drift if local day is calculated in UTC instead of `Asia/Bangkok`.
- Status transitions should not be duplicated between frontend and backend.
- Tattoo request must not accidentally become a confirmed appointment.
- Blocking time must affect booking availability before frontend removes mock logic.

## Immediate Next Step

Create backend scaffold in `server/`, install exact dependencies with pnpm, and implement `GET /health` plus Prisma schema draft.
