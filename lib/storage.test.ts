import { describe, expect, it } from "vitest";
import { mergeSavedTrip, parseSavedTrips } from "./storage";
import type { DestinationGuide } from "./types";

function makeGuide(destinationName: string): DestinationGuide {
  return {
    destinationName,
    country: "Testland",
    culturalIntro: "",
    heroImageQuery: "",
    whyItFits: "",
    cultureAtAGlance: [],
    hiddenGems: [],
    immersiveStory: "",
    localExperiences: [],
    localEtiquette: [],
    itinerary: { morning: "", afternoon: "", evening: "" },
  };
}

describe("parseSavedTrips", () => {
  it("returns an empty array for null input", () => {
    expect(parseSavedTrips(null)).toEqual([]);
  });

  it("returns an empty array for malformed JSON", () => {
    expect(parseSavedTrips("not json")).toEqual([]);
  });

  it("returns an empty array when JSON is not an array", () => {
    expect(parseSavedTrips('{"a":1}')).toEqual([]);
  });

  it("parses a valid saved trips array", () => {
    const guide = makeGuide("Jaipur");
    expect(parseSavedTrips(JSON.stringify([guide]))).toEqual([guide]);
  });
});

describe("mergeSavedTrip", () => {
  it("adds a new trip to an empty list", () => {
    const guide = makeGuide("Jaipur");
    expect(mergeSavedTrip([], guide)).toEqual([guide]);
  });

  it("keeps other saved trips untouched", () => {
    const kyoto = makeGuide("Kyoto");
    const jaipur = makeGuide("Jaipur");
    expect(mergeSavedTrip([kyoto], jaipur)).toEqual([kyoto, jaipur]);
  });

  it("replaces an existing trip with the same destination name", () => {
    const original = makeGuide("Jaipur");
    const updated = { ...makeGuide("Jaipur"), country: "Updated" };
    const result = mergeSavedTrip([original], updated);
    expect(result).toHaveLength(1);
    expect(result[0].country).toBe("Updated");
  });
});
