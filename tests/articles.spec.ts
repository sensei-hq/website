import { test, expect } from '@playwright/test';
import { published } from '../src/lib/articles-data';

const ARTICLES = published();

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
      await page.waitForLoadState('networkidle');
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
