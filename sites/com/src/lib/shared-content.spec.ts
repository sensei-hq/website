import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ARTICLES as fromPackage } from '@site/content/articles-data';
import { PRODUCTS as productsFromPackage } from '@site/content/hub-data';
import { ARTICLES as fromShim } from './articles-data';
import { PRODUCTS as productsFromShim } from './hub-data';

// website#4 Phase B: the articles, films and product registry live in the shared
// packages/content (`@site/content`) so sensei-hq.org can build from the same pool.
// The $lib paths stay as one-line re-exports, so nothing in the site was rewritten.
const lib = dirname(fileURLToPath(import.meta.url));

describe('shared content lives in @site/content', () => {
  it('the site no longer carries its own copy of the content or the films', () => {
    expect(existsSync(join(lib, 'content'))).toBe(false);
    expect(existsSync(join(lib, 'motion'))).toBe(false);
  });

  it('the $lib modules are the package modules, re-exported', () => {
    expect(fromShim).toBe(fromPackage);
    expect(productsFromShim).toBe(productsFromPackage);
    expect(fromPackage.length).toBeGreaterThan(0);
  });
});
