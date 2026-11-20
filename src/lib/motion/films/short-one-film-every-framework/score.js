// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
kit.score(function (S, T) {
  // Action tones only (no bed): a soft pitched note for each thing that happens.
  S.tempo(70, { t0: 0 });
  S.program('bell', 'vibes', { rev: 0.6, gain: -5 });
  S.program('wood', 'marimba', { rev: 0.4, gain: -7, pan: 0.15 });
  S.program('pl', 'pluck', { rev: 0.5, gain: -9, pan: -0.15 });
  const P = (track, n, t, vel, dur) => S.note(track, n, { t, dur: dur || 0.8, vel });
  [0, 1, 2].forEach((i) => P('wood', ['E4', 'G4', 'A4'][i], T.hook + 0.8 + i * 0.5, 20, 0.3));
  P('bell', 'E5', T.hook + 3.0, 26, 1.2);
  [0, 1].forEach((i) => P('pl', ['A4', 'C5'][i], T['framework-free-core'] + 0.6 + i * 0.8, 22, 0.5));
  P('wood', 'G4', T['framework-free-core'] + 1.0, 20, 0.3);
  P('bell', 'G5', T['framework-free-core'] + 2.6, 24, 1.0);
  [0, 1, 2].forEach((i) => P('pl', ['G4', 'A4', 'B4'][i], T['three-wrappers'] + 1.2 + i * 0.4, 20, 0.4));
  P('bell', 'A5', T['three-wrappers'] + 2.8, 24, 1.0);
  [0, 1, 2].forEach((i) => P('wood', ['D4', 'F#4', 'A4'][i], T['one-element-tag'] + 1.2 + i * 0.35, 20, 0.3));
  P('bell', 'B5', T['one-element-tag'] + 2.8, 24, 1.0);
  S.chord('bell', ['D5', 'F#5', 'A5'], { t: T.close + 0.3, dur: 3.2, vel: 30 });
});
