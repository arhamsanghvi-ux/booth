import { renderStems, type Stereo } from "@/lib/mix-engine";
import type { MixPlan } from "@/lib/mix-plan";
import { chooseRig } from "@/lib/rigs";
import { loadRig } from "@/lib/sample-kit";

export type RenderedMix = {
  mix: AudioBuffer;
  drums: AudioBuffer;
  bass: AudioBuffer;
  chords: AudioBuffer;
  label: string;
};

function toBuffer(stereo: Stereo): AudioBuffer {
  const buffer = new AudioBuffer({
    length: stereo.left.length,
    numberOfChannels: 2,
    sampleRate: 44100,
  });
  buffer.copyToChannel(new Float32Array(stereo.left), 0);
  buffer.copyToChannel(new Float32Array(stereo.right), 1);
  return buffer;
}

export async function renderMix(plan: MixPlan, lyrics = ""): Promise<RenderedMix> {
  const choice = chooseRig(plan, lyrics);
  const rig = await loadRig(choice);
  const rendered = renderStems(plan, rig, choice.clap, 44100);
  return {
    mix: toBuffer(rendered.mix),
    drums: toBuffer(rendered.drums),
    bass: toBuffer(rendered.bass),
    chords: toBuffer(rendered.chords),
    label: choice.label,
  };
}

export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const channels = buffer.numberOfChannels;
  const rate = buffer.sampleRate;
  const samples = buffer.length;
  const blockAlign = channels * 2;
  const dataSize = samples * blockAlign;
  const array = new ArrayBuffer(44 + dataSize);
  const view = new DataView(array);
  const write = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
  };
  write(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  write(8, "WAVE");
  write(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  write(36, "data");
  view.setUint32(40, dataSize, true);
  const planes = Array.from({ length: channels }, (_, channel) => buffer.getChannelData(channel));
  let offset = 44;
  for (let i = 0; i < samples; i++) {
    for (let channel = 0; channel < channels; channel++) {
      const sample = Math.max(-1, Math.min(1, planes[channel]?.[i] ?? 0));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }
  return new Blob([array], { type: "audio/wav" });
}
