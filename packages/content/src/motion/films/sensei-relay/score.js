// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
kit.score(function (S, T) {
  // Quiet and tonal: a low pad underneath, and a soft pitched note for each thing that happens on the board.
  S.tempo(72, { t0: 0 });
  S.program('pad', 'pad', { rev: 0.7, gain: -8, bright: 0.2 });
  S.program('bell', 'vibes', { rev: 0.6, gain: -4 });
  S.program('wood', 'marimba', { rev: 0.4, gain: -6, pan: 0.15 });
  S.program('pl', 'pluck', { rev: 0.5, gain: -8, pan: -0.15 });
  S.program('ep', 'ep', { rev: 0.6, gain: -6 });
  const P = (track, n, t, vel, dur) => S.note(track, n, { t, dur: dur || 0.8, vel });
  // Pad: one long chord per idea, very low.
  S.chord('pad', ['D3', 'A3'], { t: 0, dur: T.manual + 0.1, vel: 22 });
  S.chord('pad', ['B2', 'F#3'], { t: T.manual, dur: T.register - T.manual + 0.1, vel: 22 });
  S.chord('pad', ['G2', 'D3', 'B3'], { t: T.register, dur: T.dispatch - T.register + 0.1, vel: 28 });
  S.chord('pad', ['D3', 'A3', 'E4'], { t: T.dispatch, dur: T.review - T.dispatch + 0.1, vel: 30 });
  S.chord('pad', ['B2', 'F#3', 'D4'], { t: T.review, dur: T.handover - T.review + 0.1, vel: 30 });
  S.chord('pad', ['G2', 'D3', 'A3'], { t: T.handover, dur: 2.5, vel: 26 });
  // Silos: each assistant appears with its own lone note, unconnected.
  ['A4', 'E5', 'B4', 'F#5', 'D5', 'A5'].forEach((n, i) => P('bell', n, Math.max(0, 0.05 + i * 0.7), 34, 1.6));
  // Manual relay: soft clicks at pick-up and drop, a plucked step as the card is carried, then the same two notes going round and round.
  S.fx('click', T.manual + 1.2, { vel: 30 }); P('pl', 'D4', T.manual + 1.6, 34);
  S.fx('click', T.manual + 3.2, { vel: 30 }); P('pl', 'E4', T.manual + 3.8, 34);
  P('pl', 'F#4', T.manual + 5.0, 34);
  [0, 1, 2, 3].forEach(k => P('wood', k % 2 ? 'F#4' : 'E4', T.manual + 5.9 + k * 0.4, 26, 0.3));
  // Register: the controller takes its mark, then one note per wire, rising as each contributor connects.
  P('bell', 'D5', T.register + 3.45, 46, 2);
  ['E5', 'F#5', 'A5', 'B5', 'D6'].forEach((n, i) => P('bell', n, T.register + 5.05 + i * 0.25, 36, 1.4));
  // Dispatch: a falling wooden note as each task leaves, a soft pluck as it lands, a rising bell as each report returns.
  ['D5', 'B4', 'A4', 'F#4', 'E4'].forEach((n, i) => {
    P('wood', n, T.dispatch + 2.6 + i * 0.25, 34, 0.4);
    P('pl', n.replace('4', '3').replace('5', '4'), T.dispatch + 3.5 + i * 0.25, 28, 0.5);
  });
  ['A4', 'B4', 'D5', 'E5', 'F#5'].forEach((n, i) => P('bell', n, T.dispatch + 5.9 + i * 0.22, 36, 1.2));
  // Review: a gentle chime per peer check, a quiet glide as results merge, then the gate meters climb in a run.
  ['F#5', 'A5', 'B5', 'D6', 'E6'].forEach((n, i) => P('bell', n, T.review + 3.0 + i * 0.3, 30, 1.2));
  ['B3', 'D4', 'F#4', 'A4', 'B4'].forEach((n, i) => P('pl', n, T.review + 4.4 + i * 0.12, 26, 0.6));
  ['D5', 'E5', 'F#5', 'A5'].forEach((n, i) => P('wood', n, T.review + 5.6 + i * 0.25, 26, 0.3));
  S.chord('ep', ['D4', 'F#4', 'A4', 'E5'], { t: T.review + 7.0, dur: 1.4, vel: 46 });
  // Handover: a note steps away and comes back, the crown glides along the wire, the new controller rings.
  P('wood', 'A4', T.handover + 0.45, 28, 0.4); P('wood', 'E4', T.handover + 0.95, 24, 0.4);
  P('wood', 'E4', T.handover + 1.55, 24, 0.4); P('wood', 'A4', T.handover + 1.95, 28, 0.4);
  ['F#4', 'A4', 'B4', 'D5'].forEach((n, i) => P('pl', n, T.handover + 2.3 + i * 0.15, 28, 0.5));
  P('bell', 'D5', T.handover + 3.05, 42, 1.6);
  // End card: a warm, open chord that rings out.
  S.chord('ep', ['D3', 'A3', 'E4', 'F#4', 'A4'], { t: T.handover + 3.65, dur: 3.2, vel: 54 });
  S.chord('pad', ['D2', 'A2', 'F#3', 'A3'], { t: T.handover + 3.65, dur: 3.0, vel: 40 });
  P('bell', 'A5', T.handover + 3.7, 36, 2.6); P('bell', 'D6', T.handover + 4.35, 30, 2.2);
  S.master({ gain: -7, fadeOut: 1.6 });
});
