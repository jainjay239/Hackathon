# STATE.md - Living Project State (max 40 lines, scoreboard not diary)

RULE: Update after EVERY verified slice, before the commit. This file wins over chat memory.

## Approved plan (REVISED 2026-07-04, 60-min budget - supersedes original 2-call plan)
- Problem statement: PromptWars (Google) - GenAI cultural discovery platform, not a generic trip planner
- Core value proposition: traveler picks a destination + weather/budget/mood chips -> one rich Gemini call -> full cultural guide page (hero, why-it-fits, culture-at-a-glance, hidden gems, immersive story, local experiences+etiquette, 1-day itinerary)
- Golden path: destination chip -> preference chips -> Generate -> rich page with images/fallbacks -> Save Trip -> Copy Itinerary
- BUILD: single /api/destination Gemini call, image-rich result page, Wikipedia image lookup+fallback, save/copy | FAKE: none (events reframed as evergreen "seasonal cultural moments", disclosed) | SKIP: map, live weather API, auth, DB, booking

## DONE (newest first: [hash] slice - how verified)
- [pending commit] Phase 6+7 - weather/budget/mood chips wired into /api/destination (verified "spiritual"+"rainy" changed Bali's whyItFits text); Save Trip (localStorage) + Copy Itinerary (clipboard) buttons - tsc/eslint clean, / renders 200. Save/copy need Jay's click-QA (browser APIs, not curl-testable).
- [cdbd7bf] Phase 5 - Wikipedia image lookup + fallback.
- [749a217] Phase 4 - rich result page (8 sections, placeholders).
- [1cefc53] Phase 3 - /api/destination route (replaces /api/gems).

## IN PROGRESS
- Slice: Phase 8 | Stage: README + GenAI disclosure done, repo size checked (516 KiB, well under 10 MB), doing final deploy

## NEXT UP
1. Final Vercel deploy + live smoke test
2. Jay's own click-QA of golden path on deployed URL

## BLOCKERS / QUESTIONS FOR JAY
- GitHub auto-connect to Vercel failed during smoke test. Deploy works via direct CLI upload; pushes to GitHub won't auto-deploy yet. Revisit if auto-deploy-on-push wanted.

## DECISIONS LOG (safe technical defaults - newest first)
- 2026-07-04: Live smoke-tested Vercel deploy after Phase 5 (Jay's instruction) - prod URL https://hackathon-base-sage.vercel.app, GEMINI_API_KEY added to Vercel prod env, verified real Gemini call works live.
- 2026-07-04: Cooking Todo (app/cooking-todo) ruled stale/warm-up by Jay - not part of PromptWars. Cleanup planned Phase 8.
- 2026-07-04: Gemini access via plain fetch to REST endpoint, no SDK dependency added.
- 2026-07-03: Pre-flight audit = GO. Full detail in memory: prehackathon-audit-go.

## DO NOT TOUCH
- components/ui/*, .env.local, next.config.ts, everything under DONE
