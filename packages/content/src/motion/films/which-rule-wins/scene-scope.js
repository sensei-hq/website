// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('scope', {
  init(kit) {
    kit.css('.scope-s { position:absolute; top:250px; width:172px; height:100px; box-sizing:border-box; display:flex; flex-direction:column; justify-content:center; align-items:center; border-radius:14px; background:var(--tile); border:2px solid var(--hair); text-align:center }' +
      '.scope-s b { font-size:24px; font-weight:600 } .scope-s span { font-size:17px; color:var(--mute) } .scope-s.on { border-color:var(--jade); border-width:3px }' +
      '.scope-lab { position:absolute; top:200px; font-size:20px; font-weight:600; letter-spacing:0.1em; color:var(--mute) } .scope-win { left:1590px; top:452px }');
    // Broad to specific. At equal enforcement, the closer rule wins.
    const S = [['Built-in', 'defaults'], ['You', 'personal'], ['Dōjō', 'your team'], ['Workspace', 'repo group'], ['Repository', 'this codebase']];
    kit.stage.append(kit.h('<div class="ground"><div class="cam scope-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('scope-bg') +
      '<path class="scope-ar" pathLength="1" d="M880 380 H1810" style="fill:none;stroke:var(--wire);stroke-width:5;stroke-linecap:round"/><path d="M1794 366 L1814 380 L1794 394" style="fill:none;stroke:var(--wire);stroke-width:5;stroke-linecap:round"/></svg>' +
      '<span class="scope-lab" style="left:880px">BROADEST</span><span class="scope-lab" style="left:1680px">CLOSEST</span>' +
      S.map(([b, s], i) => '<div class="scope-s" style="left:' + (880 + i * 190) + 'px"><b>' + b + '</b><span>' + s + '</span></div>').join('') +
      W.rule('scope-a', 'No default exports in shared packages.', 'Dōjō · TypeScript pack', 'recommended', 'left:880px;top:450px;width:440px') +
      W.rule('scope-b', 'Route files use default exports: the framework needs them.', 'Repository', 'recommended', 'left:1370px;top:520px;width:440px') +
      '<span class="tag ok scope-win">Wins: same strength, closer</span></div>' +
      W.head('scope-head', 'Rule two', 'Then the closer rule wins.', 'Between rules of the same strength, the most specific scope wins: built-in, you, dōjō, workspace, repository.', 'left:110px;top:280px;width:700px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.scope-cam'), head: q('.scope-head'), s: all('.scope-s'), ar: q('.scope-ar'), labs: all('.scope-lab'), a: q('.scope-a'), b: q('.scope-b'), win: q('.scope-win') });
    W.portrait(kit, { hoist: ['.scope-head'], frame: [640, 1000], crop: [860, 180, 970, 560], css: '.scope-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 12.5, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    W.draw(this.ar, t, 0.8, 2.0, this.K); this.labs.forEach((l, i) => W.fade(l, t, 1.0 + i * 0.6, this.K));
    this.s.forEach((s, i) => W.fade(s, t, 1.0 + i * 0.5, this.K));
    W.fade(this.a, t, 4.6, this.K); W.fade(this.b, t, 5.2, this.K);
    this.s.forEach((s, i) => s.classList.toggle('on', (i === 2 && t > 4.6 && t < 7.2) || (i === 4 && t > 5.2)));
    W.pop(this.win, t, 7.2, this.K, 'translate(-50%,0)');
    this.b.style.borderColor = t > 7.2 ? 'var(--jade)' : 'var(--hair)'; this.b.style.borderWidth = t > 7.2 ? '3px' : '2px';
    this.a.style.opacity = (eo(seg(t, 4.6, 5.1)) * lerp(1, 0.5, eo(seg(t, 7.6, 8.2)))).toFixed(3);
  },
});
