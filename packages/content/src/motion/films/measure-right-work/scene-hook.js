// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('hook', {
  init(kit) {
    kit.css('.hook-ctr { position:absolute; left:960px; width:600px; height:170px; box-sizing:border-box; padding:24px 34px; box-shadow:0 12px 26px rgba(0,0,0,.06) }' +
      '.hook-ctr h4 { margin:0; font-size:24px; font-weight:600; letter-spacing:0.1em; color:var(--mute) } .hook-ctr b { display:block; margin-top:6px; font-family:var(--display); font-weight:400; font-size:78px; line-height:1; font-variant-numeric:tabular-nums }' +
      '.hook-ctr i { position:absolute; right:34px; top:58px; font-style:normal; font-size:56px; color:var(--jade) }' +
      '.hook-q { position:absolute; left:1660px; top:540px; transform:translate(-50%,-50%); font-family:var(--display); font-size:300px; line-height:1; color:var(--accent) }');
    // Three activity counters running up (illustrative), then the question.
    const C = [['TOKENS', 1240000, ''], ['COMMITS', 148, ''], ['LINES CHANGED', 9412, '+']];
    kit.stage.append(kit.h('<div class="ground"><div class="cam hook-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('hook-bg') + '</svg>' +
      C.map(([n, v, pre], i) => '<div class="card hook-ctr" style="top:' + (230 + i * 200) + 'px"><h4>' + n + '</h4><b data-v="' + v + '" data-p="' + pre + '">0</b><i>↑</i></div>').join('') +
      '<div class="hook-q">?</div></div>' +
      W.head('hook-head', 'Developer productivity', 'More tokens. More commits. Is any of it right?', '', 'left:110px;top:300px;width:720px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.hook-cam'), head: q('.hook-head'), ctr: all('.hook-ctr'), nums: all('.hook-ctr b'), qm: q('.hook-q') });
    W.portrait(kit, { hoist: ['.hook-head'], frame: [640, 900], crop: [930, 200, 880, 620], css: '.hook-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 6.5, 1, 1.03, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.ctr.forEach((c, i) => W.fade(c, t, 0.6 + i * 0.3, this.K));
    this.nums.forEach((b, i) => { const p = eio(seg(t, 0.8 + i * 0.3, 3.4 + i * 0.3)); b.textContent = b.dataset.p + Math.round(+b.dataset.v * p).toLocaleString('en-US'); });
    // The question lands on "Is any of it right?".
    W.pop(this.qm, t, 3.8, this.K, 'translate(-50%,-50%)');
  },
});
