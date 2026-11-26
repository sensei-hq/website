// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('hook', {
  init(kit) {
    kit.css('.hook-dev { position:absolute; width:440px; height:150px; box-sizing:border-box; padding:22px 24px 0 130px; border-radius:18px; background:var(--tile); border:2px solid var(--hair); box-shadow:0 10px 22px rgba(0,0,0,.05) }' +
      '.hook-dev b { display:block; font-size:24px; font-weight:600; color:var(--mute) } .hook-dev span { display:inline-block; margin-top:10px; padding:10px 16px; border-radius:14px; border-bottom-right-radius:4px; background:var(--main); color:var(--ground); font-size:22px }' +
      '.hook-n { position:absolute; right:-16px; top:-16px; width:44px; height:44px; border-radius:50%; background:var(--accent); color:var(--ground); font-size:22px; font-weight:700; display:flex; align-items:center; justify-content:center; box-shadow:0 0 0 6px var(--board) }');
    // Four people, four assistants, the same correction typed four times.
    const D = [['Asha', 880, 200], ['Ben', 1380, 200], ['Chen', 880, 420], ['Dana', 1380, 420]];
    const face = (x, y) => '<circle cx="' + x + '" cy="' + y + '" r="40" style="fill:var(--ground);stroke:var(--main);stroke-width:4"/><circle cx="' + x + '" cy="' + (y - 8) + '" r="13" style="fill:var(--main)"/><path d="M' + (x - 22) + ' ' + (y + 26) + ' q22 -22 44 0" style="fill:var(--main)"/>';
    kit.stage.append(kit.h('<div class="ground"><div class="cam hook-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('hook-bg') + '</svg>' +
      D.map(([n, x, y], i) => '<div class="hook-dev" style="left:' + x + 'px;top:' + y + 'px"><b>' + n + '</b><span>Reuse the rate limiter.</span><i class="hook-n">' + (i + 1) + '</i></div>').join('') +
      '<svg class="art" viewBox="0 0 1920 1080">' + D.map(([, x, y]) => '<g class="hook-face">' + face(x + 66, y + 75) + '</g>').join('') + '</svg>' +
      '<span class="tag hot hook-tag" style="left:1350px;top:640px">Same lesson, four times</span></div>' +
      W.head('hook-head', 'Teams', 'Your team learns the same thing four times.', 'Each assistant is taught separately.', 'left:110px;top:300px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.hook-cam'), head: q('.hook-head'), devs: all('.hook-dev'), faces: all('.hook-face'), msgs: all('.hook-dev span'), ns: all('.hook-n'), tag: q('.hook-tag') });
    W.portrait(kit, { hoist: ['.hook-head'], frame: [640, 1000], crop: [860, 180, 980, 520], css: '.hook-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 9, 1, 1.03, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.devs.forEach((d, i) => { W.fade(d, t, 0.6 + i * 0.2, this.K); this.faces[i].style.opacity = eo(seg(t, 0.7 + i * 0.2, 1.1 + i * 0.2)); });
    this.msgs.forEach((m, i) => W.fade(m, t, 2.0 + i * 0.9, this.K, 0.4, 10));
    this.ns.forEach((n, i) => W.pop(n, t, 2.3 + i * 0.9, this.K));
    W.pop(this.tag, t, 6.0, this.K, 'translate(-50%,0)');
  },
});
