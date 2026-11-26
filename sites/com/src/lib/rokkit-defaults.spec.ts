import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import config from '../../rokkit.config.js';
import { zenSumi } from '@rokkit/unocss/palettes';

// Sensei HQ's sites share one theme — rokkit's zen-sumi family, imported, not a copy
// (user, 2026-10-28). This site may ADD tokens (the product hues, a scrim) but overrides
// none of rokkit's. The same guard runs in the Sensei app and the dōjō; it moved here
// with the site (2026-11-01).
const ROKKIT_TOKENS = [
  'paper', 'paper-soft', 'paper-mute', 'paper-edge', 'ink', 'ink-soft', 'ink-mute', 'ink-faint',
  'primary', 'on-primary', 'secondary', 'tertiary', 'accent', 'success', 'warning', 'danger', 'error', 'info',
  'accent-soft', 'success-soft', 'warning-soft', 'danger-soft', 'error-soft', 'info-soft',
];
type Cfg = { palettes?: unknown; skin?: unknown; overrides?: Record<string, unknown> };

describe("the site wears rokkit's zen-sumi", () => {
  const cfg = config as Cfg;
  it('takes its palettes and skin from @rokkit/unocss/palettes', () => {
    expect(cfg.palettes).toEqual(zenSumi.palettes);
    expect(cfg.skin).toEqual(zenSumi.skin);
  });

  it("overrides none of rokkit's tokens", () => {
    expect(Object.keys(cfg.overrides ?? {}).filter((k) => ROKKIT_TOKENS.includes(k))).toEqual([]);
  });
});

// A role's -soft tint stays light in both modes, so its bright text reads 2.9:1 on it by
// day and worse by night (axe, 2026-10-28). Text on a tint is `text-on-{role}-soft`.
const ROLES = ['accent', 'success', 'warning', 'danger', 'error', 'info'];

function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const path = join(dir, e.name);
    if (e.isDirectory()) return sources(path);
    return /\.(svelte|ts)$/.test(e.name) && !/\.spec\./.test(e.name) ? [path] : [];
  });
}

describe('text on a soft tint', () => {
  const root = resolve(__dirname, '../..');
  const files = sources(join(root, 'src'));

  it("finds the site's sources", () => {
    expect(files.length).toBeGreaterThan(20);
  });

  it("never draws a role's bright text on its own tint", () => {
    const found = files.flatMap((f) => {
      const text = readFileSync(f, 'utf8')
        .replace(/\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->/g, (c) => c.replace(/[^\n]/g, ' '))
        .replace(/(^|\s)\/\/.*$/gm, '$1');
      const lines = text.split('\n').flatMap((line, i) =>
        ROLES.filter(
          (r) =>
            line.includes(`bg-${r}-soft`) &&
            new RegExp(`(?<![\\w-])text-${r}(?![\\w-])`).test(line) &&
            !line.includes(`text-on-${r}-soft`),
        ).map((r) => `${relative(root, f)}:${i + 1} text-${r} on bg-${r}-soft`),
      );
      const directives = ROLES.filter(
        (r) => text.includes(`class:bg-${r}-soft=`) && text.includes(`class:text-${r}=`),
      ).map((r) => `${relative(root, f)} class:text-${r} beside class:bg-${r}-soft`);
      return [...lines, ...directives];
    });
    expect(found).toEqual([]);
  });
});
