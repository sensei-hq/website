// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01, TextFx } = kit;
kit.scene('review', {
  init(kit) {
    kit.css('.review-gate { left:330px; top:36px; width:460px; padding:26px 30px; display:flex; flex-direction:column; gap:16px }' +
      '.review-gate h3 { margin:0; font-size:30px; font-weight:700; font-family:var(--display, var(--sans, system-ui, sans-serif)) }' +
      '.review-row { display:flex; flex-direction:column; gap:8px } .review-row p { margin:0; font-size:26px; color:var(--soft) }' +
      '.review-bar { position:relative; height:16px; border-radius:8px; background:color-mix(in srgb, var(--second) 12%, var(--ground)) }' +
      '.review-fill { position:absolute; left:0; top:0; bottom:0; width:100%; border-radius:8px; transform-origin:0 50%; background:var(--accent) }' +
      '.review-mark { position:absolute; top:-6px; bottom:-6px; width:4px; border-radius:2px; background:var(--second) }');
    const C = W.relay.con;
    const passes = C.map((b, i) => '<g class="review-pass">' + W.card('review-pcard', 'var(--soft)') + '</g>').join('');
    const ticks = C.map((b, i) => '<g class="review-tk" transform="translate(' + (b[0] + 64) + ' ' + (b[1] - 64) + ')">' + W.tick('review-tick') + '</g>').join('');
    const ups = C.map(() => '<g class="review-up">' + W.card('review-ucard', 'var(--main)') + '</g>').join('');
    kit.stage.append(kit.h('<div class="ground"><div class="cam review-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('review-bg') + W.relay.wires('review-wire') +
      '<g class="review-peers">' + C.map((b, i) => { const n = C[(i + 1) % C.length]; return '<path class="review-arc" pathLength="1" d="M' + b[0] + ' ' + b[1] + ' Q' + (Math.max(b[0], n[0]) + (i === 4 ? 520 : 200)) + ' ' + ((b[1] + n[1]) / 2) + ' ' + n[0] + ' ' + n[1] + '" style="fill:none;stroke:var(--accent);stroke-width:5;stroke-dasharray:0.02 0.03;stroke-linecap:round"/>'; }).join('') + '</g>' +
      W.relayNodes('review') + passes + ups + ticks +
      '<g class="review-goal" transform="translate(660 340)">' + W.tick('review-gtick', 'var(--accent)') + '</g></svg>' +
      '<div class="calm review-gate"><h3>Metrics gate</h3>' +
        '<div class="review-row"><p>Requirements covered</p><div class="review-bar"><i class="review-fill"></i><b class="review-mark" style="left:85%"></b></div></div>' +
        '<div class="review-row"><p>Tests passing</p><div class="review-bar"><i class="review-fill"></i><b class="review-mark" style="left:90%"></b></div></div>' +
        '<div class="review-row"><p>Review score</p><div class="review-bar"><i class="review-fill"></i><b class="review-mark" style="left:80%"></b></div></div></div>' +
      '<div class="tag ctl review-met" style="left:560px;top:530px">Goal achieved</div></div>' +
      '<div class="words review-words" style="left:110px;bottom:80px;width:900px"><h2 class="line review-line" style="font-size:76px">Cross-review, then a metrics gate.</h2><p class="sub review-sub">Each result is checked by a peer against the requirement, merged, and passed only when the numbers say so.</p></div></div>'));
    const q = (s) => kit.stage.querySelector(s);
    Object.assign(this, { cam: q('.review-cam'), gate: q('.review-gate'), met: q('.review-met'), goal: q('.review-goal'), line: q('.review-line'), sub: q('.review-sub'), ctl: q('.review-ctl') });
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { passes: all('.review-pass'), ticks: all('.review-tk'), ups: all('.review-up'), arcs: all('.review-arc'), fills: all('.review-fill'), rings: all('.review-ring') });
    this.arcPts = C.map((b, i) => { const n = C[(i + 1) % C.length]; return [b, [Math.max(b[0], n[0]) + (i === 4 ? 520 : 200), (b[1] + n[1]) / 2], n]; });
    W.portrait(kit, {"hoist": [".review-words"], "frame": [520, 1350], "crop": [300, 20, 1460, 1000], "css": ".review-words{left:70px!important;right:auto!important;top:140px!important;bottom:auto!important;width:940px!important;max-width:none!important;}"});
  },
  render(t) {
    this.cam.style.transform = 'scale(' + lerp(1.0, 1.03, eio(seg(t, 0, 7.5))) + ')';
    const C = W.relay.con, a = W.relay.ctl;
    this.rings.forEach(r => { r.style.opacity = 0; });
    // Peer review: each contributor's work goes to its neighbour, who checks it.
    // Timed to the voiceover: checks land across "review each other's work", the merge on "results are merged",
    // the meters on "metrics gate", the verdict on "the goal is met".
    this.arcs.forEach((p, i) => { p.style.opacity = eo(seg(t, 0.3 + i * 0.2, 0.7 + i * 0.2)) * (1 - seg(t, 4.0, 4.4)); p.style.strokeDashoffset = (-t * 0.05).toFixed(3); });
    this.passes.forEach((g, i) => {
      const s = seg(t, 0.6 + i * 0.3, 1.6 + i * 0.3), [b, c, n] = this.arcPts[i], p = W.qpt(b, c, n, eio(s));
      g.style.opacity = s > 0 && s < 1 ? 1 : 0;
      g.setAttribute('transform', 'translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ') scale(0.8)');
    });
    this.ticks.forEach((g, i) => {
      const j = (i + 4) % 5, s = seg(t, 2.9 + j * 0.3, 3.2 + j * 0.3), b = C[i];
      g.style.opacity = eo(s);
      g.setAttribute('transform', 'translate(' + (b[0] + 64) + ' ' + (b[1] - 64) + ') scale(' + lerp(0.3, 1, eob(s, 1.8)).toFixed(3) + ')');
    });
    // Consolidation: every checked result flows to the controller.
    let inCount = 0;
    this.ups.forEach((g, i) => {
      const s = seg(t, 4.3 + i * 0.12, 5.1 + i * 0.12), p = W.qpt(C[i], W.relay.bend(i), a, eio(s));
      g.style.opacity = s > 0 && s < 1 ? 1 : 0;
      g.setAttribute('transform', 'translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ') scale(' + lerp(1, 0.6, s).toFixed(3) + ')');
      if (s >= 1) inCount++;
    });
    const gulp = 1 + 0.08 * Math.sin(seg(t, 5.0, 5.6) * Math.PI);
    this.ctl.setAttribute('transform', 'translate(' + a[0] + ' ' + a[1] + ') scale(' + gulp.toFixed(3) + ')');
    // The gate: three meters climb past their thresholds.
    const g = eo(seg(t, 5.2, 5.6));
    this.gate.style.opacity = g; this.gate.style.transform = 'translateY(' + lerp(-20, 0, g) + 'px)';
    [0.93, 0.97, 0.88].forEach((v, k) => {
      const f = lerp(0.42, v, eio(seg(t, 5.6 + k * 0.2, 6.6 + k * 0.2)));
      const el = this.fills[k], mark = [0.85, 0.9, 0.8][k];
      el.style.transform = 'scaleX(' + f.toFixed(3) + ')';
      el.style.background = f >= mark ? 'var(--jade)' : 'var(--accent)';
    });
    const m = seg(t, 7.0, 7.4);
    this.met.style.opacity = eo(m); this.met.style.transform = 'translate(-50%, 0) scale(' + lerp(0.7, 1, eob(m, 1.8)).toFixed(3) + ')';
    this.goal.style.opacity = eo(m); this.goal.setAttribute('transform', 'translate(632 368) scale(' + lerp(0.3, 1.2, eob(m, 1.8)).toFixed(3) + ')');
    TextFx.fadeFromRight(this.line, t, -0.2);
    this.sub.style.opacity = eo(seg(t, 0.8, 1.4));
    this.sub.style.transform = 'translateX(' + lerp(28, 0, eo(seg(t, 0.8, 1.4))) + 'px)';
  },
});
