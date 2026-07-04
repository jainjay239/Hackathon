import { NextRequest, NextResponse } from "next/server";
import { extractJson, isValidGuide } from "@/lib/gemini-response";
import {
  isDestinationRequestError,
  parseDestinationRequest,
  type DestinationRequest,
} from "@/lib/validation";

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

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
  return `You are a knowledgeable local cultural guide for "${destination}", not a generic travel blogger. Write as someone who has lived there and loves its heritage, food, and traditions. Avoid generic filler phrases like "vibrant city" or "rich history" without specifics.

Traveler preferences:
- trip length: ${tripLength || "not specified"}
- traveler type: ${travelerType || "not specified"}
- weather: ${weather || "any"}
- budget: ${budget || "any"}
- mood: ${mood || "any"}
- cultural interests: ${culturalInterests.length > 0 ? culturalInterests.join(", ") : "not specified"}
- comfort needs: ${comfortNeeds.length > 0 ? comfortNeeds.join(", ") : "not specified"}

Use these preferences to personalize the guide:
- "whyItFits" must explicitly reference the traveler's budget, weather, mood, traveler type, and any stated cultural interests.
- "localExperiences" should prioritize experiences matching the stated cultural interests when any are given.
- "localEtiquette" should include tips relevant to the traveler type and comfort needs when relevant (e.g. family/senior-friendly notes, low-crowd or easy-walking spots).
- "itinerary" stays a single culture-first sample day regardless of trip length - if trip length is longer than one day, frame it as a highlight day within that longer trip rather than inventing a multi-day plan.

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
  "itinerary": {"morning": string, "afternoon": string, "evening": string} - a 1-day culture-first plan (no generic sightseeing filler, focus on authentic local experiences)
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

  let geminiResponse: Response;
  try {
    geminiResponse = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(parsed) }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    });
  } catch {
    return NextResponse.json({ error: "Could not reach Gemini API" }, { status: 502 });
  }

  if (!geminiResponse.ok) {
    return NextResponse.json({ error: `Gemini API error (${geminiResponse.status})` }, { status: 502 });
  }

  const data = await geminiResponse.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    return NextResponse.json({ error: "Gemini returned no content" }, { status: 502 });
  }

  let guide: unknown;
  try {
    guide = extractJson(text);
  } catch {
    return NextResponse.json({ error: "Gemini returned malformed JSON" }, { status: 502 });
  }

  if (!isValidGuide(guide)) {
    return NextResponse.json({ error: "Gemini response did not match expected shape" }, { status: 502 });
  }

  return NextResponse.json(guide);
}
