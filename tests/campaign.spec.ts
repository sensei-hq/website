import { test, expect } from '@playwright/test';

// The dev-only shorts review gallery (e2e runs against `bun run dev`, so it serves here).
test('shorts gallery lists all 28 days with covers', async ({ page }) => {
  await page.goto('/campaign');
  await expect(page.getByTestId('short-card')).toHaveCount(28);
  const first = page.getByTestId('short-card').nth(0);
  await expect(first).toContainText('Day 1');
  await expect(first.getByRole('link', { name: '9:16' })).toHaveAttribute(
    'href',
    '/show/short-schema-as-code?o=portrait',
  );
});

test('a card opens its portrait show', async ({ page }) => {
  await page.goto('/campaign');
  await page.getByTestId('short-card').nth(0).getByRole('link', { name: '9:16' }).click();
  await expect(page).toHaveURL('/show/short-schema-as-code?o=portrait');
});

test('review page shows the article with its toolbar', async ({ page }) => {
  await page.goto('/campaign/schema-as-code');
  await expect(page.getByRole('heading', { name: 'Your database deserves version control too', level: 1 })).toBeVisible();
  await expect(page.getByText('Day 1', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Portrait 9:16' })).toHaveAttribute(
    'href',
    '/show/short-schema-as-code?o=portrait',
  );
});

test('unknown campaign slug is a 404', async ({ page }) => {
  const res = await page.goto('/campaign/no-such-piece');
  expect(res?.status()).toBe(404);
});
