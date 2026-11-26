import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import shared from '@site/ui/rokkit.config';

// website#4 Phase C: the theme, tokens, brand icons and shared nav live in
// packages/ui (`@site/ui`) so sensei-hq.org renders in the same skin. The site
// keeps no copy of its own.
const site = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

describe('shared UI lives in @site/ui', () => {
  it('the site carries no copy of the theme, tokens, icons or shared nav', () => {
    for (const f of ['rokkit.config.js', 'src/lib/tokens.css', 'src/lib/icons/brand.json', 'icons/brand', 'src/lib/components/SiteNav.svelte'])
      expect(existsSync(join(site, f)), f).toBe(false);
  });

  it('the site builds its CSS from the shared config and stylesheet', () => {
    expect(readFileSync(join(site, 'uno.config.js'), 'utf8')).toContain('@site/ui');
    expect(readFileSync(join(site, 'src/app.css'), 'utf8')).toContain('@site/ui/site.css');
    expect(shared.storageKey).toBe('sensei-site-theme');
  });
});
