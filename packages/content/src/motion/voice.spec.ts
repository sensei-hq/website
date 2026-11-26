import { describe, expect, it } from 'vitest';
import { voiceUrl, VOICE } from './voice.js';
import { film } from './films.js';

// Narration in production (owner, 2026-11-26): the takes are published to the public media bucket by
// scripts/sync_voice.py, which writes voice-manifest.json; the player asks voiceUrl for each scene's take.
describe('production narration', () => {
  const [slug, takes] = Object.entries(VOICE)[0] ?? [];

  it('has published takes, one per scene of each film', () => {
    expect(Object.keys(VOICE).length).toBeGreaterThan(0);
    for (const [f, n] of Object.entries(VOICE)) expect(n, f).toBe(film(f)?.scenes.length);
  });

  it('serves a scene\'s take from the media domain of the site being viewed', () => {
    const first = film(slug!)!.scenes[0].id;
    expect(voiceUrl(slug!, first, 'sensei-hq.org')).toBe(`https://media.sensei-hq.org/voice/${slug}/take-01.mp3`);
    expect(voiceUrl(slug!, first, 'sensei-hq.com')).toBe(`https://media.sensei-hq.com/voice/${slug}/take-01.mp3`);
    // A preview deployment (pages.dev) or localhost uses the .com media domain.
    expect(voiceUrl(slug!, first, 'feat-x.website-5ki.pages.dev')).toBe(`https://media.sensei-hq.com/voice/${slug}/take-01.mp3`);
    const last = film(slug!)!.scenes[takes! - 1].id;
    expect(voiceUrl(slug!, last, 'sensei-hq.org')).toBe(`https://media.sensei-hq.org/voice/${slug}/take-${String(takes).padStart(2, '0')}.mp3`);
  });

  it('has no take for a film without published narration, or a scene it does not have', () => {
    expect(voiceUrl('no-such-film', 'hook', 'sensei-hq.org')).toBeNull();
    expect(voiceUrl(slug!, 'no-such-scene', 'sensei-hq.org')).toBeNull();
  });
});
