import { describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { repoRoot, filmsDir } from './repo.js';

// The app moves to sites/com (website#4), so `process.cwd()` stops being the
// repo root. Dev-only routes reach the gitignored films/ tree through repoRoot().
describe('repoRoot — the website repo, wherever the app runs from', () => {
  it('walks up from a nested folder to the one holding .git', () => {
    const top = mkdtempSync(join(tmpdir(), 'repo-'));
    mkdirSync(join(top, '.git'));
    const nested = join(top, 'sites', 'com');
    mkdirSync(nested, { recursive: true });
    expect(repoRoot(nested)).toBe(top);
  });

  it('accepts a worktree, where .git is a file', () => {
    const top = mkdtempSync(join(tmpdir(), 'wt-'));
    writeFileSync(join(top, '.git'), 'gitdir: elsewhere\n');
    expect(repoRoot(join(top))).toBe(top);
  });

  it('fails loudly outside any repo rather than guessing', () => {
    expect(() => repoRoot(mkdtempSync(join(tmpdir(), 'none-')))).toThrow(/no \.git/);
  });

  it('films/ hangs off the repo root', () => {
    expect(filmsDir('campaign', 'shorts')).toBe(join(repoRoot(), 'films', 'campaign', 'shorts'));
  });

  it('no server code builds a path from process.cwd() itself', () => {
    const src = join(repoRoot(), 'src');
    const offenders: string[] = [];
    const walk = (d: string) => {
      for (const f of readdirSync(d)) {
        const p = join(d, f);
        if (statSync(p).isDirectory()) walk(p);
        else if (/\.(ts|js|svelte)$/.test(f) && !/repo(\.spec)?\.ts$/.test(f) && readFileSync(p, 'utf8').includes('process.cwd()'))
          offenders.push(relative(src, p));
      }
    };
    walk(src);
    expect(offenders).toEqual([]);
  });
});
