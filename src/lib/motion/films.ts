// The website's motion setup over @senseihq/emaki: our films (a sync index for articles and
// prerender entries, which cannot await the registry), the source wired to our folders, and a
// mount wrapper with our defaults (English, JSON-first). Formulas, layouts and the capture
// contract all come from emaki; this file only adapts them to where our content lives.
import {
  setupMotion,
  mountScene as emakiMount,
  type FilmJson,
  type FilmMeta,
  type Layout,
  type Mounted,
  type SceneMeta,
  type TimingJson,
} from '@senseihq/emaki';
import { viteSource } from '@senseihq/emaki/loaders/vite';
import type { VoiceLine } from '@senseihq/emaki';

export type { Layout, Mounted, FilmMeta, SceneMeta };
export { SIZES, timeline, warp, coverTime, filmScore } from '@senseihq/emaki';

const films = import.meta.glob('./films/*/film.json', { eager: true, import: 'default' }) as Record<string, FilmJson>;
const scenes = import.meta.glob('./films/*/scene-*.json', { import: 'default' });
const timings = import.meta.glob('./films/*/timing.json', { eager: true, import: 'default' }) as Record<string, TimingJson>;
const raw = import.meta.glob(['./films/*/*.js', './films/*/look.css'], { query: '?raw', import: 'default' });
const logos = import.meta.glob('./logos/*.svg', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
const voiceText = import.meta.glob('./films/*/voice/*.json', { eager: true, import: 'default' }) as Record<string, VoiceLine[]>;

const { filmSource } = viteSource({ films, scenes, timings, raw, logos, voiceText });

// Dev-only narration: campaign takes stream from the review API (which 404s in prod),
// so fitted shorts speak in review while deployed films stay exactly as built.
const devVoice = async (slug: string, locale: string, scene: string) =>
  (import.meta.env.DEV ? takeUrl(slug, scene) : null) ?? ((await filmSource.voice?.(slug, locale, scene)) ?? null);

setupMotion({ source: { ...filmSource, voice: devVoice }, site: { locales: ['en'], defaultLocale: 'en' }, logos });

// ── Sync index (articles-data and prerender entries need films without awaiting) ────────────

const slugOf = (path: string) => path.split('/')[2];

export const FILMS: FilmMeta[] = Object.entries(films)
  .map(([path, m]) => {
    const slug = slugOf(path);
    const tm = timings[`./films/${slug}/timing.json`]?.scenes ?? {};
    const filmScenes = m.scenes.map((s) => {
      const holds = [...(tm[s.id]?.holds ?? [])].sort((a, b) => a[0] - b[0]);
      const min = s.dur + holds.reduce((n, h) => n + h[1], 0);
      return { ...s, design: s.dur, holds, dur: Math.max(min, tm[s.id]?.dur ?? 0) };
    });
    return { ...m, slug, scenes: filmScenes };
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));

export const film = (slug: string) => FILMS.find((f) => f.slug === slug);

/** A campaign short's scene N plays take N from the review API. Null off-campaign. */
export const takeUrl = (slug: string, scene: string): string | null => {
  if (!slug.startsWith('short-')) return null;
  const idx = film(slug)?.scenes.findIndex((s) => s.id === scene) ?? -1;
  return idx < 0 ? null : `/api/campaign/${slug.slice('short-'.length)}/takes/${idx + 1}`;
};

/** Whether the scene has a JSON twin (which the loader then prefers). */
export const hasJsonScene = (slug: string, id: string) => `./films/${slug}/scene-${id}.json` in scenes;

/** Whether the film has a score.js (its music and effects). */
export const hasScore = (f: FilmMeta) => `./films/${f.slug}/score.js` in raw;

/** Waits for the film's fonts so the first frame is set in the right type. */
export async function fontsReady() {
  if (typeof document === 'undefined' || !document.fonts) return;
  const faces = ['300 40px Fraunces', '400 40px Fraunces', '400 40px Inter', '600 40px Inter', '400 40px "Shippori Mincho"', '400 40px "JetBrains Mono"'];
  await Promise.all(faces.map((f) => document.fonts.load(f, '継 Aa').catch(() => [])));
  await document.fonts.ready;
}

/**
 * Renders one scene of a film into `host` (in its shadow root, so film and page CSS stay apart).
 * JSON scenes win where they exist; `src` forces one source (the parity test's ?src=).
 */
export async function mountScene(host: HTMLElement, f: FilmMeta, sceneId: string, layout: Layout, opts: { src?: 'json' | 'js' } = {}): Promise<Mounted> {
  return emakiMount(host, f, sceneId, layout, { locale: 'en', src: opts.src });
}
