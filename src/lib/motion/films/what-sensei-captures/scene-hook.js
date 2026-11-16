// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('hook', {
  init(kit) {
    kit.css('.hook-msg { position:absolute; box-sizing:border-box; padding:12px 18px; border-radius:16px; font-size:22px; line-height:1.3 }' +
      '.hook-you { left:1500px; width:290px; background:var(--main); color:var(--ground); border-bottom-right-radius:4px } .hook-ai { left:1410px; width:300px; background:var(--ground); border:2px solid var(--hair); border-bottom-left-radius:4px; color:var(--soft) }');
    // The work: an editor and an assistant side by side. A lens moves over both, and what it sees gets a mark.
    const code = [[0, 220, 'ink'], [30, 300], [30, 260], [60, 180, 'ok'], [60, 320], [30, 140], [0, 90, 'ink'], [0, 0], [0, 240, 'ink'], [30, 340], [30, 200], [0, 90, 'ink']];
    const marks = [[1000, 252], [1060, 386], [1000, 540], [1640, 270], [1560, 420], [1660, 560]];
    kit.stage.append(kit.h('<div class="ground"><div class="cam hook-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('hook-bg') + '</svg>' +
      W.win('hook-ed', 880, 180, 480, 620, 'auth/limits.ts') + W.win('hook-chat', 1390, 180, 430, 620, 'Assistant') +
      '<div class="hook-msg hook-you" style="top:260px">Add rate limits to /login.</div><div class="hook-msg hook-ai" style="top:370px">Reading auth/session.ts…</div>' +
      '<div class="hook-msg hook-ai" style="top:470px">Editing auth/limits.ts</div><div class="hook-msg hook-you" style="top:570px">Use the existing limiter.</div>' +
      '<svg class="art" viewBox="0 0 1920 1080">' + W.bars('hook-row', 920, 270, code.filter((r) => r[1]), 40, 13) +
      marks.map(([x, y]) => '<circle class="hook-mark" cx="' + x + '" cy="' + y + '" r="11" style="fill:var(--jade);stroke:var(--ground);stroke-width:4"/>').join('') +
      '<g class="hook-lens"><circle r="92" style="fill:color-mix(in srgb, var(--accent) 6%, transparent);stroke:var(--accent);stroke-width:5;stroke-dasharray:14 10"/><circle r="6" style="fill:var(--accent)"/></g></svg></div>' +
      W.head('hook-head', 'Sensei', 'What does Sensei actually see?', 'A mentor learns by watching the work.', 'left:110px;top:300px;width:700px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, marks, cam: q('.hook-cam'), head: q('.hook-head'), wins: [q('.hook-ed'), q('.hook-chat')], msgs: all('.hook-msg'), rows: all('.hook-row'), dots: all('.hook-mark'), lens: q('.hook-lens') });
    W.portrait(kit, { hoist: ['.hook-head'], frame: [640, 1000], crop: [870, 170, 960, 640], css: '.hook-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 9, 1, 1.03, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.wins.forEach((w, i) => W.fade(w, t, 0.3 + i * 0.25, this.K));
    this.rows.forEach((r, i) => { r.style.opacity = eo(seg(t, 0.7 + i * 0.05, 1.0 + i * 0.05)); });
    this.msgs.forEach((m, i) => W.fade(m, t, 1.1 + i * 0.45, this.K, 0.4, 12));
    // The lens visits each mark in turn; a mark lights once it has been seen.
    const P = this.marks, f = clamp01(seg(t, 2.6, 7.4)) * (P.length - 1), k = Math.min(P.length - 2, Math.floor(f)), u = eio(f - k);
    const x = lerp(P[k][0], P[k + 1][0], u), y = lerp(P[k][1], P[k + 1][1], u);
    this.lens.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');
    this.lens.style.opacity = eo(seg(t, 2.3, 2.7));
    this.dots.forEach((d, i) => { const at = 2.6 + (i / (P.length - 1)) * 4.8; d.style.opacity = eo(seg(t, at, at + 0.3)); });
  },
});
