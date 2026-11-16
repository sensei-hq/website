// Posting state in D1, and the rules for what may go out. The rules are plain functions (tested in posting.spec.ts);
// the queries below only read and write rows.

export const CHANNELS = ['youtube', 'instagram_reel', 'instagram_carousel', 'x'] as const;
export type Channel = (typeof CHANNELS)[number];
export const CHANNEL_NAMES: Record<Channel, string> = { youtube: 'YouTube', instagram_reel: 'Instagram Reel', instagram_carousel: 'Instagram carousel', x: 'X' };
export const isChannel = (c: string): c is Channel => (CHANNELS as readonly string[]).includes(c);

// Minimal D1 / R2 shapes (the Cloudflare bindings), so this file needs no Cloudflare types package.
export interface D1Stmt { bind(...v: unknown[]): D1Stmt; all<T = Record<string, unknown>>(): Promise<{ results: T[] }>; first<T = Record<string, unknown>>(): Promise<T | null>; run(): Promise<unknown> }
export interface D1 { prepare(sql: string): D1Stmt; batch(s: D1Stmt[]): Promise<unknown> }
export interface R2Object { body: ReadableStream; size: number; httpMetadata?: { contentType?: string }; customMetadata?: Record<string, string> }
export interface R2 {
  get(key: string): Promise<R2Object | null>;
  head(key: string): Promise<{ size: number; customMetadata?: Record<string, string> } | null>;
  put(key: string, body: ReadableStream | ArrayBuffer, o?: { httpMetadata?: { contentType?: string }; customMetadata?: Record<string, string>; sha256?: string }): Promise<unknown>;
}

export interface MediaRef { key: string; sha256: string; type: string }
export interface StagedPost {
  title?: string; description?: string; tags?: string[];      // youtube
  caption?: string;                                           // instagram
  text?: string; thread?: string[];                           // x
  short?: boolean;                                            // youtube: a Short (9:16) or a regular video
  media: MediaRef[];
}
export interface StagedRow { slug: string; channel: Channel; post: StagedPost; content_sha: string; staged_by: string; staged_at: string }
export interface ApprovalRow { id: number; slug: string; channel: Channel; content_sha: string; approved_by: string; approved_at: string; revoked_at: string | null }
export interface PostRow { id: number; slug: string; channel: Channel; content_sha: string; status: 'posted' | 'dry-run' | 'failed'; url: string | null; external_id: string | null; detail: string | null; run: string | null; at: string }

