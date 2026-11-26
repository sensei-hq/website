import type { Caller } from '@senseihq/emaki-posting';
import type { D1, R2 } from '@senseihq/emaki-posting/cloudflare';

declare global {
  namespace App {
    // The public site is prerendered; only /admin and /api/admin run on the server (hooks.server.ts).
    interface Locals { caller?: Caller }
    /** Cloudflare bindings (wrangler.jsonc): DB = D1 (approvals, posts, audit), MEDIA = R2 (staged videos, slides). */
    interface Platform { env?: { DB?: D1; MEDIA?: R2 }; ctx?: { waitUntil(p: Promise<unknown>): void } }
  }
}

// @rokkit/states ships JS source; its package `types` points at an unpublished
// dist/, so it resolves untyped here. Shim until rokkit ships declarations.
declare module '@rokkit/states';

// @rokkit/ui's ButtonProps lacks `rel`; `rel="noopener"` is required on
// target="_blank" links. Augment until rokkit adds it upstream.
declare module '@rokkit/ui' {
  interface ButtonProps {
    rel?: string;
  }
}

export {};
