// The scene kit: the small runtime a film's scene modules are written against (the same API Motion films use),
// so a scene renders identically here, at any size and orientation, as a pure function of time.

export type SceneDef = {
  init?: (kit: Kit) => void | Promise<void>;
  render: (t: number, kit: Kit) => void;
  [k: string]: unknown;
};

export interface Kit {
  W: number;
  H: number;
  stage: HTMLElement;
  dur: number;
  start: number;
  clamp01: (x: number) => number;
  clamp: (x: number, a: number, b: number) => number;
  seg: (t: number, a: number, b: number) => number;
  lerp: (a: number, b: number, p: number) => number;
  smoothstep: (a: number, b: number, x: number) => number;
  eo: (x: number) => number;
  ei: (x: number) => number;
  eio: (x: number) => number;
  eoq: (x: number) => number;
  eox: (x: number) => number;
  eob: (x: number, o?: number) => number;
  spring: (x: number) => number;
  step: (t: number, a: number) => number;
  pulse: (t: number, a: number, b: number) => number;
  rng: (seed: number) => () => number;
  vnoise: (seed: number) => (x: number) => number;
  breathe: (t: number, amt?: number, period?: number) => number;
  h: (html: string) => HTMLElement;
  el: (tag: string, o?: Record<string, unknown>, children?: Node[]) => HTMLElement;
  esc: (s: string) => string;
  css: (text: string) => void;
  TextFx: {
    fadeFromRight: (el: HTMLElement, t: number, t0: number, o?: { stagger?: number; dur?: number; dx?: number }) => void;
    fadeOutLeft: (el: HTMLElement, t: number, t0: number, o?: { stagger?: number; dur?: number; dx?: number }) => void;
  };
  scene: (id: string, def: SceneDef) => void;
  score: (fn: (S: unknown, T: Record<string, number>) => void) => void;
}

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Splits an element's text into word spans once, keeping the original string for retyping tools. */
function words(el: HTMLElement): HTMLElement[] {
  const cached = (el as unknown as { __words?: HTMLElement[] }).__words;
  if (cached) return cached;
  const text = el.textContent ?? '';
  el.textContent = '';
  const spans = text.split(' ').map((w, i, all) => {
    const s = document.createElement('span');
    s.style.display = 'inline-block';
    s.style.whiteSpace = 'pre';
    s.textContent = w + (i < all.length - 1 ? ' ' : '');
    el.appendChild(s);
    return s;
  });
  (el as unknown as { __words?: HTMLElement[] }).__words = spans;
  return spans;
}

export function createKit(opts: {
  stage: HTMLElement;
  W: number;
  H: number;
  onScene: (id: string, def: SceneDef, kit: Kit) => void;
  onScore: (fn: (S: unknown, T: Record<string, number>) => void) => void;
}): Kit {
  const { stage, W, H } = opts;
  const eo = (x: number) => 1 - (1 - clamp01(x)) ** 3;
  const kit: Kit = {
    W, H, stage, dur: 0, start: 0,
    clamp01,
    clamp: (x, a, b) => Math.max(a, Math.min(b, x)),
    seg: (t, a, b) => clamp01((t - a) / (b - a)),
    lerp: (a, b, p) => a + (b - a) * p,
    smoothstep: (a, b, x) => { const p = clamp01((x - a) / (b - a)); return p * p * (3 - 2 * p); },
    eo,
    ei: (x) => clamp01(x) ** 3,
    eio: (x) => { x = clamp01(x); return x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2; },
    eoq: (x) => 1 - (1 - clamp01(x)) ** 4,
    eox: (x) => { x = clamp01(x); return x === 1 ? 1 : 1 - 2 ** (-10 * x); },
    eob: (x, o = 1.4) => { x = clamp01(x); return 1 + (o + 1) * (x - 1) ** 3 + o * (x - 1) ** 2; },
    spring: (x) => { x = clamp01(x); return 1 - Math.cos(x * Math.PI * 2.5) * Math.exp(-x * 6); },
    step: (t, a) => (t >= a ? 1 : 0),
    pulse: (t, a, b) => (t >= a && t < b ? 1 : 0),
    rng: (seed) => { let s = (seed >>> 0) || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; },
    vnoise: (seed) => {
      const r = kit.rng(seed), v = Array.from({ length: 256 }, () => r() * 2 - 1);
      return (x) => { const i = Math.floor(x), f = x - i, a = v[((i % 256) + 256) % 256], b = v[(((i + 1) % 256) + 256) % 256]; const u = f * f * (3 - 2 * f); return a + (b - a) * u; };
    },
    breathe: (t, amt = 0.015, period = 3) => 1 + amt * Math.sin((2 * Math.PI * t) / period),
    h: (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild as HTMLElement; },
    el: (tag, o = {}, children = []) => {
      const e = document.createElement(tag);
      if (o.class) e.className = String(o.class);
      if (o.style) e.setAttribute('style', String(o.style));
      if (o.text != null) e.textContent = String(o.text);
      if (o.html != null) e.innerHTML = String(o.html);
      for (const [k, v] of Object.entries((o.attrs as Record<string, string>) ?? {})) e.setAttribute(k, v);
      children.forEach((c) => e.appendChild(c));
      return e;
    },
    esc: (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!),
    css: (text) => { const st = document.createElement('style'); st.textContent = text; stage.appendChild(st); },
    TextFx: {
      fadeFromRight: (el, t, t0, o = {}) => {
        const { stagger = 0.11, dur = 0.5, dx = 30 } = o;
        words(el).forEach((w, i) => { const p = eo((t - t0 - i * stagger) / dur); w.style.opacity = String(p); w.style.transform = `translateX(${((1 - p) * dx).toFixed(2)}px)`; });
      },
      fadeOutLeft: (el, t, t0, o = {}) => {
        const { stagger = 0.06, dur = 0.4, dx = 30 } = o;
        words(el).forEach((w, i) => { const p = eo((t - t0 - i * stagger) / dur); w.style.opacity = String(1 - p); w.style.transform = `translateX(${(-p * dx).toFixed(2)}px)`; });
      },
    },
    scene: (id, def) => opts.onScene(id, def, kit),
    score: (fn) => opts.onScore(fn),
  };
  return kit;
}
