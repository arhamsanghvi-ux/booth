import assert from "node:assert/strict";
import test from "node:test";
import { planMix } from "./mix-plan.ts";
import { chooseRig } from "./rigs.ts";

const kettle = `The kettle clicks off and nobody moves
I am learning the quiet
The way a room keeps a voice
Streetlight on the linoleum`;

const nightOut = `Neon is chewing the rain
Turn it up till the mirror forgets my name
Till the bass is a hand
I dance like a secret in the crowd
A stamp on my wrist`;

const highway = `County line and the tires are sore
The radio's preaching
Mama said the town gets smaller
Where the gravel starts telling the truth
Take me where the map gives up`;

const hymn = `The choir held the hymn in the church
A prayer under heaven and an organ in the rain
The choir held the hymn again`;

const porch = `Whiskey on the porch and dust on my boots
Harmonica in the pickup
Diesel and dirt till the town gives out
Mama left the barn light on`;

const robot = `The robot coughs static
A glitch in the machine
Wire on the screen
The circuit keeps the error`;

test("quiet lyric picks a soft close trio", () => {
  const plan = planMix({ lyrics: kettle, title: "Kettle", scale: "decide", brief: null });
  const rig = chooseRig(plan, kettle);
  assert.equal(plan.kind, "bedroom");
  assert.ok(rig.drums === "soft" || rig.drums === "room", rig.label);
  assert.match(rig.label, /rhodes|piano|nylon|vibes|music box|marimba|flute|celesta|pan flute/);
  assert.match(rig.why, /quiet|night/);
});

test("dance lyric picks an electronic kit", () => {
  const plan = planMix({ lyrics: nightOut, title: "Receipt", scale: "decide", brief: null });
  const rig = chooseRig(plan, nightOut);
  assert.equal(plan.kind, "electronic");
  assert.ok(!["soft", "acoustic", "room", "hand"].includes(rig.drums), rig.label);
});

test("road lyric picks a band guitar or piano", () => {
  const plan = planMix({ lyrics: highway, title: "County", scale: "decide", brief: null });
  const rig = chooseRig(plan, highway);
  assert.equal(plan.kind, "band");
  assert.match(rig.label, /guitar|piano/);
  assert.ok(rig.drums === "acoustic" || rig.drums === "room" || rig.drums === "hand", rig.label);
});

test("hymn lyric picks choir, organ, strings, or harp", () => {
  const plan = planMix({ lyrics: hymn, title: "Hymn", scale: "decide", brief: null });
  const rig = chooseRig(plan, hymn);
  assert.equal(plan.kind, "orchestral");
  assert.match(rig.label, /string|harp|organ|choir|cello|horn|bell/);
  assert.match(rig.why, /choir|organ|church|hymn/);
});

test("an explicit scale stays in that family", () => {
  const plan = planMix({ lyrics: kettle, title: "Kettle", scale: "electronic", brief: null });
  const rig = chooseRig(plan, kettle);
  assert.equal(plan.kind, "electronic");
  assert.ok(!["soft", "acoustic", "room", "hand"].includes(rig.drums), rig.label);
});

test("a named instrument in the lyric wins", () => {
  const plan = planMix({ lyrics: porch, title: "Porch", scale: "decide", brief: null });
  const rig = chooseRig(plan, porch);
  assert.equal(plan.kind, "band");
  assert.match(rig.label, /harmonica/);
  assert.match(rig.why, /harmonica/);
});

test("machine words pick the glitch kit", () => {
  const plan = planMix({ lyrics: robot, title: "Robot", scale: "decide", brief: null });
  const rig = chooseRig(plan, robot);
  assert.equal(plan.kind, "electronic");
  assert.equal(rig.drums, "glitch");
  assert.match(rig.why, /glitch|robot/);
});
