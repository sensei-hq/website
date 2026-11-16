// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('context', {
  init(kit) {
    kit.css('.context-q { position:absolute; left:910px; top:250px; padding:14px 20px; border-radius:18px; border-bottom-right-radius:4px; background:var(--main); color:var(--ground); font-size:25px }' +
      '.context-tool { position:absolute; left:1530px; width:260px; height:72px; box-sizing:border-box; display:flex; align-items:center; gap:14px; padding:0 18px; border-radius:14px; background:var(--tile); border:2px solid var(--hair); font-size:24px; font-weight:600 }' +
      '.context-tool i { width:14px; height:14px; border-radius:50%; background:var(--jade) }' +
      '.context-pack { position:absolute; left:910px; top:350px; width:560px; box-sizing:border-box; padding:18px 22px; border-radius:16px; background:var(--ground); border:3px solid var(--jade) }' +
      '.context-pack h4 { margin:0 0 10px; font-size:19px; font-weight:600; letter-spacing:0.1em; color:var(--jade) } .context-pack div { padding:9px 0; border-top:2px solid var(--hair); font-size:21px; line-height:1.3 }' +
      '.context-pack code { font-family:var(--mono); font-size:20px } .context-fb { position:absolute; left:910px; top:690px; width:560px; font-size:22px; line-height:1.35; color:var(--mute) }');
    // The assistant asks; Sensei's tools answer from the graph, search, rules and memory; one focused bundle comes back.
    const T = ['Graph', 'Search', 'Rules', 'Memory'];
    kit.stage.append(kit.h('<div class="ground"><div class="cam context-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('context-bg') +
      T.map((_, i) => '<path class="context-w" pathLength="1" d="M1528 ' + (246 + i * 96) + ' Q1500 ' + (246 + i * 96) + ' 1474 400" style="fill:none;stroke:var(--jade);stroke-width:4"/>').join('') + '</svg>' +
      W.win('context-win', 880, 160, 620, 640, 'Assistant') +
      '<div class="context-q">Where is rate limiting handled?</div>' +
      T.map((s, i) => '<div class="context-tool" style="top:' + (210 + i * 96) + 'px"><i></i>' + s + '</div>').join('') +
      '<div class="context-pack"><h4>FROM SENSEI · FIRST TURN</h4><div><code>auth/limits.ts</code> · RateLimiter, allow()</div><div>Called from <code>api/login.ts</code> login()</div>' +
      '<div>Rule: reuse the existing rate limiter</div><div>Memory: limits are per IP, not per user</div></div>' +
      '<p class="context-fb">And when it can’t find something, it says so, and the assistant falls back to searching.</p></div>' +
      W.head('context-head', 'Context', 'The right context on the first turn.', 'Sensei’s tools answer from the map, your rules and what it has learned.', 'left:110px;top:300px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.context-cam'), head: q('.context-head'), win: q('.context-win'), qq: q('.context-q'), tools: all('.context-tool'), w: all('.context-w'), pack: q('.context-pack'), rows: all('.context-pack div'), fb: q('.context-fb') });
    W.portrait(kit, { hoist: ['.context-head'], frame: [620, 1060], crop: [870, 150, 940, 670], css: '.context-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 12.5, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    W.fade(this.win, t, 0.4, this.K);
    W.fade(this.qq, t, 1.0, this.K);
    this.tools.forEach((s, i) => W.fade(s, t, 2.2 + i * 0.3, this.K));
    this.w.forEach((w, i) => W.draw(w, t, 3.6 + i * 0.15, 4.2 + i * 0.15, this.K));
    W.fade(this.pack, t, 4.4, this.K);
    this.rows.forEach((r, i) => W.fade(r, t, 4.8 + i * 0.45, this.K, 0.35, 8));
    W.fade(this.fb, t, 8.6, this.K);
  },
});
