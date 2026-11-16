// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('insights', {
  init(kit) {
    kit.css('.insights-col { position:absolute; top:170px; width:300px; height:620px; box-sizing:border-box; padding:18px; border-radius:18px; background:color-mix(in srgb, var(--tile) 70%, transparent); border:2px dashed var(--hair) }' +
      '.insights-col h4 { margin:0; font-size:24px; font-weight:600; letter-spacing:0.1em } .insights-col p { margin:4px 0 0; font-size:19px; color:var(--mute) }' +
      '.insights-k { position:absolute; width:264px; box-sizing:border-box; padding:14px 16px; border-radius:14px; background:var(--tile); border:2px solid var(--hair); font-size:21px; line-height:1.3; box-shadow:0 8px 18px rgba(0,0,0,.06) }' +
      '.insights-k.hot { border-color:var(--accent); border-width:3px } .insights-k.done { border-color:var(--jade) }' +
      '.insights-btn { position:absolute; padding:6px 14px; border-radius:999px; background:var(--main); color:var(--ground); font-size:18px; font-weight:600 }');
    // Three buckets the server sorts insights into. One decision on the top card moves it to Settled.
    const X = [880, 1200, 1520];
    const cols = [['Now', 'Needs a decision', 'var(--accent)'], ['Soon', 'Building evidence', 'var(--main)'], ['Settled', 'Decided or adopted', 'var(--jade)']]
      .map(([h, p, c], i) => '<div class="insights-col" style="left:' + X[i] + 'px"><h4 style="color:' + c + '">' + h + '</h4><p>' + p + '</p></div>').join('');
    const K = [[0, 0, 'Auth keeps being edited before it’s read', 'hot'], [0, 1, 'Two helpers format dates the same way', ''], [1, 0, 'Context fills late on long refactors', ''],
      [1, 1, 'Reviews pass more on small diffs', ''], [2, 0, 'Rule: reuse the rate limiter', 'done'], [2, 1, 'Memory: repository pattern', 'done']];
    this.K0 = K;
    const cards = K.map(([c, r, s, cls]) => '<div class="insights-k ' + cls + '" data-c="' + c + '" data-r="' + r + '">' + s + '</div>').join('');
    kit.stage.append(kit.h('<div class="ground"><div class="cam insights-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('insights-bg') + '</svg>' + cols + cards +
      '<span class="insights-btn" style="left:1048px;top:404px">Apply</span></div>' +
      W.head('insights-head', 'Insights', 'Now, soon, settled.', 'Sorted for you; each one asks for a single decision with a sensible default.', 'left:110px;top:300px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, X, cam: q('.insights-cam'), head: q('.insights-head'), cols: all('.insights-col'), cards: all('.insights-k'), btn: q('.insights-btn') });
    W.portrait(kit, { hoist: ['.insights-head'], frame: [620, 1060], crop: [870, 150, 960, 660], css: '.insights-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 12, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.cols.forEach((c, i) => W.fade(c, t, 0.8 + i * 0.3, this.K));
    const Y = (r) => 292 + r * 130;   // clear of the column headers
    // Apply on the top Now card (on "a single decision"): it travels to Settled, which makes room at its top.
    const mv = eio(seg(t, 7.0, 8.2));
    this.cards.forEach((k, i) => {
      const c = +k.dataset.c, r = +k.dataset.r, a = 1.8 + i * 0.45;
      let x = this.X[c] + 18, y = Y(r);
      if (i === 0) { x = lerp(x, this.X[2] + 18, mv); y = lerp(y, Y(0), mv); }
      if (c === 2) y = lerp(Y(r), Y(r + 1), mv);
      if (i === 1) y = lerp(Y(1), Y(0), eio(seg(t, 8.0, 8.6)));
      k.style.left = x.toFixed(1) + 'px'; k.style.top = y.toFixed(1) + 'px';
      k.style.opacity = eo(seg(t, a, a + 0.4));
      if (i === 0) { k.classList.toggle('hot', t < 7.6); k.classList.toggle('done', t >= 7.6); }
    });
    this.btn.style.opacity = (eo(seg(t, 5.2, 5.5)) * (1 - eo(seg(t, 6.8, 7.0)))).toFixed(3);
    this.btn.style.transform = 'scale(' + (t > 6.5 && t < 6.8 ? 0.9 : 1) + ')';
  },
});
