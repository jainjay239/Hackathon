# STATE.md - Living Project State (max 40 lines, scoreboard not diary)

RULE: Update after EVERY verified slice, before the commit. This file wins over chat memory.

## Approved plan (frozen after Jay approves - do not reinterpret)
- Problem statement: PromptWars (Google) - GenAI travel/culture discovery platform
- Core value proposition: traveler enters a destination -> Gemini surfaces hidden gems -> tap one -> Gemini generates immersive cultural story (+ heritage, local event, experience tip folded into same call)
- Golden path: home -> type/pick destination -> gem cards (Gemini call 1) -> tap card -> story dialog (Gemini call 2)
- BUILD: gems list, story/heritage/event/tip, save-to-trip (localStorage) | FAKE: gem "photo" = emoji/gradient, disclosed | SKIP: map, real events API, multi-language, auth

## DONE (newest first: [hash] slice - how verified)
- [pending commit] Phase 5 - components/destination-image.tsx: Wikipedia REST image lookup (keyless) + gradient/emoji fallback on no-match or load error - tsc/eslint clean, confirmed real thumbnail for "Jaipur Amber Fort" and clean empty response (safe fallback) for a nonsense query.
- [749a217] Phase 4 - rich result page (8 sections, placeholders).
- [1cefc53] Phase 3 - /api/destination route (replaces /api/gems).

## IN PROGRESS
- Slice: none | Stage: doing early Vercel deploy smoke test per Jay's instruction (before Phase 6)

## NEXT UP (revised plan, 60-min budget from 2026-07-04 approval)
1. Vercel deploy smoke test (early check, not waiting for Phase 8)
2. Phase 6 - weather/budget/mood preference chips
3. Phase 7 - Save Trip + Copy Itinerary
4. Phase 8 - cleanup, README, repo size check (git count-objects -vH), final Vercel deploy

## BLOCKERS / QUESTIONS FOR JAY
- (none)

## DECISIONS LOG (safe technical defaults - newest first)
- 2026-07-04: Cooking Todo (app/cooking-todo, commits 35b696d/5a90ed0/341c641) ruled stale/warm-up by Jay - not part of PromptWars. Left on disk untouched for now, cleanup planned Phase 6.
- 2026-07-04: Gemini access via plain fetch to REST endpoint, no SDK dependency added.
- 2026-07-03: Pre-flight audit = GO (env/stack/git verified ready). Full detail in memory: prehackathon-audit-go.

## DO NOT TOUCH
- components/ui/*, .env.local, next.config.ts, everything under DONE
