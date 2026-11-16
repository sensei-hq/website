// Motion films: each folder under ./films is one film's scene modules, written against the scene kit
// (./kit.ts). The same files render the article figures, the slide show (/show/<film>) and the video
// renders (films/tools/render.py), in any of three layouts. See ./README.md.
import { createKit, type Kit, type SceneDef } from './kit.js';
import { collectScore, type Score } from './score.js';
import { mountJsonScene } from './renderer.js';
import type { SceneSpec } from './scene-schema.js';

export type Layout = 'landscape' | 'portrait' | 'figure';

/** Stage size in px for each layout. The scenes are authored on a 1920x1080 board. */
export const SIZES: Record<Layout, [number, number]> = {
  landscape: [1920, 1080],
  portrait: [1080, 1920],
  figure: [1600, 1000],
};

/** `dur` is the scene's running time (design time plus any pauses, or longer when fitted to its voice take);
 *  `design` is the length it was animated for; `holds` are pauses [at, seconds] in design time. */
export interface SceneMeta { id: string; name: string; dur: number; design: number; holds: [number, number][]; desc?: string }

/** films/<slug>/timing.json (optional): per scene, a running time and/or pauses. Written by films/tools/fit.py,
 *  pauses by hand. Example: { "scenes": { "read": { "dur": 13.4, "holds": [[4.5, 1.2]] } } } */
interface Timing { scenes?: Record<string, { dur?: number; holds?: [number, number][] }> }
export interface FilmMeta {
  slug: string;
  title: string;
  look: string;
  background: string;
  scenes: SceneMeta[];
  /** The frame used as the film's cover (poster, thumbnail, link preview): a scene and a time into it (running time).
   *  Default: the last scene's final picture, which in every film is its closing punchline card. */
  cover?: { scene: string; at?: number };
}

// films/<slug>/score.js is loaded on demand by filmScore().
const metas = import.meta.glob<Omit<FilmMeta, 'slug'>>('./films/*/film.json', { eager: true, import: 'default' });
const timings = import.meta.glob<Timing>('./films/*/timing.json', { eager: true, import: 'default' });
// Scene code and CSS load on demand, one film at a time; score.js is the Motion audio and is not run here.
const sources = import.meta.glob<string>(['./films/*/*.js', './films/*/*.css'], {
  query: '?raw',
  import: 'default',
});
// JSON scenes, preferred over the module where present (see the parity test).
const jsonScenes = import.meta.glob<SceneSpec>('./films/*/scene-*.json', { eager: true, import: 'default' });

/** Whether the scene has a JSON twin (which the loader then prefers). */
export const hasJsonScene = (slug: string, id: string) => Boolean(jsonScenes[`./films/${slug}/scene-${id}.json`]);

const slugOf = (path: string) => path.split('/')[2];

export const FILMS: FilmMeta[] = Object.entries(metas)
  .map(([path, m]) => {
    const slug = slugOf(path), tm = timings[`./films/${slug}/timing.json`]?.scenes ?? {};
    const scenes = (m.scenes as { id: string; name: string; dur: number; desc?: string }[]).map((s) => {
      const holds = [...(tm[s.id]?.holds ?? [])].sort((a, b) => a[0] - b[0]);
      const min = s.dur + holds.reduce((n, h) => n + h[1], 0);
      return { ...s, design: s.dur, holds, dur: Math.max(min, tm[s.id]?.dur ?? 0) };
    });
    return { ...m, slug, scenes };
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));

export const film = (slug: string) => FILMS.find((f) => f.slug === slug);

/** Total running time and where each scene starts. */
export function timeline(f: FilmMeta) {
  let at = 0;
  const scenes = f.scenes.map((s) => {
    const row = { ...s, start: at };
    at += s.dur;
    return row;
  });
  return { duration: at, scenes };
}

const cssCache = new Map<string, Promise<string>>();
const jsCache = new Map<string, Promise<{ shared: string; scenes: string[] }>>();

function loadSource(slug: string, name: string): Promise<string> {
  const load = sources[`./films/${slug}/${name}`];
  if (!load) throw new Error(`motion: ${slug}/${name} is missing`);
  return load() as Promise<string>;
}

