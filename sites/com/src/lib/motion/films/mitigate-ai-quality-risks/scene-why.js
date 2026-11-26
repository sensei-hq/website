// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('why', {
  init(kit) {
    kit.css('.why-card { top:190px; width:410px; height:520px; box-sizing:border-box; padding:24px 28px; box-shadow:0 14px 30px rgba(0,0,0,.07) }' +
      '.why-card h4 { margin:0; font-size:24px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase } .why-res { left:1350px; top:780px }');
    // The same ask twice. On the left its open questions are gaps the AI fills with guesses; on the right they are answered.
    const L = [[60, 120, 110], [150, 90, 0], [40, 110, 140], [120, 100, 60], [180, 0, 0]];
    const draw = (x0, side) => L.map(([a, gap, b], k) => {
      const y = 300 + k * 74; let s = '<rect x="' + x0 + '" y="' + y + '" width="' + a + '" height="14" rx="7" style="fill:var(--main)"/>';
      if (gap) {
        const gx = x0 + a + 14;
        s += side === 'v'
          ? '<g class="why-gap"><rect x="' + gx + '" y="' + (y - 14) + '" width="' + gap + '" height="42" rx="21" style="fill:none;stroke:var(--accent);stroke-width:3;stroke-dasharray:8 7"/>' +
            '<text x="' + (gx + gap / 2) + '" y="' + (y + 16) + '" text-anchor="middle" style="font:600 26px var(--sans);fill:var(--accent)">?</text>' +
            '<path class="why-guess" pathLength="1" d="M' + (gx + 10) + ' ' + (y + 7) + ' q10 -14 20 0 t20 0 t20 0 t20 0' + (gap > 100 ? ' t20 0' : '') + '" style="fill:none;stroke:var(--accent);stroke-width:5;stroke-linecap:round"/></g>'
          : '<g class="why-fill"><rect x="' + gx + '" y="' + (y - 14) + '" width="' + gap + '" height="42" rx="21" style="fill:color-mix(in srgb, var(--jade) 18%, var(--tile));stroke:var(--jade);stroke-width:3"/>' +
            '<g transform="translate(' + (gx + gap / 2) + ' ' + (y + 7) + ') scale(0.6)">' + W.tick('') + '</g></g>';
        if (b) s += '<rect x="' + (gx + gap + 14) + '" y="' + y + '" width="' + b + '" height="14" rx="7" style="fill:var(--main)"/>';
      }
      return s;
    }).join('');
    kit.stage.append(kit.h('<div class="ground"><div class="cam why-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('why-bg') + '</svg>' +
      '<div class="card why-card why-v" style="left:880px"><h4 style="color:var(--accent)">A vague ask</h4></div>' +
      '<div class="card why-card why-c" style="left:1410px"><h4 style="color:var(--jade)">A clear ask</h4></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="why-vl">' + draw(912, 'v') + '</g><g class="why-cl">' + draw(1442, 'c') + '</g>' +
      '<g class="why-arrow"><path class="why-ar" pathLength="1" d="M1305 450 H1392" style="fill:none;stroke:var(--main);stroke-width:6;stroke-linecap:round"/><path d="M1378 436 L1396 450 L1378 464" style="fill:none;stroke:var(--main);stroke-width:6;stroke-linecap:round;stroke-linejoin:round"/></g></svg>' +
      '<span class="tag ink why-res">Requirements + verification: improvising becomes executing</span></div>' +
      W.head('why-head', 'Why it works', 'Less room to guess.', 'Every unanswered question is a place the assistant will improvise.', 'left:110px;top:300px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.why-cam'), head: q('.why-head'), v: q('.why-v'), c: q('.why-c'), vl: q('.why-vl'), cl: q('.why-cl'), gaps: all('.why-gap'), guesses: all('.why-guess'),
      fills: all('.why-fill'), arrow: q('.why-arrow'), res: q('.why-res') });
    W.portrait(kit, { hoist: ['.why-head'], frame: [600, 1100], crop: [860, 170, 980, 680], css: '.why-head{left:70px!important;top:150px!important;width:940px!important} .why-res{white-space:normal!important;width:560px;text-align:center}' });
  },
  render(t) {
    W.push(this.cam, t, 9.5, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    W.fade(this.v, t, 0.6, this.K); this.vl.style.opacity = eo(seg(t, 0.8, 1.3));
    this.gaps.forEach((g, i) => { g.style.opacity = (0.6 + 0.4 * Math.abs(Math.sin(t * 2.4 + i))).toFixed(3); });
    // Each gap is filled with a guess (on "improvise").
    this.guesses.forEach((p, i) => W.draw(p, t, 2.4 + i * 0.3, 3.0 + i * 0.3, this.K));
    this.arrow.style.opacity = eo(seg(t, 4.2, 4.5)); W.draw(this.arrow.firstChild, t, 4.2, 4.7, this.K);
    W.fade(this.c, t, 4.6, this.K); this.cl.style.opacity = eo(seg(t, 4.8, 5.3));
    this.fills.forEach((g, i) => { g.style.opacity = eo(seg(t, 5.6 + i * 0.3, 5.9 + i * 0.3)); });
    W.pop(this.res, t, 7.0, this.K, 'translate(-50%,0)');
  },
});
