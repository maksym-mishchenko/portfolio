# MCP Gateway — Zero-Trust Firewall for Model Context Protocol

**Status:** Design approved — revised after multi-perspective review (architect / Go coder / security / product)
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

A single-binary, self-hostable proxy that sits between an AI agent and its MCP servers. It
**observes** everything the agent does (zero-config), and can **enforce** a reviewable,
policy-as-code trust posture — prompting a human for anything not yet decided
(trust-on-first-use) and recording every decision in a tamper-evident audit log.

The product leads with **visibility** and graduates to **control**:

> **See — and control — everything your AI agent does.**
> Drop-in proxy: watch every MCP call live, get a tamper-evident audit trail, then turn on a
> deny-by-default firewall for your agent's *tool calls* when you're ready.

### Two modes

| Mode | Default? | Behavior |
|------|----------|----------|
| **observe** | ✅ yes | Transparent proxy. Enforces nothing; records every call to the audit log and streams it to the live console. Zero config, zero risk, instant payoff. |
| **enforce** | opt-in | Applies the deny-by-default policy. Unmatched calls become UNKNOWN → human prompt (interactive) or deny (headless). |

A first run does **not** break the agent. The user watches real activity, then clicks
"generate starter policy from observed traffic," reviews it, and flips to `enforce`.

### Honest scope of the security claim

