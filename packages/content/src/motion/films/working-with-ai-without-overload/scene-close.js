// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01, TextFx } = kit;
kit.scene('close', {
  init(kit) {
    kit.css('.close-card { left:110px; top:290px; padding:48px 56px 54px; display:flex; flex-direction:column; gap:24px; max-width:1000px }' +
      '.close-title { margin:0; font-family:var(--display, serif); font-weight:400; font-size:120px; line-height:1.04; letter-spacing:-0.02em }' +
      '.close-bar { width:300px; height:3px; border-radius:2px; background:var(--accent); transform-origin:0 50% } .close-card .sub { font-size:42px }');
    const C = [1540, 540], r = 200;
    let st = '';
    for (let i = 0; i < 6; i++) { const a = (-90 + 60 * i) * Math.PI / 180; st += '<g class="close-st" transform="translate(' + (C[0] + r * Math.cos(a)).toFixed(1) + ' ' + (C[1] + r * Math.sin(a)).toFixed(1) + ')">' + W.node('close-n', W.cyc.st[i][0], 'ok', 84) + '</g>'; }
    kit.stage.append(kit.h('<div class="ground"><div class="cam close-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('close-bg') +
      '<g class="close-ring"><circle cx="' + C[0] + '" cy="' + C[1] + '" r="' + r + '" style="fill:none;stroke:var(--jade);stroke-width:6"/>' + st + '</g></svg></div>' +
      '<div class="card close-card"><h1 class="close-title">Working with AI, without the overload</h1><div class="close-bar"></div><p class="sub close-sub">Define it. Verify it. Then trust the results.</p></div></div>'));
    const q = (s) => kit.stage.querySelector(s);
    Object.assign(this, { K: kit, cam: q('.close-cam'), card: q('.close-card'), title: q('.close-title'), bar: q('.close-bar'), sub: q('.close-sub'), ring: q('.close-ring'), C });
    W.portrait(kit, {"hoist": [".close-card"], "frame": [800, 1060], "crop": [1250, 250, 580, 580], "css": ".close-card{left:60px!important;top:140px!important;max-width:none!important;width:848px} .close-title{font-size:100px!important}"});
  },
  render(t) {
    W.push(this.cam, t, 6, 1, 1.025, this.K);
    const e = eo(seg(t, -0.2, 0.4));
    this.card.style.opacity = e; this.card.style.transform = 'translateY(' + lerp(24, 0, e) + 'px)';
    TextFx.fadeFromRight(this.title, t, 0.0);
    this.bar.style.transform = 'scaleX(' + eo(seg(t, 0.6, 1.1)).toFixed(3) + ')';
    this.sub.style.opacity = eo(seg(t, 0.9, 1.4));
    this.sub.style.transform = 'translateX(' + lerp(26, 0, eo(seg(t, 0.9, 1.4))) + 'px)';
    // The cycle keeps turning slowly behind the card.
    const C = this.C;
    this.ring.style.opacity = eo(seg(t, 0.2, 0.9));
    this.ring.setAttribute('transform', 'rotate(' + (t * 6).toFixed(2) + ' ' + C[0] + ' ' + C[1] + ')');
  },
});
