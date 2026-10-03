import { lyricSignals, type LyricTag } from "@/lib/lyric-sound";
import type { MixKind, MixPlan } from "@/lib/mix-plan";

export type RigChoice = {
  drums: string;
  bass: string;
  chords: string;
  label: string;
  clap: boolean;
  why: string;
};

type Rig = Omit<RigChoice, "why"> & {
  family: MixKind;
  tags: readonly LyricTag[];
  named: readonly string[];
  energy: number;
  minorBias: number;
  bright: boolean;
};

const SAY: Record<LyricTag, string> = {
  quiet: "quiet",
  night: "night",
  dance: "the dancefloor",
  road: "the road",
  hymn: "a hymn",
  machine: "machines",
  love: "love",
  dust: "dust",
  jazz: "jazz",
  water: "water",
  fire: "fire",
};

const RIGS: readonly Rig[] = [
  { family: "electronic", tags: ["dance", "machine"], named: ["808", "pad"], drums: "808", bass: "sub", chords: "pad", label: "808 drums · sub bass · warm pad", clap: true, energy: 8.5, minorBias: 0.4, bright: false },
  { family: "electronic", tags: ["dance", "night"], named: ["rhodes", "club"], drums: "club", bass: "synth", chords: "rhodes", label: "club drums · synth bass · rhodes", clap: true, energy: 7.5, minorBias: 0.2, bright: false },
  { family: "electronic", tags: ["dance", "machine"], named: ["clav", "clavinet"], drums: "haus", bass: "sub", chords: "clav", label: "haus drums · sub bass · clav", clap: true, energy: 8, minorBias: 0.1, bright: true },
  { family: "electronic", tags: ["dance", "night"], named: ["clean guitar"], drums: "tek", bass: "synth", chords: "clean", label: "tek drums · synth bass · clean guitar", clap: true, energy: 7, minorBias: 0, bright: true },
  { family: "electronic", tags: ["machine"], named: ["music box", "lullaby", "chip"], drums: "chip", bass: "synth", chords: "box", label: "chip drums · synth bass · music box", clap: false, energy: 6, minorBias: 0.3, bright: true },
  { family: "electronic", tags: ["hymn", "night"], named: ["organ"], drums: "vintage", bass: "synth", chords: "organ", label: "vintage drums · synth bass · organ", clap: true, energy: 5.5, minorBias: 0.5, bright: false },
  { family: "electronic", tags: ["dance", "love"], named: ["electric piano"], drums: "808", bass: "finger", chords: "wurli", label: "808 drums · finger bass · electric piano", clap: true, energy: 6, minorBias: -0.1, bright: false },
  { family: "electronic", tags: ["dance"], named: ["clavinet"], drums: "boom", bass: "slap", chords: "clav", label: "boom drums · slap bass · clav", clap: true, energy: 9, minorBias: 0, bright: true },
  { family: "electronic", tags: ["fire", "dance"], named: ["driven guitar", "overdrive"], drums: "fat", bass: "synth", chords: "drive", label: "fat drums · synth bass · driven guitar", clap: true, energy: 8.2, minorBias: 0, bright: true },
  { family: "electronic", tags: ["dance", "machine"], named: ["polysynth"], drums: "heavy", bass: "sub", chords: "poly", label: "heavy drums · sub bass · polysynth", clap: true, energy: 8.8, minorBias: 0.2, bright: true },
  { family: "electronic", tags: ["machine"], named: ["glitch", "robot", "sweep"], drums: "glitch", bass: "synth", chords: "sweep", label: "glitch drums · synth bass · sweep pad", clap: false, energy: 6.4, minorBias: 0.5, bright: false },
  { family: "electronic", tags: ["quiet", "night"], named: ["celesta"], drums: "pure", bass: "finger", chords: "celesta", label: "pure drums · finger bass · celesta", clap: false, energy: 3.4, minorBias: 0.3, bright: true },
  { family: "electronic", tags: ["night", "jazz"], named: ["sax", "saxophone"], drums: "zum", bass: "slap2", chords: "sax", label: "zum drums · slap bass · tenor sax", clap: true, energy: 6.2, minorBias: 0.4, bright: false },
  { family: "electronic", tags: ["dance", "water"], named: ["sweep"], drums: "gas", bass: "synth", chords: "sweep", label: "gas drums · synth bass · sweep pad", clap: true, energy: 7.2, minorBias: 0.2, bright: false },
  { family: "electronic", tags: ["dance", "dust"], named: ["honky"], drums: "sone", bass: "sub", chords: "honky", label: "sone drums · sub bass · honky-tonk piano", clap: true, energy: 7.8, minorBias: 0, bright: true },
  { family: "electronic", tags: ["dance", "water"], named: ["marimba"], drums: "club", bass: "finger", chords: "marimba", label: "club drums · finger bass · marimba", clap: true, energy: 6.6, minorBias: 0.1, bright: true },

  { family: "band", tags: ["road"], named: ["steel guitar", "steel"], drums: "acoustic", bass: "finger", chords: "guitar", label: "acoustic drums · finger bass · steel guitar", clap: false, energy: 6, minorBias: 0.1, bright: true },
  { family: "band", tags: ["road", "love"], named: ["piano"], drums: "acoustic", bass: "pick", chords: "piano", label: "acoustic drums · picked bass · piano", clap: false, energy: 5.5, minorBias: -0.2, bright: true },
  { family: "band", tags: ["road", "quiet"], named: ["nylon"], drums: "acoustic", bass: "upright", chords: "nylon", label: "acoustic drums · upright bass · nylon guitar", clap: false, energy: 4.5, minorBias: 0.2, bright: false },
  { family: "band", tags: ["night", "love", "jazz"], named: ["jazz"], drums: "room", bass: "upright", chords: "jazz", label: "room drums · upright bass · jazz guitar", clap: false, energy: 4, minorBias: 0.3, bright: false },
  { family: "band", tags: ["road", "dance"], named: ["clean guitar"], drums: "acoustic", bass: "slap", chords: "clean", label: "acoustic drums · slap bass · clean guitar", clap: false, energy: 7.5, minorBias: 0, bright: true },
  { family: "band", tags: ["hymn", "road"], named: ["organ"], drums: "room", bass: "fretless", chords: "organ", label: "room drums · fretless bass · organ", clap: false, energy: 4.5, minorBias: 0.4, bright: false },
  { family: "band", tags: ["dust"], named: ["harmonica"], drums: "acoustic", bass: "slap2", chords: "harmonica", label: "acoustic drums · slap bass · harmonica", clap: false, energy: 6.4, minorBias: 0.1, bright: true },
  { family: "band", tags: ["dust", "road"], named: ["accordion"], drums: "acoustic", bass: "finger", chords: "accordion", label: "acoustic drums · finger bass · accordion", clap: false, energy: 5.2, minorBias: 0, bright: true },
  { family: "band", tags: ["dust"], named: ["honky"], drums: "room", bass: "pick", chords: "honky", label: "room drums · picked bass · honky-tonk piano", clap: false, energy: 6.8, minorBias: 0, bright: true },
  { family: "band", tags: ["fire", "road"], named: ["driven guitar", "overdrive"], drums: "acoustic", bass: "finger", chords: "drive", label: "acoustic drums · finger bass · driven guitar", clap: false, energy: 8, minorBias: 0, bright: true },
  { family: "band", tags: ["jazz", "night"], named: ["sax", "saxophone"], drums: "room", bass: "upright", chords: "sax", label: "room drums · upright bass · tenor sax", clap: false, energy: 4.4, minorBias: 0.5, bright: false },
  { family: "band", tags: ["dance", "road"], named: ["rock organ"], drums: "room", bass: "finger", chords: "rock", label: "room drums · finger bass · rock organ", clap: false, energy: 7.2, minorBias: 0, bright: true },
  { family: "band", tags: ["jazz", "road"], named: ["brass"], drums: "acoustic", bass: "pick", chords: "brass", label: "acoustic drums · picked bass · brass", clap: false, energy: 6.6, minorBias: 0.1, bright: true },
  { family: "band", tags: ["water", "quiet"], named: ["flute"], drums: "room", bass: "upright", chords: "flute", label: "room drums · upright bass · flute", clap: false, energy: 3.8, minorBias: 0.2, bright: true },
  { family: "band", tags: ["water", "road"], named: ["tabla", "hand drum"], drums: "hand", bass: "fretless", chords: "nylon", label: "hand drums · fretless bass · nylon guitar", clap: false, energy: 4.2, minorBias: 0.2, bright: false },

  { family: "bedroom", tags: ["quiet", "night"], named: ["rhodes"], drums: "soft", bass: "finger", chords: "rhodes", label: "soft drums · finger bass · rhodes", clap: false, energy: 3.2, minorBias: 0.4, bright: false },
  { family: "bedroom", tags: ["quiet", "love"], named: ["piano"], drums: "soft", bass: "upright", chords: "piano", label: "soft drums · upright bass · piano", clap: false, energy: 3, minorBias: 0.2, bright: false },
  { family: "bedroom", tags: ["night"], named: ["electric piano"], drums: "room", bass: "finger", chords: "wurli", label: "room drums · finger bass · electric piano", clap: false, energy: 4, minorBias: 0.1, bright: false },
  { family: "bedroom", tags: ["quiet", "road"], named: ["nylon"], drums: "soft", bass: "fretless", chords: "nylon", label: "soft drums · fretless bass · nylon guitar", clap: false, energy: 3.4, minorBias: 0.3, bright: false },
  { family: "bedroom", tags: ["night", "quiet"], named: ["vibes", "vibraphone"], drums: "room", bass: "upright", chords: "vibes", label: "room drums · upright bass · vibes", clap: false, energy: 3.6, minorBias: 0.5, bright: true },
  { family: "bedroom", tags: ["love", "quiet"], named: ["music box", "lullaby"], drums: "soft", bass: "finger", chords: "box", label: "soft drums · finger bass · music box", clap: false, energy: 2.4, minorBias: 0.2, bright: true },
  { family: "bedroom", tags: ["water", "quiet"], named: ["marimba"], drums: "soft", bass: "upright", chords: "marimba", label: "soft drums · upright bass · marimba", clap: false, energy: 3.3, minorBias: 0.2, bright: true },
  { family: "bedroom", tags: ["love", "quiet"], named: ["celesta"], drums: "soft", bass: "finger", chords: "celesta", label: "soft drums · finger bass · celesta", clap: false, energy: 2.6, minorBias: 0.3, bright: true },
  { family: "bedroom", tags: ["water"], named: ["flute"], drums: "room", bass: "fretless", chords: "flute", label: "room drums · fretless bass · flute", clap: false, energy: 3.5, minorBias: 0.2, bright: true },
  { family: "bedroom", tags: ["water", "quiet"], named: ["pan flute"], drums: "soft", bass: "finger", chords: "pan", label: "soft drums · finger bass · pan flute", clap: false, energy: 2.8, minorBias: 0.3, bright: true },

  { family: "orchestral", tags: ["hymn", "quiet"], named: ["strings"], drums: "soft", bass: "upright", chords: "strings", label: "soft drums · upright bass · strings", clap: false, energy: 3.5, minorBias: 0.6, bright: false },
  { family: "orchestral", tags: ["hymn", "night"], named: ["tremolo"], drums: "room", bass: "upright", chords: "tremolo", label: "room drums · upright bass · tremolo strings", clap: false, energy: 4.2, minorBias: 0.7, bright: false },
  { family: "orchestral", tags: ["hymn", "quiet"], named: ["harp"], drums: "soft", bass: "fretless", chords: "harp", label: "soft drums · fretless bass · harp", clap: false, energy: 3, minorBias: 0.4, bright: true },
  { family: "orchestral", tags: ["road", "hymn"], named: ["pizzicato"], drums: "room", bass: "upright", chords: "pizz", label: "room drums · upright bass · pizzicato strings", clap: false, energy: 4.8, minorBias: 0.2, bright: true },
  { family: "orchestral", tags: ["hymn"], named: ["organ"], drums: "soft", bass: "upright", chords: "organ", label: "soft drums · upright bass · organ", clap: false, energy: 3.8, minorBias: 0.5, bright: false },
  { family: "orchestral", tags: ["hymn"], named: ["cello"], drums: "soft", bass: "bow", chords: "cello", label: "soft drums · bowed bass · cello", clap: false, energy: 3.6, minorBias: 0.6, bright: false },
  { family: "orchestral", tags: ["hymn"], named: ["choir"], drums: "room", bass: "bow", chords: "choir", label: "room drums · bowed bass · choir", clap: false, energy: 3.9, minorBias: 0.5, bright: false },
  { family: "orchestral", tags: ["hymn"], named: ["church", "organ"], drums: "soft", bass: "bow", chords: "church", label: "soft drums · bowed bass · church organ", clap: false, energy: 4, minorBias: 0.6, bright: false },
  { family: "orchestral", tags: ["hymn"], named: ["french horn", "horn"], drums: "room", bass: "upright", chords: "horn", label: "room drums · upright bass · horn", clap: false, energy: 4.4, minorBias: 0.4, bright: false },
  { family: "orchestral", tags: ["hymn", "night"], named: ["bells", "chimes"], drums: "soft", bass: "upright", chords: "bells", label: "soft drums · upright bass · bells", clap: false, energy: 3.7, minorBias: 0.3, bright: true },
  { family: "orchestral", tags: ["hymn", "jazz"], named: ["brass"], drums: "room", bass: "bow", chords: "brass", label: "room drums · bowed bass · brass", clap: false, energy: 5, minorBias: 0.2, bright: true },
  { family: "orchestral", tags: ["hymn", "machine"], named: ["strings"], drums: "soft", bass: "upright", chords: "synthstrings", label: "soft drums · upright bass · string section", clap: false, energy: 4.1, minorBias: 0.4, bright: false },
  { family: "orchestral", tags: ["water", "quiet"], named: ["pan flute", "tabla"], drums: "hand", bass: "bow", chords: "pan", label: "hand drums · bowed bass · pan flute", clap: false, energy: 3.2, minorBias: 0.3, bright: true },
];

