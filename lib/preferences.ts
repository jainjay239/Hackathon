export const TRIP_LENGTH_OPTIONS = ["Weekend", "1 day", "3 days", "5 days", "1 week"];

const TRIP_LENGTH_DAYS: Record<string, number> = {
  "1 day": 1,
  Weekend: 2,
  "3 days": 3,
  "5 days": 5,
  "1 week": 7,
};

export function tripLengthToDayCount(tripLength: string): number {
  return TRIP_LENGTH_DAYS[tripLength] ?? 1;
}
export const TRAVELER_TYPE_OPTIONS = ["Solo", "Couple", "Family", "Friends", "Senior-friendly"];
export const BUDGET_OPTIONS = ["Budget", "Mid-range", "Premium", "Luxury"];
export const WEATHER_OPTIONS = ["Warm", "Cool", "Rainy", "Coastal", "Winter", "Desert"];
export const MOOD_OPTIONS = [
  "Chill",
  "Adventurous",
  "Spiritual",
  "Foodie",
  "Heritage lover",
  "Photographer",
];
export const CULTURAL_INTEREST_OPTIONS = [
  "Food",
  "Festivals",
  "Architecture",
  "Local markets",
  "Handicrafts",
  "Music & dance",
  "Spiritual places",
  "Nature & village life",
  "Museums",
  "Street experiences",
];
export const COMFORT_NEED_OPTIONS = [
  "Easy walking",
  "Family friendly",
  "Senior friendly",
  "Low crowd",
  "Public transport friendly",
];
