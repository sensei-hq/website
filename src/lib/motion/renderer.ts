// The JSON scene renderer: evaluates a SceneSpec to style ops as a pure function of t
// (evaluateScene, no DOM, unit-tested) and mounts it (mountJsonScene, thin DOM layer).
// Dry-check 2026-11-16: easing math is reused from kit.ts via createKit (the single
// implementation); the W helpers' formulas are ported, not imported, because they only exist
// as per-film raw scene sources that mutate DOM — the renderer needs pure evaluation, so each
// port below cites its source and keeps its exact formula.
import { createKit, type Kit } from './kit.js';
import type { ComponentSpec, SceneSpec, TrackSpec, TweenTrack } from './scene-schema.js';

/** One evaluated write: element `index` of `selector` gets style/text/classes/attrs. */
export interface FrameOp {
  selector: string;
  index: number;
  style?: Record<string, string>;
  text?: string;
  classes?: { add?: string[]; remove?: string[] };
  attrs?: Record<string, string>;
}

// Only the kit's pure functions are used (seg, easings, lerp, esc); the stub stage is never touched.
const K: Kit = createKit({ stage: null as unknown as HTMLElement, W: 1920, H: 1080, onScene: () => {}, onScore: () => {} });

/** Compact numbers (4 decimals max); browsers render these identically to the modules' raw floats. */
const fmt = (n: number) => String(Number(n.toFixed(4)));

const ease = (name: TweenTrack['easing'], x: number, o?: number) =>
  name === 'linear' ? K.clamp01(x) : name === 'eob' ? K.eob(x, o ?? 1.4) : K[name](x);

function tween(tr: TweenTrack, t: number): FrameOp[] {
  const n = tr.count ?? 1, gap = tr.stagger ?? 0, ops: FrameOp[] = [];
  for (let i = 0; i < n; i++) {
    const v = K.lerp(tr.from, tr.to, ease(tr.easing, K.seg(t, tr.t0 + i * gap, tr.t1 + i * gap)));
    const op: FrameOp = { selector: tr.target, index: i };
    if (tr.prop === 'opacity') op.style = { opacity: fmt(v) };
    else if (tr.prop === 'transform') op.style = { transform: (tr.template ?? '{v}').replace('{v}', fmt(v)) };
    else op.attrs = { [tr.prop.slice('attr:'.length)]: fmt(v) };
    ops.push(op);
  }
  return ops;
}

// W.showHead (shared.js) + TextFx.fadeFromRight defaults (stagger 0.11, dur 0.5, dx 30).
function showHead(target: string, t0: number, t: number, head: { eyebrow?: string; line: string; sub?: string }): FrameOp[] {
  const ops: FrameOp[] = [];
  if (head.eyebrow) ops.push(part(`${target} .eyebrow`, 0));
  head.line.split(' ').forEach((_, i) => {
    const p = K.eo((t - (t0 + 0.15) - i * 0.11) / 0.5);
    ops.push({ selector: `${target} .line-word`, index: i, style: { opacity: fmt(p), transform: `translateX(${fmt((1 - p) * 30)}px)` } });
  });
  if (head.sub) ops.push(part(`${target} .sub`, 0.9));
  return ops;
  function part(selector: string, d: number): FrameOp {
    const p = K.eo(K.seg(t, t0 + d, t0 + d + 0.5));
    return { selector, index: 0, style: { opacity: fmt(p), transform: `translateX(${fmt(K.lerp(26, 0, p))}px)` } };
  }
}

// TextFx.fadeFromRight (kit.ts) over pre-split word spans.
function words(target: string, count: number, t0: number, t: number, stagger = 0.11, dur = 0.5, dx = 30): FrameOp[] {
  const ops: FrameOp[] = [];
  for (let i = 0; i < count; i++) {
    const p = K.eo((t - t0 - i * stagger) / dur);
    ops.push({ selector: target, index: i, style: { opacity: fmt(p), transform: `translateX(${fmt((1 - p) * dx)}px)` } });
  }
  return ops;
}

