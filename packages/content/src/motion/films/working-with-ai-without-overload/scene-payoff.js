// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('payoff', {
  init(kit) {
    const S = [1050, 760], G = [1400, 760], D = [1720, 760], R = [1400, 540];
    Object.assign(this, { S, G, D, R });
    // Timed to the voiceover: the last slip clears the gate as the take ends.
    this.items = Array.from({ length: 9 }, (_, k) => ({ at: 1.0 + k * 0.95, fail: k === 3 || k === 7 }));
    const slips = this.items.map((it, k) => '<g class="payoff-s">' + W.slip('payoff-slip', k % 2 ? 'code' : 'text', k + 11) + '<rect class="payoff-tint" x="-66" y="-42" width="132" height="84" rx="10" style="fill:none;stroke-width:5"/></g>').join('');
    kit.stage.append(kit.h('<div class="ground"><div class="cam payoff-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('payoff-bg') +
      '<path d="M' + (S[0] + 70) + ' ' + (S[1] + 60) + ' H' + (D[0] + 90) + '" style="stroke:var(--hair);stroke-width:10;stroke-linecap:round"/>' +
      '<rect x="' + (R[0] - 110) + '" y="' + (R[1] - 60) + '" width="220" height="120" rx="16" style="fill:color-mix(in srgb, var(--accent) 8%, var(--tile));stroke:var(--accent);stroke-width:3;stroke-dasharray:10 8"/>' +
      '<g transform="translate(' + S[0] + ' ' + S[1] + ')">' + W.node('payoff-ai', 'spark', 'ink', 130) + '</g>' + slips +
      '<g class="payoff-gate" transform="translate(' + G[0] + ' ' + G[1] + ')"><rect x="-104" y="-90" width="18" height="170" rx="6" style="fill:var(--main)"/><rect x="86" y="-90" width="18" height="170" rx="6" style="fill:var(--main)"/><rect x="-114" y="-104" width="228" height="20" rx="8" style="fill:var(--main)"/><rect class="payoff-beam" x="-86" y="-84" width="6" height="164" style="fill:var(--jade)"/></g>' +
      '<g class="payoff-done" transform="translate(' + D[0] + ' ' + (D[1] + 100) + ')">' + W.tick('payoff-dtick') + '</g></svg>' +
      '<div class="tag payoff-t1" style="left:' + G[0] + 'px;top:' + (G[1] + 112) + 'px">Verification criteria</div>' +
      '<div class="tag ok payoff-t2" style="left:' + D[0] + 'px;top:' + (D[1] + 136) + 'px">Done</div>' +
      '<div class="tag hot payoff-t3" style="left:' + R[0] + 'px;top:' + (R[1] - 116) + 'px">Read closely</div></div>' +
      W.head('payoff-head', 'The payoff', 'Read against the definition.', 'Not every line. Check for intent and outcome first.', 'left:110px;top:80px;width:1000px') +
      W.checks('payoff-checks', ['Skim for intent first', 'Check against the verification criteria', 'Read deeply only what misses'], 'left:110px;top:500px;width:700px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.payoff-cam'), head: q('.payoff-head'), checks: q('.payoff-checks'), ss: all('.payoff-s'), tints: all('.payoff-tint'), beam: q('.payoff-beam'), t1: q('.payoff-t1'), t2: q('.payoff-t2'), t3: q('.payoff-t3'), done: q('.payoff-done') });
    W.portrait(kit, {"hoist": [".payoff-head", ".payoff-checks"], "frame": [520, 720], "crop": [960, 400, 900, 560], "css": ".payoff-head{left:70px!important;right:auto!important;top:140px!important;bottom:auto!important;width:940px!important;max-width:none!important;}.payoff-checks{left:70px!important;right:auto!important;top:1300px!important;bottom:auto!important;width:940px!important;max-width:none!important} .chk{font-size:36px!important;padding:18px 24px!important}"});
  },
  render(t) {
    const { S, G, D, R } = this;
    W.push(this.cam, t, 13, 1, 1.03, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    let passed = 0, failed = 0, scanning = 0;
    this.items.forEach((it, k) => {
      const a = seg(t, it.at, it.at + 0.7), h = seg(t, it.at + 0.7, it.at + 1.0), b = seg(t, it.at + 1.0, it.at + 1.7);
      let x, y, s = 0.8;
      if (b <= 0) { x = lerp(S[0] + 40, G[0], eio(a)); y = S[1] - Math.sin(a * Math.PI) * 30; }
      else if (!it.fail) { const slot = this.items.slice(0, k).filter(o => !o.fail).length; x = lerp(G[0], D[0], eio(b)); y = lerp(G[1], D[1] - slot * 18, eio(b)) - Math.sin(b * Math.PI) * 40; }
      else { const slot = this.items.slice(0, k).filter(o => o.fail).length; x = lerp(G[0], R[0] - 40 + slot * 80, eio(b)); y = lerp(G[1], R[1], eio(b)); s = lerp(0.8, 0.7, b); }
      if (h > 0 && h < 1) scanning = 1;
      const g = this.ss[k];
      g.style.opacity = a > 0 ? 1 : 0;
      g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(' + s.toFixed(3) + ')');
      const judged = h >= 0.6;
      this.tints[k].style.stroke = judged ? (it.fail ? 'var(--accent)' : 'var(--jade)') : 'transparent';
      if (b >= 1) { if (it.fail) failed++; else passed++; }
    });
    // The beam sweeps across the gate while a slip is being checked.
    this.beam.setAttribute('x', (-86 + 166 * ((t * 2.2) % 1)).toFixed(1));
    this.beam.style.opacity = scanning ? 0.9 : 0.25;
    [this.t1, this.t2, this.t3].forEach((g, i) => { g.style.opacity = eo(seg(t, 0.6 + i * 0.3, 1.0 + i * 0.3)); });
    this.done.style.opacity = passed > 0 ? 1 : 0;
    this.done.setAttribute('transform', 'translate(' + D[0] + ' ' + (D[1] + 92) + ') scale(' + (0.7 + 0.04 * Math.sin(t * 2)).toFixed(3) + ')');
    // Each check lands as the take names it.
    W.showChecks(this.checks, t, 2.0, 2.4, this.K);
  },
});
