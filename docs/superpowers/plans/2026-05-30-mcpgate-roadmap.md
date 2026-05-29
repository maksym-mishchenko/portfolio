# mcpgate — Multi-Year Product Roadmap

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement any release plan task-by-task.

**Goal:** Turn a Zero-Trust MCP Gateway from a solo portfolio piece into a production-grade,
community-adopted open-source security tool for the AI-agent ecosystem.

**Architecture:** Go single binary, stdio proxy behind a `Transport` interface; observe-mode
default with opt-in enforce; SQLite hash-chain audit; local web console; zero-config first run.

**Source spec:** `docs/superpowers/specs/2026-05-29-mcp-gateway-design.md`

**Critique sources (inputs to this roadmap):**
- Architect review: component boundaries, concurrency, fail-closed gaps, transport seam, audit integrity
- Go coder review: codec robustness, child lifecycle, park/resume, cgo trap, test plan
- Security review: threat model scoping, surfaces missed, path sandbox, hash chain limits, UI auth
- Product review: adoption friction, observe-first reframe, competitive positioning, demo story

---

## How to read this roadmap

Each release has:
- A **theme** (the one thing a user takes away)
- **Critique items addressed** (traceability to the four reviews)
- **Engineering deliverables** (what gets built)
- **Done-when** criteria (the observable outcome, not intentions)

Releases are sized for a **strong solo Go developer** building part-time. They are shippable
individually — each one is a complete, testable, usable tool.

---

## Release v0.1 — "See what your agent does"

**Theme:** Zero-config visibility. Drop the binary in, point one server entry at it, watch
everything your agent calls in real time. No policy, no friction, immediate value.

**Target:** Q3 2026 (~3 months part-time)

### Critique items this resolves

| Source | Issue | Resolution |
|--------|-------|-----------|
| Product | Deny-by-default first-run breaks the agent | Observe mode is the default; enforcement is opt-in |
| Product | "One-line adoption" overstated | README shows "change one server entry" with exact per-agent snippets |
| Architect | No concrete Transport interface | `Transport{Recv/Send/Close}` defined; stdio is the only impl |
| Architect | Child crash + parked approvals = deadlock | Child manager broadcasts `done`; coordinator drains to DENY |
| Coder | `bufio.Scanner` 64KB cap | Use `bufio.Reader.ReadString('\n')` |
| Coder | JSON-RPC batch smuggles gated call | Split arrays; classify each element individually |
| Coder | `mattn/go-sqlite3` (cgo) breaks single-binary | Use `modernc.org/sqlite` (pure Go) throughout |
| Coder | Canonical hash diverges at verify time | Pin canonical form; store hashed bytes; golden tests |
| Coder | Goroutine leaks not caught by `-race` | Add `uber-go/goleak` to coordinator + funnel tests |
| Coder | Fuzz the codec | `go test -fuzz` on the JSON-RPC reader |
| Coder | Cross-platform orphan/zombie/deadlock | Process groups (Unix) + Job Objects (Windows); stderr-drain goroutine |
| Security | Only `tools/call` gated; `resources/read` is open | Gate both methods as first-class policy surfaces |
| Security | Malformed passthrough is fail-open | Cannot classify a frame → deny/drop, never forward |
| Security | PATH trap for GUI-launched agents | Explicit PATH handling; documented in README |
| Architect | Policy hot-reload unspecified | mtime-check reload on every call evaluation |

### Engineering deliverables

**Binary**
- `mcpgate` Go binary; cross-compiles (no cgo) for darwin/linux/windows × amd64/arm64
- Subcommands: `mcpgate run --config mcp-policy.yaml` (starts the proxy)
- Environment: reads `MCPGATE_PORT` (default 7000), `MCPGATE_TOKEN` (auto-generated if absent)

**Core proxy**
- `internal/transport/transport.go` — `Transport` interface + `StdioTransport` impl
- `internal/proxy/proxy.go` — engine; takes two `Transport` values (agent-side, server-side);
  knows nothing about processes or file descriptors
