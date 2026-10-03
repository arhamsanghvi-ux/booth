import { z } from "zod";

export const VOCAL_OPTIONS = [
  {
    id: "decide",
    label: "Let it decide",
    prompt: "No vocal cast specified. Choose the cast the lyric actually wants.",
  },
  {
    id: "lead",
    label: "Solo lead",
    prompt: "One lead singer. Doubles and stacks are allowed, but it is a solo record.",
  },
  {
    id: "duet",
    label: "Duet",
    prompt: "Two voices. Say who sings what, and where they share a line.",
  },
  {
    id: "rap",
    label: "Rap feature",
    prompt: "A sung lead with a rap feature, or a rap lead if the lyric is built that way. Place the rap in the form.",
  },
  {
    id: "choir",
    label: "Choir",
    prompt: "A choir or stacked gang vocal is part of the record, not a garnish.",
  },
  {
    id: "spoken",
    label: "Spoken",
    prompt: "The vocal is spoken, half-spoken, or talk-sung. Do not turn it into a belted pop chorus unless the lyric demands a sung release.",
  },
] as const;

export const SCALE_OPTIONS = [
  {
    id: "decide",
    label: "Lyric decides",
    prompt: "No production scale specified. Pick the scale the lyric can carry.",
  },
  {
    id: "bedroom",
    label: "Bedroom",
    prompt: "Bedroom or small-room record. Few sources, close and specific. No orchestra unless it is a single sampled color.",
  },
  {
    id: "band",
    label: "Live band",
    prompt: "A live band can play this: drums, bass, and harmony instruments in a room. Programmed elements only if they earn a seat.",
  },
  {
    id: "electronic",
    label: "Electronic",
    prompt: "Electronic production: programmed drums, synths, samples. Organic sources are seasoning, not the spine.",
  },
  {
    id: "orchestral",
    label: "Orchestral",
    prompt: "Orchestral or chamber weight: strings, winds, piano, or a hybrid score bed. Rhythm section is optional and must stay out of the way of the lyric.",
  },
] as const;

export type VocalId = (typeof VOCAL_OPTIONS)[number]["id"];
export type ScaleId = (typeof SCALE_OPTIONS)[number]["id"];

export const inputSchema = z.object({
  title: z.string().trim().max(80),
  lyrics: z.string().trim().min(1).max(7000),
  vocal: z.enum(["decide", "lead", "duet", "rap", "choir", "spoken"]),
  scale: z.enum(["decide", "bedroom", "band", "electronic", "orchestral"]),
});

export type DirectInput = z.infer<typeof inputSchema>;

const line = z.string().trim().min(1).max(800);

export const briefSchema = z.object({
  workingTitle: z.string().trim().min(1).max(120),
  thesis: line,
  form: line,
  moods: z.array(z.string().trim().min(1).max(60)).min(1).max(8),
  energy: z.number().transform((n) => Math.min(10, Math.max(1, Math.round(n)))),
  genre: z.object({
    primary: line,
    alternates: z.array(line).min(1).max(4),
    why: line,
  }),
  tempo: z.object({
    bpmLow: z.number().transform((n) => Math.min(220, Math.max(40, Math.round(n)))),
    bpmHigh: z.number().transform((n) => Math.min(220, Math.max(40, Math.round(n)))),
    feel: line,
    why: line,
  }),
  harmonyKey: z.object({
    suggestion: line,
    bed: line,
    why: line,
  }),
  vocal: z.object({
    delivery: line,
    stack: line,
    processing: z.array(line).min(1).max(6),
  }),
  rhythm: z.object({
    approach: line,
    palette: z.array(line).min(1).max(8),
  }),
  bass: line,
  space: z.object({
    room: line,
    width: line,
    dynamics: line,
  }),
  arrangement: z
    .array(
      z.object({
        section: z.string().trim().min(1).max(80),
        length: z.string().trim().min(1).max(80),
        cue: line,
        direction: line,
      }),
    )
    .min(1)
    .max(8),
  moves: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(120),
        detail: line,
      }),
    )
    .min(1)
    .max(5),
  avoid: z.array(line).min(1).max(5),
  references: z
    .array(
      z.object({
        anchor: z.string().trim().min(1).max(160),
        why: line,
      }),
    )
    .min(1)
    .max(4),
});

export type Brief = z.infer<typeof briefSchema>;

