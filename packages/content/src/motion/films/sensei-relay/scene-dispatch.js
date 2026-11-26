// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01, TextFx } = kit;
// The board in relay order: controller, then contributors, each with its own mark.
W.relayNodes = function (cls) {
  let s = '<g class="' + cls + '-ctl" transform="translate(' + W.relay.ctl[0] + ' ' + W.relay.ctl[1] + ')">' + W.node(cls + '-cnode', 'spark', 'ctl') + '</g>';
  W.relay.con.forEach((p, i) => {
    s += '<g class="' + cls + '-con" transform="translate(' + p[0] + ' ' + p[1] + ')"><circle class="' + cls + '-ring" r="104" pathLength="1" transform="rotate(-90)" style="fill:none;stroke:var(--accent);stroke-width:8;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1"/>' + W.node(cls + '-node', W.crew[i + 1].kind, 'con') + '</g>';
  });
  return s;
};
kit.scene('dispatch', {
  init(kit) {
    const cards = W.relay.con.map(() => '<g class="dispatch-task">' + W.card('dispatch-tcard', 'var(--accent)') + '</g>').join('');
    const reps = W.relay.con.map(() => '<g class="dispatch-rep">' + W.card('dispatch-rcard', 'var(--main)') + '</g>').join('');
    kit.stage.append(kit.h('<div class="ground"><div class="cam dispatch-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('dispatch-bg') + W.relay.wires('dispatch-wire') +
      '<g class="dispatch-plan" transform="translate(560 640)"><rect x="-150" y="-6" width="300" height="190" rx="16" style="fill:var(--shade)"/><rect x="-150" y="-16" width="300" height="190" rx="16" style="fill:var(--tile);stroke:var(--edge);stroke-width:3"/>' +
      [0, 1, 2, 3, 4].map(k => '<g class="dispatch-step"><circle cx="-112" cy="' + (16 + k * 32) + '" r="9" style="fill:none;stroke:var(--accent);stroke-width:4"/><path d="M-90 ' + (16 + k * 32) + ' H' + (60 + (k % 3) * 24) + '" style="stroke:color-mix(in srgb, var(--second) 40%, var(--tile));stroke-width:7;stroke-linecap:round"/></g>').join('') + '</g>' +
      W.relayNodes('dispatch') + cards + reps + '</svg>' +
      '<div class="tag dispatch-count" style="left:560px;top:860px">Reports in: 0 of 5</div></div>' +
      '<div class="words dispatch-words" style="left:110px;top:70px;width:1020px"><h2 class="line dispatch-line" style="font-size:72px">Plan, dispatch, report.</h2><p class="sub dispatch-sub">The controller breaks the goal into tasks and hands them out.</p></div></div>'));
    const q = (s) => kit.stage.querySelector(s);
    Object.assign(this, { cam: q('.dispatch-cam'), plan: q('.dispatch-plan'), count: q('.dispatch-count'), line: q('.dispatch-line'), sub: q('.dispatch-sub') });
    this.steps = [...kit.stage.querySelectorAll('.dispatch-step')];
    this.tasks = [...kit.stage.querySelectorAll('.dispatch-task')];
    this.reps = [...kit.stage.querySelectorAll('.dispatch-rep')];
    this.rings = [...kit.stage.querySelectorAll('.dispatch-ring')];
    this.leds = [...kit.stage.querySelectorAll('.dispatch-node-led')];
    this.cons = [...kit.stage.querySelectorAll('.dispatch-con')];
    W.portrait(kit, {"hoist": [".dispatch-words"], "frame": [450, 1420], "crop": [380, 100, 1400, 840], "css": ".dispatch-words{left:70px!important;right:auto!important;top:140px!important;bottom:auto!important;width:940px!important;max-width:none!important;}"});
  },
  render(t) {
    this.cam.style.transform = 'scale(' + lerp(1.0, 1.03, eio(seg(t, 0, 7))) + ')';
    const a = W.relay.ctl;
    // The plan writes itself, one step at a time.
    this.plan.style.opacity = eo(seg(t, -0.4, 0.2));
    this.steps.forEach((s, k) => { s.style.opacity = eo(seg(t, 0.3 + k * 0.35, 0.6 + k * 0.35)); });
    let done = 0;
    // Timed to the voiceover: tasks leave on "hands out the tasks", reports return on "reports back".
    W.relay.con.forEach((b, i) => {
      const c = W.relay.bend(i), go = seg(t, 2.6 + i * 0.25, 3.5 + i * 0.25), back = seg(t, 4.9 + i * 0.22, 5.9 + i * 0.22);
      const p1 = W.qpt([a[0], a[1] + 210], c, b, eio(go));
      const tk = this.tasks[i];
      tk.style.opacity = go > 0 && go < 1 ? 1 : 0;
      tk.setAttribute('transform', 'translate(' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + ') rotate(' + (Math.sin(go * Math.PI) * 10).toFixed(2) + ')');
      // Work: the ring fills while the contributor is busy.
      const work = seg(t, 3.5 + i * 0.25, 4.9 + i * 0.22);
      this.rings[i].style.strokeDashoffset = 1 - eio(work);
      this.rings[i].style.opacity = back > 0.3 ? 1 - seg(back, 0.3, 0.7) : 1;
      this.leds[i].style.fill = work > 0 && back < 1 ? 'var(--accent)' : 'color-mix(in srgb, var(--second) 20%, var(--tile))';
      const thump = 1 + 0.07 * Math.sin(seg(t, 3.5 + i * 0.25, 3.8 + i * 0.25) * Math.PI);
      this.cons[i].setAttribute('transform', 'translate(' + b[0] + ' ' + b[1] + ') scale(' + thump.toFixed(3) + ')');
      const p2 = W.qpt(b, c, a, eio(back));
      const rp = this.reps[i];
      rp.style.opacity = back > 0 && back < 1 ? 1 : 0;
      rp.setAttribute('transform', 'translate(' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1) + ') rotate(' + (-Math.sin(back * Math.PI) * 10).toFixed(2) + ')');
      if (back >= 1) done++;
    });
    this.count.textContent = 'Reports in: ' + done + ' of 5';
    this.count.style.background = done === 5 ? 'var(--main)' : 'var(--ground)';
    this.count.style.color = done === 5 ? 'var(--ground)' : 'var(--second)';
    this.count.style.opacity = eo(seg(t, 0.8, 1.2));
    TextFx.fadeFromRight(this.line, t, -0.3);
    this.sub.style.opacity = eo(seg(t, 0.7, 1.3));
    this.sub.style.transform = 'translateX(' + lerp(28, 0, eo(seg(t, 0.7, 1.3))) + 'px)';
  },
});
