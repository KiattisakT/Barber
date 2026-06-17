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

## Frontend Preview Build

```bash
cd app
pnpm preview
```

Serves the built frontend app for local preview. Use only when explicitly needed.

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

Do not run this as a long-lived process unless the task requires it.

## Backend Build

```bash
cd server
pnpm build
```

Runs TypeScript for the server package.

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

## Prisma Commands

```bash
cd server
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dream_catcher?schema=public" pnpm prisma:generate
pnpm prisma:migrate
pnpm seed
```

Current Prisma schema has the initial Dream Catcher models. `prisma:generate` works with Prisma 6.19.x and a `DATABASE_URL` value. Run `prisma:migrate` and `seed` only when a local PostgreSQL database is available.

## Not Established Yet

The repo currently does not define scripts for:

- lint
- format
- unit tests
- e2e tests
- deployment

Do not claim these checks ran unless the scripts are added and executed.

## Suggested Validation Cadence

- Frontend code changes: `pnpm build` from `app/`
- Backend code changes: `pnpm build` from `server/`
- Docs-only changes: no app/server build required
- Future routing/data changes: still start with the relevant `pnpm build`; add tests only after test tooling exists
