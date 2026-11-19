import { test, expect } from '@playwright/test';

// The dev-only shorts review gallery (e2e runs against `bun run dev`, so it serves here).
test('shorts gallery lists all 28 days with covers', async ({ page }) => {
  await page.goto('/campaign');
  await expect(page.getByTestId('short-card')).toHaveCount(28);
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
