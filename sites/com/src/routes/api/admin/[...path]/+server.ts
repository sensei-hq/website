import { error } from '@sveltejs/kit';
import { apiRoutes } from '@senseihq/emaki-posting/sveltekit';
import { deskFor, type DeskPlatform } from '$lib/server/desk.js';

export const prerender = false;

// /api/admin/* (the stager on the Mac, the poster on GitHub, the schedule job): queue, posted, stage,
// production, schedule, requests and media up/download, per the desk in @senseihq/emaki-posting.
const routes = apiRoutes((event) => {
  const sub = event.params.path ?? '';
  const method = event.request.method;
  const platform = event.platform as DeskPlatform | undefined;
  const needsDb = !(sub.startsWith('media/') && method === 'GET');
  const needsMedia = sub.startsWith('media/') || sub === 'stage';
  if ((needsDb && !platform?.env?.DB) || (needsMedia && !platform?.env?.MEDIA)) error(503, 'No database or media bucket bound');
  return deskFor(platform);
});

export const GET = routes.GET;
export const POST = routes.POST;
export const PUT = routes.PUT;
