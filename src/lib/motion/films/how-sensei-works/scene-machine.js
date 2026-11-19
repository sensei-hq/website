// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('machine', {
  init(kit) {
    kit.css('.machine-asst { position:absolute; left:930px; top:405px; width:300px; box-sizing:border-box; padding:18px 20px; border-radius:16px; background:var(--second); color:var(--ground); box-shadow:0 12px 26px rgba(0,0,0,.12) }' +
      '.machine-asst b { display:block; font-size:25px; font-weight:600 } .machine-asst span { display:block; margin-top:6px; font-size:19px; line-height:1.35; color:var(--wire) }' +
      '.machine-lab { position:absolute; font-size:18px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--mute) } .machine-lock { position:absolute; left:1150px; top:752px; transform:translate(-50%,0) }');
    // The app and what it wraps; the assistant you already use talks to it through hooks and MCP.
    kit.stage.append(kit.h('<div class="ground"><div class="cam machine-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('machine-bg') +
      '<path class="machine-w1" pathLength="1" d="M1230 445 H1340" style="fill:none;stroke:var(--accent);stroke-width:5;stroke-linecap:round"/><path class="machine-w2" pathLength="1" d="M1230 497 H1340" style="fill:none;stroke:var(--accent);stroke-width:5;stroke-linecap:round;stroke-dasharray:10 9"/></svg>' +
      W.zone('machine-z', 880, 180, 950, 640, 'Your machine', '机', 'var(--main)') +
      '<div class="machine-asst"><b>Your assistant</b><span>Claude Code, Cursor, Zed and others</span></div>' +
      '<span class="machine-lab machine-l1" style="left:1246px;top:418px">Hooks</span><span class="machine-lab machine-l2" style="left:1246px;top:504px">MCP</span>' +
      W.zone('machine-app', 1340, 220, 460, 500, 'Sensei app', '観', 'var(--accent)') +
      W.box('machine-b', 1365, 260, 410, 0, '令', 'CLI', 'sensei run, from the terminal', 'var(--soft)') +
      W.box('machine-b', 1365, 370, 410, 0, '具', 'MCP servers', 'Tools your assistant calls', 'var(--soft)') +
      W.box('machine-b', 1365, 480, 410, 0, '常', 'Daemon', 'Always on: watches and analyses', 'var(--soft)') +
      W.box('machine-b', 1365, 590, 410, 0, '蔵', 'Local Postgres', 'Everything it learns, stored here', 'var(--soft)') +
      '<span class="tag ok machine-lock">Your code and sessions stay on this machine</span></div>' +
      W.head('machine-head', 'On your machine', 'Sensei runs where you work.', 'A desktop app around a CLI, the tools your assistant calls, an always-on daemon and a local database.', 'left:110px;top:300px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.machine-cam'), head: q('.machine-head'), z: q('.machine-z'), app: q('.machine-app'), bs: all('.machine-b'), asst: q('.machine-asst'),
      w: [q('.machine-w1'), q('.machine-w2')], labs: [q('.machine-l1'), q('.machine-l2')], lock: q('.machine-lock') });
    W.portrait(kit, { hoist: ['.machine-head'], frame: [620, 1000], crop: [860, 150, 990, 690], css: '.machine-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 12.5, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    W.fade(this.z, t, 0.6, this.K); W.fade(this.app, t, 1.0, this.K);
    this.bs.forEach((b, i) => W.fade(b, t, 1.6 + i * 0.9, this.K));
    W.fade(this.asst, t, 5.6, this.K);
    this.w.forEach((w, i) => W.draw(w, t, 6.2 + i * 0.4, 6.8 + i * 0.4, this.K));
    this.labs.forEach((l, i) => W.fade(l, t, 6.4 + i * 0.4, this.K, 0.35, 6));
    W.pop(this.lock, t, 8.4, this.K, 'translate(-50%,0)');
  },
});