// W.push (shared.js): a slow camera scale that never reverses.
const push = (target: string, t: number, t0: number, dur: number, from: number, to: number): FrameOp[] => [
  { selector: target, index: 0, style: { transform: `scale(${fmt(K.lerp(from, to, K.eio(K.seg(t, t0, t0 + dur))))})` } },
];

// W.fade (shared.js): fade and rise in from t0.
function fade(target: string, t: number, t0: number, d = 0.5, dy = 18, count = 1, stagger = 0): FrameOp[] {
  const ops: FrameOp[] = [];
  for (let i = 0; i < count; i++) {
    const p = K.eo(K.seg(t, t0 + i * stagger, t0 + i * stagger + d));
    ops.push({ selector: target, index: i, style: { opacity: fmt(p), transform: `translateY(${fmt(K.lerp(dy, 0, p))}px)` } });
  }
  return ops;
}

// W.pop (shared.js): appear with an overshooting scale.
function pop(target: string, t: number, t0: number, base = '', count = 1, stagger = 0): FrameOp[] {
  const ops: FrameOp[] = [];
  for (let i = 0; i < count; i++) {
    const p = K.seg(t, t0 + i * stagger, t0 + i * stagger + 0.4);
    ops.push({ selector: target, index: i, style: { opacity: fmt(K.eo(p)), transform: `${base} scale(${fmt(K.lerp(0.5, 1, K.eob(p, 1.8)))})`.trim() } });
  }
  return ops;
}

// W.draw (shared.js): draw an SVG path (pathLength="1") between t0 and t1.
function draw(target: string, t: number, t0: number, t1: number, count = 1, stagger = 0): FrameOp[] {
  const ops: FrameOp[] = [];
  for (let i = 0; i < count; i++) {
    ops.push({ selector: target, index: i, style: { strokeDasharray: '1 1', strokeDashoffset: fmt(1 - K.eio(K.seg(t, t0 + i * stagger, t1 + i * stagger))) } });
  }
  return ops;
}

// Hook's activity counters: values[i] eased over a staggered window, locale-formatted with a prefix.
function counter(target: string, t: number, o: { count: number; values: number[]; prefixes?: string[]; t0: number; t1: number; easing: TweenTrack['easing']; stagger?: number; format: 'int' | 'locale' }): FrameOp[] {
  const ops: FrameOp[] = [];
  for (let i = 0; i < o.count; i++) {
    const v = Math.round(o.values[i] * ease(o.easing, K.seg(t, o.t0 + i * (o.stagger ?? 0), o.t1 + i * (o.stagger ?? 0))));
    ops.push({ selector: target, index: i, text: (o.prefixes?.[i] ?? '') + (o.format === 'locale' ? v.toLocaleString('en-US') : String(v)) });
  }
  return ops;
}

// Conditional restyle/reclass from a time (pair's correcting dots, sensei's paired metrics),
// restoring the base before it so seeking backwards is exact.
function swap(target: string, t: number, o: { indices: number[]; at: number; style?: Record<string, string>; base?: Record<string, string>; addClass?: string }): FrameOp[] {
  const on = t >= o.at;
  return o.indices.map((i) => {
    const op: FrameOp = { selector: target, index: i };
    if (o.style ?? o.base) op.style = { ...(on ? o.style : o.base) };
    if (o.addClass) op.classes = on ? { add: [o.addClass] } : { remove: [o.addClass] };
    return op;
  });
}

