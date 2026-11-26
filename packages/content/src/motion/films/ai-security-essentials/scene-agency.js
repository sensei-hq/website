// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('agency', {
  init(kit) {
    kit.css('.agency-head .line { font-size:66px }');
    kit.css('.agency-meter { left:200px; top:880px; width:440px; padding:16px 22px; display:flex; flex-direction:column; gap:10px }' +
      '.agency-meter p { margin:0; font-size:24px; font-weight:600; color:var(--main) } .agency-track { position:relative; height:16px; border-radius:8px; background:color-mix(in srgb, var(--second) 10%, var(--ground)) }' +
      '.agency-fill { position:absolute; inset:0; border-radius:8px; transform-origin:0 50%; background:var(--accent) } .agency-cap { position:absolute; top:-8px; bottom:-8px; left:55%; width:4px; border-radius:2px; background:var(--second) }');
    const A = [420, 640], tools = [['Email', 'wave', 430], ['Files', 'grid', 570], ['Payments', 'lock', 710], ['Cloud', 'db', 850]];
    this.A = A; this.tools = tools;
    let wires = '', tiles = '', dots = '', tags = '';
    tools.forEach((w, i) => {
      const b = [880, w[2]], c = [650, (A[1] + w[2]) / 2];
      wires += W.wire('agency-w', [A[0] + 70, A[1]], c, [b[0] - 50, b[1]], 'var(--accent)');
      tiles += '<g transform="translate(' + b[0] + ' ' + b[1] + ')">' + W.node('agency-tool', w[1], 'ink', 100) + '</g>';
      dots += '<circle class="agency-dot" r="9" style="fill:var(--accent)"/>';
      tags += '<div class="tag agency-tag" style="left:1010px;top:' + (w[2] - 24) + 'px;transform:none">' + w[0] + '</div>';
    });
    kit.stage.append(kit.h('<div class="ground"><div class="cam agency-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('agency-bg') + wires + dots + tiles +
      '<g class="agency-a" transform="translate(' + A[0] + ' ' + A[1] + ')">' + W.node('agency-node', 'spark', 'hot') + '</g>' +
      '<g class="agency-gate">' + W.node('agency-lock', 'lock', 'ok', 64) + '</g><g class="agency-you">' + W.pointer('agency-ptr') + '</g></svg>' + tags +
      '<div class="tag agency-atag" style="left:' + A[0] + 'px;top:' + (A[1] + 92) + 'px">AI agent</div>' +
      '<div class="card agency-meter"><p>Usage and cost</p><div class="agency-track"><i class="agency-fill"></i><b class="agency-cap"></b></div></div></div>' +
      W.head('agency-head', 'Excessive agency · Unbounded consumption', 'Agents with too much power.', 'Broad access and no limits turn one mistake into many.', 'left:110px;top:70px;width:1120px') +
      W.checks('agency-checks', ['Scoped, short-lived credentials', 'Approval gates for risky actions', 'Log and audit every action', 'Spending caps and circuit breakers'], 'left:1240px;top:400px;width:580px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.agency-cam'), head: q('.agency-head'), checks: q('.agency-checks'), wires: all('.agency-w'), dots: all('.agency-dot'), tags: all('.agency-tag'), band: q('.agency-node-band'),
      fill: q('.agency-fill'), cap: q('.agency-cap'), meter: q('.agency-meter'), gate: q('.agency-gate'), you: q('.agency-you'), atag: q('.agency-atag') });
    W.portrait(kit, {"hoist": [".agency-head", ".agency-checks"], "frame": [480, 780], "crop": [170, 330, 1030, 690], "css": ".agency-head{left:70px!important;right:auto!important;top:140px!important;bottom:auto!important;width:940px!important;max-width:none!important;}.agency-checks{left:70px!important;right:auto!important;top:1300px!important;bottom:auto!important;width:940px!important;max-width:none!important} .chk{font-size:36px!important;padding:18px 24px!important}"});
  },
  render(t) {
    const A = this.A;
    W.push(this.cam, t, 13, 1, 1.03, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    // Timed to the voiceover: the limits go on with "limit what they can reach",
    // the approval on "approval gates", the checks as each control is named.
    const limit = seg(t, 4.0, 4.7);
    this.tools.forEach((w, i) => {
      const b = [880, w[2]], c = [650, (A[1] + w[2]) / 2];
      const el = this.wires[i]; el.style.strokeDasharray = '1';
      el.style.strokeDashoffset = 1 - eo(seg(t, 1.2 + i * 0.15, 1.9 + i * 0.15));
      // Payments and Cloud are taken away; Email gets an approval gate; Files stays.
      const cut = i >= 2 ? eo(limit) : 0;
      el.style.opacity = 1 - 0.8 * cut;
      el.style.stroke = limit > 0.5 ? (i === 1 ? 'var(--jade)' : i === 0 ? 'var(--main)' : 'var(--wire)') : 'var(--accent)';
      this.tags[i].style.opacity = eo(seg(t, 0.8 + i * 0.15, 1.2 + i * 0.15)) * (1 - 0.55 * cut);
      // Actions fire down every wire, fast, until the limits go on.
      const busy = seg(t, 2.2, 2.6) * (1 - limit);
      const slow = i === 1 ? limit : 0;
      const ph = ((t * (busy > 0 ? 1.4 : 0.5) + i * 0.27) % 1 + 1) % 1, p = W.qpt([A[0] + 70, A[1]], c, [b[0] - 50, b[1]], ph);
      const d = this.dots[i]; d.setAttribute('cx', p[0].toFixed(1)); d.setAttribute('cy', p[1].toFixed(1));
      d.style.opacity = Math.max(busy, slow);
      d.style.fill = slow > 0.5 ? 'var(--jade)' : 'var(--accent)';
    });
    this.band.style.fill = limit > 0.5 ? 'var(--jade)' : 'var(--accent)';
    this.atag.style.opacity = eo(seg(t, 0.6, 1.0));
    this.meter.style.opacity = eo(seg(t, 1.6, 2.1));
    const run = lerp(0.12, 0.92, eio(seg(t, 2.4, 4.2)));
    const capped = Math.min(run, lerp(0.92, 0.5, eo(limit)));
    this.fill.style.transform = 'scaleX(' + capped.toFixed(3) + ')';
    this.fill.style.background = limit > 0.5 ? 'var(--jade)' : 'var(--accent)';
    this.cap.style.opacity = eo(limit);
    // An approval gate sits on the email wire, and a person approves the one action that needs it.
    const gp = W.qpt([A[0] + 70, A[1]], [650, (A[1] + 430) / 2], [830, 430], 0.62);
    const g = eob(seg(t, 6.1, 6.6), 1.8);
    this.gate.style.opacity = clamp01(g * 2);
    this.gate.setAttribute('transform', 'translate(' + gp[0].toFixed(1) + ' ' + gp[1].toFixed(1) + ') scale(' + lerp(0.4, 1, g).toFixed(3) + ')');
    const yp = eio(seg(t, 6.6, 7.5)), press = t > 7.5 && t < 7.75 ? 0.88 : 1;
    this.you.style.opacity = eo(seg(t, 6.5, 6.8));
    this.you.setAttribute('transform', 'translate(' + lerp(760, gp[0] + 6, yp).toFixed(1) + ' ' + lerp(300, gp[1] + 6, yp).toFixed(1) + ') scale(' + press + ')');
    W.showChecks(this.checks, t, 4.2, 2.2, this.K);
  },
});
