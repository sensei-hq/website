// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
kit.score(function (S, T) {
  // Action tones only (no bed): a soft pitched note for each thing that happens.
  S.tempo(70, { t0: 0 });
  S.program('bell', 'vibes', { rev: 0.6, gain: -5 });
  S.program('wood', 'marimba', { rev: 0.4, gain: -7, pan: 0.15 });
  S.program('pl', 'pluck', { rev: 0.5, gain: -9, pan: -0.15 });
  const P = (track, n, t, vel, dur) => S.note(track, n, { t, dur: dur || 0.8, vel });
  [0, 1, 2, 3, 4].forEach((i) => P('wood', ['E4', 'F4', 'G4', 'A4', 'B4'][i], T.hook + 0.8 + i * 0.4, 18, 0.3));
  P('bell', 'E5', T.hook + 3.4, 26, 1.2);
  [0, 1, 2, 3, 4].forEach((i) => P('pl', ['A4', 'C5', 'D5', 'E5', 'G5'][i], T.habits + 1.0 + i * 0.6, 22, 0.5));
  S.chord('bell', ['A4', 'E5'], { t: T.habits + 4.2, dur: 1.6, vel: 22 });
  [0, 1, 2, 3].forEach((i) => P('wood', ['C4', 'E4', 'G4', 'B4'][i], T.why + 1.6 + i * 0.3, 18, 0.3));
  [0, 1, 2, 3].forEach((i) => P('pl', ['D5', 'E5', 'G5', 'A5'][i], T.why + 4.6 + i * 0.3, 20, 0.4));
  S.chord('bell', ['E5', 'G5'], { t: T.why + 6.0, dur: 1.6, vel: 24 });
  [0, 1, 2, 3, 4, 5].forEach((i) => P('pl', ['C5', 'D5', 'E5', 'G5', 'A5', 'C6'][i], T.sensei + 1.0 + i * 0.3, 20, 0.4));
  P('wood', 'D4', T.sensei + 3.8, 20, 0.5);
  P('bell', 'G5', T.sensei + 5.2, 24, 1.0);
  P('pl', 'E5', T.sensei + 6.6, 20, 0.4);
  P('bell', 'A5', T.sensei + 7.4, 24, 1.0);
  S.chord('bell', ['D5', 'F#5', 'A5'], { t: T.close + 0.3, dur: 3.2, vel: 30 });
});
