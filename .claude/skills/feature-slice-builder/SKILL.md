---
name: feature-slice-builder
description: The core development loop. Use this skill EVERY time a feature, page, API, component, or fix is being built during the hackathon - whenever the user says "build", "add", "banao", "implement", "next feature", or names any functionality. Enforces plan-first, slice-order (API -> data -> UI), and commit-after-every-slice discipline.
---

# Feature Slice Builder (Phase 3 Loop)

## The loop - never skip a stage

### Stage 1 - Plan (no code)
Before coding, output a mini-plan (max 10 lines):
- Files to create/modify (exact paths)
- What each change does (one line per file)
- What will NOT be touched
Wait for "go" / "approve" / thumbs up. Only then code.

### Stage 2 - Build in slice order
1. **Backend first**: API route / server action, with input validation
2. **Data layer**: Supabase queries / schema changes (RLS included)
3. **UI last**: components consuming the working API
Never build all three in one giant generation. One slice per response.

### Stage 3 - Verify
After each slice, state exactly how to verify it (one command or one click).
Example: "Run `npm run dev`, open /dashboard, card should show 3 seeded items."

### Stage 4 - Commit checkpoint
After human confirms the slice works:
```
git add -A && git commit -m "feat: <slice-name> working"
```
Suggest this command immediately. After commit, recommend session reset if
context is heavy (long debug logs present).

## Negative constraints
- Do NOT refactor working code unless the task explicitly asks.
- Do NOT rename files, move folders, or "clean up" beyond the named slice.
- Do NOT add libraries without approval - state library + reason first.
- Do NOT generate the whole app in one response, ever.

## Prompt intake format (what the human will paste)
```
FEATURE: <name>
GOAL: <one line>
CONSTRAINTS: <anything frozen>
```
If GOAL is ambiguous, ask one question. Do not guess.
