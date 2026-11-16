// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('constitution', {
  init(kit) {
    kit.css('.constitution-c { left:880px; top:160px; width:520px; height:660px; box-sizing:border-box; padding:24px 26px; border-color:var(--main); border-width:3px; box-shadow:0 16px 34px rgba(0,0,0,.09) }' +
      '.constitution-c h4 { margin:0 0 12px; font-size:22px; font-weight:600; letter-spacing:0.1em; color:var(--mute) }' +
      '.constitution-r { display:flex; gap:12px; align-items:center; padding:10px 0; border-top:2px solid var(--hair); font-size:22px; line-height:1.25 }' +
      '.constitution-r i { flex:none; font-style:normal; font-size:15px; font-weight:700; letter-spacing:0.06em; padding:4px 9px; border-radius:6px; background:var(--hair); color:var(--second) } .constitution-r i.m { background:var(--accent); color:var(--ground) } .constitution-r i.q { background:var(--main); color:var(--ground) }' +
      '.constitution-pack { position:absolute; left:1460px; width:360px; box-sizing:border-box; padding:16px 20px; border-radius:16px; background:var(--tile); border:2px solid var(--hair); box-shadow:0 8px 18px rgba(0,0,0,.05) }' +
      '.constitution-pack b { display:block; font-size:25px; font-weight:600 } .constitution-pack span { font-size:19px; color:var(--mute) } .constitution-pack.on { border-color:var(--jade); border-width:3px }');
    // Your own constitution: your rules, plus the rules of the packs you adopt. Real rules from Sensei's bundled packs.
    const own = [['Use the repository pattern', 'R'], ['Small, single-purpose changes', 'R']];
    const add = [['No secrets in source', 'M'], ['Never log tokens or PII', 'M'], ['Write the failing test first', 'Q'], ['Never merge on red', 'Q'], ['Reuse before writing something new', 'R']];
    const tag = (k) => '<i class="' + (k === 'M' ? 'm' : k === 'Q' ? 'q' : '') + '">' + (k === 'M' ? 'MANDATORY' : k === 'Q' ? 'REQUIRED' : 'RECOMMENDED') + '</i>';
    const P = [['Security baseline', 'No secrets · never log PII · validate input'], ['TDD discipline', 'Test first · never merge on red'], ['Ponytail', 'Minimal solution · reuse first'], ['Compliance baseline', 'Data minimisation · encryption · audit']];
    kit.stage.append(kit.h('<div class="ground"><div class="cam constitution-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('constitution-bg') + '</svg>' +
      '<div class="card constitution-c"><h4>YOUR CONSTITUTION</h4>' + own.map(([s, k]) => '<div class="constitution-r">' + tag(k) + s + '</div>').join('') +
      add.map(([s, k]) => '<div class="constitution-r constitution-add">' + tag(k) + s + '</div>').join('') + '</div>' +
      P.map(([b, s], i) => '<div class="constitution-pack" style="top:' + (190 + i * 150) + 'px"><b>' + b + '</b><span>' + s + '</span></div>').join('') + '</div>' +
      W.head('constitution-head', 'Your rules', 'Start with your own constitution.', 'Even solo, Sensei follows rules you set. Adopt proven packs to add more.', 'left:110px;top:300px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.constitution-cam'), head: q('.constitution-head'), c: q('.constitution-c'), own: all('.constitution-r:not(.constitution-add)'), add: all('.constitution-add'), packs: all('.constitution-pack') });
    W.portrait(kit, { hoist: ['.constitution-head'], frame: [620, 1080], crop: [865, 140, 970, 700], css: '.constitution-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 12.5, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    W.fade(this.c, t, 0.6, this.K);
    this.own.forEach((r, i) => W.fade(r, t, 1.2 + i * 0.3, this.K, 0.4, 8));
    this.packs.forEach((p, i) => W.fade(p, t, 3.0 + i * 0.3, this.K));
    // Adopting: Security (2 rules), TDD (2), Ponytail (1) light up in turn and their rules join.
    const adopt = [5.4, 7.0, 8.6], rules = [[0, 1], [2, 3], [4]];
    this.packs.forEach((p, i) => p.classList.toggle('on', i < 3 && t >= adopt[i]));
    rules.forEach((ix, k) => ix.forEach((j, n) => W.fade(this.add[j], t, adopt[k] + 0.3 + n * 0.25, this.K, 0.4, 8)));
  },
});
