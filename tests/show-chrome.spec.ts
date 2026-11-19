import { test, expect } from '@playwright/test';

// The show bar follows emaki's sound wording ("Sound on"/"Sound off"), like MotionShow
// and the article figures' speaker buttons.
test('show sound toggle reads Sound off, then Sound on', async ({ page }) => {
  await page.goto('/show/short-schema-as-code');
  const btn = page.getByRole('button', { name: 'Turn sound on' });
  await expect(btn).toBeVisible();
  await expect(btn).toHaveText('Sound off');
  await expect(btn).toHaveAttribute('aria-pressed', 'false');
  await btn.click();
  await expect(btn).toHaveText('Sound on');
  await expect(btn).toHaveAttribute('aria-pressed', 'true');
});
