import { NextRequest, NextResponse } from "next/server";
import { ensureDayLabels, extractJson, isValidGuide } from "@/lib/gemini-response";
import { tripLengthToDayCount } from "@/lib/preferences";
import {
  isDestinationRequestError,
  parseDestinationRequest,
  type DestinationRequest,
} from "@/lib/validation";

export const maxDuration = 120;

const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash"];
const ATTEMPTS_PER_MODEL = 2;
const RETRY_DELAY_MS = 1500;

function geminiUrl(model: string) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

function buildPrompt({
  destination,
  tripLength,
  travelerType,
  weather,
  budget,
  mood,
  culturalInterests,
  comfortNeeds,
}: DestinationRequest) {
  const dayCount = tripLengthToDayCount(tripLength);
  return `You are a warm, knowledgeable local cultural travel consultant for "${destination}" - a real person who has lived there and loves its heritage, food, and traditions, helping a traveler make better decisions about their trip. You are not a generic travel blogger and not a robotic information generator.

Writing style rules:
- Explain WHY something is worth the traveler's time, not just what it is - give context, local meaning, and cultural significance.
- Be warm, human, useful, culturally respectful, and slightly inspiring. Easy to understand, never overcomplicated.
- Never use robotic openers like "Here is the information you requested" and never write dry, encyclopedia-style prose.
- Avoid generic filler phrases like "vibrant city" or "rich history" without specifics.
- Keep sentences clear and readable - this guide is read by a wide range of travelers, from those who want fast, photo-worthy highlights to those who want practical, unhurried, easy-to-follow guidance. Write so both feel served, without calling out or stereotyping any age group or traveler segment.

Traveler preferences:
- trip length: ${tripLength || "not specified"}
- traveler type: ${travelerType || "not specified"}
- weather: ${weather || "any"}
- budget: ${budget || "any"}
- mood: ${mood || "any"}
- cultural interests: ${culturalInterests.length > 0 ? culturalInterests.join(", ") : "not specified"}
- comfort needs: ${comfortNeeds.length > 0 ? comfortNeeds.join(", ") : "not specified"}

Use these preferences to personalize the guide like a consultant would:
- "whyItFits" must explicitly reference the traveler's budget, weather, mood, traveler type, and any stated cultural interests, and explain the practical/emotional benefit of each, not just restate them.
- "localExperiences" should prioritize experiences matching the stated cultural interests when any are given, and should call out photo-worthy or story-worthy moments alongside practical value (time, cost, effort).
- "localEtiquette" should include tips relevant to the traveler type and comfort needs when relevant (e.g. family/senior-friendly notes, low-crowd or easy-walking spots, accessibility-sensitive guidance).
- "itinerary" must contain EXACTLY ${dayCount} day object(s) - one per day of the traveler's trip. Each day must be distinct (no repeated activities across days), flow logically (e.g. arrival-day pacing first, deeper exploration later), and respect the traveler's comfort needs and budget in its pacing.

Return ONLY a JSON object, no markdown fences, no commentary, matching exactly this shape:
{
  "destinationName": string,
  "country": string,
  "culturalIntro": string (2-3 sentences, evocative, specific to this place),
  "heroImageQuery": string (short search phrase for a real photo of this destination, e.g. "Jaipur Amber Fort"),
  "whyItFits": string (2-3 sentences explicitly referencing the traveler's preferences above),
  "cultureAtAGlance": array of 5-6 objects {"type": one of "heritage"|"food"|"festival"|"craft"|"hiddenGem"|"experience", "title": string, "description": string (1-2 sentences), "imageQuery": string (specific search phrase, e.g. "Jaipur block printing")},
  "hiddenGems": array of 3-4 objects {"name": string, "description": string (1-2 sentences, lesser-known spot), "imageQuery": string},
  "immersiveStory": string (1 short narrative paragraph telling a vivid cultural story about this place, as if guiding the traveler through it),
  "localExperiences": array of 4-5 objects {"title": string, "description": string}. Include at least one evergreen "seasonal cultural moment" (e.g. a recurring festival or seasonal tradition) phrased generally, not a specific dated event, since we have no live events data.
  "localEtiquette": array of 3-4 short practical etiquette tips specific to this culture,
  "itinerary": array of EXACTLY ${dayCount} objects [{"dayLabel": string (short, e.g. "Day 1 - Old City Immersion"), "morning": string, "afternoon": string, "evening": string}] - a ${dayCount}-day culture-first plan (no generic sightseeing filler, focus on authentic local experiences)
}`;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Server is missing GEMINI_API_KEY" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = parseDestinationRequest(body);
  if (isDestinationRequestError(parsed)) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const prompt = buildPrompt(parsed);
  let lastError = "Could not reach Gemini API";
  let firstTry = true;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < ATTEMPTS_PER_MODEL; attempt++) {
      if (!firstTry) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
      firstTry = false;

      let geminiResponse: Response;
      try {
        geminiResponse = await fetch(geminiUrl(model), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        });
      } catch {
        lastError = "Could not reach Gemini API";
        continue;
      }

      if (geminiResponse.status === 429) {
        lastError = `Gemini API error (${geminiResponse.status})`;
        break;
      }

      if (!geminiResponse.ok) {
        lastError = `Gemini API error (${geminiResponse.status})`;
        continue;
      }

      const data = await geminiResponse.json();
      const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        lastError = "Gemini returned no content";
        continue;
      }

      let guide: unknown;
      try {
        guide = extractJson(text);
      } catch {
        lastError = "Gemini returned malformed JSON";
        continue;
      }

      if (!isValidGuide(guide)) {
        lastError = "Gemini response did not match expected shape";
        continue;
      }

      return NextResponse.json({ ...guide, itinerary: ensureDayLabels(guide.itinerary) });
    }
  }

  return NextResponse.json({ error: lastError }, { status: 502 });
}
