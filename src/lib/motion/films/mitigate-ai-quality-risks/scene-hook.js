// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('hook', {
  init(kit) {
    // A winding track with five gates; the work (a dot) runs along it and each gate turns green as it passes.
    const d = 'M940 760 C1120 760, 1100 560, 1300 560 S 1500 760, 1640 640 S 1700 300, 1520 300 S 1200 280, 1060 260';
    kit.stage.append(kit.h('<div class="ground"><div class="cam hook-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('hook-bg') +
      '<path class="hook-road" d="' + d + '" style="fill:none;stroke:var(--hair);stroke-width:34;stroke-linecap:round"/>' +
      '<path class="hook-done" pathLength="1" d="' + d + '" style="fill:none;stroke:var(--jade);stroke-width:8;stroke-linecap:round;stroke-dasharray:1 1"/>' +
      '<g class="hook-gates"></g><circle class="hook-dot" r="22" style="fill:var(--main);stroke:var(--ground);stroke-width:6"/></svg></div>' +
      W.head('hook-head', 'Working with AI', 'Five habits that keep AI on track.', 'Most fixes are not tools.', 'left:110px;top:300px;width:700px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    const road = q('.hook-road'), L = road.getTotalLength();
    this.at = [0.14, 0.33, 0.52, 0.72, 0.9];
    q('.hook-gates').innerHTML = this.at.map((f, i) => { const p = road.getPointAtLength(f * L);
      return '<g class="hook-gate" transform="translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ')"><circle r="34" style="fill:var(--tile);stroke:var(--main);stroke-width:4"/>' +
        '<text y="12" text-anchor="middle" style="font:400 34px var(--display);fill:var(--second)">' + (i + 1) + '</text></g>'; }).join('');
    Object.assign(this, { K: kit, road, L, cam: q('.hook-cam'), head: q('.hook-head'), done: q('.hook-done'), dot: q('.hook-dot'), gates: [...kit.stage.querySelectorAll('.hook-gate circle')] });
    W.portrait(kit, { hoist: ['.hook-head'], frame: [640, 980], crop: [880, 200, 940, 640], css: '.hook-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 6, 1, 1.03, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    const f = eio(seg(t, 1.0, 5.0)), p = this.road.getPointAtLength(f * this.L);
    this.dot.setAttribute('cx', p.x.toFixed(1)); this.dot.setAttribute('cy', p.y.toFixed(1));
    this.dot.style.opacity = eo(seg(t, 0.6, 1.0));
    this.done.style.strokeDashoffset = (1 - f).toFixed(4);
    this.gates.forEach((c, i) => { const on = f >= this.at[i]; c.style.fill = on ? 'var(--jade)' : 'var(--tile)'; c.style.stroke = on ? 'var(--jade)' : 'var(--main)';
      c.nextSibling.style.fill = on ? 'var(--ground)' : 'var(--second)'; });
  },
});
