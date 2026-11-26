// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, ei, eio, eob, lerp, clamp01, TextFx } = kit;
kit.scene('handover', {
  init(kit) {
    kit.css('.handover-end { left:90px; top:300px; padding:44px 56px 50px; display:flex; flex-direction:column; gap:22px; max-width:1360px }' +
      '.handover-title { font-family:var(--display, var(--sans, system-ui, sans-serif)); font-size:168px; line-height:1; font-weight:400; letter-spacing:-0.02em; margin:0 }' +
      '.handover-kanji { margin:0; display:flex; align-items:center; gap:28px; font-family:var(--serif, serif); font-size:96px; line-height:1; font-weight:400; color:var(--accent) }' +
      '.handover-logo { flex:none; width:120px; height:120px }' +
      '.handover-bar { width:320px; height:3px; border-radius:2px; background:var(--main); transform-origin:0 50% }' +
      '.handover-end .sub { margin:0; font-size:44px }');
    const a = W.relay.ctl, C = W.relay.con;
    kit.stage.append(kit.h('<div class="ground"><div class="cam handover-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('handover-bg') + W.relay.wires('handover-wire') +
      W.relayNodes('handover') +
      '<g class="handover-newctl" transform="translate(' + C[1][0] + ' ' + C[1][1] + ')">' + W.node('handover-nc', 'brace', 'ctl') + '</g>' +
      '<g class="handover-oldcon" transform="translate(' + a[0] + ' ' + a[1] + ')">' + W.node('handover-oc', 'spark', 'con') + '</g>' +
      '<g class="handover-baton"><circle r="34" style="fill:var(--accent)"/><g transform="scale(0.62)">' + W.glyph('crown', 'var(--ground)') + '</g></g></svg>' +
      '<div class="tag handover-t1" style="left:1630px;top:632px">Unregistered</div>' +
      '<div class="tag con handover-t2" style="left:1630px;top:632px">Registered again</div>' +
      '<div class="tag ctl handover-t3" style="left:1530px;top:412px">New controller</div></div>' +
      '<div class="handover-dim" style="position:absolute;inset:0;background:color-mix(in srgb, var(--board) 70%, transparent)"></div>' +
      '<div class="calm handover-end"><p class="handover-kanji"><svg class="handover-logo" viewBox="0 0 512 512">' + W.logoArt + '</svg>先生</p><h1 class="handover-title">Sensei Relay</h1><div class="handover-bar"></div><p class="sub handover-sub">Many assistants. One goal. Delivered reliably.</p></div></div>'));
    const q = (s) => kit.stage.querySelector(s);
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { cam: q('.handover-cam'), cons: all('.handover-con'), wires: all('.handover-wire'), rings: all('.handover-ring'), ctl: q('.handover-ctl'), newctl: q('.handover-newctl'), oldcon: q('.handover-oldcon'), baton: q('.handover-baton'),
      t1: q('.handover-t1'), t2: q('.handover-t2'), t3: q('.handover-t3'), dim: q('.handover-dim'), end: q('.handover-end'), title: q('.handover-title'), bar: q('.handover-bar'), sub: q('.handover-sub') });
    W.portrait(kit, {"hoist": [".handover-dim", ".handover-end"], "frame": [120, 1680], "crop": [460, 90, 1300, 920], "css": ".handover-end{left:60px!important;top:620px!important;max-width:none!important;width:848px} .handover-title{font-size:120px!important}"});
  },
  render(t) {
    const a = W.relay.ctl, C = W.relay.con;
    this.cam.style.transform = 'scale(' + lerp(1.03, 1.0, eio(seg(t, 0, 9))) + ')';
    this.rings.forEach(r => { r.style.opacity = 0; });
    // One contributor leaves the relay and comes back; the work carries on around it.
    // Timed to the voiceover: out and back on "leave and rejoin", the handover on "hand over control",
    // the end card on "Sensei Relay".
    const out = eio(seg(t, 0.4, 1.2)), back = eio(seg(t, 1.5, 2.3));
    const k = 2, b = C[k], gone = out * (1 - back);
    this.cons[k].setAttribute('transform', 'translate(' + (b[0] + 260 * gone).toFixed(1) + ' ' + b[1] + ') rotate(' + (8 * gone).toFixed(2) + ')');
    this.cons[k].style.opacity = 1 - 0.75 * gone;
    this.wires[k].style.strokeDasharray = '1'; this.wires[k].style.strokeDashoffset = gone.toFixed(3);
    const s1 = seg(t, 0.6, 0.8) * (1 - seg(t, 1.4, 1.6)), s2 = seg(t, 1.9, 2.1) * (1 - seg(t, 2.9, 3.1));
    this.t1.style.opacity = eo(s1); this.t1.style.transform = 'translate(-50%, 0)';
    this.t2.style.opacity = eo(s2); this.t2.style.transform = 'translate(-50%, 0)';
    // The controller hands over: the crown token travels the wire to a contributor, who takes the lead.
    const h = seg(t, 2.2, 3.0), p = W.qpt(a, W.relay.bend(1), C[1], eio(h));
    this.baton.style.opacity = h > 0 && h < 1 ? 1 : 0;
    this.baton.setAttribute('transform', 'translate(' + p[0].toFixed(1) + ' ' + (p[1] - 30 * Math.sin(h * Math.PI)).toFixed(1) + ') rotate(' + (h * 360).toFixed(1) + ')');
    const took = seg(t, 2.95, 3.2);
    this.newctl.style.opacity = eo(took);
    this.newctl.setAttribute('transform', 'translate(' + C[1][0] + ' ' + C[1][1] + ') scale(' + lerp(0.9, 1, eob(took, 1.8)).toFixed(3) + ')');
    this.oldcon.style.opacity = eo(seg(t, 2.3, 2.6));
    this.t3.style.opacity = eo(seg(t, 3.0, 3.25)); this.t3.style.transform = 'translate(-50%, ' + lerp(12, 0, eo(seg(t, 3.0, 3.25))) + 'px)';
    // The end card lands and holds; the board keeps living behind it.
    const e = seg(t, 3.6, 4.2);
    this.dim.style.opacity = eo(e);
    this.end.style.opacity = eo(e);
    this.end.style.transform = 'translateY(' + lerp(24, 0, eo(e)) + 'px)';
    TextFx.fadeFromRight(this.title, t, 3.65);
    this.bar.style.transform = 'scaleX(' + eo(seg(t, 4.2, 4.7)).toFixed(3) + ')';
    this.sub.style.opacity = eo(seg(t, 4.5, 5.0));
    this.sub.style.transform = 'translateX(' + lerp(28, 0, eo(seg(t, 4.5, 5.0))) + 'px)';
    this.cons.forEach((c, i) => { if (i !== k) { const q = C[i]; c.setAttribute('transform', 'translate(' + q[0] + ' ' + (q[1] + 4 * Math.sin(t * 1.8 + i)).toFixed(1) + ')'); } });
  },
});
