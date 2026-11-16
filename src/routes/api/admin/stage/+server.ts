import { json, error } from '@sveltejs/kit';
import { ARTICLES } from '$lib/articles-data';
import { isChannel, stage, validKey, type StagedPost } from '$lib/server/posting';

export const prerender = false;

// POST /api/admin/stage (the stager, films/tools/stage.py): the post for one article and channel, as it will go out.
// Every media file it names must already be uploaded, with the same sha256. Restaging changes the fingerprint, so
// any earlier approval no longer applies.
export const POST = async ({ platform, request, locals }) => {
  const db = platform?.env?.DB, media = platform?.env?.MEDIA;
  if (!db || !media) error(503, 'No database or media bucket bound');
  const b = (await request.json()) as { slug: string; channel: string; post: StagedPost };
  if (!ARTICLES.some((a) => a.slug === b.slug)) error(400, `No article "${b.slug}" in the index`);
  if (!isChannel(b.channel) || !b.post || !Array.isArray(b.post.media)) error(400, 'channel and post.media are required');
  for (const m of b.post.media) {
    if (!validKey(m.key) || !m.key.startsWith(`${b.slug}/`)) error(400, `Bad media key ${m.key}`);
    const head = await media.head(m.key);
    if (!head || head.customMetadata?.sha256 !== m.sha256) error(400, `${m.key} is not uploaded with that sha256`);
  }
  const sha = await stage(db, locals.caller!.id, b.slug, b.channel, b.post);
  return json({ ok: true, content_sha: sha });
};
