// The website repo's root, wherever the app runs from. Dev-only routes read the
// gitignored films/ tree off it: once the app lives in sites/com (website#4),
// `process.cwd()` is no longer the repo root. No $app imports: unit-testable.
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

/** The nearest folder at or above `start` holding `.git` (a dir, or a worktree's file). */
export function repoRoot(start: string = process.cwd()): string {
  for (let dir = start; ; dir = dirname(dir)) {
    if (existsSync(join(dir, '.git'))) return dir;
    if (dirname(dir) === dir) throw new Error(`no .git at or above ${start}`);
  }
}

/** A path inside the repo's films/ tree (masters, takes, renders, campaign). */
export const filmsDir = (...parts: string[]) => join(repoRoot(), 'films', ...parts);
