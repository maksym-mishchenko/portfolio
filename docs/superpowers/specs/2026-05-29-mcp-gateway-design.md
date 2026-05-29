# MCP Gateway — Zero-Trust Firewall for Model Context Protocol

**Status:** Design approved
**Date:** 2026-05-29
**Author:** Maksym Mishchenko
**Type:** Open-source tool (portfolio showcase: backend + distributed systems + security)

---

## Problem

AI agents (Claude Desktop, Cursor, OpenAI Agents SDK, etc.) connect to **MCP servers** that
expose tools — filesystem access, database queries, GitHub operations, shell commands. By
default there is **no enforcement layer** between the agent and these tools. The agent decides
what to call; the server executes. This has produced loud, real failures:

- *"Supabase MCP can leak your entire SQL database"* — HN 848 pts
- *"The 'S' in MCP stands for Security"* — HN 730 pts
- MCP launch itself — HN 872 pts; *"MCP: an (accidentally) universal plugin system"* — 808 pts

There is no widely-adopted, self-hostable tool that lets a developer say **"this agent may do
exactly these things and nothing else,"** enforce it, and prove what happened. Existing "MCP
gateways" are routing-focused, not enforcement-focused.

## Goal

A single-binary, self-hostable **deny-by-default firewall** that sits between an AI agent and
its MCP servers. It enforces a reviewable, policy-as-code trust posture, prompts a human for
anything not yet decided (trust-on-first-use), and records every decision in a tamper-evident
audit log. The headline promise:

> **Deny-by-default firewall for MCP. Your agent does exactly what you allow — nothing else.**

### Non-goals (v1)

- HTTP/SSE / Streamable-HTTP transport (architected for, not shipped in v1)
- Multi-tenant / hosted SaaS mode
- ML-based prompt-injection detection (v1 uses deterministic pattern rules only)
- Policy management UI for *editing* rules (v1 edits the YAML file; UI only approves/denies)

## Success Criteria

- A developer adds **one line** to their Claude Desktop / Cursor config and is protected.
- The 60-second demo runs end to end (see Demo).
- `go test -race` passes; fail-closed behaviors are proven by tests.
- README + prebuilt binaries for macOS/Linux/Windows on first release.

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Transport (v1) | **stdio proxy** | ~90% of MCP usage today; one-line adoption. Core is transport-agnostic so HTTP drops in later. |
| Policy model | **Declarative YAML + TOFU prompts** ("the hard way") | Policy-as-code reviewability (the zero-trust story) + interactive approval for the demo wow. |
| Enforcement layers | **Tool-level + argument-level constraints** | Arg constraints (e.g. path sandbox) block the actual attack classes, not just tool on/off. |
| Approval surface | **Local web UI (SSE)** | Doubles as the live audit dashboard; the demo money-shot. |
| Language | **Go** | Single static binary (critical for a drop-in proxy), infra-tool cred, strong concurrency primitives. |
| Audit storage | **SQLite + hash chain** | Zero-config single-binary promise; tamper-evidence is a strong, demoable security property. |

---

## Architecture

### Data flow

```
AI Agent ──spawns(stdio)──▶ mcp-gateway ──spawns child──▶ Real MCP Server
                                │
                  per JSON-RPC tools/call:
                    1. parse
                    2. Policy Engine → ALLOW | DENY | UNKNOWN
                    3a. UNKNOWN/ask → park call, push to web UI, await human (fail-closed timeout)
                    3b. DENY → JSON-RPC error to agent
                    3c. ALLOW → forward to child, stream response back
                    4. append decision to SQLite hash-chain audit log
                                │
                    Local Web UI (localhost:7000): live approval cards (SSE) + audit dashboard + verify-chain
```

The gateway transparently proxies all non-`tools/call` traffic (initialize, notifications,
`tools/list`, etc.). It only intercepts and gates `tools/call`.

### Components (each independently testable)

1. **stdio proxy / child manager** — spawns and supervises the real MCP server; frames and
   relays JSON-RPC over stdin/stdout. Owns process lifecycle (teardown on agent disconnect,
   error propagation on child crash, no orphan processes).
