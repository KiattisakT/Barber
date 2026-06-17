# Imports

## Current Reality

The app uses relative imports. No path alias is established in Vite or TypeScript config.

Examples:

```ts
import { Button } from './components/ui/button'
import { cn } from './lib/utils'
```

## Rules

- Use relative imports until an alias is configured.
- Import UI primitives from `app/src/components/ui/` rather than duplicating component code.
- Import shared queue helpers from `app/src/lib/queue-system.ts`.
- Import domain/mock types from `app/src/lib/mock-data.ts`.
- Verify icon exports before using new lucide icons.

## Preferred Direction

If the app grows, aliases such as `@/components` or `@/lib` may be useful, but they are not current reality.
