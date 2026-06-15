# Agent Instructions

This project is currently documentation-first. The existing `docs/README.md` is the source of truth for product/business/UX/research/operations/scope documents.

## Documentation

- Keep product, business, UX, research, operation, scope, and requirement documents in `docs/`.
- When information is not confirmed by the shop owner, label it as an assumption or open question.
- Add development-specific docs such as source setup, architecture, API contracts, migrations, or deployment only when implementation begins.

## Codebase Search

- When available, prefer `cocoindex-code` MCP `search` for semantic codebase search, broad repo exploration, fuzzy implementation lookup, and unfamiliar modules.
- If the MCP tool is unavailable but the CLI exists, use `ccc search` for semantic search and `ccc index` or `ccc search --refresh` when the index may be stale.
- Use CocoIndex/ccc as a token-saving first pass: avoid broad blind reads by narrowing the repo to candidate files and line ranges.
- Run semantic search from the repo root, or pass `--path`, because `ccc search` defaults to the current working directory scope.
- Treat semantic results as candidate locations: read only the returned file/ranges needed for verification with the available file-read tool or `sed -n` before editing or making strong claims.
- Use `rg` for exact text, regex, symbol, and filename search.
- Use AST-aware tools for syntax-shaped or structure-aware search.
- Go directly to `Read`, `rg`, or AST-aware tools for known files, exact symbols, or tiny lookups; CocoIndex is a locator, not a replacement for source reads.
- Treat requests like `search the codebase`, `find where X is implemented`, `how does this repo work`, `ดู repo หน่อย`, `หาโค้ดส่วนนี้`, and `สรุปไฟล์นี้` as CocoIndex-first triggers when they require broad or fuzzy repo understanding.
- After meaningful code changes, refresh or re-index before relying on semantic search results that may be stale.
