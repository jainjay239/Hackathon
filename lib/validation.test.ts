import { describe, expect, it } from "vitest";
import { isDestinationRequestError, parseDestinationRequest, toggleChipValue } from "./validation";

describe("parseDestinationRequest", () => {
  it("accepts a valid request and trims fields", () => {
    const result = parseDestinationRequest({
      destination: "  Jaipur  ",
      weather: " Warm ",
      budget: "Budget",
      mood: "",
    });

    expect(result).toEqual({
      destination: "Jaipur",
      weather: "Warm",
      budget: "Budget",
      mood: "",
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
