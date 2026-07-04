export interface PresetDestination {
  name: string;
  country: string;
  tag: string;
  imageQuery: string;
}

export const PRESET_DESTINATIONS: PresetDestination[] = [
  { name: "Jaipur", country: "India", tag: "Forts, bazaars, royal craft", imageQuery: "Jaipur Amber Fort" },
  { name: "Varanasi", country: "India", tag: "Ghats, aarti, spiritual heritage", imageQuery: "Varanasi Ganges ghats" },
  { name: "Kyoto", country: "Japan", tag: "Temples, tea, old streets", imageQuery: "Kyoto Fushimi Inari shrine" },
  { name: "Bali", country: "Indonesia", tag: "Temples, rice terraces, dance", imageQuery: "Bali rice terraces" },
  { name: "Istanbul", country: "Turkey", tag: "Bazaars, mosques, crossroads", imageQuery: "Istanbul Blue Mosque" },
  { name: "Oaxaca", country: "Mexico", tag: "Food, craft, festivals", imageQuery: "Oaxaca Mexico city" },
];
