// The standalone film player (/show/<film>): a client-only page, one prerendered shell per film.
import { error } from '@sveltejs/kit';
import { FILMS, film } from '@site/content/motion/films';

export const showEntries = () => FILMS.map((f) => ({ film: f.slug }));

export function showLoad(slug: string) {
  const f = film(slug);
  if (!f) error(404, 'No such film');
  return { slug: f.slug };
}
