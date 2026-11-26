import { indexData } from '@site/articles/server';
import { ARTICLES_SITE } from '$lib/articles-site.js';

export const prerender = true;
export const load = () => indexData(ARTICLES_SITE);
