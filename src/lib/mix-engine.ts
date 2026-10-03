import type { MixPlan } from "@/lib/mix-plan";

export type DrumVoices = {
  kick: Float32Array;
  snare: Float32Array;
  hat: Float32Array;
  open: Float32Array;
  clap: Float32Array;
  tom: Float32Array;
  ride: Float32Array;
};

export type NoteSample = { midi: number; pcm: Float32Array };

export type ToneSet = {
  notes: NoteSample[];
  attack: number;
  release: number;
};

export type RigPcm = {
  drums: DrumVoices;
  bass: ToneSet & { lowpass: number };
  chords: ToneSet & { highpass: number };
};

export type Stereo = { left: Float32Array; right: Float32Array };

export type StemMix = {
  drums: Stereo;
  bass: Stereo;
  chords: Stereo;
  mix: Stereo;
  duration: number;
};

type SectionName = "intro" | "verse" | "chorus" | "outro";
type Section = { name: SectionName; start: number; bars: number };

const MINOR = [0, 2, 3, 5, 7, 8, 10];
const MAJOR = [0, 2, 4, 5, 7, 9, 11];
const DORIAN = [0, 2, 3, 5, 7, 9, 10];

function scaleOf(plan: MixPlan): number[] {
  if (plan.dorian) return DORIAN;
  return plan.minor ? MINOR : MAJOR;
}

function midiAt(plan: MixPlan, degree: number): number {
  const scale = scaleOf(plan);
  const index = ((degree % 7) + 7) % 7;
  const octaves = Math.floor(degree / 7);
  return plan.root + (scale[index] ?? 0) + 12 * octaves;
}

function layout(bpm: number): { sections: Section[]; beat: number; bar: number; duration: number } {
  const beat = 60 / bpm;
  const bar = beat * 4;
  const total = Math.max(12, Math.min(20, Math.round(50 / bar)));
  const intro = total >= 16 ? 2 : 1;
  const outro = total >= 14 ? 2 : 1;
  const mid = Math.max(4, total - intro - outro);
  const chorusBars = Math.max(2, Math.round(mid * 0.5));
  const verseBars = mid - chorusBars;
  const sections: Section[] = [];
  let cursor = 0;
  const push = (name: SectionName, bars: number) => {
    if (bars <= 0) return;
    sections.push({ name, start: cursor * bar, bars });
    cursor += bars;
  };
  push("intro", intro);
  if (verseBars >= 4 && chorusBars >= 4) {
    const verseA = Math.ceil(verseBars / 2);
    const chorusA = Math.ceil(chorusBars / 2);
    push("verse", verseA);
    push("chorus", chorusA);
    push("verse", verseBars - verseA);
    push("chorus", chorusBars - chorusA);
  } else {
    push("verse", verseBars);
    push("chorus", chorusBars);
  }
  push("outro", outro);
  return { sections, beat, bar, duration: cursor * bar + 1.4 };
}

function place(
  left: Float32Array,
  right: Float32Array,
  sample: Float32Array,
  startSec: number,
  durSec: number,
  gain: number,
  rate: number,
  pan: number,
  sr: number,
  attackSec: number,
  releaseSec: number,
): void {
  if (sample.length < 2 || gain <= 0.0008 || durSec <= 0.012 || rate <= 0) return;
  const start = Math.floor(startSec * sr);
  const outN = Math.max(1, Math.floor(durSec * sr));
  const attack = Math.min(outN, Math.max(1, Math.floor(attackSec * sr)));
  const release = Math.min(outN, Math.max(1, Math.floor(releaseSec * sr)));
  const gL = gain * (pan <= 0 ? 1 : 1 - pan);
  const gR = gain * (pan >= 0 ? 1 : 1 + pan);
  const last = sample.length - 1;
  for (let i = 0; i < outN; i++) {
    const out = start + i;
    if (out >= left.length) break;
    if (out < 0) continue;
    const pos = i * rate;
    const i0 = pos | 0;
    if (i0 >= last) break;
    const frac = pos - i0;
    const s = (sample[i0] ?? 0) * (1 - frac) + (sample[i0 + 1] ?? 0) * frac;
    let env = 1;
    if (i < attack) env = i / attack;
    else if (i > outN - release) env = (outN - i) / release;
    left[out] += s * env * gL;
    right[out] += s * env * gR;
  }
}

