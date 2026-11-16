// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
kit.score(function (S, T) {
  // Action tones only (no bed): a soft pitched note for each thing that happens.
  S.tempo(70, { t0: 0 });
  S.program('bell', 'vibes', { rev: 0.6, gain: -5 });
  S.program('wood', 'marimba', { rev: 0.4, gain: -7, pan: 0.15 });
  S.program('pl', 'pluck', { rev: 0.5, gain: -9, pan: -0.15 });
  const P = (track, n, t, vel, dur) => S.note(track, n, { t, dur: dur || 0.8, vel });
  P('wood', 'D4', T.hook + 1.0, 22, 0.4); P('wood', 'G#4', T.hook + 4.2, 22, 0.4); P('pl', 'C5', T.hook + 8.2, 24, 0.6);
  [0, 1, 2, 3].forEach((i) => P('wood', ['A4', 'F#4', 'D4', 'A3'][i], T.enforcement + 1.0 + i * 0.4, 18, 0.4)); S.chord('bell', ['D5', 'A5'], { t: T.enforcement + 6.6, dur: 1.4, vel: 26 }); P('pl', 'F4', T.enforcement + 7.6, 20, 0.5);
  [0, 1, 2, 3, 4].forEach((i) => P('wood', ['D4', 'E4', 'F#4', 'A4', 'B4'][i], T.scope + 1.0 + i * 0.5, 18, 0.3)); S.chord('bell', ['B4', 'F#5'], { t: T.scope + 7.2, dur: 1.4, vel: 24 });
  [1.0, 3.6, 5.0, 6.6, 8.2].forEach((a, i) => P('pl', ['D4', 'F#4', 'A4', 'D5', 'F#5'][i], T.resolve + a, 20, 0.5));
  [0, 1, 2, 3, 4, 5, 6, 7].forEach((i) => P('wood', ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5', 'D5'][i], T.packs + 1.0 + i, 16, 0.3));
  P('bell', 'A4', T.sticky + 1.2, 22, 0.8); P('bell', 'A4', T.sticky + 4.0, 22, 0.8); P('wood', 'C4', T.sticky + 6.8, 28, 0.4);
  S.chord('bell', ['D5', 'F#5', 'A5'], { t: T.close + 0.3, dur: 3.2, vel: 30 });
});
