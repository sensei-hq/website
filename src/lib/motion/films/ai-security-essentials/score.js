// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
kit.score(function (S, T) {
  // Quiet and tonal: a low pad per idea, a soft pitched note on each event, checks that ring brighter as defences land.
  S.tempo(72, { t0: 0 });
  S.program('pad', 'pad', { rev: 0.7, gain: -9, bright: 0.2 });
  S.program('bell', 'vibes', { rev: 0.6, gain: -5 });
  S.program('wood', 'marimba', { rev: 0.4, gain: -7, pan: 0.15 });
  S.program('pl', 'pluck', { rev: 0.5, gain: -9, pan: -0.15 });
  S.program('ep', 'ep', { rev: 0.6, gain: -7 });
  const P = (tr, n, t, vel, dur) => S.note(tr, n, { t: Math.max(0, t), dur: dur || 0.8, vel });
  const ok = ['D5', 'E5', 'F#5', 'A5', 'B5'];
  const checks = (t0, gap, n) => { for (let i = 0; i < n; i++) P('bell', ok[i], t0 + i * gap + 0.25, 30, 1.2); };
  // Pads: calm for the frame, darker under the threats, open again for the answers.
  const pad = [['hook', ['D3', 'A3'], 8, 22], ['top10', ['G2', 'D3', 'B3'], 16, 22], ['inject', ['B2', 'F#3', 'D4'], 12, 26], ['phish', ['E3', 'G3', 'B3'], 11, 26],
    ['agency', ['B2', 'F#3', 'A3'], 10, 26], ['data', ['G2', 'D3', 'B3'], 10, 24], ['responsible', ['D3', 'A3', 'F#4'], 10, 26], ['layers', ['G2', 'D3', 'A3'], 9, 28]];
  pad.forEach(([id, ch, d, v]) => S.chord('pad', ch, { t: T[id], dur: d + 2.6, vel: v }));
  // Hook: each assistant arrives with its own note; then something gets in.
  ['A4', 'E5', 'B4', 'F#5', 'D5'].forEach((n, i) => P('bell', n, T.hook - 0.2 + i * 0.15, 32, 1.6));
  [0, 1, 2, 3, 4].forEach(i => P('pl', i % 2 ? 'C#4' : 'D4', T.hook + 5.8 + i * 0.9, 26, 0.5));
  S.chord('ep', ['B3', 'D4', 'F#4'], { t: T.hook + 9.9, dur: 2.4, vel: 34 });
  // Top ten: one wooden note per risk as its card lands (same order the take names them).
  const land = [7.6, 13.8, 20.6, 9.5, 8.6, 22.1, 14.4, 15.8, 10.8, 17.2];
  ['D4', 'E4', 'F#4', 'A4', 'B4', 'D5', 'E5', 'F#5', 'A5', 'B5'].forEach((n, i) => P('wood', n, T.top10 + land[i], 30, 0.4));
  P('bell', 'D5', T.top10 + 23.0, 40, 2.2);
  // Prompt injection: read in, the hidden line, the attempt, the block, the fixes.
  P('pl', 'D4', T.inject + 2.4, 28); P('pl', 'F#4', T.inject + 3.4, 28);
  S.chord('ep', ['C4', 'D#4'], { t: T.inject + 4.1, dur: 1.2, vel: 30 });
  P('pl', 'C4', T.inject + 6.3, 30, 0.4); P('pl', 'C#4', T.inject + 6.6, 30, 0.4);
  S.fx('thud', T.inject + 7.35, { vel: 40 }); P('bell', 'D5', T.inject + 7.4, 40, 1.6);
  checks(T.inject + 8.2, 2.2, 4);
  // Phishing: each message arrives, each is flagged, then the checks.
  [0, 1, 2].forEach(i => { S.fx('click', T.phish + 2.3 + i * 1.5, { vel: 26 }); P('wood', ['A4', 'G4', 'E4'][i], T.phish + 2.3 + i * 1.5, 24, 0.4); });
  [0, 1, 2].forEach(i => P('pl', ['C4', 'C4', 'C4'][i], T.phish + 6.45 + i * 0.6, 30, 0.35));
  checks(T.phish + 8.0, 2.4, 4);
  // Agency: actions tick fast down every wire, then the limits settle it.
  S.ticks(Array.from({ length: 14 }, (_, k) => T.agency + 2.3 + k * 0.15), { vel: 22 });
  S.chord('ep', ['D4', 'F#4', 'A4'], { t: T.agency + 4.1, dur: 1.6, vel: 36 });
  S.fx('click', T.agency + 7.55, { vel: 34 });
  checks(T.agency + 4.2, 2.2, 4);
  // Data: the secrets light up, the scan passes, the output is checked.
  P('pl', 'C5', T.data + 3.25, 26, 0.4); P('pl', 'C5', T.data + 3.65, 26, 0.4);
  [0, 1].forEach(i => S.fx('tick', T.data + 5.3 + i * 0.4, { vel: 34 }));
  P('bell', 'A4', T.data + 8.8, 32, 1.4);
  checks(T.data + 3.8, 2.6, 4);
  // Responsible AI: the base, then each principle rising on it.
  P('ep', 'D3', T.responsible + 1.1, 36, 2.5);
  ['D5', 'E5', 'F#5', 'A5', 'B5'].forEach((n, i) => P('bell', n, T.responsible + 3.2 + i * 1.0, 32, 1.4));
  // Layers: each slab settles; each attempt is stopped with a bright note.
  ['D4', 'F#4', 'A4', 'B4', 'D5'].forEach((n, i) => P('wood', n, T.layers + 3.45 + i * 1.3, 30, 0.4));
  [6.0, 7.3, 8.6].forEach((a, i) => P('bell', ['A5', 'B5', 'D6'][i], T.layers + a, 36, 1.2));
  // End card: a warm open chord.
  S.chord('ep', ['D3', 'A3', 'E4', 'F#4', 'A4'], { t: T.close, dur: 3.6, vel: 54 });
  S.chord('pad', ['D2', 'A2', 'F#3', 'A3'], { t: T.close, dur: 3.8, vel: 40 });
  P('bell', 'A5', T.close + 0.1, 36, 2.6); P('bell', 'D6', T.close + 2.5, 30, 2.4);
  S.master({ gain: -7, fadeOut: 1.4 });
});
