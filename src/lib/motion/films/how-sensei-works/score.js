// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
kit.score(function (S, T) {
  // Action tones only (no bed): a soft pitched note for each thing that happens.
  S.tempo(70, { t0: 0 });
  S.program('bell', 'vibes', { rev: 0.6, gain: -5 });
  S.program('wood', 'marimba', { rev: 0.4, gain: -7, pan: 0.15 });
  S.program('pl', 'pluck', { rev: 0.5, gain: -9, pan: -0.15 });
  const P = (track, n, t, vel, dur) => S.note(track, n, { t, dur: dur || 0.8, vel });
  [1.0, 3.2, 4.4, 6.2, 8.2].forEach((a, i) => P('wood', ['D4', 'F#4', 'A4', 'B4', 'D5'][i], T.hook + a, 22, 0.5));
  [0, 1, 2, 3].forEach((i) => P('pl', ['A4', 'B4', 'C#5', 'D5'][i], T.machine + 1.6 + i * 0.9, 18, 0.5)); P('wood', 'E4', T.machine + 6.2, 20, 0.3); P('bell', 'A5', T.machine + 8.4, 22, 1.0);
  P('wood', 'D4', T.gateway + 2.4, 24, 0.4); [3.6, 5.4, 6.4].forEach((a, i) => P('pl', ['F#5', 'A4', 'B4'][i], T.gateway + a, 20, 0.5)); P('wood', 'C4', T.gateway + 9.0, 26, 0.3); P('pl', 'E5', T.gateway + 9.4, 22, 0.6);
  P('bell', 'E5', T.dojo + 1.8, 22, 1.0); [0, 1, 2].forEach((i) => P('pl', ['A4', 'C#5', 'E5'][i], T.dojo + 3.0 + i * 0.2, 18, 0.4)); [0, 1, 2].forEach((i) => P('bell', ['E5', 'C#5', 'A4'][i], T.dojo + 5.6 + i * 0.2, 18, 0.8));
  P('wood', 'G4', T.relay + 2.8, 20, 0.3); [0, 1, 2].forEach((i) => P('pl', 'D5', T.relay + 3.4 + i * 1.3, 18, 0.4)); S.chord('bell', ['D5', 'A5'], { t: T.relay + 6.8, dur: 1.4, vel: 24 });
  [0, 1, 2, 3, 4, 5].forEach((i) => P('wood', 'A4', T.roles + 1.4 + i * 0.5, 14, 0.2)); [0, 1, 2, 3, 4, 5].forEach((i) => P('wood', 'E4', T.roles + 5.6 + i * 0.5, 14, 0.2));
  [0, 1, 2, 3, 4].forEach((i) => P('bell', ['D5', 'E5', 'F#5', 'A5', 'B5'][i], T.together + 1.6 + i * 1.4, 20, 0.9));
  S.chord('bell', ['D5', 'F#5', 'A5'], { t: T.close + 0.3, dur: 3.2, vel: 30 });
});
