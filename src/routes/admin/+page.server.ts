import { fail } from '@sveltejs/kit';
import { ARTICLES, PRODUCT_NAMES, today } from '$lib/articles-data';
import { FILMS } from '$lib/motion/films';
import {
  addRequest, approve, channelState, CHANNELS, effectiveDates, isChannel, makeNext, readAll, readProduction, readRequests,
  recentAudit, revoke, setDates, setPaused, setRequestStatus, type Channel,
} from '$lib/server/posting';

// /admin (Jerry only): the plan (order, scripts, what is produced), the next piece with everything that will go out,
// approvals per channel, motion requests to Muse, the pause switch and the audit log.
const expected = (video?: string): Channel[] => (video === 'short' ? [...CHANNELS] : ['youtube', 'instagram_reel', 'x']);
const films = new Set(FILMS.map((f) => f.slug));

export const load = async ({ platform, locals }) => {
  const db = platform?.env?.DB;
  const t = today();
  const all = db ? await readAll(db) : { staged: [], approvals: [], posts: [], paused: true, schedule: [] };
  const production = db ? await readProduction(db) : [];
  const requests = db ? await readRequests(db) : [];
  const dates = effectiveDates(ARTICLES, all.schedule);
  const plan = ARTICLES.map((a) => {
    const date = dates.get(a.slug)!;
    const channels = expected(a.video).map((c) => {
      const staged = all.staged.find((s) => s.slug === a.slug && s.channel === c);
      const approvals = all.approvals.filter((x) => x.slug === a.slug && x.channel === c);
      const posts = all.posts.filter((p) => p.slug === a.slug && p.channel === c);
      const posted = posts.filter((p) => p.status === 'posted').at(-1);
      return { channel: c, state: channelState(staged, approvals, posts), staged: staged ?? null, url: posted?.url ?? null, last: posts.at(-1) ?? null };
    });
    const prod = production.find((p) => p.slug === a.slug);
    const motion = films.has(a.slug) || films.has(`short-${a.slug}`) || !!prod?.status.motion;
    return {
      slug: a.slug, title: a.title, dek: a.dek, date, built: a.date, moved: date !== a.date, app: PRODUCT_NAMES[a.product],
      video: a.video ?? 'wide', live: a.date <= t, channels,
      points: a.sections.map((s) => ({ title: s.title, points: s.points ?? [] })),
      script: prod?.script ?? null, status: { ...(prod?.status ?? {}), motion }, reported: prod?.updated_at ?? null,
      requests: requests.filter((r) => r.slug === a.slug && !r.parent).map((r) => ({ ...r, thread: requests.filter((x) => x.parent === r.id) })),
    };
  }).sort((x, y) => x.date.localeCompare(y.date) || x.slug.localeCompare(y.slug));
  const next = plan.find((r) => r.date >= t && r.channels.some((c) => c.state !== 'posted')) ?? null;
  return { who: locals.caller?.id, ready: !!db, today: t, paused: all.paused, plan, next, audit: db ? await recentAudit(db) : [] };
};

const who = (locals: App.Locals) => locals.caller?.id ?? 'unknown';
const noDb = () => fail(503, { error: 'No database bound' });
export const actions = {
  approve: async ({ request, platform, locals }) => {
    const db = platform?.env?.DB; if (!db) return noDb();
    const f = await request.formData();
    const slug = String(f.get('slug')), items = f.getAll('item').map(String);
    let n = 0;
    for (const item of items) {
      const [channel, sha] = item.split(':');
      if (isChannel(channel) && (await approve(db, who(locals), slug, channel, sha))) n++;
    }
    return n === items.length ? { ok: `Approved ${n}` } : fail(409, { error: `Approved ${n} of ${items.length}: the rest changed since this page loaded. Reload and check again.` });
  },
  revoke: async ({ request, platform, locals }) => {
    const db = platform?.env?.DB; if (!db) return noDb();
    const f = await request.formData();
    const channel = String(f.get('channel'));
    if (!isChannel(channel)) return fail(400, { error: 'Bad channel' });
    await revoke(db, who(locals), String(f.get('slug')), channel);
    return { ok: 'Approval withdrawn' };
  },
  next: async ({ request, platform, locals }) => {
    const db = platform?.env?.DB; if (!db) return noDb();
    const slug = String((await request.formData()).get('slug'));
    const all = await readAll(db);
    const moved = makeNext(effectiveDates(ARTICLES, all.schedule), slug, today());
    if (!moved.size) return fail(400, { error: 'That piece is already next, or already published.' });
    await setDates(db, who(locals), moved, `make next: ${slug}`);
    return { ok: `Moved ${slug} to ${moved.get(slug)}; ${moved.size - 1} other piece(s) moved down one slot. The site picks up the new order at the morning rebuild.` };
  },
  request: async ({ request, platform, locals }) => {
    const db = platform?.env?.DB; if (!db) return noDb();
    const f = await request.formData();
    const slug = String(f.get('slug')), kind = String(f.get('kind') || 'edit'), body = String(f.get('body') ?? '').trim();
    if (!ARTICLES.some((a) => a.slug === slug)) return fail(400, { error: 'No such article' });
    if (!body && kind !== 'generate') return fail(400, { error: 'Say what to change' });
    await addRequest(db, who(locals), slug, ['generate', 'edit', 'note'].includes(kind) ? kind : 'edit', body || 'Generate the motion for this piece from its script.');
    return { ok: 'Sent to Muse. Its replies appear in the thread.' };
  },
  reply: async ({ request, platform, locals }) => {
    const db = platform?.env?.DB; if (!db) return noDb();
    const f = await request.formData();
    const id = Number(f.get('id')), body = String(f.get('body') ?? '').trim();
    const parent = (await readRequests(db)).find((r) => r.id === id && !r.parent);
    if (!parent) return fail(404, { error: 'No such request' });
    if (body) await addRequest(db, who(locals), parent.slug, 'note', body, id);
    if (f.get('status')) await setRequestStatus(db, who(locals), id, String(f.get('status')));
    return { ok: 'Saved' };
  },
  pause: async ({ platform, locals }) => {
    const db = platform?.env?.DB; if (!db) return noDb();
    await setPaused(db, who(locals), true);
    return { ok: 'Posting paused' };
  },
  resume: async ({ platform, locals }) => {
    const db = platform?.env?.DB; if (!db) return noDb();
    await setPaused(db, who(locals), false);
    return { ok: 'Posting resumed' };
  },
};
