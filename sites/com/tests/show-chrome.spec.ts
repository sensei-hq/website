import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';
// films/ (masters, campaign takes) is gitignored, so CI has none: this test needs a checkout that has them.
const FILMS = fileURLToPath(new URL('../../../films', import.meta.url));

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

test('chrome=0 hides the toolbar for recordings', async ({ page }) => {
  await page.goto('/show/short-schema-as-code?chrome=0');
  await expect(page.locator('.emk-bar')).toHaveCount(0);
  await expect(page.locator('.frame')).toBeVisible();
});

test('clicking the stage toggles play and pause', async ({ page }) => {
  await page.goto('/show/short-schema-as-code');
  const frame = page.locator('.frame');
  await expect(frame).toHaveAttribute('data-playing', 'true');
  await frame.click({ position: { x: 30, y: 30 } });
  await expect(frame).toHaveAttribute('data-playing', 'false');
  await frame.click({ position: { x: 30, y: 30 } });
  await expect(frame).toHaveAttribute('data-playing', 'true');
});

test('O flips orientation and keeps the scene', async ({ page }) => {
  await page.goto('/show/short-schema-as-code?slide=3');
  await expect(page.locator('.emk-count')).toContainText('3 / 6');
  await page.keyboard.press('o');
  await expect(page).toHaveURL(/o=portrait/);
  await expect(page.locator('.emk-count')).toContainText('3 / 6');
  await expect(page.locator('.emk-bar')).toBeVisible();
});

test('a fitted short plays its takes with the picture', async ({ page }) => {
  test.skip(!existsSync(`${FILMS}/campaign`), 'no films/ checkout');
  const takes: string[] = [];
  page.on('response', (r) => {
    if (r.url().includes('/api/campaign/scenes-as-data/takes/')) takes.push(`${r.status()} ${r.url()}`);
  });
  await page.goto('/show/short-scenes-as-data');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.emk-count')).toContainText('1 / 5');
  // Sound starts off; enabling it (a gesture, so audio unlocks) cues the narration.
  await page.getByRole('button', { name: 'Sound on' }).click();
  await expect.poll(() => takes.length, { timeout: 15000 }).toBeGreaterThan(0);
  expect(takes[0]).toMatch(/^200 https?:\/\/[^/]+\/api\/campaign\/scenes-as-data\/takes\/1$/);
});
