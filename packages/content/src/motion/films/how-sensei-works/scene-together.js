// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('together', {
  init(kit) {
    kit.css('.together-n { position:absolute; transform:translate(-50%,-50%); width:250px; box-sizing:border-box; padding:14px 16px; text-align:center; border-radius:16px; background:var(--tile); border:2px solid var(--hair); box-shadow:0 10px 22px rgba(0,0,0,.06) }' +
      '.together-n b { display:block; font-size:24px; font-weight:600 } .together-n span { display:block; margin-top:4px; font-size:18px; line-height:1.3; color:var(--mute) } .together-n.on { border-width:3px }' +
      '.together-mid { position:absolute; left:1350px; top:500px; transform:translate(-50%,-50%); width:300px; text-align:center; font-family:var(--display); font-size:30px; line-height:1.25 }');
    // The loop between the two, as five steps around a ring.
    const cx = 1350, cy = 500, rx = 360, ry = 270;
    const N = [['Sensei learns', 'From your sessions, on your machine', 'var(--accent)'], ['You share', 'Opt-in, previewed, anonymised', 'var(--accent)'], ['The dōjō consolidates', 'Triage and approval', 'var(--jade)'],
      ['An upgrade comes back', 'Apply, mute or pin', 'var(--jade)'], ['Sensei applies it', 'Loaded at the next session', 'var(--accent)']];
    this.P = N.map((_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; });
    let d = '';
    for (let a = 0; a <= 360; a += 4) { const r = (a - 90) * Math.PI / 180; d += (a ? ' L' : 'M') + (cx + rx * Math.cos(r)).toFixed(1) + ' ' + (cy + ry * Math.sin(r)).toFixed(1); }
    kit.stage.append(kit.h('<div class="ground"><div class="cam together-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('together-bg') +
      '<path class="together-ring" pathLength="1" d="' + d + '" style="fill:none;stroke:var(--wire);stroke-width:5"/><circle class="together-dot" r="13" style="fill:var(--accent);stroke:var(--ground);stroke-width:5"/></svg>' +
      N.map(([b, s, c], i) => '<div class="together-n" data-c="' + c + '" style="left:' + this.P[i][0].toFixed(0) + 'px;top:' + this.P[i][1].toFixed(0) + 'px"><b>' + b + '</b><span>' + s + '</span></div>').join('') +
      '<div class="together-mid">Every session, a little better, for everyone.</div></div>' +
      W.head('together-head', 'Together', 'What you learn alone, the team keeps.', 'Sensei learns locally; the dōjō turns it into shared practice; it comes back as rules.', 'left:110px;top:300px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.together-cam'), head: q('.together-head'), ring: q('.together-ring'), dot: q('.together-dot'), ns: all('.together-n'), mid: q('.together-mid') });
    W.portrait(kit, { hoist: ['.together-head'], frame: [600, 1120], crop: [850, 170, 1000, 660], css: '.together-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 12, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    W.draw(this.ring, t, 0.6, 2.0, this.K);
    // Each step lights as the dot reaches it; then the dot keeps circling.
    const f = t < 1.6 ? 0 : (t - 1.6) / 7.0, L = this.ring.getTotalLength(), pt = this.ring.getPointAtLength((f % 1) * L);
    this.dot.setAttribute('cx', pt.x.toFixed(1)); this.dot.setAttribute('cy', pt.y.toFixed(1)); this.dot.style.opacity = eo(seg(t, 1.4, 1.8));
    this.ns.forEach((n, i) => {
      W.pop(n, t, 1.6 + i * 1.4, this.K, 'translate(-50%,-50%)');
      const on = f % 1 >= i / 5 - 0.02 && f % 1 < (i + 1) / 5 - 0.02; n.classList.toggle('on', t > 1.6 && on); n.style.borderColor = on && t > 1.6 ? n.dataset.c : 'var(--hair)';
    });
    W.fade(this.mid, t, 8.8, this.K);
  },
});
