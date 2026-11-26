// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
kit.score(function (S, T) {
  // Action tones only (no bed): a soft pitched note for each thing that happens.
  S.tempo(70, { t0: 0 });
  S.program('bell', 'vibes', { rev: 0.6, gain: -5 });
  S.program('wood', 'marimba', { rev: 0.4, gain: -7, pan: 0.15 });
  S.program('pl', 'pluck', { rev: 0.5, gain: -9, pan: -0.15 });
  const P = (track, n, t, vel, dur) => S.note(track, n, { t, dur: dur || 0.8, vel });
  [0, 1, 2].forEach((i) => P('wood', ['E4', 'G4', 'A4'][i], T.hook + 0.8 + i * 0.5, 18, 0.3));
  P('bell', 'E5', T.hook + 3.2, 26, 1.2);
  [0, 1, 2, 3].forEach((i) => P('pl', ['A4', 'C5', 'D5', 'E5'][i], T['one-list'] + 1.1 + i * 0.35, 22, 0.5));
  S.chord('bell', ['E5', 'G5'], { t: T['one-list'] + 3.0, dur: 1.6, vel: 24 });
  [0, 1, 2].forEach((i) => P('wood', ['D4', 'F#4', 'A4'][i], T['deepest-path'] + 0.8 + i * 0.5, 20, 0.3));
  S.chord('bell', ['B4', 'D5', 'G5'], { t: T['deepest-path'] + 2.9, dur: 1.8, vel: 24 });
  [0, 1, 2, 3].forEach((i) => P('pl', ['G4', 'A4', 'B4', 'D5'][i], T['two-arrows'] + 0.8 + i * 0.4, 20, 0.4));
  S.chord('bell', ['C5', 'E5', 'G5'], { t: T['two-arrows'] + 2.7, dur: 1.8, vel: 24 });
  S.chord('bell', ['D5', 'F#5', 'A5'], { t: T.close + 0.3, dur: 3.2, vel: 30 });
});
