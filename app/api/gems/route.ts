import { NextRequest, NextResponse } from "next/server";

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

interface Gem {
  name: string;
  oneLiner: string;
  category: string;
  emoji: string;
}

function buildPrompt(destination: string) {
  return `You are a local culture expert. For the travel destination "${destination}", suggest 5 hidden gem attractions that are lesser-known than the typical top tourist spots but real, findable places.

Return ONLY a JSON array, no markdown fences, no commentary, matching exactly this shape:
[{"name": string, "oneLiner": string (max 20 words, evocative hook), "category": string (e.g. "food", "nature", "art", "history", "nightlife"), "emoji": string (single emoji representing it)}]`;
}

function extractJsonArray(text: string): unknown {
  const trimmed = text.trim().replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
  return JSON.parse(trimmed);
}

function isValidGems(data: unknown): data is Gem[] {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    data.every(
      (item) =>
        item &&
        typeof item.name === "string" &&
        typeof item.oneLiner === "string" &&
        typeof item.category === "string" &&
        typeof item.emoji === "string"
    )
  );
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Server is missing GEMINI_API_KEY" }, { status: 500 });
  }

  let destination: string;
  try {
    const body = await request.json();
    destination = typeof body?.destination === "string" ? body.destination.trim() : "";
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
        contents: [{ parts: [{ text: buildPrompt(destination) }] }],
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

  let gems: unknown;
  try {
    gems = extractJsonArray(text);
  } catch {
    return NextResponse.json({ error: "Gemini returned malformed JSON" }, { status: 502 });
  }

  if (!isValidGems(gems)) {
    return NextResponse.json({ error: "Gemini response did not match expected shape" }, { status: 502 });
  }

  return NextResponse.json({ gems });
}
