import { articleData, articleEntries } from '@site/articles/server';
import { ARTICLES_SITE } from '$lib/articles-site.js';
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = () => articleEntries(ARTICLES_SITE);
export const load = ({ params }) => articleData(ARTICLES_SITE, params.slug);
