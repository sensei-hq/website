// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('triage', {
  init(kit) {
    kit.css('.triage-st { position:absolute; top:200px; width:170px; text-align:center; font-size:22px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:var(--mute) }' +
      '.triage-st.on { color:var(--second) } .triage-k { position:absolute; width:170px; box-sizing:border-box; padding:12px 14px; border-radius:12px; background:var(--tile); border:2px solid var(--hair); font-size:21px; line-height:1.25; box-shadow:0 6px 14px rgba(0,0,0,.05) }' +
      '.triage-big { position:absolute; width:230px; box-sizing:border-box; padding:18px 20px; border-radius:16px; background:var(--tile); border:3px solid var(--main); font-size:26px; line-height:1.25; box-shadow:0 12px 26px rgba(0,0,0,.08) }' +
      '.triage-big b { display:block; font-size:16px; letter-spacing:0.1em; color:var(--mute); margin-bottom:6px } .triage-cnt { position:absolute; right:-14px; top:-14px; padding:4px 10px; border-radius:999px; background:var(--accent); color:var(--ground); font-size:18px; font-weight:700 }');
    // The dōjō pipeline: contributions from members accumulate into one candidate, a maintainer triages and approves it, and it is distributed.
    const X = [880, 1072, 1264, 1456, 1648];
    const st = ['Contribute', 'Accumulate', 'Triage', 'Approve', 'Distribute'];
    const items = ['Reuse the limiter', 'One rate limiter only', 'Don’t add a 2nd limiter', 'Reuse auth/limits'];
    kit.stage.append(kit.h('<div class="ground"><div class="cam triage-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('triage-bg') +
      '<line x1="900" x2="1800" y1="270" y2="270" style="stroke:var(--hair);stroke-width:4"/>' + X.map((x, i) => '<circle class="triage-dot" cx="' + (x + 85) + '" cy="270" r="12" style="fill:var(--tile);stroke:var(--main);stroke-width:4"/>').join('') + '</svg>' +
      st.map((s, i) => '<span class="triage-st" style="left:' + X[i] + 'px">' + s + '</span>').join('') +
      items.map((s) => '<div class="triage-k">' + s + '</div>').join('') +
      '<div class="triage-big"><b>CANDIDATE RULE</b>Reuse the existing rate limiter<span class="triage-cnt">×4</span></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="triage-ok" transform="translate(1541 640)">' + W.tick('') + '</g>' +
      [0, 1, 2, 3].map((k) => '<path class="triage-out" pathLength="1" d="M1733 600 Q1733 680 ' + (1650 + k * 56) + ' 752" style="fill:none;stroke:var(--jade);stroke-width:4;stroke-dasharray:1 1"/>' +
        '<circle class="triage-mem" cx="' + (1650 + k * 56) + '" cy="776" r="20" style="fill:var(--ground);stroke:var(--jade);stroke-width:4"/>').join('') + '</svg>' +
      '<span class="tag triage-who" style="left:1541px;top:690px">Maintainer</span></div>' +
      W.head('triage-head', 'The dōjō', 'The team decides what becomes a rule.', 'Contributions gather; maintainers triage and approve; then it goes out.', 'left:110px;top:300px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, X, cam: q('.triage-cam'), head: q('.triage-head'), st: all('.triage-st'), dots: all('.triage-dot'), items: all('.triage-k'), big: q('.triage-big'), cnt: q('.triage-cnt'),
      ok: q('.triage-ok'), outs: all('.triage-out'), mems: all('.triage-mem'), who: q('.triage-who') });
    W.portrait(kit, { hoist: ['.triage-head'], frame: [640, 1000], crop: [845, 170, 1020, 640], css: '.triage-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 12.5, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    const at = [1.0, 3.6, 5.6, 7.4, 9.0];
    this.st.forEach((s, i) => { W.fade(s, t, 0.6 + i * 0.12, this.K, 0.4, 8); s.classList.toggle('on', t >= at[i]); });
    this.dots.forEach((d, i) => { d.style.opacity = eo(seg(t, 0.6 + i * 0.12, 1.0 + i * 0.12)); d.style.fill = t >= at[i] ? 'var(--main)' : 'var(--tile)'; });
    // Contributions arrive in the first column, then slide together into one candidate.
    const g = eio(seg(t, at[1], at[1] + 0.9));
    this.items.forEach((k, i) => {
      k.style.left = lerp(this.X[0] + 10, this.X[1] + 30, g).toFixed(1) + 'px';
      k.style.top = lerp(330 + i * 92, 470, g).toFixed(1) + 'px';
      k.style.opacity = (eo(seg(t, at[0] + i * 0.4, at[0] + 0.4 + i * 0.4)) * (1 - eo(seg(t, at[1] + 0.7, at[1] + 1.0)))).toFixed(3);
    });
    // The candidate moves stage by stage.
    const stage = t < at[2] ? 1 : t < at[3] ? 2 : t < at[4] ? 3 : 4, prev = Math.max(1, stage - 1), sp = eio(seg(t, at[stage] || 0, (at[stage] || 0) + 0.7));
    const x = stage === 1 ? this.X[1] - 30 : lerp(this.X[prev] - 30, this.X[stage] - 30, sp);
    this.big.style.left = x.toFixed(1) + 'px'; this.big.style.top = '440px';
    W.fade(this.big, t, at[1] + 0.7, this.K);
    this.big.style.borderColor = t >= at[3] + 0.6 ? 'var(--jade)' : 'var(--main)';
    W.pop(this.cnt, t, at[1] + 1.0, this.K);
    W.pop(this.ok, t, at[3] + 0.8, this.K); this.ok.style.transformBox = 'fill-box'; this.ok.style.transformOrigin = 'center';
    this.ok.style.opacity = (eo(seg(t, at[3] + 0.8, at[3] + 1.1)) * (1 - eo(seg(t, at[4], at[4] + 0.3)))).toFixed(3);
    this.who.style.opacity = (eo(seg(t, at[3] + 0.4, at[3] + 0.8)) * (1 - eo(seg(t, at[4], at[4] + 0.3)))).toFixed(3); this.who.style.transform = 'translate(-50%,0)';
    this.outs.forEach((o, k) => W.draw(o, t, at[4] + 0.8 + k * 0.15, at[4] + 1.6 + k * 0.15, this.K));
    this.mems.forEach((m, k) => { m.style.opacity = eo(seg(t, at[4] + 1.4 + k * 0.15, at[4] + 1.7 + k * 0.15)); });
  },
});
