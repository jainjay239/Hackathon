const MAX_ARRAY_ITEMS = 10;
const MAX_ITEM_LENGTH = 40;

export interface DestinationRequest {
  destination: string;
  tripLength: string;
  travelerType: string;
  weather: string;
  budget: string;
  mood: string;
  culturalInterests: string[];
  comfortNeeds: string[];
}

export interface DestinationRequestError {
  error: string;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && item.length <= MAX_ITEM_LENGTH)
    .slice(0, MAX_ARRAY_ITEMS);
}

export function parseDestinationRequest(
  body: unknown
): DestinationRequest | DestinationRequestError {
  const record = (body ?? {}) as Record<string, unknown>;
  const destination = readString(record.destination);

  if (!destination || destination.length > 100) {
    return { error: "destination is required (max 100 chars)" };
  }

  return {
    destination,
    tripLength: readString(record.tripLength),
    travelerType: readString(record.travelerType),
    weather: readString(record.weather),
    budget: readString(record.budget),
    mood: readString(record.mood),
    culturalInterests: readStringArray(record.culturalInterests),
    comfortNeeds: readStringArray(record.comfortNeeds),
  };
}

export function isDestinationRequestError(
  result: DestinationRequest | DestinationRequestError
): result is DestinationRequestError {
  return "error" in result;
}

export function toggleChipValue(current: string, option: string): string {
  return current === option ? "" : option;
}

export function toggleArrayValue(current: string[], option: string): string[] {
  return current.includes(option)
    ? current.filter((item) => item !== option)
    : [...current, option];
}
