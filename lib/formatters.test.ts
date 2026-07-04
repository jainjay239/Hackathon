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
  itinerary: { morning: "Visit Fushimi Inari.", afternoon: "Tea ceremony.", evening: "Gion district walk." },
};

describe("formatItinerary", () => {
  it("includes destination, country, and all three time blocks", () => {
    const text = formatItinerary(guide);
    expect(text).toContain("Kyoto, Japan");
    expect(text).toContain("Morning: Visit Fushimi Inari.");
    expect(text).toContain("Afternoon: Tea ceremony.");
    expect(text).toContain("Evening: Gion district walk.");
  });
});
