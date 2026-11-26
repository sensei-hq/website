import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Owner, 2026-11-26: sensei-hq.org carries the library articles, built from the same shared components and pool
// as sensei-hq.com. Read the pool off disk (Playwright runs in plain node) with the site's rule: live today, and
// about one of the five libraries.
const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'packages', 'content', 'src');
const readJson = (p: string): any => JSON.parse(readFileSync(join(root, p), 'utf8'));
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const LIBS = ['dbd', 'rokkit', 'kavach', 'gateway', 'emaki'];
interface Entry { slug: string; title: string; app: string; publish_date: string }
const ALL: Entry[] = readJson('content/articles/index.json');
const LIVE = ALL.filter((e) => e.publish_date <= today);
const ORG = LIVE.filter((e) => LIBS.includes(e.app));
const COM = LIVE.filter((e) => !LIBS.includes(e.app));

test.describe('articles on sensei-hq.org', () => {
  test('the index lists every library article and nothing else', async ({ page }) => {
    await page.goto('/articles');
    await expect(page.getByRole('heading', { name: 'Articles', level: 1 })).toBeVisible();
    for (const a of ORG) await expect(page.locator(`a[href="/articles/${a.slug}"]`).first()).toBeVisible();
    for (const a of COM) await expect(page.locator(`a[href$="/articles/${a.slug}"]`)).toHaveCount(0);
  });

  for (const a of ORG) {
    test(`${a.slug}: renders with its .org canonical`, async ({ page }) => {
      await page.goto(`/articles/${a.slug}`);
      await expect(page.getByRole('heading', { name: a.title, level: 1 })).toBeVisible();
      await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', `https://sensei-hq.org/articles/${a.slug}`);
    });
  }

  test('a library has its list page, linked to its docs', async ({ page }) => {
    await page.goto('/articles/product/dbd');
    await expect(page.getByRole('heading', { name: 'DBD', level: 1 })).toBeVisible();
    await expect(page.locator('a[href="https://dbd.sensei-hq.org"]').first()).toBeVisible();
  });

  test('a topic has its page', async ({ page }) => {
    await page.goto('/articles/tag/postgres');
    await expect(page.getByRole('heading', { name: '#postgres', level: 1 })).toBeVisible();
  });

  test('a .com article is not served here', async ({ page }) => {
    const res = await page.goto(`/articles/${COM[0].slug}`);
    expect(res?.status()).toBe(404);
  });

  test('the film card plays the Short and links its standalone show', async ({ page }) => {
    await page.goto('/articles/schema-as-code');
    await page.waitForLoadState('networkidle');
    await page.locator('.film').getByRole('button', { name: /^Play the film/ }).click();
    await expect(page.locator('.film .emk-popout')).toHaveAttribute('href', '/show/short-schema-as-code');
  });

  test('the playing stage fills its box edge-to-edge', async ({ page }) => {
    await page.goto('/articles/schema-as-code');
    await page.waitForLoadState('networkidle');
    await page.locator('.film').getByRole('button', { name: /^Play the film/ }).click();
    await page.locator('.film .emk-bar').waitFor();
    const slack = await page.evaluate(() => {
      const fit = document.querySelector('.film .ms-fit')!.getBoundingClientRect();
      const st = document.querySelector('.film .ms-stage')!.getBoundingClientRect();
      return Math.max(Math.abs(fit.width - st.width), Math.abs(fit.height - st.height));
    });
    expect(slack).toBeLessThanOrEqual(2);
  });

  test('the standalone show plays', async ({ page }) => {
    await page.goto('/show/short-schema-as-code');
    await expect(page.locator('.emk-bar')).toBeVisible();
  });

  test('feeds and sitemap list the .org articles', async ({ request }) => {
    const feed = await (await request.get('/articles/feed.json')).json();
    expect(feed.items.map((i: { url: string }) => i.url).sort()).toEqual(ORG.map((a) => `https://sensei-hq.org/articles/${a.slug}`).sort());
    expect((await request.get('/articles/rss.xml')).ok()).toBeTruthy();
    const sitemap = await (await request.get('/sitemap.xml')).text();
    expect(sitemap).toContain('https://sensei-hq.org/articles/schema-as-code');
    expect(sitemap).toContain('https://sensei-hq.org/articles/product/dbd');
  });

  test('the home page links the articles', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a[href="/articles"]').first()).toBeVisible();
  });
});

test.describe('articles on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  for (const path of ['/articles', '/articles/schema-as-code', '/articles/product/dbd']) {
    test(`${path} fits the screen`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });
  }
});
