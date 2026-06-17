# Formatting

## Current Reality

No formatter, linter, or style config is established in `package.json`.

TypeScript and Vite build are the only current automated checks.

## Rules

- Match existing formatting in nearby files.
- Keep JSX readable with small components after refactor.
- Avoid large behavior changes while formatting.
- Do not claim formatter or lint checks ran until scripts exist.

## Preferred Direction

When the project adds formatting, prefer a single command in `app/package.json` and document it in `docs/development-commands.md`.
