// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
kit.score(function (S, T) {
  // Action tones only (no bed): a soft pitched note for each thing that happens.
  S.tempo(70, { t0: 0 });
  S.program('bell', 'vibes', { rev: 0.6, gain: -5 });
  S.program('wood', 'marimba', { rev: 0.4, gain: -7, pan: 0.15 });
  S.program('pl', 'pluck', { rev: 0.5, gain: -9, pan: -0.15 });
  const P = (track, n, t, vel, dur) => S.note(track, n, { t, dur: dur || 0.8, vel });
  const TIP = T['in-process'];
  [0, 1, 2, 3, 4, 5].forEach((i) => P('wood', ['C4', 'E4', 'G4', 'C4', 'E4', 'G4'][i], T.hook + 1.2 + i * 0.3, 18, 0.3));
  P('bell', 'G5', T.hook + 3.4, 24, 1.0);
  [0, 1, 2, 3].forEach((i) => P('pl', ['A4', 'C5', 'E5', 'A5'][i], T.socket + 0.8 + i * 0.3, 22, 0.4));
  P('wood', 'D4', T.socket + 1.6, 20, 0.3);
  [0, 1, 2, 3].forEach((i) => P('wood', ['E4', 'F4', 'G4', 'A4'][i], T.socket + 2.0 + i * 0.3, 18, 0.3));
  [0, 1, 2].forEach((i) => P('pl', ['A4', 'C5', 'E5'][i], T.badges + 0.8 + i * 0.5, 22, 0.5));
  S.chord('bell', ['E5', 'G5'], { t: T.badges + 3.2, dur: 1.6, vel: 24 });
  [0, 1, 2].forEach((i) => P('wood', ['D4', 'F#4', 'A4'][i], TIP + 0.8 + i * 0.4, 20, 0.3));
  P('bell', 'E5', TIP + 2.2, 22, 1.0);
  [0, 1].forEach((i) => P('pl', ['B4', 'D5'][i], TIP + 2.4 + i * 0.4, 22, 0.5));
  S.chord('bell', ['B4', 'D5', 'G5'], { t: TIP + 3.4, dur: 1.8, vel: 24 });
  S.chord('bell', ['D5', 'F#5', 'A5'], { t: T.close + 0.3, dur: 3.2, vel: 30 });
});
