import { error } from '@sveltejs/kit';
import { FILMS, film } from '@site/content/motion/films';

// A client-only player: the static build writes one shell per film and the scenes mount in the browser.
export const ssr = false;
export const prerender = true;
export const entries = () => FILMS.map((f) => ({ film: f.slug }));

export function load({ params }) {
  const f = film(params.film);
  if (!f) error(404, 'No such film');
  return { slug: f.slug };
}
