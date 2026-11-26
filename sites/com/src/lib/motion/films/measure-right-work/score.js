// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
kit.score(function (S, T) {
  // Action tones only (no bed): a soft pitched note for each thing that happens.
  S.tempo(70, { t0: 0 });
  S.program('bell', 'vibes', { rev: 0.6, gain: -5 });
  S.program('wood', 'marimba', { rev: 0.4, gain: -7, pan: 0.15 });
  S.program('pl', 'pluck', { rev: 0.5, gain: -9, pan: -0.15 });
  const P = (track, n, t, vel, dur) => S.note(track, n, { t, dur: dur || 0.8, vel });
  S.ticks(Array.from({ length: 22 }, (_, i) => T.hook + 0.8 + i * 0.12), { vel: 10 });
  P('bell', 'F5', T.hook + 3.8, 28, 1.4);
  [0, 1, 2, 3, 4].forEach((i) => P('wood', ['C4', 'D4', 'E4', 'D4', 'E4'][i], T.problem + 1.0 + i * 0.15, 18, 0.3));
  [0, 1, 2, 3, 4].forEach((i) => P('wood', ['F4', 'G4', 'A4', 'G4', 'A4'][i], T.problem + 3.0 + i * 0.2, 22, 0.3));
  P('pl', 'C#5', T.problem + 5.0, 24, 0.6);
  P('pl', 'A4', T.pair + 2.9, 22, 0.5); P('bell', 'E5', T.pair + 3.9, 24, 1.0);
  P('pl', 'C5', T.pair + 6.3, 22, 0.5); S.chord('bell', ['A4', 'C5', 'E5'], { t: T.pair + 10.6, dur: 1.8, vel: 24 });
  [0, 1, 2, 3, 4].forEach((i) => P('wood', ['D4', 'E4', 'F#4', 'A4', 'B4'][i], T.sensei + 0.8 + i * 0.35, 20, 0.3));
  S.chord('bell', ['D5', 'A5'], { t: T.sensei + 4.8, dur: 1.6, vel: 26 });
  S.chord('bell', ['D5', 'F#5', 'A5'], { t: T.close + 0.3, dur: 3.2, vel: 30 });
});
