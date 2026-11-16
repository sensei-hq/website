// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('sensei', {
  init(kit) {
    kit.css('.sensei-src { position:absolute; left:940px; top:800px; display:flex; gap:14px }' +
      '.sensei-src span { padding:10px 20px; border-radius:999px; font-size:26px; font-weight:600; background:var(--tile); border:2px solid var(--hair) }' +
      '.sensei-src em { font-style:normal; color:var(--mute); font-weight:400 } .sensei-lab { position:absolute; font-size:24px; color:var(--mute); letter-spacing:0.08em; font-weight:600 }');
    // Git history as a line of commits. Every fourth one is sampled and measured; the measurements make the trend.
    const n = 25, x = (i) => 950 + i * 34, gy = 690;
    const v = [0.42, 0.47, 0.45, 0.53, 0.58, 0.55, 0.64];
    let commits = '', samples = '';
    for (let i = 0; i < n; i++) commits += '<circle class="sensei-c" cx="' + x(i) + '" cy="' + gy + '" r="9" style="fill:var(--tile);stroke:var(--main);stroke-width:4"/>';
    const pts = v.map((h, k) => [x(k * 4), 610 - h * 600]);
    pts.forEach(([px, py], k) => {
      samples += '<g class="sensei-s"><line x1="' + px + '" x2="' + px + '" y1="' + (gy - 14) + '" y2="' + py + '" style="stroke:var(--hair);stroke-width:3;stroke-dasharray:6 8"/>' +
        '<circle cx="' + px + '" cy="' + gy + '" r="17" style="fill:none;stroke:var(--accent);stroke-width:4"/><circle cx="' + px + '" cy="' + py + '" r="12" style="fill:var(--jade)"/></g>';
    });
    const path = 'M' + pts.map((p) => p[0] + ' ' + p[1].toFixed(1)).join(' L');
    kit.stage.append(kit.h('<div class="ground"><div class="cam sensei-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('sensei-bg') +
      '<line class="sensei-git" pathLength="1" x1="930" x2="1790" y1="' + gy + '" y2="' + gy + '" style="stroke:var(--main);stroke-width:5;stroke-linecap:round"/>' + commits + samples +
      '<path class="sensei-trend" pathLength="1" d="' + path + '" style="fill:none;stroke:var(--jade);stroke-width:7;stroke-linecap:round;stroke-linejoin:round"/></svg>' +
      '<span class="sensei-lab sensei-lg" style="left:940px;top:720px">GIT HISTORY · SAMPLED COMMITS</span>' +
      '<div class="sensei-src"><span>qlty <em>duplication, smells</em></span><span>your tests <em>coverage</em></span><span>git <em>churn</em></span></div></div>' +
      W.head('sensei-head', 'In Sensei', 'Measured over real history.', 'You see the trend, not just today.', 'left:110px;top:320px;width:700px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.sensei-cam'), head: q('.sensei-head'), git: q('.sensei-git'), commits: all('.sensei-c'), samples: all('.sensei-s'), trend: q('.sensei-trend'),
      lg: q('.sensei-lg'), src: all('.sensei-src span') });
    W.portrait(kit, { hoist: ['.sensei-head'], frame: [640, 960], crop: [900, 180, 920, 700], css: '.sensei-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 8.5, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    W.draw(this.git, t, 0.5, 2.2, this.K);
    this.commits.forEach((c, i) => { c.style.opacity = eo(seg(t, 0.6 + i * 0.065, 0.9 + i * 0.065)); });
    W.fade(this.lg, t, 1.6, this.K);
    this.samples.forEach((g, k) => { g.style.opacity = eo(seg(t, 2.6 + k * 0.42, 2.9 + k * 0.42)); });
    W.draw(this.trend, t, 2.7, 5.6, this.K);
    this.src.forEach((s, i) => W.fade(s, t, 5.6 + i * 0.35, this.K));
  },
});
