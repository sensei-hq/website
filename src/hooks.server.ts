import { json, type Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { accessConfigured, allowed, isAdminPath, verifyCaller } from '$lib/server/access';

// The public site is prerendered; only /admin and /api/admin run here. Each request there must carry a valid
// Cloudflare Access token for a person in ADMIN_EMAILS or one of the two service tokens, and may only use what its
// role allows (see access.ts). Everything else is refused.
export const handle: Handle = async ({ event, resolve }) => {
  const path = event.url.pathname;
  if (!isAdminPath(path)) return resolve(event);
  const config = {
    teamDomain: env.CF_ACCESS_TEAM_DOMAIN, aud: env.CF_ACCESS_AUD, emails: env.ADMIN_EMAILS,
    stagers: env.STAGER_CLIENT_IDS, posters: env.POSTER_CLIENT_IDS,
  };
  const caller = accessConfigured(config)
    ? await verifyCaller(event.request.headers.get('cf-access-jwt-assertion'), config)
    : dev ? { role: 'admin' as const, id: 'dev@localhost' } : null;
  const api = path.startsWith('/api/');
  if (!caller || !allowed(caller.role, path, event.request.method)) {
    return api ? json({ ok: false, reason: 'Not allowed' }, { status: 403 }) : new Response('Not allowed', { status: 403 });
  }
  event.locals.caller = caller;
  const res = await resolve(event);
  res.headers.set('cache-control', 'no-store');
  res.headers.set('x-robots-tag', 'noindex');
  return res;
};