2. **JSON-RPC codec** — parse/serialize framed MCP messages; pass through unknown/malformed
   messages untouched (never break a protocol we don't understand).
3. **Policy engine** — pure function: `(server, tool, args, policy) → Verdict`. Tool-level
   allow/deny/ask + argument constraints (`within`, `matches`, `equals`, `one_of`) + egress
   allowlist. Deny-by-default for anything unmatched (→ UNKNOWN).
4. **Approval coordinator** — `map[requestID] → chan Verdict`; parks UNKNOWN/ask calls without
   blocking the reader; resolves on human response or fail-closed timeout.
5. **Audit log** — SQLite, append-only, hash chain: `hash = sha256(prev_hash || canonical(entry))`.
   Supports append, stream (for UI), and full-chain verify.
6. **Web server** — serves the console UI; SSE for live approval + audit feed; HTTP endpoints
   for approve/deny and chain verification.

### Concurrency model

- **Reader goroutine** — reads framed messages from agent stdin.
- **Writer goroutine** — single funnel for all writes to agent stdout (no concurrent-writer
  corruption); fed by a bounded channel.
- **Child manager** — pipes to/from the real server; supervises it.
- **Approval coordinator** — parks calls in a pending map; resumes via per-request channel.

**Backpressure:** bounded channels; if audit writer or approval queue backs up, the reader
slows rather than growing memory unboundedly.

**Fail-closed everywhere (the zero-trust principle made concrete):**

| Condition | Behavior |
|-----------|----------|
| Approval times out (configurable N s) | **Deny**, logged |
| Audit write fails | **Deny** the call (an unlogged action violates the guarantee) |
| Child server crashes | Return errors for in-flight calls; exit cleanly so agent doesn't hang |
| Agent disconnects | Tear down child; no orphan process |
| Malformed JSON-RPC | Pass through untouched |

---

## Policy Model

Developers express trust in a git-friendly `mcp-policy.yaml`. **Deny-by-default**: anything
unmatched becomes UNKNOWN → human prompt.

```yaml
version: 1
default: deny          # anything unmatched → UNKNOWN (prompt human)

servers:
  filesystem:
    command: ["npx", "-y", "@modelcontextprotocol/server-filesystem", "/Users/me/safe"]
    tools:
      read_file:
        allow: true
        constraints:
          path: { within: ["/Users/me/safe"] }   # arg-level guard
      write_file:
        allow: false                             # explicit deny
      list_directory:
        allow: true

  github:
    command: ["npx", "-y", "@modelcontextprotocol/server-github"]
    egress:
      allow: ["api.github.com"]                  # network allowlist
    tools:
      search_repositories: { allow: true }
      create_issue:
        allow: ask                               # force TOFU prompt every time
```

- **Per-tool outcomes:** `allow: true` / `allow: false` / `allow: ask` + catch-all `default: deny`.
- **Argument constraints (v1 matchers):** `within` (path prefix), `matches` (regex),
  `equals`, `one_of`. This is what blocks `read_file('/etc/passwd')` and the
  "leaked my whole DB" attack class.
- **Egress allowlist:** per-server permitted network domains (enforced where the transport
  permits interception).
- **Write-back:** "Always allow" in the UI appends the resolved rule to the file with an
  auto-added comment + timestamp.
- **Principle:** the policy file is reviewable in a PR — a security person reads it and knows
  exactly what the agent can do.

---

## Web UI (Approval + Audit Console)

Aesthetic: a **security console** (think Linear / Sentry / k9s), not a generic dashboard.
Monospace for all machine data, hairline borders, dense aligned grid, restrained semantic
color (allow=green, deny=red, ask=amber), keyboard shortcuts, an `armed · deny-by-default`
status pill. No emoji-icons, no gradients, no floating cards.

- **Pending approval (SSE):** server→tool, real arguments (syntax-highlighted), countdown
  timer (fail-closed), threat flags (e.g. "secret pattern matched in body"). Buttons:
  Deny (`D`) / Allow once (`A`) / Always allow (`⇧A`).
- **Audit stream:** live, color-coded decisions with reason + timestamp; "Verify chain"
  button that recomputes the hash chain and shows ✓ / ✗; a tamper-detection row renders
  distinctly when a hash mismatch is found.
- **Responsive:** primarily a desktop tool (localhost); collapses to a clean single-column
  layout under 640px (rail hidden, audit rows reflow) so it never looks broken.

UI reference mockup validated at all four viewports (375 / 768 / 1280 / 1920) during design.

---

## Demo (the 60-second money-shot)

1. Point Claude/Cursor at a filesystem MCP server **through the gateway** (one config line).
2. Ask the agent to read a file in the sandbox → **ALLOW**, works instantly.
3. Ask it to write to `/etc/hosts` → **DENY** (arg constraint), agent blocked, red row appears.
4. Ask it to call an unlisted tool → **approval card pops in the browser** → click Deny → agent blocked.
5. Click "Verify chain" → green ✓. Hand-edit a row in SQLite, re-verify → red ✗ (tampering detected).

---

## Testing Strategy

Tests are the credibility of a security tool.

- **Unit:** policy verdict matrix (allow/deny/ask/unknown × tool-level × arg constraints);
  hash-chain append + verify + tamper-detection.
- **Integration:** fake echo MCP server; drive real JSON-RPC through the gateway; assert
  verdicts and audit rows. Table-driven.
- **Concurrency:** `go test -race` on approval coordinator + writer funnel; park N calls and
  resume out of order.
- **Fail-closed proofs:** audit-write-fails → deny; approval-timeout → deny; child-crash → no hang.

---

## Repo Polish & Distribution

- **README:** 15s animated GIF of the deny + browser-approval moment; "Why" section citing the
  real MCP security incidents; 3-line quickstart; policy example; architecture diagram.
- **Governance files:** `SECURITY.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, Apache-2.0 license.
- **CI (GitHub Actions):** `go test -race`, `go vet`, `golangci-lint`; build matrix
  darwin/linux/windows × amd64/arm64.
- **examples/**: ready-to-run policy files for filesystem, github, postgres servers.
- **Distribution:** GoReleaser → GitHub Releases prebuilt binaries; `go install`; Homebrew tap.
  One-line Claude Desktop / Cursor config snippet in README.

**Repo name:** `mcpgate` (primary candidate) — clear, brandable. Alt: `portcullis` (security metaphor).

---

## Phasing

- **Phase 1 (v1, this spec):** stdio proxy, declarative policy + arg constraints, TOFU approval,
  local web console, SQLite hash-chain audit, tests, README, binaries.
- **Phase 2:** HTTP/SSE (Streamable HTTP) transport via the transport-agnostic core; multi-server
  fan-out; Postgres audit backend option.
- **Phase 3:** richer threat heuristics (prompt-injection / tool-poisoning detection), signed
  server allowlists / capability manifests, policy-editing UI.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| MCP ecosystem cools off | Core (policy engine, hash-chain audit, stdio proxy) is reusable; the dist-sys/security craft stands alone as a portfolio piece. |
| Space gets crowded by competitors | Differentiate on *enforcement + arg-level constraints + tamper-evident audit*, not routing. v1 ships narrow but deep. |
| Scope creep | Strict non-goals; arg constraints limited to 4 matchers; UI approves but does not edit policy. |
| Go ramp-up time | Multi-language background (Java/C#/Python/TS); "learned Go building this" is itself an interview asset. |
