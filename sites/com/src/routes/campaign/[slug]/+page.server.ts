import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { ARTICLES } from '$lib/articles-data';
import { toCard } from '$lib/articles-server';
import { SHORTS } from '@site/content/motion/shorts';
import { hasRender, takesStatus } from '$lib/server/campaign.js';

// /campaign/<slug>: dev-only review of one campaign piece — the article exactly as it will
// publish, under a toolbar with its production status. Never deployed (404 in prod).
export const prerender = false;

export const load = ({ params }) => {
  if (!dev) error(404, 'Not found');
  const article = ARTICLES.find((a) => a.slug === params.slug);
  if (!article) error(404, 'No such article');
  const day = SHORTS.find((s) => s.slug === params.slug)?.day ?? null;
  const { beats, takes } = takesStatus(params.slug);
  const status = {
    motion: (article.film ?? '').startsWith('short-'),
    takes: takes.length,
    beats,
    render: hasRender(params.slug),
  };
  const others = ARTICLES.filter((a) => a.slug !== article.slug);
  const more = [...others.filter((a) => a.product === article.product), ...others.filter((a) => a.product !== article.product)].slice(0, 3);
  return { article, more: more.map(toCard), day, status };
};
