import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Page-driven data: Playwright runs in plain node, where the app's import.meta.glob and JSON
// imports do not resolve, so the published list is read off disk with the same rule
// (publish_date <= today in America/Chicago).
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (p: string): any => JSON.parse(readFileSync(join(root, p), 'utf8'));
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
interface ArticleEntry { slug: string; title: string; publish_date: string; sections: { id: string; title: string; figure?: unknown; motion?: unknown }[] }
const ARTICLES: ArticleEntry[] = (readJson('src/lib/content/articles/index.json') as ArticleEntry[])
  .filter((e) => e.publish_date <= today)
  .map((e) => ({ ...e, sections: readJson(`src/lib/content/articles/${e.slug}.json`).sections }))
  .sort((a, b) => b.publish_date.localeCompare(a.publish_date));

/** Scene ids of the film that shares the slug, if any (articles-data load() plays those scenes as figures). */
const filmScenes = (slug: string): Set<string> => {
  try {
    return new Set((readJson(`src/lib/motion/films/${slug}/film.json`).scenes as { id: string }[]).map((s) => s.id));
  } catch {
    return new Set();
  }
};
/** Sections that render a <Figure>: an HTML figure, authored motion or a same-slug scene id. */
const figureCount = (a: ArticleEntry) => {
  const scenes = filmScenes(a.slug);
  return a.sections.filter((s) => s.figure || s.motion || scenes.has(s.id)).length;
};

test.describe('Articles at /articles', () => {
  test('the index lists every article', async ({ page }) => {
    await page.goto('/articles');
    await expect(page.getByRole('heading', { name: 'Articles', level: 1 })).toBeVisible();
    for (const a of ARTICLES) {
      await expect(page.locator(`a[href="/articles/${a.slug}"]`).first()).toBeVisible();
    }
  });

  for (const a of ARTICLES) {
    test(`${a.slug}: title, film card and one figure per section`, async ({ page }) => {
      await page.goto(`/articles/${a.slug}`);
      await expect(page.getByRole('heading', { name: a.title, level: 1 })).toBeVisible();
      await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', `https://sensei-hq.com/articles/${a.slug}`);
      await expect(page.locator('figure')).toHaveCount(figureCount(a));
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
