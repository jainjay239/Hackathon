# STATE.md - Living Project State (max 40 lines, scoreboard not diary)

RULE: Update after EVERY verified slice, before the commit. This file wins over chat memory.

## Approved plan
- Problem statement: Cooking Todo warm-up - AI meal planner from daily routine.
- Core value proposition: Turn a daily routine into a practical 3-meal plan, grocery list, substitutions, and budget analysis.
- Golden path: Open /cooking-todo, enter routine, generate Gemini plan, review four structured sections.
- BUILD: isolated app/cooking-todo route, Gemini server action, accessible UI, README and CODEX notes.
- SKIP: database, persistence, multi-day calendar, external pricing APIs, mock responses.

## DONE (newest first: [hash] slice - how verified)
- [pending] Slice 1 scaffold + Gemini API plumbing - npm run lint, npm run build, /cooking-todo HTTP 200.

## IN PROGRESS
- Slice: none | Stage: waiting for Jay approval

## NEXT UP
1. Slice 2 - UI form, loading state, validation, and four-section response rendering.

## BLOCKERS / QUESTIONS FOR JAY
- Add GEMINI_API_KEY to .env.local before testing real AI generation.

## DECISIONS LOG (safe technical defaults - newest first)
- 2026-07-04: Gemini key env var = GEMINI_API_KEY; no mock fallback allowed.
- 2026-07-03: Pre-flight audit = GO (env/stack/git verified ready). Full detail in memory: prehackathon-audit-go.

## DO NOT TOUCH
- components/ui/*, .env.local, next.config.ts, unrelated interrupted audit edits.
