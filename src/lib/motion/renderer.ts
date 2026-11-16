// The JSON scene renderer: evaluates a SceneSpec to style ops as a pure function of t
// (evaluateScene, no DOM, unit-tested) and mounts it (mountJsonScene, thin DOM layer).
// Dry-check 2026-11-16: easing math is reused from kit.ts via createKit (the single
// implementation); the W helpers' formulas are ported, not imported, because they only exist
// as per-film raw scene sources that mutate DOM — the renderer needs pure evaluation, so each
// port below cites its source and keeps its exact formula.
import { createKit, type Kit } from './kit.js';
import type { ComponentSpec, SceneSpec, TrackSpec, TweenTrack } from './scene-schema.js';

/** One evaluated style write: element `index` of `selector` gets `style`. */
export interface FrameOp { selector: string; index: number; style: Record<string, string> }

// Only the kit's pure functions are used (seg, easings, lerp, esc); the stub stage is never touched.
const K: Kit = createKit({ stage: null as unknown as HTMLElement, W: 1920, H: 1080, onScene: () => {}, onScore: () => {} });

/** Compact numbers (4 decimals max); browsers render these identically to the modules' raw floats. */
const fmt = (n: number) => String(Number(n.toFixed(4)));

const ease = (name: TweenTrack['easing'], x: number) => (name === 'linear' ? K.clamp01(x) : K[name](x));

function tween(tr: TweenTrack, t: number): FrameOp[] {
  const n = tr.count ?? 1, gap = tr.stagger ?? 0, ops: FrameOp[] = [];
  for (let i = 0; i < n; i++) {
    const v = K.lerp(tr.from, tr.to, ease(tr.easing, K.seg(t, tr.t0 + i * gap, tr.t1 + i * gap)));
    ops.push({ selector: tr.target, index: i, style: tr.prop === 'opacity' ? { opacity: fmt(v) } : { transform: (tr.template ?? '{v}').replace('{v}', fmt(v)) } });
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

// W.push (shared.js): a slow camera scale that never reverses.
const push = (target: string, t: number, t0: number, dur: number, from: number, to: number): FrameOp[] => [
  { selector: target, index: 0, style: { transform: `scale(${fmt(K.lerp(from, to, K.eio(K.seg(t, t0, t0 + dur))))})` } },
];

// W.fade (shared.js): fade and rise in from t0.
const fade = (target: string, t: number, t0: number, d = 0.5, dy = 18): FrameOp[] => {
  const p = K.eo(K.seg(t, t0, t0 + d));
  return [{ selector: target, index: 0, style: { opacity: fmt(p), transform: `translateY(${fmt(K.lerp(dy, 0, p))}px)` } }];
};

// W.pop (shared.js): appear with an overshooting scale.
const pop = (target: string, t: number, t0: number, base = ''): FrameOp[] => {
  const p = K.seg(t, t0, t0 + 0.4);
  return [{ selector: target, index: 0, style: { opacity: fmt(K.eo(p)), transform: `${base} scale(${fmt(K.lerp(0.5, 1, K.eob(p, 1.8)))})`.trim() } }];
};

// W.draw (shared.js): draw an SVG path (pathLength="1") between t0 and t1.
const draw = (target: string, t: number, t0: number, t1: number): FrameOp[] => [
  { selector: target, index: 0, style: { strokeDasharray: '1 1', strokeDashoffset: fmt(1 - K.eio(K.seg(t, t0, t1))) } },
];

const COMPONENTS = new Set(['board', 'head', 'raw']);
const EFFECTS = new Set(['showHead', 'push', 'fade', 'pop', 'draw']);

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
    if (tr.effect === 'fade') return fade(tr.target, t, tr.t0, tr.d, tr.dy);
    if (tr.effect === 'pop') return pop(tr.target, t, tr.t0, tr.base);
    if (tr.effect === 'draw') return draw(tr.target, t, tr.t0, tr.t1);
    const head = spec.components.find((c) => c.id === tr.target.replace(/^\./, '') && c.type === 'head');
    if (!head || head.type !== 'head') throw new Error(`showHead target '${tr.target}' is not a head component`);
    return showHead(tr.target, tr.t0, t, head);
  });
}

// ── Mount (thin DOM layer; Playwright's coverage, not unit) ───────────────────────────────

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
    if (c.type === 'board') svg.push(board(`${c.id}-bg`));
    else if (c.type === 'head') html.push(head({ ...c, style: c.style ?? '' }));
    else html.push(c.html);
  }
  const ground = document.createElement('div');
  ground.className = 'ground';
  ground.innerHTML = `<div class="cam json-cam"><svg class="art" viewBox="0 0 1920 1080">${svg.join('')}</svg>${html.join('')}</div>`;
  host.appendChild(ground);
  if (spec.portrait && opts.H > opts.W) applyPortrait(host, spec.portrait, opts.W);
  const kebab = (k: string) => k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
  return {
    render(t: number) {
      for (const o of evaluateScene(spec, t)) {
        const el = host.querySelectorAll(o.selector)[o.index] as HTMLElement | undefined;
        if (!el) continue;
        for (const [k, v] of Object.entries(o.style)) el.style.setProperty(kebab(k), v);
      }
    },
    destroy() { host.innerHTML = ''; },
  };
}
