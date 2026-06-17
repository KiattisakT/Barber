# State Management

## Current Reality

State is local React state.

`App.tsx` owns shared queue state and passes it into customer/admin pages. Customer actions can add queue items; admin actions can transition item statuses.

There is no Redux, Zustand, TanStack Query, backend cache, or server state layer.

## Current Queue State Shape

Queue data uses the `QueueItem` type from `app/src/lib/mock-data.ts`.

Queue helpers live in `app/src/lib/queue-system.ts`:

- active filtering
- pending tattoo filtering
- checked-in filtering
- next customer lookup
- visible queue filtering
- queue number generation
- status transition
- walk-in item creation

## Rules

- Keep customer and admin reading the same queue state in prototype flows.
- Use helper functions for queue behavior instead of duplicating conditions in JSX.
- Preserve the one-active-work-item rule when moving an item to `in_progress`.
- Keep tattoo request as `pending_review` until shop review.

## Preferred Direction

If persistence is added later, keep queue domain logic separated from UI rendering. A backend/API layer can replace mock state only after product behavior is stable.
