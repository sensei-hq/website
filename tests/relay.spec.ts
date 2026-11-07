import { test, expect } from '@playwright/test';

// Promoted from /mockups/relay on approval; the gallery links here.
test.describe('Relay explainer at /sensei/relay', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sensei/relay');
    await page.waitForLoadState('networkidle');
  });

  test('renders the three stages', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'One run, however many assistants.' })
    ).toBeVisible();
    for (const name of ['Many hands', 'Slow or tangled', 'One relay']) {
      await expect(page.getByRole('heading', { name })).toBeVisible();
    }
  });

  test('mounts an interactive figure per stage', async ({ page }) => {
    await expect(page.locator('.hairline-figure svg')).toHaveCount(3);
  });

  test('riffle and slow keep a single focus (no motion trail)', async ({ page }) => {
    // These figures read best with one lit element; the motion trail stays
    // off so the jumper is the only accent. Sampled well inside the 1s
    // motion linger, so any attached tracker would still show tags.
    for (const i of [0, 1]) {
      const fig = page.locator('.hairline-figure').nth(i);
      await fig.scrollIntoViewIfNeeded();
      const box = await fig.boundingBox();
      expect(box).not.toBeNull();
      await page.mouse.move(box!.x + box!.width * 0.3, box!.y + box!.height * 0.5, { steps: 4 });
      await page.mouse.move(box!.x + box!.width * 0.7, box!.y + box!.height * 0.5, { steps: 4 });
      const mv = await fig.evaluate(
        (el) => el.querySelector('svg')?.querySelectorAll('.mv').length ?? -1
      );
      expect(mv).toBe(0);
    }
  });
});
