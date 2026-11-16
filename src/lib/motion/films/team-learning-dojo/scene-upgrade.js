// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('upgrade', {
  init(kit) {
    kit.css('.upgrade-card { position:absolute; left:930px; top:250px; width:560px; box-sizing:border-box; padding:22px 26px; border-radius:18px; background:var(--ground); border:3px solid var(--jade) }' +
      '.upgrade-card h4 { margin:0 0 6px; font-size:20px; font-weight:600; letter-spacing:0.12em; color:var(--jade) } .upgrade-card p { margin:0; font-family:var(--display); font-size:34px; line-height:1.2 }' +
      '.upgrade-card small { display:block; margin-top:10px; font-size:20px; color:var(--mute) } .upgrade-acts { display:flex; gap:10px; margin-top:16px }' +
      '.upgrade-acts span { padding:9px 20px; border-radius:999px; font-size:22px; font-weight:600; border:2px solid var(--hair) } .upgrade-acts span.a { background:var(--main); color:var(--ground); border-color:var(--main) }' +
      '.upgrade-con { position:absolute; left:930px; top:560px; width:840px; box-sizing:border-box; padding:16px 22px; border-radius:16px; background:var(--ground); border:2px solid var(--hair) }' +
      '.upgrade-con h4 { margin:0 0 8px; font-size:19px; font-weight:600; letter-spacing:0.1em; color:var(--mute) } .upgrade-con div { padding:8px 0; border-top:2px solid var(--hair); font-size:22px }' +
      '.upgrade-new { color:var(--jade); font-weight:600 }');
    kit.stage.append(kit.h('<div class="ground"><div class="cam upgrade-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('upgrade-bg') + '</svg>' +
      W.win('upgrade-win', 880, 160, 940, 640, 'Upgrades') +
      '<div class="upgrade-card"><h4>NEW FROM YOUR DŌJŌ</h4><p>Reuse the existing rate limiter.</p><small>Approved by a maintainer · seen in 4 members’ sessions</small>' +
      '<div class="upgrade-acts"><span class="a">Apply</span><span>Mute</span><span>Pin</span></div></div>' +
      '<div class="upgrade-con"><h4>YOUR CONSTITUTION</h4><div>No secrets in source</div><div>Write the failing test first</div><div class="upgrade-new">Reuse the existing rate limiter</div></div>' + '</div>' +
      W.head('upgrade-head', 'Upgrades', 'It comes back as an upgrade.', 'Every member sees it, and chooses: apply, mute or pin.', 'left:110px;top:320px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.upgrade-cam'), head: q('.upgrade-head'), win: q('.upgrade-win'), card: q('.upgrade-card'), acts: all('.upgrade-acts span'), con: q('.upgrade-con'), rows: all('.upgrade-con div'), nw: q('.upgrade-new') });
    W.portrait(kit, { hoist: ['.upgrade-head'], frame: [620, 1060], crop: [870, 150, 960, 660], css: '.upgrade-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 11, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    W.fade(this.win, t, 0.5, this.K);
    W.pop(this.card, t, 1.4, this.K);
    this.acts.forEach((a, i) => W.fade(a, t, 3.0 + i * 0.2, this.K, 0.35, 8));
    W.fade(this.con, t, 4.4, this.K);
    this.rows.forEach((r, i) => { if (i < 2) W.fade(r, t, 4.8 + i * 0.2, this.K, 0.35, 8); });
    // Apply pressed: the rule joins your constitution.
    const press = t > 6.2 && t < 6.5; this.acts[0].style.transform = 'scale(' + (press ? 0.92 : 1) + ')';
    if (t > 6.4) this.acts[0].style.background = 'var(--jade)', this.acts[0].style.borderColor = 'var(--jade)';
    else this.acts[0].style.background = '', this.acts[0].style.borderColor = '';
    W.fade(this.nw, t, 6.6, this.K, 0.5, 10);
  },
});
