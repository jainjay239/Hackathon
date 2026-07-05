import { describe, expect, it } from "vitest";
import {
  deriveDestinationSections,
  filterGlanceByType,
  getFoodExperiences,
  getNonFoodExperiences,
} from "./sections";
import type { DestinationGuide } from "./types";

const guide: DestinationGuide = {
  destinationName: "Jaipur",
  country: "India",
  culturalIntro: "",
  heroImageQuery: "",
  whyItFits: "",
  cultureAtAGlance: [
    { type: "heritage", title: "Amber Fort", description: "A hilltop fort.", imageQuery: "Amber Fort" },
    { type: "food", title: "Dal Baati", description: "A hearty dish.", imageQuery: "Dal Baati" },
    { type: "craft", title: "Block printing", description: "Hand-carved blocks.", imageQuery: "Block printing" },
    { type: "festival", title: "Teej", description: "A monsoon festival.", imageQuery: "Teej" },
  ],
  hiddenGems: [],
  immersiveStory: "",
  localExperiences: [
    { title: "Street food walk", description: "Taste local dishes and snacks." },
    { title: "Block printing workshop", description: "Learn the craft from an artisan." },
  ],
  localEtiquette: ["Remove shoes before entering temples."],
  itinerary: [{ dayLabel: "Day 1", morning: "", afternoon: "", evening: "" }],
};

describe("filterGlanceByType", () => {
  it("returns only cards matching the given type", () => {
    expect(filterGlanceByType(guide.cultureAtAGlance, "heritage")).toEqual([guide.cultureAtAGlance[0]]);
    expect(filterGlanceByType(guide.cultureAtAGlance, "festival")).toEqual([guide.cultureAtAGlance[3]]);
  });
});

describe("getFoodExperiences / getNonFoodExperiences", () => {
  it("splits experiences by food-related keywords", () => {
    expect(getFoodExperiences(guide.localExperiences)).toEqual([guide.localExperiences[0]]);
    expect(getNonFoodExperiences(guide.localExperiences)).toEqual([guide.localExperiences[1]]);
  });
});

describe("deriveDestinationSections", () => {
  it("maps existing guide fields into the sidebar categories without losing data", () => {
    const sections = deriveDestinationSections(guide);

    expect(sections.sightseeing).toHaveLength(4);
    expect(sections.foodGlance).toEqual([guide.cultureAtAGlance[1]]);
    expect(sections.foodExperiences).toEqual([guide.localExperiences[0]]);
    expect(sections.traditions).toEqual([guide.cultureAtAGlance[2], guide.cultureAtAGlance[3]]);
    expect(sections.heritage).toEqual([guide.cultureAtAGlance[0]]);
    expect(sections.festivals).toEqual([guide.cultureAtAGlance[3]]);
    expect(sections.experiences).toEqual(guide.localExperiences);
  });

  it("returns empty arrays for categories with no matching content instead of throwing", () => {
    const bareGuide: DestinationGuide = { ...guide, cultureAtAGlance: [], localExperiences: [] };
    const sections = deriveDestinationSections(bareGuide);

    expect(sections.sightseeing).toEqual([]);
    expect(sections.foodGlance).toEqual([]);
    expect(sections.festivals).toEqual([]);
    expect(sections.experiences).toEqual([]);
  });
});
