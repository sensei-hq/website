// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
kit.score(function (S, T) {
  // Action tones only (no bed): a soft pitched note for each thing that happens.
  S.tempo(70, { t0: 0 });
  S.program('bell', 'vibes', { rev: 0.6, gain: -5 });
  S.program('wood', 'marimba', { rev: 0.4, gain: -7, pan: 0.15 });
  S.program('pl', 'pluck', { rev: 0.5, gain: -9, pan: -0.15 });
  const P = (track, n, t, vel, dur) => S.note(track, n, { t, dur: dur || 0.8, vel });
  [0, 1, 2].forEach((i) => P('pl', ['A4', 'C5', 'E5'][i], T.hook + 0.6 + i * 0.3, 22, 0.4));
  P('bell', 'E5', T.hook + 3.8, 26, 1.2);
  [0, 1, 2, 3, 4].forEach((i) => P('wood', ['C4', 'D4', 'E4', 'G4', 'A4'][i], T.busy + 1.0 + i * 0.3, 18, 0.3));
  P('bell', 'A5', T.busy + 5.0, 24, 1.0);
  P('pl', 'G4', T.pair + 0.8, 22, 0.5);
  S.chord('bell', ['E5', 'G5'], { t: T.pair + 3.0, dur: 1.6, vel: 24 });
  P('pl', 'A4', T.pair + 5.6, 22, 0.5);
  S.chord('bell', ['D5', 'F#5'], { t: T.pair + 6.2, dur: 1.6, vel: 24 });
  S.chord('pl', ['G4', 'B4', 'D5'], { t: T.pair + 10.4, dur: 1.8, vel: 22 });
  [0, 1, 2, 3, 4].forEach((i) => P('wood', ['E4', 'F4', 'G4', 'A4', 'B4'][i], T.grouped + 0.8 + i * 0.35, 18, 0.3));
  P('bell', 'G5', T.grouped + 4.8, 24, 1.2);
  S.chord('bell', ['D5', 'F#5', 'A5'], { t: T.close + 0.3, dur: 3.2, vel: 30 });
});
