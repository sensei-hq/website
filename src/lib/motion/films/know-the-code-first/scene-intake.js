// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('intake', {
  init(kit) {
    kit.css('.intake-in { position:absolute; left:910px; top:240px; width:880px; height:76px; box-sizing:border-box; display:flex; align-items:center; padding:0 24px; border-radius:16px; background:var(--ground); border:2px solid var(--main); font-size:28px }' +
      '.intake-in i { width:3px; height:34px; margin-left:4px; background:var(--accent) }' +
      '.intake-ax { position:absolute; top:360px; width:280px; box-sizing:border-box; padding:16px 20px; border-radius:16px; background:var(--tile); border:2px solid var(--hair) }' +
      '.intake-ax b { display:block; font-size:19px; font-weight:600; letter-spacing:0.1em; color:var(--mute) } .intake-ax span { display:block; margin-top:4px; font-family:var(--display); font-size:36px }' +
      '.intake-ax small { display:block; margin-top:4px; font-size:19px; color:var(--mute) } .intake-ax.hot { border-color:var(--accent) } .intake-ax.hot span { color:var(--accent) }' +
      '.intake-pb { position:absolute; left:910px; top:560px; width:880px; box-sizing:border-box; display:flex; align-items:center; gap:22px; padding:20px 24px; border-radius:18px; background:var(--ground); border:3px solid var(--jade) }' +
      '.intake-pb div { flex:1 } .intake-pb b { display:block; font-size:19px; font-weight:600; letter-spacing:0.1em; color:var(--jade) } .intake-pb p { margin:4px 0 0; font-size:24px; line-height:1.3 } .intake-pb p strong { font-family:var(--display); font-weight:400; font-size:34px }' +
      '.intake-ok { flex:none; padding:12px 26px; border-radius:999px; background:var(--main); color:var(--ground); font-size:24px; font-weight:600 }');
    const text = 'Fix the login timeout on slow networks';
    this.text = text;
    const A = [['LIFECYCLE', 'Stable', 'Existing code and docs', ''], ['INTENT', 'Bug', 'From the description', ''], ['RISK', 'High', '23 callers depend on it', 'hot']];
    kit.stage.append(kit.h('<div class="ground"><div class="cam intake-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('intake-bg') + '</svg>' +
      W.win('intake-win', 880, 160, 940, 600, 'Intake · 門') +
      '<div class="intake-in"><span class="intake-tx"></span><i class="intake-cur"></i></div>' +
      A.map(([b, s, m, c], i) => '<div class="intake-ax ' + c + '" style="left:' + (910 + i * 300) + 'px"><b>' + b + '</b><span>' + s + '</span><small>' + m + '</small></div>').join('') +
      '<div class="intake-pb"><div><b>RECOMMENDED WAY OF WORKING</b><p><strong>debug-flow</strong> · reproduce, find the cause, fix, verify; you stay in the loop.</p></div><span class="intake-ok">Confirm</span></div></div>' +
      W.head('intake-head', 'Intake', 'Start with the right way of working.', 'Describe the chunk. Sensei reads what it can and recommends a playbook; you confirm.', 'left:110px;top:300px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.intake-cam'), head: q('.intake-head'), win: q('.intake-win'), inp: q('.intake-in'), tx: q('.intake-tx'), cur: q('.intake-cur'), ax: all('.intake-ax'), pb: q('.intake-pb'), ok: q('.intake-ok') });
    W.portrait(kit, { hoist: ['.intake-head'], frame: [620, 1060], crop: [870, 150, 960, 620], css: '.intake-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 12.5, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    W.fade(this.win, t, 0.4, this.K); W.fade(this.inp, t, 0.8, this.K);
    const n = Math.round(this.text.length * clamp01(seg(t, 1.2, 3.4)));
    this.tx.textContent = this.text.slice(0, n);
    this.cur.style.opacity = t < 3.8 ? (Math.sin(t * 8) > 0 ? 1 : 0) : 0;
    // Sensei's reading, one axis at a time; risk comes from the code graph's blast radius.
    this.ax.forEach((a, i) => W.fade(a, t, 4.0 + i * 0.9, this.K));
    W.fade(this.pb, t, 7.4, this.K);
    const press = t > 9.4 && t < 9.7;
    this.ok.style.transform = 'scale(' + (press ? 0.92 : 1) + ')'; this.ok.style.background = t > 9.6 ? 'var(--jade)' : 'var(--main)';
  },
});
