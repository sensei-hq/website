// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
kit.score(function (S, T) {
  // Action tones only (no bed): a soft pitched note for each thing that happens.
  S.tempo(70, { t0: 0 });
  S.program('bell', 'vibes', { rev: 0.6, gain: -5 });
  S.program('wood', 'marimba', { rev: 0.4, gain: -7, pan: 0.15 });
  S.program('pl', 'pluck', { rev: 0.5, gain: -9, pan: -0.15 });
  const P = (track, n, t, vel, dur) => S.note(track, n, { t, dur: dur || 0.8, vel });
  P('wood', 'E4', T.hook + 0.6, 18, 0.3);
  [0, 1, 2].forEach((i) => P('wood', ['F4', 'G4', 'A4'][i], T.hook + 1.2 + i * 0.4, 18, 0.3));
  P('bell', 'E5', T.hook + 3.4, 26, 1.2);
  [0, 1, 2].forEach((i) => P('wood', ['C4', 'E4', 'G4'][i], T['review-bottleneck'] + 0.6 + i * 0.35, 18, 0.3));
  P('pl', 'A4', T['review-bottleneck'] + 1.4, 22, 0.5);
  P('pl', 'G4', T['review-bottleneck'] + 2.6, 22, 0.5);
  P('bell', 'G5', T['review-bottleneck'] + 3.4, 24, 1.0);
  P('wood', 'D4', T['rework-loop'] + 0.6, 20, 0.3);
  P('wood', 'F#4', T['rework-loop'] + 1.6, 20, 0.3);
  P('bell', 'A4', T['rework-loop'] + 3.0, 24, 1.0);
  P('pl', 'A4', T['codebase-prompt'] + 0.6, 22, 0.5);
  P('pl', 'C5', T['codebase-prompt'] + 1.0, 22, 0.5);
  P('pl', 'E5', T['codebase-prompt'] + 1.7, 22, 0.5);
  S.chord('bell', ['E5', 'G5'], { t: T['codebase-prompt'] + 2.2, dur: 1.6, vel: 24 });
  S.chord('bell', ['D5', 'F#5', 'A5'], { t: T.close + 0.3, dur: 3.2, vel: 30 });
});
