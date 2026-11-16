import { test, expect } from '@playwright/test';
import { film as getFilm, timeline } from '../src/lib/motion/films.js';

// JSON scenes must render the same pixels as the .js twins they replace. The show's capture
// mode seeks frame-exactly, so each converted film is shot scene by scene from both sources.
const CONVERTED = ['measure-right-work'];

for (const slug of CONVERTED) {
  const tl = timeline(getFilm(slug)!);
  const samples: number[] = [];
  for (const s of tl.scenes) for (const f of [0.08, 0.5, 0.92]) samples.push(s.start + s.dur * f);
  for (const o of ['landscape', 'portrait'] as const) {
    test(`${slug} ${o}: JSON matches the .js twin`, async ({ page }) => {
      await page.setViewportSize(o === 'landscape' ? { width: 1920, height: 1080 } : { width: 1080, height: 1920 });
      const shots: Record<'js' | 'json', Buffer[]> = { js: [], json: [] };
      for (const src of ['js', 'json'] as const) {
        await page.goto(`/show/${slug}?capture=1&o=${o}&src=${src}`);
        await page.waitForFunction(() => (window as unknown as { __show?: { ready: unknown } }).__show?.ready);
        await page.evaluate(() => (window as unknown as { __show: { ready: Promise<unknown> } }).__show.ready);
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
