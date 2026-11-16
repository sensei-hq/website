// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
// How a station looks: waiting (faint), now (vermillion, lifted), done (jade, ticked). Shared with the next scene.
W.cycState = function (g, band, tag, tick, i, p, now, done, K) {
  const at = W.cyc.at(i), lift = 1 + 0.08 * now;
  g.setAttribute('transform', 'translate(' + at[0].toFixed(1) + ' ' + at[1].toFixed(1) + ') scale(' + (K.lerp(0.85, 1, p) * lift).toFixed(3) + ')');
  g.style.opacity = K.lerp(0, K.lerp(0.4, 1, Math.max(now, done)), p);
  band.style.fill = now > 0.5 ? 'var(--accent)' : done > 0.5 ? 'var(--jade)' : 'var(--main)';
  tag.style.opacity = K.lerp(0, K.lerp(0.45, 1, Math.max(now, done)), p);
  tag.className = 'tag cyc-tag' + (now > 0.5 ? ' hot' : done > 0.5 ? ' ok' : '');
  if (tick) { tick.style.opacity = done; tick.setAttribute('transform', 'translate(' + (at[0] + 52).toFixed(1) + ' ' + (at[1] - 52).toFixed(1) + ') scale(' + K.lerp(0.4, 0.8, K.eob(done, 1.8)).toFixed(3) + ')'); }
};
kit.scene('define', {
  init(kit) {
    kit.css('.define-panel { left:110px; top:430px; width:760px; padding:34px 38px; display:flex; flex-direction:column; gap:16px }' +
      '.define-panel .eyebrow { margin:0 } .define-panel h3 { margin:0; font-family:var(--display, serif); font-weight:400; font-size:54px; line-height:1.12 } .define-panel p.sub { margin:0 }');
    const P = [['Step 1', 'Start with the concept.', 'What are we trying to achieve, and why does it matter?'],
      ['Step 2', 'Break it into detailed requirements.', 'Read them closely. A miss here skews every result after it.'],
      ['Step 3', 'Decide how it will be verified.', 'Clear guidelines and predefined skills keep the AI on the design.']];
    const panels = P.map(p => '<div class="card define-panel"><p class="eyebrow">' + p[0] + '</p><h3>' + p[1] + '</h3><p class="sub">' + p[2] + '</p></div>').join('');
    const ticks = [0, 1, 2, 3, 4, 5].map(() => W.tick('define-tick')).join('');
    kit.stage.append(kit.h('<div class="ground"><div class="cam define-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('define-bg') + W.cyc.arcs('define-arc') + W.cyc.stations('define-st') + ticks + '</svg>' +
      W.cyc.tags('define-tag') + '</div>' + panels +
      W.head('define-head', 'The cycle I follow', 'Define it before AI builds it.', '', 'left:110px;top:80px;width:840px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.define-cam'), head: q('.define-head'), arcs: all('.define-arc'), sts: all('.define-st'), bands: all('.define-st-n-band'), tags: all('.define-tag'), ticks: all('.define-tick'), panels: all('.define-panel') });
    // Timed to the voiceover: each step lands as the take starts it (concept, requirements, verified).
    this.on = [2.4, 4.8, 11.0];
    W.portrait(kit, {"hoist": [".define-head", ".define-panel"], "frame": [860, 1000], "crop": [880, 150, 940, 880], "css": ".define-head{left:70px!important;right:auto!important;top:140px!important;bottom:auto!important;width:940px!important;max-width:none!important;}.define-panel{left:70px!important;right:auto!important;top:420px!important;bottom:auto!important;width:864px!important;max-width:none!important}"});
  },
  render(t) {
    W.push(this.cam, t, 18, 1, 1.03, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    for (let i = 0; i < 6; i++) {
      const p = eo(seg(t, 0.2 + i * 0.12, 0.8 + i * 0.12));
      const st = this.on[i], nx = this.on[i + 1];
      const now = st === undefined ? 0 : eo(seg(t, st, st + 0.4)) * (nx === undefined ? 1 : 1 - eo(seg(t, nx, nx + 0.4)));
      const done = nx === undefined || st === undefined ? 0 : eo(seg(t, nx, nx + 0.4));
      W.cycState(this.sts[i], this.bands[i], this.tags[i], this.ticks[i], i, p, now, done, this.K);
      // The arc to the next station draws as we move on.
      const a = this.arcs[i];
      a.style.strokeDashoffset = nx !== undefined ? (1 - eio(seg(t, nx - 0.6, nx))).toFixed(3) : 1;
      a.style.stroke = 'var(--main)';
    }
    this.panels.forEach((pn, i) => {
      const st = this.on[i], nx = this.on[i + 1];
      const inn = eo(seg(t, st, st + 0.5)), out = nx === undefined ? 0 : eo(seg(t, nx - 0.3, nx + 0.1));
      pn.style.opacity = inn * (1 - out);
      pn.style.transform = 'translateY(' + (lerp(30, 0, inn) - 30 * out).toFixed(1) + 'px)';
    });
  },
});
