import { test, expect, type Page } from '@playwright/test';

// Owner, 2026-11-28: postable videos render dark ("dark feels better for yt"). render.py captures /show/<film>?capture=1,
// which draws light by default (so a render never depends on the machine); ?mode=dark|light picks the look.
const FILM = 'sensei-relay';

async function stageMode(page: Page, query: string) {
  await page.goto(`/show/${FILM}?capture=1${query}`);
  await page.waitForFunction(() => (window as unknown as { __show?: { ready: unknown } }).__show?.ready);
  await page.evaluate(() => (window as unknown as { __show: { ready: Promise<unknown> } }).__show.ready);
  return page.evaluate(() => {
    const find = (root: Document | ShadowRoot): HTMLElement | null => {
      const hit = root.querySelector<HTMLElement>('#stage');
      if (hit) return hit;
      for (const el of root.querySelectorAll('*')) if (el.shadowRoot) { const s = find(el.shadowRoot); if (s) return s; }
      return null;
    };
    return find(document)?.dataset.mode ?? null;
  });
}

test.describe('render look', () => {
  test.use({ colorScheme: 'dark' });

  test('a capture is light by default, even on a dark machine', async ({ page }) => {
    expect(await stageMode(page, '')).toBe('light');
  });

  test('?mode=dark captures the film dark', async ({ page }) => {
    expect(await stageMode(page, '&mode=dark')).toBe('dark');
  });

  test('?mode=light captures it light', async ({ page }) => {
    expect(await stageMode(page, '&mode=light')).toBe('light');
  });
});
