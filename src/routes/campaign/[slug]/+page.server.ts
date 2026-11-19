import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ARTICLES } from '$lib/articles-data';
import { toCard } from '$lib/articles-server';
import { SHORTS } from '$lib/motion/shorts.js';

// /campaign/<slug>: dev-only review of one campaign piece — the article exactly as it will
// publish, under a toolbar with its production status. Never deployed (404 in prod).
export const prerender = false;

export const load = ({ params }) => {
  if (!dev) error(404, 'Not found');
  const article = ARTICLES.find((a) => a.slug === params.slug);
  if (!article) error(404, 'No such article');
  const day = SHORTS.find((s) => s.slug === params.slug)?.day ?? null;
  const sd = join(process.cwd(), 'films', 'campaign', 'shorts', params.slug);
  let beats = 0;
  try {
    beats = (JSON.parse(readFileSync(join(sd, 'film.json'), 'utf8')) as { scenes: unknown[] }).scenes.length;
  } catch {
    beats = 0;
  }
  let takes = 0;
  try {
    takes = readdirSync(join(sd, 'takes')).filter((f) => f.endsWith('.wav')).length;
  } catch {
    takes = 0;
  }
  const status = {
    motion: (article.film ?? '').startsWith('short-'),
    takes,
    beats,
    render: existsSync(join(sd, 'out', `${params.slug}-vo.mp4`)),
  };
  const others = ARTICLES.filter((a) => a.slug !== article.slug);
  const more = [...others.filter((a) => a.product === article.product), ...others.filter((a) => a.product !== article.product)].slice(0, 3);
  return { article, more: more.map(toCard), day, status };
};
