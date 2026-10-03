import type { NoteSample, RigPcm } from "@/lib/mix-engine";
import type { RigChoice } from "@/lib/rigs";

type Catalog = {
  drums: Record<string, { label: string; files: Record<string, string> }>;
  bass: Record<string, { label: string; lowpass: number; notes: { midi: number; url: string }[] }>;
  chords: Record<
    string,
    { label: string; attack: number; release: number; highpass: number; notes: { midi: number; url: string }[] }
  >;
};

const VOICES = ["kick", "snare", "hat", "open", "clap", "tom", "ride"] as const;

let catalogPromise: Promise<Catalog> | null = null;
const rigCache = new Map<string, Promise<RigPcm>>();

function peakNormalize(pcm: Float32Array, target = 0.86): Float32Array {
  let peak = 0;
  for (let i = 0; i < pcm.length; i++) peak = Math.max(peak, Math.abs(pcm[i] ?? 0));
  if (peak < 0.0008) return pcm;
  const gain = target / peak;
  const out = new Float32Array(pcm.length);
  for (let i = 0; i < pcm.length; i++) out[i] = (pcm[i] ?? 0) * gain;
  return out;
}

function toMono441(buffer: AudioBuffer): Float32Array {
  const srcRate = buffer.sampleRate;
  const left = buffer.getChannelData(0);
  const right = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : null;
  const length = Math.max(2, Math.min(44100 * 3, Math.round((left.length * 44100) / srcRate)));
  const out = new Float32Array(length);
  const ratio = srcRate / 44100;
  const last = left.length - 1;
  for (let i = 0; i < length; i++) {
    const pos = Math.min(last, i * ratio);
    const i0 = Math.floor(pos);
    const i1 = Math.min(last, i0 + 1);
    const frac = pos - i0;
    const l = (left[i0] ?? 0) * (1 - frac) + (left[i1] ?? 0) * frac;
    const r = right ? (right[i0] ?? 0) * (1 - frac) + (right[i1] ?? 0) * frac : l;
    out[i] = (l + r) * 0.5;
  }
  return peakNormalize(out);
}

async function decode(ctx: AudioContext, url: string): Promise<Float32Array> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`The sound library didn’t load (${url}).`);
  const encoded = await response.arrayBuffer();
  const audio = await ctx.decodeAudioData(encoded.slice(0));
  return toMono441(audio);
}

function loadCatalog(): Promise<Catalog> {
  if (!catalogPromise) {
    catalogPromise = fetch("/library/catalog.json")
      .then((response) => {
        if (!response.ok) throw new Error("The sound library catalog is missing.");
        return response.json() as Promise<Catalog>;
      })
      .catch((err) => {
        catalogPromise = null;
        throw err;
      });
  }
  return catalogPromise;
}

async function loadNotes(
  ctx: AudioContext,
  notes: { midi: number; url: string }[],
): Promise<NoteSample[]> {
  const decoded = await Promise.all(
    notes.map(async (note) => ({ midi: note.midi, pcm: await decode(ctx, note.url) })),
  );
  return decoded.sort((a, b) => a.midi - b.midi);
}

export function loadRig(choice: RigChoice): Promise<RigPcm> {
  const key = `${choice.drums}|${choice.bass}|${choice.chords}`;
  const cached = rigCache.get(key);
  if (cached) return cached;
  const pending = (async () => {
    const catalog = await loadCatalog();
    const drums = catalog.drums[choice.drums];
    const bass = catalog.bass[choice.bass];
    const chords = catalog.chords[choice.chords];
    if (!drums || !bass || !chords) throw new Error("That kit isn’t in the library.");
    const ctx = new AudioContext();
    try {
      const [voices, bassNotes, chordNotes] = await Promise.all([
        Promise.all(VOICES.map(async (voice) => {
          const url = drums.files[voice];
          if (!url) throw new Error(`The ${choice.drums} kit is missing a ${voice}.`);
          return [voice, await decode(ctx, url)] as const;
        })),
        loadNotes(ctx, bass.notes),
        loadNotes(ctx, chords.notes),
      ]);
      return {
        drums: Object.fromEntries(voices) as RigPcm["drums"],
        bass: { notes: bassNotes, attack: 0.01, release: 0.09, lowpass: bass.lowpass },
        chords: {
          notes: chordNotes,
          attack: chords.attack,
          release: chords.release,
          highpass: chords.highpass,
        },
      };
    } finally {
      await ctx.close();
    }
  })().catch((err) => {
    rigCache.delete(key);
    throw err;
  });
  rigCache.set(key, pending);
  return pending;
}
