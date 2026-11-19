import { test, expect } from '@playwright/test';

// The dev-only shorts review gallery (e2e runs against `bun run dev`, so it serves here).
test('shorts gallery lists all 28 days with covers', async ({ page }) => {
  await page.goto('/show/shorts');
  await expect(page.getByTestId('short-card')).toHaveCount(28);
  const first = page.getByTestId('short-card').nth(0);
  await expect(first).toContainText('Day 1');
  await expect(first.getByRole('link', { name: '9:16' })).toHaveAttribute(
    'href',
    '/show/short-schema-as-code?o=portrait',
  );
});

test('a card opens its portrait show', async ({ page }) => {
  await page.goto('/show/shorts');
  await page.getByTestId('short-card').nth(0).getByRole('link', { name: '9:16' }).click();
  await expect(page).toHaveURL('/show/short-schema-as-code?o=portrait');
});
