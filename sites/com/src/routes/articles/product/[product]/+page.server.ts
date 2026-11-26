import { productData, productEntries } from '@site/articles/server';
import { ARTICLES_SITE } from '$lib/articles-site.js';
import type { EntryGenerator } from './$types';

// Products only: concept articles ('practice') are listed at /articles/concepts.
export const entries: EntryGenerator = () => productEntries(ARTICLES_SITE);
export const load = ({ params }) => productData(ARTICLES_SITE, params.product);
