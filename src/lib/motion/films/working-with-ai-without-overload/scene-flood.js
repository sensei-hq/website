// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, ei, eio, eob, lerp, clamp01 } = kit;
kit.scene('flood', {
  init(kit) {
    kit.css('.flood-meter { left:110px; top:740px; width:560px; padding:24px 28px; display:flex; flex-direction:column; gap:14px }' +
      '.flood-row { display:grid; grid-template-columns:150px 1fr; align-items:center; gap:16px } .flood-row p { margin:0; font-size:26px; font-weight:600; color:var(--main) }' +
      '.flood-track { position:relative; height:18px; border-radius:9px; background:color-mix(in srgb, var(--second) 9%, var(--ground)) } .flood-fill { position:absolute; inset:0; border-radius:9px; transform-origin:0 50% }');
    const r = kit.rng(7), N = 38, src = [1560, 300];
    this.src = src;
    this.items = Array.from({ length: N }, (_, k) => ({ at: 0.9 + 7.2 * Math.pow(k / N, 0.75), x: 820 + r() * 980, y: 520 + r() * 440, rot: (r() - 0.5) * 24, kind: r() < 0.45 ? 'code' : 'text' }));
    const slips = this.items.map((it, k) => W.slip('flood-slip', it.kind, k)).join('');
    kit.stage.append(kit.h('<div class="ground"><div class="cam flood-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('flood-bg') + slips +
      '<g class="flood-ai" transform="translate(' + src[0] + ' ' + src[1] + ')">' + W.node('flood-node', 'spark', 'hot') + '</g></svg>' +
      '<div class="tag flood-t0" style="left:1330px;top:240px;transform:translate(-100%,0)">Code</div><div class="tag flood-t1" style="left:1330px;top:310px;transform:translate(-100%,0)">Analysis</div><div class="tag flood-t2" style="left:1330px;top:380px;transform:translate(-100%,0)">Answers</div></div>' +
      '<div class="card flood-meter"><div class="flood-row"><p>Generated</p><div class="flood-track"><i class="flood-fill flood-gen" style="background:var(--accent)"></i></div></div>' +
        '<div class="flood-row"><p>Read</p><div class="flood-track"><i class="flood-fill flood-read" style="background:var(--main)"></i></div></div></div>' +
      W.head('flood-head', 'Working with AI', 'More output than anyone can read.', 'Code, analysis and answers, arriving faster every day.', 'left:110px;top:80px;width:1000px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.flood-cam'), head: q('.flood-head'), slips: all('.flood-slip'), ai: q('.flood-ai'), tags: [q('.flood-t0'), q('.flood-t1'), q('.flood-t2')], meter: q('.flood-meter'), gen: q('.flood-gen'), read: q('.flood-read') });
    W.portrait(kit, {"hoist": [".flood-head", ".flood-meter"], "frame": [520, 860], "crop": [760, 200, 1100, 840], "css": ".flood-head{left:70px!important;right:auto!important;top:140px!important;bottom:auto!important;width:940px!important;max-width:none!important;}.flood-meter{left:70px!important;right:auto!important;top:1440px!important;bottom:auto!important;width:884px!important;max-width:none!important}"});
  },
  render(t) {
    W.push(this.cam, t, 11.5, 1, 1.035, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    const src = this.src;
    // Each slip flies out of the assistant on an arc and lands on the pile; they come faster and faster.
    this.items.forEach((it, k) => {
      const s = seg(t, it.at, it.at + 0.7), e = eio(s);
      const x = lerp(src[0], it.x, e), y = lerp(src[1], it.y, e) - Math.sin(s * Math.PI) * 120;
      const g = this.slips[k];
      g.style.opacity = s > 0 ? 1 : 0;
      const land = 1 + 0.08 * Math.sin(seg(t, it.at + 0.7, it.at + 0.9) * Math.PI);
      g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + (it.rot * e).toFixed(1) + ') scale(' + (lerp(0.4, 1, e) * land).toFixed(3) + ')');
    });
    const pulse = 1 + 0.04 * Math.sin(t * 6) * seg(t, 0.8, 1.4);
    this.ai.setAttribute('transform', 'translate(' + src[0] + ' ' + src[1] + ') scale(' + pulse.toFixed(3) + ')');
    // The kind tags land as the take names them: "code, analysis, answers".
    this.tags.forEach((g, i) => { const p = eo(seg(t, 2.7 + i * 0.5, 3.1 + i * 0.5)); g.style.opacity = p; g.style.transform = 'translate(calc(-100% + ' + lerp(20, 0, p) + 'px), 0)'; });
    // Generated races ahead; read crawls.
    this.meter.style.opacity = eo(seg(t, 2.2, 2.7));
    this.gen.style.transform = 'scaleX(' + lerp(0.08, 1, ei(seg(t, 2.5, 8.6))).toFixed(3) + ')';
    this.read.style.transform = 'scaleX(' + lerp(0.06, 0.16, seg(t, 2.5, 10)).toFixed(3) + ')';
  },
});
