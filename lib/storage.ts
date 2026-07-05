import type { DestinationGuide, ItineraryDay } from "./types";

export const SAVED_TRIPS_KEY = "cultureCompass.savedTrips";

function normalizeItinerary(itinerary: unknown): ItineraryDay[] {
  if (Array.isArray(itinerary)) return itinerary;
  const legacy = itinerary as { morning?: string; afternoon?: string; evening?: string } | null;
  if (legacy && typeof legacy.morning === "string") {
    return [
      {
        dayLabel: "Day 1",
        morning: legacy.morning,
        afternoon: legacy.afternoon ?? "",
        evening: legacy.evening ?? "",
      },
    ];
  }
  return [];
}

export function parseSavedTrips(raw: string | null): DestinationGuide[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((trip: DestinationGuide) => ({
      ...trip,
      itinerary: normalizeItinerary(trip.itinerary),
    }));
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

export function removeSavedTrip(
  existing: DestinationGuide[],
  destinationName: string
): DestinationGuide[] {
  return existing.filter((trip) => trip.destinationName !== destinationName);
}
