import { mediaRoute } from '@senseihq/emaki-posting/sveltekit';
import { deskFor } from '$lib/server/desk.js';

export const prerender = false;

// /m/<key>?exp=…&sig=…: one staged media file, public only with a valid, unexpired signature (an hour, issued to the
// poster by /api/admin/queue), because Instagram fetches media from a URL. The bucket itself stays private.
export const { GET } = mediaRoute((event) => deskFor(event.platform as never));
