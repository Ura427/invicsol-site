import fs from 'fs';

const SRC = 'C:/Users/Ura427/Downloads/png-to-svg-converter (1).svg';
const GOLD = [0xf0, 0xa9, 0x2a];
const NAVY = [0x15, 0x26, 0x3f];
const CANVAS = 1254;

// ---- parse -----------------------------------------------------------------
// vtracer emits exactly one shape per <path>: an absolute M, a chain of
// relative cubics, then Z. No other command appears in this file (verified).
function parsePath(d, tx, ty) {
  const tok = d.match(/[MZ]|-?\d+(?:\.\d+)?/g);
  const subs = [];
  let cur = null;
  let i = 0, x = 0, y = 0;
  while (i < tok.length) {
    const t = tok[i];
    if (t === 'M') {
      x = +tok[i + 1] + tx; y = +tok[i + 2] + ty;
      cur = [[x, y]];
      subs.push(cur);
      i += 3;
      continue;
    }
    if (t === 'Z') { cur = null; i += 1; continue; }
    const p0 = [x, y];
    const p1 = [x + +tok[i], y + +tok[i + 1]];
    const p2 = [x + +tok[i + 2], y + +tok[i + 3]];
    const p3 = [x + +tok[i + 4], y + +tok[i + 5]];
    const span = Math.hypot(p3[0] - p0[0], p3[1] - p0[1]);
    const steps = Math.max(1, Math.min(12, Math.round(span / 3)));
    for (let st = 1; st <= steps; st++) {
      const u = st / steps, v = 1 - u;
      cur.push([
        v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0],
        v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1],
      ]);
    }
    x = p3[0]; y = p3[1];
    i += 6;
  }
  return subs.filter((sp) => sp.length >= 3);
}

// vtracer's `c` letter only appears once per chain, so strip it into the loop
function tokenize(d) { return d.replace(/c/g, ' '); }

function area(pts) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length];
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a) / 2;
}

function bbox(pts) {
  let a = Infinity, b = Infinity, c = -Infinity, e = -Infinity;
  for (const [x, y] of pts) { if (x < a) a = x; if (y < b) b = y; if (x > c) c = x; if (y > e) e = y; }
  return { x: a, y: b, w: c - a, h: e - b };
}

// ---- simplify --------------------------------------------------------------
function rdp(pts, eps) {
  if (pts.length < 3) return pts;
  const keep = new Array(pts.length).fill(false);
  keep[0] = keep[pts.length - 1] = true;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [s, e] = stack.pop();
    let best = -1, bestD = eps;
    const [x1, y1] = pts[s], [x2, y2] = pts[e];
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1e-9;
    for (let i = s + 1; i < e; i++) {
      const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / len;
      if (d > bestD) { bestD = d; best = i; }
    }
    if (best !== -1) { keep[best] = true; stack.push([s, best], [best, e]); }
  }
  return pts.filter((_, i) => keep[i]);
}

/**
 * Douglas-Peucker on a closed ring. Run naively, a ring defeats the algorithm:
 * its first and last point coincide, so the baseline it measures every vertex
 * against has zero length and nothing ever exceeds the tolerance. Splitting the
 * ring at its two most distant points gives two open chains that simplify
 * normally.
 */
function rdpClosed(pts, eps) {
  if (pts.length < 8) return pts;
  const first = pts[0];
  let far = 0, farD = -1;
  for (let i = 1; i < pts.length; i++) {
    const d = (pts[i][0] - first[0]) ** 2 + (pts[i][1] - first[1]) ** 2;
    if (d > farD) { farD = d; far = i; }
  }
  const a = rdp(pts.slice(0, far + 1), eps);
  const b = rdp(pts.slice(far), eps);
  return [...a.slice(0, -1), ...b.slice(0, -1)];
}

// ---- refit as a smooth closed curve ----------------------------------------
// Catmull-Rom through the retained points, converted to cubics. Points whose
// turn is sharper than CORNER stay sharp (ray tips, panel corners); everything
// else — the pixel stair-stepping the tracer baked in — becomes curve.
let PREC = 10;
const CORNER = (50 * Math.PI) / 180;

function turnAt(pts, i) {
  const p = pts[(i - 1 + pts.length) % pts.length], q = pts[i], r = pts[(i + 1) % pts.length];
  const a = Math.atan2(q[1] - p[1], q[0] - p[0]);
  const b = Math.atan2(r[1] - q[1], r[0] - q[0]);
  let t = Math.abs(b - a);
  if (t > Math.PI) t = 2 * Math.PI - t;
  return t;
}

function toSmoothPath(pts, tension = 0.5) {
  const n = pts.length;
  if (n < 3) return null;
  const sharp = pts.map((_, i) => turnAt(pts, i) > CORNER);
  const f = (v) => Math.round(v * PREC) / PREC;
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    // A sharp vertex kills the tangent on its own side only, so the corner
    // stays a corner while the segment leaving it still curves.
    const t1 = sharp[i] ? 0 : tension;
    const t2 = sharp[(i + 1) % n] ? 0 : tension;
    const c1 = [p1[0] + ((p2[0] - p0[0]) / 6) * t1 * 2, p1[1] + ((p2[1] - p0[1]) / 6) * t1 * 2];
    const c2 = [p2[0] - ((p3[0] - p1[0]) / 6) * t2 * 2, p2[1] - ((p3[1] - p1[1]) / 6) * t2 * 2];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + 'Z';
}

