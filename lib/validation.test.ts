import { describe, expect, it } from "vitest";
import {
  isDestinationRequestError,
  parseDestinationRequest,
  toggleArrayValue,
  toggleChipValue,
} from "./validation";

describe("parseDestinationRequest", () => {
  it("accepts a valid request and trims fields", () => {
    const result = parseDestinationRequest({
      destination: "  Jaipur  ",
      tripLength: " 3 days ",
      travelerType: "Family",
      weather: " Warm ",
      budget: "Budget",
      mood: "",
      culturalInterests: ["Food", "  Festivals  "],
      comfortNeeds: ["Easy walking"],
    });

    expect(result).toEqual({
      destination: "Jaipur",
      tripLength: "3 days",
      travelerType: "Family",
      weather: "Warm",
      budget: "Budget",
      mood: "",
      culturalInterests: ["Food", "Festivals"],
      comfortNeeds: ["Easy walking"],
    });
  });

  it("defaults missing preference fields to empty values", () => {
    const result = parseDestinationRequest({ destination: "Kyoto" });
    expect(result).toEqual({
      destination: "Kyoto",
      tripLength: "",
      travelerType: "",
      weather: "",
      budget: "",
      mood: "",
      culturalInterests: [],
      comfortNeeds: [],
    });
  });

  it("rejects a missing destination", () => {
    const result = parseDestinationRequest({});
    expect(isDestinationRequestError(result)).toBe(true);
  });

  it("rejects a blank destination", () => {
    const result = parseDestinationRequest({ destination: "   " });
    expect(isDestinationRequestError(result)).toBe(true);
  });

  it("rejects a destination longer than 100 characters", () => {
    const result = parseDestinationRequest({ destination: "a".repeat(101) });
    expect(isDestinationRequestError(result)).toBe(true);
  });

  it("rejects a non-string destination", () => {
    const result = parseDestinationRequest({ destination: 42 });
    expect(isDestinationRequestError(result)).toBe(true);
  });

  it("handles a null body without throwing", () => {
    const result = parseDestinationRequest(null);
    expect(isDestinationRequestError(result)).toBe(true);
  });

  it("ignores non-array culturalInterests/comfortNeeds", () => {
    const result = parseDestinationRequest({
      destination: "Bali",
      culturalInterests: "Food",
      comfortNeeds: 42,
    });
    expect(isDestinationRequestError(result)).toBe(false);
    if (!isDestinationRequestError(result)) {
      expect(result.culturalInterests).toEqual([]);
      expect(result.comfortNeeds).toEqual([]);
    }
  });

  it("drops non-string entries and caps array length and item length", () => {
    const result = parseDestinationRequest({
      destination: "Bali",
      culturalInterests: [
        "Food",
        42,
        null,
        "a".repeat(41),
        ...Array.from({ length: 15 }, (_, i) => `Interest ${i}`),
      ],
    });
    expect(isDestinationRequestError(result)).toBe(false);
    if (!isDestinationRequestError(result)) {
      expect(result.culturalInterests.length).toBeLessThanOrEqual(10);
      expect(result.culturalInterests).toContain("Food");
      expect(result.culturalInterests.every((item) => item.length <= 40)).toBe(true);
    }
  });
});

describe("toggleChipValue", () => {
  it("selects an option when nothing is selected", () => {
    expect(toggleChipValue("", "Warm")).toBe("Warm");
  });

  it("deselects an option when it is already selected", () => {
    expect(toggleChipValue("Warm", "Warm")).toBe("");
  });

  it("switches to a new option when a different one is selected", () => {
    expect(toggleChipValue("Warm", "Cool")).toBe("Cool");
  });
});

describe("toggleArrayValue", () => {
  it("adds an option that is not yet selected", () => {
    expect(toggleArrayValue([], "Food")).toEqual(["Food"]);
    expect(toggleArrayValue(["Food"], "Festivals")).toEqual(["Food", "Festivals"]);
  });

  it("removes an option that is already selected", () => {
    expect(toggleArrayValue(["Food", "Festivals"], "Food")).toEqual(["Festivals"]);
  });
});
