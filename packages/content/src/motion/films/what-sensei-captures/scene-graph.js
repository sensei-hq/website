// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('graph', {
  init(kit) {
    // Three clusters (communities) of files and symbols, joined by calls and imports; a doc page linked to the code it names.
    const N = [
      ['f', 1000, 330, 'auth/session.ts'], ['s', 940, 450, ''], ['s', 1070, 470, ''], ['s', 1010, 560, ''],
      ['f', 1420, 260, 'auth/limits.ts'], ['s', 1350, 370, ''], ['s', 1490, 380, ''],
      ['f', 1280, 640, 'api/login.ts'], ['s', 1200, 750, ''], ['s', 1360, 760, ''],
      ['d', 1700, 560, 'README.md']];
    const E = [[0, 1], [0, 2], [2, 3], [4, 5], [4, 6], [7, 8], [7, 9], [8, 2], [9, 5], [6, 2], [10, 4], [10, 7]];
    const blobs = [[1005, 470, 170, 160], [1420, 330, 150, 110], [1280, 710, 160, 110]];
    let svg = blobs.map(([x, y, rx, ry]) => '<ellipse class="graph-blob" cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" style="fill:color-mix(in srgb, var(--jade) 9%, transparent);stroke:color-mix(in srgb, var(--jade) 35%, transparent);stroke-width:2;stroke-dasharray:6 8"/>').join('');
    svg += E.map(([a, b]) => '<line class="graph-e" data-a="' + a + '" data-b="' + b + '" x1="' + N[a][1] + '" y1="' + N[a][2] + '" x2="' + N[b][1] + '" y2="' + N[b][2] + '" pathLength="1" style="stroke:' + (a === 10 ? 'var(--accent)' : 'var(--wire)') + ';stroke-width:4;' + (a === 10 ? 'stroke-dasharray:8 8;' : '') + '"/>').join('');
    svg += N.map(([k, x, y, l], i) => '<g class="graph-n" data-i="' + i + '">' + (k === 'f' ? '<rect x="' + (x - 34) + '" y="' + (y - 40) + '" width="68" height="80" rx="10" style="fill:var(--tile);stroke:var(--main);stroke-width:4"/>'
      : k === 'd' ? '<path d="M' + (x - 34) + ' ' + (y - 42) + ' h48 l20 20 v64 h-68 z" style="fill:var(--tile);stroke:var(--accent);stroke-width:4"/>' : '<circle cx="' + x + '" cy="' + y + '" r="18" style="fill:var(--main)"/>') +
      (l ? '<text x="' + x + '" y="' + (y + 72) + '" text-anchor="middle" style="font:20px var(--mono);fill:var(--mute)">' + l + '</text>' : '') + '</g>').join('');
    svg += '<circle class="graph-ping" cx="1420" cy="260" r="40" style="fill:none;stroke:var(--accent);stroke-width:5"/>';
    kit.stage.append(kit.h('<div class="ground"><div class="cam graph-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('graph-bg') + svg + '</svg>' +
      '<span class="tag hot graph-tag" style="left:1420px;top:150px">Changed: only its slice re-indexed</span></div>' +
      W.head('graph-head', 'The code graph', 'It maps the code itself.', 'Files, symbols, calls and docs, kept current as you work.', 'left:110px;top:320px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.graph-cam'), head: q('.graph-head'), nodes: all('.graph-n'), edges: all('.graph-e'), blobs: all('.graph-blob'), ping: q('.graph-ping'), tag: q('.graph-tag') });
    W.portrait(kit, { hoist: ['.graph-head'], frame: [640, 1080], crop: [860, 140, 960, 720], css: '.graph-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 12.5, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.nodes.forEach((n, i) => { n.style.opacity = eo(seg(t, 0.8 + i * 0.2, 1.2 + i * 0.2)); });
    this.edges.forEach((e, i) => {
      const a = 2.6 + i * 0.18; W.draw(e, t, a, a + 0.5, this.K);
      // The change: limits.ts's own edges redraw; nothing else moves.
      const own = e.dataset.a === '4' || e.dataset.b === '4';
      if (own && t > 8.2) { const p = eio(seg(t, 8.4, 9.2)); e.style.strokeDashoffset = (p < 0.5 ? p * 2 : 2 - p * 2).toFixed(3); }
    });
    this.blobs.forEach((b, i) => { b.style.opacity = eo(seg(t, 5.2 + i * 0.3, 5.8 + i * 0.3)); });
    const pp = seg(t, 7.8, 9.6);
    this.ping.setAttribute('r', (40 + 50 * eo(pp)).toFixed(1)); this.ping.style.opacity = (t > 7.8 && t < 9.6 ? 1 - pp : 0).toFixed(3);
    W.pop(this.tag, t, 8.2, this.K, 'translate(-50%,0)');
  },
});
