import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Copy, Download, Trash2 } from "lucide-react";
import { MixPlayer } from "@/components/mix-player";
import {
  SCALE_OPTIONS,
  SAMPLES,
  VOCAL_OPTIONS,
  formatSheet,
  readLyric,
  sheetFilename,
} from "@/lib/brief";
import { useBooth } from "@/lib/booth-store";
import { directSession } from "@/lib/direct.functions";

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function errorText(err: unknown): string {
  const raw =
    err instanceof Error
      ? err.message
      : typeof err === "object" && err && "message" in err && typeof err.message === "string"
        ? err.message
        : "";
  const cleaned = raw.replace(/^Server function error:\s*/i, "").trim();
  if (!cleaned || cleaned.length > 240) {
    return "The session didn’t go through. Try directing again.";
  }
  return cleaned;
}

function when(ts: number): string {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function BoothApp() {
  const title = useBooth((state) => state.title);
  const lyrics = useBooth((state) => state.lyrics);
  const vocal = useBooth((state) => state.vocal);
  const scale = useBooth((state) => state.scale);
  const shelf = useBooth((state) => state.shelf);
  const activeId = useBooth((state) => state.activeId);
  const setTitle = useBooth((state) => state.setTitle);
  const setLyrics = useBooth((state) => state.setLyrics);
  const setVocal = useBooth((state) => state.setVocal);
  const setScale = useBooth((state) => state.setScale);
  const pushSession = useBooth((state) => state.pushSession);
  const openSession = useBooth((state) => state.openSession);
  const removeSession = useBooth((state) => state.removeSession);
  const loadSample = useBooth((state) => state.loadSample);
  const clearPage = useBooth((state) => state.clearPage);

  const direct = useServerFn(directSession);
  const [phase, setPhase] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const boardRef = useRef<HTMLElement>(null);
  const scrollAfter = useRef(false);

  useEffect(() => {
    void useBooth.persist.rehydrate();
  }, []);

  const active = shelf.find((session) => session.id === activeId) ?? null;
  const notes = readLyric(lyrics);
  const stale =
    active !== null &&
    (active.lyrics !== lyrics.trim() ||
      active.title !== title.trim() ||
      active.vocal !== vocal ||
      active.scale !== scale);

  useEffect(() => {
    if (!scrollAfter.current || phase !== "idle" || !active) return;
    scrollAfter.current = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    boardRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [active, phase]);

  async function onDirect() {
    setError(null);
    setCopied(false);
    if (notes.wordCount < 12) {
      setError("Give it a few more lines. Twelve words is the floor.");
      return;
    }
    if (notes.wordCount > 1200) {
      setError("That lyric is too long for one session. Direct a piece of it.");
      return;
    }
    setPhase("loading");
    try {
      const result = await direct({
        data: { title: title.trim(), lyrics: lyrics.trim(), vocal, scale },
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      scrollAfter.current = true;
      pushSession(result.brief);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setPhase("idle");
    }
  }

  async function onCopy() {
    if (!active) return;
    const text = formatSheet(active.brief, active);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Couldn’t copy the sheet. Download it instead.");
    }
  }

  function onDownload() {
    if (!active) return;
    const text = formatSheet(active.brief, active);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = sheetFilename(active.brief.workingTitle);
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-dvh pb-72 sm:pb-52">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full border border-ink" aria-hidden="true">
              <span className="size-3 rounded-full bg-oxide" />
            </span>
            <div>
              <p className="font-display text-2xl leading-none text-ink">Booth</p>
              <p className="mt-1 text-sm text-muted">A production desk for lyrics</p>
            </div>
          </div>
          <p className="text-right text-sm text-muted">Stays on this device</p>
        </div>
      </header>

      {shelf.length > 0 ? (
        <div className="border-b border-line">
          <div className="mx-auto max-w-6xl px-4 py-3 lg:px-8">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Shelf</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {shelf.map((session) => (
                <div
                  key={session.id}
                  className={cx(
                    "flex shrink-0 overflow-hidden rounded-2xl border bg-paper",
                    session.id === activeId ? "border-ink" : "border-line",
                  )}
                >
                  <button
                    type="button"
                    className="tap min-h-11 max-w-52 px-3 py-2 text-left"
                    onClick={() => {
                      setError(null);
                      openSession(session.id);
                    }}
                  >
                    <span className="block truncate text-sm font-medium text-ink">
                      {session.brief.workingTitle}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {session.brief.genre.primary} · {when(session.savedAt)}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="tap grid min-h-11 min-w-11 place-items-center border-l border-line text-muted"
                    aria-label={`Remove ${session.brief.workingTitle} from the shelf`}
                    onClick={() => removeSession(session.id)}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-2 lg:items-start lg:gap-8 lg:px-8 lg:py-8">
        <section className="min-w-0">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void onDirect();
            }}
          >
            <div className="desk-card rounded-2xl border border-line bg-paper px-4 py-4 sm:px-5">
              <label htmlFor="song-title" className="text-xs font-medium uppercase tracking-wide text-muted">
                Song title
              </label>
              <input
                id="song-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={80}
                placeholder="Untitled, until the lyric names it"
                className="mt-1 w-full bg-transparent font-display text-2xl text-ink outline-none placeholder:text-muted sm:text-3xl"
                autoComplete="off"
              />
              <label htmlFor="lyric" className="mt-4 block text-xs font-medium uppercase tracking-wide text-muted">
                Lyric
              </label>
              <textarea
                id="lyric"
                className="lyric-sheet mt-2"
                value={lyrics}
                onChange={(event) => setLyrics(event.target.value)}
                placeholder="Paste the lyric. Label a chorus if you already know it."
                spellCheck
              />
              <p className="mt-3 text-sm text-muted tabular-nums">
                {notes.wordCount === 0
                  ? "Empty page"
                  : `${notes.wordCount} words · ${notes.lineCount} lines · ~${notes.avgWords} a line`}
                {notes.hookCount > 1 ? ` · hook ×${notes.hookCount}` : ""}
              </p>
              {notes.labels.length > 0 ? (
                <p className="mt-1 text-sm text-ink-soft">{notes.labels.join("  ·  ")}</p>
              ) : null}
            </div>

            <ChoiceRow
              legend="Vocal"
              value={vocal}
              options={VOCAL_OPTIONS}
              onChange={setVocal}
            />
            <ChoiceRow
              legend="Scale"
              value={scale}
              options={SCALE_OPTIONS}
              onChange={setScale}
            />

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="tap min-h-12 flex-1 rounded-full border border-ink bg-paper px-5 text-sm font-medium text-ink disabled:opacity-60"
                disabled={phase === "loading"}
              >
                {phase === "loading" ? "Writing…" : active ? "Update the sheet" : "Write the sheet"}
              </button>
              {lyrics.trim() || title.trim() ? (
                <button
                  type="button"
                  className="tap min-h-12 rounded-full border border-line bg-paper px-5 text-sm font-medium text-ink"
                  onClick={() => {
                    setError(null);
                    clearPage();
                  }}
                >
                  New page
                </button>
              ) : null}
            </div>
            {error ? (
              <p className="mt-3 text-sm text-ink" role="alert">
                {error}
              </p>
            ) : null}

            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Or start from a page</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {SAMPLES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    className="tap min-h-11 rounded-full border border-line bg-paper px-3 text-sm text-ink-soft"
                    onClick={() => {
                      setError(null);
                      loadSample(sample);
                    }}
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </section>

        <section ref={boardRef} className="min-w-0 scroll-mt-6" aria-live="polite">
          {phase === "loading" ? (
            <div className="rounded-2xl bg-console px-5 py-8 text-console-fg sm:px-7">
              <p className="text-xs font-medium uppercase tracking-wide text-console-muted">Board</p>
              <h2 className="mt-3 font-display text-3xl">Writing the sheet</h2>
              <p className="mt-3 max-w-prose text-sm leading-relaxed text-console-muted">
                This is the written plan, not the song. Play the mix on the bar at the bottom — that one makes the audio.
              </p>
              <div className="meter mt-6" aria-hidden="true">
                <span />
              </div>
            </div>
          ) : active ? (
            <article key={active.id} className="rounded-2xl bg-console px-5 py-6 text-console-fg sm:px-7 sm:py-7">
              <div className="rise-item flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-console-muted">Session sheet</p>
                  <h2 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
                    {active.brief.workingTitle}
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="tap inline-flex min-h-11 items-center gap-2 rounded-full border border-console-line px-3 text-sm"
                    onClick={() => void onCopy()}
                  >
                    {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    type="button"
                    className="tap inline-flex min-h-11 items-center gap-2 rounded-full border border-console-line px-3 text-sm"
                    onClick={onDownload}
                  >
                    <Download className="size-4" aria-hidden="true" />
                    Sheet
                  </button>
                </div>
              </div>

              {stale ? (
                <p className="rise-item mt-4 text-sm text-console-muted">
                  The page changed after this brief. Direct again to update it.
                </p>
              ) : null}

              {!title.trim() ? (
                <button
                  type="button"
                  className="tap mt-4 min-h-11 rounded-full border border-console-line px-4 text-sm text-console-fg"
                  onClick={() => setTitle(active.brief.workingTitle)}
                >
                  Use this title on the page
                </button>
              ) : null}

              <p className="rise-item mt-5 max-w-prose font-display text-xl leading-snug text-console-fg">
                {active.brief.thesis}
              </p>

              <div className="rise-item mt-5 flex flex-wrap items-center gap-2">
                {active.brief.moods.map((mood) => (
                  <span
                    key={mood}
                    className="rounded-full border border-console-line px-3 py-1 text-xs text-console-muted"
                  >
                    {mood}
                  </span>
                ))}
                <span className="ml-1 text-xs uppercase tracking-wide text-console-muted tabular-nums">
                  Energy {active.brief.energy}/10
                </span>
              </div>
              <div
                className="mt-3 flex gap-1"
                aria-hidden="true"
              >
                {Array.from({ length: 10 }, (_, index) => (
                  <span
                    key={index}
                    className={cx(
                      "h-2 flex-1 rounded-full",
                      index < active.brief.energy ? "bg-oxide" : "bg-console-line",
                    )}
                  />
                ))}
              </div>

              <div className="rise-item mt-6 grid gap-3 sm:grid-cols-3">
                <Fact label="Genre" value={active.brief.genre.primary} note={active.brief.genre.alternates.join(" · ")} />
                <Fact
                  label="Tempo"
                  value={`${active.brief.tempo.bpmLow}–${active.brief.tempo.bpmHigh}`}
                  note={active.brief.tempo.feel}
                />
                <Fact label="Key" value={active.brief.harmonyKey.suggestion} note={active.brief.harmonyKey.bed} />
              </div>

              <div className="rise-item mt-6 rounded-2xl bg-console-2 px-4 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-console-muted">Form</p>
                <p className="mt-2 text-sm leading-relaxed text-console-fg">{active.brief.form}</p>
              </div>

              <div className="rise-item mt-2">
                <Note label="Why this genre" body={active.brief.genre.why} />
                <Note label="Why this tempo" body={active.brief.tempo.why} />
                <Note label="Why this key" body={active.brief.harmonyKey.why} />
                <Note label="Vocal" body={active.brief.vocal.delivery} />
                <p className="border-t border-console-line py-4 text-sm leading-relaxed text-console-muted">
                  {active.brief.vocal.stack}
                </p>
                <ul className="flex flex-wrap gap-2 pb-4">
                  {active.brief.vocal.processing.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-console-line px-3 py-1 text-xs text-console-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <Note label="Drums" body={active.brief.rhythm.approach} />
                <ul className="flex flex-wrap gap-2 pb-2">
                  {active.brief.rhythm.palette.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-console-line px-3 py-1 text-xs text-console-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <Note label="Bass" body={active.brief.bass} />
                <Note label="Room" body={active.brief.space.room} />
                <Note label="Width" body={active.brief.space.width} />
                <Note label="Dynamics" body={active.brief.space.dynamics} />
              </div>

              <div className="rise-item mt-4">
                <h3 className="text-xs font-medium uppercase tracking-wide text-console-muted">Arrangement</h3>
                <ol className="mt-4 border-l border-console-line">
                  {active.brief.arrangement.map((section, index) => (
                    <li key={`${section.section}-${index}`} className="relative pb-5 pl-5">
                      <span className="absolute top-1.5 -left-1 size-2 rounded-full bg-oxide" />
                      <p className="text-sm font-medium text-console-fg">
                        {section.section}
                        <span className="ml-2 font-normal text-console-muted">{section.length}</span>
                      </p>
                      <p className="mt-1 font-display text-base italic text-console-fg">“{section.cue}”</p>
                      <p className="mt-1 text-sm leading-relaxed text-console-muted">{section.direction}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rise-item mt-2">
                <h3 className="text-xs font-medium uppercase tracking-wide text-console-muted">First hour</h3>
                <ol className="mt-3">
                  {active.brief.moves.map((move, index) => (
                    <li key={move.title} className="border-t border-console-line py-4">
                      <p className="text-sm font-medium text-console-fg">
                        <span className="mr-2 tabular-nums text-console-muted">0{index + 1}</span>
                        {move.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-console-muted">{move.detail}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rise-item mt-2">
                <h3 className="text-xs font-medium uppercase tracking-wide text-console-muted">Leave out</h3>
                <ul className="mt-3">
                  {active.brief.avoid.map((item) => (
                    <li key={item} className="border-t border-console-line py-3 text-sm leading-relaxed text-console-fg">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rise-item mt-4">
                <h3 className="text-xs font-medium uppercase tracking-wide text-console-muted">
                  Neighborhood
                </h3>
                <p className="mt-1 text-xs text-console-muted">Texture, not a copy.</p>
                <ul className="mt-3">
                  {active.brief.references.map((ref) => (
                    <li key={ref.anchor} className="border-t border-console-line py-3">
                      <p className="text-sm font-medium text-console-fg">{ref.anchor}</p>
                      <p className="mt-1 text-sm leading-relaxed text-console-muted">{ref.why}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ) : (
            <div className="rounded-2xl bg-console px-5 py-8 text-console-fg sm:px-7">
              <p className="text-xs font-medium uppercase tracking-wide text-console-muted">Board</p>
              <h2 className="mt-3 font-display text-3xl">The board is clear</h2>
              <p className="mt-3 max-w-prose text-sm leading-relaxed text-console-muted">
                Paste a lyric and press Play the mix on the bar at the bottom. The words pick drums, bass, and chords. You get those three stems and a limited stereo mix of just them. Write the sheet when you want the production notes.
              </p>
            </div>
          )}
        </section>
      </main>

      <MixPlayer
        lyrics={lyrics}
        title={title}
        scale={scale}
        brief={active && !stale ? active.brief : null}
        canPlay={notes.wordCount >= 12}
      />

      <footer className="mx-auto max-w-6xl px-4 pb-8 text-sm leading-relaxed text-muted lg:px-8">
        The words in the lyric pick the drums, bass, and chords. The bar plays those three stems, then a limited mix of just them. Download the mix or each stem after it renders. Briefs stay in this browser. On a phone, install Booth from the browser menu (Install app or Add to Home Screen). A separate Android APK isn’t part of this build.
      </footer>
    </div>
  );
}

function ChoiceRow<T extends string>({
  legend,
  value,
  options,
  onChange,
}: {
  legend: string;
  value: T;
  options: readonly { id: T; label: string }[];
  onChange: (id: T) => void;
}) {
  return (
    <fieldset className="mt-5">
      <legend className="text-xs font-medium uppercase tracking-wide text-muted">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const on = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={on}
              className={cx(
                "tap min-h-11 rounded-full border px-3 text-sm",
                on ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink-soft",
              )}
              onClick={() => onChange(option.id)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Fact({ label, value, note }: { label: string; value: string; note: string }) {
  const compact = value.length > 22;
  return (
    <div className="rounded-2xl bg-console-2 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-console-muted">{label}</p>
      <p
        className={cx(
          "mt-1 font-display leading-tight text-console-fg",
          compact ? "text-lg" : "text-2xl tabular-nums",
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-console-muted">{note}</p>
    </div>
  );
}

function Note({ label, body }: { label: string; body: string }) {
  return (
    <div className="border-t border-console-line py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-console-muted">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-console-fg">{body}</p>
    </div>
  );
}
