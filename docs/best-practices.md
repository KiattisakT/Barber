# Best Practices

## Current Reality

This is a single-package React prototype with product docs. The useful rule is to protect the product logic while iterating quickly.

## Product-Safe Development

- Preserve current business conditions during refactors.
- Keep haircut booking and tattoo request logic separate.
- Keep tattoo request status as `pending_review` until the shop confirms an actual appointment.
- Keep admin daily queue optimized for one working barber.
- Avoid adding salon-enterprise concepts before the MVP earns them.

## UI Implementation

- Use local UI primitives from `app/src/components/ui/`.
- Use `cn` for conditional classes.
- Keep form labels explicit; do not rely on placeholders only.
- Make admin actions large enough for a barber with limited attention/time.
- Keep customer UI mobile-first.
- Avoid dead buttons. If an action is not implemented, hide it, disable it clearly, or label it as mock/prototype.

## Data and State

Current state is local React state plus mock data. Treat it as prototype behavior, not final persistence.

When adding prototype interactions:

- use the existing `QueueItem` shape;
- use queue helpers from `queue-system.ts` when applicable;
- keep customer and admin reading the same queue state when possible.

## Documentation

- Update docs when product direction changes.
- Mark owner-unconfirmed details as assumptions or open questions.
- Keep development docs honest to current scripts and code.

## Validation

Run `pnpm build` from `app/` after code changes.

## Not Established Yet

Do not introduce or document as current:

- backend APIs;
- auth;
- payments/deposits;
- real LINE OA integration;
- database migrations;
- testing stack;
- deployment pipeline;
- multi-shop SaaS management UI.
