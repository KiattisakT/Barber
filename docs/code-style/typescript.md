# TypeScript Style

## Current Reality

The app uses strict TypeScript with these notable compiler settings in `app/tsconfig.json`:

- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `erasableSyntaxOnly: true`
- `noFallthroughCasesInSwitch: true`
- `jsx: react-jsx`
- `moduleResolution: bundler`

`pnpm build` runs `tsc && vite build`.

## Rules

- Use arrow functions for components, helpers, handlers, and exported utilities. Avoid `function` declarations in app source unless a future tool/library requires one.
- Keep exported domain types close to the mock/domain data until a real model layer exists.
- Prefer explicit union types for product states, such as `QueueStatus` and `QueueView`.
- Do not leave unused imports, locals, or parameters; the build will fail.
- Keep parsing-safe numeric values. Do not paste formatted numeric literals like `1,247` into TypeScript objects.
- Use `type` imports for types when importing from modules that also export runtime values.

## Current Domain Types

`app/src/lib/mock-data.ts` currently defines:

- `ServiceCategory`
- `QueueStatus`
- `Service`
- `QueueItem`
- `BlockedTime`

Preserve these until a real data model replaces them.
