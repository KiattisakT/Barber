# Project Overview

## Current Reality

Dream Catcher is a Vite + React + TypeScript prototype for Dream Catcher Barber and Tattoo.

The prototype currently contains:

- Customer home with queue ticket concept.
- Walk-in ticket creation in local React state.
- Advance haircut booking flow with service/date/time/contact validation.
- Tattoo request flow that creates `pending_review` queue items.
- Admin daily queue screen for a single-barber operating model.
- Mock queue, services, blocked times, and UI assets.

There is no backend, database, auth, deployment setup, or real LINE integration yet.

## Product Shape

The app should first help a small shop with one main barber:

- reduce repeated chat/phone questions;
- prevent double-booking across walk-in, online, LINE/Facebook/phone channels;
- let customers see queue/wait context without asking the barber;
- help the barber remember customer, phone, service, note, status, and booking code;
- keep blocked time visible in the same daily queue context.

## Stack

Current code-proven stack:

- React 19
- React Router 7
- Vite 8
- TypeScript strict mode
- Tailwind CSS v4 via `@tailwindcss/vite`
- local shadcn-style UI primitives
- lucide-react icons
- pnpm

## Entry Points

- `app/src/main.tsx` — React root and `BrowserRouter`.
- `app/src/App.tsx` — route registry and shared queue state.
- `app/src/pages/customer-booking-page.tsx` — customer home, queue ticket, advance booking, tattoo request, and my-queue views.
- `app/src/pages/admin-page.tsx` — admin daily queue view and walk-in/block-time interactions.
- `app/src/features/customer/customer-home.tsx` — extracted customer home view.
- `app/src/features/customer/my-queue-view.tsx` — extracted customer queue detail view.
- `app/src/features/customer/advance-booking-view.tsx` — extracted haircut booking form/confirmation view.
- `app/src/features/customer/tattoo-request-view.tsx` — extracted tattoo request/pending review view.
- `app/src/features/admin/` — extracted admin daily queue sections: sidebar, header, summary, focus card, now/next cards, queue board, detail panel, tattoo review, blocked time, and walk-in dialog.
- `app/src/styles.css` — Tailwind import, theme tokens, LINE Seed font faces, app-specific CSS.
- `app/src/lib/mock-data.ts` — mock services, queue items, time slots, blocked time, and domain types.
- `app/src/lib/queue-system.ts` — queue helper functions.
- `app/src/lib/booking-dates.ts` — booking date and time-range helpers.
- `app/src/lib/queue-display.ts` — queue display labels, status classes, and next-action labels.
- `app/src/components/ui/` — local UI primitives.

## Routes

Current routes in `App.tsx`:

- `/` redirects to `/book/dream-catcher`
- `/book/dream-catcher` renders customer flow
- `/admin` renders admin daily queue
- unknown paths redirect to `/book/dream-catcher`

## Preferred Direction

The first page split has been done. The next structural step is to split the page files into smaller feature components while preserving behavior:

- `features/customer/*`
- `features/admin/*`

Do not do this refactor by changing business logic. Split first, then improve.
