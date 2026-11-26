// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('questions', {
  init(kit) {
    kit.css('.questions-list { position:absolute; left:110px; top:330px; width:1060px; display:flex; flex-direction:column; gap:22px }' +
      '.questions-q { display:grid; grid-template-columns:70px 1fr; align-items:center; gap:22px; padding:24px 30px; background:var(--tile); border:2px solid var(--hair); border-radius:18px }' +
      '.questions-q b { font-family:var(--display, serif); font-weight:400; font-size:64px; line-height:1; color:var(--accent); text-align:center } .questions-q p { margin:0; font-size:38px; line-height:1.3 }');
    const C = [1520, 600]; this.C = C;
    const rings = [250, 175, 100].map((r, i) => '<circle class="questions-ring" cx="' + C[0] + '" cy="' + C[1] + '" r="' + r + '" style="fill:' + (i === 2 ? 'color-mix(in srgb, var(--accent) 12%, var(--tile))' : 'none') + ';stroke:' + (i === 2 ? 'var(--accent)' : 'var(--wire)') + ';stroke-width:' + (i === 2 ? 5 : 4) + '"/>').join('');
    const slips = [0, 1, 2, 3, 4].map(k => '<g class="questions-s">' + W.slip('questions-slip', k % 2 ? 'code' : 'text', k + 3) + '</g>').join('');
    kit.stage.append(kit.h('<div class="ground"><div class="cam questions-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('questions-bg') + rings + slips + '</svg>' +
      '<div class="tag hot questions-tag" style="left:' + C[0] + 'px;top:' + (C[1] - 24) + 'px">Intent</div></div>' +
      W.head('questions-head', 'Ask yourself', 'How are you managing it?', '', 'left:110px;top:90px;width:1100px') +
      '<div class="questions-list">' +
        '<div class="questions-q"><b>1</b><p>How do you skim it without getting overwhelmed?</p></div>' +
        '<div class="questions-q"><b>2</b><p>Do you focus on the intent and the expected outcome?</p></div>' +
        '<div class="questions-q"><b>3</b><p>How do you know it is relevant, accurate and aligned with what you need?</p></div></div></div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.questions-cam'), head: q('.questions-head'), qs: all('.questions-q'), rings: all('.questions-ring'), ss: all('.questions-s'), tag: q('.questions-tag') });
    W.portrait(kit, {"hoist": [".questions-head", ".questions-list"], "frame": [960, 880], "crop": [1240, 330, 560, 540], "css": ".questions-head{left:70px!important;right:auto!important;top:140px!important;bottom:auto!important;width:940px!important;max-width:none!important;}.questions-list{left:70px!important;right:auto!important;top:420px!important;bottom:auto!important;width:940px!important;max-width:none!important}"});
  },
  render(t) {
    const C = this.C;
    W.push(this.cam, t, 11, 1, 1.03, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    // Each question card lands as the take asks it.
    this.qs.forEach((g, i) => { const p = seg(t, 2.2 + i * 2.6, 2.8 + i * 2.6); g.style.opacity = eo(p); g.style.transform = 'translateX(' + lerp(40, 0, eo(p)) + 'px)'; });
    this.rings.forEach((r, i) => { const p = eob(seg(t, 0.2 + i * 0.25, 0.8 + i * 0.25), 1.5); r.style.opacity = clamp01(p); r.style.transformOrigin = C[0] + 'px ' + C[1] + 'px'; r.style.transform = 'scale(' + lerp(0.6, 1, p).toFixed(3) + ')'; });
    this.tag.style.opacity = eo(seg(t, 1.0, 1.4));
    // Output drifts round the target; only some of it lands near the middle.
    this.ss.forEach((g, k) => {
      const a = t * 0.28 + k * 1.26, rad = 215 - 40 * Math.sin(t * 0.4 + k);
      const x = C[0] + Math.cos(a) * rad, y = C[1] + Math.sin(a) * rad * 0.85;
      g.style.opacity = eo(seg(t, 0.3 + k * 0.2, 0.8 + k * 0.2));
      g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + (8 * Math.sin(a)).toFixed(1) + ') scale(0.75)');
    });
  },
});