- `internal/codec/codec.go` — `bufio.Reader`-based newline-delimited reader; splits batch arrays;
  classifies `tools/call`, `resources/read`, and "benign" methods; returns `ErrCannotClassify`
  (caller must deny)

**Child manager** (`internal/child/manager.go`)
- Spawns server command from policy config
- Unix: `SysProcAttr{Setpgid:true}` + `syscall.Kill(-pgid, SIGTERM/SIGKILL)` after grace period
- Windows: `CreateProcess` with Job Object + kill-on-close flag
- Dedicated `stderr-drain` goroutine (prevents deadlock on full OS pipe buffer)
- Exactly-once `Wait` (no zombies)
- Broadcasts `done chan struct{}` on process exit
- Uses Go 1.20+ `Cmd.Cancel`/`WaitDelay` with group-aware cancel

**Policy engine** (`internal/policy/engine.go`)
- Pure function: `Evaluate(server, method, name, args, policy) -> Verdict`
- Methods: `tools/call`, `resources/read`
- Verdicts: `ALLOW`, `DENY`, `UNKNOWN` (→ prompt in interactive mode, deny in headless)
- Tool/resource-level `allow: true|false|ask`
- Arg constraints v1: `within` (path containment), `matches` (regex), `equals`, `one_of`
- `within`: `filepath.Clean` → reject `..`/relative → component-wise containment → `EvalSymlinks`
  → re-check after resolution. Documented as defense-in-depth with TOCTOU caveat.
- `matches`: stdlib `regexp` (RE2, no backtracking DoS); auto-wrapped in `\A(?:...)\z`; input
  length-capped (4KB) before matching; expert-only warning in docs
- Deny-by-default (anything unmatched → `UNKNOWN`)
- mtime-check policy reload on every evaluation (< 1ms for a single YAML file)
- `observe` mode: always returns `ALLOW`, still records to audit log

**Approval coordinator** (`internal/approval/coordinator.go`)
- `map[serverName+":"+requestID] -> chan Verdict` (buffered cap 1)
- Parks `UNKNOWN`/`ask` calls without blocking the reader goroutine
- Single-resolution guard: resolve-and-delete under one `sync.Mutex`; `sync.Once` per entry
- `context.WithTimeout` for fail-closed; `defer` map cleanup on every exit path
- Selects on `child.Done()` — on child crash, drains all pending to `DENY("downstream_crash")`
- Headless mode: `UNKNOWN`/`ask` calls are immediately denied (no coordinator needed)

**Audit log** (`internal/audit/log.go`)
- `modernc.org/sqlite`, WAL mode, `busy_timeout=5000`
- Single-writer goroutine (hash chain serializes appends anyway)
- Schema: `id INTEGER PRIMARY KEY`, `seq INTEGER UNIQUE NOT NULL`, `method TEXT`, `server TEXT`,
  `name TEXT`, `args_json TEXT`, `verdict TEXT`, `reason TEXT`, `ts_unix INTEGER`,
  `prev_hash TEXT`, `hash TEXT`, `status TEXT` (`PENDING`|`DONE`)
- **Write-ahead**: insert `PENDING` before forwarding; update to `DONE` with verdict after
- `canonical()`: sorted keys, no insignificant whitespace, `strconv.FormatFloat` for numbers,
  UTF-8. Pinned test vectors (golden bytes) so verify-time re-hash is byte-identical.
- Startup: if `PENDING` row found → insert gap-sentinel row, log warning
- Implements `AuditStore` interface so tests can inject a failing store → assert deny

**Web console** (`internal/web/`)
- Serves `127.0.0.1:7000` only (never `0.0.0.0`)
- Per-session token: generated at startup, written to `$XDG_RUNTIME_DIR/mcpgate.token` (mode
  `0600`), also printed to stderr. All state-changing HTTP endpoints require
  `Authorization: Bearer <token>`
