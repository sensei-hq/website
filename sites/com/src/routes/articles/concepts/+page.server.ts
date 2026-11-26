import { conceptsData } from '@site/articles/server';
import { ARTICLES_SITE } from '$lib/articles-site.js';

// Concepts: the articles about working with AI (security, quality, practice), not about one product.
export const prerender = true;
export const load = () => conceptsData(ARTICLES_SITE);
