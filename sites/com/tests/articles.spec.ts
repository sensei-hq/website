import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Page-driven data: Playwright runs in plain node, where the app's import.meta.glob and JSON
// imports do not resolve, so the published list is read off disk with the same rule
// (publish_date <= today in America/Chicago).
// Articles and films live in the shared package (website#4).
const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'packages', 'content', 'src');
const readJson = (p: string): any => JSON.parse(readFileSync(join(root, p), 'utf8'));
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
interface ArticleEntry { slug: string; title: string; publish_date: string; sections: { id: string; title: string; figure?: unknown; motion?: unknown }[] }
const ARTICLES: ArticleEntry[] = (readJson('content/articles/index.json') as ArticleEntry[])
  .filter((e) => e.publish_date <= today)
  .map((e) => ({ ...e, sections: readJson(`content/articles/${e.slug}.json`).sections }))
  .sort((a, b) => b.publish_date.localeCompare(a.publish_date));

/** Scene ids of the film that shares the slug (or the campaign Short at short-<slug>), if any. Mirrors articles-data load(). */
const filmScenes = (slug: string): Set<string> => {
  for (const dir of [slug, `short-${slug}`]) {
    try {
      return new Set((readJson(`motion/films/${dir}/film.json`).scenes as { id: string }[]).map((s) => s.id));
    } catch {
      continue;
    }
  }
  return new Set();
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
        await expect(page.locator(`section#${s.id}`).getByRole('heading', { name: s.title, level: 2 })).toBeVisible();
      }
    });
  }

  test('film card links its standalone show', async ({ page }) => {
    await page.goto('/articles/schema-as-code');
    await page.waitForLoadState('networkidle');
    await page.locator('.film').getByRole('button', { name: /^Play the film/ }).click();
    await expect(page.locator('.film .emk-popout')).toHaveAttribute('href', '/show/short-schema-as-code');
  });

  test('film shows its toolbar before the first play', async ({ page }) => {
    await page.goto('/articles/sensei-relay');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.film .emk-bar')).toBeVisible();
    await expect(page.locator('.film').getByRole('button', { name: /^Play the film/ })).toBeVisible();
    // Mute is the master: the VO toggle dims until sound is on.
    await expect(page.locator('.film .emk-voice')).toBeDisabled();
    // Without JS there is no player: the cover still shows.
    expect(await page.locator('.film noscript').innerHTML()).toContain('/covers/sensei-relay.jpg');
  });

  test('playing stage fills its box edge-to-edge', async ({ page }) => {
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

  test('search filters the gallery', async ({ page }) => {
    await page.goto('/articles');
    // Wait for hydration: filling before Svelte binds the input gets overwritten with ''.
    await page.waitForLoadState('networkidle');
    await page.getByRole('searchbox', { name: 'Search articles' }).fill('zzzz-no-match');
    await expect(page.getByText('Nothing matches yet')).toBeVisible();
  });

  test('sitemap, rss and json feed are served', async ({ request }) => {
    for (const p of ['/sitemap.xml', '/articles/rss.xml', '/articles/feed.json']) {
      expect((await request.get(p)).ok()).toBeTruthy();
    }
  });

  test('film with takes narrates them with sound and voice on', async ({ page }) => {
    const takes: string[] = [];
    page.on('response', (r) => {
      if (r.url().includes('/api/films/sensei-relay/takes/')) takes.push(r.url());
    });
    await page.goto('/articles/sensei-relay');
    await page.waitForLoadState('networkidle');
    await page.locator('.film').getByRole('button', { name: /^Play the film/ }).click();
    await page.locator('.film .emk-bar').waitFor();
    await expect.poll(() => takes.length, { timeout: 15000 }).toBeGreaterThan(0);
    // Voice off cuts the narration: advancing scenes fetches no more takes.
    const mark = takes.length;
    await page.locator('.film').getByRole('button', { name: 'Voice on' }).click();
    await page.locator('.film').getByRole('button', { name: 'Next scene' }).click();
    await page.waitForTimeout(2500);
    expect(takes.length).toBe(mark);
  });

  test('an unknown slug is a 404', async ({ page }) => {
    const res = await page.goto('/articles/no-such-article');
    expect(res?.status()).toBe(404);
  });

  test('article figures sound effects-only: no narration takes', async ({ page }) => {
    // The film at the top carries the VO; section figures replaying its takes would be redundant.
    // Probed through the admin preview (the article exactly as it will render) of a short whose
    // scenes carry voice timings — the same figures DO speak on its review page (see campaign.spec),
    // so a take here would fail.
    const takes: string[] = [];
    page.on('response', (r) => {
      if (r.url().includes('/api/campaign/scenes-as-data/takes/')) takes.push(r.url());
    });
    await page.goto('/admin/preview/scenes-as-data');
    await page.waitForLoadState('networkidle');
    const fig = page.locator('.ms-snd').first();
    await fig.scrollIntoViewIfNeeded();
    await fig.click();
    await expect(fig).toHaveAttribute('aria-pressed', 'true');
    await page.waitForTimeout(2500);
    expect(takes).toHaveLength(0);
  });
});
