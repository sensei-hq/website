// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('hook', {
  init(kit) {
    kit.css('.hook-code { left:900px; top:190px; width:880px; height:600px; box-shadow:0 14px 30px rgba(0,0,0,.07) }' +
      '.hook-tag { position:absolute; transform:translate(-50%,-50%); padding:12px 26px; border-radius:999px; background:var(--tile); border:2px solid var(--hair); font-family:var(--display); font-size:44px; font-style:normal; color:var(--second); box-shadow:0 10px 22px rgba(0,0,0,.08) }' +
      '.hook-tag b { position:absolute; left:14px; right:14px; top:50%; height:5px; margin-top:-2px; border-radius:3px; background:var(--accent); transform-origin:0 50% }');
    // A plain block of code; the usual answers float over it and are struck out one by one.
    const rows = [[0, 300, 'ink'], [40, 420], [40, 360], [80, 280, 'ok'], [80, 460], [40, 220], [0, 120, 'ink'], [0, 0], [0, 340, 'ink'], [40, 500], [40, 300], [0, 120, 'ink']];
    const tags = [['Elegant?', 1130, 320], ['Clever?', 1560, 480], ['Short?', 1210, 660]];
    kit.stage.append(kit.h('<div class="ground"><div class="cam hook-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('hook-bg') + '</svg>' +
      '<div class="card hook-code"></div><svg class="art" viewBox="0 0 1920 1080">' + W.bars('hook-row', 960, 250, rows.filter((r) => r[1]), 42, 14) + '</svg>' +
      tags.map(([s, x, y]) => '<span class="hook-tag" style="left:' + x + 'px;top:' + y + 'px">' + s + '<b></b></span>').join('') + '</div>' +
      W.head('hook-head', 'Code quality', 'What is code quality, really?', '“Good code” sounds subjective.', 'left:110px;top:300px;width:700px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.hook-cam'), head: q('.hook-head'), code: q('.hook-code'), rows: all('.hook-row'), tags: all('.hook-tag'), strikes: all('.hook-tag b') });
    W.portrait(kit, { hoist: ['.hook-head'], frame: [640, 1000], crop: [880, 170, 920, 640], css: '.hook-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 6, 1, 1.03, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.code.style.opacity = eo(seg(t, 0.2, 0.7));
    this.rows.forEach((r, i) => { r.style.opacity = eo(seg(t, 0.4 + i * 0.06, 0.8 + i * 0.06)); });
    this.tags.forEach((g, i) => W.pop(g, t, 1.2 + i * 0.5, this.K, 'translate(-50%,-50%)'));
    // Struck through on "sounds subjective".
    this.strikes.forEach((b, i) => { b.style.transform = 'scaleX(' + eio(seg(t, 3.0 + i * 0.35, 3.4 + i * 0.35)).toFixed(3) + ')'; });
    this.tags.forEach((g, i) => { if (t > 3.4 + i * 0.35) g.style.opacity = lerp(1, 0.55, eo(seg(t, 3.4 + i * 0.35, 4.0 + i * 0.35))).toFixed(3); });
  },
});