// Every scene-close's mark: overshooting settle, breathing scale, rotate-in.
function settle(target: string, t: number, o: { t0: number; t1: number; o?: number; scaleFrom?: number; scaleTo?: number; breatheAmp?: number; breatheFreq?: number; rotateFrom?: number; rotateTo?: number; rt0?: number; rt1?: number; opacityMult?: number }): FrameOp[] {
  const s = K.eob(K.seg(t, o.t0, o.t1), o.o ?? 1.4);
  const scale = K.lerp(o.scaleFrom ?? 0.7, o.scaleTo ?? 1, s) * (1 + (o.breatheAmp ?? 0.012) * Math.sin(t * (o.breatheFreq ?? 1.6)));
  const rot = K.lerp(o.rotateFrom ?? -14, o.rotateTo ?? 0, K.eo(K.seg(t, o.rt0 ?? o.t0, o.rt1 ?? o.t1)));
  return [{ selector: target, index: 0, style: { opacity: fmt(K.clamp01(s * (o.opacityMult ?? 1.5))), transform: `scale(${fmt(scale)}) rotate(${fmt(rot)}deg)` } }];
}

// Problem's activity chart: per-bar start times, y/height attributes from stacked heights.
function growBars(target: string, t: number, o: { count: number; t0s: number[]; dur: number; easing: TweenTrack['easing']; o?: number; base: number; hs: number[]; bs: number[] }): FrameOp[] {
  const ops: FrameOp[] = [];
  for (let i = 0; i < o.count; i++) {
    const h = Math.max(0, o.hs[i] * ease(o.easing, K.seg(t, o.t0s[i], o.t0s[i] + o.dur), o.o));
    ops.push({ selector: target, index: i, attrs: { y: fmt(o.base - o.bs[i] - h), height: fmt(h) } });
  }
  return ops;
}

const COMPONENTS = new Set(['board', 'head', 'node', 'wire', 'checks', 'bars', 'logo', 'raw']);
const EFFECTS = new Set(['showHead', 'push', 'fade', 'pop', 'draw', 'counter', 'swap', 'words', 'settle', 'growBars']);

/** Authoring errors, as strings; empty means the spec is usable. */
export function validateScene(spec: SceneSpec): string[] {
  const issues: string[] = [];
  if (!spec.components.length) issues.push('no components');
  for (const c of spec.components as ComponentSpec[]) {
    if (!COMPONENTS.has(c.type)) issues.push(`component ${c.id}: unknown type '${c.type}'`);
  }
  spec.tracks.forEach((tr, i) => {
    if (tr.kind === 'effect' && !EFFECTS.has(tr.effect)) issues.push(`track ${i}: unknown effect '${(tr as { effect: string }).effect}'`);
  });
  return issues;
}

/** Every style op the spec produces at time t. Pure: the same (spec, t) always gives the same ops. */
export function evaluateScene(spec: SceneSpec, t: number): FrameOp[] {
  const issues = validateScene(spec);
  if (issues.length) throw new Error(issues.join('; '));
  return spec.tracks.flatMap((tr: TrackSpec) => {
    if (tr.kind === 'tween') return tween(tr, t);
    if (tr.effect === 'push') return push(tr.target, t, tr.t0, tr.dur, tr.from, tr.to);
    if (tr.effect === 'fade') return fade(tr.target, t, tr.t0, tr.d, tr.dy, tr.count, tr.stagger);
    if (tr.effect === 'pop') return pop(tr.target, t, tr.t0, tr.base, tr.count, tr.stagger);
    if (tr.effect === 'draw') return draw(tr.target, t, tr.t0, tr.t1, tr.count, tr.stagger);
    if (tr.effect === 'words') return words(tr.target, tr.count, tr.t0, t, tr.stagger, tr.dur, tr.dx);
    if (tr.effect === 'counter') return counter(tr.target, t, { ...tr, count: tr.count ?? tr.values.length });
    if (tr.effect === 'swap') return swap(tr.target, t, tr);
    if (tr.effect === 'settle') return settle(tr.target, t, tr);
    if (tr.effect === 'growBars') return growBars(tr.target, t, tr);
    const head = spec.components.find((c) => c.id === tr.target.replace(/^\./, '') && c.type === 'head');
    if (!head || head.type !== 'head') throw new Error(`showHead target '${tr.target}' is not a head component`);
    return showHead(tr.target, tr.t0, t, head);
  });
}

