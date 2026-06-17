# Commit Guide

## Current Reality

The repo currently has one observed commit:

```text
Initialize Dream Catcher booking app.
```

No project-specific commit convention is established beyond concise imperative-style messages.

## Before Committing

Only commit when explicitly asked.

Before creating a commit:

1. Run `git status --short`.
2. Review relevant diffs.
3. Avoid committing ignored/local artifacts such as `.DS_Store`, `.letta/`, `.agent-state/`, `.cocoindex_code/`, `node_modules/`, and `dist/`.
4. Stage specific files instead of using broad `git add .` when possible.
5. Run `pnpm build` from `app/` if code changed.

## Message Style

Preferred until a stronger convention is established:

```text
Verb concise subject.
```

Examples:

```text
Refine customer queue flow.
Add tattoo request prototype.
Document development commands.
```

## Not Established Yet

The repo does not currently define:

- Conventional Commits requirement;
- emoji commit format;
- PR template;
- pre-commit hooks;
- CI checks.
