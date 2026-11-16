// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('signals', {
  init(kit) {
    kit.css('.signals-card { width:440px; height:290px; box-sizing:border-box; padding:22px 26px; box-shadow:0 12px 26px rgba(0,0,0,.06) }' +
      '.signals-card h4 { margin:0; font-size:30px; font-weight:600; color:var(--second) } .signals-card p { margin:4px 0 0; font-size:22px; color:var(--mute) }' +
      '.signals-val { position:absolute; right:26px; top:20px; font-family:var(--display); font-size:44px; color:var(--accent) }');
    // Four cards, one per signal, each with a small picture of what it counts. Values are illustrative.
    const C = [[910, 180], [1370, 180], [910, 500], [1370, 500]];
    const card = (i, title, note, val) => '<div class="card signals-card" style="left:' + C[i][0] + 'px;top:' + C[i][1] + 'px"><h4>' + title + '</h4><p>' + note + '</p>' + (val ? '<span class="signals-val">' + val + '</span>' : '') + '</div>';
    // Duplication: the same block four times; each copy lights as it is found.
    let dup = '';
    for (let k = 0; k < 4; k++) { const x = 944 + k * 98, y = 330; dup += '<g class="signals-dup"><rect x="' + x + '" y="' + y + '" width="80" height="96" rx="10" style="fill:var(--tile);stroke:var(--hair);stroke-width:3"/>' + W.bars('', x + 12, y + 18, [[0, 50, 'ink'], [8, 46], [8, 36]], 22, 8) + '</g>'; }
    // Complexity: nesting that steps deeper and deeper.
    let nest = '';
    [0, 1, 2, 3, 4].forEach((d) => { nest += '<rect class="signals-nest" x="' + (1404 + d * 34) + '" y="' + (318 + d * 26) + '" width="' + (260 - d * 34) + '" height="12" rx="6" style="fill:' + (d >= 3 ? 'var(--accent)' : 'var(--main)') + '"/>'; });
    // Coverage: the code a test would notice breaking.
    const cov = '<rect x="944" y="700" width="380" height="26" rx="13" style="fill:var(--hair)"/><rect class="signals-cov" x="944" y="700" width="0" height="26" rx="13" style="fill:var(--jade)"/>';
    // Churn: files changed per day.
    const ch = [0.3, 0.5, 0.35, 0.8, 0.45, 0.95, 0.6, 0.4];
    let churn = '';
    ch.forEach((h, k) => { churn += '<rect class="signals-churn" data-h="' + (h * 110) + '" x="' + (1404 + k * 46) + '" y="760" width="30" height="0" rx="6" style="fill:' + (h > 0.75 ? 'var(--accent)' : 'var(--main)') + '"/>'; });
    kit.stage.append(kit.h('<div class="ground"><div class="cam signals-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('signals-bg') + '</svg>' +
      card(0, 'Duplication', 'Fix it once, or four times?', '') + card(1, 'Complexity smells', 'Deep nesting, long functions', '') +
      card(2, 'Coverage', 'Would a test notice?', '<span class="signals-pct">0</span>%') + card(3, 'Churn', 'How much changes every day', '') +
      '<svg class="art" viewBox="0 0 1920 1080">' + dup + nest + cov + churn + '</svg></div>' +
      W.head('signals-head', 'What to look at', 'Signals you can measure.', 'Four that track quality over time.', 'left:110px;top:320px;width:700px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.signals-cam'), head: q('.signals-head'), cards: all('.signals-card'), dup: all('.signals-dup'), nest: all('.signals-nest'),
      cov: q('.signals-cov'), pct: q('.signals-pct'), churn: all('.signals-churn') });
    W.portrait(kit, { hoist: ['.signals-head'], frame: [600, 1080], crop: [890, 160, 940, 650], css: '.signals-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 9, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    const at = [1.0, 2.6, 4.2, 5.8];
    this.cards.forEach((c, i) => W.fade(c, t, at[i], this.K));
    this.dup.forEach((g, k) => {
      const p = seg(t, at[0] + 0.3 + k * 0.3, at[0] + 0.6 + k * 0.3);
      g.style.opacity = eo(p);
      g.firstChild.style.stroke = t > at[0] + 0.6 + k * 0.3 + 0.2 ? 'var(--accent)' : 'var(--hair)';
    });
    this.nest.forEach((r, d) => { r.style.opacity = eo(seg(t, at[1] + 0.3 + d * 0.22, at[1] + 0.6 + d * 0.22)); });
    const cp = eio(seg(t, at[2] + 0.4, at[2] + 1.6));
    this.cov.setAttribute('width', (380 * 0.72 * cp).toFixed(1));
    this.pct.textContent = Math.round(72 * cp);
    this.churn.forEach((r, k) => {
      const h = +r.dataset.h * eob(seg(t, at[3] + 0.3 + k * 0.12, at[3] + 0.7 + k * 0.12), 1.2);
      r.setAttribute('y', (760 - Math.max(0, h)).toFixed(1)); r.setAttribute('height', Math.max(0, h).toFixed(1));
    });
  },
});
