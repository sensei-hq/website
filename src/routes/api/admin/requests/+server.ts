import { json, error } from '@sveltejs/kit';
import { addRequest, readRequests, setRequestStatus } from '$lib/server/posting';

export const prerender = false;

// The motion requests from /admin, for Muse on the Mac (films/tools/stage.py requests / reply).
// GET: the open requests with their threads. POST { id, reply?, status? }: answer one, and/or mark it working or done.
export const GET = async ({ platform }) => {
  const db = platform?.env?.DB;
  if (!db) error(503, 'No database bound');
  const all = await readRequests(db);
  const open = all.filter((r) => !r.parent && r.status !== 'done');
  return json({ requests: open.map((r) => ({ ...r, thread: all.filter((x) => x.parent === r.id) })) });
};

export const POST = async ({ platform, request, locals }) => {
  const db = platform?.env?.DB;
  if (!db) error(503, 'No database bound');
  const b = (await request.json()) as { id: number; reply?: string; status?: string };
  const parent = (await readRequests(db)).find((r) => r.id === Number(b.id) && !r.parent);
  if (!parent) error(404, 'No such request');
  if (b.reply) await addRequest(db, locals.caller!.id, parent.slug, 'note', b.reply, parent.id);
  if (b.status && ['open', 'working', 'done'].includes(b.status)) await setRequestStatus(db, locals.caller!.id, parent.id, b.status);
  return json({ ok: true });
};