- `Origin` + `Host` header validation on every request (anti-DNS-rebinding)
- `SameSite=Strict` on session cookie
- SSE endpoint: `/events` streams `AuditEntry` JSON to the live-feed panel
- HTTP endpoints: `POST /approve/{id}`, `POST /deny/{id}`, `GET /verify-chain`
- UI aesthetic: security-console (monospace data, hairline borders, semantic color, keyboard
  shortcuts) — matches the `console-design.html` mockup validated in design phase
- `observe` / `armed · deny-by-default` status pill in header
- **"Generate starter policy"** button: groups observed calls by server/tool/resource →
  produces a draft `mcp-policy.yaml` with `allow: ask` for everything seen; user downloads/saves

**Tests**
- Policy engine: full verdict matrix table-driven (allow/deny/ask/unknown × method × arg type)
- `within` edge cases: `..` traversal, prefix-vs-component, symlink, macOS case, unicode NFC/NFD,
  relative paths, non-absolute
- Codec fuzz: `go test -fuzz=FuzzCodec` — truncated lines, >64KB lines, embedded newlines,
  invalid UTF-8, batch arrays, duplicate keys, string-vs-int IDs, notifications (no `id`)
- Canonical hash golden tests: pin exact `[]byte` for 5 representative entries
- Approval coordinator: park N calls, resume out of order; double-resolution race; timeout deny;
  child-crash drain; `goleak` asserts no leaks after each scenario
- Fail-closed proofs: `AuditStore` fake that returns error → assert `DENY`; approval timeout
  `context.WithTimeout(1ms)` → assert `DENY`; headless `UNKNOWN` → assert `DENY`
- Process lifecycle (Linux + Windows in CI): spawn echo-server; kill gateway; assert no child PID
  survives; assert no zombie; assert stderr-drain prevents deadlock
- `go test -race` on all packages

**Distribution / repo polish**
- `SECURITY.md`: threat model verbatim (defends-against / does-NOT-defend-against); no
  over-claims on egress, path sandbox, or hash chain
- `DESIGN.md`: concurrency model, fail-closed matrix, Transport seam rationale, `within`
  limitations — the senior-engineer narrative for hiring managers / interviewers
- `README.md`: 15s GIF (live feed → deny `/etc/passwd` → tamper detection); "Why" section with
  HN citations; quickstart; copy-paste Claude Desktop + Cursor config snippets with PATH note;
  `examples/` for filesystem + github servers
- GoReleaser: darwin/linux/windows × amd64/arm64; pure-Go → no per-target C toolchain
- GitHub Actions: `go test -race`, `go test -fuzz` (30s), `goleak`, `go vet`, `golangci-lint`,
  build matrix, lifecycle tests on Linux + Windows runners

### Done-when

- `mcpgate run` proxies a real `npx`-based MCP server; `go test -race` green; `goleak` green
- Live feed shows real agent calls with zero config (observe mode)
- "Generate policy" produces valid YAML
- `go test -fuzz=FuzzCodec -fuzztime=30s` exits clean
- Process lifecycle test passes on both Linux and Windows CI runners
- Single static binary: `file mcpgate-linux-amd64` reports statically linked (no libsqlite3.so)
- `SECURITY.md` and `DESIGN.md` are honest and complete

---

## Release v0.2 — "Control what your agent does"

**Theme:** Opt-in enforcement that works. Deny-by-default firewall for tool calls + resource
reads, TOFU human approval, headless CI mode, tools/list filtering.

**Target:** Q4 2026 (~2 months after v0.1)

### Critique items this resolves

