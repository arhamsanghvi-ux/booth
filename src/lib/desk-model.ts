import { readLyric } from "@/lib/brief";

/** Ridge least-squares weights from scripts/fit-desk-model.mjs, 32 labeled pages. */
export const DATASET_SIZE = 32;

const WEIGHTS: readonly (readonly number[])[] = [
  [105.83139777824726, -1.8502927960525994, 9.100076308091275, 21.471860730906997, -2.9228284918287954, -12.288484380603506, 51.27809040062721, -47.73851851633299],
  [6.281349483738381, -1.073253678593634, 1.3422936035827249, 1.8785152179059494, 0.28403658155296796, -1.3433673987834442, 5.398074185940175, -5.007535142988047],
  [0.1617892118956057, 0.3496550376734211, -0.5256820789294006, -0.07192263047844882, -0.060089662378287834, 0.447196966417172, -0.10151028758329517, 0.9067205433282268],
  [0.6358955746258239, -0.14265561398890658, 0.09700812554175631, 0.23815634719744816, 0.05112109468909676, -0.1891087117576652, 0.6364452098256201, -0.6340079106406691],
  [0.07461958526585732, -0.06757526226279009, 0.41975386594362907, -0.01589596251985803, 0.007788313103466393, -0.24217928472488875, -0.11438528255023428, -0.22401174357970355],
  [0.6500860397068458, -0.1809901580388391, 0.17715810294794565, 0.16920824060499617, 0.07082839122113027, -0.1799201212082322, 0.5342254373390372, -0.5440084137204408],
];

export type Pocket = {
  bpm: number;
  energy: number;
  minor: number;
  density: number;
  swing: number;
  brightness: number;
};

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function lyricVector(text: string): number[] {
  const notes = readLyric(text);
  const tokens = text.toLowerCase().match(/[\p{L}\p{N}']+/gu) ?? [];
  const unique = tokens.length ? new Set(tokens).size / tokens.length : 0;
  const lines = Math.max(1, notes.lineCount);
  const questions = Math.min(1, (text.match(/\?/g) ?? []).length / lines);
  const shouts = Math.min(1, (text.match(/!/g) ?? []).length / lines);
  return [
    1,
    notes.wordCount / 160,
    notes.avgWords / 10,
    notes.hookCount / 3,
    notes.labels.length / 3,
    questions,
    shouts,
    unique,
  ];
}

export function predictPocket(text: string): Pocket {
  const x = lyricVector(text);
  const scored = WEIGHTS.map((weights) => weights.reduce((sum, weight, index) => sum + weight * x[index], 0));
  return {
    bpm: clamp(scored[0] ?? 96, 64, 146),
    energy: clamp(scored[1] ?? 5, 1, 10),
    minor: clamp(scored[2] ?? 0.5, 0, 1),
    density: clamp(scored[3] ?? 0.4, 0, 1),
    swing: clamp(scored[4] ?? 0.1, 0, 0.55),
    brightness: clamp(scored[5] ?? 0.5, 0, 1),
  };
}
