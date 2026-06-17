# Development Commands

Run commands from `app/` unless noted otherwise.

## Install

```bash
pnpm install
```

## Development Server

```bash
pnpm dev
```

Starts the Vite development server.

Do not run long-lived dev or preview servers unless the task requires it.

## Production Build

```bash
pnpm build
```

Runs TypeScript (`tsc`) and Vite build. This is the current required validation command after code changes.

## Preview Build

```bash
pnpm preview
```

Serves the built app for local preview. Use only when explicitly needed.

## Not Established Yet

The repo currently does not define scripts for:

- lint
- format
- unit tests
- e2e tests
- database migrations
- deployment

Do not claim these checks ran unless the scripts are added and executed.

## Suggested Validation Cadence

- Code changes: `pnpm build`
- Docs-only changes: no app validation required
- Future routing/data changes: still start with `pnpm build`; add tests only after test tooling exists
