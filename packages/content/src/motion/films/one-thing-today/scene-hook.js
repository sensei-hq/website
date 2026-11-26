// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('hook', {
  init(kit) {
    kit.css('.hook-tile { position:absolute; width:290px; height:180px; box-sizing:border-box; border-radius:16px; background:var(--tile); border:2px solid var(--hair); box-shadow:0 8px 18px rgba(0,0,0,.05) }' +
      '.hook-one { position:absolute; left:1110px; top:390px; width:480px; box-sizing:border-box; padding:24px 28px; border-radius:20px; background:var(--tile); border:3px solid var(--accent); box-shadow:0 18px 40px rgba(0,0,0,.12) }' +
      '.hook-one h4 { margin:0 0 8px; font-size:22px; font-weight:600; letter-spacing:0.1em; color:var(--accent) } .hook-one p { margin:0; font-family:var(--display); font-size:34px; line-height:1.2 }');
    // Nine charts, the dashboard you'd have to read. They fall back, and one decision stays.
    const R = kit.rng(7);
    let tiles = '', art = '';
    for (let i = 0; i < 9; i++) {
      const x = 880 + (i % 3) * 315, y = 160 + Math.floor(i / 3) * 205;
      tiles += '<div class="hook-tile" style="left:' + x + 'px;top:' + y + 'px"></div>';
      let d = 'M' + (x + 24) + ' ' + (y + 130);
      for (let k = 1; k <= 8; k++) d += ' L' + (x + 24 + k * 30) + ' ' + (y + 60 + R() * 90).toFixed(0);
      art += i % 2 ? '<path class="hook-ch" d="' + d + '" style="fill:none;stroke:' + (i % 4 === 1 ? 'var(--accent)' : 'var(--main)') + ';stroke-width:4"/>'
        : [0, 1, 2, 3, 4, 5].map((k) => { const h = 20 + R() * 90; return '<rect class="hook-ch" x="' + (x + 30 + k * 40) + '" y="' + (y + 150 - h).toFixed(0) + '" width="26" height="' + h.toFixed(0) + '" rx="5" style="fill:var(--main)"/>'; }).join('');
    }
    kit.stage.append(kit.h('<div class="ground"><div class="cam hook-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('hook-bg') + '</svg><div class="hook-wall">' + tiles +
      '<svg class="art" viewBox="0 0 1920 1080">' + art + '</svg></div>' +
      '<div class="hook-one"><h4>NEEDS YOU</h4><p>Auth keeps being edited before it’s read.</p></div></div>' +
      W.head('hook-head', 'Every day', 'Not another dashboard.', 'Your day needs one decision, not more charts.', 'left:110px;top:320px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.hook-cam'), head: q('.hook-head'), wall: q('.hook-wall'), tiles: all('.hook-tile'), one: q('.hook-one') });
    W.portrait(kit, { hoist: ['.hook-head'], frame: [640, 1000], crop: [870, 150, 960, 610], css: '.hook-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 9, 1, 1.03, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.tiles.forEach((d, i) => { d.style.opacity = eo(seg(t, 0.5 + i * 0.12, 0.9 + i * 0.12)); });
    const back = eio(seg(t, 4.2, 5.4));
    this.wall.style.opacity = (eo(seg(t, 0.5, 1.0)) * lerp(1, 0.22, back)).toFixed(3);
    this.wall.style.filter = 'blur(' + (3 * back).toFixed(2) + 'px)';
    W.pop(this.one, t, 5.2, this.K);
  },
});
