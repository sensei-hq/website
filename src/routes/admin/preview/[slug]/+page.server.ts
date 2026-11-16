import { error } from '@sveltejs/kit';
import { ARTICLES } from '$lib/articles-data';
import { toCard } from '$lib/articles-server';

// /admin/preview/<slug>: any article, scheduled or not, exactly as its public page will render.
export const load = ({ params }) => {
  const article = ARTICLES.find((a) => a.slug === params.slug);
  if (!article) error(404, 'No such article');
  const others = ARTICLES.filter((a) => a.slug !== article.slug);
  const more = [...others.filter((a) => a.product === article.product), ...others.filter((a) => a.product !== article.product)].slice(0, 3);
  return { article, more: more.map(toCard) };
};
