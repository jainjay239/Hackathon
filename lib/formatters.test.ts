import { describe, expect, it } from "vitest";
import { formatItinerary } from "./formatters";
import type { DestinationGuide } from "./types";

const guide: DestinationGuide = {
  destinationName: "Kyoto",
  country: "Japan",
  culturalIntro: "",
  heroImageQuery: "",
  whyItFits: "",
  cultureAtAGlance: [],
  hiddenGems: [],
  immersiveStory: "",
  localExperiences: [],
  localEtiquette: [],
  itinerary: [
    { dayLabel: "Day 1 - Temples", morning: "Visit Fushimi Inari.", afternoon: "Tea ceremony.", evening: "Gion district walk." },
    { dayLabel: "Day 2 - Crafts", morning: "Nishijin weaving.", afternoon: "Pottery studio.", evening: "Kaiseki dinner." },
  ],
};

describe("formatItinerary", () => {
  it("includes destination, country, day count, labels, and all time blocks", () => {
    const text = formatItinerary(guide);
    expect(text).toContain("Kyoto, Japan - 2-Day Cultural Itinerary");
    expect(text).toContain("Day 1 - Temples");
    expect(text).toContain("Morning: Visit Fushimi Inari.");
    expect(text).toContain("Day 2 - Crafts");
    expect(text).toContain("Evening: Kaiseki dinner.");
  });
});