function shot(
  left: Float32Array,
  right: Float32Array,
  sample: Float32Array,
  time: number,
  gain: number,
  pan: number,
  sr: number,
): void {
  place(left, right, sample, time, sample.length / sr, gain, 1, pan, sr, 0.002, 0.045);
}

function nearest(notes: NoteSample[], midi: number): { pcm: Float32Array; rate: number } {
  let best = notes[0];
  if (!best) throw new Error("A stem is missing its notes.");
  let dist = 99;
  for (const note of notes) {
    const next = Math.abs(note.midi - midi);
    if (next < dist) {
      best = note;
      dist = next;
    }
  }
  let target = midi;
  let rate = 2 ** ((target - best.midi) / 12);
  while (rate > 1.42) {
    target -= 12;
    rate = 2 ** ((target - best.midi) / 12);
  }
  while (rate < 0.7) {
    target += 12;
    rate = 2 ** ((target - best.midi) / 12);
  }
  return { pcm: best.pcm, rate };
}

function fold(midi: number, low: number, high: number): number {
  let note = midi;
  while (note > high) note -= 12;
  while (note < low) note += 12;
  return note;
}

function nudge(seed: number, salt: number): number {
  const n = (Math.imul(seed ^ salt, 16777619) >>> 0) % 9;
  return (n - 4) * 0.0014;
}

function onePole(buf: Float32Array, sr: number, freq: number, kind: "hp" | "lp"): void {
  const a = Math.exp((-2 * Math.PI * freq) / sr);
  let y = 0;
  let x1 = 0;
  for (let i = 0; i < buf.length; i++) {
    const x = buf[i] ?? 0;
    if (kind === "lp") {
      y += (1 - a) * (x - y);
      buf[i] = y;
    } else {
      const next = a * (y + x - x1);
      x1 = x;
      y = next;
      buf[i] = next;
    }
  }
}

function smear(buf: Float32Array, sr: number, amount: number): void {
  if (amount <= 0.01) return;
  const copy = buf.slice();
  const taps = [0.019, 0.031, 0.047, 0.067, 0.089];
  const weights = [0.34, 0.26, 0.18, 0.12, 0.08];
  for (let tap = 0; tap < taps.length; tap++) {
    const delay = Math.floor((taps[tap] ?? 0.03) * sr);
    const gain = (weights[tap] ?? 0) * amount;
    for (let i = delay; i < buf.length; i++) buf[i] += (copy[i - delay] ?? 0) * gain;
  }
}

function duck(left: Float32Array, right: Float32Array, kicks: number[], beat: number, depth: number, sr: number): void {
  if (kicks.length === 0 || depth >= 0.98) return;
  const gain = new Float32Array(left.length);
  gain.fill(1);
  const attack = Math.max(1, Math.floor(0.008 * sr));
  const release = Math.max(attack + 1, Math.floor(Math.min(0.24, beat * 0.48) * sr));
  for (const time of kicks) {
    const start = Math.floor(time * sr);
    const span = attack + release;
    for (let i = 0; i < span; i++) {
      const out = start + i;
      if (out < 0 || out >= gain.length) continue;
      const env = i < attack ? 1 - (i / attack) * (1 - depth) : depth + (1 - depth) * ((i - attack) / release);
      if (env < (gain[out] ?? 1)) gain[out] = env;
    }
  }
  for (let i = 0; i < left.length; i++) {
    left[i] = (left[i] ?? 0) * (gain[i] ?? 1);
    right[i] = (right[i] ?? 0) * (gain[i] ?? 1);
  }
}

