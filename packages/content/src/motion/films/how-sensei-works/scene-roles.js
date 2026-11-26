// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('roles', {
  init(kit) {
    kit.css('.roles-col { position:absolute; top:160px; width:455px; height:670px; box-sizing:border-box; padding:22px 24px; border-radius:20px; background:var(--tile); box-shadow:0 12px 26px rgba(0,0,0,.06) }' +
      '.roles-col h3 { margin:0; display:flex; align-items:center; gap:12px; font-family:var(--sans); font-weight:600; font-size:36px } .roles-col h3 b { font-family:var(--serif, serif); font-weight:400; font-size:34px }' +
      '.roles-col h4 { margin:4px 0 12px; font-size:19px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--mute) }' +
      '.roles-i { display:flex; gap:12px; align-items:flex-start; padding:11px 0; border-top:2px solid var(--hair); font-size:22px; line-height:1.3 } .roles-i i { flex:none; width:12px; height:12px; margin-top:8px; border-radius:50% }');
    const S = ['Watches your sessions and git history', 'Maps the code and checks docs against it', 'Learns from your corrections', 'Resolves the rules for each session', 'Gives your assistant context and guidance', 'Works fully on its own, without a dōjō'];
    const D = ['Shares rules and lessons across people', 'Maintainers triage and approve', 'Rules for the team, workspaces and repos', 'Upgrades reach every member', 'Your inbox for runs away from the keyboard', 'Never sees your code or transcripts'];
    const col = (x, k, tone, h, sub, items, cls) => '<div class="roles-col ' + cls + '" style="left:' + x + 'px;border:3px solid ' + tone + '"><h3><b style="color:' + tone + '">' + k + '</b>' + h + '</h3><h4>' + sub + '</h4>' +
      items.map((s) => '<div class="roles-i"><i style="background:' + tone + '"></i>' + s + '</div>').join('') + '</div>';
    kit.stage.append(kit.h('<div class="ground"><div class="cam roles-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('roles-bg') + '</svg>' +
      col(880, '観', 'var(--accent)', 'Sensei', 'On your machine · for you', S, 'roles-s') + col(1365, '結', 'var(--jade)', 'Dōjō', 'Hosted · for your team', D, 'roles-d') + '</div>' +
      W.head('roles-head', 'Who does what', 'Sensei works the code. Your team keeps the lessons.', 'One runs beside you; the other connects your team. The dōjō is optional.', 'left:110px;top:280px;width:700px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.roles-cam'), head: q('.roles-head'), s: q('.roles-s'), d: q('.roles-d'), si: all('.roles-s .roles-i'), di: all('.roles-d .roles-i') });
    W.portrait(kit, { hoist: ['.roles-head'], frame: [600, 1120], crop: [860, 140, 980, 710], css: '.roles-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 13, 1, 1.015, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    W.fade(this.s, t, 0.8, this.K);
    this.si.forEach((r, i) => W.fade(r, t, 1.4 + i * 0.5, this.K, 0.4, 8));
    W.fade(this.d, t, 5.0, this.K);
    this.di.forEach((r, i) => W.fade(r, t, 5.6 + i * 0.5, this.K, 0.4, 8));
  },
});