// ── Components (ports of the W builders; the catalog test checks them against shared.js) ────

// W.glyph (shared.js): canonical kinds plus relay's crown and overload's list/check/steps/doc.
function glyph(kind: string, color: string): string {
  const s = `style="fill:none;stroke:${color};stroke-width:9;stroke-linecap:round;stroke-linejoin:round"`;
  const f = `style="fill:${color}"`;
  if (kind === 'spark') return `<path d="M0 -34 Q4 -4 34 0 Q4 4 0 34 Q-4 4 -34 0 Q-4 -4 0 -34 Z" ${f}/>`;
  if (kind === 'brace') return `<path d="M-12 -30 Q-24 -30 -24 -18 V-8 Q-24 0 -32 0 Q-24 0 -24 8 V18 Q-24 30 -12 30 M12 -30 Q24 -30 24 -18 V-8 Q24 0 32 0 Q24 0 24 8 V18 Q24 30 12 30" ${s}/>`;
  if (kind === 'ring') return `<circle r="26" ${s}/><circle r="9" ${f}/>`;
  if (kind === 'tri') return `<path d="M0 -30 L28 22 H-28 Z" ${s}/>`;
  if (kind === 'grid') return `<g ${f}><rect x="-28" y="-28" width="22" height="22" rx="5"/><rect x="6" y="-28" width="22" height="22" rx="5"/><rect x="-28" y="6" width="22" height="22" rx="5"/><rect x="6" y="6" width="22" height="22" rx="11"/></g>`;
  if (kind === 'db') return `<g ${s}><ellipse cx="0" cy="-20" rx="28" ry="10"/><path d="M-28 -20 V20 Q0 34 28 20 V-20 M-28 0 Q0 14 28 0"/></g>`;
  if (kind === 'lock') return `<path d="M-16 -6 V-18 Q-16 -32 0 -32 Q16 -32 16 -18 V-6" ${s}/><rect x="-26" y="-6" width="52" height="38" rx="8" ${f}/>`;
  if (kind === 'crown') return `<path d="M-30 20 L-30 -18 L-14 0 L0 -26 L14 0 L30 -18 L30 20 Z" ${f}/>`;
  if (kind === 'list') return `<g ${s}><path d="M-12 -22 H28 M-12 0 H28 M-12 22 H18"/></g><g ${f}><circle cx="-26" cy="-22" r="5"/><circle cx="-26" cy="0" r="5"/><circle cx="-26" cy="22" r="5"/></g>`;
  if (kind === 'check') return `<circle r="28" ${s}/><path d="M-13 1 L-3 11 L15 -9" ${s}/>`;
  if (kind === 'steps') return `<path d="M-30 24 H-10 V6 H10 V-12 H30" ${s}/><circle cx="30" cy="-26" r="6" ${f}/>`;
  if (kind === 'doc') return `<path d="M-22 -30 H10 L24 -16 V30 H-22 Z" ${s}/>`;
  return `<path d="M-30 6 Q-15 -20 0 6 T30 6" ${s}/>`;
}

// W.node (shared.js): a tile centred on (0,0), lit from above.
function node(cls: string, kind: string, tone: string | undefined, size: number | undefined): string {
  const z = size || 156, h = z / 2, band = tone === 'hot' ? 'var(--accent)' : tone === 'ok' ? 'var(--jade)' : 'var(--main)';
  return '<g class="' + cls + '">' +
    '<rect x="' + -h + '" y="' + (-h + 12) + '" width="' + z + '" height="' + z + '" rx="' + z * 0.19 + '" style="fill:var(--shade)"/>' +
    '<rect x="' + -h + '" y="' + -h + '" width="' + z + '" height="' + z + '" rx="' + z * 0.19 + '" style="fill:var(--tile);stroke:var(--hair);stroke-width:3"/>' +
    '<rect class="' + cls + '-band" x="' + -h * 0.6 + '" y="' + -h + '" width="' + h * 1.2 + '" height="10" rx="5" style="fill:' + band + '"/>' +
    '<g transform="translate(0 4) scale(' + z / 156 + ')">' + glyph(kind, tone === 'hot' ? 'var(--accent)' : 'var(--main)') + '</g></g>';
}

