import { json, error } from '@sveltejs/kit';
import { ARTICLES } from '$lib/articles-data';
import { saveProduction, type Production } from '$lib/server/posting';

export const prerender = false;

// POST /api/admin/production (the Mac, films/tools/stage.py status): what exists for each piece (motion, takes,
// render, Short, carousel) and its script, for the planning view in /admin. Body: { items: [{slug, script, status}] }.
export const POST = async ({ platform, request }) => {
  const db = platform?.env?.DB;
  if (!db) error(503, 'No database bound');
  const b = (await request.json()) as { items: { slug: string; script?: string; status: Production }[] };
  const known = new Set(ARTICLES.map((a) => a.slug));
  let n = 0;
  for (const it of b.items ?? []) {
    if (!known.has(it.slug)) continue;
    await saveProduction(db, it.slug, (it.script ?? '').slice(0, 60000) || null, it.status ?? {});
    n++;
  }
  return json({ ok: true, saved: n });
};