The firewall gates **`tools/call` and `resources/read`** (the two surfaces that actually
*do* things on the user's behalf). It is **not** a sandbox of the MCP server process and does
**not** mediate prompt-injection, `sampling/createMessage`, or the server's own network egress
in v1. The README and `SECURITY.md` state this plainly — see [Threat Model](#threat-model).
Precise scoping is the credibility play, not marketing maximalism.

### Non-goals (v1)

- HTTP/SSE / Streamable-HTTP transport (architected for, not shipped in v1)
- Multi-tenant / hosted SaaS mode
- ML-based prompt-injection detection (v1 uses deterministic pattern rules only)
- Policy management UI for *editing* rules (v1 edits the YAML file; UI only approves/denies)
- **Sandboxing the server process** — no control over the child's own syscalls / network egress
  (would require OS-level confinement: seccomp/landlock/Job Objects). Out of scope; documented.
- **Prompt-injection / tool-poisoning defense** — the agent itself is not hardened (Phase 3 heuristics).

## Success Criteria

- A developer points one server entry at the gateway and **immediately sees a live feed** of
  what their agent is doing — no policy required (observe mode).
- The 60-second demo runs end to end (see Demo).
- `go test -race` and `go test -fuzz` (codec) pass; fail-closed behaviors are proven by tests.
- Single static binary that cross-compiles cleanly (no cgo) for macOS/Linux/Windows × amd64/arm64.
- README + prebuilt binaries on first release.

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Default mode | **observe (monitor-only)** | Zero-config wow, zero risk to the agent. Enforcement is opt-in. Lowers adoption friction without changing the engineering. |
| Transport (v1) | **stdio proxy** | ~90% of MCP usage today. Core sits behind a `Transport` interface (`Recv`/`Send`/`Close`) so HTTP/SSE is a new implementation, not a rewrite. |
| Policy model | **Declarative YAML + TOFU prompts** ("the hard way") | Policy-as-code reviewability (the zero-trust story) + interactive approval for the demo wow. |
| Enforcement layers | **Tool-level + argument-level constraints** | Arg constraints (e.g. path containment) are **defense-in-depth**, not a guaranteed sandbox — they raise the bar against the actual attack classes. |
| Gated surfaces | **`tools/call` + `resources/read`** | Both can act on the user's behalf; gating only `tools/call` would leave `resources/read` (e.g. dump a DB / read `/etc/passwd`) wide open. |
| Approval surface | **Local web UI (SSE)**; enforcement also fully **headless** | UI doubles as the live audit dashboard (demo money-shot); headless policy-only mode works in CI/background runs with no browser. |
| Language | **Go** | Single static binary (critical for a drop-in proxy), infra-tool cred, strong concurrency primitives. |
| Audit storage | **SQLite (`modernc.org/sqlite`, pure Go) + hash chain** | Pure-Go driver keeps the single-static-binary / clean-cross-compile promise (no cgo). WAL mode; all appends funnel through one goroutine (hash chain serializes writes anyway). |
| Audit integrity | **Hash chain + sequence numbers** | Tamper-*evident* (detects naive in-place edits & truncation). NOT tamper-*proof* against an attacker with DB write access — stated honestly. Optional HMAC keying noted as a hardening step. |

---

## Architecture

### Data flow

```
AI Agent --spawns(stdio)--> mcp-gateway --spawns child--> Real MCP Server
                                 |
                   per gated method (tools/call, resources/read):
                     1. parse + classify   (cannot classify -> DENY, never forward)
                     2. observe mode -> record + forward (enforce nothing)
                        enforce mode -> Policy Engine -> ALLOW | DENY | UNKNOWN
                     3a. UNKNOWN/ask -> park call, push to web UI, await human
                         (interactive); headless -> deny. Fail-closed timeout.
                     3b. DENY  -> JSON-RPC error to agent
                     3c. ALLOW -> forward to child, stream response back
                     4. append decision to SQLite hash-chain audit log (write-ahead)
                                 |
                     Local Web UI (127.0.0.1:7000): live feed + approval cards (SSE)
                                 + audit dashboard + verify-chain
```

The gateway transparently proxies all non-gated traffic (initialize, notifications,
`tools/list`, etc.). It **gates `tools/call` and `resources/read`**. A frame it cannot fully
parse and classify is **denied/dropped, never forwarded** (fail-closed). JSON-RPC batch arrays
are split and each element classified individually (a batch must not smuggle a gated call past a
top-level-only check).

### Transport seam (makes the "HTTP later" claim real)

The core policy/audit loop never touches stdin/stdout directly. It speaks to a `Transport`:

```go
type Transport interface {
    Recv(ctx context.Context) (jsonrpc.Message, error) // next inbound message
    Send(ctx context.Context, m jsonrpc.Message) error // outbound message
    Close() error
}
```

stdio is one implementation; child-process supervision is a **stdio-specific detail outside the
core engine**. Phase 2's HTTP/SSE transport is a new `Transport` impl, not an engine rewrite.

### Components (each independently testable)

1. **stdio proxy / child manager** — spawns and supervises the real MCP server. Spawns into a
   **process group** (`Setpgid` on Unix; **Job Object** on Windows) and signals the whole group
   on teardown so there are no orphaned `npx`/`node` children. Dedicated **stderr-drain
   goroutine** (an un-drained stderr pipe deadlocks the child). Exactly-once `Wait` (no zombies).
   Uses Go 1.20+ `Cmd.Cancel`/`WaitDelay` with a group-aware cancel.
2. **JSON-RPC codec** — reads newline-delimited messages with `bufio.Reader.ReadString` (NOT
   `bufio.Scanner`, whose 64KB token cap truncates real-world `tools/list` / image payloads).
   Classifies each frame; splits batch arrays. **Cannot classify => deny** (never pass through
   bytes we don't understand on a gated path — fail-closed, not fail-open).
3. **Policy engine** — pure function: `(server, method, name, args, policy) -> Verdict`.
   Tool/resource-level allow/deny/ask + argument constraints (`within`, `matches`, `equals`,
   `one_of`). Deny-by-default for anything unmatched (-> UNKNOWN). Reloads policy on mtime change
   (so a UI "always allow" write-back takes effect on the next call without a restart).
4. **Approval coordinator** — `map[serverName+requestID] -> chan Verdict` (buffered, cap 1).
   Parks UNKNOWN/ask calls without blocking the reader; single-resolution guard (an Allow/timeout
   race cannot double-send); `defer`-cleanup of the map entry on every exit path; resolved by
   human response, fail-closed timeout, **or a child-crash broadcast** (all parked calls drain to
   DENY when the child dies — no leaked goroutines, no hang).
5. **Audit log** — SQLite (`modernc.org/sqlite`, pure Go, WAL), append-only hash chain with
   monotonic sequence numbers: `hash = sha256(prev_hash || canonical(entry))`. **Write-ahead**: a
   PENDING row is written *before* forwarding and finalized with the result after — so a crash
   between forward and write is detectable (startup finds the PENDING row and logs a gap
   sentinel). `canonical()` is a pinned form (sorted keys, no insignificant whitespace, canonical
   number formatting); the exact hashed bytes are stored so verify re-hashes them, not a
   re-serialization. Behind an interface so tests can inject write failures.
6. **Web server** — serves the console UI; SSE for the live feed + approvals; HTTP endpoints for
   approve/deny and chain verification. Binds **127.0.0.1 only**; validates `Origin`/`Host`
   (anti-DNS-rebinding); state-changing endpoints require a per-session token (written `0600` /
   printed to the controlling terminal) + `SameSite=Strict`. Localhost is not an auth boundary —
   any local process (including a malicious MCP server) must not be able to self-approve.

### Concurrency model

- **Reader goroutine** — reads framed messages; hands them to a dispatcher. Does **not** block on
  downstream backpressure (a blocked reader stalls the agent invisibly and looks like a bug).
- **Dispatcher** — applies backpressure here, not at the reader. A hard in-flight cap (e.g. 1000)
  trips a fail-closed teardown with an explicit diagnostic rather than a silent stall.
- **Writer goroutine** — single funnel for all writes to agent stdout (no concurrent-writer
  corruption); fed by a bounded channel. Handles out-of-order responses from async-parked calls.
- **Child manager** — pipes to/from the real server; supervises it; broadcasts a `done` signal on
  crash that the approval coordinator selects on.
- **Approval coordinator** — parks calls in a pending map; resumes via per-request channel.

**Fail-closed everywhere (the zero-trust principle made concrete):**

| Condition | Behavior |
|-----------|----------|
| Approval times out (configurable N s) | **Deny**, logged |
| Headless mode, call is UNKNOWN/ask | **Deny** (no human to prompt) |
| Audit write fails | **Deny** the call (an unlogged action violates the guarantee) |
| Child server crashes | Broadcast crash; drain all parked approvals to **deny**; error in-flight calls; exit cleanly so the agent doesn't hang |
| Agent disconnects | Tear down child **process group**; no orphan process |
| Frame cannot be parsed/classified on a gated path | **Deny / drop** (never forward un-understood bytes) |
| In-flight cap exceeded | Tear down connection with explicit error |

> Note: these guarantees apply to **enforce** mode. **observe** mode never denies — it records
> and forwards — so its only failure obligation is "never lose an audit row silently" (the
> write-ahead PENDING row + gap sentinel covers a crash mid-call).

---

## Policy Model

Developers express trust in a git-friendly `mcp-policy.yaml`. In **enforce** mode it is
**deny-by-default**: anything unmatched becomes UNKNOWN -> human prompt (or deny, headless).

```yaml
version: 1
mode: enforce          # observe (default) | enforce
default: deny          # anything unmatched -> UNKNOWN (prompt human)

servers:
  filesystem:
    command: ["npx", "-y", "@modelcontextprotocol/server-filesystem", "/Users/me/safe"]
    tools:
      read_file:
        allow: true
        constraints:
          path: { within: ["/Users/me/safe"] }   # arg-level guard (defense-in-depth)
      write_file:
        allow: false                             # explicit deny
      list_directory:
        allow: true
    resources:
      allow: ask                                 # resources/read is gated too

  github:
    command: ["npx", "-y", "@modelcontextprotocol/server-github"]
    tools:
      search_repositories: { allow: true }
      create_issue:
        allow: ask                               # force TOFU prompt every time
```

- **Per-target outcomes:** `allow: true` / `allow: false` / `allow: ask` + catch-all
  `default: deny`. Applies to both `tools/call` and `resources/read`.
- **Argument constraints (v1 matchers):** `within` (path containment), `matches` (regex),
  `equals`, `one_of`.
- **`within` is component-wise, not string-prefix:** clean -> resolve symlinks -> reject `..`
  and relative/non-absolute paths -> compare path *components* -> normalize case/Unicode on
  case-insensitive filesystems. **Documented as defense-in-depth, not a sandbox:** the gateway
  validates the *string argument*; the child process performs the actual I/O, so a TOCTOU race
  (swap the target after the check) cannot be closed from the proxy layer. Real confinement needs
  OS-level sandboxing of the child (out of scope).
- **`matches` is expert-only:** RE2 engine (no catastrophic backtracking / ReDoS), patterns
  auto-anchored (`\A(?:...)\z`), input length-capped before matching. Prefer `equals` / `one_of`
  / `within` for allow decisions; regex is safer as a *deny* signal than an *allow* gate.
- **Write-back ("Always allow"):** appends the **narrowest** matching rule (including the arg
  constraints that matched — never a blanket tool-level allow) into a clearly tagged
  `# AUTO-ADDED — REVIEW` block, with a timestamp. Rate-limited to blunt approval-fatigue /
  policy-poisoning. The next identical call is then allowed (mtime hot-reload).
- **No `egress` field in v1.** A stdio proxy sits on the JSON-RPC pipe and has **zero control
  over the child's own network syscalls** — an egress allowlist here would be a security control
  that silently does nothing. Real egress enforcement requires the HTTP transport (where the
  gateway is genuinely in the network path) or OS-level confinement, and lands in Phase 2/3.
- **Principle:** the policy file is reviewable in a PR — a security person reads it and knows
  exactly what the agent's tool/resource surface is.

---

## Threat Model

A security tool's credibility is its honesty about scope. State this in `SECURITY.md` verbatim.

**Defends against (mediates the agent -> server channel):**

- A **benign-but-overcapable agent** making tool/resource calls you did not intend.
- A **confused / prompt-injected agent** issuing *tool calls* or *resource reads* outside policy
  — caught at the gate (deny-by-default).
- **Accidental or naive audit tampering / corruption**, and **truncation** (sequence numbers).
- Gives you a **complete, queryable record** of everything the agent did (observe mode), which is
  valuable even with enforcement off.

**Does NOT defend against (and the README must not imply it does):**

- A **malicious MCP server.** It is a child process you spawn; it has full OS access, makes its
  own network calls (no egress control over stdio), and can attack the local approval API. The
  gateway polices *what the agent asks the server to do*, it does not *sandbox the server*.
- **Prompt-injection / tool-poisoning** of the agent itself (Phase 3 heuristics only).
- **`sampling/createMessage`** server->agent reverse requests, and other ungated surfaces
  (`prompts/get`, `completion/*`) — v1 proxies these without gating; documented.
- **TOCTOU** on any argument constraint (the gateway checks a string; another process acts).
- An **attacker with local write access** to the SQLite file: the hash chain is
  tamper-*evident* (detects naive edits + truncation), **not tamper-proof** — without external
  anchoring/HMAC a full re-seal is possible. Optional HMAC keying is a documented hardening step.

---

## Web UI (Live Feed + Approval + Audit Console)

Aesthetic: a **security console** (think Linear / Sentry / k9s), not a generic dashboard.
Monospace for all machine data, hairline borders, dense aligned grid, restrained semantic color
(allow=green, deny=red, ask=amber), keyboard shortcuts, an `observe` / `armed · deny-by-default`
status pill. No emoji-icons, no gradients, no floating cards.

- **Live feed (observe mode, zero config):** every gated call streams in real time — server,
  method, target, arguments. This is the first-run wow: "this is what your agent is actually
  doing." A one-click **"generate starter policy from observed traffic"** turns the session into
  a draft `mcp-policy.yaml`.
- **Pending approval (enforce mode, SSE):** server -> target, real arguments (syntax-highlighted),
  countdown timer (fail-closed), threat flags (e.g. "secret pattern matched in body"). Buttons:
  Deny (`D`) / Allow once (`A`) / Always allow (`Shift+A`). Enforcement is also fully **headless**
  (policy-only, no browser) for CI / background runs.
- **Audit stream:** live, color-coded decisions with reason + timestamp; a "Verify chain" button
  that recomputes the hash chain and shows OK / FAIL; a tamper-detection row renders distinctly on
  a hash/sequence mismatch.
- **Responsive:** primarily a desktop tool (localhost); collapses to a clean single-column layout
  under 640px (rail hidden, rows reflow) so it never looks broken.

UI reference mockup validated at all four viewports (375 / 768 / 1280 / 1920) during design.

---

## Demo (the 60-second money-shot)

Ordered for the README GIF — open on the hook, peak on tamper detection.

1. Point Claude/Cursor at a filesystem MCP server **through the gateway** (rewrite one server
   entry). No policy yet -> **observe mode**.
2. Ask the agent to do a few things -> the **live feed lights up** with exactly what it's calling.
   ("Whoa — that's what it's doing.")
3. Click **"generate starter policy"**, review the YAML, flip to **enforce**.
4. Ask it to read `/etc/passwd` (out of `within`) -> **DENY**, red row appears, agent blocked.
5. Ask it to call an unlisted tool -> **approval card pops in the browser** -> click Deny -> blocked.
6. Click **"Verify chain"** -> OK. Hand-edit a row in SQLite, re-verify -> **FAIL** (tampering
   detected). Closer.

---

## Testing Strategy

Tests are the credibility of a security tool.

- **Unit:** policy verdict matrix (allow/deny/ask/unknown x tool/resource x arg constraints);
  `within` bypass cases (`..`, symlink, prefix-vs-component, case/Unicode); hash-chain append +
  verify + tamper + truncation detection.
- **Canonical-hash golden tests:** pin the exact hashed bytes so append-time and verify-time
  serialization can never silently diverge (this protects the headline feature).
- **Fuzz (`go test -fuzz`):** the codec — truncated lines, >64KB lines, embedded newlines, invalid
  UTF-8, batch arrays, duplicate keys, string-vs-number ids. The parser is attack surface.
- **Integration:** fake echo MCP server; drive real JSON-RPC through the gateway; assert verdicts
  and audit rows. Table-driven. Real-`npx` integration gated behind a build tag (slow/flaky in CI).
- **Concurrency:** `go test -race` **and `uber-go/goleak`** (race won't catch an idle leaked
  goroutine) on the approval coordinator + writer funnel; park N calls and resume out of order.
- **Process lifecycle (Linux + Windows in CI):** assert no surviving child PID after teardown,
  stderr-drain prevents deadlock, no zombies. Building Windows binaries is not the same as testing
  the most platform-fragile code on Windows.
- **Fail-closed proofs:** audit-write-fails -> deny; approval-timeout -> deny; headless-unknown ->
  deny; child-crash -> parked approvals drain to deny, no hang.

---

## Repo Polish & Distribution

- **README:** 15s animated GIF leading with the **live feed + a deny** (not an allow), then the
  tamper-detection beat; a "Why" section citing the real MCP security incidents; quickstart;
  policy example; architecture diagram; a crisp **"what this does and does NOT defend against"**
  box (lifted from the Threat Model — the honesty *is* the senior-engineer signal).
- **`DESIGN.md`:** the failure-mode matrix + concurrency model written up. For a hiring manager
  this is worth more than stars.
- **Governance files:** `SECURITY.md` (threat model verbatim), `CONTRIBUTING.md`, `CHANGELOG.md`,
  Apache-2.0 license.
- **CI (GitHub Actions):** `go test -race`, `go test -fuzz` (short), `goleak`, `go vet`,
  `golangci-lint`; build matrix darwin/linux/windows x amd64/arm64 (pure-Go, so cross-compile is
  clean — no cgo toolchains); lifecycle tests on Linux + Windows.
- **examples/**: ready-to-run policy files for filesystem, github, postgres servers, plus
  copy-paste **Claude Desktop** and **Cursor** config snippets ("change one server entry") with a
  PATH note (GUI-launched agents don't inherit your shell PATH, so `npx`/`node` may need help).
- **Distribution:** GoReleaser -> GitHub Releases prebuilt binaries; `go install`; Homebrew tap.

**Repo name:** `mcpgate` (primary candidate). Lead positioning avoids the crowded "gateway"
category word — market it as an **agent activity monitor + firewall**, not "another MCP gateway."

---

## Phasing

- **Phase 1 (v1, this spec):** stdio proxy behind the `Transport` seam; **observe mode default**
  + live feed + "generate policy from traffic"; enforce mode (tool + resource gating, arg
  constraints, TOFU approval, headless); local web console; SQLite (pure-Go) hash-chain audit with
  write-ahead + sequence numbers; tests (race/fuzz/goleak/lifecycle); README + `SECURITY.md` +
  binaries.
- **Phase 2:** HTTP/SSE (Streamable HTTP) transport via the `Transport` seam; **real egress
  enforcement** (now in the network path); multi-server fan-out (request-ID namespacing already
  in place); Postgres audit backend option; optional HMAC-keyed audit chain.
- **Phase 3:** richer threat heuristics (prompt-injection / tool-poisoning detection), gating of
  `sampling`/`prompts` surfaces, signed server allowlists / capability manifests, policy-editing UI.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| First-run friction (deny-by-default breaks the agent) | **Observe mode is the default** — zero config, zero risk; enforcement is opt-in and bootstrapped from observed traffic. |
| Over-claiming security (the credibility killer) | Honest `SECURITY.md` threat model; no `egress` in v1; "tamper-evident not tamper-proof"; arg constraints framed as defense-in-depth. Scope claims to *tool/resource calls*. |
| "Gateway" space gets crowded | Differentiate on *visibility-first + arg-level constraints + tamper-evident audit*, not routing. Market as activity monitor + firewall. |
| cgo breaks the single-binary promise | `modernc.org/sqlite` (pure Go) — clean cross-compile for all 6 targets. |
| Cross-platform process lifecycle (orphans/zombies, Windows) | Process groups (Unix) / Job Objects (Windows); stderr-drain goroutine; lifecycle tests on both OSes in CI. |
| Scope creep / "impressive but unfinished" | Thin finished slice = proxy + observe + audit + verify (a complete tool on its own); enforce/approval layer builds on top. Strict non-goals; 4 matchers; UI approves but does not edit policy. |
| MCP ecosystem cools off | Core (Transport seam, policy engine, hash-chain audit, proxy lifecycle) is reusable; the dist-sys/security craft stands alone as a portfolio piece. |
| Go ramp-up time | Multi-language background (Java/C#/Python/TS); "learned Go building this" is itself an interview asset. |
