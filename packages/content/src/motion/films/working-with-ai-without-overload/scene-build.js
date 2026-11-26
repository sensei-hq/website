// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('build', {
  init(kit) {
    kit.css('.build-panel { left:110px; top:430px; width:760px; padding:34px 38px; display:flex; flex-direction:column; gap:16px }' +
      '.build-panel .eyebrow { margin:0 } .build-panel h3 { margin:0; font-family:var(--display, serif); font-weight:400; font-size:54px; line-height:1.12 } .build-panel p.sub { margin:0; font-size:32px }' +
      '.build-mock { display:flex; align-items:center; gap:18px } .build-mock svg { width:240px; height:120px } .build-mock span { font-size:24px; font-weight:600; color:var(--mute) }' +
      '.build-phases { display:flex; gap:12px; flex-wrap:wrap } .build-ph { padding:10px 18px; border-radius:999px; font-size:26px; font-weight:600; border:2px solid var(--hair); background:var(--ground); color:var(--main) }');
    const mock = '<svg viewBox="0 0 240 120" aria-hidden="true"><rect x="2" y="2" width="236" height="116" rx="10" style="fill:var(--ground);stroke:var(--main);stroke-width:3"/><path d="M2 26 H238" style="stroke:var(--hair);stroke-width:3"/><circle cx="16" cy="14" r="4" style="fill:var(--accent)"/><rect x="14" y="38" width="60" height="68" rx="6" style="fill:var(--hair)"/><rect class="build-mk" x="88" y="38" width="136" height="14" rx="7" style="fill:var(--main)"/><rect class="build-mk" x="88" y="62" width="100" height="12" rx="6" style="fill:var(--hair)"/><rect class="build-mk" x="88" y="84" width="60" height="22" rx="6" style="fill:var(--accent)"/></svg>';
    const P = [
      ['Step 4', 'Design how it will be built.', 'Patterns, principles and architecture, so the code stays clean. UX goes alongside.', '<div class="build-mock">' + mock + '<span>Mock-ups made in Claude Cowork</span></div>'],
      ['Step 5', 'Plan it in phases.', 'Every phase ends with a check, so results are verified as you go.', '<div class="build-phases"><span class="build-ph">Phase 1</span><span class="build-ph">Phase 2</span><span class="build-ph">Phase 3</span></div>'],
      ['Step 6', 'Focus on the results.', 'Review outcomes against the definition, not every line.', '']];
    const panels = P.map(p => '<div class="card build-panel"><p class="eyebrow">' + p[0] + '</p><h3>' + p[1] + '</h3><p class="sub">' + p[2] + '</p>' + p[3] + '</div>').join('');
    const ticks = [0, 1, 2, 3, 4, 5].map(() => W.tick('build-tick')).join('');
    const C = W.cyc.c;
    kit.stage.append(kit.h('<div class="ground"><div class="cam build-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('build-bg') +
      '<circle class="build-glow" cx="' + C[0] + '" cy="' + C[1] + '" r="' + W.cyc.r + '" style="fill:none;stroke:var(--jade);stroke-width:16"/>' +
      W.cyc.arcs('build-arc') + W.cyc.stations('build-st') + ticks + '</svg>' + W.cyc.tags('build-tag') +
      '<div class="build-mid" style="position:absolute;left:' + C[0] + 'px;top:' + C[1] + 'px;transform:translate(-50%,-50%);text-align:center;font-family:var(--display, serif);font-size:44px;line-height:1.15;width:340px">Verified at every step</div></div>' + panels +
      W.head('build-head', 'The cycle I follow', 'Then build in steps you can check.', '', 'left:110px;top:80px;width:840px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.build-cam'), head: q('.build-head'), arcs: all('.build-arc'), sts: all('.build-st'), bands: all('.build-st-n-band'), tags: all('.build-tag'), ticks: all('.build-tick'),
      panels: all('.build-panel'), mk: all('.build-mk'), phs: all('.build-ph'), glow: q('.build-glow'), mid: q('.build-mid') });
    // Timed to the voiceover: design, then the plan, then results, each as the take starts it.
    this.on = [-3, -2, -1, 1.0, 12.2, 15.4];
    W.portrait(kit, {"hoist": [".build-head", ".build-panel"], "frame": [980, 920], "crop": [860, 150, 980, 920], "css": ".build-head{left:70px!important;right:auto!important;top:140px!important;bottom:auto!important;width:940px!important;max-width:none!important;}.build-panel{left:70px!important;right:auto!important;top:420px!important;bottom:auto!important;width:864px!important;max-width:none!important}"});
  },
  render(t) {
    W.push(this.cam, t, 18, 1.03, 1.06, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    const full = eo(seg(t, 17.2, 17.8));
    for (let i = 0; i < 6; i++) {
      const st = this.on[i], nx = this.on[i + 1];
      const now = eo(seg(t, st, st + 0.4)) * (nx === undefined ? 1 - full : 1 - eo(seg(t, nx, nx + 0.4)));
      const done = nx === undefined ? full : eo(seg(t, nx, nx + 0.4));
      W.cycState(this.sts[i], this.bands[i], this.tags[i], this.ticks[i], i, 1, now, done, this.K);
      const a = this.arcs[i];
      const end = nx !== undefined ? nx : 17.2;
      a.style.strokeDashoffset = (1 - eio(seg(t, end - 0.6, end))).toFixed(3);
      a.style.stroke = full > 0.5 ? 'var(--jade)' : 'var(--main)';
    }
    // The loop closes: the whole ring settles in jade, verified all the way round.
    this.glow.style.opacity = (0.18 * full * (0.8 + 0.2 * Math.sin(t * 2))).toFixed(3);
    this.mid.style.opacity = eo(seg(t, 17.5, 18.1));
    this.panels.forEach((pn, k) => {
      const st = this.on[k + 3], nx = this.on[k + 4];
      const inn = eo(seg(t, st, st + 0.5)), out = nx === undefined ? eo(seg(t, 17.0, 17.5)) : eo(seg(t, nx - 0.3, nx + 0.1));
      pn.style.opacity = inn * (1 - out);
      pn.style.transform = 'translateY(' + (lerp(30, 0, inn) - 30 * out).toFixed(1) + 'px)';
    });
    // The mock-up sketches itself on "mock-ups"; the phases pass their checks one by one.
    this.mk.forEach((m, k) => { m.style.transformBox = 'fill-box'; m.style.transformOrigin = '0 50%'; m.style.transform = 'scaleX(' + eo(seg(t, 10.0 + k * 0.4, 10.6 + k * 0.4)).toFixed(3) + ')'; });
    this.phs.forEach((p, k) => { const d = seg(t, 12.8 + k * 0.8, 13.1 + k * 0.8) > 0.5; p.style.background = d ? 'var(--jade)' : 'var(--ground)'; p.style.color = d ? 'var(--ground)' : 'var(--main)'; p.style.borderColor = d ? 'var(--jade)' : 'var(--hair)'; });
  },
});
