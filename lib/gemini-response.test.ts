import { describe, expect, it } from "vitest";
import { extractJson, isValidGuide } from "./gemini-response";
import type { DestinationGuide } from "./types";

const validGuide: DestinationGuide = {
  destinationName: "Jaipur",
  country: "India",
  culturalIntro: "A city of forts and bazaars.",
  heroImageQuery: "Jaipur Amber Fort",
  whyItFits: "Warm weather and heritage sites suit you.",
  cultureAtAGlance: [
    { type: "heritage", title: "Amber Fort", description: "A hilltop fort.", imageQuery: "Amber Fort" },
  ],
  hiddenGems: [{ name: "Panna Meena ka Kund", description: "A stepwell.", imageQuery: "Panna Meena" }],
  immersiveStory: "Walking through the old city at dusk...",
  localExperiences: [{ title: "Block printing workshop", description: "Try it yourself." }],
  localEtiquette: ["Remove shoes before entering temples."],
  itinerary: { morning: "Visit the fort.", afternoon: "Explore the bazaar.", evening: "Watch the sunset." },
};

describe("extractJson", () => {
  it("parses plain JSON", () => {
    expect(extractJson('{"a":1}')).toEqual({ a: 1 });
  });

  it("strips markdown json fences", () => {
    expect(extractJson('```json\n{"a":1}\n```')).toEqual({ a: 1 });
  });

  it("strips plain markdown fences", () => {
    expect(extractJson('```\n{"a":1}\n```')).toEqual({ a: 1 });
  });

  it("throws on malformed JSON", () => {
    expect(() => extractJson("not json")).toThrow();
  });
});

describe("isValidGuide", () => {
  it("accepts a fully-formed guide", () => {
    expect(isValidGuide(validGuide)).toBe(true);
  });

  it("rejects null", () => {
    expect(isValidGuide(null)).toBe(false);
  });

  it("rejects a guide missing a required string field", () => {
    const { destinationName, ...rest } = validGuide;
    void destinationName;
    expect(isValidGuide(rest)).toBe(false);
  });

  it("rejects a guide with an empty cultureAtAGlance array", () => {
    expect(isValidGuide({ ...validGuide, cultureAtAGlance: [] })).toBe(false);
  });

  it("rejects a guide with an incomplete itinerary", () => {
    expect(
      isValidGuide({ ...validGuide, itinerary: { morning: "Visit the fort." } })
    ).toBe(false);
  });
});