// W.board (the canonical shared.js): washi paper with a faint dot grid.
const board = (id: string) =>
  `<defs><pattern id="${id}" width="48" height="48" patternUnits="userSpaceOnUse"><circle cx="24" cy="24" r="2.4" style="fill:var(--dot)"/></pattern></defs>` +
  `<g class="board"><rect x="-400" y="-300" width="2720" height="1680" fill="url(#${id})"/></g>`;

// W.head (shared.js), with the line pre-split into word spans so showHead addresses them by index.
// Text is plain (escaped); words with markup stay in .js scenes until the catalog covers them.
const head = (c: { id: string; eyebrow?: string; line: string; sub?: string; style?: string }) => {
  const words = K.esc(c.line).split(' ').map((w, i, all) => `<span class="line-word" style="display:inline-block;white-space:pre">${w}${i < all.length - 1 ? ' ' : ''}</span>`).join('');
  return `<div class="words ${c.id}" style="${c.style ?? ''}">${c.eyebrow ? `<p class="eyebrow">${K.esc(c.eyebrow)}</p>` : ''}` +
    `<h2 class="line">${words}</h2>${c.sub ? `<p class="sub">${K.esc(c.sub)}</p>` : ''}</div>`;
};

// W.wire (shared.js): a quadratic curve from a to b bending through c.
const wire = (id: string, a: [number, number], c: [number, number], b: [number, number], color?: string) =>
  `<path class="${id}" pathLength="1" d="M${a[0]} ${a[1]} Q${c[0]} ${c[1]} ${b[0]} ${b[1]}" style="fill:none;stroke:${color || 'var(--wire)'};stroke-width:6;stroke-linecap:round"/>`;

// W.checks (shared.js): a list of ticked rows.
const checks = (id: string, items: string[], style?: string) =>
  `<div class="checks ${id}" style="${style ?? ''}">${items.map((s) => `<div class="chk"><i></i><span>${s}</span></div>`).join('')}</div>`;

// W.bars (shared.js): code lines as rounded bars.
const bars = (id: string, x: number, y: number, rows: [number, number, string][], gap?: number, h?: number) =>
  rows.map(([i, w, tone], k) => '<rect class="' + id + '" x="' + (x + i) + '" y="' + (y + k * (gap || 34)) + '" width="' + w + '" height="' + (h || 12) + '" rx="' + (h || 12) / 2 +
    '" style="fill:' + (tone === 'hot' ? 'var(--accent)' : tone === 'ok' ? 'var(--jade)' : tone === 'ink' ? 'var(--main)' : 'var(--hair)') + '"/>').join('');

// Product marks (motion/logos/*.svg), the same artwork W.logoArt inlines in every shared.js.
const logos = import.meta.glob<string>('./logos/*.svg', { query: '?raw', import: 'default', eager: true });

// W.logo (shared.js): the mark drawn inside an SVG at (x, y), centred, size px.
function logo(id: string, name: string, x: number, y: number, size: number): string {
  const raw = logos[`./logos/${name}.svg`];
  if (!raw) throw new Error(`unknown logo '${name}' (motion/logos/)`);
  const art = raw.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  return `<svg class="${id}" x="${x - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" viewBox="0 0 512 512" style="overflow:visible">${art}</svg>`;
}

