import type { DestinationGuide } from "./types";

export function extractJson(text: string): unknown {
  const trimmed = text
    .trim()
    .replace(/^```json/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();
  return JSON.parse(trimmed);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

export function isValidGuide(data: unknown): data is DestinationGuide {
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
