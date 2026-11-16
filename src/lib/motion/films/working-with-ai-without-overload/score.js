// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
kit.score(function (S, T) {
  // Quiet and tonal: a crowding of small notes for the flood, then one clear note per step of the cycle.
  S.tempo(72, { t0: 0 });
  S.program('pad', 'pad', { rev: 0.7, gain: -9, bright: 0.2 });
  S.program('bell', 'vibes', { rev: 0.6, gain: -5 });
  S.program('wood', 'marimba', { rev: 0.4, gain: -7, pan: 0.15 });
  S.program('pl', 'pluck', { rev: 0.5, gain: -10, pan: -0.15 });
  S.program('ep', 'ep', { rev: 0.6, gain: -7 });
  const P = (tr, n, t, vel, dur) => S.note(tr, n, { t: Math.max(0, t), dur: dur || 0.8, vel });
  const pad = [['flood', ['D3', 'A3'], 10, 22], ['questions', ['B2', 'F#3', 'D4'], 11, 24], ['define', ['G2', 'D3', 'B3'], 15, 26], ['build', ['D3', 'A3', 'E4'], 15, 28], ['payoff', ['G2', 'D3', 'A3'], 13, 26]];
  pad.forEach(([id, ch, d, v]) => S.chord('pad', ch, { t: T[id], dur: d + 2.6, vel: v }));
  // The flood: one small plucked note per slip, closer and closer together.
  const scale = ['D4', 'E4', 'F#4', 'A4', 'B4', 'D5', 'E5', 'F#5'];
  const r = (k) => ((k * 53 + 17) % 8);
  for (let k = 0; k < 38; k++) P('pl', scale[r(k)], T.flood + 0.9 + 7.2 * Math.pow(k / 38, 0.75) + 0.7, 18 + Math.min(14, k / 3), 0.4);
  // The questions: three notes that rise and stay open.
  ['A4', 'B4', 'E5'].forEach((n, i) => P('bell', n, T.questions + 2.25 + i * 2.6, 34, 2.0));
  // Define: one clear bell per step, a pluck as the arc draws on.
  [[2.4, 'D5'], [4.8, 'F#5'], [11.0, 'A5']].forEach(([a, n]) => { P('bell', n, T.define + a, 40, 1.8); P('pl', 'D4', T.define + a - 0.5, 22, 0.5); });
  // Build: design, plan, results; the mock-up sketches, the phases pass, the loop closes.
  [[1.0, 'B5'], [12.2, 'D6'], [15.4, 'E6']].forEach(([a, n]) => { P('bell', n, T.build + a, 38, 1.8); P('pl', 'A4', T.build + a - 0.5, 22, 0.5); });
  [0, 1, 2].forEach(k => P('wood', ['D5', 'E5', 'F#5'][k], T.build + 10.1 + k * 0.4, 26, 0.3));
  [0, 1, 2].forEach(k => P('wood', ['A4', 'B4', 'D5'][k], T.build + 12.9 + k * 0.8, 32, 0.4));
  S.chord('ep', ['D4', 'F#4', 'A4', 'E5'], { t: T.build + 17.2, dur: 2.0, vel: 44 });
  // Payoff: a soft bright note for each slip that passes, a low pluck for each that goes to review.
  for (let k = 0; k < 9; k++) {
    const at = T.payoff + 1.0 + k * 0.95 + 0.88, fail = k === 3 || k === 7;
    if (fail) P('pl', 'C4', at, 30, 0.5); else P('bell', ['A5', 'B5', 'D6'][k % 3], at, 22, 0.9);
  }
  [0, 1, 2].forEach(i => P('wood', ['D5', 'E5', 'F#5'][i], T.payoff + 2.25 + i * 2.4, 24, 0.3));
  // End card: a warm open chord.
  S.chord('ep', ['D3', 'A3', 'E4', 'F#4', 'A4'], { t: T.close, dur: 5, vel: 54 });
  S.chord('pad', ['D2', 'A2', 'F#3', 'A3'], { t: T.close, dur: 5.6, vel: 40 });
  P('bell', 'A5', T.close + 0.1, 36, 3); P('bell', 'D6', T.close + 0.8, 30, 3);
  S.master({ gain: -7, fadeOut: 2 });
});
