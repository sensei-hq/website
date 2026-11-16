import { describe, expect, it } from 'vitest';
import { VOICE_LEVEL, MUTED_INSTRUMENTS, collectScore } from './score.js';

describe('score mix', () => {
  // The pad is a bed; the bells, marimba and plucks are the animation's sounds and must sit
  // clearly above it, or the beats disappear under the music (heard 2026-11-15: bed loud, beats buried;
  // still too shy after the first rebalance, so the gap widened from 3x to 4x).
  it('keeps the pad bed well below the beat voices', () => {
    expect(VOICE_LEVEL.pad).toBeLessThanOrEqual(0.15);
    for (const v of ['bell', 'marimba', 'pluck']) {
      expect(VOICE_LEVEL[v], v).toBeGreaterThan(VOICE_LEVEL.pad * 4);
    }
  });
  // Then (2026-11-15, Jerry): no background score at all, only the action tones.
  it('drops the background bed and keeps the action tones', () => {
    expect(MUTED_INSTRUMENTS).toContain('pad');
    const s = collectScore(`kit.score((S, T) => { S.program('pad', 'pad'); S.program('bell', 'vibes');
      S.chord('pad', ['D3', 'A3'], { t: 0, dur: 8 }); S.note('bell', 'A5', { t: 1 }); S.fx('click', 2); });`, {});
    expect(s.events.map((e) => (e.kind === 'note' ? e.track : e.name))).toEqual(['bell', 'click']);
  });
});