| Source | Issue | Resolution |
|--------|-------|-----------|
| Architect | Backpressure: blocked reader stalls agent invisibly | Dispatcher (not reader) applies backpressure; hard cap → explicit error |
| Architect | Request-ID collision risk in future fan-out | Pending map keyed `serverName+":"+id` (already in v0.1, hardened) |
| Coder | `tools/list` shows denied tools to agent | Optional `tools/list` response filter: agent can only see what it can call |
| Coder | "One-line adoption" gap: source-of-truth duplication | Decide: server command lives in `mcp-policy.yaml` exclusively; README updated |
| Security | TOFU write-back writes broadest rule | Write narrowest rule (with matched arg constraints); `# AUTO-ADDED — REVIEW` block |
| Security | Approval-fatigue → policy poisoning | Rate-limit `Always allow`; show written rule text before confirmation |
| Security | Web UI: any local process can self-approve | Token already in v0.1; add `write_key` derivation so approval API rejects the server process |
| Product | Headless CI enforcement (no browser) | `mode: headless` in config or `--headless` flag → `UNKNOWN`/`ask` → deny |
| Product | TUI approval fallback for CLI users | Terminal-based approve/deny (arrow keys) as alternative to the browser UI |

### Engineering deliverables

**Enforce mode**
- `mode: enforce` in `mcp-policy.yaml` activates deny-by-default for all gated methods
- Policy engine already returns correct verdicts; proxy just acts on them (no engine changes)
- `--headless` / `mode: headless`: UNKNOWN/ask → immediate deny; no web UI required
- CI usage: `mcpgate run --config policy.yaml --headless` — safe to use in automated pipelines

**`tools/list` filtering** (`internal/proxy/list_filter.go`)
- Intercepts `tools/list` responses; removes tools the policy would deny or has not seen
- Makes the "agent literally cannot see what it can't use" story concrete
- Off by default; enable with `filter_tools_list: true` in config

**TUI approval** (`internal/tui/`)
- When `--no-browser` flag set, pending approvals print to the terminal with a simple
  `[A]llow once / [S]how args / [D]eny / [W]rite always-allow` prompt
- Uses `golang.org/x/term` for raw-mode input; no extra dependencies
- Falls back to stdin line-based prompt if not a TTY

**Write-back hardening**
- "Always allow" writes the **narrowest** rule: copies the matched arg constraints into the
  appended YAML block; never writes a bare `allow: true` without constraints
- Appended block is tagged `# AUTO-ADDED — REVIEW` and isolated from hand-authored rules
  (separate `auto_rules:` key); user must explicitly promote to `tools:` block in a PR
- Rate-limit: max 1 write-back per tool per 60s (blunts approval-fatigue campaigns)
- Terminal confirmation: shows the exact YAML that will be written; `[Y]es / [N]o`

**Dispatcher backpressure**
- Reader goroutine always drains into an in-process ring buffer (never blocked by downstream)
- Dispatcher applies pressure: if in-flight count > 1000 → log diagnostic + fail-closed teardown
  with explicit error to agent ("mcpgate: in-flight limit exceeded; closing connection")

**Tests**
- Enforce-mode end-to-end: real JSON-RPC through gateway with policy; assert verdicts
- Headless: UNKNOWN call → assert deny with no UI interaction
- TUI mock: inject approval events; assert correct verdict
- Write-back: assert narrowest rule written; assert rate-limit rejects second write within 60s
- `tools/list` filter: assert denied tools absent from response; assert allowed tools present
- Backpressure: inject 1001 in-flight calls; assert teardown diagnostic logged

### Done-when

- `go test -race ./...` green with enforce + headless + TUI paths covered
- End-to-end: filesystem server through gateway in enforce mode; `/etc/passwd` write → deny; new
  tool call → TUI approval; policy YAML updated with narrowest rule
- Headless: policy-only run in CI (no browser, no TTY) exits without hanging

---

## Release v0.3 — "Prove what your agent did"

**Theme:** Audit hardening + honest threat model in code, not just docs. Chain integrity for
compliance-minded users; optionally resist even a DB-write attacker.

**Target:** Q1 2027

### Critique items this resolves

