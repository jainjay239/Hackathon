import type { DestinationGuide } from "./types";

export const SAVED_TRIPS_KEY = "cultureCompass.savedTrips";

export function parseSavedTrips(raw: string | null): DestinationGuide[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function mergeSavedTrip(
  existing: DestinationGuide[],
  guide: DestinationGuide
): DestinationGuide[] {
  return [
    ...existing.filter((trip) => trip.destinationName !== guide.destinationName),
    guide,
  ];
}
