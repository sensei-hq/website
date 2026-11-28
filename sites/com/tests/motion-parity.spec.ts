import { test, expect, type Browser, type Page } from '@playwright/test';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

// JSON scenes must render the same picture as the .js twins they replace. The show's capture
// mode seeks frame-exactly, so each converted film is shot scene by scene from both sources.
// Page-driven (no src imports): Playwright runs in plain node, where the app's
// import.meta.glob and JSON imports do not resolve.
//
// Two hardening lessons, both verified by experiment while converting measure-right-work:
// - Fonts: Google Fonts serves unicode-range subsets that fetch lazily on first use, after
//   `ready`. Each variant warms every sample and waits for network idle before shooting.
// - Oracle: byte equality conflates invisible 1-LSB antialiasing dust (deterministic per
//   construction path, identical DOM/styles/layout/fonts) with real differences, and would
//   never hold across platforms. pixelmatch at threshold 0.1 ignores sub-perceptual dust
//   while any visible regression (wrong glyph, shifted layout, missing element) fails.
// - Budget: on a loaded machine (the full suite, a CI runner) the hook scene's slowly zooming camera layer can be
//   shot before Chrome re-rasterises it, leaving 9–25 differing pixels of edge noise in a ~2M-pixel frame (seen at
//   "hook at 3.25s", never reproduced in isolation). A wrong or shifted glyph at these sizes changes hundreds of
//   pixels, so a 100-pixel budget absorbs the noise and still fails every visible regression.
const CONVERTED = ['measure-right-work'];
const THRESHOLD = 0.1;
const MAX_DIFF_PIXELS = 100;

type ShowApi = { meta: { scenes: { id: string; start: number; dur: number }[] }; ready: Promise<unknown>; seek: (t: number) => Promise<void> };
const api = (page: Page) => page.evaluate(() => (window as unknown as { __show: ShowApi }).__show.meta);

async function shoot(browser: Browser, slug: string, o: 'landscape' | 'portrait', src: 'js' | 'json') {
  const context = await browser.newContext({ viewport: o === 'landscape' ? { width: 1920, height: 1080 } : { width: 1080, height: 1920 } });
  const page = await context.newPage();
  await page.goto(`/show/${slug}?capture=1&o=${o}&src=${src}`);
  await page.waitForFunction(() => (window as unknown as { __show?: { ready: unknown } }).__show?.ready);
  await page.evaluate(() => (window as unknown as { __show: ShowApi }).__show.ready);
  const meta = await api(page);
  const samples: { id: string; t: number }[] = [];
  for (const s of meta.scenes) for (const f of [0.08, 0.5, 0.92]) samples.push({ id: s.id, t: s.start + s.dur * f });
  for (const smp of samples) await page.evaluate((t) => (window as unknown as { __show: ShowApi }).__show.seek(t), smp.t);
  await page.waitForLoadState('networkidle');
  const shots: Buffer[] = [];
  for (const smp of samples) {
    await page.evaluate((t) => (window as unknown as { __show: ShowApi }).__show.seek(t), smp.t);
    shots.push(await page.screenshot());
  }
  await context.close();
  return { samples, shots };
}

const diffPixels = (a: Buffer, b: Buffer, out?: PNG) => {
  const p1 = PNG.sync.read(a), p2 = PNG.sync.read(b);
  return pixelmatch(p1.data, p2.data, out?.data ?? null, p1.width, p1.height, { threshold: THRESHOLD });
};

for (const slug of CONVERTED) {
  for (const o of ['landscape', 'portrait'] as const) {
    test(`${slug} ${o}: JSON matches the .js twin`, async ({ browser }) => {
      const fromJs = await shoot(browser, slug, o, 'js');
      const fromJson = await shoot(browser, slug, o, 'json');
      expect(fromJson.samples.map((s) => s.t)).toEqual(fromJs.samples.map((s) => s.t));
      for (const [i, shot] of fromJson.shots.entries()) {
        const label = `${fromJson.samples[i].id} at ${fromJson.samples[i].t.toFixed(2)}s`;
        const { width, height } = PNG.sync.read(shot);
        const diff = new PNG({ width, height });
        const n = diffPixels(shot, fromJs.shots[i], diff);
        // A failing frame keeps its evidence (CI uploads test-results): both renders and the diff.
        if (n > MAX_DIFF_PIXELS) {
          await test.info().attach(`${label} js`, { body: fromJs.shots[i], contentType: 'image/png' });
          await test.info().attach(`${label} json`, { body: shot, contentType: 'image/png' });
          await test.info().attach(`${label} diff`, { body: PNG.sync.write(diff), contentType: 'image/png' });
        }
        expect(n, label).toBeLessThanOrEqual(MAX_DIFF_PIXELS);
      }
    });
  }
}
