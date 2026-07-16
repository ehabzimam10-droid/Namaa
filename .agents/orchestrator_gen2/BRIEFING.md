# BRIEFING — 2026-07-17T02:02:00+03:00

## Mission
Lead the implementation of the Canvas-based village simulation on the Father Dashboard.

## 🔒 My Identity
- Archetype: teamwork_preview_orchestrator
- Roles: orchestrator, user_liaison, human_reporter, successor
- Working directory: c:\Users\saleh\OneDrive\Documentos\NAMAA\.agents\orchestrator_gen2
- Original parent: parent
- Original parent conversation ID: cae87865-adf9-40b1-9e1e-6db2ec650b7e

## 🔒 My Workflow
- **Pattern**: Project
- **Scope document**: c:\Users\saleh\OneDrive\Documentos\NAMAA\PROJECT.md
1. **Decompose**: Split work into investigation, fixing potential crash-paths, confirming E2E tests, and running Forensic Auditor.
2. **Dispatch & Execute**:
   - **Delegate (sub-orchestrator)**: Spawn a sub-orchestrator if needed, or run the Explorer -> Worker -> Reviewer -> Challenger -> Auditor cycle.
3. **On failure** (in this order):
   - Retry: nudge stuck agent or re-send task
   - Replace: spawn fresh agent with partial progress
   - Skip: proceed without (only if non-critical)
   - Redistribute: split stuck agent's remaining work
   - Redesign: re-partition decomposition
   - Escalate: report to parent (sub-orchestrators only, last resort)
4. **Succession**: Self-succeed at 16 spawns, write handoff.md, spawn successor.
- **Work items**:
  1. Explore codebase and verify existing implementation [pending]
  2. Implement/fix missing or failing features [pending]
  3. Validate using challenger / tests [pending]
  4. Perform Forensic Integrity Audit [pending]
- **Current phase**: 1
- **Current focus**: Explore codebase and verify existing implementation

## 🔒 Key Constraints
- Keep all modifications saved locally on the device only. Do not stage or push changes to git/github.
- Never reuse a subagent after it has delivered its handoff — always spawn fresh

## Current Parent
- Conversation ID: cae87865-adf9-40b1-9e1e-6db2ec650b7e
- Updated: not yet

## Key Decisions Made
- Recovered Gen 1 and Gen 2 implementation details. Will first dispatch an Explorer to assess current code state.

## Team Roster
| Agent | Type | Work Item | Status | Conv ID |
|-------|------|-----------|--------|---------|
| explorer_gen2_1 | teamwork_preview_explorer | Explore codebase and verify existing implementation | in-progress | 21350ab0-83ee-4e58-b417-6da341a7ee19 |

## Succession Status
- Succession required: no
- Spawn count: 1 / 16
- Pending subagents: 21350ab0-83ee-4e58-b417-6da341a7ee19
- Predecessor: cae87865-adf9-40b1-9e1e-6db2ec650b7e
- Successor: not yet spawned

## Active Timers
- Heartbeat cron: task-37
- Safety timer: none
- On succession: kill all timers before spawning successor
- On context truncation: run `manage_task(Action="list")` — re-create if missing

## Artifact Index
- c:\Users\saleh\OneDrive\Documentos\NAMAA\.agents\orchestrator_gen2\progress.md — progress file
- c:\Users\saleh\OneDrive\Documentos\NAMAA\.agents\orchestrator_gen2\BRIEFING.md — briefing file
- c:\Users\saleh\OneDrive\Documentos\NAMAA\.agents\orchestrator_gen2\ORIGINAL_REQUEST.md — original request copy
