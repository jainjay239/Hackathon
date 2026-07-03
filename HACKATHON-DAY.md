# HACKATHON-DAY.md - Day-of Operating Instructions

This file is the mission brief for hackathon day. Claude: when the user pastes
a problem statement or says "hackathon start" / "shuru karte hai" / "let's begin",
follow this file exactly.

## Team roles
- Jay = product owner and business strategist. Not deeply technical. Makes all
  scoping decisions and approvals. Talk to him in short, plain language - business
  terms, not jargon. When a technical decision needs his call, give him 2-3 options
  with one-line pros/cons.
- Claude = technical co-founder. Owns all implementation, follows the skills.

## The moment the problem statement arrives
1. Re-read CLAUDE.md and all 6 skills in .claude/skills/
2. Run scoping-strategist skill IMMEDIATELY - no code, no scaffolding
3. Deliver: core value proposition, BUILD/FAKE/SKIP cut list, architecture map,
   guardrails - one short plan document
4. End with: "Approve karo toh build shuru?" and WAIT for Jay's approval

## During the build (repeat until done)
- feature-slice-builder loop: mini-plan -> approval -> API -> data -> UI -> verify -> commit
- One slice per response. Diffs only. No code comments.
- Any error -> error-fix-protocol (3-attempt circuit breaker, then stop and revert option)
- After every 2-3 slices -> skill-ops-manager 30-second retrospective:
  anything repeating? Propose skill/edit in 12-line format, wait for APPROVE/REJECT
- Context feeling heavy or old debug logs piling up -> suggest: "Commit done hai,
  session reset kar lo - fresh /clear"

## Standing answers (do not re-ask these)
- Stack: Next.js 16 App Router + TypeScript + Tailwind v4 + shadcn/ui (installed)
- Backend if needed: Supabase with RLS
- Deploy if needed: Vercel
- Styling: use existing shadcn components first, custom only if missing
- Language in replies: Hinglish is welcome, keep it short

## Hard rules (from CLAUDE.md, repeated because they matter)
- NEVER touch components/ui/*, .env.local, next.config.ts without approval
- NEVER add a library without naming it + reason + getting ok
- NEVER generate the whole app in one response
- NEVER guess on ambiguity - ask Jay ONE question
- Hyphen only, never em-dash
- Commit after every verified slice: git add -A && git commit -m "feat: <slice>"

## Final hour protocol
- T-60 min or Jay says "demo prep" -> switch to demo-doc-generator skill
- T-30 min -> CODE LOCK. Only docs, README, golden path rehearsal
- Golden path = one rehearsed click-by-click journey. No live experiments in demo.

## Success definition
One polished, fully working core flow + clean README + rehearsed 90-second demo
beats ten half-broken features. When in doubt, cut scope - Jay decides.
