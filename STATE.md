# STATE.md - Living Project State (max 40 lines, scoreboard not diary)

RULE: Update after EVERY verified slice, before the commit. This file wins over chat memory.

## Approved plan (REVISED 2026-07-04, 60-min budget - supersedes original 2-call plan)
- Problem statement: PromptWars (Google) - GenAI cultural discovery platform, not a generic trip planner
- Core value proposition: traveler picks a destination + weather/budget/mood chips -> one rich Gemini call -> full cultural guide page (hero, why-it-fits, culture-at-a-glance, hidden gems, immersive story, local experiences+etiquette, 1-day itinerary)
- Golden path: destination chip -> preference chips -> Generate -> rich page with images/fallbacks -> Save Trip -> Copy Itinerary
- BUILD: single /api/destination Gemini call, image-rich result page, Wikipedia image lookup+fallback, save/copy | FAKE: none (events reframed as evergreen "seasonal cultural moments", disclosed) | SKIP: map, live weather API, auth, DB, booking

## DONE (newest first: [hash] slice - how verified)
- [pending commit] Testing layer - extracted pure helpers (lib/types, validation, gemini-response, formatters, storage, imageFallback), 31 Vitest unit tests (no live Gemini calls), TESTING.md, README testing section, npm test/test:watch/verify scripts. Verified route + UI still work live after refactor (Oaxaca real call, empty-destination 400).
- [be74c1c] Premium UI polish - hero collage, floating search card, big destination cards, loading skeleton, restyled result page.
- [2434143] Fixed Gemini config for the GitHub-connected Vercel project (hackathon2323).
- [f84ef89]..[1cefc53] Phases 3-7 - /api/destination route, rich result page, Wikipedia image lookup+fallback, preference chips, Save Trip/Copy Itinerary.

## IN PROGRESS
- Slice: none | Stage: testing layer complete, ready for Jay's click-QA + redeploy

## NEXT UP
1. Jay's click-QA of UI on localhost, then redeploy to hackathon-base.
2. Jay adds GEMINI_API_KEY to `hackathon2323` Vercel project if that's the one being submitted instead.
3. Jay decides which of the 4 Vercel projects is the one to submit.
4. Optional cleanup (not done, out of scope this round): package.json has unused @google/genai and @supabase/supabase-js deps left over from the earlier warm-up session.

## BLOCKERS / QUESTIONS FOR JAY
- GitHub auto-connect to Vercel failed during smoke test. Deploy works via direct CLI upload; pushes to GitHub won't auto-deploy yet. Revisit if auto-deploy-on-push wanted.

## DECISIONS LOG (safe technical defaults - newest first)
- 2026-07-04: Live smoke-tested Vercel deploy after Phase 5 (Jay's instruction) - prod URL https://hackathon-base-sage.vercel.app, GEMINI_API_KEY added to Vercel prod env, verified real Gemini call works live.
- 2026-07-04: Cooking Todo (app/cooking-todo) ruled stale/warm-up by Jay - not part of PromptWars. Cleanup planned Phase 8.
- 2026-07-04: Gemini access via plain fetch to REST endpoint, no SDK dependency added.
- 2026-07-03: Pre-flight audit = GO. Full detail in memory: prehackathon-audit-go.

## DO NOT TOUCH
- components/ui/*, .env.local, next.config.ts, everything under DONE
