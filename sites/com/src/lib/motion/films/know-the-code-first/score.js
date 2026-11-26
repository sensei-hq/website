// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
kit.score(function (S, T) {
  // Action tones only (no bed): a soft pitched note for each thing that happens.
  S.tempo(70, { t0: 0 });
  S.program('bell', 'vibes', { rev: 0.6, gain: -5 });
  S.program('wood', 'marimba', { rev: 0.4, gain: -7, pan: 0.15 });
  S.program('pl', 'pluck', { rev: 0.5, gain: -9, pan: -0.15 });
  const P = (track, n, t, vel, dur) => S.note(track, n, { t, dur: dur || 0.8, vel });
  S.ticks(Array.from({ length: 12 }, (_, i) => T.hook + 1.0 + i * 0.42), { vel: 8 });
  [0, 1, 2, 3, 4].forEach((i) => P('wood', ['C4', 'D4', 'C4', 'Eb4', 'D4'][i], T.hook + 3.4 + i * 0.8, 18, 0.3));
  P('pl', 'D5', T.map + 0.8, 20, 0.5); P('pl', 'F#5', T.map + 4.6, 22, 0.5); P('pl', 'A5', T.map + 8.2, 24, 0.5);
  P('wood', 'C4', T.coupling + 3.6, 24, 0.4); P('wood', 'Eb4', T.coupling + 5.6, 22, 0.4); P('pl', 'Bb4', T.coupling + 8.4, 24, 0.6);
  P('bell', 'D5', T.drift + 3.0, 18, 0.8); P('wood', 'C4', T.drift + 5.0, 26, 0.4); P('pl', 'F5', T.drift + 6.4, 24, 0.6);
  [0, 1, 2, 3].forEach((i) => P('wood', ['D4', 'E4', 'F#4', 'A4'][i], T.context + 2.2 + i * 0.3, 16, 0.3)); S.chord('bell', ['D5', 'A5'], { t: T.context + 4.4, dur: 1.6, vel: 24 });
  [0, 1, 2].forEach((i) => P('pl', ['E4', 'G4', 'C5'][i], T.intake + 4.0 + i * 0.9, 20, 0.5)); P('bell', 'E5', T.intake + 7.4, 22, 1.0); S.chord('bell', ['C5', 'E5', 'G5'], { t: T.intake + 9.5, dur: 1.6, vel: 26 });
  S.chord('bell', ['D5', 'F#5', 'A5'], { t: T.close + 0.3, dur: 3.2, vel: 30 });
});
