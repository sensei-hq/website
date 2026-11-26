// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('rules', {
  init(kit) {
    kit.css('.rules-chip { position:absolute; box-sizing:border-box; padding:12px 20px; border-radius:14px; font-size:24px; line-height:1.25; background:var(--tile); border:2px solid var(--accent); color:var(--second); white-space:nowrap; transform-origin:0 0; box-shadow:0 8px 18px rgba(0,0,0,.05) }' +
      '.rules-chip small { display:block; font-size:18px; font-weight:600; letter-spacing:0.06em; color:var(--mute) }' +
      '.rules-mem { left:1250px; width:400px; box-sizing:border-box; padding:24px 28px; display:flex; flex-direction:column; gap:12px; border-left:12px solid var(--jade); box-shadow:0 14px 30px rgba(0,0,0,.07) }' +
      '.rules-mem p { margin:0; font-size:30px; line-height:1.3; font-weight:500 } .rules-mem h5 { margin:0; font-size:20px; font-weight:600; letter-spacing:0.08em; color:var(--mute) }' +
      '.rules-st { align-self:flex-start; position:relative; height:38px; min-width:120px } .rules-st span { position:absolute; left:0; top:0; padding:6px 16px; border-radius:999px; font-size:22px; font-weight:600; white-space:nowrap }' +
      '.rules-st .a { background:var(--hair); color:var(--main) } .rules-st .b { background:var(--jade); color:var(--ground) }');
    // Corrections from different sessions, scattered; they gather by meaning into two groups.
    const C = [['No, use the repository pattern', 'Mon'], ['Use the repository, not raw SQL', 'Tue'], ['Again: repository pattern', 'Thu'],
      ['Too many comments', 'Mon'], ['Drop the line-by-line comments', 'Wed'], ['Comment only what isn’t obvious', 'Fri']];
    this.from = [[900, 150], [1300, 330], [960, 860], [1420, 140], [1010, 520], [1380, 760]];
    this.to = [[880, 200], [880, 300], [880, 400], [880, 610], [880, 710], [880, 810]].map(([x, y], i) => [x + (i % 3) * 12, y - 30]);
    const chips = C.map(([s, d], i) => '<div class="rules-chip" style="left:0;top:0"><small>SESSION · ' + d.toUpperCase() + '</small>' + s + '</div>').join('');
    const mems = [['Use the repository pattern for data access.', 230], ['Comment the why, not every line.', 640]].map(([s, top]) =>
      '<div class="card rules-mem" style="top:' + top + 'px"><h5>RULE</h5><p>' + s + '</p><div class="rules-st"><span class="a">proposed</span><span class="b">in use</span></div></div>').join('');
    this.N = [1790, 540];
    kit.stage.append(kit.h('<div class="ground"><div class="cam rules-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('rules-bg') +
      '<path class="rules-wire" pathLength="1" style="fill:none;stroke:var(--jade);stroke-width:6;stroke-linecap:round"/><path class="rules-wire" pathLength="1" style="fill:none;stroke:var(--jade);stroke-width:6;stroke-linecap:round"/>' +
      '<g class="rules-node" transform="translate(' + this.N[0] + ' ' + this.N[1] + ')">' + W.node('rules-ai', 'spark', 'ok', 130) + '</g></svg>' +
      chips + mems + '<span class="tag ok rules-tag" style="left:1790px;top:640px">Next session</span></div>' +
      W.head('rules-head', 'From repeats to rules', 'Repeats become rules.', 'The AI loads them at the start of the next session.', 'left:110px;top:330px;width:640px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.rules-cam'), head: q('.rules-head'), chips: all('.rules-chip'), mems: all('.rules-mem'), sts: all('.rules-st'),
      wires: all('.rules-wire'), node: q('.rules-node'), tag: q('.rules-tag') });
    this.ready = false;
    W.portrait(kit, { hoist: ['.rules-head'], frame: [560, 1300], crop: [880, 110, 1040, 860], css: '.rules-head{left:70px!important;top:140px!important;width:940px!important}' });
  },
  // Each wire runs from the middle of a rule card's right edge to the middle of the next-session tile's left edge.
  layout() {
    const nx = this.N[0] - 65, ny = this.N[1];
    this.mems.forEach((m, i) => {
      const x = m.offsetLeft + m.offsetWidth, y = m.offsetTop + m.offsetHeight / 2;
      this.wires[i].setAttribute('d', 'M' + x + ' ' + y + ' C' + (x + 50) + ' ' + y + ' ' + (nx - 50) + ' ' + ny + ' ' + nx + ' ' + ny);
    });
    this.ready = true;
  },
  render(t) {
    if (!this.ready) this.layout();
    W.push(this.cam, t, 12, 1, 1.025, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.chips.forEach((c, i) => {
      const a = seg(t, 0.8 + i * 0.3, 1.3 + i * 0.3), g = eio(seg(t, 3.0 + (i % 3) * 0.15, 4.4 + (i % 3) * 0.15)), f = this.from[i], e = this.to[i];
      c.style.opacity = (eo(a) * lerp(1, 0.45, eo(seg(t, 5.2, 6.0)))).toFixed(3);
      c.style.transform = 'translate(' + lerp(f[0], e[0], g).toFixed(1) + 'px,' + lerp(f[1], e[1], g).toFixed(1) + 'px) scale(' + lerp(1, 0.7, g).toFixed(3) + ') rotate(' + lerp((i % 2 ? 1.5 : -1.5), 0, g).toFixed(2) + 'deg)';
    });
    this.mems.forEach((m, i) => {
      const p = seg(t, 4.8 + i * 0.5, 5.4 + i * 0.5);
      m.style.opacity = eo(p);
      m.style.transform = 'translateX(' + lerp(-60, 0, eob(p, 1.3)).toFixed(1) + 'px)';
    });
    // Seen often enough, a candidate becomes a rule in use.
    this.sts.forEach((s, i) => { const p = eo(seg(t, 7.0 + i * 0.4, 7.4 + i * 0.4)); s.children[0].style.opacity = 1 - p; s.children[1].style.opacity = p; });
    const np = eob(seg(t, 7.8, 8.4), 1.7);
    this.node.style.opacity = clamp01(np * 2);
    this.node.setAttribute('transform', 'translate(' + this.N[0] + ' ' + this.N[1] + ') scale(' + lerp(0.5, 1, np).toFixed(3) + ')');
    this.wires.forEach((w, i) => { w.style.strokeDasharray = 1; w.style.strokeDashoffset = (1 - eio(seg(t, 8.4 + i * 0.25, 9.3 + i * 0.25))).toFixed(3); });
    this.tag.style.opacity = eo(seg(t, 9.4, 9.9));
  },
});
