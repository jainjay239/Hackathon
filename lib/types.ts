export type GlanceType =
  | "hero"
  | "heritage"
  | "food"
  | "festival"
  | "craft"
  | "hiddenGem"
  | "experience";

export interface GlanceCard {
  type: GlanceType;
  title: string;
  description: string;
  imageQuery: string;
}

export interface HiddenGem {
  name: string;
  description: string;
  imageQuery: string;
}

export interface LocalExperience {
  title: string;
  description: string;
}

export interface DestinationGuide {
  destinationName: string;
  country: string;
  culturalIntro: string;
  heroImageQuery: string;
  whyItFits: string;
  cultureAtAGlance: GlanceCard[];
  hiddenGems: HiddenGem[];
  immersiveStory: string;
  localExperiences: LocalExperience[];
  localEtiquette: string[];
  itinerary: { morning: string; afternoon: string; evening: string };
}
