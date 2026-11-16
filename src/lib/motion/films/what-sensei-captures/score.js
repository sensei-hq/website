// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
kit.score(function (S, T) {
  // Action tones only (no bed): a soft pitched note for each thing that happens.
  S.tempo(70, { t0: 0 });
  S.program('bell', 'vibes', { rev: 0.6, gain: -5 });
  S.program('wood', 'marimba', { rev: 0.4, gain: -7, pan: 0.15 });
  S.program('pl', 'pluck', { rev: 0.5, gain: -9, pan: -0.15 });
  const P = (track, n, t, vel, dur) => S.note(track, n, { t, dur: dur || 0.8, vel });
  [0, 1, 2, 3, 4, 5].forEach((i) => P('pl', ['D4', 'F#4', 'A4', 'B4', 'D5', 'E5'][i], T.hook + 2.6 + i * 0.96, 20, 0.5));
  [1.6, 3.4, 5.2, 7.0].forEach((a, i) => P('wood', ['D4', 'E4', 'F#4', 'A4'][i], T.streams + a, 24, 0.5));
  S.chord('bell', ['D5', 'A5'], { t: T.streams + 8.2, dur: 1.6, vel: 22 });
  [0, 1, 2, 3, 4, 5, 6, 7].forEach((i) => P('wood', i === 5 ? 'C5' : 'A4', T.sessions + 1.0 + i * 0.55, i === 5 ? 26 : 16, 0.3));
  P('bell', 'E5', T.sessions + 6.3, 24, 1.2);
  P('pl', 'D5', T.graph + 2.6, 18, 0.5); P('pl', 'F#5', T.graph + 4.4, 18, 0.5); S.chord('bell', ['A4', 'D5'], { t: T.graph + 5.2, dur: 1.4, vel: 20 }); P('pl', 'C#5', T.graph + 8.2, 24, 0.6);
  P('wood', 'G4', T.local + 2.0, 20, 0.4); P('pl', 'B4', T.local + 5.8, 24, 0.5); P('bell', 'D5', T.local + 6.3, 24, 1.0); P('wood', 'C4', T.local + 8.6, 22, 0.4);
  P('pl', 'A4', T.share + 3.8, 22, 0.5); P('wood', 'E4', T.share + 7.2, 26, 0.3); S.chord('bell', ['E5', 'A5'], { t: T.share + 8.4, dur: 1.6, vel: 26 });
  S.chord('bell', ['D5', 'F#5', 'A5'], { t: T.close + 0.3, dur: 3.2, vel: 30 });
});
