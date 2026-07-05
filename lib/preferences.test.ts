import { describe, expect, it } from "vitest";
import { TRIP_LENGTH_OPTIONS, tripLengthToDayCount } from "./preferences";

describe("tripLengthToDayCount", () => {
  it("maps every trip length option to its exact day count", () => {
    expect(tripLengthToDayCount("1 day")).toBe(1);
    expect(tripLengthToDayCount("Weekend")).toBe(2);
    expect(tripLengthToDayCount("3 days")).toBe(3);
    expect(tripLengthToDayCount("5 days")).toBe(5);
    expect(tripLengthToDayCount("1 week")).toBe(7);
  });

  it("covers every option offered in the UI", () => {
    for (const option of TRIP_LENGTH_OPTIONS) {
      expect(tripLengthToDayCount(option)).toBeGreaterThanOrEqual(1);
    }
  });

  it("defaults to a 1-day sample when no trip length is selected", () => {
    expect(tripLengthToDayCount("")).toBe(1);
    expect(tripLengthToDayCount("something-unknown")).toBe(1);
  });
});
