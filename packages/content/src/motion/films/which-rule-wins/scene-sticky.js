// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('sticky', {
  init(kit) {
    kit.css('.sticky-c { position:absolute; width:280px; box-sizing:border-box; padding:16px 18px; border-radius:16px; background:var(--tile); border:2px solid var(--hair); box-shadow:0 10px 22px rgba(0,0,0,.06); font-size:21px; line-height:1.3 }' +
      '.sticky-c b { display:block; margin-bottom:6px; font-size:17px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--mute) } .sticky-c code { font-family:var(--mono); font-size:19px }' +
      '.sticky-c.hot { border-color:var(--accent); border-width:3px } .sticky-c.hot b { color:var(--accent) } .sticky-c.ok { border-color:var(--jade); border-width:3px } .sticky-c.ok b { color:var(--jade) }');
    // One long session. The strongest tiers are pushed at the start and pushed again at compaction; a mandatory violation is stopped.
    const X = [960, 1280, 1600];
    kit.stage.append(kit.h('<div class="ground"><div class="cam sticky-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('sticky-bg') +
      '<path class="sticky-line" pathLength="1" d="M900 500 H1800" style="fill:none;stroke:var(--main);stroke-width:6;stroke-linecap:round"/>' +
      X.map((x, i) => '<circle class="sticky-m" cx="' + x + '" cy="500" r="16" style="fill:' + (i === 2 ? 'var(--accent)' : 'var(--jade)') + ';stroke:var(--ground);stroke-width:5"/>').join('') +
      '<text x="900" y="550" style="font:600 19px var(--sans);letter-spacing:.1em;fill:var(--mute)">SESSION START</text><text x="1800" y="550" text-anchor="end" style="font:600 19px var(--sans);letter-spacing:.1em;fill:var(--mute)">LATER</text></svg>' +
      '<div class="sticky-c ok" style="left:840px;top:220px"><b>Pushed at start</b>4 mandatory · 2 required rules, in context from the first turn</div>' +
      '<div class="sticky-c ok" style="left:1140px;top:600px"><b>Context compacted</b>The full mandatory tier is sent again, not a summary</div>' +
      '<div class="sticky-c hot" style="left:1470px;top:220px"><b>Blocked</b><code>git commit --no-verify</code> breaks a mandatory rule</div>' +
      '<div class="sticky-c" style="left:1520px;top:620px"><b>On request</b>Recommended and advisory rules, when they’re relevant</div></div>' +
      W.head('sticky-head', 'It sticks', 'Rules that survive a long session.', 'The strongest rules are in context from the start, sent again when the context compacts, and enforced.', 'left:110px;top:280px;width:700px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.sticky-cam'), head: q('.sticky-head'), line: q('.sticky-line'), ms: all('.sticky-m'), cards: all('.sticky-c') });
    W.portrait(kit, { hoist: ['.sticky-head'], frame: [640, 1000], crop: [820, 190, 1020, 600], css: '.sticky-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 12, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    W.draw(this.line, t, 0.8, 8.0, this.K);
    const at = [1.2, 4.0, 6.8];
    this.ms.forEach((m, i) => W.pop(m, t, at[i], this.K));
    this.ms.forEach((m) => { m.style.transformBox = 'fill-box'; m.style.transformOrigin = 'center'; });
    [0, 1, 2].forEach((i) => W.fade(this.cards[i], t, at[i] + 0.2, this.K));
    W.fade(this.cards[3], t, 8.4, this.K);
  },
});
