// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
kit.score(function (S, T) {
  // Quiet and tonal, like the other films: a low pad per idea and a soft pitched note for each thing that happens.
  S.tempo(70, { t0: 0 });
  S.program('pad', 'pad', { rev: 0.7, gain: -8, bright: 0.2 });
  S.program('bell', 'vibes', { rev: 0.6, gain: -5 });
  S.program('wood', 'marimba', { rev: 0.4, gain: -7, pan: 0.15 });
  S.program('pl', 'pluck', { rev: 0.5, gain: -9, pan: -0.15 });
  const P = (track, n, t, vel, dur) => S.note(track, n, { t, dur: dur || 0.8, vel });
  const pad = [['repeat', ['D3', 'A3'], 10], ['causes', ['B2', 'F#3'], 12.5], ['read', ['G2', 'D3'], 15], ['rules', ['D3', 'A3'], 13],
    ['depth', ['E3', 'B3'], 15], ['measure', ['G2', 'D3'], 11], ['close', ['D3', 'A3', 'F#4'], 5.5]];
  pad.forEach(([id, ch, d]) => S.chord('pad', ch, { t: T[id], dur: d + 2.4, vel: 22 }));
  // Again: the same message, the same two notes, every time.
  [0, 2, 4, 6].forEach((i) => P('pl', i < 4 ? 'A4' : 'A4', T.repeat + 0.9 + i * 0.72, 24, 0.5));
  P('bell', 'C#5', T.repeat + 0.9 + 4 * 0.72 + 0.5, 28, 1.2); P('bell', 'C#5', T.repeat + 0.9 + 6 * 0.72 + 0.5, 30, 1.4);
  P('wood', 'F#4', T.causes + 1.0, 26); P('wood', 'A4', T.causes + 4.2, 26);
  [0, 1, 2, 3].forEach((i) => P('pl', 'B4', T.causes + 8.2 + i * 0.45, 20, 0.4));
  [0, 1, 2].forEach((i) => P('bell', ['D5', 'F#5', 'A5'][i], T.read + 5.3 + i * 1.1, 26, 1.0));
  P('wood', 'D4', T.rules + 3.0, 24); P('wood', 'A4', T.rules + 4.6, 24);
  S.chord('bell', ['D5', 'A5'], { t: T.rules + 7.0, dur: 1.6, vel: 26 });
  [0, 1, 2, 3, 4].forEach((i) => P('pl', ['E4', 'G#4', 'B4', 'E5', 'G#5'][i], T.depth + 5.2 + i * 0.55, 22, 0.5));
  [0, 1, 2].forEach((i) => P('wood', 'B4', T.depth + 8.8 + i * 0.3, 22));
  P('bell', 'G5', T.measure + 2.6, 24, 1.2); S.chord('bell', ['B4', 'D5', 'G5'], { t: T.measure + 6.0, dur: 2.0, vel: 28 });
  S.chord('bell', ['D5', 'F#5', 'A5'], { t: T.close + 0.3, dur: 3.2, vel: 30 });
});
