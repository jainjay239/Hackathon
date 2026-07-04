# STATE.md - Living Project State (max 40 lines, scoreboard not diary)

RULE: Update after EVERY verified slice, before the commit. This file wins over chat memory.

## Approved plan (REVISED 2026-07-04, 60-min budget - supersedes original 2-call plan)
- Problem statement: PromptWars (Google) - GenAI cultural discovery platform, not a generic trip planner
- Core value proposition: traveler picks a destination + weather/budget/mood chips -> one rich Gemini call -> full cultural guide page (hero, why-it-fits, culture-at-a-glance, hidden gems, immersive story, local experiences+etiquette, 1-day itinerary)
- Golden path: destination chip -> preference chips -> Generate -> rich page with images/fallbacks -> Save Trip -> Copy Itinerary
- BUILD: single /api/destination Gemini call, image-rich result page, Wikipedia image lookup+fallback, save/copy | FAKE: none (events reframed as evergreen "seasonal cultural moments", disclosed) | SKIP: map, live weather API, auth, DB, booking

## DONE (newest first: [hash] slice - how verified)
- [pending commit] Removed unused @google/genai and @supabase/supabase-js deps (never imported anywhere) - 45 packages dropped, tsc/eslint/test(40 pass)/build all clean.
- [c46827f] Sidebar navigation + editorial layout + font fix (--font-sans bug, Inter wired correctly). 12-section two-column result page derived from existing Gemini fields (lib/sections.ts, no schema break). Gemini prompt upgraded to warm consultant tone.
- [ad27039] Expanded discovery filters - tripLength, travelerType, culturalInterests, comfortNeeds.
- [ea699aa]..[2434143] Testing layer, premium UI polish, Vercel config fix.
- [f84ef89]..[1cefc53] Phases 3-7 - /api/destination route, rich result page, image lookup+fallback, Save Trip/Copy Itinerary.

## IN PROGRESS
- Slice: none | Stage: blocked on Jay's Gemini key (free-tier 20/day quota exhausted, two replacement keys so far still hit the same limit - likely same GCP project). Jay fixing key; sidebar click-QA also still pending on his side.

## NEXT UP
1. Jay confirms new API key is under a genuinely different/new Google Cloud project (or enables billing) so quota actually resets.
2. Jay's click-QA of sidebar + new sections once Gemini works again, then redeploy.
3. Jay decides which of the 4 Vercel projects is the one to submit (hackathon-base recommended, confirmed working before quota ran out).

## BLOCKERS / QUESTIONS FOR JAY
- Gemini free-tier quota (20 requests/day/project) exhausted from testing today - blocks all live Gemini calls until Jay fixes it (new project or billing).
- A separate OpenAI Codex process was seen running against this same repo folder earlier - worth checking if still active.

## DECISIONS LOG (safe technical defaults - newest first)
- 2026-07-04: Sidebar sections derived from existing cultureAtAGlance/localExperiences tags (lib/sections.ts), not new Gemini fields - keeps schema backward-compatible per instruction.
- 2026-07-04: Live smoke-tested Vercel deploy - prod URL https://hackathon-base-sage.vercel.app, GEMINI_API_KEY added to Vercel prod env, verified real Gemini call works live.
- 2026-07-03: Pre-flight audit = GO. Full detail in memory: prehackathon-audit-go.

## DO NOT TOUCH
- components/ui/*, .env.local, next.config.ts, everything under DONE
