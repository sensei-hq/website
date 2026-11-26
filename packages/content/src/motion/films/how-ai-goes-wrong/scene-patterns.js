// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('patterns', {
  init(kit) {
    // Five panels, each acting out one failure, lit in the order the voice names them.
    const O = [[880, 150], [1202, 150], [1524, 150], [1041, 476], [1363, 476]];
    const names = ['Edit before read', 'Shallow analysis', 'Spec deviation', 'Duplication', 'Context pressure'];
    const txt = (x, y, s, fill, size, anchor, cls) => '<text' + (cls ? ' class="' + cls + '"' : '') + ' x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'start') + '" style="font:600 ' + (size || 22) + 'px var(--sans);fill:' + fill + '">' + s + '</text>';
    const panel = (i) => {
      const [x, y] = O[i];
      return '<g class="patterns-p"><rect x="' + x + '" y="' + (y + 10) + '" width="296" height="300" rx="20" style="fill:var(--shade)"/>' +
        '<rect class="patterns-face" x="' + x + '" y="' + y + '" width="296" height="300" rx="20" style="fill:var(--tile);stroke:var(--hair);stroke-width:3"/>' +
        '<circle cx="' + (x + 30) + '" cy="' + (y + 30) + '" r="17" style="fill:var(--main)"/>' + txt(x + 30, y + 38, i + 1, 'var(--ground)', 22, 'middle') +
        txt(x + 148, y + 278, names[i], 'var(--second)', 26, 'middle') + '</g>';
    };
    let art = '';
    for (let i = 0; i < 5; i++) art += panel(i);
    // 1 · Edit before read: a pencil edits a file nobody opened.
    let [x, y] = O[0];
    art += '<g class="patterns-v1"><rect x="' + (x + 88) + '" y="' + (y + 50) + '" width="120" height="150" rx="12" style="fill:var(--ground);stroke:var(--main);stroke-width:3"/>' +
      W.bars('', x + 104, y + 74, [[0, 70, 'ink'], [10, 80], [10, 60], [0, 40], [10, 74]], 24, 9) +
      '<rect class="patterns-e1" x="' + (x + 114) + '" y="' + (y + 120) + '" width="0" height="12" rx="6" style="fill:var(--accent)"/>' +
      '<g class="patterns-pen"><path d="M0 0 L46 -46 L58 -34 L12 12 L-4 16 Z" style="fill:var(--main)"/><path d="M-4 16 L0 0 L12 12 Z" style="fill:var(--accent)"/></g>' +
      txt(x + 268, y + 38, 'reads: 0', 'var(--accent)', 22, 'end', 'patterns-r1') + '</g>';
    // 2 · Shallow analysis: a skim of the top, a confident "fixed", and the real bug further down.
    [x, y] = O[1];
    art += '<g class="patterns-v2"><rect x="' + (x + 90) + '" y="' + (y + 56) + '" width="116" height="172" rx="12" style="fill:var(--ground);stroke:var(--main);stroke-width:3"/>' +
      W.bars('', x + 104, y + 72, [[0, 70, 'ink'], [10, 76], [10, 60], [0, 50], [10, 80], [10, 56], [0, 70]], 20, 8) +
      '<rect class="patterns-scan" x="' + (x + 82) + '" y="' + (y + 64) + '" width="132" height="44" rx="8" style="fill:color-mix(in srgb, var(--main) 16%, transparent)"/>' +
      '<circle class="patterns-bug" cx="' + (x + 190) + '" cy="' + (y + 196) + '" r="9" style="fill:var(--accent)"/>' +
      txt(x + 268, y + 38, 'Fixed!', 'var(--jade)', 24, 'end', 'patterns-fixed') + '</g>';
    // 3 · Spec deviation: the plan goes straight; the work bends away from it.
    [x, y] = O[2];
    art += '<g class="patterns-v3">' + txt(x + 40, y + 108, 'plan', 'var(--mute)', 20) +
      '<path d="M' + (x + 40) + ' ' + (y + 130) + ' H' + (x + 250) + '" style="fill:none;stroke:var(--wire);stroke-width:5;stroke-dasharray:10 10;stroke-linecap:round"/>' +
      '<path d="M' + (x + 250) + ' ' + (y + 130) + ' v-46 l26 12 l-26 12" style="fill:var(--jade);stroke:var(--jade);stroke-width:4;stroke-linejoin:round"/>' +
      '<path class="patterns-dev" pathLength="1" d="M' + (x + 40) + ' ' + (y + 130) + ' H' + (x + 130) + ' Q' + (x + 196) + ' ' + (y + 130) + ' ' + (x + 214) + ' ' + (y + 206) + '" style="fill:none;stroke:var(--main);stroke-width:7;stroke-linecap:round"/>' +
      '<g transform="translate(' + (x + 216) + ' ' + (y + 214) + ') scale(0.7)"><g class="patterns-x3">' + W.cross('') + '</g></g></g>';
    // 4 · Duplication: the helper exists; a second one is written next to it.
    [x, y] = O[3];
    const fn = (fx, cls, color, label) => '<g class="' + cls + '"><rect x="' + fx + '" y="' + (y + 64) + '" width="100" height="124" rx="12" style="fill:var(--ground);stroke:' + color + ';stroke-width:3"/>' +
      W.bars('', fx + 14, y + 84, [[0, 60, 'ink'], [10, 62], [10, 50], [0, 30]], 24, 9) + '<text x="' + (fx + 50) + '" y="' + (y + 216) + '" text-anchor="middle" style="font:20px var(--mono);fill:var(--mute)">' + label + '</text></g>';
    art += '<g class="patterns-v4">' + fn(x + 36, 'patterns-old', 'var(--main)', 'fmt()') + fn(x + 160, 'patterns-new', 'var(--accent)', 'format()') +
      txt(x + 268, y + 38, '×2', 'var(--accent)', 26, 'end', 'patterns-x2') + '</g>';
    // 5 · Context pressure: the window fills, and the start of the task falls out of it.
    [x, y] = O[4];
    let msgs = '';
    [0, 1, 2, 3].forEach((k) => { msgs += '<rect class="patterns-msg" x="' + (x + 50 + (k % 2) * 30) + '" y="' + (y + 58 + k * 30) + '" width="' + (180 - (k % 2) * 30) + '" height="20" rx="10" style="fill:' + (k % 2 ? 'var(--hair)' : 'var(--main)') + '"/>'; });
    art += '<g class="patterns-v5">' + msgs + '<rect x="' + (x + 30) + '" y="' + (y + 196) + '" width="236" height="22" rx="11" style="fill:var(--hair)"/>' +
      '<rect class="patterns-ctx" x="' + (x + 30) + '" y="' + (y + 196) + '" width="0" height="22" rx="11" style="fill:var(--main)"/>' +
      txt(x + 268, y + 38, 'compacted', 'var(--accent)', 22, 'end', 'patterns-cmp') + '</g>';
    kit.stage.append(kit.h('<div class="ground"><div class="cam patterns-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('patterns-bg') + art + '</svg></div>' +
      W.head('patterns-head', 'The patterns', 'What actually goes wrong.', 'Watch enough sessions and the same five repeat.', 'left:110px;top:320px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, O, cam: q('.patterns-cam'), head: q('.patterns-head'), panels: all('.patterns-p'), faces: all('.patterns-face'),
      v: [1, 2, 3, 4, 5].map((i) => q('.patterns-v' + i)), e1: q('.patterns-e1'), pen: q('.patterns-pen'), r1: q('.patterns-r1'),
      scan: q('.patterns-scan'), bug: q('.patterns-bug'), fixed: q('.patterns-fixed'), dev: q('.patterns-dev'), x3: q('.patterns-x3'),
      old: q('.patterns-old'), neu: q('.patterns-new'), x2: q('.patterns-x2'), msgs: all('.patterns-msg'), ctx: q('.patterns-ctx'), cmp: q('.patterns-cmp') });
    W.portrait(kit, { hoist: ['.patterns-head'], frame: [600, 1120], crop: [835, 120, 1040, 700], css: '.patterns-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 15, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    const A = [1.0, 3.6, 6.2, 8.8, 11.4];
    this.panels.forEach((p, i) => { p.style.opacity = eo(seg(t, 0.3 + i * 0.1, 0.8 + i * 0.1)); });
    this.faces.forEach((f, i) => { const on = t >= A[i] && t < A[i] + 2.6; f.style.stroke = on ? 'var(--accent)' : 'var(--hair)'; f.style.strokeWidth = on ? 5 : 3; });
    this.v.forEach((g, i) => { g.style.opacity = (lerp(0.35, 1, eo(seg(t, A[i] - 0.3, A[i]))) * eo(seg(t, 0.5 + i * 0.1, 1.0 + i * 0.1))).toFixed(3); });
    let a = A[0], [x, y] = this.O[0];
    // 1: the pen comes in and writes before anything was read.
    const pp = eio(seg(t, a, a + 0.8));
    this.pen.setAttribute('transform', 'translate(' + lerp(x + 250, x + 120, pp).toFixed(1) + ' ' + lerp(y + 60, y + 126, pp).toFixed(1) + ')');
    const ew = eio(seg(t, a + 0.8, a + 1.6));
    this.e1.setAttribute('width', (70 * ew).toFixed(1));
    this.pen.setAttribute('transform', 'translate(' + (lerp(x + 250, x + 120, pp) + 70 * ew).toFixed(1) + ' ' + lerp(y + 60, y + 126, pp).toFixed(1) + ')');
    this.r1.style.opacity = eo(seg(t, a + 1.6, a + 2.0));
    // 2: the skim stops near the top; "Fixed!"; the bug below keeps pulsing.
    a = A[1]; [x, y] = this.O[1];
    this.scan.setAttribute('y', (y + 64 + 26 * eio(seg(t, a, a + 0.9))).toFixed(1));
    this.scan.style.opacity = eo(seg(t, a - 0.1, a + 0.2));
    this.fixed.style.opacity = eo(seg(t, a + 1.0, a + 1.3));
    this.bug.setAttribute('r', (9 + (t > a + 1.4 ? 3 * Math.abs(Math.sin((t - a) * 3)) : 0)).toFixed(2));
    // 3: the work leaves the plan.
    a = A[2];
    W.draw(this.dev, t, a, a + 1.6, this.K);
    W.pop(this.x3, t, a + 1.6, this.K, '');
    this.x3.style.transformBox = 'fill-box'; this.x3.style.transformOrigin = 'center';
    // 4: a second helper, the same as the first.
    a = A[3];
    W.fade(this.neu, t, a + 0.4, this.K);
    this.x2.style.opacity = eo(seg(t, a + 1.4, a + 1.7));
    // 5: the context fills; the earliest messages drop out.
    a = A[4];
    this.msgs.forEach((m, k) => {
      const inn = eo(seg(t, a + k * 0.3, a + 0.3 + k * 0.3)), out = k < 2 ? eo(seg(t, a + 1.8 + k * 0.15, a + 2.2 + k * 0.15)) : 0;
      m.style.opacity = (Math.max(inn, t < a ? 0.25 : 0) * (1 - out * 0.85)).toFixed(3);
    });
    const c = eio(seg(t, a, a + 1.7));
    this.ctx.setAttribute('width', (236 * c).toFixed(1));
    this.ctx.style.fill = c > 0.8 ? 'var(--accent)' : 'var(--main)';
    this.cmp.style.opacity = eo(seg(t, a + 1.8, a + 2.1));
  },
});
