// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('hook', {
  init(kit) {
    kit.css('.hook-term { left:880px; top:170px; width:560px; height:620px; box-sizing:border-box; padding:22px 24px; background:var(--second); border-color:var(--second); box-shadow:0 16px 34px rgba(0,0,0,.14); font-family:var(--mono); font-size:21px; line-height:1.55; color:var(--ground) }' +
      '.hook-term p { margin:0; white-space:nowrap } .hook-term p.c { color:var(--mint) } .hook-term p.m { color:var(--wire) }' +
      '.hook-file { position:absolute; width:250px; height:150px; box-sizing:border-box; padding:16px 18px; border-radius:14px; background:var(--tile); border:2px solid var(--hair); box-shadow:0 10px 22px rgba(0,0,0,.07); font-family:var(--mono); font-size:19px; color:var(--mute) }');
    const L = [['c', '$ grep -rn "rateLimit" .'], ['', 'src/auth/limits.ts:12'], ['', 'src/api/login.ts:48'], ['', 'src/legacy/throttle.js:7'], ['', 'test/limits.spec.ts:3'],
      ['c', '$ cat src/auth/limits.ts'], ['m', '… 412 lines'], ['c', '$ cat src/api/login.ts'], ['m', '… 655 lines'], ['c', '$ cat src/legacy/throttle.js'], ['m', '… 298 lines'], ['c', '$ grep -rn "limiter" .']];
    const F = ['auth/limits.ts', 'api/login.ts', 'legacy/throttle.js', 'auth/session.ts', 'api/routes.ts'];
    kit.stage.append(kit.h('<div class="ground"><div class="cam hook-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('hook-bg') + '</svg>' +
      '<div class="card hook-term">' + L.map(([c, s]) => '<p class="' + c + '">' + s + '</p>').join('') + '</div>' +
      F.map((f, i) => '<div class="hook-file" style="left:' + (1480 + (i % 2) * 40) + 'px;top:' + (200 + i * 100) + 'px">' + f + '</div>').join('') + '</div>' +
      W.head('hook-head', 'Context', 'How well does your assistant know your code?', 'Without a map, it searches, opens and guesses.', 'left:110px;top:300px;width:700px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.hook-cam'), head: q('.hook-head'), term: q('.hook-term'), lines: all('.hook-term p'), files: all('.hook-file') });
    W.portrait(kit, { hoist: ['.hook-head'], frame: [640, 1000], crop: [870, 160, 960, 650], css: '.hook-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 9, 1, 1.03, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    W.fade(this.term, t, 0.4, this.K);
    this.lines.forEach((l, i) => { l.style.opacity = eo(seg(t, 1.0 + i * 0.42, 1.15 + i * 0.42)); });
    // Each file the assistant opens lands on the pile.
    this.files.forEach((f, i) => { const at = 3.4 + i * 0.8, p = seg(t, at, at + 0.4); f.style.opacity = eo(p); f.style.transform = 'translateY(' + lerp(-30, 0, eob(p, 1.4)).toFixed(1) + 'px) rotate(' + ((i % 2 ? 1 : -1) * (2 + i)).toFixed(1) + 'deg)'; });
  },
});
