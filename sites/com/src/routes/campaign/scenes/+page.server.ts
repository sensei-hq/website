import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { film as getFilm, FILMS, hasJsonScene, type Layout } from '@site/content/motion/films';
import type { SceneSource } from '@senseihq/emaki';

// The scenes inspector: verify one scene of one film, in any layout, from either source.
// Dev-only review tooling: never deployed (404 in prod).
export const prerender = false;

export const load = ({ url }) => {
  if (!dev) error(404, 'Not found');
  const films = FILMS.map((f) => ({
    slug: f.slug,
    title: f.title,
    json: f.scenes.map((s) => s.id).filter((id) => hasJsonScene(f.slug, id)),
    scenes: f.scenes.map((s) => ({ id: s.id, name: s.name, dur: s.dur })),
  }));
  const film = getFilm(url.searchParams.get('film') ?? '') ?? getFilm('measure-right-work') ?? FILMS[0];
  const scene = film.scenes.some((s) => s.id === url.searchParams.get('scene')) ? url.searchParams.get('scene')! : film.scenes[0].id;
  const o = url.searchParams.get('o');
  const layout: Layout = o === 'portrait' || o === 'figure' ? o : 'landscape';
  const q = url.searchParams.get('src');
  const src: SceneSource | undefined = q === 'js' || q === 'json' ? q : undefined;
  const effective = src ?? (hasJsonScene(film.slug, scene) ? 'json' : 'js');
  return { films, film: film.slug, title: film.title, scene, layout, src, effective };
};
