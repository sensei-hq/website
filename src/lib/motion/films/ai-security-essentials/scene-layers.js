// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, ei, eio, eob, lerp, clamp01 } = kit;
kit.scene('layers', {
  init(kit) {
    kit.css('.layers-slab { position:absolute; left:860px; width:950px; box-sizing:border-box; min-height:108px; padding:18px 28px 18px 30px; display:flex; flex-direction:column; justify-content:center; gap:4px; background:var(--tile); border:2px solid var(--hair); border-left:14px solid var(--main); border-radius:14px }' +
      '.layers-slab h3 { margin:0; font-size:34px; line-height:1.15; font-weight:600 } .layers-slab p { margin:0; font-size:26px; line-height:1.3; color:var(--main) }');
    const L = [['Govern', 'Policy, owners, model inventory'], ['Protect the data', 'Classify, minimise, prevent leaks'], ['Guard inputs and outputs', 'Filter what goes in, check what comes out'], ['Limit what agents can do', 'Scopes, approvals, spending caps'], ['Monitor and red-team', 'Logs, alerts, regular attack testing']];
    this.tops = [800, 674, 548, 422, 296];
    const slabs = L.map((l, i) => '<div class="layers-slab" style="top:' + this.tops[i] + 'px;border-left-color:color-mix(in srgb, var(--main) ' + (100 - i * 15) + '%, var(--jade))"><h3>' + l[0] + '</h3><p>' + l[1] + '</p></div>').join('');
    const stops = L.map(() => '<g class="layers-stop">' + W.tick('layers-tick') + '</g>').join('');
    kit.stage.append(kit.h('<div class="ground"><div class="cam layers-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('layers-bg') + '</svg>' + slabs +
      '<svg class="art" viewBox="0 0 1920 1080">' + stops + '</svg></div>' +
      W.head('layers-head', 'Bringing it together', 'Defence in depth.', 'No single control is enough. Layer them.', 'left:110px;top:330px;width:640px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.layers-cam'), head: q('.layers-head'), slabs: all('.layers-slab'), stops: all('.layers-stop') });
    // Once the stack is built, each layer is checked in turn, from the foundation (Govern) up to Monitor.
    // Timed to the voiceover: each slab lands as the take names that layer, the tick just after.
    this.checks = this.tops.map((_, i) => 4.6 + i * 1.3);
    W.portrait(kit, {"hoist": [".layers-head"], "frame": [560, 1100], "crop": [820, 270, 1050, 660], "css": ".layers-head{left:70px!important;right:auto!important;top:140px!important;bottom:auto!important;width:940px!important;max-width:none!important;} .layers-head .line{font-size:110px!important}"});
  },
  render(t) {
    W.push(this.cam, t, 12, 1, 1.03, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.slabs.forEach((s, i) => {
      const p = seg(t, 3.4 + i * 1.3, 4.0 + i * 1.3);
      s.style.opacity = eo(p);
      s.style.transform = 'translateY(' + lerp(-60, 0, eob(p, 1.4)).toFixed(1) + 'px)';
    });
    this.checks.forEach((at, li) => {
      const y = this.tops[li] + 54;
      const st = seg(t, at, at + 0.35), g = this.stops[li];
      g.style.opacity = eo(st);
      g.setAttribute('transform', 'translate(1810 ' + y + ') scale(' + lerp(0.3, 1, eob(st, 1.8)).toFixed(3) + ')');
      this.slabs[li].style.borderColor = st > 0 && t < at + 0.8 ? 'var(--jade)' : 'var(--hair)';
      this.slabs[li].style.borderLeftColor = 'color-mix(in srgb, var(--main) ' + (100 - li * 15) + '%, var(--jade))';
    });
  },
});
