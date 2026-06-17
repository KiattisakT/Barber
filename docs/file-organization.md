# File Organization

## Current Reality

```txt
.
├── AGENTS.md
├── app/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── public/
│   │   ├── brand/
│   │   ├── fonts/line-seed/
│   │   └── ui-assets/
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── styles.css
│       ├── components/ui/
│       ├── features/admin/
│       ├── features/customer/
│       ├── lib/
│       └── pages/
└── docs/
```

## Source Areas

### `app/src/App.tsx`

Owns route wiring and shared in-memory queue state.

Customer and admin page implementations now live in `app/src/pages/`.

### `app/src/pages/`

Current page files:

- `customer-booking-page.tsx` — customer home, queue ticket, advance booking, tattoo request, and my-queue views.
- `admin-page.tsx` — admin daily queue, queue board, detail panel, tattoo review, blocked time, and walk-in dialog.

These page files should act as controllers: state, derived data, handlers, and view composition.

### `app/src/features/customer/`

Current extracted customer components:

- `customer-home.tsx` — customer home, LINE state display, ticket preview/actions, service selection, tattoo request entry, and bottom nav.
- `my-queue-view.tsx` — customer ticket detail, progress timeline, LINE notification switch, and cancel UI.
- `advance-booking-view.tsx` — haircut advance booking service/date/time/contact/confirmation UI.
- `tattoo-request-view.tsx` — tattoo request contact/detail/pending-review UI.

`customer-booking-page.tsx` now acts mostly as the customer controller: state, derived data, handlers, and view selection.

### `app/src/features/admin/`

Current extracted admin components:

- `admin-sidebar.tsx` — shop identity, admin navigation, daily status mini-card.
- `admin-header.tsx` — page heading and top-level actions.
- `focus-action-card.tsx` — “งานต่อไป” decision card and primary actions.
- `admin-summary.tsx` — summary metric cards.
- `now-next-cards.tsx` — current/next queue workbench cards.
- `admin-queue-board.tsx` — queue filters, queue rows, and row-level status actions.
- `queue-detail-panel.tsx` — selected queue detail, contact buttons, status/cancel actions.
- `tattoo-review-card.tsx` — pending tattoo request list and confirm action.
- `blocked-time-card.tsx` — blocked time list and add-block action.
- `walk-in-dialog.tsx` — add walk-in form dialog.

`admin-page.tsx` now acts mostly as the admin controller: state, derived data, handlers, and composition.

### `app/src/components/ui/`

Local shadcn-style primitives:

- `button.tsx`
- `badge.tsx`
- `card.tsx`
- `input.tsx`
- `label.tsx`
- `native-select.tsx`
- `separator.tsx`
- `switch.tsx`
- `textarea.tsx`

Use these primitives before creating raw one-off controls.

### `app/src/lib/`

Current library files:

- `booking-dates.ts` — booking date generation and time-range helpers.
- `mock-data.ts` — mock domain types and seed data.
- `queue-display.ts` — status labels, status classes, source labels, and next-action labels.
- `queue-system.ts` — queue filtering, queue number, status transition, and walk-in helper logic.
- `utils.ts` — shared utilities such as `cn`.

### `docs/`

Product, UX, brand, and development docs live here. Keep docs factual and mark assumptions.

## Preferred Refactor Shape

The page split exists. When continuing the refactor, prefer this direction:

```txt
app/src/
├── pages/
│   ├── customer-booking-page.tsx
│   └── admin-page.tsx
├── features/
│   ├── customer/
│   └── admin/
├── components/ui/
└── lib/
```

Adopt this only through behavior-preserving splits. Do not move files just to satisfy a shape.

## Not Established Yet

The repo has no established folders for:

- backend APIs
- database schema
- services layer
- custom hooks library
- test fixtures
- i18n catalogs
