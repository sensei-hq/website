import { error } from '@sveltejs/kit';
import { live, gallery } from '$lib/articles-server.js';
import { tagsOf } from '$lib/articles-data.js';
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = () => tagsOf(live()).map((tag) => ({ tag }));

export const load = ({ params }) => {
  const list = live().filter((a) => a.tags.includes(params.tag));
  if (!list.length) error(404, 'No articles with this tag yet');
  return { tag: params.tag, ...gallery(list) };
};
