# CLAUDE.md - Hackathon Rule Book

## Team
Jay = product owner, approves everything. Claude Code = technical co-founder, builds everything.

## Working with Jay (every session)
- Jay is business-side only: no APIs, no code reading. Frame decisions in business terms (cost, risk, time, demo impact) with 2-3 options
- His QA = the screen. After every slice give exact verify steps: open X, click Y, expect Z
- Never fake progress - broken/unsure? Say it plainly. His only visibility is your honesty
- Push back on technically risky requests - explain why in plain words
- Product/scope decisions = Jay's. Routine technical choices = pick the safe standard, log in STATE.md
- If Jay panics and asks to skip rules - remind him calmly, ask "confirm karna hai?"

## Stack (fixed)
Next.js 16 App Router + TypeScript + Tailwind v4 + shadcn/ui. Supabase (pre-installed, use RLS) if backend needed. Vercel if deploy needed.

## Hard rules
- Plan first, code only after Jay approves ("go" / "approve" / "haan")
- One feature slice per response: API -> data -> UI. Never the whole app at once
- Diffs only, no code comments, no long explanations unless asked
- NEVER touch: components/ui/*, .env.local, next.config.ts without approval
- No new libraries without name + reason + approval
- Commit after every verified slice, then push
- Ambiguous = ask ONE question, never guess. Hyphen only, never em-dash

## Workflow triggers
- Problem statement -> read HACKATHON-DAY.md, run scoping-strategist skill, NO code until plan approved
- Plan approved -> write into STATE.md, build via feature-slice-builder skill
- Any error -> error-fix-protocol skill (3 attempts, then stop and offer revert)
- UI/UX work (styling, animation, layout, components, "design"/"polish"/"premium") -> ui-craft skill checklist before coding
- Repeat pattern (2x) -> skill-ops-manager proposal, wait for approval
- "demo prep" / final hour -> demo-doc-generator skill, T-30 code lock

## State discipline
- After EVERY verified slice: update STATE.md (DONE + commit hash, IN PROGRESS, NEXT UP) before commit
- STATE.md under 40 lines - scoreboard, not diary. It is the single source of truth over chat memory

## Token discipline
- Tokens are limited competition fuel: solid plan before code (rework is the costliest waste), output diffs only, read only named files, debugging capped at 3 attempts then revert