function compress(
  left: Float32Array,
  right: Float32Array,
  sr: number,
  thresh: number,
  ratio: number,
  makeup: number,
  attack: number,
  release: number,
): void {
  const slope = 1 - 1 / ratio;
  const att = Math.exp(-1 / (attack * sr));
  const rel = Math.exp(-1 / (release * sr));
  let env = 0;
  for (let i = 0; i < left.length; i++) {
    const peak = Math.max(Math.abs(left[i] ?? 0), Math.abs(right[i] ?? 0));
    env = peak > env ? att * env + (1 - att) * peak : rel * env + (1 - rel) * peak;
    let g = makeup;
    if (env > thresh) g = (1 - slope * (1 - thresh / env)) * makeup;
    left[i] = (left[i] ?? 0) * g;
    right[i] = (right[i] ?? 0) * g;
  }
}

function fadeEdges(left: Float32Array, right: Float32Array, sr: number): void {
  const fadeIn = Math.floor(0.012 * sr);
  const fadeOut = Math.floor(0.12 * sr);
  const n = left.length;
  for (let i = 0; i < n; i++) {
    let edge = 1;
    if (i < fadeIn) edge = i / fadeIn;
    else if (i > n - fadeOut) edge = Math.max(0, (n - i) / fadeOut);
    left[i] = (left[i] ?? 0) * edge;
    right[i] = (right[i] ?? 0) * edge;
  }
}

function master(left: Float32Array, right: Float32Array, sr: number): void {
  onePole(left, sr, 28, "hp");
  onePole(right, sr, 28, "hp");
  compress(left, right, sr, 0.22, 3.1, 1.35, 0.012, 0.18);
  const ceiling = 0.96;
  for (let i = 0; i < left.length; i++) {
    const l = left[i] ?? 0;
    const r = right[i] ?? 0;
    left[i] = l > ceiling ? ceiling + Math.tanh(l - ceiling) * 0.04 : l < -ceiling ? -ceiling + Math.tanh(l + ceiling) * 0.04 : l;
    right[i] = r > ceiling ? ceiling + Math.tanh(r - ceiling) * 0.04 : r < -ceiling ? -ceiling + Math.tanh(r + ceiling) * 0.04 : r;
  }
  fadeEdges(left, right, sr);
  let peak = 0;
  for (let i = 0; i < left.length; i++) peak = Math.max(peak, Math.abs(left[i] ?? 0), Math.abs(right[i] ?? 0));
  if (peak < 0.01 || !Number.isFinite(peak)) throw new Error("The mix rendered silent.");
  const norm = 0.89 / peak;
  for (let i = 0; i < left.length; i++) {
    left[i] = (left[i] ?? 0) * norm;
    right[i] = (right[i] ?? 0) * norm;
  }
}

function energyOf(buf: Float32Array): number {
  let energy = 0;
  const step = 32;
  let count = 0;
  for (let i = 0; i < buf.length; i += step) {
    const s = buf[i] ?? 0;
    energy += s * s;
    count += 1;
  }
  return count ? Math.sqrt(energy / count) : 0;
}

function copyStereo(left: Float32Array, right: Float32Array): Stereo {
  return { left: left.slice(), right: right.slice() };
}

