import { json, error } from '@sveltejs/kit';
import { audit, sha256, validKey } from '$lib/server/posting';

export const prerender = false;
const TYPES: Record<string, string> = { mp4: 'video/mp4', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', srt: 'text/plain; charset=utf-8', vtt: 'text/vtt' };
const MAX = 95 * 1024 * 1024; // under the Workers request-body limit

// GET (Jerry's previews, the poster's download) and PUT (the stager's upload) of one staged media file in R2.
// PUT must send X-Content-Sha256; the body is checked against it before it is stored.
export const GET = async ({ platform, params }) => {
  const media = platform?.env?.MEDIA;
  if (!media) error(503, 'No media bucket bound');
  if (!validKey(params.key)) error(400, 'Bad key');
  const obj = await media.get(params.key);
  if (!obj) error(404, 'Not found');
  return new Response(obj.body, { headers: { 'content-type': obj.httpMetadata?.contentType ?? 'application/octet-stream', 'content-length': String(obj.size), 'x-content-sha256': obj.customMetadata?.sha256 ?? '' } });
};

export const PUT = async ({ platform, params, request, locals }) => {
  const media = platform?.env?.MEDIA, db = platform?.env?.DB;
  if (!media || !db) error(503, 'No media bucket or database bound');
  if (!validKey(params.key)) error(400, 'Bad key: <slug>/<file>, lower-case');
  const want = (request.headers.get('x-content-sha256') ?? '').toLowerCase();
  const body = await request.arrayBuffer();
  if (body.byteLength > MAX) error(413, 'Too large');
  const got = await sha256(body);
  if (!want || got !== want) error(400, `sha256 mismatch (got ${got})`);
  const ext = params.key.split('.').pop() ?? '';
  await media.put(params.key, body, { httpMetadata: { contentType: TYPES[ext] ?? 'application/octet-stream' }, customMetadata: { sha256: got } });
  await audit(db, locals.caller!.id, 'upload', params.key.split('/')[0], null, `${params.key} ${got.slice(0, 12)}`);
  return json({ ok: true, key: params.key, sha256: got, bytes: body.byteLength });
};
