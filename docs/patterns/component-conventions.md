# Component Conventions

## Current Reality

The app has local shadcn-style UI primitives under `app/src/components/ui/`.

`App.tsx` now owns route wiring and shared queue state. Current page flows live in:

- `app/src/pages/customer-booking-page.tsx`
- `app/src/pages/admin-page.tsx`

## UI Primitive Rules

Use existing primitives for app controls and repeated UI surfaces:

- Buttons: `Button`
- Badges/status: `Badge`
- Surfaces: `Card` and subcomponents
- Forms: `Input`, `Label`, `Textarea`, `NativeSelect`, `Switch`
- Dividers: `Separator`

Do not add raw `<button>`, `<input>`, `<select>`, `<textarea>`, or ad-hoc card surfaces in feature code when a local primitive can express the same behavior.

Use `cn` for conditional classes.

## Page/Feature Split Direction

The first page split has been done. The next behavior-preserving split is feature components:

```txt
app/src/features/customer/
├── customer-home.tsx        # current
├── my-queue-view.tsx        # current
├── advance-booking-view.tsx # current
└── tattoo-request-view.tsx  # current

app/src/features/admin/
├── admin-sidebar.tsx
├── admin-header.tsx
├── admin-summary.tsx
├── focus-action-card.tsx
├── now-next-cards.tsx
├── admin-queue-board.tsx
├── queue-detail-panel.tsx
├── tattoo-review-card.tsx
├── blocked-time-card.tsx
└── walk-in-dialog.tsx
```

The customer and admin feature splits are now in place. Continue by keeping page files as controllers and extracting only when a section has a clear owner.

## Customer Components

Customer components should stay mobile-first and avoid dead actions. If an action is not ready, make the state clear.

## Admin Components

Admin components should optimize for short attention windows:

- clear current/next queue;
- large primary actions;
- short Thai copy;
- status as next action, not decorative badge only.

## Not Established Yet

No custom hook pattern, service layer pattern, or route module pattern is established in code yet.
