import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Page-driven data: Playwright runs in plain node, where the app's import.meta.glob and JSON
// imports do not resolve, so the published list is read off disk with the same rule
// (publish_date <= today in America/Chicago).
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (p: string) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const ARTICLES = readJson('src/lib/content/articles/index.json')
  .filter((e: { publish_date: string }) => e.publish_date <= today)
  .map((e: { slug: string }) => ({ ...e, sections: readJson(`src/lib/content/articles/${e.slug}.json`).sections }))
  .sort((a: { publish_date: string }, b: { publish_date: string }) => b.publish_date.localeCompare(a.publish_date));

test.describe('Articles at /articles', () => {
  test('the index lists every article', async ({ page }) => {
    await page.goto('/articles');
    await expect(page.getByRole('heading', { name: 'Articles', level: 1 })).toBeVisible();
    for (const a of ARTICLES) {
      await expect(page.locator(`a[href="/articles/${a.slug}"]`)).toBeVisible();
    }
  });

  for (const a of ARTICLES) {
    test(`${a.slug}: title, film card and one figure per section`, async ({ page }) => {
      await page.goto(`/articles/${a.slug}`);
      await expect(page.getByRole('heading', { name: a.title, level: 1 })).toBeVisible();
      await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', `https://sensei-hq.com/articles/${a.slug}`);
      await expect(page.locator('figure')).toHaveCount(a.sections.filter((s) => s.figure).length);
      for (const s of a.sections) {
        await expect(page.getByRole('heading', { name: s.title, level: 2 })).toBeVisible();
      }
    });
  }

  test('search filters the gallery', async ({ page }) => {
    await page.goto('/articles');
    await page.getByRole('searchbox', { name: 'Search articles' }).fill('zzzz-no-match');
    await expect(page.getByText('Nothing matches yet')).toBeVisible();
  });

  test('sitemap, rss and json feed are served', async ({ request }) => {
    for (const p of ['/sitemap.xml', '/articles/rss.xml', '/articles/feed.json']) {
      expect((await request.get(p)).ok()).toBeTruthy();
    }
  });

  test('an unknown slug is a 404', async ({ page }) => {
    const res = await page.goto('/articles/no-such-article');
    expect(res?.status()).toBe(404);
  });
});
