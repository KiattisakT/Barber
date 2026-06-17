# Agent Instructions

Dream Catcher is now a small React prototype plus product docs for a queue-first barber/tattoo booking MVP. Treat local repo reality as the source of truth before applying generic patterns.

## Current Reality

- App code lives in `app/` and is a Vite + React + TypeScript app.
- Use `pnpm` from `app/` for package scripts.
- Current scripts are `pnpm dev`, `pnpm build`, and `pnpm preview`.
- Styling is Tailwind CSS v4 through `@tailwindcss/vite` and `app/src/styles.css`.
- UI primitives live in `app/src/components/ui/` and follow a local shadcn-style shape.
- The prototype currently keeps customer and admin queue state in React state and mock data, not a backend.
- Product/business/UX docs live in `docs/`.

## Product Direction

- Optimize first for a shop with one main barber.
- The app should behave like a small-shop queue assistant, not salon enterprise software.
- Customer haircut flow can create/confirm queue or booking items.
- Tattoo flow must remain request/review first with `pending_review`; it is not an instant appointment.
- Admin should be daily queue-first and fast to use while the barber is working.

## Development Rules

- Preserve behavior during refactors. Do not change business conditions unless explicitly asked.
- Keep changes scoped to the requested flow or component.
- Use local shadcn-style primitives (`Button`, `Card`, `Badge`, `Input`, `Label`, `Textarea`, `NativeSelect`, `Switch`, `Separator`) for all app controls and repeated surfaces when a primitive exists. Do not add raw `<button>`, `<input>`, `<select>`, `<textarea>`, or ad-hoc card surfaces in feature code unless the primitive cannot express the behavior.
- Use `cn` from `app/src/lib/utils.ts` for conditional class composition.
- Keep Thai-first UI copy unless the surrounding UI already uses a short English product term.
- Label unconfirmed shop details as assumptions or open questions in docs.
- Do not introduce backend, auth, payment, LINE integration, SaaS billing, or multi-staff complexity unless explicitly requested.

## Documentation

- Product, business, UX, research, operation, scope, and requirements stay in `docs/`.
- Development docs also live in `docs/` until the project grows enough to need a separate structure.
- Keep `docs/README.md` updated when adding docs.
- Existing product docs such as PRD, queue direction, brand/UI specs, and owner questions remain authoritative for product decisions.

## Codebase Search

- When available, prefer `cocoindex-code` MCP `search` for semantic codebase search, broad repo exploration, fuzzy implementation lookup, and unfamiliar modules.
- If the MCP tool is unavailable but the CLI exists, use `ccc search` for semantic search and `ccc index` or `ccc search --refresh` when the index may be stale.
- Use CocoIndex/ccc as a locator, then read exact source ranges before editing or making strong claims.
- Use `rg` for exact text, regex, symbol, and filename search.
- Go directly to file reads for known files or tiny lookups.

## Validation

- Run `pnpm build` from `app/` after code changes.
- If only docs changed, no app build is required.
- Do not run long-lived dev or preview servers unless asked.

## Git

- Do not commit unless explicitly asked.
- Stage specific files only when committing.
- Do not push unless explicitly asked.
