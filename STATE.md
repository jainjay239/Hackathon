# STATE.md - Living Project State (max 40 lines, scoreboard not diary)

RULE: Update after EVERY verified slice, before the commit. This file wins over chat memory.

## Approved plan (frozen after Jay approves - do not reinterpret)
- Problem statement: PromptWars (Google) - GenAI travel/culture discovery platform
- Core value proposition: traveler enters a destination -> Gemini surfaces hidden gems -> tap one -> Gemini generates immersive cultural story (+ heritage, local event, experience tip folded into same call)
- Golden path: home -> type/pick destination -> gem cards (Gemini call 1) -> tap card -> story dialog (Gemini call 2)
- BUILD: gems list, story/heritage/event/tip, save-to-trip (localStorage) | FAKE: gem "photo" = emoji/gradient, disclosed | SKIP: map, real events API, multi-language, auth

## DONE (newest first: [hash] slice - how verified)
- [pending commit] Phase 2 - home UI (search + presets + gem grid) - tsc clean, eslint clean, / returns 200 with "Culture Compass" title, replaced stale leftover audit-dashboard page.
- [b8e9d65] Phase 1 - /api/gems route - tsc clean, eslint clean, curl POST returned 5 real Gemini gems for "Jaipur" (200), missing-destination returned clean 400.

## IN PROGRESS
- Slice: none | Stage: ready for Phase 3

## NEXT UP
1. Phase 3 - /api/story route
2. Phase 4 - story dialog UI
3. Phase 5 - save-to-trip + /my-trip
4. Phase 6 - polish, README/GenAI disclosure, deploy

## BLOCKERS / QUESTIONS FOR JAY
- (none)

## DECISIONS LOG (safe technical defaults - newest first)
- 2026-07-04: Cooking Todo (app/cooking-todo, commits 35b696d/5a90ed0/341c641) ruled stale/warm-up by Jay - not part of PromptWars. Left on disk untouched for now, cleanup planned Phase 6.
- 2026-07-04: Gemini access via plain fetch to REST endpoint, no SDK dependency added.
- 2026-07-03: Pre-flight audit = GO (env/stack/git verified ready). Full detail in memory: prehackathon-audit-go.

## DO NOT TOUCH
- components/ui/*, .env.local, next.config.ts, everything under DONE
