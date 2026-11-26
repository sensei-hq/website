// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
kit.score(function (S, T) {
  // Action tones only (no bed): a soft pitched note for each thing that happens.
  S.tempo(70, { t0: 0 });
  S.program('bell', 'vibes', { rev: 0.6, gain: -5 });
  S.program('wood', 'marimba', { rev: 0.4, gain: -7, pan: 0.15 });
  S.program('pl', 'pluck', { rev: 0.5, gain: -9, pan: -0.15 });
  const P = (track, n, t, vel, dur) => S.note(track, n, { t, dur: dur || 0.8, vel });
  [0, 1, 2].forEach((i) => P('wood', ['E4', 'F4', 'G4'][i], T.hook + 1.2 + i * 0.35, 18, 0.3));
  P('bell', 'E5', T.hook + 2.6, 26, 1.2);
  P('bell', 'A4', T.hook + 3.2, 24, 1.0);
  [0, 1].forEach((i) => P('pl', ['C4', 'E4'][i], T['single-provider'] + 0.6 + i * 0.4, 22, 0.5));
  P('bell', 'D5', T['single-provider'] + 2.4, 26, 1.2);
  [0, 1, 2].forEach((i) => P('wood', ['D4', 'F#4', 'A4'][i], T.chain + 0.8 + i * 0.5, 20, 0.3));
  S.chord('bell', ['E5', 'G5'], { t: T.chain + 2.8, dur: 1.6, vel: 24 });
  [0, 1, 2].forEach((i) => P('pl', ['G4', 'A4', 'B4'][i], T['order-kept'] + 0.6 + i * 0.4, 20, 0.4));
  P('wood', 'C4', T['order-kept'] + 1.2, 22, 0.3);
  S.chord('bell', ['B4', 'D5', 'G5'], { t: T['order-kept'] + 2.6, dur: 1.8, vel: 24 });
  S.chord('bell', ['D5', 'F#5', 'A5'], { t: T.close + 0.3, dur: 3.2, vel: 30 });
});
