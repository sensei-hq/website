// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('hook', {
  init(kit) {
    kit.css('.hook-n { position:absolute; width:150px; height:190px; box-sizing:border-box; border-radius:20px; background:var(--tile); border:2px solid var(--hair); box-shadow:0 12px 26px rgba(0,0,0,.07);' +
      ' display:flex; align-items:center; justify-content:center; font-family:var(--display); font-size:110px; color:var(--second) }' +
      '.hook-n::after { content:""; position:absolute; left:40px; right:40px; top:-2px; height:9px; border-radius:5px; background:var(--accent) }');
    // Five numbered tiles in a gentle arc: the five patterns.
    const xs = [940, 1112, 1284, 1456, 1628], ys = [400, 350, 330, 350, 400];
    kit.stage.append(kit.h('<div class="ground"><div class="cam hook-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('hook-bg') +
      '<path class="hook-link" pathLength="1" d="M1015 690 Q1360 760 1703 690" style="fill:none;stroke:var(--wire);stroke-width:5;stroke-dasharray:4 14;stroke-linecap:round"/></svg>' +
      xs.map((x, i) => '<div class="hook-n" style="left:' + x + 'px;top:' + ys[i] + 'px">' + (i + 1) + '</div>').join('') + '</div>' +
      W.head('hook-head', 'AI-assisted coding', 'Five ways it goes wrong.', 'Not random. Predictable.', 'left:110px;top:320px;width:700px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.hook-cam'), head: q('.hook-head'), tiles: all('.hook-n'), link: q('.hook-link') });
    W.portrait(kit, { hoist: ['.hook-head'], frame: [640, 900], crop: [880, 280, 960, 520], css: '.hook-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 6, 1, 1.03, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.tiles.forEach((n, i) => {
      const p = seg(t, 1.0 + i * 0.3, 1.5 + i * 0.3);
      n.style.opacity = eo(p);
      n.style.transform = 'translateY(' + lerp(-60, 0, eob(p, 1.6)).toFixed(1) + 'px) rotate(' + lerp(-8 + i * 4, 0, eo(p)).toFixed(2) + 'deg)';
    });
    // On "predictable" the tiles line up: one pattern.
    W.draw(this.link, t, 3.2, 4.2, this.K);
  },
});
