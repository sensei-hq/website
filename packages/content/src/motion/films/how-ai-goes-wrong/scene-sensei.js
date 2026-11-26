// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('sensei', {
  init(kit) {
    kit.css('.sensei-card { left:880px; top:150px; width:940px; height:500px; box-sizing:border-box; padding:24px 32px; box-shadow:0 14px 30px rgba(0,0,0,.07) }' +
      '.sensei-card h4 { margin:0 0 10px; font-size:24px; font-weight:600; letter-spacing:0.08em; color:var(--mute) } .sensei-note { position:absolute; right:32px; top:26px; font-size:20px; color:var(--mute) }' +
      '.sensei-row { display:flex; align-items:center; gap:20px; height:80px; border-top:2px solid var(--hair); font-size:29px }' +
      '.sensei-row b { flex:none; width:300px; font-weight:500 } .sensei-row i { flex:1; height:16px; border-radius:8px; background:var(--hair); position:relative; overflow:hidden }' +
      '.sensei-row i u { position:absolute; left:0; top:0; bottom:0; border-radius:8px; background:var(--main) } .sensei-row em { flex:none; width:90px; text-align:right; font-style:normal; font-family:var(--display); font-size:38px }' +
      '.sensei-row.sel { background:color-mix(in srgb, var(--accent) 7%, transparent) } .sensei-row.sel u { background:var(--accent) }' +
      '.sensei-ev { left:1010px; top:690px; width:810px; box-sizing:border-box; padding:22px 28px; border-color:var(--accent); box-shadow:0 14px 30px rgba(0,0,0,.08); font-size:27px; line-height:1.4 }' +
      '.sensei-ev h5 { margin:0 0 8px; font-size:22px; font-weight:600; letter-spacing:0.08em; color:var(--accent) } .sensei-ev p { margin:0 } .sensei-ev span { color:var(--mute) }');
    // One repository's last 30 days (illustrative). Open a number and the evidence is behind it.
    const M = [['Edit before read', 12], ['Shallow analysis', 8], ['Spec deviation', 15], ['Context pressure', 21], ['Duplication', 6]];
    const rows = M.map(([n, v]) => '<div class="sensei-row"><b>' + n + '</b><i><u data-v="' + v + '"></u></i><em><span class="sensei-v" data-v="' + v + '">0</span>%</em></div>').join('');
    kit.stage.append(kit.h('<div class="ground"><div class="cam sensei-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('sensei-bg') +
      '<path class="sensei-wire" pathLength="1" d="M950 461 Q950 700 1010 740" style="fill:none;stroke:var(--accent);stroke-width:4;stroke-dasharray:8 8"/></svg>' +
      '<div class="card sensei-card"><h4>AUTH-SERVICE · LAST 30 DAYS</h4><span class="sensei-note">Illustrative</span>' + rows + '</div>' +
      '<div class="card sensei-ev"><h5>EVIDENCE · SPEC DEVIATION</h5><p><span>Plan:</span> “Only touch the limiter.”</p><p><span>Action:</span> edited <code>auth/cache.ts</code></p></div></div>' +
      W.head('sensei-head', 'In Sensei', 'Named, counted, shown back.', 'Per repository, with the evidence behind each, so you can judge it yourself.', 'left:110px;top:300px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.sensei-cam'), head: q('.sensei-head'), card: q('.sensei-card'), rows: all('.sensei-row'), bars: all('.sensei-row u'), vals: all('.sensei-v'),
      ev: q('.sensei-ev'), wire: q('.sensei-wire') });
    W.portrait(kit, { hoist: ['.sensei-head'], frame: [640, 1080], crop: [870, 140, 960, 720], css: '.sensei-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 9, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.card.style.opacity = eo(seg(t, 0.4, 0.9));
    this.rows.forEach((r, i) => {
      const p = eio(seg(t, 1.0 + i * 0.35, 1.9 + i * 0.35)), v = +this.bars[i].dataset.v;
      this.bars[i].style.width = (v * 3.2 * p).toFixed(1) + '%';
      this.vals[i].textContent = Math.round(v * p);
      r.style.opacity = eo(seg(t, 0.8 + i * 0.35, 1.2 + i * 0.35));
      r.classList.toggle('sel', i === 2 && t > 4.4);
    });
    // Open the spec-deviation number: the plan quote against the action that left it.
    W.draw(this.wire, t, 4.6, 5.3, this.K);
    W.fade(this.ev, t, 5.2, this.K);
  },
});
