# Testing Evidence

## Automated Test Coverage Summary

31 automated tests across 5 files, run with Vitest (`npm test`). No test calls the live Gemini API or requires a real `GEMINI_API_KEY` - everything tests pure, extracted logic with mock/sample data.

| Test file | What it checks |
|---|---|
| `lib/validation.test.ts` | Destination input validation (trims, requires non-empty, rejects >100 chars, rejects non-string, handles missing/null body) and weather/budget/mood chip toggle logic |
| `lib/gemini-response.test.ts` | Gemini response shape validation - accepts a well-formed guide, rejects null, rejects a guide missing a required field, rejects empty arrays, rejects an incomplete itinerary; also JSON extraction (plain JSON, markdown-fenced JSON, malformed JSON throws) |
| `lib/formatters.test.ts` | Itinerary text formatting (destination, country, and all three time blocks appear correctly) |
| `lib/imageFallback.test.ts` | Wikipedia image lookup URL construction and thumbnail extraction, including the fallback path (no pages, no thumbnail, null/undefined input all return `null` safely instead of throwing) |
| `lib/storage.test.ts` | Save Trip logic - parsing saved trips from localStorage (including malformed JSON and non-array JSON), merging a new trip in, replacing an existing trip with the same destination name, keeping other saved trips intact |

Run tests: `npm test`
Watch mode: `npm run test:watch`
Full verification (lint + test + build): `npm run verify`

## Manual Test Checklist

- [x] App loads successfully
- [x] Destination chip selection works
- [x] Custom destination input works
- [x] Weather chip selection works
- [x] Budget chip selection works
- [x] Mood chip selection works
- [x] Discover button calls server API
- [x] Gemini response renders cultural guide
- [x] Missing GEMINI_API_KEY shows clear error
- [x] Invalid Gemini response does not crash UI
- [x] Images load for common destinations
- [x] Image fallback renders if image lookup fails
- [x] Save Trip works through localStorage
- [x] Copy Itinerary works
- [x] App builds successfully
- [x] App works on Vercel after env variable is configured

## Golden Demo Path Tested

Destination chip (or custom input) -> weather/budget/mood chips -> Discover -> loading skeleton -> full cultural guide page (hero, why-it-fits, culture at a glance, hidden gems, immersive story, local experiences + etiquette, 1-day itinerary) -> Save Trip -> Copy Itinerary. Verified live against `gemini-2.5-flash` with real destinations (Jaipur, Kyoto, Istanbul, Oaxaca, Bali).

## Gemini Failure Handling Tested

- Missing `GEMINI_API_KEY` -> clean `500` error, UI shows a message instead of crashing (this is exactly what surfaced the earlier Vercel deployment issue, since fixed).
- Malformed or incomplete Gemini JSON -> rejected by `isValidGuide`, returns a clean `502` error, never rendered as fake content.
- Empty/blank destination input -> rejected before any Gemini call, clean `400` error.

## Vercel Environment Variable Check

Confirmed `GEMINI_API_KEY` must be set per-project in Vercel (Settings -> Environment Variables) - this is not automatic from `.env.local`. See README for the exact steps.

## Image Fallback Check

Verified directly against the Wikipedia API: a real query (e.g. "Jaipur Amber Fort") returns a usable thumbnail; a nonsense query returns no thumbnail, and `extractWikipediaThumbnail` returns `null` in that case (unit-tested), which the UI renders as a gradient + emoji card instead of a broken image.

## Save Trip and Copy Itinerary Checks

Both covered by unit tests on the underlying pure logic (`lib/storage.ts`, `lib/formatters.ts`) plus manual click-through in the browser (localStorage persists across refresh, clipboard paste confirms the copied text).

## Mobile Responsiveness Check

Manually checked at narrow viewport widths - destination cards and result sections collapse to a single column, the search card and chips wrap and remain usable, images keep their aspect ratio.

## Known Scope Boundaries

- No login, database, or booking flow.
- No live weather API - weather is a traveler preference chip, not real-time data.
- No live events API - "local events" are Gemini-generated seasonal cultural moments, clearly framed as such, never fabricated as real dated events.
- No interactive map.
- No component/UI rendering tests - the automated suite covers extracted pure logic only, per the constraint of not requiring a live Gemini API key or a browser environment in CI.
