import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';
// films/ (masters, campaign takes) is gitignored, so CI has none: this test needs a checkout that has them.
const FILMS = fileURLToPath(new URL('../../../films', import.meta.url));

test.describe('Dark mode switching', () => {
  test.beforeEach(async ({ page }) => {
    // Clear stored theme to get a clean state
    await page.addInitScript(() => {
      localStorage.removeItem('sensei-theme');
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('page has data-mode and data-style on body', async ({ page }) => {
    const mode = await page.evaluate(() => document.body.dataset.mode);
    const style = await page.evaluate(() => document.body.dataset.style);
    expect(mode).toBeTruthy();
    expect(style).toBeTruthy();
  });

  test('motion figures follow body data-mode', async ({ page }) => {
    await page.goto('/articles/sensei-relay');
    await page.waitForSelector('figure .motion-scene');
    const stage = () =>
      page.evaluate(() => {
        const host = document.querySelector('figure .motion-scene > div');
        const st = host?.shadowRoot?.querySelector('#stage') as HTMLElement | null;
        return st ? [st.dataset.mode, getComputedStyle(st).backgroundColor] : null;
      });
    await page.evaluate(() => {
      document.body.dataset.mode = 'light';
    });
    await page.waitForFunction(() => {
      const st = document.querySelector('figure .motion-scene > div')?.shadowRoot?.querySelector('#stage');
      return st?.getAttribute('data-mode') === 'light';
    });
    const light = await stage();
    await page.evaluate(() => {
      document.body.dataset.mode = 'dark';
    });
    await page.waitForFunction(
      () => document.querySelector('figure .motion-scene > div')?.shadowRoot?.querySelector('#stage')?.getAttribute('data-mode') === 'dark',
      null,
      { timeout: 5000 },
    );
    const dark = await stage();
    expect(dark?.[1]).not.toBe(light?.[1]);
  });

  test('dark surfaces stay dark instead of inverting', async ({ page }) => {
    test.skip(!existsSync(FILMS), 'no films/ checkout');
    await page.goto('/campaign/scenes?film=know-the-code-first&scene=hook');
    await page.waitForSelector('.motion-player');
    await page.evaluate(() => {
      document.body.dataset.mode = 'dark';
    });
    await page.waitForFunction(
      () => document.querySelector('.motion-player > div')?.shadowRoot?.querySelector('#stage')?.getAttribute('data-mode') === 'dark',
      null,
      { timeout: 5000 },
    );
    const lum = await page.evaluate(() => {
      const el = document.querySelector('.motion-player > div')?.shadowRoot?.querySelector('.hook-term') as HTMLElement | null;
      const [r, g, b] = getComputedStyle(el!).backgroundColor.match(/[\d.]+/g)!.map(Number);
      return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    });
    expect(lum).toBeLessThan(0.35);
  });

  test('dark mode applies dark surface colors to FloatingNavigation', async ({ page }) => {
    // Force light first to get a baseline
    await page.evaluate(() => { document.body.dataset.mode = 'light'; });

    const lightRing = await page.evaluate(() => {
      const el = document.querySelector('[data-floating-nav]');
      if (!el) return 'not-found';
      return getComputedStyle(el).getPropertyValue('--un-ring-color').trim();
    });

    // Switch to dark
    await page.evaluate(() => { document.body.dataset.mode = 'dark'; });

    const darkRing = await page.evaluate(() => {
      const el = document.querySelector('[data-floating-nav]');
      if (!el) return 'not-found';
      return getComputedStyle(el).getPropertyValue('--un-ring-color').trim();
    });

    // If FloatingNav exists, ring color must change between modes
    if (lightRing !== 'not-found') {
      expect(lightRing).not.toBe(darkRing);
    }
  });

  test('dark mode applies dark border to Toggle', async ({ page }) => {
    await page.evaluate(() => { document.body.dataset.mode = 'light'; });

    const lightBorder = await page.evaluate(() => {
      const el = document.querySelector('[data-toggle]');
      return el ? getComputedStyle(el).borderColor : 'not-found';
    });

    await page.evaluate(() => { document.body.dataset.mode = 'dark'; });

    const darkBorder = await page.evaluate(() => {
      const el = document.querySelector('[data-toggle]');
      return el ? getComputedStyle(el).borderColor : 'not-found';
    });

    if (lightBorder !== 'not-found') {
      expect(lightBorder).not.toBe(darkBorder);
    }
  });

  test.fixme('ThemeSwitcherToggle click switches to dark mode', async ({ page }) => {
    // Click the last toggle item (dark) via JS — items may be icon-only and tiny
    await page.evaluate(() => {
      const items = document.querySelectorAll('[data-toggle] [data-path]');
      if (items.length > 0) (items[items.length - 1] as HTMLElement).click();
    });

    await page.waitForFunction(
      () => document.body.dataset.mode === 'dark',
      null,
      { timeout: 3000 }
    );

    const mode = await page.evaluate(() => document.body.dataset.mode);
    expect(mode).toBe('dark');
  });

  test.fixme('ThemeSwitcherToggle round-trip: dark then light', async ({ page }) => {
    // Click dark (last item)
    await page.evaluate(() => {
      const items = document.querySelectorAll('[data-toggle] [data-path]');
      if (items.length > 0) (items[items.length - 1] as HTMLElement).click();
    });
    await page.waitForFunction(() => document.body.dataset.mode === 'dark', null, { timeout: 3000 });

    // Click light (middle item)
    await page.evaluate(() => {
      const items = document.querySelectorAll('[data-toggle] [data-path]');
      if (items.length >= 2) (items[1] as HTMLElement).click();
    });
    await page.waitForFunction(() => document.body.dataset.mode === 'light', null, { timeout: 3000 });

    const mode = await page.evaluate(() => document.body.dataset.mode);
    expect(mode).toBe('light');
  });

  test('compound selector: dark styles apply when data-mode and data-style are on same element', async ({ page }) => {
    // This is the core regression test for rokkit#137
    const sameElement = await page.evaluate(() => {
      const body = document.body;
      return body.hasAttribute('data-mode') && body.hasAttribute('data-style');
    });
    expect(sameElement).toBe(true);

    // Force dark via attribute (bypasses the toggle UI). The named tokens flip in
    // the `[data-mode="dark"]` block on the root element, so set it there; measure
    // the page surface itself (`body` is `bg-paper`) — the element that carries a
    // solid, always-present themed background.
    const setMode = (mode: string) =>
      page.evaluate((m) => {
        document.documentElement.dataset.mode = m;
        document.body.dataset.mode = m;
      }, mode);
    const bodyBg = () =>
      page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await setMode('dark');
    const darkBg = await bodyBg();

    await setMode('light');
    const lightBg = await bodyBg();

    // Dark and light surfaces must differ — if they're the same, the dark-mode
    // tokens aren't flipping.
    expect(darkBg).not.toBe(lightBg);
  });
});