/** A film's CSS (base.css), needed by .js and .json scenes alike. */
function css(f: FilmMeta): Promise<string> {
  if (!cssCache.has(f.slug)) cssCache.set(f.slug, loadSource(f.slug, 'base.css'));
  return cssCache.get(f.slug)!;
}

/** A film's code (shared.js plus every scene module), for .js scenes only. */
function js(f: FilmMeta): Promise<{ shared: string; scenes: string[] }> {
  if (!jsCache.has(f.slug)) {
    jsCache.set(
      f.slug,
      Promise.all([loadSource(f.slug, 'shared.js'), ...f.scenes.map((s) => loadSource(f.slug, `scene-${s.id}.js`))]).then(
        ([shared, ...scenes]) => ({ shared, scenes }),
      ),
    );
  }
  return jsCache.get(f.slug)!;
}

export interface Mounted {
  W: number;
  H: number;
  dur: number;
  /** The stage element at its natural size; scale it to fit with a CSS transform. */
  stage: HTMLElement;
  render: (t: number) => void;
  destroy: () => void;
}

type Spec = { hoist?: string[]; frame: [number, number]; crop: [number, number, number, number]; css?: string };

/** Figure layout: the scene's artwork only. Its words are left out (the article already says them) and the
 *  board is framed on the region the scene marks as its art. Scenes that are all words show as they are. */
function figureLayout(kit: Kit, spec: Spec) {
  const ground = kit.stage.querySelector<HTMLElement>('.ground');
  if (!ground) return;
  const lifted = (spec.hoist ?? []).flatMap((s) => [...ground.querySelectorAll<HTMLElement>(s)]);
  const wordsOnly = spec.frame[1] < 50;
  const inner = document.createElement('div');
  [...ground.children].forEach((el) => {
    if (!lifted.includes(el as HTMLElement)) inner.appendChild(el);
  });
  let s = kit.W / 1920, x = 0, y = (kit.H - 1080 * s) / 2;
  if (!wordsOnly) {
    lifted.forEach((el) => (el.style.display = 'none'));
    const [cx, cy, cw, ch] = spec.crop;
    s = Math.min((kit.W * 0.94) / cw, (kit.H * 0.9) / ch);
    x = (kit.W - cw * s) / 2 - cx * s;
    y = (kit.H - ch * s) / 2 - cy * s;
  } else {
    lifted.forEach((el) => inner.appendChild(el));
  }
  inner.style.cssText = `position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:0 0;transform:translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${s.toFixed(4)})`;
  ground.appendChild(inner);
}

/**
 * Renders one scene of a film into `host` (in its shadow root, so film and page CSS stay apart).
 * JSON scenes win where they exist; `src` forces one source (the parity test's ?src=).
 */
