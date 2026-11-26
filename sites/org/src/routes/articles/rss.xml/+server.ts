import { rss } from '@site/articles/server';
import { ARTICLES_SITE } from '$lib/articles-site.js';

export const prerender = true;
export const GET = () => rss(ARTICLES_SITE);
