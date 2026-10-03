import type { Brief, ScaleId } from "@/lib/brief";
import { lyricSignals } from "@/lib/lyric-sound";
import { DATASET_SIZE, predictPocket } from "@/lib/desk-model";

export type MixKind = "electronic" | "band" | "bedroom" | "orchestral";

export type MixPlan = {
  bpm: number;
  root: number;
  minor: boolean;
  dorian: boolean;
  energy: number;
  swing: number;
  density: number;
  brightness: number;
  halfTime: boolean;
  kind: MixKind;
  seed: number;
  title: string;
  keyName: string;
  modelLine: string;
};

const PITCH: Record<string, number> = {
  c: 0,
  "c#": 1,
  db: 1,
  d: 2,
  "d#": 3,
  eb: 3,
  e: 4,
  f: 5,
  "f#": 6,
  gb: 6,
  g: 7,
  "g#": 8,
  ab: 8,
  a: 9,
  "a#": 10,
  bb: 10,
  b: 11,
};

const NAMES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function chorusGuide(lyrics: string): string {
  const lines = lyrics.replace(/\r\n/g, "\n").split("\n");
  const chorus: string[] = [];
  let inChorus = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (/^\[/.test(line) || /^(verse|chorus|pre-chorus|prechorus|bridge|outro|intro|hook|refrain)\b/i.test(line)) {
      inChorus = /chorus|hook|refrain/i.test(line);
      continue;
    }
    if (inChorus) chorus.push(line.replace(/[^\p{L}\p{N}\s'",.?]/gu, ""));
  }
  const spoken = (chorus.length > 0 ? chorus : lines.map((line) => line.trim()).filter((line) => line && !line.startsWith("["))).slice(0, 6);
  return spoken.join(". ").replace(/\s+/g, " ").trim().slice(0, 480);
}

export function planMix(input: {
  lyrics: string;
  title: string;
  scale: ScaleId;
  brief: Brief | null;
}): MixPlan {
  const pocket = predictPocket(input.lyrics);
  const brief = input.brief;
  const genre = `${brief?.genre.primary ?? ""} ${brief?.genre.alternates.join(" ") ?? ""}`.toLowerCase();
  const feel = (brief?.tempo.feel ?? "").toLowerCase();
  const suggestion = brief?.harmonyKey.suggestion ?? "";
  const keyText = suggestion.toLowerCase();
  const dorian = /dorian/.test(keyText);
  const namedMinor = /minor|aeolian|phrygian|dorian|blues/.test(keyText);
  const namedMajor = /major|mixolydian|lydian|ionian/.test(keyText);
  const minor = namedMinor || (!namedMajor && pocket.minor >= 0.55);
  const match = keyText.match(/\b([a-g](?:#|b)?)\b/);
  const pc = match ? PITCH[match[1]] : null;
  const fallbackPc = minor ? [9, 2, 4, 11][hash(input.lyrics) % 4] : [0, 7, 5, 2][hash(input.lyrics) % 4];
  const pitchClass = pc ?? fallbackPc ?? 0;
  const root = 48 + pitchClass;

  const briefBpm = brief ? (brief.tempo.bpmLow + brief.tempo.bpmHigh) / 2 : pocket.bpm;
  const bpm = clamp(Math.round(briefBpm), 64, 146);
  const energy = clamp(brief ? brief.energy : pocket.energy, 1, 10);
  const energyScale = 0.45 + energy / 14;
  let density = clamp(pocket.density * energyScale, 0.08, 1);
  let swing = pocket.swing;
  let brightness = clamp(pocket.brightness * (0.55 + energy / 18), 0.15, 1);

  let kind: MixKind = "band";
  if (input.scale === "orchestral" || /orchestra|chamber|score|strings|cinematic/.test(genre)) kind = "orchestral";
  else if (input.scale === "electronic" || /electronic|club|house|synth|trap|dance|hyperpop|edm/.test(genre)) kind = "electronic";
  else if (input.scale === "bedroom") kind = "bedroom";
  else if (input.scale === "band" || /country|rock|folk|americana|band/.test(genre)) kind = "band";
  else {
    const words = lyricSignals(input.lyrics);
    if (words.hymn >= 2 && words.hymn >= words.dance && words.hymn >= words.road) kind = "orchestral";
    else if (words.dance >= 2 && words.dance > words.quiet && words.dance >= words.road) kind = "electronic";
    else if (words.machine >= 2 && words.machine >= words.quiet && words.machine >= words.road) kind = "electronic";
    else if (words.fire >= 2 && words.fire > words.quiet && words.fire >= words.hymn) kind = "electronic";
    else if (words.road >= 2 && words.road >= words.dance) kind = "band";
    else if (words.dust >= 2 && words.dust >= words.dance) kind = "band";
    else if (words.jazz >= 2 && words.jazz >= words.dance) kind = "band";
    else if (words.quiet >= 2 && words.quiet >= words.dance) kind = "bedroom";
    else if (words.water >= 2 && words.water >= words.dance) kind = energy <= 5.5 ? "bedroom" : "orchestral";
    else if (density > 0.72 && energy >= 7) kind = "electronic";
    else if (energy <= 3.5) kind = "bedroom";
  }

  if (kind === "electronic") {
    density = clamp(density + 0.18, 0, 1);
    swing = Math.min(swing, 0.12);
    brightness = clamp(brightness + 0.08, 0, 1);
  } else if (kind === "bedroom") {
    density = clamp(density - 0.12, 0.08, 0.7);
    brightness = clamp(brightness - 0.08, 0.12, 0.7);
  } else if (kind === "orchestral") {
    density = clamp(density * 0.35, 0.05, 0.4);
    swing = 0;
    brightness = clamp(brightness - 0.05, 0.2, 0.75);
  } else if (kind === "band") {
    swing = clamp(swing + 0.08, 0, 0.55);
  }

  const halfTime = /half/.test(feel) || (bpm >= 118 && /trap|rap|hip/.test(genre + feel));
  const keyName = `${NAMES[pitchClass] ?? "C"} ${dorian ? "Dorian" : minor ? "minor" : "major"}`;
  const modelLine = `Linear model, ${DATASET_SIZE} labeled pages · ${Math.round(pocket.bpm)} bpm lean · ${pocket.minor >= 0.55 ? "minor" : "major"} color · ${pocket.density >= 0.62 ? "busier drums" : "sparser drums"}`;

  return {
    bpm,
    root,
    minor,
    dorian,
    energy,
    swing,
    density,
    brightness,
    halfTime,
    kind,
    seed: hash(input.lyrics || input.title || "booth"),
    title: input.title.trim() || brief?.workingTitle || "Booth demo",
    keyName,
    modelLine,
  };
}
