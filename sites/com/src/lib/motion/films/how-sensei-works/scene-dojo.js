// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('dojo', {
  init(kit) {
    kit.css('.dojo-key { position:absolute; left:880px; top:780px; display:flex; gap:24px; font-size:22px; color:var(--soft) } .dojo-key b { font-size:26px; margin-right:6px }');
    // Members' machines below, the dōjō above. Lessons go up; consolidated practice comes back down to everyone.
    const X = [960, 1200, 1440];
    let svg = '';
    X.forEach((x, i) => {
      svg += '<path class="dojo-up" pathLength="1" d="M' + (x + 70) + ' 560 Q' + (x + 50) + ' 470 ' + (1180 + i * 40) + ' 369" style="fill:none;stroke:var(--accent);stroke-width:5;stroke-linecap:round"/>';
      svg += '<path class="dojo-dn" pathLength="1" d="M' + (1220 + i * 40) + ' 369 Q' + (x + 130) + ' 480 ' + (x + 110) + ' 560" style="fill:none;stroke:var(--jade);stroke-width:5;stroke-linecap:round;stroke-dasharray:1 1"/>';
      for (let k = 0; k < 2; k++) svg += '<circle class="dojo-p" data-i="' + i + '" data-k="' + k + '" r="8" style="fill:var(--accent)"/>';
    });
    const laptop = (x) => '<g class="dojo-m"><rect x="' + x + '" y="570" width="180" height="110" rx="10" style="fill:var(--tile);stroke:var(--main);stroke-width:4"/><rect x="' + (x - 18) + '" y="680" width="216" height="16" rx="6" style="fill:var(--main)"/>' +
      '<text x="' + (x + 90) + '" y="636" text-anchor="middle" style="font:600 22px var(--sans);fill:var(--second)">Sensei</text></g>';
    kit.stage.append(kit.h('<div class="ground"><div class="cam dojo-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('dojo-bg') + svg + X.map(laptop).join('') + '</svg>' +
      W.box('dojo-d', 1050, 250, 400, 0, '結', 'Dōjō', 'dojo.sensei-hq.com, or your own VPC', 'var(--jade)', ';border:3px solid var(--jade)') +
      W.box('dojo-c', 1510, 250, 310, 0, '群', 'Collective', 'Public and anonymised; opt-in', 'var(--soft)', ';border-style:dashed') +
      '<div class="dojo-key"><span><b style="color:var(--accent)">↑</b>You push lessons up</span><span><b style="color:var(--jade)">↓</b>Consolidated practice comes back</span></div></div>' +
      W.head('dojo-head', 'The dōjō', 'Your team’s shared mind.', 'Lessons go up, the team approves them, and practice comes back down to everyone.', 'left:110px;top:300px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.dojo-cam'), head: q('.dojo-head'), d: q('.dojo-d'), c: q('.dojo-c'), ms: all('.dojo-m'), up: all('.dojo-up'), dn: all('.dojo-dn'), ps: all('.dojo-p'), key: q('.dojo-key') });
    W.portrait(kit, { hoist: ['.dojo-head'], frame: [620, 1000], crop: [860, 220, 980, 610], css: '.dojo-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 12, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.ms.forEach((m, i) => { m.style.opacity = eo(seg(t, 0.8 + i * 0.2, 1.2 + i * 0.2)); });
    W.fade(this.d, t, 1.8, this.K);
    this.up.forEach((p, i) => W.draw(p, t, 3.0 + i * 0.2, 3.8 + i * 0.2, this.K));
    // Packets of lessons travel up, steadily.
    this.ps.forEach((p) => {
      const i = +p.dataset.i, k = +p.dataset.k, start = 3.8;
      if (t < start) { p.style.opacity = 0; return; }
      const u = ((t - start) / 1.6 + k / 2) % 1, path = this.up[i], pt = path.getPointAtLength(u * path.getTotalLength());
      p.setAttribute('cx', pt.x.toFixed(1)); p.setAttribute('cy', pt.y.toFixed(1)); p.style.opacity = Math.sin(u * Math.PI).toFixed(3);
    });
    this.dn.forEach((p, i) => W.draw(p, t, 5.6 + i * 0.2, 6.6 + i * 0.2, this.K));
    W.fade(this.key, t, 6.4, this.K);
    W.fade(this.c, t, 8.4, this.K);
  },
});
