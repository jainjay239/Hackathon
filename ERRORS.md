# ERRORS.md - Incident Log

Rule: every notable error gets an entry BEFORE it is fixed. Format: symptom -> what we tried -> root cause -> fix -> prevention rule. Newest first. This file exists so the same mistake never costs us twice.

---

## 8. "This page couldn't load" in Jay's Chrome (RECURRING - partially open)
- **Date**: 2026-07-04, recurred 2026-07-05
- **Symptom**: Chrome shows generic "This page couldn't load" for hackathon-base-sage.vercel.app. Same machine, same moment: curl gets HTTP 200 in ~0.3s.
- **Tried**: server-side verification (200 OK both times), Windows proxy registry (clean), hosts file (clean), Chrome enterprise policies (none), DNS A records (resolve fine), OS-level networking (fine).
- **Root cause**: NOT the app, NOT the server, NOT Windows - the failure is inside the Chrome profile itself. Prime suspects: an extension blocking *.vercel.app (security/adblock extensions often flag vercel.app because phishing kits get hosted there) or Chrome "Secure DNS" (DoH) failing for the domain.
- **Fix**: pending Jay's 3-step isolation (incognito -> other browser -> Secure DNS off). App-side nothing to fix.
- **Prevention**: never debug this as an app issue again - first command is `curl -s -o /dev/null -w "%{http_code}" <url>`; if 200, it is the browser profile. Test in incognito before touching any code.

## 7. Itinerary always 1 day regardless of "Weekend"/"3 days" selection
- **Date**: found 2026-07-05
- **Symptom**: Trip length buttons selected correctly, values reached Gemini, but itinerary always came back as one day.
- **Tried**: full pipeline audit (UI state -> API body -> validation -> prompt) - all fields flowed correctly; buttons were never broken.
- **Root cause**: early scoping decision hard-locked the schema to `{morning, afternoon, evening}` and the prompt explicitly said "single sample day regardless of trip length". Design decision that outlived its context.
- **Fix** [fc8580f]: deterministic `tripLengthToDayCount` mapping (Weekend=2, 3 days=3, 5 days=5, 1 week=7), prompt demands EXACTLY N days, validator enforces array-of-days, legacy saved trips auto-migrate.
- **Prevention**: when a scope-cut fakes/simplifies behavior, record it in STATE.md as a visible limitation - do not let a prompt instruction silently contradict what the UI advertises.

## 6. Images loaded but invisible (zero-height containers)
- **Date**: 2026-07-05
- **Symptom**: After converting to next/image, most card images vanished. Wikipedia fetches succeeded; optimizer served 200.
- **Tried**: verified image optimizer endpoint (200 image/jpeg), Wikipedia API hit-rate test (6/7 queries return photos) - infra was fine.
- **Root cause**: next/image `fill` positions the img absolutely, removing it from layout flow. Callers passing `className="rounded-none"` REPLACED the default `aspect-video` (default-parameter pattern), so containers collapsed to 0px height. Plain `<img>` had masked this because it gives intrinsic height.
- **Fix** [9e4b9aa]: default aspect merged via `cn()` so caller classes override only when they set their own aspect.
- **Prevention**: with `fill` images, the container MUST have guaranteed dimensions; never put default classes in a default parameter - merge them with cn() so they survive overrides. Verify UI changes visually, not just via endpoint checks.

## 5. Gemini 503 "overloaded" + 429 quota errors in production
- **Date**: 2026-07-04 evening
- **Symptom**: Live demo calls randomly failed: 503 (Google overload), then 429 (quota), one "malformed JSON" flake.
- **Tried**: (1) plain retries with backoff - insufficient; (2) fallback to gemini-2.5-flash-lite - worked locally, prod still flaky; (3) extended chain.
- **Root cause**: two separate issues compounding - Google-side transient overload (503) AND free-tier daily quota exhaustion (20 requests/day/model) from heavy testing.
- **Fix** [e287c93, 4912a0b]: 3-model fallback chain (2.5-flash -> 2.5-flash-lite -> 2.0-flash), 2 attempts each, 1.5s backoff, immediate model-switch on 429. Never fake content on failure.
- **Prevention**: treat every external API as "will fail sometimes" from slice one - retries + fallback are part of the first implementation, not a patch. Track quota budget when testing (each test click costs real quota).

## 4. Replacing the Gemini API key did NOT fix quota errors (3 keys wasted)
- **Date**: 2026-07-04
- **Symptom**: 429 "limit: 20" persisted across three fresh API keys.
- **Tried**: three key replacements, each tested - identical quota error every time.
- **Root cause**: Gemini free-tier quota is tied to the Google Cloud PROJECT, not the key string. New keys created in the same project share the same exhausted quota. (Also: `serviceTier: "standard"` in responses does NOT indicate paid tier - misread once.)
- **Fix**: key from a genuinely different project works until ITS quota burns. Real fix (billing) recommended 4x, still pending.
- **Prevention**: quota errors -> check the PROJECT, not the key. Read the quota error body: it names the exact limit and metric. Never burn a teammate's time regenerating keys in the same project.

## 3. GEMINI_API_KEY missing on the deployed site
- **Date**: 2026-07-04
- **Symptom**: Deployed UI loaded but every Gemini call returned "Server is missing GEMINI_API_KEY".
- **Tried**: verified route reads process.env correctly; key present locally.
- **Root cause**: TWO separate Vercel projects existed (CLI-created `hackathon-base` + GitHub-connected `hackathon2323`); env var was set on one, user tested the other. `.env.local` never deploys.
- **Fix** [2434143]: env var added per-project in Vercel; .env.example committed; README instructions. Also: first `vercel env add` attempt stored surrounding quotes (stdin piping) - had to remove + re-add trimmed.
- **Prevention**: one deployment target, decided early, written in STATE.md. After setting env vars, verify with a real API call on the exact submitted URL, not localhost.

## 2. Whole site silently rendered in browser-default serif font
- **Date**: shipped 2026-07-03, found 2026-07-05
- **Symptom**: UI looked "old/government-department" despite Tailwind styling.
- **Tried**: assumed font was loaded because layout.tsx imported Geist and globals.css declared --font-sans.
- **Root cause**: `--font-sans: var(--font-sans)` in @theme inline - a self-reference that never resolves. The loaded font variable was actually named `--font-geist-sans`. Every font-sans element fell back to Times New Roman for two days without anyone noticing.
- **Fix** [c46827f]: Inter loaded with `variable: "--font-sans"` directly; verified the rendered <html> carries the font class.
- **Prevention**: after wiring any font, verify in the browser/DOM (computed style or html class), never trust the CSS declaration alone. Self-referencing var() fails silently.

## 1. Two AI sessions working in the same repo clobbered each other
- **Date**: 2026-07-04
- **Symptom**: Uncommitted changes kept appearing (audit-dashboard page over app/page.tsx, cooking-todo routes, deleted SVGs, stray dev servers on port 3000, 4 Vercel projects).
- **Tried**: git status archaeology before every risky operation; asked Jay which work was authoritative.
- **Root cause**: a second AI tool (OpenAI Codex) was concurrently editing the same working directory.
- **Fix**: Jay ruled the other session's work stale; removed its artifacts; stopped its leftover dev servers before starting ours.
- **Prevention**: ONE agent per working directory. Before overwriting any unexpected file: git status + ask. Check `Get-CimInstance Win32_Process` for foreign processes when ports are mysteriously busy.
