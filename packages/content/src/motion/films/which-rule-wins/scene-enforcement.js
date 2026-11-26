// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('enforcement', {
  init(kit) {
    kit.css('.enforcement-step { position:absolute; left:880px; width:330px; height:96px; box-sizing:border-box; display:flex; flex-direction:column; justify-content:center; padding:0 22px; border-radius:14px; color:var(--ground) }' +
      '.enforcement-step b { font-size:28px; font-weight:600 } .enforcement-step span { font-size:19px; opacity:.85 }' +
      '.enforcement-win { left:1740px; top:180px } .enforcement-flag { left:1610px; top:640px }');
    // The four tiers, strongest at the top, and the two rules from before placed on them.
    const T = [['Mandatory', 'Never overridden', 'var(--accent)', 'var(--ground)'], ['Required', 'Must be met', 'var(--main)', 'var(--ground)'], ['Recommended', 'Follow unless there’s a reason', 'var(--mute)', 'var(--ground)'], ['Advisory', 'Good to know', 'var(--hair)', 'var(--second)']];
    kit.stage.append(kit.h('<div class="ground"><div class="cam enforcement-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('enforcement-bg') +
      '<path class="enforcement-arrow" pathLength="1" d="M860 650 V230" style="fill:none;stroke:var(--wire);stroke-width:5;stroke-linecap:round"/><path d="M846 246 L860 226 L874 246" style="fill:none;stroke:var(--wire);stroke-width:5;stroke-linecap:round"/></svg>' +
      T.map(([b, s, bg, fg], i) => '<div class="enforcement-step" style="top:' + (200 + i * 116) + 'px;background:' + bg + ';color:' + fg + '"><b>' + b + '</b><span>' + s + '</span></div>').join('') +
      W.rule('enforcement-a', 'Never log tokens or PII, even at debug level.', 'Dōjō', 'mandatory', 'left:1250px;top:200px;width:560px') +
      W.rule('enforcement-b', 'Log full request bodies while debugging the login flow.', 'Repository', 'recommended', 'left:1250px;top:432px;width:560px') +
      '<span class="tag ok enforcement-win">Wins</span><span class="tag hot enforcement-flag">Flagged: conflicts with a mandatory rule</span></div>' +
      W.head('enforcement-head', 'Rule one', 'The stronger rule wins.', 'Mandatory beats required beats recommended beats advisory, and a mandatory rule is never overridden, however close the other rule is.', 'left:110px;top:280px;width:700px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.enforcement-cam'), head: q('.enforcement-head'), steps: all('.enforcement-step'), arrow: q('.enforcement-arrow'), a: q('.enforcement-a'), b: q('.enforcement-b'), win: q('.enforcement-win'), flag: q('.enforcement-flag') });
    W.portrait(kit, { hoist: ['.enforcement-head'], frame: [640, 1000], crop: [840, 170, 990, 560], css: '.enforcement-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 12.5, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.steps.forEach((s, i) => W.fade(s, t, 1.0 + i * 0.4, this.K));
    W.draw(this.arrow, t, 1.0, 2.6, this.K);
    W.fade(this.a, t, 3.6, this.K); W.fade(this.b, t, 4.2, this.K);
    // On "never overridden": the mandatory rule holds, the other is flagged and greys out.
    W.pop(this.win, t, 6.6, this.K, 'translate(-50%,0)');
    this.a.style.borderColor = t > 6.6 ? 'var(--jade)' : 'var(--hair)'; this.a.style.borderWidth = t > 6.6 ? '3px' : '2px';
    this.b.style.opacity = (eo(seg(t, 4.2, 4.7)) * lerp(1, 0.5, eo(seg(t, 7.4, 8.0)))).toFixed(3);
    W.pop(this.flag, t, 7.6, this.K, 'translate(-50%,0)');
  },
});
