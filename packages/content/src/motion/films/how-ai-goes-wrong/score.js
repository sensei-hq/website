// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
kit.score(function (S, T) {
  // Action tones only (no bed): a soft pitched note for each thing that happens.
  S.tempo(70, { t0: 0 });
  S.program('bell', 'vibes', { rev: 0.6, gain: -5 });
  S.program('wood', 'marimba', { rev: 0.4, gain: -7, pan: 0.15 });
  S.program('pl', 'pluck', { rev: 0.5, gain: -9, pan: -0.15 });
  const P = (track, n, t, vel, dur) => S.note(track, n, { t, dur: dur || 0.8, vel });
  [0, 1, 2, 3, 4].forEach((i) => P('wood', ['A3', 'C4', 'E4', 'G4', 'A4'][i], T.hook + 1.0 + i * 0.3, 22, 0.4));
  // One low wooden knock per failure, a higher one when it lands.
  [1.0, 3.6, 6.2, 8.8, 11.4].forEach((a, i) => { P('wood', 'D4', T.patterns + a, 22, 0.4); P('pl', ['F4', 'G4', 'A4', 'C5', 'D5'][i], T.patterns + a + 1.5, 22, 0.5); });
  [1, 3, 4, 5, 6].forEach((i, k) => P('pl', ['A4', 'C5', 'D5', 'E5', 'G5'][k], T.trace + 4.6 + i * 0.35, 22, 0.4));
  [0, 1, 2, 3, 4].forEach((i) => P('wood', 'E4', T.sensei + 1.0 + i * 0.35, 18, 0.3));
  P('bell', 'B4', T.sensei + 5.2, 24, 1.2);
  // Prevent: a rising, settled pair per row.
  [0, 1, 2, 3, 4].forEach((i) => { P('bell', ['D5', 'E5', 'F#5', 'A5', 'B5'][i], T.prevent + 1.4 + i * 2.0, 20, 0.8); P('wood', 'A4', T.prevent + 1.9 + i * 2.0, 18, 0.4); });
  S.chord('bell', ['D5', 'F#5', 'A5'], { t: T.prevent + 11.6, dur: 1.8, vel: 24 });
  S.chord('bell', ['D5', 'F#5', 'A5'], { t: T.close + 0.3, dur: 3.2, vel: 30 });
});