| Source | Issue | Resolution |
|--------|-------|-----------|
| Security | Hash chain: full re-seal by attacker with DB write access | Optional HMAC-keyed chain |
| Architect | Crash between forward and audit-write | Write-ahead PENDING + gap sentinel (landed in v0.1; surfaced in docs) |
| Security | Truncation attack: delete last N rows, re-seal | Monotonic sequence numbers + genesis record detect truncation |
| Security | Verifier runs in same trust domain as DB writer | Export chain head + HMAC-signed manifest; can be anchored externally |
| Architect | No external anchoring | `mcpgate verify --export` prints signed head hash; user can pin to a git commit, Gist, etc. |

### Engineering deliverables

**HMAC-keyed hash chain** (`internal/audit/hmac.go`)
- Optional `audit_hmac_key_file: /path/to/key` in config
- Key file: 32 bytes random, mode `0400`; `mcpgate keygen` generates it
- Each row: `hash = sha256(prev_hash || canonical(entry) || HMAC-SHA256(key, seq || canonical))`
- Without the key, `verify` confirms internal consistency only (same as v0.1 behaviour)
- With the key, `verify` also validates the HMAC signature per row
- `mcpgate verify --export` prints `{seq, hash, hmac_sig, ts}` of the chain head as JSON;
  user pastes into a git commit message, a Gist, a Slack channel — any external anchor

**Genesis record**
- Row 0 is a `GENESIS` sentinel written at startup: timestamp, binary hash (`go version -m`),
  config file hash. Acts as a known starting point for truncation detection.
- Startup: if no GENESIS row → create one; if GENESIS exists → verify it matches expected binary

**Chain export + import** (`internal/audit/export.go`)
- `mcpgate export --out audit.jsonl` — writes the full chain as JSON Lines (one row per line);
  safe to share with a security reviewer without sharing the HMAC key (they verify structure, not
  signatures)
- `mcpgate verify --file audit.jsonl` — verifies a chain from an export file

**Grafana / log-shipper integration** (lightweight)
- `mcpgate run --audit-stdout` streams audit JSON to stdout (for `|` to a SIEM or log shipper)
- Documents a reference Grafana dashboard JSON for audit visualisation

### Done-when

- `go test -race ./...` green
- Tamper demo updated: hand-edit a row → HMAC failure printed alongside hash mismatch
- Truncation demo: delete last 3 rows → sequence-number gap detected
- `mcpgate export | mcpgate verify --file -` roundtrips successfully
- `mcpgate keygen` creates a well-formed key file; wrong key → verify FAIL

---

## Release v0.4 — "HTTP transport + real egress"

**Theme:** The security perimeter grows. The HTTP/SSE transport makes the gateway genuinely
in-network — egress allowlists actually work here. Multi-server fan-out.

**Target:** Q2 2027

### Critique items this resolves

| Source | Issue | Resolution |
|--------|-------|-----------|
| Architect | Transport seam: no concrete interface defined | Already locked in v0.1; this release is the payoff |
| Architect | Egress unenforceable for stdio | HTTP transport sits in network path; standard outbound proxy rules apply |
| Security | Egress allowlist for stdio is a no-op lie | Removed from v0.1; lands here as a real, enforced feature |
| Architect | Request-ID collision for fan-out | ID remapping/namespacing in fan-out coordinator |

### Engineering deliverables

**HTTP/SSE transport** (`internal/transport/http.go`)
- Implements `Transport` interface for MCP Streamable-HTTP transport
- Listens on a configurable port; the AI agent points at this endpoint
- Spawns (or connects to) upstream MCP servers via their HTTP endpoints
- `egress: allow: ["api.github.com"]` is enforced here via outbound HTTP proxy rules
  (per-server `http.Transport` with custom `DialContext` that blocks non-allowlisted hosts)

**Multi-server fan-out** (`internal/proxy/fanout.go`)
- Single gateway process handles multiple server blocks from `mcp-policy.yaml`
- Agent connects once; the gateway routes calls to the correct upstream by server name
- Request-ID remapping: gateway assigns internal IDs; remaps to/from agent-facing IDs to prevent
  cross-server collision
