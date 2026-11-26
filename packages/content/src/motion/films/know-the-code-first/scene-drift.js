// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('drift', {
  init(kit) {
    kit.css('.drift-c { position:absolute; top:220px; width:430px; height:440px; box-sizing:border-box; padding:22px 24px; border-radius:18px; background:var(--tile); border:2px solid var(--hair); box-shadow:0 12px 26px rgba(0,0,0,.06) }' +
      '.drift-c h4 { margin:0 0 14px; font-family:var(--mono); font-size:22px; font-weight:400; color:var(--mute) } .drift-c p { margin:0 0 12px; font-size:24px; line-height:1.45 }' +
      '.drift-c code { font-family:var(--mono); font-size:22px; padding:2px 6px; border-radius:6px; background:var(--ground); border:2px solid var(--hair) } .drift-c code.bad { border-color:var(--accent); color:var(--accent) }' +
      '.drift-c pre { margin:0; font-family:var(--mono); font-size:21px; line-height:1.6; color:var(--soft); white-space:pre } .drift-c pre b { color:var(--second); font-weight:600 }' +
      '.drift-badge { position:absolute; left:1350px; top:720px; transform:translate(-50%,0); padding:14px 28px; border-radius:999px; background:var(--accent); color:var(--ground); font-size:30px; font-weight:600 }');
    kit.stage.append(kit.h('<div class="ground"><div class="cam drift-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('drift-bg') +
      '<path class="drift-link" pathLength="1" d="M1200 420 Q1300 360 1420 430" style="fill:none;stroke:var(--jade);stroke-width:5"/>' +
      '<g transform="translate(1310 386)"><g class="drift-x">' + W.cross('') + '</g></g></svg>' +
      '<div class="drift-c" style="left:880px"><h4>README.md</h4><p>To sign a user in, call <code class="drift-ref">LoginService.authenticate()</code> with their credentials.</p></div>' +
      '<div class="drift-c" style="left:1390px"><h4>login-service.ts</h4><pre>class <b>LoginService</b> {\n  <b class="drift-new">authenticateWithCredentials</b>(\n    user, password\n  ) { … }\n}</pre></div>' +
      '<div class="drift-badge">Doc drift: 3</div></div>' +
      W.head('drift-head', 'Doc drift', 'Catch the doc that’s gone stale.', 'Docs are checked against the live code, so a renamed method doesn’t mislead the next reader, or the assistant.', 'left:110px;top:300px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.drift-cam'), head: q('.drift-head'), cards: all('.drift-c'), ref: q('.drift-ref'), link: q('.drift-link'), x: q('.drift-x'), badge: q('.drift-badge') });
    W.portrait(kit, { hoist: ['.drift-head'], frame: [640, 1000], crop: [870, 200, 960, 600], css: '.drift-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 11.5, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.cards.forEach((c, i) => W.fade(c, t, 0.8 + i * 0.6, this.K));
    W.draw(this.link, t, 2.8, 3.6, this.K);
    // The name it points at isn't there any more: the link breaks.
    const br = t > 5.0;
    this.link.style.stroke = br ? 'var(--accent)' : 'var(--jade)'; this.link.style.strokeDasharray = br ? '10 10' : '1 1';
    this.ref.classList.toggle('bad', br);
    W.pop(this.x, t, 5.0, this.K); this.x.style.transformBox = 'fill-box'; this.x.style.transformOrigin = 'center';
    W.pop(this.badge, t, 6.4, this.K, 'translate(-50%,0)');
  },
});
