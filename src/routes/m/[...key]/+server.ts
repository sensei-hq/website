import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { checkSignature, validKey } from '$lib/server/posting';

export const prerender = false;

// /m/<key>?exp=…&sig=…: one staged media file, public only with a valid, unexpired signature (an hour, issued to the
// poster by /api/admin/queue), because Instagram fetches media from a URL. The bucket itself stays private.
export const GET = async ({ platform, params, url }) => {
  const media = platform?.env?.MEDIA;
  if (!media || !validKey(params.key)) error(404, 'Not found');
  if (!(await checkSignature(params.key, url.searchParams.get('exp') ?? '', url.searchParams.get('sig') ?? '', env.MEDIA_URL_SECRET ?? ''))) error(404, 'Not found');
  const obj = await media.get(params.key);
  if (!obj) error(404, 'Not found');
  return new Response(obj.body, { headers: { 'content-type': obj.httpMetadata?.contentType ?? 'application/octet-stream', 'content-length': String(obj.size), 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex' } });
};
