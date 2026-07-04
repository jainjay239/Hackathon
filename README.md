# Culture Compass

A GenAI-powered cultural discovery platform built for PromptWars (Google for Developers). Instead of generic tourist listicles, Culture Compass helps travelers connect with a destination's heritage, food, traditions, and hidden gems before they even arrive.

## Problem It Solves

Generic travel apps show the same top-10 tourist traps for every destination. Travelers rarely discover the hidden gems, local traditions, or cultural stories that make a place meaningful. Culture Compass turns a single destination pick (plus a weather/budget/mood preference) into a rich, image-backed cultural guide.

## Who It Helps

Travelers who want to engage with a destination's culture, not just book flights and hotels - the kind of traveler who wants to understand a place before visiting it.

## Key Features

- Pick a destination (or type any city) plus weather, budget, and mood preferences
- One real-time Gemini call generates a full cultural guide: intro, why-it-fits, culture-at-a-glance cards, hidden gems, an immersive story, local experiences, etiquette tips, and a 1-day culture-first itinerary
- Every card is illustrated with a real photo looked up live from Wikipedia; if no match is found, a designed gradient + emoji card is shown instead - never a broken image
- Save a trip to your browser and copy the itinerary to your clipboard

## GenAI Usage Disclosure

This app uses the **Google Gemini API** (`gemini-2.5-flash`), called directly via `fetch` from a server-only Next.js route at `app/api/destination/route.ts` - no SDK dependency, just the REST endpoint.

The traveler's destination and weather/budget/mood preferences are sent to Gemini in a single prompt that asks it to respond as a knowledgeable local cultural guide, not a generic travel blog. Gemini must return strict structured JSON. If Gemini is unavailable, misconfigured, or returns malformed output, the app shows a clear error - it never fabricates or falls back to fake AI content.

There is no live events API. Where the problem statement calls for "local events," Gemini generates an evergreen "seasonal cultural moment" (e.g. a recurring festival or tradition) framed generally rather than as a specific dated event, since there is no real events data source.

Environment variable required in `.env.local` (and in the Vercel project's environment variables for deployment):

```bash
GEMINI_API_KEY=your_key_here
```

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run lint
npm run build
```

Golden demo path:

1. Open the app.
2. Pick a destination chip (or type one) and optionally a weather/budget/mood chip.
3. Click Discover.
4. Confirm the loading state, then the full cultural guide renders: hero, why-it-fits, culture at a glance, hidden gems, immersive story, local experiences + etiquette, 1-day itinerary.
5. Confirm images load for well-known destinations, and a gradient + emoji card shows instead of a broken image for anything obscure.
6. Click "Save trip" and "Copy itinerary" and confirm both work.

## Scope Boundaries

- No login, database, or booking flow
- No live weather API - weather is a traveler preference chip, not real-time data
- No live events API - "local events" are Gemini-generated seasonal cultural moments, clearly framed as such
- No interactive map
- No mock or fabricated Gemini output
