// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('hook', {
  init(kit) {
    kit.css('.hook-vs { position:absolute; left:1350px; top:470px; transform:translate(-50%,-50%); width:90px; height:90px; border-radius:50%; background:var(--second); color:var(--ground); font-family:var(--display); font-size:40px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 0 10px var(--board) }' +
      '.hook-q { position:absolute; left:1350px; top:690px; transform:translate(-50%,0); font-family:var(--display); font-size:46px; color:var(--second); white-space:nowrap }');
    // Two real rules that pull opposite ways in the same repository.
    kit.stage.append(kit.h('<div class="ground"><div class="cam hook-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('hook-bg') + '</svg>' +
      W.rule('hook-a', 'Never log tokens or PII, even at debug level.', 'Dōjō', 'mandatory', 'left:890px;top:260px;width:400px') +
      W.rule('hook-b', 'Log full request bodies while debugging the login flow.', 'Repository', 'recommended', 'left:1410px;top:330px;width:400px') +
      '<div class="hook-vs">vs</div><div class="hook-q">Which one does the AI follow?</div></div>' +
      W.head('hook-head', 'Governance', 'When two rules disagree, which wins?', 'Your team says one thing, this repository says another.', 'left:110px;top:300px;width:700px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    Object.assign(this, { K: kit, cam: q('.hook-cam'), head: q('.hook-head'), a: q('.hook-a'), b: q('.hook-b'), vs: q('.hook-vs'), qq: q('.hook-q') });
    W.portrait(kit, { hoist: ['.hook-head'], frame: [640, 980], crop: [870, 230, 960, 560], css: '.hook-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 12, 1, 1.03, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    // Timed to the voiceover: the team rule lands with its sentence, the repository rule with its,
    // the face-off on "when two rules disagree".
    const pa = seg(t, 1.0, 1.6), pb = seg(t, 4.2, 4.8);
    this.a.style.opacity = eo(pa); this.a.style.transform = 'translateX(' + lerp(-60, 0, eob(pa, 1.2)).toFixed(1) + 'px) rotate(-2deg)';
    this.b.style.opacity = eo(pb); this.b.style.transform = 'translateX(' + lerp(60, 0, eob(pb, 1.2)).toFixed(1) + 'px) rotate(2deg)';
    W.pop(this.vs, t, 8.2, this.K, 'translate(-50%,-50%)');
    W.fade(this.qq, t, 9.6, this.K); this.qq.style.transform += ' translateX(-50%)';
  },
});
