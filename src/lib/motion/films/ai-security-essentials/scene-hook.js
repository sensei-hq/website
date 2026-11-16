// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
// The assistants around the company's systems, shared by later scenes.
W.hub = { c: [1300, 560], at: [[1135, 274], [1465, 274], [1630, 560], [1465, 846], [1135, 846]], kinds: ['spark', 'brace', 'ring', 'tri', 'grid'] };
kit.scene('hook', {
  init(kit) {
    const H = W.hub, c = H.c;
    let wires = '', tiles = '', probes = '';
    H.at.forEach((p, i) => {
      const m = [(p[0] + c[0]) / 2 + (i % 2 ? 30 : -30), (p[1] + c[1]) / 2];
      wires += W.wire('hook-wire', p, m, c);
      tiles += '<g class="hook-t">' + W.node('hook-node', H.kinds[i], 'ink') + '</g>';
      probes += '<circle class="hook-probe" r="11" style="fill:var(--accent)"/>';
    });
    kit.stage.append(kit.h('<div class="ground"><div class="cam hook-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('hook-bg') + wires +
      '<circle class="hook-halo" cx="' + c[0] + '" cy="' + c[1] + '" r="120" style="fill:none;stroke:var(--accent);stroke-width:4"/>' +
      '<g class="hook-core" transform="translate(' + c[0] + ' ' + c[1] + ')">' + W.node('hook-sys', 'db', 'ink', 190) + '</g>' + tiles + probes + '</svg>' +
      '<div class="tag ink hook-tag" style="left:' + c[0] + 'px;top:' + (c[1] + 112) + 'px">Your data and systems</div></div>' +
      W.head('hook-head', 'AI Security Essentials', 'AI is now part of every workflow.', 'Every assistant is also a new way in.', 'left:110px;top:150px;width:820px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.hook-cam'), head: q('.hook-head'), tag: q('.hook-tag'), halo: q('.hook-halo'), core: q('.hook-core'), sysband: q('.hook-sys-band'),
      wires: all('.hook-wire'), tiles: all('.hook-t'), probes: all('.hook-probe') });
    W.portrait(kit, {"hoist": [".hook-head"], "frame": [560, 1320], "crop": [1000, 150, 760, 820], "css": ".hook-head{left:70px!important;right:auto!important;top:140px!important;bottom:auto!important;width:940px!important;max-width:none!important;}"});
  },
  render(t) {
    const H = W.hub, c = H.c;
    W.push(this.cam, t, 11, 1, 1.035, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    H.at.forEach((p, i) => {
      const a = seg(t, -0.5 + i * 0.15, 0.2 + i * 0.15);
      const bob = 4 * Math.sin(t * 1.7 + i);
      this.tiles[i].setAttribute('transform', 'translate(' + p[0] + ' ' + (p[1] + bob).toFixed(1) + ') scale(' + lerp(0.8, 1, eob(a, 1.6)).toFixed(3) + ')');
      this.tiles[i].style.opacity = clamp01(a * 1.5);
      const w = this.wires[i]; w.style.strokeDasharray = '1'; w.style.strokeDashoffset = 1 - eo(seg(t, 0.4 + i * 0.12, 1.3 + i * 0.12));
      // Something from outside finds its way in through each assistant, one after another,
      // across "every assistant is also a new way into your data".
      const m = [(p[0] + c[0]) / 2 + (i % 2 ? 30 : -30), (p[1] + c[1]) / 2];
      const s = seg(t, 5.2 + i * 0.9, 6.4 + i * 0.9);
      const dir = [p[0] - c[0], p[1] - c[1]], len = Math.hypot(dir[0], dir[1]);
      let pt;
      if (s < 0.35) { const k = 1 - s / 0.35; pt = [p[0] + dir[0] / len * 260 * k, p[1] + dir[1] / len * 260 * k]; }
      else pt = W.qpt(p, m, c, eio((s - 0.35) / 0.65) * 0.62);
      const pr = this.probes[i];
      pr.setAttribute('cx', pt[0].toFixed(1)); pr.setAttribute('cy', pt[1].toFixed(1));
      pr.style.opacity = s > 0 ? (s < 1 ? 1 : 0.85) : 0;
    });
    // The warning lands on "your data and your systems".
    const warn = eo(seg(t, 9.8, 10.4));
    this.sysband.style.fill = warn > 0.5 ? 'var(--accent)' : 'var(--main)';
    this.halo.style.opacity = warn * (0.45 + 0.25 * Math.sin(t * 2.2));
    this.halo.setAttribute('r', (120 + 8 * Math.sin(t * 2.2)).toFixed(1));
    this.core.setAttribute('transform', 'translate(' + c[0] + ' ' + c[1] + ') scale(' + kit.breathe(t, 0.012, 3) + ')');
    this.tag.style.opacity = eo(seg(t, 1.2, 1.7));
  },
});
