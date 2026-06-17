# Onboarding

## Current Reality

Dream Catcher is a React prototype for a barber/tattoo booking MVP. The product direction is a single-barber queue assistant: fast daily queue operations, customer self-service for haircut bookings, and tattoo requests that wait for review.

The app package is under `app/`. Product and implementation notes are under `docs/`.

## First Read

Read these first:

1. `AGENTS.md` — local rules for agents and contributors.
2. `docs/project-overview.md` — compact project and stack overview.
3. `docs/prd-dream-catcher-mvp.md` — product scope and single-barber direction.
4. `docs/queue-first-ux-direction.md` — UX direction for customer and admin queue flows.
5. `docs/development-commands.md` — verified local commands.
6. `docs/styling.md` — brand tokens, LINE Seed font, Tailwind v4, and UI primitive rules.

## Setup

```bash
cd app
pnpm install
pnpm dev
```

`pnpm dev` starts the Vite development server. Do not assume a backend is required for the current prototype.

## Common Work Loop

1. Read the relevant product doc or source file.
2. Keep the change small.
3. Preserve the current business logic.
4. Use existing UI primitives when possible.
5. Run `pnpm build` from `app/` after code changes.
6. Report touched files and validation result.

## Important Product Boundaries

- Haircut booking / queue can be immediate.
- Tattoo request starts as `pending_review`; it is not a confirmed appointment.
- Admin defaults to daily queue, not calendar-first scheduling.
- The MVP should stay useful for one main barber before expanding to multi-staff or SaaS.

## Generated / Local Artifacts

Ignored local artifacts include `.letta/`, `.agent-state/`, `.cocoindex_code/`, `.DS_Store`, `node_modules/`, and `dist/`.
