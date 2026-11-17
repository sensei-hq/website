import { fail } from '@sveltejs/kit';
import { ARTICLES, PRODUCT_NAMES, today } from '$lib/articles-data';
import { FILMS } from '$lib/motion/films';
import { deskFor } from '$lib/server/desk.js';

// /admin (Jerry only): the plan (order, scripts, what is produced), the next piece with everything that will go out,
// approvals per channel, motion requests to Muse, the pause switch and the audit log.
const films = new Set(FILMS.map((f) => f.slug));
const articles = new Map(ARTICLES.map((a) => [a.slug, a]));

export const load = async ({ platform, locals }) => {
  const db = platform?.env?.DB;
  if (!db) return { who: locals.caller?.id, ready: false, today: today(), paused: true, plan: [], next: null, audit: [] };
  const desk = deskFor(platform).desk;
  const d = await desk.plan();
  const plan = d.plan.map((r) => {
    const a = articles.get(r.slug)!;
    const motion = films.has(r.slug) || films.has(`short-${r.slug}`) || !!r.status.motion;
    return {
      ...r, dek: a.dek, app: PRODUCT_NAMES[a.product],
      points: a.sections.map((s) => ({ title: s.title, points: s.points ?? [] })),
      status: { ...r.status, motion },
    };
  });
  const next = d.next ? (plan.find((r) => r.slug === d.next!.slug) ?? null) : null;
  return { who: locals.caller?.id, ready: true, today: d.today, paused: d.paused, plan, next, audit: d.audit };
};

const who = (locals: App.Locals) => locals.caller?.id ?? 'unknown';
const noDb = () => fail(503, { error: 'No database bound' });
type DeskResult = { ok: string; status?: undefined; error?: undefined } | { status: number; error: string; ok?: undefined };
const failed = (r: DeskResult): r is Extract<DeskResult, { error: string }> => !!r.error;
const err = (r: Extract<DeskResult, { error: string }>) => fail(r.status, { error: r.error });
export const actions = {
  approve: async ({ request, platform, locals }) => {
    if (!platform?.env?.DB) return noDb();
    const f = await request.formData();
    const r = await (deskFor(platform).desk).approve(who(locals), String(f.get('slug')), f.getAll('item').map(String));
    return failed(r) ? err(r) : r;
  },
  revoke: async ({ request, platform, locals }) => {
    if (!platform?.env?.DB) return noDb();
    const f = await request.formData();
    const r = await (deskFor(platform).desk).revoke(who(locals), String(f.get('slug')), String(f.get('channel')));
    return failed(r) ? err(r) : r;
  },
  next: async ({ request, platform, locals }) => {
    if (!platform?.env?.DB) return noDb();
    const slug = String((await request.formData()).get('slug'));
    const r = await (deskFor(platform).desk).makeNext(who(locals), slug);
    if (failed(r)) return err(r);
    return { ok: `${r.ok}. The site picks up the new order at the morning rebuild.` };
  },
  request: async ({ request, platform, locals }) => {
    if (!platform?.env?.DB) return noDb();
    const f = await request.formData();
    const slug = String(f.get('slug'));
    if (!articles.has(slug)) return fail(400, { error: 'No such article' });
    const r = await (deskFor(platform).desk).request(who(locals), slug, String(f.get('kind') || 'edit'), String(f.get('body') ?? ''));
    if (failed(r)) return err(r);
    return { ok: 'Sent to Muse. Its replies appear in the thread.' };
  },
  reply: async ({ request, platform, locals }) => {
    if (!platform?.env?.DB) return noDb();
    const f = await request.formData();
    const r = await (deskFor(platform).desk).reply(who(locals), Number(f.get('id')), String(f.get('body') ?? ''), String(f.get('status') || ''));
    return failed(r) ? err(r) : r;
  },
  pause: async ({ platform, locals }) => {
    if (!platform?.env?.DB) return noDb();
    return (deskFor(platform).desk).pause(who(locals));
  },
  resume: async ({ platform, locals }) => {
    if (!platform?.env?.DB) return noDb();
    return (deskFor(platform).desk).resume(who(locals));
  },
};
