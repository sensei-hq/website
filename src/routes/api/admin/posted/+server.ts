import { json, error } from '@sveltejs/kit';
import { isChannel, recordPost } from '$lib/server/posting';

export const prerender = false;

// POST /api/admin/posted (the poster): the outcome of one post, for the timeline and the audit log.
export const POST = async ({ platform, request, locals }) => {
  const db = platform?.env?.DB;
  if (!db) error(503, 'No database bound');
  const b = (await request.json()) as Record<string, string>;
  if (!b.slug || !isChannel(b.channel) || !b.content_sha || !['posted', 'dry-run', 'failed'].includes(b.status)) error(400, 'slug, channel, content_sha and status are required');
  await recordPost(db, locals.caller!.id, { slug: b.slug, channel: b.channel, content_sha: b.content_sha, status: b.status as 'posted', url: b.url, external_id: b.external_id, detail: b.detail?.slice(0, 2000), run: b.run });
  return json({ ok: true });
};
