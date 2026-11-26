import { tagData, tagEntries } from '@site/articles/server';
import { ARTICLES_SITE } from '$lib/articles-site.js';
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = () => tagEntries(ARTICLES_SITE);
export const load = ({ params }) => tagData(ARTICLES_SITE, params.tag);
