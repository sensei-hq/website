// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
kit.score(function (S, T) {
  // Action tones only (no bed): a soft pitched note for each thing that happens.
  S.tempo(70, { t0: 0 });
  S.program('bell', 'vibes', { rev: 0.6, gain: -5 });
  S.program('wood', 'marimba', { rev: 0.4, gain: -7, pan: 0.15 });
  S.program('pl', 'pluck', { rev: 0.5, gain: -9, pan: -0.15 });
  const P = (track, n, t, vel, dur) => S.note(track, n, { t, dur: dur || 0.8, vel });
  [0, 1, 2].forEach((i) => P('pl', ['E4', 'G4', 'A4'][i], T.hook + 0.8 + i * 0.5, 22, 0.5));
  P('bell', 'E5', T.hook + 3.2, 26, 1.2);
  P('wood', 'C4', T['open-door'] + 0.6, 18, 0.3);
  P('wood', 'E4', T['open-door'] + 1.0, 18, 0.3);
  P('wood', 'G4', T['open-door'] + 1.4, 18, 0.3);
  P('bell', 'A5', T['open-door'] + 2.6, 24, 1.0);
  [0, 1, 2, 3].forEach((i) => P('wood', ['D4', 'F4', 'A4', 'C5'][i], T['flip-default'] + 0.8 + i * 0.4, 20, 0.3));
  S.chord('bell', ['E5', 'G5'], { t: T['flip-default'] + 3.0, dur: 1.6, vel: 24 });
  P('pl', 'G4', T['fails-closed'] + 0.8, 22, 0.5);
  P('pl', 'B4', T['fails-closed'] + 1.9, 22, 0.5);
  S.chord('bell', ['B4', 'D5', 'G5'], { t: T['fails-closed'] + 2.6, dur: 1.8, vel: 24 });
  S.chord('bell', ['D5', 'F#5', 'A5'], { t: T.close + 0.3, dur: 3.2, vel: 30 });
});
