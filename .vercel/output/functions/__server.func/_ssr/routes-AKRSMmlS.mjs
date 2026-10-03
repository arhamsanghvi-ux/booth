import { i as __toESM } from "../_runtime.mjs";
import { U as isRedirect, b as require_jsx_runtime, q as require_react, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { d as sheetFilename, i as VOCAL_OPTIONS, n as SAMPLES, o as formatSheet, r as SCALE_OPTIONS, s as inputSchema, u as readLyric } from "./brief-VSqGsPZF.mjs";
import { a as Download, i as Pause, n as Trash2, o as Copy, r as Play, s as Check } from "../_libs/lucide-react.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-AKRSMmlS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var BAGS = {
	quiet: [
		"quiet",
		"still",
		"soft",
		"whisper",
		"kettle",
		"empty",
		"alone",
		"room",
		"sleep",
		"hush",
		"plate",
		"ordinary",
		"pillow",
		"blanket",
		"morning",
		"coffee",
		"kitchen",
		"silence",
		"gentle",
		"tender",
		"lullaby",
		"bedroom",
		"candle",
		"breath",
		"sigh",
		"slowly",
		"softly"
	],
	night: [
		"night",
		"dark",
		"moon",
		"streetlight",
		"midnight",
		"neon",
		"shadow",
		"dusk",
		"lamp",
		"alley",
		"insomnia",
		"starlight",
		"stars",
		"street"
	],
	dance: [
		"dance",
		"bass",
		"club",
		"floor",
		"beat",
		"mirror",
		"crowd",
		"stamp",
		"wrist",
		"rave",
		"drop",
		"speaker",
		"party",
		"sweat",
		"bounce",
		"tempo",
		"groove",
		"speakers"
	],
	road: [
		"highway",
		"road",
		"truck",
		"county",
		"gravel",
		"tires",
		"tire",
		"radio",
		"corn",
		"mama",
		"town",
		"map",
		"window",
		"mile",
		"miles",
		"asphalt",
		"headlight",
		"headlights",
		"drive"
	],
	hymn: [
		"church",
		"hymn",
		"prayer",
		"gospel",
		"heaven",
		"organ",
		"choir",
		"angel",
		"amen",
		"holy",
		"lord",
		"god",
		"sunday",
		"chapel",
		"pew",
		"mercy",
		"glory",
		"hallelujah",
		"pray"
	],
	machine: [
		"machine",
		"wire",
		"static",
		"glitch",
		"digital",
		"robot",
		"circuit",
		"pixel",
		"error",
		"screen",
		"code",
		"binary",
		"chrome"
	],
	love: [
		"love",
		"heart",
		"hold",
		"kiss",
		"darling",
		"baby",
		"forever",
		"ache",
		"arms"
	],
	dust: [
		"whiskey",
		"boots",
		"dust",
		"porch",
		"honky",
		"harmonica",
		"fiddle",
		"barn",
		"diesel",
		"pickup",
		"cowboy",
		"dirt",
		"rust",
		"saloon"
	],
	jazz: [
		"sax",
		"saxophone",
		"jazz",
		"smoke",
		"lounge",
		"velvet",
		"trumpet"
	],
	water: [
		"rain",
		"ocean",
		"sea",
		"river",
		"wave",
		"storm",
		"thunder",
		"tide",
		"shore",
		"waves"
	],
	fire: [
		"fire",
		"burn",
		"flame",
		"heat",
		"blaze",
		"ash",
		"burning"
	]
};
var TAGS = Object.keys(BAGS);
var SETS = Object.fromEntries(TAGS.map((tag) => [tag, new Set(BAGS[tag])]));
function variants(token) {
	const out = [token];
	if (token.length > 4 && token.endsWith("s")) out.push(token.slice(0, -1));
	if (token.length > 5 && token.endsWith("es")) out.push(token.slice(0, -2));
	if (token.length > 5 && token.endsWith("ed")) out.push(token.slice(0, -2));
	if (token.length > 6 && token.endsWith("ing")) {
		const stem = token.slice(0, -3);
		out.push(stem, `${stem}e`);
	}
	return out;
}
function lyricSignals(text) {
	const tokens = text.toLowerCase().match(/[a-z']+/g) ?? [];
	const counts = {
		quiet: 0,
		night: 0,
		dance: 0,
		road: 0,
		hymn: 0,
		machine: 0,
		love: 0,
		dust: 0,
		jazz: 0,
		water: 0,
		fire: 0
	};
	for (const token of tokens) {
		const forms = variants(token);
		for (const tag of TAGS) if (forms.some((form) => SETS[tag].has(form))) counts[tag] += 1;
	}
	return counts;
}
var WEIGHTS = [
	[
		105.83139777824726,
		-1.8502927960525994,
		9.100076308091275,
		21.471860730906997,
		-2.9228284918287954,
		-12.288484380603506,
		51.27809040062721,
		-47.73851851633299
	],
	[
		6.281349483738381,
		-1.073253678593634,
		1.3422936035827249,
		1.8785152179059494,
		.28403658155296796,
		-1.3433673987834442,
		5.398074185940175,
		-5.007535142988047
	],
	[
		.1617892118956057,
		.3496550376734211,
		-.5256820789294006,
		-.07192263047844882,
		-.060089662378287834,
		.447196966417172,
		-.10151028758329517,
		.9067205433282268
	],
	[
		.6358955746258239,
		-.14265561398890658,
		.09700812554175631,
		.23815634719744816,
		.05112109468909676,
		-.1891087117576652,
		.6364452098256201,
		-.6340079106406691
	],
	[
		.07461958526585732,
		-.06757526226279009,
		.41975386594362907,
		-.01589596251985803,
		.007788313103466393,
		-.24217928472488875,
		-.11438528255023428,
		-.22401174357970355
	],
	[
		.6500860397068458,
		-.1809901580388391,
		.17715810294794565,
		.16920824060499617,
		.07082839122113027,
		-.1799201212082322,
		.5342254373390372,
		-.5440084137204408
	]
];
function clamp$1(n, lo, hi) {
	return Math.min(hi, Math.max(lo, n));
}
function lyricVector(text) {
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
		unique
	];
}
function predictPocket(text) {
	const x = lyricVector(text);
	const scored = WEIGHTS.map((weights) => weights.reduce((sum, weight, index) => sum + weight * x[index], 0));
	return {
		bpm: clamp$1(scored[0] ?? 96, 64, 146),
		energy: clamp$1(scored[1] ?? 5, 1, 10),
		minor: clamp$1(scored[2] ?? .5, 0, 1),
		density: clamp$1(scored[3] ?? .4, 0, 1),
		swing: clamp$1(scored[4] ?? .1, 0, .55),
		brightness: clamp$1(scored[5] ?? .5, 0, 1)
	};
}
var PITCH = {
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
	b: 11
};
var NAMES = [
	"C",
	"C#",
	"D",
	"Eb",
	"E",
	"F",
	"F#",
	"G",
	"Ab",
	"A",
	"Bb",
	"B"
];
function hash(text) {
	let h = 2166136261;
	for (let i = 0; i < text.length; i++) {
		h ^= text.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
function clamp(n, lo, hi) {
	return Math.min(hi, Math.max(lo, n));
}
function planMix(input) {
	const pocket = predictPocket(input.lyrics);
	const brief = input.brief;
	const genre = `${brief?.genre.primary ?? ""} ${brief?.genre.alternates.join(" ") ?? ""}`.toLowerCase();
	const feel = (brief?.tempo.feel ?? "").toLowerCase();
	const keyText = (brief?.harmonyKey.suggestion ?? "").toLowerCase();
	const dorian = /dorian/.test(keyText);
	const namedMinor = /minor|aeolian|phrygian|dorian|blues/.test(keyText);
	const namedMajor = /major|mixolydian|lydian|ionian/.test(keyText);
	const minor = namedMinor || !namedMajor && pocket.minor >= .55;
	const match = keyText.match(/\b([a-g](?:#|b)?)\b/);
	const pc = match ? PITCH[match[1]] : null;
	const fallbackPc = minor ? [
		9,
		2,
		4,
		11
	][hash(input.lyrics) % 4] : [
		0,
		7,
		5,
		2
	][hash(input.lyrics) % 4];
	const pitchClass = pc ?? fallbackPc ?? 0;
	const root = 48 + pitchClass;
	const briefBpm = brief ? (brief.tempo.bpmLow + brief.tempo.bpmHigh) / 2 : pocket.bpm;
	const bpm = clamp(Math.round(briefBpm), 64, 146);
	const energy = clamp(brief ? brief.energy : pocket.energy, 1, 10);
	const energyScale = .45 + energy / 14;
	let density = clamp(pocket.density * energyScale, .08, 1);
	let swing = pocket.swing;
	let brightness = clamp(pocket.brightness * (.55 + energy / 18), .15, 1);
	let kind = "band";
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
		else if (density > .72 && energy >= 7) kind = "electronic";
		else if (energy <= 3.5) kind = "bedroom";
	}
	if (kind === "electronic") {
		density = clamp(density + .18, 0, 1);
		swing = Math.min(swing, .12);
		brightness = clamp(brightness + .08, 0, 1);
	} else if (kind === "bedroom") {
		density = clamp(density - .12, .08, .7);
		brightness = clamp(brightness - .08, .12, .7);
	} else if (kind === "orchestral") {
		density = clamp(density * .35, .05, .4);
		swing = 0;
		brightness = clamp(brightness - .05, .2, .75);
	} else if (kind === "band") swing = clamp(swing + .08, 0, .55);
	const halfTime = /half/.test(feel) || bpm >= 118 && /trap|rap|hip/.test(genre + feel);
	const keyName = `${NAMES[pitchClass] ?? "C"} ${dorian ? "Dorian" : minor ? "minor" : "major"}`;
	const modelLine = `Linear model, 32 labeled pages · ${Math.round(pocket.bpm)} bpm lean · ${pocket.minor >= .55 ? "minor" : "major"} color · ${pocket.density >= .62 ? "busier drums" : "sparser drums"}`;
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
		modelLine
	};
}
var MINOR = [
	0,
	2,
	3,
	5,
	7,
	8,
	10
];
var MAJOR = [
	0,
	2,
	4,
	5,
	7,
	9,
	11
];
var DORIAN = [
	0,
	2,
	3,
	5,
	7,
	9,
	10
];
function scaleOf(plan) {
	if (plan.dorian) return DORIAN;
	return plan.minor ? MINOR : MAJOR;
}
function midiAt(plan, degree) {
	const scale = scaleOf(plan);
	const index = (degree % 7 + 7) % 7;
	const octaves = Math.floor(degree / 7);
	return plan.root + (scale[index] ?? 0) + 12 * octaves;
}
function layout(bpm) {
	const beat = 60 / bpm;
	const bar = beat * 4;
	const total = Math.max(12, Math.min(20, Math.round(50 / bar)));
	const intro = total >= 16 ? 2 : 1;
	const outro = total >= 14 ? 2 : 1;
	const mid = Math.max(4, total - intro - outro);
	const chorusBars = Math.max(2, Math.round(mid * .5));
	const verseBars = mid - chorusBars;
	const sections = [];
	let cursor = 0;
	const push = (name, bars) => {
		if (bars <= 0) return;
		sections.push({
			name,
			start: cursor * bar,
			bars
		});
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
	return {
		sections,
		beat,
		bar,
		duration: cursor * bar + 1.4
	};
}
function place(left, right, sample, startSec, durSec, gain, rate, pan, sr, attackSec, releaseSec) {
	if (sample.length < 2 || gain <= 8e-4 || durSec <= .012 || rate <= 0) return;
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
function shot(left, right, sample, time, gain, pan, sr) {
	place(left, right, sample, time, sample.length / sr, gain, 1, pan, sr, .002, .045);
}
function nearest(notes, midi) {
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
	while (rate < .7) {
		target += 12;
		rate = 2 ** ((target - best.midi) / 12);
	}
	return {
		pcm: best.pcm,
		rate
	};
}
function fold(midi, low, high) {
	let note = midi;
	while (note > high) note -= 12;
	while (note < low) note += 12;
	return note;
}
function nudge(seed, salt) {
	return ((Math.imul(seed ^ salt, 16777619) >>> 0) % 9 - 4) * .0014;
}
function onePole(buf, sr, freq, kind) {
	const a = Math.exp(-2 * Math.PI * freq / sr);
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
function smear(buf, sr, amount) {
	if (amount <= .01) return;
	const copy = buf.slice();
	const taps = [
		.019,
		.031,
		.047,
		.067,
		.089
	];
	const weights = [
		.34,
		.26,
		.18,
		.12,
		.08
	];
	for (let tap = 0; tap < taps.length; tap++) {
		const delay = Math.floor((taps[tap] ?? .03) * sr);
		const gain = (weights[tap] ?? 0) * amount;
		for (let i = delay; i < buf.length; i++) buf[i] += (copy[i - delay] ?? 0) * gain;
	}
}
function duck(left, right, kicks, beat, depth, sr) {
	if (kicks.length === 0 || depth >= .98) return;
	const gain = new Float32Array(left.length);
	gain.fill(1);
	const attack = Math.max(1, Math.floor(.008 * sr));
	const release = Math.max(attack + 1, Math.floor(Math.min(.24, beat * .48) * sr));
	for (const time of kicks) {
		const start = Math.floor(time * sr);
		const span = attack + release;
		for (let i = 0; i < span; i++) {
			const out = start + i;
			if (out < 0 || out >= gain.length) continue;
			const env = i < attack ? 1 - i / attack * (1 - depth) : depth + (1 - depth) * ((i - attack) / release);
			if (env < (gain[out] ?? 1)) gain[out] = env;
		}
	}
	for (let i = 0; i < left.length; i++) {
		left[i] = (left[i] ?? 0) * (gain[i] ?? 1);
		right[i] = (right[i] ?? 0) * (gain[i] ?? 1);
	}
}
function compress(left, right, sr, thresh, ratio, makeup, attack, release) {
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
function fadeEdges(left, right, sr) {
	const fadeIn = Math.floor(.012 * sr);
	const fadeOut = Math.floor(.12 * sr);
	const n = left.length;
	for (let i = 0; i < n; i++) {
		let edge = 1;
		if (i < fadeIn) edge = i / fadeIn;
		else if (i > n - fadeOut) edge = Math.max(0, (n - i) / fadeOut);
		left[i] = (left[i] ?? 0) * edge;
		right[i] = (right[i] ?? 0) * edge;
	}
}
function master(left, right, sr) {
	onePole(left, sr, 28, "hp");
	onePole(right, sr, 28, "hp");
	compress(left, right, sr, .22, 3.1, 1.35, .012, .18);
	const ceiling = .96;
	for (let i = 0; i < left.length; i++) {
		const l = left[i] ?? 0;
		const r = right[i] ?? 0;
		left[i] = l > ceiling ? ceiling + Math.tanh(l - ceiling) * .04 : l < -.96 ? -.96 + Math.tanh(l + ceiling) * .04 : l;
		right[i] = r > ceiling ? ceiling + Math.tanh(r - ceiling) * .04 : r < -.96 ? -.96 + Math.tanh(r + ceiling) * .04 : r;
	}
	fadeEdges(left, right, sr);
	let peak = 0;
	for (let i = 0; i < left.length; i++) peak = Math.max(peak, Math.abs(left[i] ?? 0), Math.abs(right[i] ?? 0));
	if (peak < .01 || !Number.isFinite(peak)) throw new Error("The mix rendered silent.");
	const norm = .89 / peak;
	for (let i = 0; i < left.length; i++) {
		left[i] = (left[i] ?? 0) * norm;
		right[i] = (right[i] ?? 0) * norm;
	}
}
function energyOf(buf) {
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
function copyStereo(left, right) {
	return {
		left: left.slice(),
		right: right.slice()
	};
}
function renderStems(plan, rig, clap, sampleRate = 44100) {
	const { sections, beat, bar, duration } = layout(plan.bpm);
	const n = Math.max(1, Math.ceil(duration * sampleRate));
	const drumsL = new Float32Array(n);
	const drumsR = new Float32Array(n);
	const bassL = new Float32Array(n);
	const bassR = new Float32Array(n);
	const chordL = new Float32Array(n);
	const chordR = new Float32Array(n);
	const kicks = [];
	const eighth = beat / 2;
	const prog = plan.minor || plan.dorian ? [
		0,
		5,
		3,
		4
	] : [
		0,
		4,
		5,
		3
	];
	const drumScale = plan.kind === "orchestral" ? .34 : plan.kind === "bedroom" ? .62 : 1;
	const hatScale = .5 + plan.density * .65;
	let barIndex = 0;
	for (const section of sections) {
		const chorus = section.name === "chorus";
		const quiet = section.name === "intro" || section.name === "outro";
		for (let step = 0; step < section.bars; step++) {
			const barStart = section.start + step * bar;
			const degree = prog[barIndex % prog.length] ?? 0;
			const level = quiet ? .48 : chorus ? 1 : .8;
			const salt = barIndex * 17 + 3;
			if (plan.kind === "orchestral") {
				if (!quiet) {
					shot(drumsL, drumsR, rig.drums.ride, barStart, .16 * level, .2, sampleRate);
					if (chorus) shot(drumsL, drumsR, rig.drums.kick, barStart, .28 * level, 0, sampleRate);
				} else if (step === 0) shot(drumsL, drumsR, rig.drums.open, barStart, .12, .05, sampleRate);
			} else {
				const hatSteps = plan.density > .7 && chorus && plan.kind === "electronic" ? 16 : 8;
				const stepDur = hatSteps === 16 ? beat / 4 : eighth;
				for (let i = 0; i < hatSteps; i++) {
					if (quiet && i % 2 === 1) continue;
					if (section.name === "outro" && step > 0 && i % 4 !== 0) continue;
					if (plan.kind === "bedroom" && i % 2 === 1 && plan.density < .45) continue;
					const swing = i % 2 === 1 ? plan.swing * stepDur * .5 : 0;
					const time = barStart + i * stepDur + swing + nudge(plan.seed, salt + i);
					const accent = i % (hatSteps / 2) === 0;
					shot(drumsL, drumsR, rig.drums.hat, time, (accent ? .15 : .08) * hatScale * level * drumScale, accent ? -.08 : -.24, sampleRate);
				}
				if (chorus && plan.kind !== "bedroom") {
					shot(drumsL, drumsR, rig.drums.open, barStart + eighth, .18 * level * drumScale, .26, sampleRate);
					shot(drumsL, drumsR, rig.drums.ride, barStart, .1 * level * drumScale, .34, sampleRate);
				}
				const fourOn = plan.kind === "electronic" && plan.energy >= 6 && !quiet && !plan.halfTime;
				const kickBeats = plan.halfTime ? [0] : fourOn ? [
					0,
					1,
					2,
					3
				] : quiet ? [0] : [0, 2];
				for (const beatIndex of kickBeats) {
					const time = barStart + beatIndex * beat;
					kicks.push(time);
					shot(drumsL, drumsR, rig.drums.kick, time, (plan.kind === "electronic" ? .82 : .74) * level * drumScale, 0, sampleRate);
				}
				const snareBeats = plan.halfTime ? [2] : quiet ? [] : [1, 3];
				for (const beatIndex of snareBeats) {
					const time = barStart + beatIndex * beat + nudge(plan.seed, salt + 40 + beatIndex);
					shot(drumsL, drumsR, rig.drums.snare, time, (plan.kind === "bedroom" ? .32 : .46) * level * drumScale, .1, sampleRate);
					if (clap && chorus) shot(drumsL, drumsR, rig.drums.clap, time, .2 * level, -.12, sampleRate);
				}
				if (plan.kind === "band" && chorus && step === section.bars - 1) {
					shot(drumsL, drumsR, rig.drums.tom, barStart + beat * 2.5, .32 * drumScale, -.18, sampleRate);
					shot(drumsL, drumsR, rig.drums.tom, barStart + beat * 3.25, .26 * drumScale, .14, sampleRate);
				}
			}
			const root = fold(midiAt(plan, degree) - 12, 28, 52);
			const fifth = fold(root + 7, 28, 52);
			const octave = fold(root + 12, 28, 52);
			const bassGain = (plan.kind === "orchestral" ? .34 : plan.kind === "electronic" ? .58 : .48) * level;
			const hits = [];
			if (quiet || plan.kind === "orchestral") hits.push({
				at: 0,
				midi: root,
				dur: bar * .92
			});
			else if (plan.kind === "electronic" && !plan.halfTime) {
				hits.push({
					at: 0,
					midi: root,
					dur: beat * .92
				});
				hits.push({
					at: beat,
					midi: root,
					dur: beat * .92
				});
				hits.push({
					at: beat * 2,
					midi: fifth,
					dur: beat * .92
				});
				hits.push({
					at: beat * 3,
					midi: chorus ? octave : root,
					dur: beat * .8
				});
			} else if (plan.halfTime) {
				hits.push({
					at: 0,
					midi: root,
					dur: beat * 1.8
				});
				hits.push({
					at: beat * 2,
					midi: fifth,
					dur: beat * 1.5
				});
			} else {
				hits.push({
					at: 0,
					midi: root,
					dur: beat * 1.35
				});
				hits.push({
					at: beat * 2,
					midi: chorus ? fifth : octave,
					dur: beat * 1.15
				});
			}
			for (const hit of hits) {
				const played = nearest(rig.bass.notes, hit.midi);
				place(bassL, bassR, played.pcm, barStart + hit.at, hit.dur, bassGain, played.rate, 0, sampleRate, rig.bass.attack, Math.min(rig.bass.release, hit.dur * .45));
			}
			const voices = chorus ? [
				0,
				2,
				4,
				6
			] : [
				0,
				2,
				4
			];
			const chordGain = (plan.kind === "orchestral" ? .2 : plan.kind === "electronic" ? .15 : .17) * level;
			const pans = [
				-.42,
				-.14,
				.16,
				.4
			];
			voices.forEach((interval, index) => {
				let note = midiAt(plan, degree + interval);
				note = fold(note, 52, 81);
				const played = nearest(rig.chords.notes, note);
				const time = barStart + nudge(plan.seed, salt + 80 + index);
				place(chordL, chordR, played.pcm, time, Math.min(bar * 1.08, duration - time), chordGain, played.rate, pans[index] ?? 0, sampleRate, rig.chords.attack, rig.chords.release);
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
	const room = plan.kind === "electronic" ? .16 : plan.kind === "orchestral" ? .4 : plan.kind === "bedroom" ? .3 : .22;
	smear(chordL, sampleRate, room);
	smear(chordR, sampleRate, room * .9);
	if (plan.kind === "electronic") {
		duck(chordL, chordR, kicks, beat, .52, sampleRate);
		duck(bassL, bassR, kicks, beat, .74, sampleRate);
	} else if (plan.kind === "band") duck(chordL, chordR, kicks, beat, .78, sampleRate);
	compress(drumsL, drumsR, sampleRate, .34, 2.4, 1.08, .006, .12);
	compress(bassL, bassR, sampleRate, .2, 3.6, 1.15, .012, .16);
	compress(chordL, chordR, sampleRate, .18, 2.2, 1.12, .02, .2);
	fadeEdges(drumsL, drumsR, sampleRate);
	fadeEdges(bassL, bassR, sampleRate);
	fadeEdges(chordL, chordR, sampleRate);
	if (energyOf(drumsL) < .008) throw new Error("The drum stem rendered silent.");
	if (energyOf(bassL) < .008) throw new Error("The bass stem rendered silent.");
	if (energyOf(chordL) < .008) throw new Error("The chord stem rendered silent.");
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
		mix: {
			left: mixL,
			right: mixR
		},
		duration: n / sampleRate
	};
}
var SAY = {
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
	fire: "fire"
};
var RIGS = [
	{
		family: "electronic",
		tags: ["dance", "machine"],
		named: ["808", "pad"],
		drums: "808",
		bass: "sub",
		chords: "pad",
		label: "808 drums · sub bass · warm pad",
		clap: true,
		energy: 8.5,
		minorBias: .4,
		bright: false
	},
	{
		family: "electronic",
		tags: ["dance", "night"],
		named: ["rhodes", "club"],
		drums: "club",
		bass: "synth",
		chords: "rhodes",
		label: "club drums · synth bass · rhodes",
		clap: true,
		energy: 7.5,
		minorBias: .2,
		bright: false
	},
	{
		family: "electronic",
		tags: ["dance", "machine"],
		named: ["clav", "clavinet"],
		drums: "haus",
		bass: "sub",
		chords: "clav",
		label: "haus drums · sub bass · clav",
		clap: true,
		energy: 8,
		minorBias: .1,
		bright: true
	},
	{
		family: "electronic",
		tags: ["dance", "night"],
		named: ["clean guitar"],
		drums: "tek",
		bass: "synth",
		chords: "clean",
		label: "tek drums · synth bass · clean guitar",
		clap: true,
		energy: 7,
		minorBias: 0,
		bright: true
	},
	{
		family: "electronic",
		tags: ["machine"],
		named: [
			"music box",
			"lullaby",
			"chip"
		],
		drums: "chip",
		bass: "synth",
		chords: "box",
		label: "chip drums · synth bass · music box",
		clap: false,
		energy: 6,
		minorBias: .3,
		bright: true
	},
	{
		family: "electronic",
		tags: ["hymn", "night"],
		named: ["organ"],
		drums: "vintage",
		bass: "synth",
		chords: "organ",
		label: "vintage drums · synth bass · organ",
		clap: true,
		energy: 5.5,
		minorBias: .5,
		bright: false
	},
	{
		family: "electronic",
		tags: ["dance", "love"],
		named: ["electric piano"],
		drums: "808",
		bass: "finger",
		chords: "wurli",
		label: "808 drums · finger bass · electric piano",
		clap: true,
		energy: 6,
		minorBias: -.1,
		bright: false
	},
	{
		family: "electronic",
		tags: ["dance"],
		named: ["clavinet"],
		drums: "boom",
		bass: "slap",
		chords: "clav",
		label: "boom drums · slap bass · clav",
		clap: true,
		energy: 9,
		minorBias: 0,
		bright: true
	},
	{
		family: "electronic",
		tags: ["fire", "dance"],
		named: ["driven guitar", "overdrive"],
		drums: "fat",
		bass: "synth",
		chords: "drive",
		label: "fat drums · synth bass · driven guitar",
		clap: true,
		energy: 8.2,
		minorBias: 0,
		bright: true
	},
	{
		family: "electronic",
		tags: ["dance", "machine"],
		named: ["polysynth"],
		drums: "heavy",
		bass: "sub",
		chords: "poly",
		label: "heavy drums · sub bass · polysynth",
		clap: true,
		energy: 8.8,
		minorBias: .2,
		bright: true
	},
	{
		family: "electronic",
		tags: ["machine"],
		named: [
			"glitch",
			"robot",
			"sweep"
		],
		drums: "glitch",
		bass: "synth",
		chords: "sweep",
		label: "glitch drums · synth bass · sweep pad",
		clap: false,
		energy: 6.4,
		minorBias: .5,
		bright: false
	},
	{
		family: "electronic",
		tags: ["quiet", "night"],
		named: ["celesta"],
		drums: "pure",
		bass: "finger",
		chords: "celesta",
		label: "pure drums · finger bass · celesta",
		clap: false,
		energy: 3.4,
		minorBias: .3,
		bright: true
	},
	{
		family: "electronic",
		tags: ["night", "jazz"],
		named: ["sax", "saxophone"],
		drums: "zum",
		bass: "slap2",
		chords: "sax",
		label: "zum drums · slap bass · tenor sax",
		clap: true,
		energy: 6.2,
		minorBias: .4,
		bright: false
	},
	{
		family: "electronic",
		tags: ["dance", "water"],
		named: ["sweep"],
		drums: "gas",
		bass: "synth",
		chords: "sweep",
		label: "gas drums · synth bass · sweep pad",
		clap: true,
		energy: 7.2,
		minorBias: .2,
		bright: false
	},
	{
		family: "electronic",
		tags: ["dance", "dust"],
		named: ["honky"],
		drums: "sone",
		bass: "sub",
		chords: "honky",
		label: "sone drums · sub bass · honky-tonk piano",
		clap: true,
		energy: 7.8,
		minorBias: 0,
		bright: true
	},
	{
		family: "electronic",
		tags: ["dance", "water"],
		named: ["marimba"],
		drums: "club",
		bass: "finger",
		chords: "marimba",
		label: "club drums · finger bass · marimba",
		clap: true,
		energy: 6.6,
		minorBias: .1,
		bright: true
	},
	{
		family: "band",
		tags: ["road"],
		named: ["steel guitar", "steel"],
		drums: "acoustic",
		bass: "finger",
		chords: "guitar",
		label: "acoustic drums · finger bass · steel guitar",
		clap: false,
		energy: 6,
		minorBias: .1,
		bright: true
	},
	{
		family: "band",
		tags: ["road", "love"],
		named: ["piano"],
		drums: "acoustic",
		bass: "pick",
		chords: "piano",
		label: "acoustic drums · picked bass · piano",
		clap: false,
		energy: 5.5,
		minorBias: -.2,
		bright: true
	},
	{
		family: "band",
		tags: ["road", "quiet"],
		named: ["nylon"],
		drums: "acoustic",
		bass: "upright",
		chords: "nylon",
		label: "acoustic drums · upright bass · nylon guitar",
		clap: false,
		energy: 4.5,
		minorBias: .2,
		bright: false
	},
	{
		family: "band",
		tags: [
			"night",
			"love",
			"jazz"
		],
		named: ["jazz"],
		drums: "room",
		bass: "upright",
		chords: "jazz",
		label: "room drums · upright bass · jazz guitar",
		clap: false,
		energy: 4,
		minorBias: .3,
		bright: false
	},
	{
		family: "band",
		tags: ["road", "dance"],
		named: ["clean guitar"],
		drums: "acoustic",
		bass: "slap",
		chords: "clean",
		label: "acoustic drums · slap bass · clean guitar",
		clap: false,
		energy: 7.5,
		minorBias: 0,
		bright: true
	},
	{
		family: "band",
		tags: ["hymn", "road"],
		named: ["organ"],
		drums: "room",
		bass: "fretless",
		chords: "organ",
		label: "room drums · fretless bass · organ",
		clap: false,
		energy: 4.5,
		minorBias: .4,
		bright: false
	},
	{
		family: "band",
		tags: ["dust"],
		named: ["harmonica"],
		drums: "acoustic",
		bass: "slap2",
		chords: "harmonica",
		label: "acoustic drums · slap bass · harmonica",
		clap: false,
		energy: 6.4,
		minorBias: .1,
		bright: true
	},
	{
		family: "band",
		tags: ["dust", "road"],
		named: ["accordion"],
		drums: "acoustic",
		bass: "finger",
		chords: "accordion",
		label: "acoustic drums · finger bass · accordion",
		clap: false,
		energy: 5.2,
		minorBias: 0,
		bright: true
	},
	{
		family: "band",
		tags: ["dust"],
		named: ["honky"],
		drums: "room",
		bass: "pick",
		chords: "honky",
		label: "room drums · picked bass · honky-tonk piano",
		clap: false,
		energy: 6.8,
		minorBias: 0,
		bright: true
	},
	{
		family: "band",
		tags: ["fire", "road"],
		named: ["driven guitar", "overdrive"],
		drums: "acoustic",
		bass: "finger",
		chords: "drive",
		label: "acoustic drums · finger bass · driven guitar",
		clap: false,
		energy: 8,
		minorBias: 0,
		bright: true
	},
	{
		family: "band",
		tags: ["jazz", "night"],
		named: ["sax", "saxophone"],
		drums: "room",
		bass: "upright",
		chords: "sax",
		label: "room drums · upright bass · tenor sax",
		clap: false,
		energy: 4.4,
		minorBias: .5,
		bright: false
	},
	{
		family: "band",
		tags: ["dance", "road"],
		named: ["rock organ"],
		drums: "room",
		bass: "finger",
		chords: "rock",
		label: "room drums · finger bass · rock organ",
		clap: false,
		energy: 7.2,
		minorBias: 0,
		bright: true
	},
	{
		family: "band",
		tags: ["jazz", "road"],
		named: ["brass"],
		drums: "acoustic",
		bass: "pick",
		chords: "brass",
		label: "acoustic drums · picked bass · brass",
		clap: false,
		energy: 6.6,
		minorBias: .1,
		bright: true
	},
	{
		family: "band",
		tags: ["water", "quiet"],
		named: ["flute"],
		drums: "room",
		bass: "upright",
		chords: "flute",
		label: "room drums · upright bass · flute",
		clap: false,
		energy: 3.8,
		minorBias: .2,
		bright: true
	},
	{
		family: "band",
		tags: ["water", "road"],
		named: ["tabla", "hand drum"],
		drums: "hand",
		bass: "fretless",
		chords: "nylon",
		label: "hand drums · fretless bass · nylon guitar",
		clap: false,
		energy: 4.2,
		minorBias: .2,
		bright: false
	},
	{
		family: "bedroom",
		tags: ["quiet", "night"],
		named: ["rhodes"],
		drums: "soft",
		bass: "finger",
		chords: "rhodes",
		label: "soft drums · finger bass · rhodes",
		clap: false,
		energy: 3.2,
		minorBias: .4,
		bright: false
	},
	{
		family: "bedroom",
		tags: ["quiet", "love"],
		named: ["piano"],
		drums: "soft",
		bass: "upright",
		chords: "piano",
		label: "soft drums · upright bass · piano",
		clap: false,
		energy: 3,
		minorBias: .2,
		bright: false
	},
	{
		family: "bedroom",
		tags: ["night"],
		named: ["electric piano"],
		drums: "room",
		bass: "finger",
		chords: "wurli",
		label: "room drums · finger bass · electric piano",
		clap: false,
		energy: 4,
		minorBias: .1,
		bright: false
	},
	{
		family: "bedroom",
		tags: ["quiet", "road"],
		named: ["nylon"],
		drums: "soft",
		bass: "fretless",
		chords: "nylon",
		label: "soft drums · fretless bass · nylon guitar",
		clap: false,
		energy: 3.4,
		minorBias: .3,
		bright: false
	},
	{
		family: "bedroom",
		tags: ["night", "quiet"],
		named: ["vibes", "vibraphone"],
		drums: "room",
		bass: "upright",
		chords: "vibes",
		label: "room drums · upright bass · vibes",
		clap: false,
		energy: 3.6,
		minorBias: .5,
		bright: true
	},
	{
		family: "bedroom",
		tags: ["love", "quiet"],
		named: ["music box", "lullaby"],
		drums: "soft",
		bass: "finger",
		chords: "box",
		label: "soft drums · finger bass · music box",
		clap: false,
		energy: 2.4,
		minorBias: .2,
		bright: true
	},
	{
		family: "bedroom",
		tags: ["water", "quiet"],
		named: ["marimba"],
		drums: "soft",
		bass: "upright",
		chords: "marimba",
		label: "soft drums · upright bass · marimba",
		clap: false,
		energy: 3.3,
		minorBias: .2,
		bright: true
	},
	{
		family: "bedroom",
		tags: ["love", "quiet"],
		named: ["celesta"],
		drums: "soft",
		bass: "finger",
		chords: "celesta",
		label: "soft drums · finger bass · celesta",
		clap: false,
		energy: 2.6,
		minorBias: .3,
		bright: true
	},
	{
		family: "bedroom",
		tags: ["water"],
		named: ["flute"],
		drums: "room",
		bass: "fretless",
		chords: "flute",
		label: "room drums · fretless bass · flute",
		clap: false,
		energy: 3.5,
		minorBias: .2,
		bright: true
	},
	{
		family: "bedroom",
		tags: ["water", "quiet"],
		named: ["pan flute"],
		drums: "soft",
		bass: "finger",
		chords: "pan",
		label: "soft drums · finger bass · pan flute",
		clap: false,
		energy: 2.8,
		minorBias: .3,
		bright: true
	},
	{
		family: "orchestral",
		tags: ["hymn", "quiet"],
		named: ["strings"],
		drums: "soft",
		bass: "upright",
		chords: "strings",
		label: "soft drums · upright bass · strings",
		clap: false,
		energy: 3.5,
		minorBias: .6,
		bright: false
	},
	{
		family: "orchestral",
		tags: ["hymn", "night"],
		named: ["tremolo"],
		drums: "room",
		bass: "upright",
		chords: "tremolo",
		label: "room drums · upright bass · tremolo strings",
		clap: false,
		energy: 4.2,
		minorBias: .7,
		bright: false
	},
	{
		family: "orchestral",
		tags: ["hymn", "quiet"],
		named: ["harp"],
		drums: "soft",
		bass: "fretless",
		chords: "harp",
		label: "soft drums · fretless bass · harp",
		clap: false,
		energy: 3,
		minorBias: .4,
		bright: true
	},
	{
		family: "orchestral",
		tags: ["road", "hymn"],
		named: ["pizzicato"],
		drums: "room",
		bass: "upright",
		chords: "pizz",
		label: "room drums · upright bass · pizzicato strings",
		clap: false,
		energy: 4.8,
		minorBias: .2,
		bright: true
	},
	{
		family: "orchestral",
		tags: ["hymn"],
		named: ["organ"],
		drums: "soft",
		bass: "upright",
		chords: "organ",
		label: "soft drums · upright bass · organ",
		clap: false,
		energy: 3.8,
		minorBias: .5,
		bright: false
	},
	{
		family: "orchestral",
		tags: ["hymn"],
		named: ["cello"],
		drums: "soft",
		bass: "bow",
		chords: "cello",
		label: "soft drums · bowed bass · cello",
		clap: false,
		energy: 3.6,
		minorBias: .6,
		bright: false
	},
	{
		family: "orchestral",
		tags: ["hymn"],
		named: ["choir"],
		drums: "room",
		bass: "bow",
		chords: "choir",
		label: "room drums · bowed bass · choir",
		clap: false,
		energy: 3.9,
		minorBias: .5,
		bright: false
	},
	{
		family: "orchestral",
		tags: ["hymn"],
		named: ["church", "organ"],
		drums: "soft",
		bass: "bow",
		chords: "church",
		label: "soft drums · bowed bass · church organ",
		clap: false,
		energy: 4,
		minorBias: .6,
		bright: false
	},
	{
		family: "orchestral",
		tags: ["hymn"],
		named: ["french horn", "horn"],
		drums: "room",
		bass: "upright",
		chords: "horn",
		label: "room drums · upright bass · horn",
		clap: false,
		energy: 4.4,
		minorBias: .4,
		bright: false
	},
	{
		family: "orchestral",
		tags: ["hymn", "night"],
		named: ["bells", "chimes"],
		drums: "soft",
		bass: "upright",
		chords: "bells",
		label: "soft drums · upright bass · bells",
		clap: false,
		energy: 3.7,
		minorBias: .3,
		bright: true
	},
	{
		family: "orchestral",
		tags: ["hymn", "jazz"],
		named: ["brass"],
		drums: "room",
		bass: "bow",
		chords: "brass",
		label: "room drums · bowed bass · brass",
		clap: false,
		energy: 5,
		minorBias: .2,
		bright: true
	},
	{
		family: "orchestral",
		tags: ["hymn", "machine"],
		named: ["strings"],
		drums: "soft",
		bass: "upright",
		chords: "synthstrings",
		label: "soft drums · upright bass · string section",
		clap: false,
		energy: 4.1,
		minorBias: .4,
		bright: false
	},
	{
		family: "orchestral",
		tags: ["water", "quiet"],
		named: ["pan flute", "tabla"],
		drums: "hand",
		bass: "bow",
		chords: "pan",
		label: "hand drums · bowed bass · pan flute",
		clap: false,
		energy: 3.2,
		minorBias: .3,
		bright: true
	}
];
function nameHits(lyrics, words) {
	if (!lyrics || words.length === 0) return 0;
	const lower = lyrics.toLowerCase();
	let hits = 0;
	for (const word of words) {
		const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		hits += lower.match(new RegExp(`\\b${escaped}\\b`, "g"))?.length ?? 0;
	}
	return hits;
}
function whyLine(rig, signals, lyrics) {
	const named = rig.named.filter((word) => nameHits(lyrics, [word]) > 0);
	if (named.length > 0) return `The lyric says ${named.slice(0, 2).join(" and ")}, so this trio.`;
	const tags = rig.tags.filter((tag) => (signals[tag] ?? 0) > 0).sort((a, b) => (signals[b] ?? 0) - (signals[a] ?? 0)).slice(0, 3).map((tag) => SAY[tag]);
	if (tags.length > 0) return `The lyric leans ${tags.join(" and ")}, so this trio.`;
	return "Nothing named a kit, so this follows the lyric’s pace.";
}
function chooseRig(plan, lyrics = "") {
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
			else words -= .5;
		}
		let fit = -Math.abs(plan.energy - rig.energy) * .55;
		fit += plan.minor ? rig.minorBias : -rig.minorBias * .6;
		if (plan.brightness >= .62 && rig.bright) fit += 1.4;
		if (plan.brightness < .4 && !rig.bright) fit += .8;
		fit += (plan.seed ^ rig.label.length * 17) % 5 * .01;
		if (words > bestWords || words === bestWords && fit > bestFit) {
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
		why: whyLine(winner, signals, lyrics)
	};
}
var VOICES = [
	"kick",
	"snare",
	"hat",
	"open",
	"clap",
	"tom",
	"ride"
];
var catalogPromise = null;
var rigCache = /* @__PURE__ */ new Map();
function peakNormalize(pcm, target = .86) {
	let peak = 0;
	for (let i = 0; i < pcm.length; i++) peak = Math.max(peak, Math.abs(pcm[i] ?? 0));
	if (peak < 8e-4) return pcm;
	const gain = target / peak;
	const out = new Float32Array(pcm.length);
	for (let i = 0; i < pcm.length; i++) out[i] = (pcm[i] ?? 0) * gain;
	return out;
}
function toMono441(buffer) {
	const srcRate = buffer.sampleRate;
	const left = buffer.getChannelData(0);
	const right = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : null;
	const length = Math.max(2, Math.min(132300, Math.round(left.length * 44100 / srcRate)));
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
		out[i] = (l + r) * .5;
	}
	return peakNormalize(out);
}
async function decode(ctx, url) {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`The sound library didn’t load (${url}).`);
	const encoded = await response.arrayBuffer();
	return toMono441(await ctx.decodeAudioData(encoded.slice(0)));
}
function loadCatalog() {
	if (!catalogPromise) catalogPromise = fetch("/library/catalog.json").then((response) => {
		if (!response.ok) throw new Error("The sound library catalog is missing.");
		return response.json();
	}).catch((err) => {
		catalogPromise = null;
		throw err;
	});
	return catalogPromise;
}
async function loadNotes(ctx, notes) {
	return (await Promise.all(notes.map(async (note) => ({
		midi: note.midi,
		pcm: await decode(ctx, note.url)
	})))).sort((a, b) => a.midi - b.midi);
}
function loadRig(choice) {
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
					return [voice, await decode(ctx, url)];
				})),
				loadNotes(ctx, bass.notes),
				loadNotes(ctx, chords.notes)
			]);
			return {
				drums: Object.fromEntries(voices),
				bass: {
					notes: bassNotes,
					attack: .01,
					release: .09,
					lowpass: bass.lowpass
				},
				chords: {
					notes: chordNotes,
					attack: chords.attack,
					release: chords.release,
					highpass: chords.highpass
				}
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
function toBuffer(stereo) {
	const buffer = new AudioBuffer({
		length: stereo.left.length,
		numberOfChannels: 2,
		sampleRate: 44100
	});
	buffer.copyToChannel(new Float32Array(stereo.left), 0);
	buffer.copyToChannel(new Float32Array(stereo.right), 1);
	return buffer;
}
async function renderMix(plan, lyrics = "") {
	const choice = chooseRig(plan, lyrics);
	const rendered = renderStems(plan, await loadRig(choice), choice.clap, 44100);
	return {
		mix: toBuffer(rendered.mix),
		drums: toBuffer(rendered.drums),
		bass: toBuffer(rendered.bass),
		chords: toBuffer(rendered.chords),
		label: choice.label
	};
}
function audioBufferToWav(buffer) {
	const channels = buffer.numberOfChannels;
	const rate = buffer.sampleRate;
	const samples = buffer.length;
	const blockAlign = channels * 2;
	const dataSize = samples * blockAlign;
	const array = new ArrayBuffer(44 + dataSize);
	const view = new DataView(array);
	const write = (offset, text) => {
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
	for (let i = 0; i < samples; i++) for (let channel = 0; channel < channels; channel++) {
		const sample = Math.max(-1, Math.min(1, planes[channel]?.[i] ?? 0));
		view.setInt16(offset, sample < 0 ? sample * 32768 : sample * 32767, true);
		offset += 2;
	}
	return new Blob([array], { type: "audio/wav" });
}
function clock(seconds) {
	if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
	const whole = Math.floor(seconds);
	return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}
function fileSlug(title) {
	return title.toLowerCase().replace(/['"]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "demo";
}
function MixPlayer({ lyrics, title, scale, brief, canPlay }) {
	const [phase, setPhase] = (0, import_react.useState)("idle");
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [time, setTime] = (0, import_react.useState)(0);
	const [duration, setDuration] = (0, import_react.useState)(0);
	const [note, setNote] = (0, import_react.useState)(null);
	const audioRef = (0, import_react.useRef)(null);
	const stemsRef = (0, import_react.useRef)(null);
	const urlRef = (0, import_react.useRef)(null);
	const signatureRef = (0, import_react.useRef)("");
	const tokenRef = (0, import_react.useRef)(0);
	const plan = canPlay ? planMix({
		lyrics,
		title,
		scale,
		brief
	}) : null;
	const rig = plan ? chooseRig(plan, lyrics) : null;
	const signature = plan ? `${plan.bpm}|${plan.root}|${plan.minor}|${plan.dorian}|${plan.kind}|${plan.energy}|${plan.swing}|${plan.density}|${plan.seed}|${lyrics}` : "";
	(0, import_react.useEffect)(() => {
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
	(0, import_react.useEffect)(() => {
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
				chords: audioBufferToWav(rendered.chords)
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
	function onDownload(part) {
		const blob = stemsRef.current?.[part];
		if (!blob || !plan) return;
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `booth-${part}-${fileSlug(plan.title)}.wav`;
		link.click();
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper shadow-[0_-10px_28px_rgba(23,21,18,0.08)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-3 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row sm:items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "tap inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-oxide px-5 text-base font-medium text-oxide-ink disabled:opacity-60 sm:w-auto sm:min-w-52",
							disabled: !canPlay || phase === "mixing",
							onClick: () => void onPlay(),
							children: [playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {
								className: "size-4",
								"aria-hidden": "true"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
								className: "size-4",
								"aria-hidden": "true"
							}), phase === "mixing" ? "Mixing…" : playing ? "Pause" : brief ? "Play this sheet" : "Play the mix"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm text-ink",
									children: plan && rig ? `${plan.keyName} · ${plan.bpm} bpm · ${rig.label}` : "Twelve words, then this can play."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-muted",
									children: plan && rig ? rig.why : "The song is this bar, not the sheet."
								}),
								duration > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: 0,
										max: duration,
										step: .1,
										value: Math.min(time, duration),
										"aria-label": "Mix position",
										className: "w-full accent-oxide",
										onChange: (event) => {
											const next = Number(event.target.value);
											const audio = audioRef.current;
											if (!audio) return;
											audio.currentTime = next;
											setTime(next);
										}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "shrink-0 text-xs text-muted tabular-nums",
										children: [
											clock(time),
											" / ",
											clock(duration)
										]
									})]
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "tap inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink px-5 text-sm font-medium text-ink disabled:opacity-60",
							disabled: phase !== "ready",
							onClick: () => onDownload("mix"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
								className: "size-4",
								"aria-hidden": "true"
							}), "Mix"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-wrap items-center gap-2",
					children: [[
						"drums",
						"bass",
						"chords"
					].map((part) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "tap inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-3 text-sm text-ink disabled:opacity-60",
						disabled: phase !== "ready",
						onClick: () => onDownload(part),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
							className: "size-3.5",
							"aria-hidden": "true"
						}), part === "drums" ? "Drums" : part === "bass" ? "Bass" : "Chords"]
					}, part)), phase === "mixing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "meter min-w-32 flex-1",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Three stems, then a limited mix of just those."
					})]
				}),
				note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-ink",
					role: "alert",
					children: note
				}) : null
			]
		})
	});
}
var useBooth = create()(persist((set) => ({
	title: "",
	lyrics: "",
	vocal: "decide",
	scale: "decide",
	shelf: [],
	activeId: null,
	setTitle: (title) => set({ title }),
	setLyrics: (lyrics) => set({ lyrics }),
	setVocal: (vocal) => set({ vocal }),
	setScale: (scale) => set({ scale }),
	pushSession: (brief) => set((state) => {
		const title = state.title.trim();
		const lyrics = state.lyrics.trim();
		const session = {
			id: crypto.randomUUID(),
			savedAt: Date.now(),
			title,
			lyrics,
			vocal: state.vocal,
			scale: state.scale,
			brief: title ? {
				...brief,
				workingTitle: title
			} : brief
		};
		return {
			shelf: [session, ...state.shelf.filter((item) => !(item.lyrics === lyrics && item.vocal === state.vocal && item.scale === state.scale && item.title === title))].slice(0, 12),
			activeId: session.id
		};
	}),
	openSession: (id) => set((state) => {
		const session = state.shelf.find((item) => item.id === id);
		if (!session) return state;
		return {
			activeId: session.id,
			title: session.title,
			lyrics: session.lyrics,
			vocal: session.vocal,
			scale: session.scale
		};
	}),
	removeSession: (id) => set((state) => ({
		shelf: state.shelf.filter((item) => item.id !== id),
		activeId: state.activeId === id ? null : state.activeId
	})),
	loadSample: (sample) => set({
		title: sample.title,
		lyrics: sample.lyrics,
		vocal: sample.vocal,
		scale: sample.scale,
		activeId: null
	}),
	clearPage: () => set({
		title: "",
		lyrics: "",
		vocal: "decide",
		scale: "decide",
		activeId: null
	})
}), {
	name: "booth-desk-v1",
	skipHydration: true,
	storage: createJSONStorage(() => localStorage),
	partialize: (state) => ({
		title: state.title,
		lyrics: state.lyrics,
		vocal: state.vocal,
		scale: state.scale,
		shelf: state.shelf,
		activeId: state.activeId
	})
}));
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function wordCount(text) {
	return text.split(/\s+/).filter(Boolean).length;
}
var directSession = createServerFn({ method: "POST" }).validator((input) => {
	const parsed = inputSchema.safeParse(input);
	if (!parsed.success) throw new Error("That page can’t be directed yet. Check the lyric and the title length.");
	const words = wordCount(parsed.data.lyrics);
	if (words < 12) throw new Error("Give it a few more lines. Twelve words is the floor.");
	if (words > 1200) throw new Error("That lyric is too long for one session. Direct a piece of it.");
	return parsed.data;
}).handler(createSsrRpc("adebab545588733e3c242d997c2c5a371e1ff24cd9f42b2aa0edd0521ae93cae"));
function cx(...parts) {
	return parts.filter(Boolean).join(" ");
}
function errorText(err) {
	const cleaned = (err instanceof Error ? err.message : typeof err === "object" && err && "message" in err && typeof err.message === "string" ? err.message : "").replace(/^Server function error:\s*/i, "").trim();
	if (!cleaned || cleaned.length > 240) return "The session didn’t go through. Try directing again.";
	return cleaned;
}
function when(ts) {
	const mins = Math.round((Date.now() - ts) / 6e4);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hours = Math.round(mins / 60);
	if (hours < 24) return `${hours}h ago`;
	return `${Math.round(hours / 24)}d ago`;
}
function BoothApp() {
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
	const [phase, setPhase] = (0, import_react.useState)("idle");
	const [error, setError] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const boardRef = (0, import_react.useRef)(null);
	const scrollAfter = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		useBooth.persist.rehydrate();
	}, []);
	const active = shelf.find((session) => session.id === activeId) ?? null;
	const notes = readLyric(lyrics);
	const stale = active !== null && (active.lyrics !== lyrics.trim() || active.title !== title.trim() || active.vocal !== vocal || active.scale !== scale);
	(0, import_react.useEffect)(() => {
		if (!scrollAfter.current || phase !== "idle" || !active) return;
		scrollAfter.current = false;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		boardRef.current?.scrollIntoView({
			behavior: reduce ? "auto" : "smooth",
			block: "start"
		});
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
			const result = await direct({ data: {
				title: title.trim(),
				lyrics: lyrics.trim(),
				vocal,
				scale
			} });
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh pb-72 sm:pb-52",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-line",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 lg:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-11 place-items-center rounded-full border border-ink",
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-3 rounded-full bg-oxide" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl leading-none text-ink",
							children: "Booth"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "A production desk for lyrics"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-right text-sm text-muted",
						children: "Stays on this device"
					})]
				})
			}),
			shelf.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-line",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4 py-3 lg:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs font-medium uppercase tracking-wide text-muted",
						children: "Shelf"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2 overflow-x-auto pb-1",
						children: shelf.map((session) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cx("flex shrink-0 overflow-hidden rounded-2xl border bg-paper", session.id === activeId ? "border-ink" : "border-line"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "tap min-h-11 max-w-52 px-3 py-2 text-left",
								onClick: () => {
									setError(null);
									openSession(session.id);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-sm font-medium text-ink",
									children: session.brief.workingTitle
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block truncate text-xs text-muted",
									children: [
										session.brief.genre.primary,
										" · ",
										when(session.savedAt)
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "tap grid min-h-11 min-w-11 place-items-center border-l border-line text-muted",
								"aria-label": `Remove ${session.brief.workingTitle} from the shelf`,
								onClick: () => removeSession(session.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
									className: "size-4",
									"aria-hidden": "true"
								})
							})]
						}, session.id))
					})]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-2 lg:items-start lg:gap-8 lg:px-8 lg:py-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "min-w-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: (event) => {
							event.preventDefault();
							onDirect();
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "desk-card rounded-2xl border border-line bg-paper px-4 py-4 sm:px-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "song-title",
										className: "text-xs font-medium uppercase tracking-wide text-muted",
										children: "Song title"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "song-title",
										value: title,
										onChange: (event) => setTitle(event.target.value),
										maxLength: 80,
										placeholder: "Untitled, until the lyric names it",
										className: "mt-1 w-full bg-transparent font-display text-2xl text-ink outline-none placeholder:text-muted sm:text-3xl",
										autoComplete: "off"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "lyric",
										className: "mt-4 block text-xs font-medium uppercase tracking-wide text-muted",
										children: "Lyric"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										id: "lyric",
										className: "lyric-sheet mt-2",
										value: lyrics,
										onChange: (event) => setLyrics(event.target.value),
										placeholder: "Paste the lyric. Label a chorus if you already know it.",
										spellCheck: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-3 text-sm text-muted tabular-nums",
										children: [notes.wordCount === 0 ? "Empty page" : `${notes.wordCount} words · ${notes.lineCount} lines · ~${notes.avgWords} a line`, notes.hookCount > 1 ? ` · hook ×${notes.hookCount}` : ""]
									}),
									notes.labels.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-ink-soft",
										children: notes.labels.join("  ·  ")
									}) : null
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceRow, {
								legend: "Vocal",
								value: vocal,
								options: VOCAL_OPTIONS,
								onChange: setVocal
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceRow, {
								legend: "Scale",
								value: scale,
								options: SCALE_OPTIONS,
								onChange: setScale
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex flex-col gap-3 sm:flex-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "tap min-h-12 flex-1 rounded-full border border-ink bg-paper px-5 text-sm font-medium text-ink disabled:opacity-60",
									disabled: phase === "loading",
									children: phase === "loading" ? "Writing…" : active ? "Update the sheet" : "Write the sheet"
								}), lyrics.trim() || title.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "tap min-h-12 rounded-full border border-line bg-paper px-5 text-sm font-medium text-ink",
									onClick: () => {
										setError(null);
										clearPage();
									},
									children: "New page"
								}) : null]
							}),
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-ink",
								role: "alert",
								children: error
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase tracking-wide text-muted",
									children: "Or start from a page"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 flex flex-wrap gap-2",
									children: SAMPLES.map((sample) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "tap min-h-11 rounded-full border border-line bg-paper px-3 text-sm text-ink-soft",
										onClick: () => {
											setError(null);
											loadSample(sample);
										},
										children: sample.label
									}, sample.id))
								})]
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					ref: boardRef,
					className: "min-w-0 scroll-mt-6",
					"aria-live": "polite",
					children: phase === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-console px-5 py-8 text-console-fg sm:px-7",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-wide text-console-muted",
								children: "Board"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-3xl",
								children: "Writing the sheet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 max-w-prose text-sm leading-relaxed text-console-muted",
								children: "This is the written plan, not the song. Play the mix on the bar at the bottom — that one makes the audio."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "meter mt-6",
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
							})
						]
					}) : active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-2xl bg-console px-5 py-6 text-console-fg sm:px-7 sm:py-7",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rise-item flex flex-wrap items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-medium uppercase tracking-wide text-console-muted",
										children: "Session sheet"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-2 font-display text-3xl leading-tight sm:text-4xl",
										children: active.brief.workingTitle
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "tap inline-flex min-h-11 items-center gap-2 rounded-full border border-console-line px-3 text-sm",
										onClick: () => void onCopy(),
										children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
											className: "size-4",
											"aria-hidden": "true"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
											className: "size-4",
											"aria-hidden": "true"
										}), copied ? "Copied" : "Copy"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "tap inline-flex min-h-11 items-center gap-2 rounded-full border border-console-line px-3 text-sm",
										onClick: onDownload,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
											className: "size-4",
											"aria-hidden": "true"
										}), "Sheet"]
									})]
								})]
							}),
							stale ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "rise-item mt-4 text-sm text-console-muted",
								children: "The page changed after this brief. Direct again to update it."
							}) : null,
							!title.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "tap mt-4 min-h-11 rounded-full border border-console-line px-4 text-sm text-console-fg",
								onClick: () => setTitle(active.brief.workingTitle),
								children: "Use this title on the page"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "rise-item mt-5 max-w-prose font-display text-xl leading-snug text-console-fg",
								children: active.brief.thesis
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rise-item mt-5 flex flex-wrap items-center gap-2",
								children: [active.brief.moods.map((mood) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full border border-console-line px-3 py-1 text-xs text-console-muted",
									children: mood
								}, mood)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-1 text-xs uppercase tracking-wide text-console-muted tabular-nums",
									children: [
										"Energy ",
										active.brief.energy,
										"/10"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex gap-1",
								"aria-hidden": "true",
								children: Array.from({ length: 10 }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cx("h-2 flex-1 rounded-full", index < active.brief.energy ? "bg-oxide" : "bg-console-line") }, index))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rise-item mt-6 grid gap-3 sm:grid-cols-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
										label: "Genre",
										value: active.brief.genre.primary,
										note: active.brief.genre.alternates.join(" · ")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
										label: "Tempo",
										value: `${active.brief.tempo.bpmLow}–${active.brief.tempo.bpmHigh}`,
										note: active.brief.tempo.feel
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
										label: "Key",
										value: active.brief.harmonyKey.suggestion,
										note: active.brief.harmonyKey.bed
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rise-item mt-6 rounded-2xl bg-console-2 px-4 py-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase tracking-wide text-console-muted",
									children: "Form"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-console-fg",
									children: active.brief.form
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rise-item mt-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
										label: "Why this genre",
										body: active.brief.genre.why
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
										label: "Why this tempo",
										body: active.brief.tempo.why
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
										label: "Why this key",
										body: active.brief.harmonyKey.why
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
										label: "Vocal",
										body: active.brief.vocal.delivery
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "border-t border-console-line py-4 text-sm leading-relaxed text-console-muted",
										children: active.brief.vocal.stack
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "flex flex-wrap gap-2 pb-4",
										children: active.brief.vocal.processing.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
											className: "rounded-full border border-console-line px-3 py-1 text-xs text-console-muted",
											children: item
										}, item))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
										label: "Drums",
										body: active.brief.rhythm.approach
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "flex flex-wrap gap-2 pb-2",
										children: active.brief.rhythm.palette.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
											className: "rounded-full border border-console-line px-3 py-1 text-xs text-console-muted",
											children: item
										}, item))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
										label: "Bass",
										body: active.brief.bass
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
										label: "Room",
										body: active.brief.space.room
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
										label: "Width",
										body: active.brief.space.width
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
										label: "Dynamics",
										body: active.brief.space.dynamics
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rise-item mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xs font-medium uppercase tracking-wide text-console-muted",
									children: "Arrangement"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
									className: "mt-4 border-l border-console-line",
									children: active.brief.arrangement.map((section, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "relative pb-5 pl-5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1.5 -left-1 size-2 rounded-full bg-oxide" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-sm font-medium text-console-fg",
												children: [section.section, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "ml-2 font-normal text-console-muted",
													children: section.length
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-1 font-display text-base italic text-console-fg",
												children: [
													"“",
													section.cue,
													"”"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-sm leading-relaxed text-console-muted",
												children: section.direction
											})
										]
									}, `${section.section}-${index}`))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rise-item mt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xs font-medium uppercase tracking-wide text-console-muted",
									children: "First hour"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
									className: "mt-3",
									children: active.brief.moves.map((move, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "border-t border-console-line py-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm font-medium text-console-fg",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "mr-2 tabular-nums text-console-muted",
												children: ["0", index + 1]
											}), move.title]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm leading-relaxed text-console-muted",
											children: move.detail
										})]
									}, move.title))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rise-item mt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xs font-medium uppercase tracking-wide text-console-muted",
									children: "Leave out"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-3",
									children: active.brief.avoid.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
										className: "border-t border-console-line py-3 text-sm leading-relaxed text-console-fg",
										children: item
									}, item))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rise-item mt-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-xs font-medium uppercase tracking-wide text-console-muted",
										children: "Neighborhood"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-console-muted",
										children: "Texture, not a copy."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-3",
										children: active.brief.references.map((ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "border-t border-console-line py-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-medium text-console-fg",
												children: ref.anchor
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-sm leading-relaxed text-console-muted",
												children: ref.why
											})]
										}, ref.anchor))
									})
								]
							})
						]
					}, active.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-console px-5 py-8 text-console-fg sm:px-7",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-wide text-console-muted",
								children: "Board"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-3xl",
								children: "The board is clear"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 max-w-prose text-sm leading-relaxed text-console-muted",
								children: "Paste a lyric and press Play the mix on the bar at the bottom. The words pick drums, bass, and chords. You get those three stems and a limited stereo mix of just them. Write the sheet when you want the production notes."
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MixPlayer, {
				lyrics,
				title,
				scale,
				brief: active && !stale ? active.brief : null,
				canPlay: notes.wordCount >= 12
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mx-auto max-w-6xl px-4 pb-8 text-sm leading-relaxed text-muted lg:px-8",
				children: "The words in the lyric pick the drums, bass, and chords. The bar plays those three stems, then a limited mix of just them. Download the mix or each stem after it renders. Briefs stay in this browser. On a phone, install Booth from the browser menu (Install app or Add to Home Screen). A separate Android APK isn’t part of this build."
			})
		]
	});
}
function ChoiceRow({ legend, value, options, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
		className: "mt-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
			className: "text-xs font-medium uppercase tracking-wide text-muted",
			children: legend
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 flex flex-wrap gap-2",
			children: options.map((option) => {
				const on = option.id === value;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": on,
					className: cx("tap min-h-11 rounded-full border px-3 text-sm", on ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink-soft"),
					onClick: () => onChange(option.id),
					children: option.label
				}, option.id);
			})
		})]
	});
}
function Fact({ label, value, note }) {
	const compact = value.length > 22;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-console-2 px-4 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wide text-console-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx("mt-1 font-display leading-tight text-console-fg", compact ? "text-lg" : "text-2xl tabular-nums"),
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs leading-relaxed text-console-muted",
				children: note
			})
		]
	});
}
function Note({ label, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-t border-console-line py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium uppercase tracking-wide text-console-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm leading-relaxed text-console-fg",
			children: body
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoothApp, {});
}
//#endregion
export { Home as component };