export async function mountScene(host: HTMLElement, f: FilmMeta, sceneId: string, layout: Layout, opts: { src?: 'json' | 'js' } = {}): Promise<Mounted> {
  const base = await css(f);
  const [W, H] = SIZES[layout];
  const root = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
  root.innerHTML = '';
  const style = document.createElement('style');
  style.textContent =
    `:host{display:block;position:relative;overflow:hidden}` +
    `#stage{position:absolute;left:0;top:0;width:${W}px;height:${H}px;overflow:hidden;transform-origin:0 0;background:${f.background};` +
    `--display:'Fraunces',Georgia,serif;--sans:'Inter',system-ui,sans-serif;--serif:'Shippori Mincho','Fraunces',serif;--mono:'JetBrains Mono',ui-monospace,monospace;` +
    `-webkit-font-smoothing:antialiased}` +
    base;
  const stage = document.createElement('div');
  stage.id = 'stage';
  root.append(style, stage);
  const meta = f.scenes.find((s) => s.id === sceneId)!;

  const useJson = opts.src ? opts.src === 'json' : hasJsonScene(f.slug, sceneId);
  if (useJson) {
    const spec = jsonScenes[`./films/${f.slug}/scene-${sceneId}.json`];
    if (!spec) throw new Error(`motion: ${f.slug} has no JSON scene "${sceneId}"`);
    const mounted = mountJsonScene(stage, spec, { W, H });
    if (layout === 'figure') {
      if (!spec.portrait) throw new Error(`motion: ${f.slug}/${sceneId}.json needs a portrait spec for figures`);
      figureLayout(createKit({ stage, W, H, onScene: () => {}, onScore: () => {} }), spec.portrait);
    }
    return {
      W, H, dur: meta.dur, stage,
      render: (t) => mounted.render(warp(t, meta.holds)),
      destroy: () => { root.innerHTML = ''; },
    };
  }

  const src = await js(f);
  const defs: Record<string, SceneDef> = {};
  const kit = createKit({ stage, W, H, onScene: (id, def) => (defs[id] = def), onScore: () => {} });
  // Each mount gets its own `window`/`W`, so two films (or two layouts) on one page never share state.
  const win: { W?: Record<string, unknown> } = {};
  // shared.js sets `window.W` and then uses bare `W`; `with` points both at this mount's object.
  new Function('kit', 'window', `with (window) {\n${src.shared}\n}`)(kit, win);
  const helpers = win.W ?? {};
  const portrait = helpers.portrait as ((k: Kit, s: Spec) => void) | undefined;
  helpers.portrait = (k: Kit, s: Spec) => {
    if (layout === 'portrait') portrait?.(k, s);
    else if (layout === 'figure') figureLayout(k, s);
  };
  src.scenes.forEach((c) => new Function('kit', 'window', 'W', c)(kit, win, helpers));

  const def = defs[sceneId];
  if (!def) throw new Error(`motion: ${f.slug} has no scene "${sceneId}"`);
  const inst = Object.create(def) as SceneDef;
  kit.dur = meta.dur;
  await inst.init?.call(inst, kit);
  return {
    W, H, dur: meta.dur, stage,
    render: (t) => inst.render.call(inst, warp(t, meta.holds), kit),
    destroy: () => { root.innerHTML = ''; },
  };
}

/** Scene time for running time `t`: the clock stands still through each pause. */
export function warp(t: number, holds: [number, number][]) {
  let shift = 0;
  for (const [a, l] of holds) { if (t < a + shift) break; if (t < a + shift + l) return a; shift += l; }
  return t - shift;
}
/** Running time for scene time `t` (the inverse, for placing sounds after a pause). */
function unwarp(t: number, holds: [number, number][]) {
  let out = t;
  for (const [a, l] of holds) if (t > a) out += l;
  return out;
}

/** Film time of the cover frame (see FilmMeta.cover). */
export function coverTime(f: FilmMeta) {
  const tl = timeline(f);
  const s = tl.scenes.find((x) => x.id === f.cover?.scene) ?? tl.scenes[tl.scenes.length - 1];
  const at = f.cover?.at ?? s.dur - 0.3;
  return s.start + Math.max(0, Math.min(at, s.dur - 0.05));
}

/** Whether the film has a score.js. */
export const hasScore = (f: FilmMeta) => !!sources[`./films/${f.slug}/score.js`];

/** The film's score (music and effects), timed to the film as it actually runs: T is each scene's running start,
 *  and a sound placed after a pause inside a scene moves with it. Null when the film has no score.js. */
export async function filmScore(f: FilmMeta): Promise<Score | null> {
  const load = sources[`./films/${f.slug}/score.js`];
  if (!load) return null;
  const tl = timeline(f), T: Record<string, number> = {};
  tl.scenes.forEach((s) => (T[s.id] = s.start));
  const score = collectScore(await load(), T);
  for (const e of score.events) {
    let k = tl.scenes.length - 1;
    while (k > 0 && e.t < tl.scenes[k].start) k--;
    const s = tl.scenes[k];
    if (s.holds.length) e.t = s.start + unwarp(e.t - s.start, s.holds);
  }
  score.events.sort((a, b) => a.t - b.t);
  return score;
}

/** Waits for the fonts the films use, so the first frame is set in the right type. */
export async function fontsReady() {
  if (typeof document === 'undefined' || !document.fonts) return;
  const faces = ['300 40px Fraunces', '400 40px Fraunces', '400 40px Inter', '600 40px Inter', '400 40px "Shippori Mincho"', '400 40px "JetBrains Mono"'];
  await Promise.all(faces.map((f) => document.fonts.load(f, '継 Aa').catch(() => [])));
  await document.fonts.ready;
}
