# STATE.md - Living Project State (max 40 lines, scoreboard not diary)

RULE: Update after EVERY verified slice, before the commit. This file wins over chat memory.

## Approved plan (REVISED 2026-07-04, 60-min budget - supersedes original 2-call plan)
- Problem statement: PromptWars (Google) - GenAI cultural discovery platform, not a generic trip planner
- Core value proposition: traveler picks a destination + weather/budget/mood chips -> one rich Gemini call -> full cultural guide page (hero, why-it-fits, culture-at-a-glance, hidden gems, immersive story, local experiences+etiquette, 1-day itinerary)
- Golden path: destination chip -> preference chips -> Generate -> rich page with images/fallbacks -> Save Trip -> Copy Itinerary
- BUILD: single /api/destination Gemini call, image-rich result page, Wikipedia image lookup+fallback, save/copy | FAKE: none (events reframed as evergreen "seasonal cultural moments", disclosed) | SKIP: map, live weather API, auth, DB, booking

## DONE (newest first: [hash] slice - how verified)
- [pending commit] next/image conversion (Jay-approved, touches next.config.ts) - DestinationImage now uses next/image with fill+sizes instead of plain <img>, removed the eslint-disable it needed; next.config.ts whitelists upload.wikimedia.org. Verified via the Next.js image optimizer endpoint directly (200, image/jpeg) - no Gemini call needed. tsc/eslint/test(40 pass)/build all clean.
- [3bee35a] Score-improvement pass (evaluator: 83.87 -> 91.74, targeting Efficiency 80 and Code Quality 86) - moved `shadcn` CLI tool to devDependencies, added typecheck script + CI workflow. Audited for dead code/`any`/dangerouslySetInnerHTML - already clean.
- [1abbd2c] Removed unused @google/genai and @supabase/supabase-js deps.
- [c46827f] Sidebar navigation + editorial layout + font fix (--font-sans bug, Inter wired correctly). 12-section two-column result page derived from existing Gemini fields (lib/sections.ts, no schema break). Gemini prompt upgraded to warm consultant tone.
- [ad27039]..[1cefc53] Discovery filters, testing layer, premium UI polish, Vercel config fix, core Phases 3-7.

## IN PROGRESS
- Slice: none | Stage: still blocked on Jay's Gemini key (3rd key tried, still hits the same 20/day free-tier quota - almost certainly still the same GCP project)

## NEXT UP
1. Jay confirms new API key is under a genuinely different/new Google Cloud project (or enables billing) so quota actually resets.
2. Jay's click-QA of sidebar + images once Gemini works again, then redeploy.

## BLOCKERS / QUESTIONS FOR JAY
- Gemini free-tier quota (20/day/project) still exhausted after 3 key attempts - almost certainly the same underlying GCP project each time.
- A separate OpenAI Codex process was seen running against this same repo folder earlier - worth checking if still active.

## DECISIONS LOG (safe technical defaults - newest first)
- 2026-07-04: Sidebar sections derived from existing cultureAtAGlance/localExperiences tags (lib/sections.ts), not new Gemini fields - keeps schema backward-compatible per instruction.
- 2026-07-04: Live smoke-tested Vercel deploy - prod URL https://hackathon-base-sage.vercel.app, GEMINI_API_KEY added to Vercel prod env, verified real Gemini call works live.
- 2026-07-03: Pre-flight audit = GO. Full detail in memory: prehackathon-audit-go.

## DO NOT TOUCH
- components/ui/*, .env.local, next.config.ts, everything under DONE