- `tools/list` aggregates across all allowed servers (filtered by policy)

**Postgres audit backend** (`internal/audit/postgres.go`)
- Optional `audit_backend: postgres` + `audit_dsn: postgres://...` in config
- Same `AuditStore` interface as SQLite; write-ahead + hash chain logic unchanged
- Useful for team deployments where multiple gateway instances share one audit log

### Done-when

- HTTP transport passes the same integration test suite as stdio transport
- Egress enforcement: HTTP-mode server blocked from reaching a non-allowlisted host
- Fan-out: two MCP servers behind one gateway; calls routed correctly; no ID collisions
- `go test -race ./...` green; all v0.1–v0.3 tests still pass

---

## Year 2 (2027–2028) — "The security surface grows"

Each of these is a separate release. Order by demand signals post-v0.4.

### v1.0 — Gating the remaining MCP surfaces

**What:** Gate `sampling/createMessage` (server→agent reverse calls) and `prompts/get` as
first-class policy surfaces — closing the last major unmediated MCP methods.

**Critique source:** Security review — "MCP has other harm-bearing surfaces beyond `tools/call`"

**Engineering notes:**
- `sampling/createMessage` is a reverse channel (server drives agent); the gateway must intercept
  it on the *server-to-agent* pipe and apply a policy for "what the server can ask the agent to do"
- Add `sampling:` and `prompts:` policy blocks to the YAML schema
- Update the threat model in `SECURITY.md` — v1.0 closes most of the "does NOT defend against" list

### v1.1 — Prompt-injection / tool-poisoning heuristics

**What:** Deterministic pattern matching (Phase 3 spec item) for detecting injection payloads in
tool arguments and resource content before forwarding to the agent.

**Critique source:** Security review — "Phase 3 heuristics"; Coder — "fuzz is attack surface"

**Engineering notes:**
- Pattern library: known injection signatures (ignore-previous-instructions, jailbreak fragments,
  exfiltration patterns like `base64(`)
- Verdict: `WARN` (new) — logged, flagged in UI, but not blocked unless `block_on_warn: true`
- False-positive rate is the risk; `WARN` + opt-in block is the safe default

### v1.2 — Policy-editing UI

**What:** The web console gains a policy editor — the user no longer has to edit YAML by hand to
promote an auto-added rule or modify an existing one.

**Critique source:** Product review — "policy-editing UI is a non-goal in v1; correct" (Phase 3)

**Engineering notes:**
- Show the policy YAML with syntax highlighting; allow inline edits; save writes back to file
- Require the session token + a `POST /policy` endpoint with the full new YAML as the body
- Diff view: before/after before saving; git-style change summary

### v1.3 — Signed server allowlists / capability manifests

**What:** MCP servers can publish a signed capability manifest declaring what tools/resources they
expose and what trust level they request. The gateway verifies the signature and warns if the
running server diverges from its manifest.

**Critique source:** Spec Phase 3; Security review — "supply-chain" angle

**Engineering notes:**
- Manifest format: JSON, signed with the server author's key (similar to `go.sum`)
- `mcpgate trust add <server-url>` fetches and pins the manifest
- Divergence = a new tool not in the manifest → prompt even if policy says `allow: true`

---

## Year 3 (2028–2029) — "Team and enterprise"

### v2.0 — Multi-user team deployment

- Shared Postgres audit backend (see v0.4)
- Role-based approval: specific humans can approve specific server/tool combos
- Policy stored in a shared git repo; gateway fetches on change
- Slack/Teams webhook for approval notifications (instead of just the browser UI)

### v2.1 — Compliance reports

- `mcpgate report --period 30d --format pdf` — generates an activity report suitable for a
  security review: tools called, denies, approvals, chain integrity status
- Targets: SOC 2 audit evidence, internal policy review

