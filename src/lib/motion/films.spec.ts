import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FILMS, film, hasJsonScene, timeline } from './films.js';
import { validateScene, type SceneSpec } from '@senseihq/emaki';

// Scene sources on disk: JSON first, JS modules where a scene needs code.
const sceneModules = import.meta.glob('./films/*/scene-*.js');
const lookFiles = import.meta.glob('./films/*/look.css');
const scoreFiles = import.meta.glob('./films/*/score.js');
const voiceScripts = import.meta.glob('./films/*/voice/*.json', { eager: true, import: 'default' });
// fs, not a ?raw glob: Vitest resolves raw globs to empty strings.
const lookCss = (slug: string) => readFileSync(new URL(`./films/${slug}/look.css`, import.meta.url), 'utf8');
// JSON scenes, preferred over the module where present.
const jsonScenes = import.meta.glob<SceneSpec>('./films/*/scene-*.json', { eager: true, import: 'default' });

// Recorded voiceover takes for stop-repeating-yourself, in seconds, rounded UP to 0.1 s from the
// ElevenLabs takes measured 2026-11-14 (Jeremy, eleven_v4). The build starts each take LEAD s into
// its scene and needs TAIL s after it (films/tools/build.py); a scene shorter than LEAD + take +
// TAIL freezes its last frame to fit. If the takes are ever regenerated, re-measure with
// `build.py <slug> --check`, update these, and re-sync films/<slug>/film.json.
const LEAD = 0.6;
const TAIL = 1.2;
const TAKES: Record<string, number> = {
  repeat: 6.6,
  causes: 10.5,
  read: 12.9,
  rules: 10.3,
  depth: 13.1,
  measure: 8.8,
  close: 3.1,
};

describe('motion films', () => {
  it('ships a scene source for every scene of every film (JSON preferred, JS allowed)', () => {
    expect(FILMS.length).toBeGreaterThan(0);
    for (const f of FILMS) {
      for (const s of f.scenes) {
        const json = `./films/${f.slug}/scene-${s.id}.json`;
        const js = `./films/${f.slug}/scene-${s.id}.js`;
        expect(json in jsonScenes || js in sceneModules, `${f.slug}/${s.id} needs ${json} or ${js}`).toBe(true);
      }
    }
  });

  it('ships a voice script covering every scene of every film', () => {
    for (const f of FILMS) {
      const p = `./films/${f.slug}/voice/en.json`;
      expect(p in voiceScripts, `${f.slug} voice script`).toBe(true);
      if (!(p in voiceScripts)) continue;
      const lines = (voiceScripts as Record<string, { scene: string; text: string }[]>)[p];
      expect(lines.map((l) => l.scene), `${f.slug} scenes`).toEqual(f.scenes.map((s) => s.id));
      for (const l of lines) expect(l.text.trim().length, `${f.slug}/${l.scene} text`).toBeGreaterThan(0);
    }
  });

  it('every film opts into dark mode with a dark background', () => {
    for (const f of FILMS) {
      expect(f.dark?.background, `${f.slug} dark.background`).toBe('#1E1B18');
    }
  });

  it('every look redefines its tokens for dark mode', () => {
    for (const f of FILMS) {
      expect(lookCss(f.slug).includes('#stage[data-mode="dark"]'), f.slug).toBe(true);
    }
  });

  it('every look pins a night scope for dark surfaces', () => {
    for (const f of FILMS) {
      expect(lookCss(f.slug).includes('#stage[data-mode="dark"] .night'), f.slug).toBe(true);
    }
  });

  it('ships a look and a score for every film', () => {
    for (const f of FILMS) {
      expect(lookFiles, `${f.slug}/look.css`).toHaveProperty(`./films/${f.slug}/look.css`);
      expect(scoreFiles, `${f.slug}/score.js`).toHaveProperty(`./films/${f.slug}/score.js`);
    }
  });

  it('stop-repeating-yourself fits its recorded voiceover with no frozen holds', () => {
    const f = film('stop-repeating-yourself')!;
    for (const s of f.scenes) {
      expect(s.dur, `${s.id}: need ${LEAD + TAKES[s.id] + TAIL}s`).toBeGreaterThanOrEqual(
        LEAD + TAKES[s.id] + TAIL,
      );
    }
  });

  it('stop-repeating-yourself runs 82 s across 7 scenes', () => {
    const f = film('stop-repeating-yourself')!;
    expect(f.scenes.map((s) => s.id)).toEqual([
      'repeat',
      'causes',
      'read',
      'rules',
      'depth',
      'measure',
      'close',
    ]);
    expect(timeline(f).duration).toBeCloseTo(82, 6);
  });

  // Running totals after fit.py stretches each scene to its recorded take (LEAD + take + TAIL).
  // Measured 2026-11-15; regenerating takes changes these (run fit.py, update, re-render).
  it('runs each film long enough for its recorded takes', () => {
    const expected: Record<string, number> = {
      'stop-repeating-yourself': 82,
      'sensei-relay': 55.8,
      'ai-security-essentials': 144.7,
      'working-with-ai-without-overload': 87,
    };
    for (const [slug, total] of Object.entries(expected)) {
      expect(timeline(film(slug)!).duration, slug).toBeCloseTo(total, 6);
    }
  });

  // films/ is gitignored, so this only runs where the film folders exist (local renders, never CI).
  const here = dirname(fileURLToPath(import.meta.url));
  for (const f of FILMS) {
    const buildCopy = join(here, '..', '..', '..', 'films', f.slug, 'film.json');
    it.runIf(existsSync(buildCopy))(`${f.slug} stays in sync with its films/film.json`, () => {
      const tl = timeline(f);
      const build = JSON.parse(readFileSync(buildCopy, 'utf8')) as {
        length: number;
        scenes: { id: string; start: number; dur: number }[];
      };
      expect(build.length).toBeCloseTo(tl.duration, 6);
      expect(build.scenes.map((s) => s.id)).toEqual(tl.scenes.map((s) => s.id));
      for (const [i, s] of tl.scenes.entries()) {
        expect(build.scenes[i].start, `${s.id} start`).toBeCloseTo(s.start, 6);
        expect(build.scenes[i].dur, `${s.id} dur`).toBeCloseTo(s.dur, 6);
      }
    });
  }

  it('prefers JSON scenes where they exist, modules elsewhere', () => {
    for (const id of ['hook', 'problem', 'pair', 'sensei', 'close']) {
      expect(hasJsonScene('measure-right-work', id), id).toBe(true);
    }
    expect(hasJsonScene('sensei-relay', 'dispatch')).toBe(false);
    expect(hasJsonScene('no-film', 'nope')).toBe(false);
  });

  it('every JSON scene validates and covers a real scene id', () => {
    const paths = Object.keys(jsonScenes);
    expect(paths.length).toBeGreaterThan(0);
    for (const [path, spec] of Object.entries(jsonScenes)) {
      expect(validateScene(spec), path).toEqual([]);
      const [, slug, id] = path.match(/\.\/films\/(.+)\/scene-(.+)\.json/)!;
      expect(film(slug)?.scenes.some((s) => s.id === id), path).toBe(true);
    }
  });
});
