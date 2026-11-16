// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('local', {
  init(kit) {
    kit.css('.local-lab { position:absolute; left:930px; top:186px; font-size:24px; font-weight:600; letter-spacing:0.1em; color:var(--jade) }' +
      '.local-ev { left:960px; top:270px; width:600px; box-sizing:border-box; padding:22px 26px; font-family:var(--mono); font-size:24px; line-height:1.7; box-shadow:0 12px 26px rgba(0,0,0,.06) }' +
      '.local-ev span { color:var(--mute) } .local-sec { position:relative; display:inline-block } .local-sec s { text-decoration:none }' +
      '.local-sec u { position:absolute; inset:2px -4px; border-radius:6px; background:var(--second); transform-origin:0 50% }' +
      '.local-red { left:1260px; top:560px } .local-db { position:absolute; left:960px; top:640px; display:flex; gap:14px }' +
      '.local-db span { padding:10px 20px; border-radius:12px; background:var(--tile); border:2px solid var(--hair); font-size:24px; font-weight:500 }');
    // The machine boundary. Captured events are stored inside it; a secret in one is blacked out as it is captured.
    kit.stage.append(kit.h('<div class="ground"><div class="cam local-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('local-bg') +
      '<rect class="local-box" pathLength="1" x="900" y="160" width="720" height="600" rx="34" style="fill:color-mix(in srgb, var(--jade) 5%, transparent);stroke:var(--jade);stroke-width:5"/>' +
      '<g class="local-cloud"><path d="M1700 330 q-6 -44 40 -46 q16 -36 60 -20 q40 -6 40 34 q30 8 22 40 h-150 q-26 -2 -12 -8 z" style="fill:var(--tile);stroke:var(--wire);stroke-width:4"/>' +
      '<path class="local-try" pathLength="1" d="M1620 420 Q1680 400 1730 350" style="fill:none;stroke:var(--wire);stroke-width:4;stroke-dasharray:8 8"/>' +
      '<g transform="translate(1676 392) scale(0.7)">' + W.cross('local-x') + '</g></g></svg>' +
      '<span class="local-lab">YOUR MACHINE</span>' +
      '<div class="card local-ev"><span>event</span> tool_result<br><span>tool</span> Bash<br><span>output</span> OPENAI_KEY=<span class="local-sec"><s>sk-live-9f2c…</s><u></u></span></div>' +
      '<span class="tag ok local-red">Redacted at capture</span>' +
      '<div class="local-db"><span>Events</span><span>Sessions</span><span>Graph</span><span>Usage</span></div></div>' +
      W.head('local-head', 'Local first', 'It stays on your machine.', 'Captured work is stored locally, and secrets are blacked out the moment they’re captured.', 'left:110px;top:300px;width:700px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.local-cam'), head: q('.local-head'), box: q('.local-box'), lab: q('.local-lab'), ev: q('.local-ev'), bar: q('.local-sec u'), red: q('.local-red'),
      db: all('.local-db span'), cloud: q('.local-cloud'), tr: q('.local-try'), x: q('.local-x') });
    W.portrait(kit, { hoist: ['.local-head'], frame: [640, 1000], crop: [880, 140, 1000, 640], css: '.local-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 12, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    W.draw(this.box, t, 0.6, 1.8, this.K); this.lab.style.opacity = eo(seg(t, 1.4, 1.8));
    this.db.forEach((d, i) => W.fade(d, t, 2.0 + i * 0.25, this.K));
    W.fade(this.ev, t, 3.4, this.K);
    // On "blacked out": the key is covered.
    this.bar.style.transform = 'scaleX(' + eio(seg(t, 5.6, 6.2)).toFixed(3) + ')';
    W.pop(this.red, t, 6.3, this.K, 'translate(-50%,0)');
    // Nothing goes out on its own.
    this.cloud.style.opacity = eo(seg(t, 7.6, 8.0));
    W.draw(this.tr, t, 7.8, 8.6, this.K);
    W.pop(this.x, t, 8.6, this.K); this.x.style.transformBox = 'fill-box'; this.x.style.transformOrigin = 'center';
  },
});
