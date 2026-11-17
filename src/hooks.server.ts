import { type Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { postingHandle } from '@senseihq/emaki-posting/sveltekit';

// The public site is prerendered; only /admin and /api/admin run here. Each request there must carry a valid
// Cloudflare Access token for a person in ADMIN_EMAILS or one of the two service tokens, and may only use what its
// role allows. Everything else is refused.
export const handle: Handle = postingHandle({ env: () => env, dev }) as unknown as Handle;
