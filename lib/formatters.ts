import type { DestinationGuide } from "./types";

export function formatItinerary(guide: DestinationGuide): string {
  const dayCount = guide.itinerary.length;
  const header = `${guide.destinationName}, ${guide.country} - ${dayCount}-Day Cultural Itinerary`;

  const days = guide.itinerary.map((day) =>
    [
      day.dayLabel,
      `Morning: ${day.morning}`,
      `Afternoon: ${day.afternoon}`,
      `Evening: ${day.evening}`,
    ].join("\n")
  );

  return [header, ...days].join("\n\n");
}
