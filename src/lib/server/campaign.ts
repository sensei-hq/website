// Dev-only campaign helpers (server): production state of a campaign short, read off the
// gitignored films/ tree. No $app imports: unit-testable under node.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { filmsDir } from './repo.js';

export interface TakeInfo {
  n: number;
  bytes: number;
  mtime: number;
}

/** The campaign build folder for a short (film.json, takes/, out/). */
export const shortDir = (slug: string) => filmsDir('campaign', 'shorts', slug);

/** Recorded takes (take-NN.wav) and the beat count from the short's film.json. */
export function takesStatus(slug: string): { beats: number; takes: TakeInfo[] } {
  const sd = shortDir(slug);
  let beats = 0;
  try {
    beats = (JSON.parse(readFileSync(join(sd, 'film.json'), 'utf8')) as { scenes: unknown[] }).scenes.length;
  } catch {
    return { beats: 0, takes: [] };
  }
  let takes: TakeInfo[] = [];
  try {
    takes = readdirSync(join(sd, 'takes'))
      .map((f) => /^take-(\d+)\.wav$/.exec(f))
      .filter((m): m is RegExpExecArray => !!m)
      .map((m) => {
        const st = statSync(join(sd, 'takes', m[0]));
        return { n: Number(m[1]), bytes: st.size, mtime: st.mtimeMs };
      })
      .sort((a, b) => a.n - b.n);
  } catch {
    takes = [];
  }
  return { beats, takes };
}

/** True when the short's built video (the post) exists. */
export const hasRender = (slug: string) => existsSync(join(shortDir(slug), 'out', `${slug}-vo.mp4`));
