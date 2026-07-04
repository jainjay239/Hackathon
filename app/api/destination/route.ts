import { NextRequest, NextResponse } from "next/server";

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

interface GlanceCard {
  type: "heritage" | "food" | "festival" | "craft" | "hiddenGem" | "experience";
  title: string;
  description: string;
  imageQuery: string;
}

interface HiddenGem {
  name: string;
  description: string;
  imageQuery: string;
}

interface LocalExperience {
  title: string;
  description: string;
}

interface DestinationGuide {
  destinationName: string;
  country: string;
  culturalIntro: string;
  heroImageQuery: string;
  whyItFits: string;
  cultureAtAGlance: GlanceCard[];
  hiddenGems: HiddenGem[];
  immersiveStory: string;
  localExperiences: LocalExperience[];
  localEtiquette: string[];
  itinerary: { morning: string; afternoon: string; evening: string };
}

function buildPrompt(destination: string, weather: string, budget: string, mood: string) {
  return `You are a knowledgeable local cultural guide for "${destination}", not a generic travel blogger. Write as someone who has lived there and loves its heritage, food, and traditions. Avoid generic filler phrases like "vibrant city" or "rich history" without specifics.

Traveler preferences: weather = ${weather || "any"}, budget = ${budget || "any"}, mood = ${mood || "any"}.

Return ONLY a JSON object, no markdown fences, no commentary, matching exactly this shape:
{
  "destinationName": string,
  "country": string,
  "culturalIntro": string (2-3 sentences, evocative, specific to this place),
  "heroImageQuery": string (short search phrase for a real photo of this destination, e.g. "Jaipur Amber Fort"),
  "whyItFits": string (2-3 sentences explicitly referencing the traveler's weather/budget/mood preferences above),
  "cultureAtAGlance": array of 5-6 objects {"type": one of "heritage"|"food"|"festival"|"craft"|"hiddenGem"|"experience", "title": string, "description": string (1-2 sentences), "imageQuery": string (specific search phrase, e.g. "Jaipur block printing")},
  "hiddenGems": array of 3-4 objects {"name": string, "description": string (1-2 sentences, lesser-known spot), "imageQuery": string},
  "immersiveStory": string (1 short narrative paragraph telling a vivid cultural story about this place, as if guiding the traveler through it),
  "localExperiences": array of 4-5 objects {"title": string, "description": string}. Include at least one evergreen "seasonal cultural moment" (e.g. a recurring festival or seasonal tradition) phrased generally, not a specific dated event, since we have no live events data.
  "localEtiquette": array of 3-4 short practical etiquette tips specific to this culture,
  "itinerary": {"morning": string, "afternoon": string, "evening": string} - a 1-day culture-first plan (no generic sightseeing filler, focus on authentic local experiences)
}`;
}

function extractJson(text: string): unknown {
  const trimmed = text.trim().replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
  return JSON.parse(trimmed);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isValidGuide(data: unknown): data is DestinationGuide {
  if (!data || typeof data !== "object") return false;
  const guide = data as Record<string, unknown>;

  if (
    !isNonEmptyString(guide.destinationName) ||
    !isNonEmptyString(guide.country) ||
    !isNonEmptyString(guide.culturalIntro) ||
    !isNonEmptyString(guide.heroImageQuery) ||
    !isNonEmptyString(guide.whyItFits) ||
    !isNonEmptyString(guide.immersiveStory)
  ) {
    return false;
  }

  if (!Array.isArray(guide.cultureAtAGlance) || guide.cultureAtAGlance.length === 0) return false;
  if (!Array.isArray(guide.hiddenGems) || guide.hiddenGems.length === 0) return false;
  if (!Array.isArray(guide.localExperiences) || guide.localExperiences.length === 0) return false;
  if (!Array.isArray(guide.localEtiquette) || guide.localEtiquette.length === 0) return false;

  const itinerary = guide.itinerary as Record<string, unknown> | undefined;
  if (
    !itinerary ||
    !isNonEmptyString(itinerary.morning) ||
    !isNonEmptyString(itinerary.afternoon) ||
    !isNonEmptyString(itinerary.evening)
  ) {
    return false;
  }

  return true;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Server is missing GEMINI_API_KEY" }, { status: 500 });
  }

  let destination = "";
  let weather = "";
  let budget = "";
  let mood = "";
  try {
    const body = await request.json();
    destination = typeof body?.destination === "string" ? body.destination.trim() : "";
    weather = typeof body?.weather === "string" ? body.weather.trim() : "";
    budget = typeof body?.budget === "string" ? body.budget.trim() : "";
    mood = typeof body?.mood === "string" ? body.mood.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!destination || destination.length > 100) {
    return NextResponse.json({ error: "destination is required (max 100 chars)" }, { status: 400 });
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
        contents: [{ parts: [{ text: buildPrompt(destination, weather, budget, mood) }] }],
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
