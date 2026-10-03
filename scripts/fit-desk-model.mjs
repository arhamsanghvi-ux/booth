// Least-squares fit for Booth's lyric pocket. Features are normalized the same
// way as src/lib/desk-model.ts. Targets: bpm, energy, minor, density, swing, brightness.

function row(words, avg, hooks, sections, q, shout, uniq, bpm, energy, minor, dens, swing, bright) {
  return {
    x: [1, words / 160, avg / 10, hooks / 3, sections / 3, q, shout, uniq],
    y: [bpm, energy, minor, dens, swing, bright],
  };
}

const data = [
  // long quiet pages — length must not force a fast tempo
  row(160, 8, 2, 4, 0, 0, 0.68, 72, 3, 0.82, 0.18, 0.1, 0.28),
  row(180, 9, 2, 3, 0.1, 0, 0.74, 76, 3.2, 0.78, 0.2, 0.14, 0.3),
  row(150, 7.5, 2, 4, 0, 0, 0.62, 70, 2.8, 0.86, 0.16, 0.08, 0.26),
  row(200, 10, 1, 3, 0.15, 0, 0.8, 80, 3.5, 0.7, 0.22, 0.2, 0.34),
  row(140, 8.5, 2, 2, 0.2, 0, 0.76, 78, 3.4, 0.74, 0.2, 0.16, 0.32),
  // short quiet
  row(36, 5, 1, 1, 0, 0, 0.9, 66, 2.2, 0.88, 0.1, 0.04, 0.2),
  row(48, 6, 2, 2, 0.2, 0, 0.84, 74, 3, 0.8, 0.16, 0.08, 0.26),
  row(28, 4.5, 0, 0, 0, 0, 0.95, 64, 2, 0.84, 0.08, 0, 0.18),
  // long and loud — short lines, hooks, shouts
  row(170, 5.2, 4, 4, 0, 0.3, 0.4, 126, 8.6, 0.38, 0.9, 0.06, 0.86),
  row(190, 4.8, 4, 4, 0, 0.4, 0.36, 132, 9, 0.42, 0.94, 0.04, 0.9),
  row(150, 5.5, 3, 4, 0, 0.22, 0.44, 120, 8, 0.36, 0.84, 0.08, 0.8),
  row(210, 5, 4, 5, 0, 0.45, 0.34, 134, 9.2, 0.4, 0.96, 0.03, 0.92),
  // short and loud
  row(40, 4, 3, 2, 0, 0.45, 0.5, 128, 8.4, 0.34, 0.88, 0.05, 0.84),
  row(55, 4.5, 3, 2, 0, 0.35, 0.48, 122, 8, 0.4, 0.8, 0.08, 0.78),
  // mid narrative / band
  row(100, 9, 2, 3, 0.05, 0, 0.7, 94, 5, 0.28, 0.4, 0.4, 0.5),
  row(120, 10, 2, 3, 0, 0.02, 0.72, 96, 5.2, 0.24, 0.42, 0.42, 0.52),
  row(90, 11, 1, 2, 0.1, 0, 0.78, 88, 4.4, 0.32, 0.32, 0.38, 0.44),
  row(130, 12, 2, 3, 0.05, 0.04, 0.66, 98, 5.4, 0.26, 0.45, 0.36, 0.54),
  // questions, still
  row(70, 11, 1, 2, 0.5, 0, 0.82, 76, 3.2, 0.76, 0.18, 0.1, 0.3),
  row(60, 9, 1, 1, 0.4, 0, 0.86, 74, 3, 0.8, 0.16, 0.08, 0.28),
  // hooky midtempo
  row(110, 7, 3, 3, 0, 0.08, 0.55, 108, 6.4, 0.4, 0.62, 0.18, 0.66),
  row(95, 6.5, 3, 3, 0, 0.1, 0.52, 112, 6.8, 0.42, 0.66, 0.16, 0.7),
  row(125, 7, 2, 3, 0.05, 0.06, 0.58, 104, 6, 0.36, 0.55, 0.2, 0.6),
  // rap-leaning: short lines, dense, some shout
  row(180, 4.2, 4, 3, 0, 0.28, 0.38, 138, 7.6, 0.58, 0.78, 0.1, 0.64),
  row(160, 4, 3, 3, 0, 0.2, 0.42, 140, 7.4, 0.55, 0.74, 0.12, 0.6),
  // bright pop, not a club peak
  row(100, 6, 2, 3, 0, 0.05, 0.6, 102, 6.2, 0.22, 0.58, 0.14, 0.74),
  row(80, 6.5, 2, 2, 0, 0, 0.64, 98, 5.6, 0.3, 0.5, 0.18, 0.68),
  // sparse oddities so shout and line length can move without word count
  row(100, 5, 1, 1, 0, 0.5, 0.5, 118, 7.5, 0.48, 0.7, 0.06, 0.76),
  row(100, 12, 1, 1, 0, 0, 0.8, 84, 3.8, 0.55, 0.24, 0.34, 0.36),
  row(100, 7, 4, 1, 0, 0, 0.6, 110, 6.5, 0.45, 0.6, 0.12, 0.62),
  row(100, 7, 0, 4, 0, 0, 0.6, 92, 4.8, 0.5, 0.4, 0.22, 0.48),
  row(100, 7, 1, 1, 0.6, 0, 0.6, 82, 3.6, 0.72, 0.22, 0.1, 0.34),
];

function matMul(a, b) {
  const out = Array.from({ length: a.length }, () => Array(b[0].length).fill(0));
  for (let i = 0; i < a.length; i++) {
    for (let k = 0; k < b.length; k++) {
      for (let j = 0; j < b[0].length; j++) out[i][j] += a[i][k] * b[k][j];
    }
  }
  return out;
}

function transpose(a) {
  return a[0].map((_, j) => a.map((row) => row[j]));
}

function invert(matrix) {
  const n = matrix.length;
  const m = matrix.map((row, i) => {
    const next = row.slice();
    next.push(...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
    return next;
  });
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(m[r][col]) > Math.abs(m[pivot][col])) pivot = r;
    }
    if (Math.abs(m[pivot][col]) < 1e-10) throw new Error("singular");
    [m[col], m[pivot]] = [m[pivot], m[col]];
    const div = m[col][col];
    for (let j = 0; j < m[col].length; j++) m[col][j] /= div;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = m[r][col];
      for (let j = 0; j < m[r].length; j++) m[r][j] -= f * m[col][j];
    }
  }
  return m.map((row) => row.slice(n));
}

const X = data.map((d) => d.x);
const Y = data.map((d) => d.y);
const Xt = transpose(X);
const XtX = matMul(Xt, X);
for (let i = 0; i < XtX.length; i++) XtX[i][i] += 0.08;
const W = matMul(invert(XtX), matMul(Xt, Y));
const weights = transpose(W);

function predict(x) {
  return weights.map((w) => w.reduce((sum, wi, i) => sum + wi * x[i], 0));
}

let sse = 0;
let sst = 0;
const mean = Y[0].map((_, t) => Y.reduce((s, y) => s + y[t], 0) / Y.length);
for (const d of data) {
  const yhat = predict(d.x);
  d.y.forEach((y, t) => {
    sse += (y - yhat[t]) ** 2;
    sst += (y - mean[t]) ** 2;
  });
}

const kettle = predict([1, 166 / 160, 7.5 / 10, 2 / 3, 4 / 3, 0, 0, 0.62]);
const club = predict([1, 170 / 160, 5.5 / 10, 1, 4 / 3, 0, 0.25, 0.42]);
console.log(JSON.stringify({ r2: 1 - sse / sst, kettle, club, weights }, null, 2));
