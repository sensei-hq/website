import { error, json } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { execFile } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { shortDir, takesStatus } from '$lib/server/campaign.js';
import { filmsDir, repoRoot } from '$lib/server/repo.js';

// Dev-only voice generation (ElevenLabs, Jeremy): runs films/tools/gen_takes.py for the short.
// Never deployed (404 in prod). POST { takes?: number[] } regenerates those takes (all when omitted).
export const prerender = false;

const run = promisify(execFile);
const validSlug = (slug: string) => /^[a-z0-9-]+$/.test(slug) && existsSync(join(shortDir(slug), 'film.json'));
const hasKey = () => {
  try {
    return /^ELEVENLABS_API_KEY=\S+/m.test(readFileSync(filmsDir('.env'), 'utf8'));
  } catch {
    return false;
  }
};

export const GET = ({ params }) => {
  if (!dev) error(404, 'Not found');
  if (!validSlug(params.slug)) error(404, 'No such short');
  return json(takesStatus(params.slug));
};

export const POST = async ({ params, request }) => {
  if (!dev) error(404, 'Not found');
  if (!validSlug(params.slug)) error(404, 'No such short');
  if (!hasKey()) error(400, 'ELEVENLABS_API_KEY is missing from films/.env');
  const body = (await request.json().catch(() => ({}))) as { takes?: unknown };
  const takes = Array.isArray(body.takes) ? body.takes.filter((t): t is number => Number.isInteger(t) && (t as number) > 0) : [];
  const python = filmsDir('.venv', 'bin', 'python');
  if (!existsSync(python)) error(500, 'films/.venv is missing (see films/MUSE-CAMPAIGN.md setup)');
  try {
    const { stdout, stderr } = await run(
      python,
      ['films/tools/gen_takes.py', `campaign/shorts/${params.slug}`, ...takes.map(String)],
      { cwd: repoRoot(), timeout: 600_000, maxBuffer: 1024 * 1024 },
    );
    return json({ ok: true, log: `${stdout}\n${stderr}`.trim().slice(-2000) });
  } catch (e) {
    const err = e as { stdout?: string; stderr?: string; message?: string };
    error(500, `Voice generation failed: ${`${err.stdout ?? ''}\n${err.stderr ?? ''}\n${err.message ?? ''}`.trim().slice(-1000)}`);
  }
};
