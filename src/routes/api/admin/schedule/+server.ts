import { json, error } from '@sveltejs/kit';
import { ARTICLES } from '$lib/articles-data';
import { readSchedule } from '$lib/server/posting';

export const prerender = false;

// GET /api/admin/schedule (the morning schedule job, scripts/sync_schedule.py): the publish dates set in /admin that
// differ from the dates this build was made with. The job writes them into index.json; the commit rebuilds the site.
export const GET = async ({ platform }) => {
  const db = platform?.env?.DB;
  if (!db) error(503, 'No database bound');
  const built = new Map(ARTICLES.map((a) => [a.slug, a.date]));
  const changes = (await readSchedule(db)).filter((s) => built.has(s.slug) && built.get(s.slug) !== s.publish_date);
  return json({ changes });
};
