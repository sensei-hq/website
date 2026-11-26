import { error, json } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { execFile } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { shortDir } from '$lib/server/campaign.js';
import { filmsDir, repoRoot } from '$lib/server/repo.js';

// Dev-only staging: runs films/tools/stage.py for the short, then approval happens in /admin
// (the desk forbids machine approval) and the scheduled job posts. Never deployed (404 in prod).
// POST { dryRun?: true } prints the staged posts without uploading anything.
export const prerender = false;

const run = promisify(execFile);
const validSlug = (slug: string) => /^[a-z0-9-]+$/.test(slug) && existsSync(join(shortDir(slug), 'film.json'));
const adminOrigin = () => {
  try {
    const m = /^ADMIN_ORIGIN=(\S+)/m.exec(readFileSync(filmsDir('.env'), 'utf8'));
    return (m?.[1] ?? 'https://sensei-hq.com').replace(/\/$/, '');
  } catch {
    return 'https://sensei-hq.com';
  }
};

export const POST = async ({ params, request }) => {
  if (!dev) error(404, 'Not found');
  if (!validSlug(params.slug)) error(404, 'No such short');
  const body = (await request.json().catch(() => ({}))) as { dryRun?: unknown };
  const dryRun = body.dryRun === true;
  const python = filmsDir('.venv', 'bin', 'python');
  if (!existsSync(python)) error(500, 'films/.venv is missing (see films/MUSE-CAMPAIGN.md setup)');
  try {
    const { stdout, stderr } = await run(
      python,
      ['films/tools/stage.py', params.slug, ...(dryRun ? ['--dry-run'] : [])],
      { cwd: repoRoot(), timeout: 600_000, maxBuffer: 4 * 1024 * 1024 },
    );
    return json({ ok: true, dryRun, log: `${stdout}\n${stderr}`.trim().slice(-4000), admin: `${adminOrigin()}/admin` });
  } catch (e) {
    const err = e as { stdout?: string; stderr?: string; message?: string };
    error(500, `${`${err.stdout ?? ''}\n${err.stderr ?? ''}`.trim().slice(-2000) || err.message}`);
  }
};
