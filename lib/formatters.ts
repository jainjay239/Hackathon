import type { DestinationGuide } from "./types";

export function formatItinerary(guide: DestinationGuide): string {
  return [
    `${guide.destinationName}, ${guide.country} - 1-Day Cultural Itinerary`,
    "",
    `Morning: ${guide.itinerary.morning}`,
    `Afternoon: ${guide.itinerary.afternoon}`,
    `Evening: ${guide.itinerary.evening}`,
  ].join("\n");
}
