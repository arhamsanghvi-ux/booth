import assert from "node:assert/strict";
import test from "node:test";
import { renderStems, type NoteSample, type RigPcm } from "./mix-engine.ts";
import type { MixPlan } from "./mix-plan.ts";

function burst(seconds: number, freq: number): Float32Array {
  const sr = 44100;
  const n = Math.max(2, Math.floor(seconds * sr));
  const pcm = new Float32Array(n);
  let state = 1;
  for (let i = 0; i < n; i++) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const noise = (state / 4294967296) * 2 - 1;
    const tone = Math.sin((2 * Math.PI * freq * i) / sr);
    const env = Math.exp((-4 * i) / n);
    pcm[i] = (tone * 0.75 + noise * 0.25) * env;
  }
  return pcm;
}

function notes(midis: number[]): NoteSample[] {
  return midis.map((midi) => ({
    midi,
    pcm: burst(0.7, 440 * 2 ** ((midi - 69) / 12)),
  }));
}

function rig(): RigPcm {
  return {
    drums: {
      kick: burst(0.3, 55),
      snare: burst(0.2, 180),
      hat: burst(0.05, 3000),
      open: burst(0.4, 2400),
      clap: burst(0.15, 900),
      tom: burst(0.35, 110),
      ride: burst(0.6, 1600),
    },
    bass: { notes: notes([28, 36, 43, 48]), attack: 0.01, release: 0.08, lowpass: 900 },
    chords: { notes: notes([48, 55, 60, 67, 72, 79]), attack: 0.02, release: 0.16, highpass: 140 },
  };
}

function plan(kind: MixPlan["kind"]): MixPlan {
  return {
    bpm: kind === "bedroom" ? 82 : kind === "electronic" ? 122 : 98,
    root: 57,
    minor: true,
    dorian: false,
    energy: kind === "electronic" ? 8 : kind === "bedroom" ? 3 : 6,
    swing: kind === "band" ? 0.16 : 0.02,
    density: kind === "electronic" ? 0.8 : 0.45,
    brightness: 0.55,
    halfTime: false,
    kind,
    seed: 11,
    title: "Test",
    keyName: "A minor",
    modelLine: "test",
  };
}

function measure(left: Float32Array, right: Float32Array) {
  let peak = 0;
  let energy = 0;
  let diff = 0;
  let nan = 0;
  const step = 4;
  for (let i = 0; i < left.length; i += step) {
    const l = left[i] ?? 0;
    const r = right[i] ?? 0;
    if (!Number.isFinite(l) || !Number.isFinite(r)) nan += 1;
    peak = Math.max(peak, Math.abs(l), Math.abs(r));
    energy += l * l;
    diff += Math.abs(l - r);
  }
  return { peak, rms: Math.sqrt(energy / (left.length / step)), diff, nan, seconds: left.length / 44100 };
}

for (const kind of ["band", "electronic", "bedroom", "orchestral"] as const) {
  test(`three stems render for ${kind}`, () => {
    const rendered = renderStems(plan(kind), rig(), kind === "electronic", 44100);
    const mix = measure(rendered.mix.left, rendered.mix.right);
    const drums = measure(rendered.drums.left, rendered.drums.right);
    const bass = measure(rendered.bass.left, rendered.bass.right);
    const chords = measure(rendered.chords.left, rendered.chords.right);
    assert.equal(mix.nan, 0, JSON.stringify({ mix, drums, bass, chords }));
    assert.ok(mix.seconds > 25 && mix.seconds < 75, `duration ${mix.seconds}`);
    assert.ok(mix.peak > 0.8 && mix.peak <= 0.92, `mix peak ${mix.peak}`);
    assert.ok(mix.rms > 0.04, `mix rms ${mix.rms}`);
    assert.ok(drums.rms > 0.01, `drums rms ${drums.rms}`);
    assert.ok(bass.rms > 0.01, `bass rms ${bass.rms}`);
    assert.ok(chords.rms > 0.01, `chords rms ${chords.rms}`);
    assert.ok(mix.diff > 1, "mix should be stereo");
  });
}
