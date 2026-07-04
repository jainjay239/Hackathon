import type { DestinationGuide, GlanceCard, GlanceType, LocalExperience } from "./types";

const FOOD_KEYWORDS = [
  "food",
  "cuisine",
  "dish",
  "market",
  "culinary",
  "eat",
  "meal",
  "cook",
  "kitchen",
  "flavor",
  "taste",
];

function matchesFoodKeywords(experience: LocalExperience): boolean {
  const text = `${experience.title} ${experience.description}`.toLowerCase();
  return FOOD_KEYWORDS.some((keyword) => text.includes(keyword));
}

export function filterGlanceByType(cards: GlanceCard[], type: GlanceType): GlanceCard[] {
  return cards.filter((card) => card.type === type);
}

export function getFoodExperiences(experiences: LocalExperience[]): LocalExperience[] {
  return experiences.filter(matchesFoodKeywords);
}

export function getNonFoodExperiences(experiences: LocalExperience[]): LocalExperience[] {
  return experiences.filter((experience) => !matchesFoodKeywords(experience));
}

export interface DestinationSections {
  sightseeing: GlanceCard[];
  foodGlance: GlanceCard[];
  foodExperiences: LocalExperience[];
  localHighlights: LocalExperience[];
  traditions: GlanceCard[];
  heritage: GlanceCard[];
  festivals: GlanceCard[];
  experiences: LocalExperience[];
}

export function deriveDestinationSections(guide: DestinationGuide): DestinationSections {
  const { cultureAtAGlance, localExperiences } = guide;

  return {
    sightseeing: cultureAtAGlance,
    foodGlance: filterGlanceByType(cultureAtAGlance, "food"),
    foodExperiences: getFoodExperiences(localExperiences),
    localHighlights: getNonFoodExperiences(localExperiences).slice(0, 2),
    traditions: cultureAtAGlance.filter((card) => card.type === "festival" || card.type === "craft"),
    heritage: filterGlanceByType(cultureAtAGlance, "heritage"),
    festivals: filterGlanceByType(cultureAtAGlance, "festival"),
    experiences: localExperiences,
  };
}
