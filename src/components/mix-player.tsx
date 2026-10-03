import { useEffect, useRef, useState } from "react";
import { Download, Pause, Play } from "lucide-react";
import type { Brief, ScaleId } from "@/lib/brief";
import { planMix } from "@/lib/mix-plan";
import { audioBufferToWav, renderMix } from "@/lib/render-demo";
import { chooseRig } from "@/lib/rigs";

function clock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

function fileSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return slug || "demo";
}

type Stems = { mix: Blob; drums: Blob; bass: Blob; chords: Blob };

export function MixPlayer({
  lyrics,
  title,
  scale,
  brief,
  canPlay,
}: {
  lyrics: string;
  title: string;
  scale: ScaleId;
  brief: Brief | null;
  canPlay: boolean;
}) {
  const [phase, setPhase] = useState<"idle" | "mixing" | "ready">("idle");
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stemsRef = useRef<Stems | null>(null);
  const urlRef = useRef<string | null>(null);
  const signatureRef = useRef("");
  const tokenRef = useRef(0);

  const plan = canPlay ? planMix({ lyrics, title, scale, brief }) : null;
  const rig = plan ? chooseRig(plan, lyrics) : null;
  const signature = plan
    ? `${plan.bpm}|${plan.root}|${plan.minor}|${plan.dorian}|${plan.kind}|${plan.energy}|${plan.swing}|${plan.density}|${plan.seed}|${lyrics}`
    : "";

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;
    const onTime = () => setTime(audio.currentTime || 0);
    const onMeta = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnd = () => {
      setPlaying(false);
      setTime(Number.isFinite(audio.duration) ? audio.duration : 0);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnd);
      audio.src = "";
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  useEffect(() => {
    if (!signatureRef.current || signatureRef.current === signature) return;
    tokenRef.current += 1;
    audioRef.current?.pause();
    stemsRef.current = null;
    signatureRef.current = "";
    setPlaying(false);
    setPhase("idle");
    setDuration(0);
    setTime(0);
  }, [signature]);

  async function onPlay() {
    const audio = audioRef.current;
    if (!audio || !plan || !canPlay) return;
    if (stemsRef.current && signatureRef.current === signature) {
      if (!audio.paused) {
        audio.pause();
        return;
      }
      try {
        await audio.play();
        setNote(null);
      } catch {
        setNote("The speakers stayed closed. Press play once more.");
      }
      return;
    }

    const token = tokenRef.current + 1;
    tokenRef.current = token;
    setPhase("mixing");
    setNote(null);
    setPlaying(false);
    audio.pause();
    try {
      const rendered = await renderMix(plan, lyrics);
      if (token !== tokenRef.current) return;
      stemsRef.current = {
        mix: audioBufferToWav(rendered.mix),
        drums: audioBufferToWav(rendered.drums),
        bass: audioBufferToWav(rendered.bass),
        chords: audioBufferToWav(rendered.chords),
      };
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const url = URL.createObjectURL(stemsRef.current.mix);
      urlRef.current = url;
      signatureRef.current = signature;
      audio.src = url;
      audio.currentTime = 0;
      setDuration(rendered.mix.duration);
      setTime(0);
      setPhase("ready");
      try {
        await audio.play();
      } catch {
        setNote("The mix is ready. Press play to hear it.");
      }
    } catch (err) {
      if (token !== tokenRef.current) return;
      setPhase(stemsRef.current ? "ready" : "idle");
      setNote(err instanceof Error && err.message ? err.message : "The mix didn’t render.");
    }
  }

  function onDownload(part: keyof Stems) {
    const blob = stemsRef.current?.[part];
    if (!blob || !plan) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `booth-${part}-${fileSlug(plan.title)}.wav`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper shadow-[0_-10px_28px_rgba(23,21,18,0.08)]">
      <div className="mx-auto max-w-6xl px-4 py-3 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            className="tap inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-oxide px-5 text-base font-medium text-oxide-ink disabled:opacity-60 sm:w-auto sm:min-w-52"
            disabled={!canPlay || phase === "mixing"}
            onClick={() => void onPlay()}
          >
            {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
            {phase === "mixing" ? "Mixing…" : playing ? "Pause" : brief ? "Play this sheet" : "Play the mix"}
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-ink">
              {plan && rig
                ? `${plan.keyName} · ${plan.bpm} bpm · ${rig.label}`
                : "Twelve words, then this can play."}
            </p>
            <p className="truncate text-xs text-muted">
              {plan && rig ? rig.why : "The song is this bar, not the sheet."}
            </p>
            {duration > 0 ? (
              <div className="mt-1 flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step={0.1}
                  value={Math.min(time, duration)}
                  aria-label="Mix position"
                  className="w-full accent-oxide"
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    const audio = audioRef.current;
                    if (!audio) return;
                    audio.currentTime = next;
                    setTime(next);
                  }}
                />
                <p className="shrink-0 text-xs text-muted tabular-nums">
                  {clock(time)} / {clock(duration)}
                </p>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="tap inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink px-5 text-sm font-medium text-ink disabled:opacity-60"
            disabled={phase !== "ready"}
            onClick={() => onDownload("mix")}
          >
            <Download className="size-4" aria-hidden="true" />
            Mix
          </button>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {(["drums", "bass", "chords"] as const).map((part) => (
            <button
              key={part}
              type="button"
              className="tap inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-3 text-sm text-ink disabled:opacity-60"
              disabled={phase !== "ready"}
              onClick={() => onDownload(part)}
            >
              <Download className="size-3.5" aria-hidden="true" />
              {part === "drums" ? "Drums" : part === "bass" ? "Bass" : "Chords"}
            </button>
          ))}
          {phase === "mixing" ? (
            <div className="meter min-w-32 flex-1" aria-hidden="true">
              <span />
            </div>
          ) : (
            <p className="text-xs text-muted">Three stems, then a limited mix of just those.</p>
          )}
        </div>
        {note ? (
          <p className="mt-1 text-sm text-ink" role="alert">
            {note}
          </p>
        ) : null}
      </div>
    </div>
  );
}
