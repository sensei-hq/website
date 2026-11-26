// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
kit.score(function (S, T) {
  // Action tones only (no bed): a soft pitched note for each thing that happens.
  S.tempo(70, { t0: 0 });
  S.program('bell', 'vibes', { rev: 0.6, gain: -5 });
  S.program('wood', 'marimba', { rev: 0.4, gain: -7, pan: 0.15 });
  S.program('pl', 'pluck', { rev: 0.5, gain: -9, pan: -0.15 });
  const P = (track, n, t, vel, dur) => S.note(track, n, { t, dur: dur || 0.8, vel });
  [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach((i) => P('wood', ['C4', 'E4', 'G4'][i % 3], T.hook + 0.5 + i * 0.12, 12, 0.2));
  P('bell', 'A5', T.hook + 5.2, 28, 1.6);
  P('pl', 'E5', T.today + 1.4, 24, 0.6); P('wood', 'A4', T.today + 3.2, 20, 0.4); [0, 1, 2].forEach((i) => P('pl', ['A4', 'C#5', 'E5'][i], T.today + 4.4 + i * 0.15, 18, 0.4));
  P('bell', 'B5', T.today + 6.5, 20, 1.0);
  [1.0, 3.0, 5.0].forEach((a, i) => P('wood', ['D4', 'F#4', 'A4'][i], T.loop + a, 24, 0.5));
  [0, 1, 2, 3].forEach((i) => P('pl', ['D5', 'F#5', 'A5', 'D5'][i], T.loop + 7.6 + i * 1.4, 14, 0.4));
  [0, 1, 2, 3, 4].forEach((i) => P('wood', 'E4', T.listening + 1.2 + i * 0.3, 12, 0.2));
  P('bell', 'G#5', T.listening + 7.3, 26, 1.4);
  P('wood', 'E4', T.insights + 6.6, 24, 0.3); P('pl', 'B4', T.insights + 7.0, 20, 0.5); S.chord('bell', ['E5', 'B5'], { t: T.insights + 8.2, dur: 1.4, vel: 22 });
  [0, 1, 2].forEach((i) => P('wood', ['D4', 'E4', 'F#4'][i], T.adopted + 2.0 + i * 0.7, 18, 0.3));
  P('bell', 'D5', T.adopted + 6.4, 18, 0.8); P('bell', 'A5', T.adopted + 9.0, 24, 1.2);
  S.chord('bell', ['D5', 'F#5', 'A5'], { t: T.close + 0.3, dur: 3.2, vel: 30 });
});
