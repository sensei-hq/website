// Who is calling /admin and /api/admin. Cloudflare Access sits in front of those paths (the Access application's
// policies decide who reaches the site at all); this checks again in the worker, and fails closed:
//   - a person: a valid Access token (Cf-Access-Jwt-Assertion) signed by the team's keys, for this app's audience,
//     unexpired, naming an email in ADMIN_EMAILS;
//   - a machine: the same token issued to an Access service token, whose client id is in STAGER_CLIENT_IDS (the Mac
//     that uploads finished media and post text) or POSTER_CLIENT_IDS (the GitHub job that posts approved pieces).
// Without CF_ACCESS_TEAM_DOMAIN + CF_ACCESS_AUD the deployed site refuses everything here; only `vite dev` lets a
// local admin in. Same scheme as katachi/app/src/lib/server/access.ts, with machine roles added.

export type Role = 'admin' | 'stager' | 'poster';
export interface Caller { role: Role; id: string }
export interface AccessConfig { teamDomain?: string; aud?: string; emails?: string; stagers?: string; posters?: string }

type Jwk = JsonWebKey & { kid?: string };
let certs: { url: string; keys: Jwk[]; at: number } | null = null;

const b64 = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), (c) => c.charCodeAt(0));
const part = (s: string) => JSON.parse(new TextDecoder().decode(b64(s)));
const list = (raw?: string) => (raw ?? '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);

export const isAdminPath = (path: string) => path === '/admin' || path.startsWith('/admin/') || path.startsWith('/api/admin/');
export const accessConfigured = (c: AccessConfig) => Boolean(c.teamDomain && c.aud);

async function keys(teamDomain: string, fetchFn: typeof fetch, now: number): Promise<Jwk[]> {
  const url = `https://${teamDomain.replace(/^https?:\/\//, '').replace(/\/$/, '')}/cdn-cgi/access/certs`;
  if (certs && certs.url === url && now - certs.at < 3_600_000) return certs.keys;
  const r = await fetchFn(url);
  if (!r.ok) throw new Error(`Access certs ${r.status}`);
  certs = { url, keys: ((await r.json()) as { keys: Jwk[] }).keys, at: now };
  return certs.keys;
}

/** The caller behind a valid Access token for this app, or null. */
export async function verifyCaller(token: string | null, c: AccessConfig, fetchFn: typeof fetch = fetch, now = Date.now()): Promise<Caller | null> {
  if (!token || !accessConfigured(c)) return null;
  const [h, p, s] = token.split('.');
  if (!h || !p || !s) return null;
  try {
    const head = part(h), claims = part(p);
    if (head.alg !== 'RS256') return null;
    const aud: string[] = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (!aud.some((a) => list(c.aud).includes(String(a).toLowerCase()))) return null;
    if (typeof claims.exp !== 'number' || claims.exp * 1000 < now) return null;
    const team = c.teamDomain!.replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (claims.iss && String(claims.iss).replace(/^https?:\/\//, '').replace(/\/$/, '') !== team) return null;
    let caller: Caller | null = null;
    const email = String(claims.email ?? '').toLowerCase();
    const cn = String(claims.common_name ?? '').toLowerCase();
    if (email && list(c.emails).includes(email)) caller = { role: 'admin', id: email };
    else if (!email && cn && list(c.stagers).includes(cn)) caller = { role: 'stager', id: cn };
    else if (!email && cn && list(c.posters).includes(cn)) caller = { role: 'poster', id: cn };
    if (!caller) return null;
    const jwk = (await keys(c.teamDomain!, fetchFn, now)).find((k) => k.kid === head.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64(s), new TextEncoder().encode(`${h}.${p}`));
    return ok ? caller : null;
  } catch {
    return null;
  }
}

/** Which roles may use a path (and method). People: everything. Machines: only their own endpoints. */
export function allowed(role: Role, path: string, method: string): boolean {
  if (role === 'admin') return true;
  // The Mac: upload media, stage posts, report what is produced, read and answer motion requests.
  if (role === 'stager') return (path.startsWith('/api/admin/media/') && method === 'PUT') || (path === '/api/admin/stage' && method === 'POST') ||
    (path === '/api/admin/production' && method === 'POST') || (path === '/api/admin/requests' && (method === 'GET' || method === 'POST'));
  // GitHub: read the approved queue and the posting order, download media, report outcomes.
  if (role === 'poster') return (path === '/api/admin/queue' && method === 'GET') || (path === '/api/admin/posted' && method === 'POST') ||
    (path.startsWith('/api/admin/media/') && method === 'GET') || (path === '/api/admin/schedule' && method === 'GET');
  return false;
}

/** for tests: forget the cached keys */
export function resetAccessCache() { certs = null; }
