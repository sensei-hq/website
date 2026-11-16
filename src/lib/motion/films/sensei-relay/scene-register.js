// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01, TextFx } = kit;
// The relay layout every later scene uses: the controller on the left, contributors on an arc to the right.
W.relay = {
  ctl: [560, 430],
  con: [[1240, 170], [1530, 320], [1630, 540], [1530, 760], [1240, 910]],
  bend(i) { const a = W.relay.ctl, b = W.relay.con[i]; return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + (b[1] < 540 ? -60 : 60)]; },
  wires(cls) {
    return W.relay.con.map((b, i) => { const a = W.relay.ctl, c = W.relay.bend(i); return '<path class="' + cls + '" pathLength="1" d="M' + a[0] + ' ' + a[1] + ' Q' + c[0] + ' ' + c[1] + ' ' + b[0] + ' ' + b[1] + '" style="fill:none;stroke:var(--wire);stroke-width:7;stroke-linecap:round"/>'; }).join('');
  },
};
kit.scene('register', {
  init(kit) {
    let art = '';
    W.crew.forEach((c, i) => {
      art += '<g class="register-cell"><g class="register-wall">' + W.silo('register-silo') + '</g>' + W.node('register-node', c.kind, i === 0 ? 'idle' : 'con') +
        (i === 0 ? '<g class="register-crowned">' + W.node('register-ctl', 'spark', 'ctl') + '</g>' : '') + '</g>';
    });
    let tags = '<div class="tag ctl register-tag" style="left:560px;top:530px">Controller</div>';
    W.relay.con.forEach((p, i) => { tags += '<div class="tag con register-tag" style="left:' + p[0] + 'px;top:' + (p[1] + 92) + 'px">Contributor</div>'; });
    kit.stage.append(kit.h('<div class="ground"><div class="cam register-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('register-bg') +
      '<g class="register-wires">' + W.relay.wires('register-wire') + '</g>' + art + '</svg>' + tags + '</div>' +
      '<div class="words register-words" style="left:110px;bottom:90px;width:820px"><h2 class="line register-line">Sensei Relay connects them.</h2><p class="sub register-sub">One assistant registers as controller. The rest join as contributors.</p></div></div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.cam = q('.register-cam');
    this.cells = [...kit.stage.querySelectorAll('.register-cell')].map((g) => ({ g, wall: g.querySelector('.register-wall'), band: g.querySelector('.register-node-band') }));
    this.crowned = q('.register-crowned');
    this.wires = [...kit.stage.querySelectorAll('.register-wire')];
    this.tags = [...kit.stage.querySelectorAll('.register-tag')];
    this.line = q('.register-line'); this.sub = q('.register-sub');
    this.from = W.crew.map(c => [c.x, c.y]);
    this.to = [W.relay.ctl].concat(W.relay.con);
    W.portrait(kit, {"hoist": [".register-words"], "frame": [470, 1400], "crop": [460, 90, 1300, 920], "css": ".register-words{left:70px!important;right:auto!important;top:140px!important;bottom:auto!important;width:940px!important;max-width:none!important;}"});
  },
  render(t) {
    this.cam.style.transform = 'scale(' + lerp(1.0, 1.025, eio(seg(t, 0, 7.5))) + ')';
    const lift = seg(t, 0.15, 0.75), move = eio(seg(t, 0.7, 1.9));
    this.cells.forEach((o, i) => {
      const d = i * 0.06, m = eio(seg(t, 0.7 + d, 1.9 + d));
      const a = this.from[i], b = this.to[i];
      const x = lerp(a[0], b[0], m), y = lerp(a[1], b[1], m) - Math.sin(m * Math.PI) * 40;
      const land = 1 + 0.06 * Math.sin(seg(t, 1.9 + d, 2.3 + d) * Math.PI);
      o.g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(' + land.toFixed(3) + ')');
      // The silo walls lift away first.
      o.wall.setAttribute('transform', 'scale(' + lerp(1, 1.35, eo(lift)).toFixed(3) + ')');
      o.wall.style.opacity = 1 - lift;
      if (i > 0) o.band.style.fill = t > 5.0 + d ? 'var(--main)' : 'var(--soft)';
    });
    // Timed to the voiceover: the crown lands on "registers as the controller", the wires on "the rest join".
    this.crowned.style.opacity = eo(seg(t, 3.4, 3.8));
    this.crowned.setAttribute('transform', 'scale(' + lerp(0.8, 1, eob(seg(t, 3.4, 3.8), 1.8)).toFixed(3) + ')');
    this.wires.forEach((w, i) => { w.style.strokeDasharray = '1'; w.style.strokeDashoffset = 1 - eo(seg(t, 5.0 + i * 0.25, 5.7 + i * 0.25)); });
    this.tags.forEach((g, i) => { const p = seg(t, 5.0 + i * 0.25, 5.4 + i * 0.25); g.style.opacity = eo(p); g.style.transform = 'translate(-50%, ' + lerp(14, 0, eo(p)) + 'px)'; });
    TextFx.fadeFromRight(this.line, t, 0.2);
    this.sub.style.opacity = eo(seg(t, 2.9, 3.5));
    this.sub.style.transform = 'translateX(' + lerp(28, 0, eo(seg(t, 2.9, 3.5))) + 'px)';
  },
});
