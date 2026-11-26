// Narration in production. scripts/sync_voice.py publishes each published article's film takes to the public media
// bucket as voice/<film>/take-NN.mp3 (scene N plays take N) and writes voice-manifest.json; the player asks voiceUrl
// for a scene's take. Each site serves them from its own media domain (one bucket behind both).
import MANIFEST from './voice-manifest.json';
import { film } from './films.js';

/** Films with published narration, and how many takes each has. */
export const VOICE: Record<string, number> = MANIFEST;

/** The media domain for the site being viewed: .org on sensei-hq.org, .com everywhere else (previews, localhost). */
const mediaOrigin = (host: string) => (host === 'sensei-hq.org' || host.endsWith('.sensei-hq.org') ? 'https://media.sensei-hq.org' : 'https://media.sensei-hq.com');

/** The published take for one scene of a film, or null when the film has no published narration. */
export function voiceUrl(slug: string, scene: string, host: string): string | null {
  const takes = VOICE[slug];
  const n = (film(slug)?.scenes.findIndex((s) => s.id === scene) ?? -1) + 1;
  if (!takes || n < 1 || n > takes) return null;
  return `${mediaOrigin(host)}/voice/${slug}/take-${String(n).padStart(2, '0')}.mp3`;
}
