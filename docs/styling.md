# Styling

## Current Reality

The app uses Tailwind CSS v4 through `@tailwindcss/vite`. Styling is centered in `app/src/styles.css` plus utility classes in components.

Current style assets and tokens include:

- LINE Seed Sans TH local font files under `app/public/fonts/line-seed/`.
- Tailwind theme tokens in `app/src/styles.css`.
- Warm barber/tattoo palette: ink, charcoal, ivory, paper, stone, muted, copper.
- Ticket-specific CSS helpers: `.ticket-card`, `.ticket-number`, `.stamp`, `.stamp-wait`.

## Font

Use `LINE Seed Sans TH` as the main UI font through `--font-sans`.

Do not reintroduce Google `Noto Sans Thai` unless the team changes direction.

## Tailwind v4 Notes

- `@import 'tailwindcss';` is used in `styles.css`.
- Theme tokens are defined with `@theme`.
- Do not add Tailwind v3-style config or directives unless the project migrates.

## UI Primitive Direction

Use local shadcn-style primitives from `app/src/components/ui/`:

- `Button`
- `Badge`
- `Card` / `CardHeader` / `CardContent` / `CardTitle` / `CardDescription`
- `Input`
- `Label`
- `NativeSelect`
- `Separator`
- `Switch`
- `Textarea`

Compose with these instead of writing raw controls or repeated surfaces. Raw controls in feature code should be the exception, not the default.

## Customer UI Rules

- Mobile-first.
- Use clear selected states for services, dates, and time slots.
- Keep tattoo request visibly separate from haircut queue/booking.
- Avoid repeated summary cards when selected state already communicates the same information.

## Admin UI Rules

Admin is for a barber with limited attention while working.

- Prioritize “what is happening now” and “what to do next”.
- Prefer large touch targets for critical actions.
- Keep copy short and action-oriented.
- Daily queue beats calendar complexity for MVP.

## Preferred Direction

Keep the UI calm, warm, and practical. Copper should be an accent for CTA/selection/focus, not heavy decoration.
