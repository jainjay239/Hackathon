export interface DestinationRequest {
  destination: string;
  weather: string;
  budget: string;
  mood: string;
}

export interface DestinationRequestError {
  error: string;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parseDestinationRequest(
  body: unknown
): DestinationRequest | DestinationRequestError {
  const record = (body ?? {}) as Record<string, unknown>;
  const destination = readString(record.destination);
  const weather = readString(record.weather);
  const budget = readString(record.budget);
  const mood = readString(record.mood);

  if (!destination || destination.length > 100) {
    return { error: "destination is required (max 100 chars)" };
  }

  return { destination, weather, budget, mood };
}

export function isDestinationRequestError(
  result: DestinationRequest | DestinationRequestError
): result is DestinationRequestError {
  return "error" in result;
}

export function toggleChipValue(current: string, option: string): string {
  return current === option ? "" : option;
}