/** A component's markup, split into the SVG and HTML layers. Pure; the catalog test pins it. */
export function renderComponent(c: ComponentSpec): { svg: string; html: string } {
  switch (c.type) {
    case 'board': return { svg: board(c.id), html: '' };
    case 'node': {
      const inner = node(c.id, c.kind, c.tone, c.size);
      const g = c.x !== undefined && c.y !== undefined ? `<g class="${c.id}-pos" transform="translate(${c.x} ${c.y})">${inner}</g>` : inner;
      return { svg: g, html: '' };
    }
    case 'wire': return { svg: wire(c.id, c.a, c.c, c.b, c.color), html: '' };
    case 'bars': return { svg: bars(c.id, c.x, c.y, c.rows, c.gap, c.h), html: '' };
    case 'logo': return { svg: logo(c.id, c.name, c.x, c.y, c.size), html: '' };
    case 'head': return { svg: '', html: head(c) };
    case 'checks': return { svg: '', html: checks(c.id, c.items, c.style) };
    case 'raw': return { svg: '', html: c.html };
  }
}

// ── Mount (thin DOM layer; Playwright's coverage, not unit) ───────────────────────────────

// W.portrait (shared.js), ported to the mount host: lift hoisted words out, frame the crop band.
function applyPortrait(host: HTMLElement, spec: NonNullable<SceneSpec['portrait']>, PW: number) {
  const ground = host.querySelector('.ground');
  if (!ground) return;
  const lifted = spec.hoist.flatMap((s) => [...ground.querySelectorAll(s)]);
  const inner = document.createElement('div');
  inner.className = 'pt-inner';
  [...ground.children].forEach((el) => { if (!lifted.includes(el)) inner.appendChild(el); });
  const [fy, fh] = spec.frame, [cx, cy, cw, ch] = spec.crop;
  const s = Math.min(PW / cw, fh / ch);
  const frame = document.createElement('div');
  frame.className = 'pt-frame';
  frame.style.cssText = `position:absolute;left:0;top:${fy}px;width:${PW}px;height:${fh}px;overflow:hidden`;
  inner.style.cssText = 'position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:0 0;transform:translate(' +
    `${((PW - cw * s) / 2 - cx * s).toFixed(1)}px,${((fh - ch * s) / 2 - cy * s).toFixed(1)}px) scale(${s.toFixed(4)})`;
  frame.appendChild(inner);
  ground.appendChild(frame);
  lifted.forEach((el) => ground.appendChild(el));
  if (spec.css) { const st = document.createElement('style'); st.textContent = spec.css; host.appendChild(st); }
}

/** Build the spec's DOM once; render(t) applies the evaluated ops. Missing targets are skipped. */
export function mountJsonScene(host: HTMLElement, spec: SceneSpec, opts: { W: number; H: number }) {
  const issues = validateScene(spec);
  if (issues.length) throw new Error(issues.join('; '));
  host.innerHTML = '';
  const svg: string[] = [], html: string[] = [];
  for (const c of spec.components) {
    const r = renderComponent(c);
    svg.push(r.svg);
    html.push(r.html);
  }
  const ground = document.createElement('div');
  ground.className = 'ground';
  ground.innerHTML = `<div class="cam json-cam"><svg class="art" viewBox="0 0 1920 1080">${svg.join('')}</svg>${html.join('')}</div>`;
  host.appendChild(ground);
  if (spec.css) { const st = document.createElement('style'); st.textContent = spec.css; host.appendChild(st); }
  if (spec.portrait && opts.H > opts.W) applyPortrait(host, spec.portrait, opts.W);
  const kebab = (k: string) => k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
  return {
    render(t: number) {
      for (const o of evaluateScene(spec, t)) {
        const el = host.querySelectorAll(o.selector)[o.index] as HTMLElement | SVGElement | undefined;
        if (!el) continue;
        if (o.text !== undefined) el.textContent = o.text;
        for (const [k, v] of Object.entries(o.style ?? {})) (el as HTMLElement).style.setProperty(kebab(k), v);
        for (const c of o.classes?.add ?? []) el.classList.add(c);
        for (const c of o.classes?.remove ?? []) el.classList.remove(c);
        for (const [k, v] of Object.entries(o.attrs ?? {})) el.setAttribute(k, v);
      }
    },
    destroy() { host.innerHTML = ''; },
  };
}
