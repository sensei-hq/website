// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
kit.score(function (S, T) {
  // Action tones only (no bed): a soft pitched note for each thing that happens.
  S.tempo(70, { t0: 0 });
  S.program('bell', 'vibes', { rev: 0.6, gain: -5 });
  S.program('wood', 'marimba', { rev: 0.4, gain: -7, pan: 0.15 });
  S.program('pl', 'pluck', { rev: 0.5, gain: -9, pan: -0.15 });
  const P = (track, n, t, vel, dur) => S.note(track, n, { t, dur: dur || 0.8, vel });
  [0, 1, 2].forEach((i) => P('pl', ['E4', 'G4', 'B4'][i], T.hook + 1.2 + i * 0.5, 22, 0.5));
  [0, 1, 2].forEach((i) => P('wood', 'D4', T.hook + 3.0 + i * 0.35, 20, 0.3));
  P('wood', 'A4', T.definition + 3.3, 24); P('pl', 'C#5', T.definition + 4.3, 22, 0.6);
  [0, 1, 2, 3].forEach((i) => P('bell', ['A4', 'C#5', 'E5', 'A5'][i], T.definition + 5.4 + i * 0.18, 20, 0.8));
  [1.0, 2.6, 4.2, 5.8].forEach((a, i) => P('wood', ['D4', 'F#4', 'A4', 'D5'][i], T.signals + a, 24));
  P('pl', 'B4', T.trend + 3.0, 20, 0.6); P('pl', 'E5', T.trend + 5.0, 22, 0.6); S.chord('bell', ['E5', 'G#5', 'B5'], { t: T.trend + 6.2, dur: 1.8, vel: 26 });
  [0, 1, 2, 3, 4, 5, 6].forEach((k) => P('pl', ['D4', 'E4', 'F#4', 'A4', 'B4', 'D5', 'E5'][k], T.sensei + 2.6 + k * 0.42, 20, 0.4));
  S.chord('bell', ['D5', 'F#5', 'A5'], { t: T.close + 0.3, dur: 3.2, vel: 30 });
});
