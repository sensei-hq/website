// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('data', {
  init(kit) {
    kit.css('.data-prompt { left:110px; top:480px; width:400px; padding:22px 26px; display:flex; flex-direction:column; gap:14px }' +
      '.data-prompt h4 { margin:0; font-size:22px; font-weight:600; letter-spacing:0.12em; color:var(--mute) } .data-prompt > p { margin:0; font-size:28px; line-height:1.35 }' +
      '.data-chip { position:relative; align-self:flex-start; padding:8px 14px; border-radius:10px; font-size:26px; font-weight:600; color:var(--accent); background:color-mix(in srgb, var(--accent) 10%, transparent) }' +
      '.data-redact { position:absolute; inset:0; border-radius:10px; background:var(--second); transform-origin:0 50% }' +
      '.data-scan { position:absolute; left:96px; top:462px; width:432px; height:8px; border-radius:4px; background:var(--jade) }');
    const AI = [700, 760], S = [1060, 760], G = [880, 760];
    Object.assign(this, { AI, S, G });
    kit.stage.append(kit.h('<div class="ground"><div class="cam data-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('data-bg') +
      W.wire('data-w1', [560, 700], [600, 740], [AI[0] - 80, AI[1]]) + W.wire('data-w2', [AI[0] + 80, AI[1]], [880, 730], [S[0] - 80, S[1]]) +
      '<g class="data-out"><rect x="-36" y="-26" width="72" height="52" rx="8" style="fill:var(--tile);stroke:var(--main);stroke-width:3"/><path d="M-20 -10 H22 M-20 2 H16 M-20 14 H8" style="stroke:var(--hair);stroke-width:5;stroke-linecap:round"/></g>' +
      '<g transform="translate(' + AI[0] + ' ' + AI[1] + ')">' + W.node('data-ai', 'spark', 'ink') + '</g>' +
      '<g transform="translate(' + S[0] + ' ' + S[1] + ')">' + W.node('data-sys', 'db', 'ink') + '</g>' +
      '<g class="data-g">' + W.shield('data-shield') + '</g></svg>' +
      '<div class="card data-prompt"><h4>PROMPT</h4><p>Summarise these notes for the client.</p>' +
        '<span class="data-chip">Internal API key<i class="data-redact"></i></span><span class="data-chip">Confidential salary data<i class="data-redact"></i></span></div>' +
      '<div class="data-scan"></div>' +
      '<div class="tag ok data-t0" style="left:700px;top:560px">Data-loss prevention</div>' +
      '<div class="tag data-t1" style="left:' + AI[0] + 'px;top:' + (AI[1] + 96) + 'px">Assistant</div>' +
      '<div class="tag data-t2" style="left:' + S[0] + 'px;top:' + (S[1] + 96) + 'px">Other systems</div>' +
      '<div class="tag ok data-t3" style="left:' + G[0] + 'px;top:' + (G[1] - 150) + 'px">Output check</div></div>' +
      W.head('data-head', 'Sensitive data · Hidden context · Output handling', 'Guard what goes in and what comes out.', 'Secrets slip into prompts, and output flows on unchecked.', 'left:110px;top:80px;width:1080px') +
      W.checks('data-checks', ['Classify data before it reaches AI', 'Keep secrets out of prompts', 'Assume system prompts can leak', 'Check output before other systems use it'], 'left:1240px;top:400px;width:580px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.data-cam'), head: q('.data-head'), checks: q('.data-checks'), prompt: q('.data-prompt'), chips: all('.data-chip'), reds: all('.data-redact'), scan: q('.data-scan'),
      w1: q('.data-w1'), w2: q('.data-w2'), out: q('.data-out'), g: q('.data-g'), t0: q('.data-t0'), t1: q('.data-t1'), t2: q('.data-t2'), t3: q('.data-t3') });
    W.portrait(kit, {"hoist": [".data-head", ".data-checks"], "frame": [620, 600], "crop": [90, 460, 1040, 470], "css": ".data-head{left:70px!important;right:auto!important;top:140px!important;bottom:auto!important;width:940px!important;max-width:none!important;}.data-checks{left:70px!important;right:auto!important;top:1260px!important;bottom:auto!important;width:940px!important;max-width:none!important} .chk{font-size:36px!important;padding:18px 24px!important}"});
  },
  render(t) {
    const { AI, S, G } = this;
    W.push(this.cam, t, 14, 1, 1.03, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    const p = eo(seg(t, 0.8, 1.6));
    this.prompt.style.opacity = p; this.prompt.style.transform = 'translateY(' + lerp(30, 0, p) + 'px)';
    [this.t1, this.t2].forEach((g, i) => { g.style.opacity = eo(seg(t, 0.8 + i * 0.2, 1.2 + i * 0.2)); });
    // The secrets in the prompt light up, then the scan passes and blacks them out, on "keep secrets out of prompts".
    this.chips.forEach((c, i) => { const h = seg(t, 3.2 + i * 0.4, 3.6 + i * 0.4); c.style.transform = 'scale(' + (1 + 0.05 * Math.sin(h * Math.PI)).toFixed(3) + ')'; });
    const sc = seg(t, 4.6, 6.2);
    this.scan.style.opacity = sc > 0 && sc < 1 ? 1 : 0;
    this.scan.style.transform = 'translateY(' + lerp(0, 330, eio(sc)).toFixed(1) + 'px)';
    this.reds.forEach((r, i) => { r.style.transform = 'scaleX(' + eo(seg(t, 5.2 + i * 0.4, 5.6 + i * 0.4)).toFixed(3) + ')'; });
    this.t0.style.opacity = eo(seg(t, 4.5, 4.9)); this.t0.style.transform = 'translate(-50%, ' + lerp(-12, 0, eo(seg(t, 4.5, 4.9))) + 'px)';
    // The cleaned prompt goes in; the answer comes out through an output check, on "check output before other systems".
    this.w1.style.strokeDasharray = '1'; this.w1.style.strokeDashoffset = 1 - eo(seg(t, 6.4, 7.0));
    this.w2.style.strokeDasharray = '1'; this.w2.style.strokeDashoffset = 1 - eo(seg(t, 8.6, 9.2));
    const g = eob(seg(t, 8.6, 9.1), 1.8);
    this.g.style.opacity = clamp01(g * 2);
    this.g.setAttribute('transform', 'translate(' + G[0] + ' ' + G[1] + ') scale(' + (lerp(0.4, 0.8, g)).toFixed(3) + ')');
    this.t3.style.opacity = eo(seg(t, 8.9, 9.3));
    const o = seg(t, 9.2, 11.2), op = W.qpt([AI[0] + 50, AI[1]], [880, 730], [S[0] - 50, S[1]], eio(o));
    const pause = o > 0.42 && o < 0.6 ? 1 : 0;
    this.out.style.opacity = o > 0 && o < 1 ? 1 : 0;
    this.out.setAttribute('transform', 'translate(' + op[0].toFixed(1) + ' ' + (op[1] - 6 * pause).toFixed(1) + ')');
    // Each guard lands as the take names it.
    W.showChecks(this.checks, t, 3.8, 2.6, this.K);
  },
});
