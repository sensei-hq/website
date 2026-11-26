// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('listening', {
  init(kit) {
    kit.css('.listening-c { position:absolute; top:190px; width:450px; height:520px; box-sizing:border-box; padding:24px 28px; border-radius:20px; background:var(--tile); border:2px solid var(--hair); box-shadow:0 12px 26px rgba(0,0,0,.06) }' +
      '.listening-c h4 { margin:0; font-size:22px; font-weight:600; letter-spacing:0.1em; color:var(--mute) } .listening-say { position:absolute; left:28px; right:28px; bottom:30px; font-family:var(--display); font-size:38px; line-height:1.2 }' +
      '.listening-f { position:absolute; left:28px; right:28px; bottom:26px; padding:16px 18px; border-radius:14px; border:3px solid var(--accent); background:var(--ground); font-size:24px; line-height:1.3 }' +
      '.listening-f b { display:block; font-size:18px; letter-spacing:0.1em; color:var(--accent); margin-bottom:4px }' +
      '.listening-bar { position:absolute; left:880px; top:760px; width:940px } .listening-bar p { margin:0 0 10px; font-size:22px; color:var(--mute); font-weight:600; letter-spacing:0.08em }');
    // Two moments of the same screen: week one, with too little to go on, and later, once there is signal.
    const R = kit.rng(3);
    let dots = '';
    for (let i = 0; i < 46; i++) {
      const late = i >= 6, x0 = late ? 1400 : 910;
      dots += '<circle class="listening-d" data-late="' + (late ? 1 : 0) + '" data-i="' + i + '" cx="' + (x0 + 30 + R() * 360).toFixed(0) + '" cy="' + (270 + R() * 230).toFixed(0) + '" r="9" style="fill:var(--main)"/>';
    }
    kit.stage.append(kit.h('<div class="ground"><div class="cam listening-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('listening-bg') + '</svg>' +
      '<div class="listening-c" style="left:880px"><h4>WEEK ONE</h4><p class="listening-say">Still listening…</p></div>' +
      '<div class="listening-c listening-late" style="left:1370px"><h4>LATER</h4><div class="listening-f"><b>NEEDS YOU</b>Small diffs pass review twice as often here.</div></div>' +
      '<svg class="art" viewBox="0 0 1920 1080">' + dots + '<rect x="880" y="800" width="940" height="18" rx="9" style="fill:var(--hair)"/><rect class="listening-fill" x="880" y="800" width="0" height="18" rx="9" style="fill:var(--jade)"/></svg>' +
      '<div class="listening-bar"><p>SESSIONS WATCHED</p></div></div>' +
      W.head('listening-head', 'Early days', 'At first, it just listens.', 'No advice until there’s enough to go on.', 'left:110px;top:320px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.listening-cam'), head: q('.listening-head'), cards: all('.listening-c'), say: q('.listening-say'), f: q('.listening-f'), dots: all('.listening-d'), fill: q('.listening-fill'), bar: q('.listening-bar') });
    W.portrait(kit, { hoist: ['.listening-head'], frame: [620, 1060], crop: [860, 170, 980, 670], css: '.listening-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 11.5, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    W.fade(this.cards[0], t, 0.6, this.K); W.fade(this.bar, t, 0.8, this.K);
    this.say.style.opacity = (eo(seg(t, 1.6, 2.0)) * (0.6 + 0.4 * Math.abs(Math.sin(t * 1.5)))).toFixed(3);
    // Sessions accumulate; the bar fills to the target, and only then the later card shows a finding.
    this.dots.forEach((d) => { const i = +d.dataset.i, at = d.dataset.late === '1' ? 4.6 + (i - 6) * 0.06 : 1.2 + i * 0.3; d.style.opacity = eo(seg(t, at, at + 0.25)); });
    this.fill.setAttribute('width', (940 * (0.12 * eo(seg(t, 1.2, 2.6)) + 0.88 * eio(seg(t, 4.6, 7.0)))).toFixed(1));
    W.fade(this.cards[1], t, 4.2, this.K);
    W.pop(this.f, t, 7.3, this.K);
  },
});