### v2.2 — SDK / embeddable library

- `go get github.com/maksym-mishchenko/mcpgate/sdk`
- Lets other Go projects embed the policy engine + audit log without the full proxy
- Use case: MCP server authors who want to self-enforce policies before executing

### v2.3 — SaaS / hosted option (optional)

- Hosted gateway-as-a-service for teams that don't want to self-host
- Shared audit storage; web-based team policy management
- Only if community traction justifies it — not on the critical path

---

## Critical path summary

```
v0.1 ─── foundation, observe mode, real proxy, honest audit
  │
v0.2 ─── enforce mode, headless CI, TOFU approval, write-back hardening
  │
v0.3 ─── audit integrity (HMAC, truncation, export)
  │
v0.4 ─── HTTP transport, real egress enforcement, fan-out
  │
v1.0 ─── close remaining MCP surfaces (sampling, prompts)
  │
v1.1 ─── injection heuristics (WARN mode)
  │
v1.2 ─── policy editor UI
  │
v1.3 ─── signed server manifests
  │
v2.0 ─── team / enterprise
```

---

## Critique-to-release traceability index

Every issue raised by the four critics is addressed in a specific release:

| Critic | Issue | Release |
|--------|-------|---------|
| Architect | No Transport interface | v0.1 |
| Architect | Child crash + pending deadlock | v0.1 |
| Architect | Malformed passthrough is fail-open | v0.1 |
| Architect | SQLite: crash between forward and audit-write | v0.1 |
| Architect | Egress unenforceable for stdio | v0.1 (removed); v0.4 (real) |
| Architect | Backpressure blocks reader invisibly | v0.2 |
| Architect | Request-ID collision for fan-out | v0.2 (namespaced keys); v0.4 (remapping) |
| Architect | Policy hot-reload unspecified | v0.1 |
| Coder | Scanner 64KB cap | v0.1 |
| Coder | JSON-RPC batch bypass | v0.1 |
| Coder | cgo breaks single-binary | v0.1 |
| Coder | Canonical hash non-determinism | v0.1 |
| Coder | goroutine leaks (goleak) | v0.1 |
| Coder | Fuzz codec | v0.1 |
| Coder | Child orphans/zombies/stderr deadlock | v0.1 |
| Coder | Windows process groups | v0.1 |
| Coder | Park/resume goroutine leaks | v0.1 |
| Coder | tools/list shows denied tools | v0.2 |
| Coder | "One-line" PATH trap | v0.1 |
| Security | Only tools/call gated | v0.1 |
| Security | Malformed = fail-open bypass | v0.1 |
| Security | Path `within` prefix-vs-component, symlinks | v0.1 |
| Security | RE2 anchoring, input cap | v0.1 |
| Security | Web UI localhost auth boundary | v0.1 |
| Security | Write-back broadens scope / approval fatigue | v0.2 |
| Security | Egress = no-op for stdio | v0.1 (removed); v0.4 (real) |
| Security | Hash chain: re-seal by attacker | v0.3 |
| Security | Truncation attack | v0.3 |
| Security | sampling/createMessage ungated | v1.0 |
| Security | prompts/get ungated | v1.0 |
| Product | Deny-by-default first-run breaks agent | v0.1 |
| Product | Firewall-first = adoption friction | v0.1 |
| Product | Headless CI enforcement | v0.2 |
| Product | TUI approval fallback | v0.2 |
| Product | "gateway" category naming | v0.1 (README positioning) |
| Product | Demo: observe-first story | v0.1 |
| Product | DESIGN.md for hiring managers | v0.1 |
| Product | tools/list filtering | v0.2 |
| Product | "impressive but unfinished" risk | v0.1 shippable thin slice |

---

*Roadmap drafted: 2026-05-30. Source: four-perspective critique of the design spec.*
*Next step: implementation plan for v0.1 (use superpowers:executing-plans or subagent-driven-development).*
