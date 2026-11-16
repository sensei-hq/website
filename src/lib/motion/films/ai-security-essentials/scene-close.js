// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01, TextFx } = kit;
kit.scene('close', {
  init(kit) {
    kit.css('.close-card { left:110px; top:300px; padding:48px 56px 54px; display:flex; flex-direction:column; gap:24px; max-width:1100px }' +
      '.close-title { margin:0; font-family:var(--display, serif); font-weight:400; font-size:136px; line-height:1.02; letter-spacing:-0.02em }' +
      '.close-bar { width:300px; height:3px; border-radius:2px; background:var(--accent); transform-origin:0 50% } .close-card .sub { font-size:42px }');
    const H = W.hub, c = [1520, 560];
    let tiles = '', wires = '';
    H.at.forEach((p, i) => {
      const q = [c[0] + (p[0] - H.c[0]) * 0.75, c[1] + (p[1] - H.c[1]) * 0.75];
      wires += W.wire('close-wire', q, [(q[0] + c[0]) / 2, (q[1] + c[1]) / 2], c);
      tiles += '<g class="close-t" transform="translate(' + q[0] + ' ' + q[1] + ') scale(0.75)">' + W.node('close-node', H.kinds[i], 'ink') + '</g>';
    });
    kit.stage.append(kit.h('<div class="ground"><div class="cam close-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('close-bg') + wires + tiles +
      '<g transform="translate(' + c[0] + ' ' + c[1] + ')">' + W.node('close-sys', 'db', 'ok', 150) + '</g><g class="close-sh">' + W.shield('close-shield') + '</g></svg></div>' +
      '<div class="card close-card"><h1 class="close-title">AI Security Essentials</h1><div class="close-bar"></div><p class="sub close-sub">Secure by design. Responsible by default.</p></div></div>'));
    const q = (s) => kit.stage.querySelector(s);
    Object.assign(this, { K: kit, cam: q('.close-cam'), card: q('.close-card'), title: q('.close-title'), bar: q('.close-bar'), sub: q('.close-sub'), sh: q('.close-sh') });
    W.portrait(kit, {"hoist": [".close-card"], "frame": [800, 1060], "crop": [1180, 230, 680, 660], "css": ".close-card{left:60px!important;top:140px!important;max-width:none!important;width:848px} .close-title{font-size:116px!important}"});
  },
  render(t) {
    W.push(this.cam, t, 6.5, 1.0, 1.025, this.K);
    const e = eo(seg(t, -0.2, 0.4));
    this.card.style.opacity = e; this.card.style.transform = 'translateY(' + lerp(24, 0, e) + 'px)';
    TextFx.fadeFromRight(this.title, t, 0.0);
    this.bar.style.transform = 'scaleX(' + eo(seg(t, 0.5, 1.0)).toFixed(3) + ')';
    // The sub lands on "secure by design".
    this.sub.style.opacity = eo(seg(t, 2.4, 3.0));
    this.sub.style.transform = 'translateX(' + lerp(26, 0, eo(seg(t, 2.4, 3.0))) + 'px)';
    const s = eob(seg(t, 0.4, 0.9), 1.7);
    this.sh.style.opacity = clamp01(s * 2);
    this.sh.setAttribute('transform', 'translate(1520 ' + (480 - 4 * Math.sin(t * 1.6)).toFixed(1) + ') scale(' + lerp(0.3, 0.75, s).toFixed(3) + ')');
  },
});
