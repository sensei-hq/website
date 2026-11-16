import { film as getFilm, FILMS, hasJsonScene, type Layout } from '$lib/motion/films.js';
import type { SceneSource } from '$lib/motion/scene-player.js';

// The scenes inspector: verify one scene of one film, in any layout, from either source.
export const load = ({ url }) => {
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
