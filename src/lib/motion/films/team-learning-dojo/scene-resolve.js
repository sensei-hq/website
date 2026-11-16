// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('resolve', {
  init(kit) {
    kit.css('.resolve-l { position:absolute; left:880px; height:96px; box-sizing:border-box; display:flex; align-items:center; gap:18px; padding:0 26px; border-radius:16px; background:var(--tile); border:2px solid var(--hair); box-shadow:0 8px 18px rgba(0,0,0,.05) }' +
      '.resolve-l b { flex:none; width:170px; font-size:26px; font-weight:600 } .resolve-l span { font-size:22px; color:var(--mute) }' +
      '.resolve-pv { left:1440px; top:200px; width:380px; height:600px; box-sizing:border-box; padding:22px 24px; border-color:var(--main); border-width:3px; box-shadow:0 16px 34px rgba(0,0,0,.09) }' +
      '.resolve-pv h4 { margin:0; font-size:20px; font-weight:600; letter-spacing:0.1em; color:var(--mute) } .resolve-pv h5 { margin:4px 0 12px; font-family:var(--mono); font-size:22px; font-weight:400 }' +
      '.resolve-r { padding:9px 0; border-top:2px solid var(--hair); font-size:20px; line-height:1.3 } .resolve-r em { display:block; font-style:normal; font-size:16px; letter-spacing:0.06em; color:var(--mute); text-transform:uppercase }');
    // The levels a rule can live on, broadest at the top; a repository draws its rules from all of them.
    const L = [['Dōjō', 'Your team’s shared rules'], ['Workspace', 'A group of repositories'], ['Repository', 'This codebase, and its stack']];
    const R = [['No secrets in source', 'dōjō · mandatory'], ['Never merge on red', 'dōjō · required'], ['Reuse the rate limiter', 'workspace · recommended'], ['No unwrap on the request path', 'repository · Rust pack'], ['Your own rules', 'you · personal']];
    kit.stage.append(kit.h('<div class="ground"><div class="cam resolve-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('resolve-bg') +
      [0, 1, 2].map((i) => '<path class="resolve-w" pathLength="1" d="M' + (1380 - i * 40) + ' ' + (308 + i * 160) + ' Q1400 ' + (308 + i * 160) + ' 1436 ' + (420 + i * 80) + '" style="fill:none;stroke:var(--wire);stroke-width:5"/>').join('') + '</svg>' +
      L.map(([b, s], i) => '<div class="resolve-l" style="top:' + (260 + i * 160) + 'px;width:' + (500 - i * 40) + 'px"><b>' + b + '</b><span>' + s + '</span></div>').join('') +
      '<div class="card resolve-pv"><h4>RULES FOR</h4><h5>acme/limits-service</h5>' + R.map(([s, e]) => '<div class="resolve-r">' + s + '<em>' + e + '</em></div>').join('') + '</div></div>' +
      W.head('resolve-head', 'Wherever you code', 'The right rules, in every repository.', 'Sign in once. See which rules govern a project, and why, before the first commit.', 'left:110px;top:300px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.resolve-cam'), head: q('.resolve-head'), L: all('.resolve-l'), w: all('.resolve-w'), pv: q('.resolve-pv'), rs: all('.resolve-r') });
    W.portrait(kit, { hoist: ['.resolve-head'], frame: [620, 1060], crop: [870, 180, 960, 640], css: '.resolve-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 12, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.L.forEach((l, i) => W.fade(l, t, 1.0 + i * 0.6, this.K));
    W.fade(this.pv, t, 3.4, this.K);
    this.w.forEach((w, i) => W.draw(w, t, 4.0 + i * 0.3, 4.8 + i * 0.3, this.K));
    this.rs.forEach((r, i) => W.fade(r, t, 4.8 + i * 0.5, this.K, 0.4, 8));
  },
});
