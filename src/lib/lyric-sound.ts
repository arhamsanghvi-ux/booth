const BAGS = {
  quiet: [
    "quiet", "still", "soft", "whisper", "kettle", "empty", "alone", "room", "sleep", "hush",
    "plate", "ordinary", "pillow", "blanket", "morning", "coffee", "kitchen", "silence",
    "gentle", "tender", "lullaby", "bedroom", "candle", "breath", "sigh", "slowly", "softly",
  ],
  night: [
    "night", "dark", "moon", "streetlight", "midnight", "neon", "shadow", "dusk", "lamp",
    "alley", "insomnia", "starlight", "stars", "street",
  ],
  dance: [
    "dance", "bass", "club", "floor", "beat", "mirror", "crowd", "stamp", "wrist", "rave",
    "drop", "speaker", "party", "sweat", "bounce", "tempo", "groove", "speakers",
  ],
  road: [
    "highway", "road", "truck", "county", "gravel", "tires", "tire", "radio", "corn", "mama",
    "town", "map", "window", "mile", "miles", "asphalt", "headlight", "headlights", "drive",
  ],
  hymn: [
    "church", "hymn", "prayer", "gospel", "heaven", "organ", "choir", "angel", "amen", "holy",
    "lord", "god", "sunday", "chapel", "pew", "mercy", "glory", "hallelujah", "pray",
  ],
  machine: [
    "machine", "wire", "static", "glitch", "digital", "robot", "circuit", "pixel", "error",
    "screen", "code", "binary", "chrome",
  ],
  love: ["love", "heart", "hold", "kiss", "darling", "baby", "forever", "ache", "arms"],
  dust: [
    "whiskey", "boots", "dust", "porch", "honky", "harmonica", "fiddle", "barn", "diesel",
    "pickup", "cowboy", "dirt", "rust", "saloon",
  ],
  jazz: ["sax", "saxophone", "jazz", "smoke", "lounge", "velvet", "trumpet"],
  water: ["rain", "ocean", "sea", "river", "wave", "storm", "thunder", "tide", "shore", "waves"],
  fire: ["fire", "burn", "flame", "heat", "blaze", "ash", "burning"],
} as const;

export type LyricTag = keyof typeof BAGS;

const TAGS = Object.keys(BAGS) as LyricTag[];
const SETS = Object.fromEntries(TAGS.map((tag) => [tag, new Set<string>(BAGS[tag])])) as Record<
  LyricTag,
  Set<string>
>;

function variants(token: string): string[] {
  const out = [token];
  if (token.length > 4 && token.endsWith("s")) out.push(token.slice(0, -1));
  if (token.length > 5 && token.endsWith("es")) out.push(token.slice(0, -2));
  if (token.length > 5 && token.endsWith("ed")) out.push(token.slice(0, -2));
  if (token.length > 6 && token.endsWith("ing")) {
    const stem = token.slice(0, -3);
    out.push(stem, `${stem}e`);
  }
  return out;
}

export function lyricSignals(text: string): Record<LyricTag, number> {
  const tokens = text.toLowerCase().match(/[a-z']+/g) ?? [];
  const counts: Record<LyricTag, number> = {
    quiet: 0,
    night: 0,
    dance: 0,
    road: 0,
    hymn: 0,
    machine: 0,
    love: 0,
    dust: 0,
    jazz: 0,
    water: 0,
    fire: 0,
  };
  for (const token of tokens) {
    const forms = variants(token);
    for (const tag of TAGS) {
      if (forms.some((form) => SETS[tag].has(form))) counts[tag] += 1;
    }
  }
  return counts;
}