export const PRODUCTION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "workingTitle",
    "thesis",
    "form",
    "moods",
    "energy",
    "genre",
    "tempo",
    "harmonyKey",
    "vocal",
    "rhythm",
    "bass",
    "space",
    "arrangement",
    "moves",
    "avoid",
    "references",
  ],
  properties: {
    workingTitle: { type: "string" },
    thesis: { type: "string" },
    form: { type: "string" },
    moods: { type: "array", items: { type: "string" } },
    energy: { type: "integer" },
    genre: {
      type: "object",
      additionalProperties: false,
      required: ["primary", "alternates", "why"],
      properties: {
        primary: { type: "string" },
        alternates: { type: "array", items: { type: "string" } },
        why: { type: "string" },
      },
    },
    tempo: {
      type: "object",
      additionalProperties: false,
      required: ["bpmLow", "bpmHigh", "feel", "why"],
      properties: {
        bpmLow: { type: "integer" },
        bpmHigh: { type: "integer" },
        feel: { type: "string" },
        why: { type: "string" },
      },
    },
    harmonyKey: {
      type: "object",
      additionalProperties: false,
      required: ["suggestion", "bed", "why"],
      properties: {
        suggestion: { type: "string" },
        bed: { type: "string" },
        why: { type: "string" },
      },
    },
    vocal: {
      type: "object",
      additionalProperties: false,
      required: ["delivery", "stack", "processing"],
      properties: {
        delivery: { type: "string" },
        stack: { type: "string" },
        processing: { type: "array", items: { type: "string" } },
      },
    },
    rhythm: {
      type: "object",
      additionalProperties: false,
      required: ["approach", "palette"],
      properties: {
        approach: { type: "string" },
        palette: { type: "array", items: { type: "string" } },
      },
    },
    bass: { type: "string" },
    space: {
      type: "object",
      additionalProperties: false,
      required: ["room", "width", "dynamics"],
      properties: {
        room: { type: "string" },
        width: { type: "string" },
        dynamics: { type: "string" },
      },
    },
    arrangement: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["section", "length", "cue", "direction"],
        properties: {
          section: { type: "string" },
          length: { type: "string" },
          cue: { type: "string" },
          direction: { type: "string" },
        },
      },
    },
    moves: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "detail"],
        properties: {
          title: { type: "string" },
          detail: { type: "string" },
        },
      },
    },
    avoid: { type: "array", items: { type: "string" } },
    references: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["anchor", "why"],
        properties: {
          anchor: { type: "string" },
          why: { type: "string" },
        },
      },
    },
  },
} as const;

export type PageNotes = {
  lineCount: number;
  wordCount: number;
  avgWords: number;
  labels: string[];
  hook: string;
  hookCount: number;
};

function isSectionLabel(lineText: string): boolean {
  if (/^\[.{1,40}\]$/.test(lineText)) return true;
  return /^(verse|chorus|pre-chorus|prechorus|bridge|outro|intro|hook|refrain|breakdown)\b/i.test(
    lineText,
  ) && lineText.length < 42;
}

export function readLyric(text: string): PageNotes {
  const raw = text.replace(/\r\n/g, "\n").split("\n");
  const labels = raw.map((l) => l.trim()).filter(isSectionLabel);
  const lines = raw
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !isSectionLabel(l));
  const words = lines.join(" ").split(/\s+/).filter(Boolean);
  const counts = new Map<string, number>();
  for (const lyricLine of lines) {
    const key = lyricLine
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s']/gu, "")
      .replace(/\s+/g, " ")
      .trim();
    if (key.split(" ").length < 3) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  let hook = "";
  let hookCount = 1;
  for (const [key, count] of counts) {
    if (count > hookCount) {
      hook = key;
      hookCount = count;
    }
  }
  return {
    lineCount: lines.length,
    wordCount: words.length,
    avgWords: lines.length ? Math.round((words.length / lines.length) * 10) / 10 : 0,
    labels,
    hook,
    hookCount: hook ? hookCount : 0,
  };
}

export function lyricFactBlock(text: string): string {
  const notes = readLyric(text);
  return [
    `Spoken lines: ${notes.lineCount}`,
    `Words: ${notes.wordCount}`,
    `Average words per line: ${notes.avgWords || 0}`,
    notes.labels.length ? `Section labels: ${notes.labels.join(", ")}` : "No section labels",
    notes.hook
      ? `Repeated line (${notes.hookCount} times): ${notes.hook}`
      : "No line repeats",
  ].join("\n");
}

export function optionPrompt(
  options: readonly { id: string; prompt: string }[],
  id: string,
): string {
  return options.find((option) => option.id === id)?.prompt ?? options[0]?.prompt ?? "";
}

export type SheetMeta = {
  title: string;
  vocal: VocalId;
  scale: ScaleId;
};

