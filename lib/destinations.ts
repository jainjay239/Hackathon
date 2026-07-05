export interface PresetDestination {
  name: string;
  country: string;
  tag: string;
  imageQuery: string;
  tourismBoard: { label: string; url: string };
}

export const PRESET_DESTINATIONS: PresetDestination[] = [
  { name: "Jaipur", country: "India", tag: "Forts, bazaars, royal craft", imageQuery: "Jaipur Amber Fort", tourismBoard: { label: "Rajasthan Tourism (official)", url: "https://www.tourism.rajasthan.gov.in" } },
  { name: "Varanasi", country: "India", tag: "Ghats, aarti, spiritual heritage", imageQuery: "Varanasi Ganges ghats", tourismBoard: { label: "Uttar Pradesh Tourism (official)", url: "https://uptourism.gov.in" } },
  { name: "Kyoto", country: "Japan", tag: "Temples, tea, old streets", imageQuery: "Kyoto Fushimi Inari shrine", tourismBoard: { label: "Kyoto City Official Travel Guide", url: "https://kyoto.travel" } },
  { name: "Bali", country: "Indonesia", tag: "Temples, rice terraces, dance", imageQuery: "Bali rice terraces", tourismBoard: { label: "Wonderful Indonesia (official)", url: "https://www.indonesia.travel" } },
  { name: "Istanbul", country: "Turkey", tag: "Bazaars, mosques, crossroads", imageQuery: "Istanbul Blue Mosque", tourismBoard: { label: "GoTurkiye (official)", url: "https://www.goturkiye.com" } },
  { name: "Oaxaca", country: "Mexico", tag: "Food, craft, festivals", imageQuery: "Oaxaca Mexico city", tourismBoard: { label: "Oaxaca Tourism (official)", url: "https://www.oaxaca.travel" } },
];

export function findTourismBoard(destinationName: string) {
  const lower = destinationName.toLowerCase();
  const match = PRESET_DESTINATIONS.find(
    (d) => lower.includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(lower)
  );
  return match?.tourismBoard ?? null;
}
