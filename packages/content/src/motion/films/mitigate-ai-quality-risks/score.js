// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
kit.score(function (S, T) {
  // Action tones only (no bed): a soft pitched note for each thing that happens.
  S.tempo(70, { t0: 0 });
  S.program('bell', 'vibes', { rev: 0.6, gain: -5 });
  S.program('wood', 'marimba', { rev: 0.4, gain: -7, pan: 0.15 });
  S.program('pl', 'pluck', { rev: 0.5, gain: -9, pan: -0.15 });
  const P = (track, n, t, vel, dur) => S.note(track, n, { t, dur: dur || 0.8, vel });
  // Hook: one note per gate as the work passes it (gate times follow the eased run, 1.0–5.0 s).
  [1.95, 2.55, 3.1, 3.65, 4.3].forEach((a, i) => P('pl', ['D4', 'E4', 'F#4', 'A4', 'D5'][i], T.hook + a, 22, 0.5));
  const HA = [1.0, 4.6, 8.4, 9.9, 12.6];
  [0, 1, 2, 3, 4].forEach((i) => { P('wood', 'A3', T.habits + HA[i], 18, 0.3); P('bell', ['D5', 'E5', 'F#5', 'A5', 'B5'][i], T.habits + HA[i] + 1.4, 22, 0.8); });
  [0, 1, 2].forEach((i) => P('pl', 'C5', T.why + 2.4 + i * 0.3, 18, 0.3));
  [0, 1, 2].forEach((i) => P('bell', ['G5', 'B5', 'D6'][i], T.why + 5.6 + i * 0.3, 20, 0.8));
  [0, 1, 2, 3, 4].forEach((i) => P('wood', ['D4', 'E4', 'F#4', 'G4', 'A4'][i], T.sensei + 1.2 + i * 0.25, 18, 0.3));
  P('pl', 'C5', T.sensei + 5.2, 24, 0.6); S.chord('bell', ['D5', 'A5'], { t: T.sensei + 7.7, dur: 1.6, vel: 26 });
  S.chord('bell', ['D5', 'F#5', 'A5'], { t: T.close + 0.3, dur: 3.2, vel: 30 });
});
