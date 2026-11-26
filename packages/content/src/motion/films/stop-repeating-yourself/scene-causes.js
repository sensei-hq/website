// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('causes', {
  init(kit) {
    kit.css('.causes-card { top:220px; width:440px; height:620px; box-sizing:border-box; padding:34px 34px; display:flex; flex-direction:column; gap:18px; box-shadow:0 14px 30px rgba(0,0,0,.06) }' +
      '.causes-card h3 { margin:0; font-family:var(--display, serif); font-weight:400; font-size:54px; line-height:1.05; letter-spacing:-0.01em } .causes-card p { margin:0; font-size:28px; line-height:1.35; color:var(--soft) }' +
      '.causes-pic { height:300px; position:relative; border-radius:14px; background:color-mix(in srgb, var(--board) 70%, var(--tile)) }' +
      '.causes-ask { position:absolute; left:24px; right:24px; top:20px; display:flex; flex-direction:column; gap:8px; font-size:24px; color:var(--main) }' +
      '.causes-ask b { font-size:26px; line-height:1.2; color:var(--second); margin-bottom:4px } .causes-ask span { display:flex; align-items:center; gap:10px; height:46px } .causes-ask u { flex:1; height:0; border-bottom:3px dashed var(--wire); text-decoration:none }' +
      '.causes-q { flex:none; font-style:normal; width:40px; height:40px; border-radius:20px; background:var(--accent); color:var(--ground); font-weight:700; font-size:26px; display:flex; align-items:center; justify-content:center }');
    const loop = '<svg viewBox="-125 -125 250 250" style="position:absolute;inset:0;margin:auto;width:250px;height:250px"><g class="causes-loop">' +
      '<path d="M0 -84 A84 84 0 0 1 72 42" style="fill:none;stroke:var(--accent);stroke-width:12;stroke-linecap:round"/><path d="M99.2 34.2 L69.7 47.2 L66.3 15.2" style="fill:none;stroke:var(--accent);stroke-width:12;stroke-linecap:round;stroke-linejoin:round"/>' +
      '<path d="M72 42 A84 84 0 0 1 -72 42" transform="rotate(120)" style="fill:none;stroke:var(--main);stroke-width:12;stroke-linecap:round"/>' +
      '<path d="M0 -84 A84 84 0 0 1 72 42" transform="rotate(240)" style="fill:none;stroke:var(--wire);stroke-width:12;stroke-linecap:round"/></g>' +
      '<text y="12" text-anchor="middle" style="font:600 30px var(--sans, sans-serif);fill:var(--second)">again</text></svg>';
    const ask = '<div class="causes-ask"><b>Add CSV export</b>' + ['Done when', 'Columns', 'Edge cases', 'Who can use it'].map((s, i) =>
      '<span>' + s + ' <u></u><i class="causes-q">?</i></span>').join('') + '</div>';
    kit.stage.append(kit.h('<div class="ground"><div class="cam causes-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('causes-bg') + '</svg>' +
      '<div class="card causes-card" style="left:880px"><div class="causes-pic">' + loop + '</div><h3>It drifts</h3><p>It guesses, skips a pattern or makes things up. You correct it, and round it goes.</p></div>' +
      '<div class="card causes-card" style="left:1380px"><div class="causes-pic">' + ask + '</div><h3>The ask is thin</h3><p>Key details are missing, so it fills the gaps with guesses.</p></div></div>' +
      W.head('causes-head', 'Two reasons', 'Why the output misses.', 'Most misses come down to one of these.', 'left:110px;top:330px;width:660px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.causes-cam'), head: q('.causes-head'), cards: all('.causes-card'), loop: q('.causes-loop'), qs: all('.causes-q'), blanks: all('.causes-ask u') });
    W.portrait(kit, { hoist: ['.causes-head'], frame: [560, 1300], crop: [860, 200, 980, 640], css: '.causes-head{left:70px!important;top:140px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 11, 1, 1.025, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    // Timed to the voiceover: the second card arrives on "or the ask is thin", after the drift half is told.
    this.cards.forEach((c, i) => {
      const p = seg(t, 1.0 + i * 5.2, 1.7 + i * 5.2);
      c.style.opacity = eo(p);
      c.style.transform = 'translateY(' + lerp(50, 0, eob(p, 1.3)).toFixed(1) + 'px)';
    });
    // The loop keeps turning: correct, retry, correct.
    this.loop.setAttribute('transform', 'rotate(' + (eio(seg(t, 1.6, 3.4)) * 360 + Math.max(0, t - 3.4) * 50).toFixed(1) + ')');
    // Each blank in the request becomes a guess, as the take says "fills the gaps with guesses".
    this.blanks.forEach((b, i) => { b.style.borderBottomColor = t > 8.2 + i * 0.45 ? 'var(--accent)' : 'var(--wire)'; });
    this.qs.forEach((g, i) => { const p = seg(t, 8.2 + i * 0.45, 8.6 + i * 0.45); g.style.opacity = eo(p); g.style.transform = 'scale(' + lerp(0.3, 1, eob(p, 2)).toFixed(3) + ')'; });
  },
});
