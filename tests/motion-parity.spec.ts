import { test, expect } from '@playwright/test';

// JSON scenes must render the same pixels as the .js twins they replace. The show's capture
// mode seeks frame-exactly, so each converted film is shot scene by scene from both sources.
// Page-driven (no src imports): Playwright runs in plain node, where the app's
// import.meta.glob and JSON imports do not resolve.
const CONVERTED = ['measure-right-work'];

type ShowMeta = { scenes: { id: string; start: number; dur: number }[] };
const metaOf = (page: import('@playwright/test').Page) =>
  page.evaluate(() => (window as unknown as { __show: { meta: ShowMeta } }).__show.meta);

for (const slug of CONVERTED) {
  for (const o of ['landscape', 'portrait'] as const) {
    test(`${slug} ${o}: JSON matches the .js twin`, async ({ page }) => {
      await page.setViewportSize(o === 'landscape' ? { width: 1920, height: 1080 } : { width: 1080, height: 1920 });
      const shots: Record<'js' | 'json', Buffer[]> = { js: [], json: [] };
      let samples: number[] = [];
      for (const src of ['js', 'json'] as const) {
        await page.goto(`/show/${slug}?capture=1&o=${o}&src=${src}`);
        await page.waitForFunction(() => (window as unknown as { __show?: { ready: unknown } }).__show?.ready);
        await page.evaluate(() => (window as unknown as { __show: { ready: Promise<unknown> } }).__show.ready);
        if (!samples.length) {
          const meta = await metaOf(page);
          for (const s of meta.scenes) for (const f of [0.08, 0.5, 0.92]) samples.push(s.start + s.dur * f);
        }
        for (const t of samples) {
          await page.evaluate(
            (tt) => (window as unknown as { __show: { seek: (t: number) => Promise<void> } }).__show.seek(tt),
            t,
          );
          shots[src].push(await page.screenshot());
        }
      }
      expect(shots.json.length).toBe(shots.js.length);
      shots.json.forEach((b, i) => expect(b.equals(shots.js[i]), `sample ${samples[i].toFixed(2)}s`).toBe(true));
    });
  }
}
