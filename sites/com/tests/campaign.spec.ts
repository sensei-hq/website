import { test, expect } from '@playwright/test';

// The dev-only shorts review gallery (e2e runs against `bun run dev`, so it serves here).
test('shorts gallery lists all 31 days with covers', async ({ page }) => {
  await page.goto('/campaign');
  await expect(page.getByTestId('short-card')).toHaveCount(31);
  const first = page.getByTestId('short-card').nth(0);
  await expect(first).toContainText('Day 1');
  await expect(first.getByRole('link', { name: 'Review →' })).toHaveAttribute('href', '/campaign/schema-as-code');
});

test('a card opens its review page', async ({ page }) => {
  await page.goto('/campaign');
  await page.getByTestId('short-card').nth(0).getByRole('link', { name: 'Review →' }).click();
  await expect(page).toHaveURL('/campaign/schema-as-code');
});

test('review page shows the article with its toolbar', async ({ page }) => {
  await page.goto('/campaign/schema-as-code');
  await expect(page.getByRole('heading', { name: 'Your database deserves version control too', level: 1 })).toBeVisible();
  await expect(page.getByText('Day 1', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Portrait 9:16' })).toHaveAttribute(
    'href',
    '/show/short-schema-as-code?o=portrait',
  );
  await expect(page.getByRole('heading', { name: 'Voice' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Generate voice|Regenerate all takes/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Publish' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Stage for approval' })).toBeVisible();
});

test('unknown campaign slug is a 404', async ({ page }) => {
  const res = await page.goto('/campaign/no-such-piece');
  expect(res?.status()).toBe(404);
});

test('cc stays shared while sound stays per player', async ({ page }) => {
  await page.goto('/campaign/fallback-chains');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: /Play the film/ }).click();
  await page.locator('.emk-bar').waitFor();
  // CC on the film captions the figures too.
  await page.getByRole('button', { name: 'Captions' }).first().click();
  await expect(page.locator('.emk-scene-cap').first()).toBeVisible();
  // And back: a figure toggle drives the film.
  await page.locator('.emk-scene-cc').first().click();
  await expect(page.locator('.emk-cap')).toBeHidden();
  // Sound never spreads: the film must not sound its figures.
  await page.getByRole('button', { name: 'Sound on', exact: true }).click();
  await expect(page.locator('.ms-snd').first()).toHaveAttribute('aria-pressed', 'false');
  // And a figure toggle sounds only itself.
  await page.locator('.ms-snd').first().click();
  await expect(page.locator('.ms-snd').first()).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.ms-snd').nth(1)).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('button', { name: 'Sound off', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('voice off cuts narration everywhere while the film plays', async ({ page }) => {
  const takes: string[] = [];
  page.on('response', (r) => {
    if (r.url().includes('/api/campaign/scenes-as-data/takes/')) takes.push(r.url());
  });
  await page.goto('/campaign/scenes-as-data');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: /Play the film/ }).click();
  await page.locator('.emk-bar').waitFor();
  await page.getByRole('button', { name: 'Sound on', exact: true }).click();
  await expect.poll(() => takes.length, { timeout: 15000 }).toBeGreaterThan(0);
  // A figure sounds only on its own toggle, narrating while voice is on.
  const fig = page.locator('.ms-snd').first();
  await fig.scrollIntoViewIfNeeded();
  await fig.click();
  const figMark = takes.length;
  await expect.poll(() => takes.length, { timeout: 15000 }).toBeGreaterThan(figMark);
  await page.waitForTimeout(1500);
  const mark = takes.length;
  await page.getByRole('button', { name: 'Voice on' }).click();
  await expect(page.getByRole('button', { name: 'Voice off' })).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Next scene' }).click();
  await expect(page.locator('.emk-count')).toContainText('2 / 5');
  await page.waitForTimeout(3500);
  expect(takes.length).toBe(mark);
  // And back on: narration resumes.
  await page.getByRole('button', { name: 'Voice off' }).click();
  await page.getByRole('button', { name: 'Previous scene' }).click();
  await expect.poll(() => takes.length, { timeout: 15000 }).toBeGreaterThan(mark);
  // The figure follows the shared cut too: re-sounding it under voice-off plays no take.
  await page.getByRole('button', { name: 'Voice on' }).click();
  const figMark2 = takes.length;
  await fig.click();
  await fig.click();
  await expect(fig).toHaveAttribute('aria-pressed', 'true');
  await page.waitForTimeout(2500);
  expect(takes.length).toBe(figMark2);
});

test.describe('Campaign scenes inspector', () => {
  test('plays a scene with controls', async ({ page }) => {
    await page.goto('/campaign/scenes?film=measure-right-work&scene=hook');
    await expect(page.getByRole('heading', { name: 'Scenes' })).toBeVisible();
    await expect(page.locator('.motion-player')).toBeVisible();
    await expect(page.locator('.mp-bar span')).toContainText('/ 6.5');
    await page.getByRole('slider', { name: 'Seek' }).fill('3');
    await expect(page.locator('.mp-bar span')).toContainText('3.0 /');
  });

  test('json and module sources both render', async ({ page }) => {
    for (const src of ['json', 'js']) {
      await page.goto(`/campaign/scenes?film=measure-right-work&scene=hook&src=${src}`);
      await expect(page.locator('.motion-player')).toBeVisible();
      await expect(page.locator('.sr-src')).toContainText(src === 'json' ? 'JSON' : 'module');
    }
  });
});
