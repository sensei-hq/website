import { error } from '@sveltejs/kit';
import { live, toCard } from '$lib/articles-server.js';
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = () => live().map((a) => ({ slug: a.slug }));

export const load = ({ params }) => {
  const list = live();
  const article = list.find((a) => a.slug === params.slug);
  if (!article) error(404, 'No such article');
  // Same product first (newest), then the rest, so readers stay in the week's thread.
  const others = list.filter((a) => a.slug !== article.slug);
  const more = [...others.filter((a) => a.product === article.product), ...others.filter((a) => a.product !== article.product)].slice(0, 3);
  return { article, more: more.map(toCard) };
};