export function formatSheet(brief: Brief, meta: SheetMeta): string {
  const vocal = VOCAL_OPTIONS.find((option) => option.id === meta.vocal)?.label ?? meta.vocal;
  const scale = SCALE_OPTIONS.find((option) => option.id === meta.scale)?.label ?? meta.scale;
  const title = meta.title || brief.workingTitle;
  const lines = [
    "BOOTH  ·  SESSION SHEET",
    title,
    `Cast: ${vocal}    Scale: ${scale}`,
    "",
    "THESIS",
    brief.thesis,
    "",
    "FORM",
    brief.form,
    "",
    `MOOD    ${brief.moods.join("  ·  ")}`,
    `ENERGY  ${brief.energy}/10`,
    "",
    "GENRE",
    brief.genre.primary,
    `Also: ${brief.genre.alternates.join(", ")}`,
    brief.genre.why,
    "",
    "TEMPO",
    `${brief.tempo.bpmLow}–${brief.tempo.bpmHigh} bpm`,
    brief.tempo.feel,
    brief.tempo.why,
    "",
    "KEY & BED",
    brief.harmonyKey.suggestion,
    brief.harmonyKey.bed,
    brief.harmonyKey.why,
    "",
    "VOCAL",
    brief.vocal.delivery,
    brief.vocal.stack,
    brief.vocal.processing.map((item) => `· ${item}`).join("\n"),
    "",
    "DRUMS",
    brief.rhythm.approach,
    brief.rhythm.palette.map((item) => `· ${item}`).join("\n"),
    "",
    "BASS",
    brief.bass,
    "",
    "ROOM",
    brief.space.room,
    brief.space.width,
    brief.space.dynamics,
    "",
    "ARRANGEMENT",
    ...brief.arrangement.flatMap((section) => [
      `${section.section}  (${section.length})`,
      `"${section.cue}"`,
      section.direction,
      "",
    ]),
    "DO THIS",
    ...brief.moves.flatMap((move, index) => [
      `${index + 1}. ${move.title}`,
      move.detail,
      "",
    ]),
    "LEAVE OUT",
    ...brief.avoid.map((item) => `· ${item}`),
    "",
    "NEIGHBORHOOD  (texture, not a copy)",
    ...brief.references.flatMap((ref) => [ref.anchor, ref.why, ""]),
  ];
  return lines.join("\n").trim() + "\n";
}

export function sheetFilename(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `booth-${slug || "session"}.txt`;
}

export const SAMPLES: Array<{
  id: string;
  label: string;
  title: string;
  vocal: VocalId;
  scale: ScaleId;
  lyrics: string;
}> = [
  {
    id: "kettle",
    label: "Quiet split",
    title: "The kettle clicks off",
    vocal: "lead",
    scale: "bedroom",
    lyrics: `The kettle clicks off and nobody moves
Your mug is still facing the chair that you used
I wipe the same ring from the table again
Like the night might forget where your elbow has been

[Chorus]
I am learning the quiet
The way a room keeps a voice
I set one plate and I hate it
And I do it anyway, twice

Streetlight on the linoleum, yellow and thin
Your jacket's a ghost by the back of the bin
I don't play the record, I just hold the sleeve
The song is too crowded for what I believe

[Chorus]
I am learning the quiet
The way a room keeps a voice
I set one plate and I hate it
And I do it anyway, twice

[Bridge]
If you come back, come back ordinary
Don't bring the speech or the suitcase apology
Just stand in the doorway and ask if I'm cold
I'll say that I am, and I'll mean something old

[Outro]
The kettle clicks off
And nobody moves`,
  },
  {
    id: "receipt",
    label: "Night out",
    title: "Receipt",
    vocal: "lead",
    scale: "electronic",
    lyrics: `Receipt in my pocket still warm from the bar
The city is counting my steps in the dark
Neon is chewing the rain off my coat
I came here to vanish and leave with a quote

[Pre-chorus]
They keep the lights mean so nobody cries
I like the way midnight edits my eyes

[Chorus]
Turn it up till the mirror forgets my name
Till the bass is a hand on the small of the blame
I don't want a slow song, I want a clean exit
A stamp on my wrist and a night I won't edit

Shoes on the table, the chorus too loud
Somebody's laughing like they own the crowd
I dance like a secret I'm willing to spend
Call it a problem, call it a friend

[Chorus]
Turn it up till the mirror forgets my name
Till the bass is a hand on the small of the blame
I don't want a slow song, I want a clean exit
A stamp on my wrist and a night I won't edit

[Bridge]
At 3 the room empties and the song stays rude
I check my pockets for a softer mood
Nothing but the receipt and the ink on my skin
So I stay for the last one and I go in`,
  },
  {
    id: "county",
    label: "Highway",
    title: "County line",
    vocal: "lead",
    scale: "band",
    lyrics: `County line at a quarter to four
The radio's preaching and the tires are sore
Dad's lighter is empty but I flick it still
The corn is a rumor and the sky is a bill

[Chorus]
Take me where the map gives up
Where the gravel starts telling the truth
I'll sing with the window half shut
And a voice that still sounds like a youth

Mama said the town gets smaller if you stay
I believed her and I left the same day
Now the exits all look like the one I knew
A truck stop gospel and a coffee gone blue

[Chorus]
Take me where the map gives up
Where the gravel starts telling the truth
I'll sing with the window half shut
And a voice that still sounds like a youth

[Bridge]
If I turn around the porch light is on
That's the oldest trick the highway has won
I keep both hands at ten and two
And I let the next mile tell me what to do`,
  },
];