export const LIBRARY_LINE = "18 drum kits, 9 basses, 35 chord instruments. The lyric picks this trio.";

function nameHits(lyrics: string, words: readonly string[]): number {
  if (!lyrics || words.length === 0) return 0;
  const lower = lyrics.toLowerCase();
  let hits = 0;
  for (const word of words) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    hits += lower.match(new RegExp(`\\b${escaped}\\b`, "g"))?.length ?? 0;
  }
  return hits;
}

function whyLine(rig: Rig, signals: Record<LyricTag, number>, lyrics: string): string {
  const named = rig.named.filter((word) => nameHits(lyrics, [word]) > 0);
  if (named.length > 0) return `The lyric says ${named.slice(0, 2).join(" and ")}, so this trio.`;
  const tags = rig.tags
    .filter((tag) => (signals[tag] ?? 0) > 0)
    .sort((a, b) => (signals[b] ?? 0) - (signals[a] ?? 0))
    .slice(0, 3)
    .map((tag) => SAY[tag]);
  if (tags.length > 0) return `The lyric leans ${tags.join(" and ")}, so this trio.`;
  return "Nothing named a kit, so this follows the lyric’s pace.";
}

export function chooseRig(plan: MixPlan, lyrics = ""): RigChoice {
  const signals = lyricSignals(lyrics);
  const pool = RIGS.filter((rig) => rig.family === plan.kind);
  const list = pool.length > 0 ? pool : RIGS;
  let best = list[0];
  let bestWords = -Infinity;
  let bestFit = -Infinity;
  for (const rig of list) {
    let words = nameHits(lyrics, rig.named) * 7;
    for (const tag of rig.tags) {
      const n = signals[tag] ?? 0;
      if (n > 0) words += n * 2.6;
      else words -= 0.5;
    }
    let fit = -Math.abs(plan.energy - rig.energy) * 0.55;
    fit += plan.minor ? rig.minorBias : -rig.minorBias * 0.6;
    if (plan.brightness >= 0.62 && rig.bright) fit += 1.4;
    if (plan.brightness < 0.4 && !rig.bright) fit += 0.8;
    fit += ((plan.seed ^ rig.label.length * 17) % 5) * 0.01;
    if (words > bestWords || (words === bestWords && fit > bestFit)) {
      best = rig;
      bestWords = words;
      bestFit = fit;
    }
  }
  const winner = best ?? list[0];
  return {
    drums: winner.drums,
    bass: winner.bass,
    chords: winner.chords,
    label: winner.label,
    clap: winner.clap,
    why: whyLine(winner, signals, lyrics),
  };
}
