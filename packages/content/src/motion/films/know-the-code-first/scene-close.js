// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01, TextFx } = kit;
kit.scene('close', {
  init(kit) {
    kit.css('.close-card { position:absolute; left:110px; top:330px; display:flex; flex-direction:column; gap:26px; max-width:1060px }' +
      '.close-title { margin:0; font-family:var(--display, serif); font-weight:400; font-size:108px; line-height:1.04; letter-spacing:-0.02em }' +
      '.close-bar { width:300px; height:3px; border-radius:2px; background:var(--accent); transform-origin:0 50% } .close-card .sub { font-size:42px }');
    kit.stage.append(kit.h('<div class="ground"><div class="cam close-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('close-bg') +
      '<g class="close-mark">' + W.logo('close-logo', 1530, 540, 400) + '</g></svg></div>' +
      '<div class="close-card"><h1 class="close-title">Know the code before you change it.</h1><div class="close-bar"></div><p class="sub close-sub">Sensei maps it, checks it, and hands it over.</p></div></div>'));
    const q = (s) => kit.stage.querySelector(s);
    Object.assign(this, { K: kit, cam: q('.close-cam'), card: q('.close-card'), title: q('.close-title'), bar: q('.close-bar'), sub: q('.close-sub'), mark: q('.close-mark') });
    W.portrait(kit, { hoist: ['.close-card'], frame: [700, 920], crop: [1250, 260, 560, 560], css: '.close-card{left:70px!important;top:180px!important;max-width:none!important;width:940px} .close-title{font-size:110px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 5, 1.0, 1.025, this.K);
    const e = eo(seg(t, -0.2, 0.4));
    this.card.style.opacity = e; this.card.style.transform = 'translateY(' + lerp(24, 0, e) + 'px)';
    TextFx.fadeFromRight(this.title, t, 0.0);
    this.bar.style.transform = 'scaleX(' + eo(seg(t, 0.6, 1.1)).toFixed(3) + ')';
    const p = eo(seg(t, 0.8, 1.3)); this.sub.style.opacity = p; this.sub.style.transform = 'translateX(' + lerp(26, 0, p) + 'px)';
    // The mark settles in, then breathes.
    const s = eob(seg(t, 0.3, 1.0), 1.4);
    this.mark.style.opacity = clamp01(s * 1.5);
    this.mark.style.transformOrigin = '1530px 540px';
    this.mark.style.transform = 'scale(' + (lerp(0.7, 1, s) * (1 + 0.012 * Math.sin(t * 1.6))).toFixed(4) + ') rotate(' + lerp(-14, 0, eo(seg(t, 0.3, 1.4))).toFixed(2) + 'deg)';
  },
});