const enc = new TextEncoder();
export async function sha256(data: string | ArrayBuffer): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', typeof data === 'string' ? enc.encode(data) : data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
/** JSON with sorted keys, so the same post always fingerprints the same. */
export function canonical(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(canonical).join(',')}]`;
  if (v && typeof v === 'object') return `{${Object.keys(v as object).sort().map((k) => `${JSON.stringify(k)}:${canonical((v as Record<string, unknown>)[k])}`).join(',')}}`;
  return JSON.stringify(v ?? null);
}
/** The fingerprint an approval is given for: the channel and everything that goes out on it, media by sha256. */
export const contentSha = (channel: Channel, post: StagedPost) => sha256(canonical({ channel, post }));

// ── Rules ────────────────────────────────────────────────────────────────────────────────────────────────

export type ChannelState = 'not-staged' | 'awaiting' | 'changed' | 'approved' | 'posted' | 'failed';
/** Where one article's channel stands. An approval counts only for the exact content now staged. */
export function channelState(staged: StagedRow | undefined, approvals: ApprovalRow[], posts: PostRow[]): ChannelState {
  if (posts.some((p) => p.status === 'posted')) return 'posted';
  if (!staged) return 'not-staged';
  const live = approvals.filter((a) => !a.revoked_at);
  if (live.some((a) => a.content_sha === staged.content_sha)) {
    const last = posts.filter((p) => p.content_sha === staged.content_sha).at(-1);
    return last?.status === 'failed' ? 'failed' : 'approved';
  }
  return live.length ? 'changed' : 'awaiting';
}

/** What the poster may post now: approved for the staged content, not yet posted, article date reached, not paused. */
export function due(
  rows: { slug: string; date: string; planned?: string; staged: StagedRow[]; approvals: ApprovalRow[]; posts: PostRow[] }[],
  today: string, paused: boolean,
): StagedRow[] {
  if (paused) return [];
  const out: StagedRow[] = [];
  for (const r of rows) {
    // `date` is the article's date as built (it is live on the site); `planned` is the date set in /admin. Both must
    // have come, so nothing is posted for an article the site has not published yet.
    if (r.date > today || (r.planned ?? r.date) > today) continue;
    for (const s of r.staged) {
      const state = channelState(s, r.approvals.filter((a) => a.channel === s.channel), r.posts.filter((p) => p.channel === s.channel));
      if (state === 'approved') out.push(s);
    }
  }
  return out;
}

/** A short-lived, signed public URL for one media file (Instagram fetches media from a URL). */
export async function signMedia(key: string, secret: string, origin: string, ttl = 3600, now = Date.now()) {
  const exp = Math.floor(now / 1000) + ttl;
  const sig = await hmac(secret, `${key}:${exp}`);
  return `${origin}/m/${key.split('/').map(encodeURIComponent).join('/')}?exp=${exp}&sig=${sig}`;
}
export async function checkSignature(key: string, exp: string, sig: string, secret: string, now = Date.now()) {
  if (!secret || !/^\d+$/.test(exp) || Number(exp) * 1000 < now) return false;
  const want = await hmac(secret, `${key}:${exp}`);
  if (want.length !== sig.length) return false;
  let d = 0; for (let i = 0; i < want.length; i++) d |= want.charCodeAt(i) ^ sig.charCodeAt(i);
  return d === 0;
}
async function hmac(secret: string, msg: string) {
  const k = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const s = await crypto.subtle.sign('HMAC', k, enc.encode(msg));
  return [...new Uint8Array(s)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Media keys: <slug>/<file>, lower-case, no path tricks. */
export const validKey = (k: string) => /^[a-z0-9-]+\/[a-z0-9._-]+$/.test(k) && !k.includes('..');

// ── Queries ──────────────────────────────────────────────────────────────────────────────────────────────

const nowIso = () => new Date().toISOString();
const parse = (r: Record<string, unknown>): StagedRow => ({ ...(r as unknown as StagedRow), post: JSON.parse(String(r.post)) });

export async function readAll(db: D1) {
  const [staged, approvals, posts, settings, schedule] = await Promise.all([
    db.prepare('SELECT * FROM staged').all(),
    db.prepare('SELECT * FROM approvals ORDER BY id').all<ApprovalRow>(),
    db.prepare('SELECT * FROM posts ORDER BY id').all<PostRow>(),
    db.prepare('SELECT key, value FROM settings').all<{ key: string; value: string }>(),
    db.prepare('SELECT slug, publish_date FROM schedule').all<{ slug: string; publish_date: string }>(),
  ]);
  return {
    staged: staged.results.map(parse),
    approvals: approvals.results,
    posts: posts.results,
    paused: (settings.results.find((s) => s.key === 'paused')?.value ?? '1') !== '0',
    schedule: schedule.results,
  };
}
export const recentAudit = (db: D1, n = 40) =>
  db.prepare('SELECT * FROM audit ORDER BY id DESC LIMIT ?').bind(n).all<{ id: number; at: string; actor: string; action: string; slug: string | null; channel: string | null; detail: string | null }>().then((r) => r.results);

export const audit = (db: D1, actor: string, action: string, slug?: string | null, channel?: string | null, detail?: string) =>
  db.prepare('INSERT INTO audit (at, actor, action, slug, channel, detail) VALUES (?, ?, ?, ?, ?, ?)').bind(nowIso(), actor, action, slug ?? null, channel ?? null, detail ?? null).run();

export async function stage(db: D1, actor: string, slug: string, channel: Channel, post: StagedPost) {
  const sha = await contentSha(channel, post);
  await db.prepare('INSERT INTO staged (slug, channel, post, content_sha, staged_by, staged_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (slug, channel) DO UPDATE SET post = excluded.post, content_sha = excluded.content_sha, staged_by = excluded.staged_by, staged_at = excluded.staged_at')
    .bind(slug, channel, JSON.stringify(post), sha, actor, nowIso()).run();
  await audit(db, actor, 'stage', slug, channel, sha.slice(0, 12));
  return sha;
}
export async function approve(db: D1, actor: string, slug: string, channel: Channel, contentShaSeen: string) {
  const row = await db.prepare('SELECT content_sha FROM staged WHERE slug = ? AND channel = ?').bind(slug, channel).first<{ content_sha: string }>();
  // Approve only what the page showed: if it was restaged in between, nothing is approved.
  if (!row || row.content_sha !== contentShaSeen) return false;
  await db.prepare('INSERT INTO approvals (slug, channel, content_sha, approved_by, approved_at) VALUES (?, ?, ?, ?, ?)').bind(slug, channel, row.content_sha, actor, nowIso()).run();
  await audit(db, actor, 'approve', slug, channel, row.content_sha.slice(0, 12));
  return true;
}
export async function revoke(db: D1, actor: string, slug: string, channel: Channel) {
  await db.prepare('UPDATE approvals SET revoked_at = ? WHERE slug = ? AND channel = ? AND revoked_at IS NULL').bind(nowIso(), slug, channel).run();
  await audit(db, actor, 'revoke', slug, channel);
}
export async function setPaused(db: D1, actor: string, paused: boolean) {
  await db.prepare("INSERT INTO settings (key, value) VALUES ('paused', ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value").bind(paused ? '1' : '0').run();
  await audit(db, actor, paused ? 'pause' : 'resume');
}
export async function recordPost(db: D1, actor: string, p: { slug: string; channel: Channel; content_sha: string; status: PostRow['status']; url?: string; external_id?: string; detail?: string; run?: string }) {
  await db.prepare('INSERT INTO posts (slug, channel, content_sha, status, url, external_id, detail, run, at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(p.slug, p.channel, p.content_sha, p.status, p.url ?? null, p.external_id ?? null, p.detail ?? null, p.run ?? null, nowIso()).run();
  await audit(db, actor, p.status === 'posted' ? 'posted' : p.status, p.slug, p.channel, p.url ?? p.detail);
}

// ── Planning: order, production, requests ────────────────────────────────────────────────────────────────

/** Each article's publish date as set in /admin, else as built from index.json. */
export function effectiveDates(articles: { slug: string; date: string }[], overrides: { slug: string; publish_date: string }[]) {
  const o = new Map(overrides.map((r) => [r.slug, r.publish_date]));
  return new Map(articles.map((a) => [a.slug, o.get(a.slug) ?? a.date]));
}

/**
 * "Make next": `slug` takes the first upcoming publishing slot and every other upcoming article moves down one slot.
 * The slots (dates) stay where they are; only which article sits in each changes. Upcoming = dated after today.
 * Returns the new date of every article that moves.
 */
export function makeNext(dates: Map<string, string>, slug: string, today: string): Map<string, string> {
  const upcoming = [...dates].filter(([, d]) => d > today).sort((a, b) => a[1].localeCompare(b[1]) || a[0].localeCompare(b[0]));
  if (!upcoming.some(([s]) => s === slug)) return new Map();
  const slots = upcoming.map(([, d]) => d);
  const order = [slug, ...upcoming.map(([s]) => s).filter((s) => s !== slug)];
  const moved = new Map<string, string>();
  order.forEach((s, i) => { if (dates.get(s) !== slots[i]) moved.set(s, slots[i]); });
  return moved;
}

export interface Production { motion?: boolean; film?: boolean; takes?: number; takesNeeded?: number; render?: boolean; short?: boolean; carousel?: number }

export const readSchedule = (db: D1) => db.prepare('SELECT slug, publish_date FROM schedule').all<{ slug: string; publish_date: string }>().then((r) => r.results);
export async function setDates(db: D1, actor: string, moved: Map<string, string>, why: string) {
  if (!moved.size) return;
  const now = nowIso();
  await db.batch([...moved].map(([slug, d]) => db.prepare('INSERT INTO schedule (slug, publish_date, set_by, set_at) VALUES (?, ?, ?, ?) ON CONFLICT (slug) DO UPDATE SET publish_date = excluded.publish_date, set_by = excluded.set_by, set_at = excluded.set_at').bind(slug, d, actor, now)));
  await audit(db, actor, 'reorder', null, null, `${why}: ${[...moved].map(([s, d]) => `${s}→${d}`).join(', ')}`.slice(0, 1900));
}
export const readProduction = (db: D1) =>
  db.prepare('SELECT slug, script, status, updated_at FROM production').all<{ slug: string; script: string | null; status: string; updated_at: string }>()
    .then((r) => r.results.map((x) => ({ ...x, status: JSON.parse(x.status) as Production })));
export const saveProduction = (db: D1, slug: string, script: string | null, status: Production) =>
  db.prepare('INSERT INTO production (slug, script, status, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT (slug) DO UPDATE SET script = excluded.script, status = excluded.status, updated_at = excluded.updated_at')
    .bind(slug, script, JSON.stringify(status), nowIso()).run();

export interface RequestRow { id: number; slug: string; kind: string; body: string; author: string; at: string; status: string; parent: number | null }
export const readRequests = (db: D1, openOnly = false) =>
  db.prepare(`SELECT * FROM requests ${openOnly ? "WHERE parent IS NULL AND status != 'done'" : ''} ORDER BY id`).all<RequestRow>().then((r) => r.results);
export async function addRequest(db: D1, actor: string, slug: string, kind: string, body: string, parent: number | null = null) {
  await db.prepare('INSERT INTO requests (slug, kind, body, author, at, parent) VALUES (?, ?, ?, ?, ?, ?)').bind(slug, kind, body.slice(0, 4000), actor, nowIso(), parent).run();
  await audit(db, actor, parent ? 'reply' : `request:${kind}`, slug, null, body.slice(0, 200));
}
export async function setRequestStatus(db: D1, actor: string, id: number, status: string) {
  await db.prepare('UPDATE requests SET status = ? WHERE id = ?').bind(status, id).run();
  await audit(db, actor, `request:${status}`, null, null, `#${id}`);
}