export function renderStems(plan: MixPlan, rig: RigPcm, clap: boolean, sampleRate = 44100): StemMix {
  const { sections, beat, bar, duration } = layout(plan.bpm);
  const n = Math.max(1, Math.ceil(duration * sampleRate));
  const drumsL = new Float32Array(n);
  const drumsR = new Float32Array(n);
  const bassL = new Float32Array(n);
  const bassR = new Float32Array(n);
  const chordL = new Float32Array(n);
  const chordR = new Float32Array(n);
  const kicks: number[] = [];
  const eighth = beat / 2;
  const prog = plan.minor || plan.dorian ? [0, 5, 3, 4] : [0, 4, 5, 3];
  const drumScale = plan.kind === "orchestral" ? 0.34 : plan.kind === "bedroom" ? 0.62 : 1;
  const hatScale = 0.5 + plan.density * 0.65;
  let barIndex = 0;

  for (const section of sections) {
    const chorus = section.name === "chorus";
    const quiet = section.name === "intro" || section.name === "outro";
    for (let step = 0; step < section.bars; step++) {
      const barStart = section.start + step * bar;
      const degree = prog[barIndex % prog.length] ?? 0;
      const level = quiet ? 0.48 : chorus ? 1 : 0.8;
      const salt = barIndex * 17 + 3;

      if (plan.kind === "orchestral") {
        if (!quiet) {
          shot(drumsL, drumsR, rig.drums.ride, barStart, 0.16 * level, 0.2, sampleRate);
          if (chorus) shot(drumsL, drumsR, rig.drums.kick, barStart, 0.28 * level, 0, sampleRate);
        } else if (step === 0) {
          shot(drumsL, drumsR, rig.drums.open, barStart, 0.12, 0.05, sampleRate);
        }
      } else {
        const hatSteps = plan.density > 0.7 && chorus && plan.kind === "electronic" ? 16 : 8;
        const stepDur = hatSteps === 16 ? beat / 4 : eighth;
        for (let i = 0; i < hatSteps; i++) {
          if (quiet && i % 2 === 1) continue;
          if (section.name === "outro" && step > 0 && i % 4 !== 0) continue;
          if (plan.kind === "bedroom" && i % 2 === 1 && plan.density < 0.45) continue;
          const swing = i % 2 === 1 ? plan.swing * stepDur * 0.5 : 0;
          const time = barStart + i * stepDur + swing + nudge(plan.seed, salt + i);
          const accent = i % (hatSteps / 2) === 0;
          shot(
            drumsL,
            drumsR,
            rig.drums.hat,
            time,
            (accent ? 0.15 : 0.08) * hatScale * level * drumScale,
            accent ? -0.08 : -0.24,
            sampleRate,
          );
        }
        if (chorus && plan.kind !== "bedroom") {
          shot(drumsL, drumsR, rig.drums.open, barStart + eighth, 0.18 * level * drumScale, 0.26, sampleRate);
          shot(drumsL, drumsR, rig.drums.ride, barStart, 0.1 * level * drumScale, 0.34, sampleRate);
        }

        const fourOn = plan.kind === "electronic" && plan.energy >= 6 && !quiet && !plan.halfTime;
        const kickBeats = plan.halfTime ? [0] : fourOn ? [0, 1, 2, 3] : quiet ? [0] : [0, 2];
        for (const beatIndex of kickBeats) {
          const time = barStart + beatIndex * beat;
          kicks.push(time);
          shot(drumsL, drumsR, rig.drums.kick, time, (plan.kind === "electronic" ? 0.82 : 0.74) * level * drumScale, 0, sampleRate);
        }

        const snareBeats = plan.halfTime ? [2] : quiet ? [] : [1, 3];
        for (const beatIndex of snareBeats) {
          const time = barStart + beatIndex * beat + nudge(plan.seed, salt + 40 + beatIndex);
          shot(
            drumsL,
            drumsR,
            rig.drums.snare,
            time,
            (plan.kind === "bedroom" ? 0.32 : 0.46) * level * drumScale,
            0.1,
            sampleRate,
          );
          if (clap && chorus) {
            shot(drumsL, drumsR, rig.drums.clap, time, 0.2 * level, -0.12, sampleRate);
          }
        }

        if (plan.kind === "band" && chorus && step === section.bars - 1) {
          shot(drumsL, drumsR, rig.drums.tom, barStart + beat * 2.5, 0.32 * drumScale, -0.18, sampleRate);
          shot(drumsL, drumsR, rig.drums.tom, barStart + beat * 3.25, 0.26 * drumScale, 0.14, sampleRate);
        }
      }

      const root = fold(midiAt(plan, degree) - 12, 28, 52);
      const fifth = fold(root + 7, 28, 52);
      const octave = fold(root + 12, 28, 52);
      const bassGain = (plan.kind === "orchestral" ? 0.34 : plan.kind === "electronic" ? 0.58 : 0.48) * level;
      const hits: Array<{ at: number; midi: number; dur: number }> = [];
      if (quiet || plan.kind === "orchestral") {
        hits.push({ at: 0, midi: root, dur: bar * 0.92 });
      } else if (plan.kind === "electronic" && !plan.halfTime) {
        hits.push({ at: 0, midi: root, dur: beat * 0.92 });
        hits.push({ at: beat, midi: root, dur: beat * 0.92 });
        hits.push({ at: beat * 2, midi: fifth, dur: beat * 0.92 });
        hits.push({ at: beat * 3, midi: chorus ? octave : root, dur: beat * 0.8 });
      } else if (plan.halfTime) {
        hits.push({ at: 0, midi: root, dur: beat * 1.8 });
        hits.push({ at: beat * 2, midi: fifth, dur: beat * 1.5 });
      } else {
        hits.push({ at: 0, midi: root, dur: beat * 1.35 });
        hits.push({ at: beat * 2, midi: chorus ? fifth : octave, dur: beat * 1.15 });
      }
      for (const hit of hits) {
        const played = nearest(rig.bass.notes, hit.midi);
        place(
          bassL,
          bassR,
          played.pcm,
          barStart + hit.at,
          hit.dur,
          bassGain,
          played.rate,
          0,
          sampleRate,
          rig.bass.attack,
          Math.min(rig.bass.release, hit.dur * 0.45),
        );
      }

      const voices = chorus ? [0, 2, 4, 6] : [0, 2, 4];
      const chordGain = (plan.kind === "orchestral" ? 0.2 : plan.kind === "electronic" ? 0.15 : 0.17) * level;
      const pans = [-0.42, -0.14, 0.16, 0.4];
      voices.forEach((interval, index) => {
        let note = midiAt(plan, degree + interval);
        note = fold(note, 52, 81);
        const played = nearest(rig.chords.notes, note);
        const time = barStart + nudge(plan.seed, salt + 80 + index);
        place(
          chordL,
          chordR,
          played.pcm,
          time,
          Math.min(bar * 1.08, duration - time),
          chordGain,
          played.rate,
          pans[index] ?? 0,
          sampleRate,
          rig.chords.attack,
          rig.chords.release,
        );
      });

      barIndex += 1;
    }
  }

  onePole(chordL, sampleRate, rig.chords.highpass, "hp");
  onePole(chordR, sampleRate, rig.chords.highpass, "hp");
  onePole(bassL, sampleRate, 32, "hp");
  onePole(bassR, sampleRate, 32, "hp");
  onePole(bassL, sampleRate, rig.bass.lowpass, "lp");
  onePole(bassR, sampleRate, rig.bass.lowpass, "lp");

  const room = plan.kind === "electronic" ? 0.16 : plan.kind === "orchestral" ? 0.4 : plan.kind === "bedroom" ? 0.3 : 0.22;
  smear(chordL, sampleRate, room);
  smear(chordR, sampleRate, room * 0.9);

  if (plan.kind === "electronic") {
    duck(chordL, chordR, kicks, beat, 0.52, sampleRate);
    duck(bassL, bassR, kicks, beat, 0.74, sampleRate);
  } else if (plan.kind === "band") {
    duck(chordL, chordR, kicks, beat, 0.78, sampleRate);
  }

  compress(drumsL, drumsR, sampleRate, 0.34, 2.4, 1.08, 0.006, 0.12);
  compress(bassL, bassR, sampleRate, 0.2, 3.6, 1.15, 0.012, 0.16);
  compress(chordL, chordR, sampleRate, 0.18, 2.2, 1.12, 0.02, 0.2);
  fadeEdges(drumsL, drumsR, sampleRate);
  fadeEdges(bassL, bassR, sampleRate);
  fadeEdges(chordL, chordR, sampleRate);

  if (energyOf(drumsL) < 0.008) throw new Error("The drum stem rendered silent.");
  if (energyOf(bassL) < 0.008) throw new Error("The bass stem rendered silent.");
  if (energyOf(chordL) < 0.008) throw new Error("The chord stem rendered silent.");

  const mixL = new Float32Array(n);
  const mixR = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    mixL[i] = (drumsL[i] ?? 0) + (bassL[i] ?? 0) + (chordL[i] ?? 0);
    mixR[i] = (drumsR[i] ?? 0) + (bassR[i] ?? 0) + (chordR[i] ?? 0);
  }
  master(mixL, mixR, sampleRate);

  return {
    drums: copyStereo(drumsL, drumsR),
    bass: copyStereo(bassL, bassR),
    chords: copyStereo(chordL, chordR),
    mix: { left: mixL, right: mixR },
    duration: n / sampleRate,
  };
}
