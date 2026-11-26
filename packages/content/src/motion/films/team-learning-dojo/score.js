// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
kit.score(function (S, T) {
  // Action tones only (no bed): a soft pitched note for each thing that happens.
  S.tempo(70, { t0: 0 });
  S.program('bell', 'vibes', { rev: 0.6, gain: -5 });
  S.program('wood', 'marimba', { rev: 0.4, gain: -7, pan: 0.15 });
  S.program('pl', 'pluck', { rev: 0.5, gain: -9, pan: -0.15 });
  const P = (track, n, t, vel, dur) => S.note(track, n, { t, dur: dur || 0.8, vel });
  [0, 1, 2, 3].forEach((i) => P('pl', 'A4', T.hook + 2.0 + i * 0.9, 20, 0.4)); P('bell', 'C#5', T.hook + 6.0, 24, 1.2);
  [5.4, 7.0, 8.6].forEach((a, i) => P('wood', ['D4', 'F#4', 'A4'][i], T.constitution + a, 24, 0.5));
  P('pl', 'A4', T.share + 3.8, 22, 0.5); P('wood', 'E4', T.share + 7.2, 26, 0.3); S.chord('bell', ['E5', 'A5'], { t: T.share + 8.4, dur: 1.6, vel: 26 });
  [0, 1, 2, 3].forEach((i) => P('wood', 'B4', T.triage + 1.0 + i * 0.4, 16, 0.3)); P('pl', 'E5', T.triage + 4.6, 22, 0.5);
  P('wood', 'G4', T.triage + 5.6, 20, 0.4); P('bell', 'B5', T.triage + 8.2, 24, 1.0); [0, 1, 2, 3].forEach((i) => P('pl', ['E5', 'G#5', 'B5', 'E6'][i], T.triage + 10.2 + i * 0.15, 16, 0.4));
  P('bell', 'A5', T.upgrade + 1.4, 24, 1.0); P('wood', 'E4', T.upgrade + 6.2, 24, 0.3); P('pl', 'C#5', T.upgrade + 6.6, 22, 0.6);
  [0, 1, 2].forEach((i) => P('wood', ['D4', 'F#4', 'A4'][i], T.resolve + 1.0 + i * 0.6, 20, 0.4)); [0, 1, 2, 3, 4].forEach((i) => P('pl', ['D5', 'E5', 'F#5', 'A5', 'B5'][i], T.resolve + 4.8 + i * 0.5, 16, 0.4));
  S.chord('bell', ['D5', 'F#5', 'A5'], { t: T.close + 0.3, dur: 3.2, vel: 30 });
});
