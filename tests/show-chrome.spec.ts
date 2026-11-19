import { test, expect } from '@playwright/test';

// The show runs the standard emaki chrome: icon transport, progress ticks, count, mute.
// (CC needs voice lines and the pop-out needs a player page, so neither renders here.)
test('show bar follows the standard chrome contract', async ({ page }) => {
  await page.goto('/show/short-schema-as-code');
  await expect(page.locator('.emk-bar')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Previous scene' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next scene' })).toBeVisible();
  await expect(page.locator('.emk-tick')).toHaveCount(6);
  await expect(page.locator('.emk-count')).toContainText('/ 6');
  await expect(page.locator('.emk-popout')).toHaveCount(0);
  await page.getByRole('button', { name: 'Captions' }).click();
  await expect(page.locator('.emk-cap')).toContainText('Where does your database schema actually live?');
  const mute = page.getByRole('button', { name: 'Sound on' });
  await expect(mute).toHaveAttribute('aria-pressed', 'false');
  await mute.click();
  await expect(page.getByRole('button', { name: 'Sound off' })).toHaveAttribute('aria-pressed', 'true');
});

test('O flips orientation and keeps the scene', async ({ page }) => {
  await page.goto('/show/short-schema-as-code?slide=3');
  await expect(page.locator('.emk-count')).toContainText('3 / 6');
  await page.keyboard.press('o');
  await expect(page).toHaveURL(/o=portrait/);
  await expect(page.locator('.emk-count')).toContainText('3 / 6');
  await expect(page.locator('.emk-bar')).toBeVisible();
});
