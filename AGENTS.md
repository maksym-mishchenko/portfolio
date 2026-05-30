# AGENTS.md

> **Personal portfolio site (maksym.dev)**
> Stack: TypeScript/Next.js

## Quick Start

See `docs/adr/` for architectural decisions.

## Rules

- Follow existing code style and patterns
- Run tests before opening a PR
- Document architectural decisions in `docs/adr/`
- Keep this file ≤10 bullets, ≤400 tokens

## Key Paths

See repo README for project structure.

<!-- agent-memory:start (managed by scripts/seed-agent-memory.sh — edit canonical source: docs/operations/agent-memory-protocol.md) -->
## Agent Memory Protocol (condensed)

**Before work (substantive tasks):** read `.agent/STATE.md` (check `Last updated`); before changing a subsystem, `grep .agent/DECISIONS.md` for its tag. Trivial tasks: this file only.

**After work:** update `.agent/STATE.md` (merge, preserve untouched in-progress items). If a non-trivial decision was made, append a tagged entry to `.agent/DECISIONS.md`.

**Boundary:** cross-project/stack-wide → ADR in the `docs` repo; single-project → `.agent/DECISIONS.md`.

**Non-trivial =** a future agent would be confused or break something without knowing it.

Full protocol: `docs/operations/agent-memory-protocol.md` in the `docs` repo.
<!-- agent-memory:end -->
