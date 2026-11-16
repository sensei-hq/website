// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('loop', {
  init(kit) {
    kit.css('.loop-n { position:absolute; transform:translate(-50%,-50%); width:250px; box-sizing:border-box; padding:20px 22px; text-align:center; border-radius:20px; background:var(--tile); border:2px solid var(--hair); box-shadow:0 12px 26px rgba(0,0,0,.07) }' +
      '.loop-n b { display:block; font-family:var(--display); font-weight:400; font-size:40px } .loop-n span { display:block; margin-top:4px; font-size:21px; color:var(--mute); line-height:1.3 }' +
      '.loop-n.on { border-color:var(--accent); border-width:3px } .loop-act { position:absolute; transform:translate(-50%,0); padding:10px 22px; border-radius:999px; font-size:24px; font-weight:600; background:var(--tile); border:2px solid var(--hair) }' +
      '.loop-act.a { background:var(--main); color:var(--ground); border-color:var(--main) }');
    // Observe → one finding → one action, and the action is observed in turn.
    const C = [[1350, 250], [1640, 600], [1060, 600]];
    const arc = (a, b, bend) => { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1]; return 'M' + a + ' Q' + (mx - dy * bend).toFixed(0) + ' ' + (my + dx * bend).toFixed(0) + ' ' + b; };
    const arcs = [[[1480, 290], [1640, 520]], [[1510, 650], [1190, 650]], [[1060, 520], [1220, 290]]].map(([a, b], i) =>
      '<path class="loop-a" pathLength="1" d="' + arc(a, b, -0.18) + '" style="fill:none;stroke:var(--wire);stroke-width:6;stroke-linecap:round" marker-end="url(#loop-head)"/>').join('');
    kit.stage.append(kit.h('<div class="ground"><div class="cam loop-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('loop-bg') +
      '<defs><marker id="loop-head" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" style="fill:var(--wire)"/></marker></defs>' + arcs + '</svg>' +
      '<div class="loop-n" style="left:' + C[0][0] + 'px;top:' + C[0][1] + 'px"><b>Observe</b><span>Sessions, git, the code</span></div>' +
      '<div class="loop-n" style="left:' + C[1][0] + 'px;top:' + C[1][1] + 'px"><b>Find</b><span>One finding, with evidence</span></div>' +
      '<div class="loop-n" style="left:' + C[2][0] + 'px;top:' + C[2][1] + 'px"><b>Act</b><span>One action, your call</span></div>' +
      '<span class="loop-act a" style="left:940px;top:740px">Apply</span><span class="loop-act" style="left:1080px;top:740px">Review</span><span class="loop-act" style="left:1230px;top:740px">Dismiss</span></div>' +
      W.head('loop-head', 'The loop', 'Observe, find, act.', 'Every part of Sensei works the same way: one finding, one action.', 'left:110px;top:320px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.loop-cam'), head: q('.loop-head'), nodes: all('.loop-n'), arcs: all('.loop-a'), acts: all('.loop-act') });
    W.portrait(kit, { hoist: ['.loop-head'], frame: [620, 1060], crop: [860, 140, 960, 680], css: '.loop-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 12, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    const at = [1.0, 3.0, 5.0];
    this.nodes.forEach((n, i) => { W.pop(n, t, at[i], this.K, 'translate(-50%,-50%)'); });
    this.arcs.forEach((a, i) => W.draw(a, t, at[i] + 0.6, at[i] + 1.6, this.K));
    this.acts.forEach((a, i) => W.fade(a, t, 5.8 + i * 0.2, this.K, 0.4, 10));
    // Then it keeps going round: the active step steps on every 1.4 s.
    const k = t < 7.6 ? -1 : Math.floor((t - 7.6) / 1.4) % 3;
    this.nodes.forEach((n, i) => n.classList.toggle('on', i === k));
  },
});