// ---- run -------------------------------------------------------------------
const src = fs.readFileSync(SRC, 'utf8');
const re = /<path[^>]*\sd="([^"]+)"[^>]*\sfill="(#[0-9a-fA-F]{6})"[^>]*\stransform="translate\(([-\d.]+),([-\d.]+)\)"/g;
const dist = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;

const shapes = [];
let m;
while ((m = re.exec(src))) {
  const [, d, fill, tx, ty] = m;
  // Shapes with holes arrive as several subpaths under one <path> — the gold
  // pin ring is exactly that. They have to stay together: split apart, the
  // hole becomes a solid blob painted over the interior.
  const subs = parsePath(tokenize(d), +tx, +ty);
  if (subs.length === 0) continue;
  const rgb = [parseInt(fill.slice(1, 3), 16), parseInt(fill.slice(3, 5), 16), parseInt(fill.slice(5, 7), 16)];
  const areas = subs.map(area);
  shapes.push({
    subs,
    areas,
    cls: dist(rgb, GOLD) < dist(rgb, NAVY) ? 'gold' : 'navy',
    a: Math.max(...areas),
    bb: bbox(subs.flat()),
  });
}

const MIN_AREA = Number(process.argv[2] ?? 400);
const EPS = Number(process.argv[3] ?? 1.6);
PREC = Number(process.env.PREC ?? 10);

const kept = shapes.filter((s) => {
  // the tracer's first path is the PNG's black background, full canvas
  const isBackdrop = s.bb.w > CANVAS * 0.95 && s.bb.h > CANVAS * 0.95;
  return !isBackdrop && s.a >= MIN_AREA;
});

// Document order is load-bearing: the navy interior sits on top of the gold
// pin, and the gold sun and panels sit on top of that, and navy grid lines are
// cut back into the gold panel. Grouping by colour would collapse that stack
// and paint the interior over the sun, so each shape keeps its own fill and its
// original position.
// Crop to the artwork. The source PNG carries a wide margin; kept as-is the
// mark would render small inside a padded box at every call site.
const all = kept.flatMap((sh) => sh.subs.filter((_, i) => sh.areas[i] >= MIN_AREA / 4)).flat();
const bb = bbox(all);
const PAD = 2;
const VB = { x: Math.floor(bb.x - PAD), y: Math.floor(bb.y - PAD), w: Math.ceil(bb.w + PAD * 2), h: Math.ceil(bb.h + PAD * 2) };

const shaped = kept
  .map((sh) => {
    const d = sh.subs
      .filter((_, i) => sh.areas[i] >= MIN_AREA / 4)
      .map((sp) => toSmoothPath(rdpClosed(sp.map(([x, y]) => [x - VB.x, y - VB.y]), EPS)))
      .filter(Boolean)
      .join('');
    return d ? { d, gold: sh.cls === 'gold' } : null;
  })
  .filter(Boolean);

const body = shaped
  .map((sh) => `  <path d="${sh.d}" fill="${sh.gold ? '#f0a92a' : '#0d1e3d'}" />`)
  .join(String.fromCharCode(10));

const out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VB.w} ${VB.h}" role="img" aria-label="INVICSOL">
${body}
</svg>
`;

if (process.env.TS) {
  const lines = shaped.map((sh) => `  { d: '${sh.d}', gold: ${sh.gold} },`).join(String.fromCharCode(10));
  fs.writeFileSync(process.env.TS, `/**
 * The INVICSOL mark, as an ordered list of filled shapes.
 *
 * Generated, not hand-written: traced from the flat artwork the owner supplied
 * (design-references/logo-source.png), then cleaned — background dropped,
 * hundreds of anti-aliasing slivers discarded, every near-miss colour snapped
 * back to the two brand values, and each outline resimplified and refitted as a
 * smooth curve. See design-references/clean-logo-svg.mjs to regenerate.
 *
 * Order is load-bearing: later shapes paint over earlier ones, which is how the
 * navy body sits inside the gold pin and how the navy grid is cut back out of
 * the gold panel. Sorting these by colour would collapse the whole stack.
 */
export const LOGO_VIEWBOX = { width: ${VB.w}, height: ${VB.h} } as const;

export const LOGO_SHAPES: readonly { readonly d: string; readonly gold: boolean }[] = [
${lines}
];
`);
}

const name = process.argv[4] ?? 'clean.svg';
fs.writeFileSync(name, out);
console.log(`${name}: ${shapes.length} -> ${kept.length} paths, ${(out.length / 1024).toFixed(1)} KB (minArea=${MIN_AREA} eps=${EPS})`);
