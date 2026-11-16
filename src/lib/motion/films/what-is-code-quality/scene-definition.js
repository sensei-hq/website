// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('definition', {
  init(kit) {
    kit.css('.definition-steps { position:absolute; left:930px; top:820px; display:flex; gap:16px }' +
      '.definition-steps span { padding:10px 22px; border-radius:999px; font-size:28px; font-weight:600; background:var(--tile); border:2px solid var(--hair); color:var(--mute) }' +
      '.definition-steps span.on { background:var(--main); border-color:var(--main); color:var(--ground) }' +
      '.definition-ok { left:1350px; top:740px }');
    // A codebase as twelve file tiles. One is found, changed once, and every tile's checks come back green.
    const X = (c) => 940 + c * 214, Y = (r) => 190 + r * 178, cells = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) cells.push([X(c), Y(r)]);
    this.target = 6;
    const tiles = cells.map(([x, y], i) => '<g class="definition-tile"><rect x="' + x + '" y="' + (y + 8) + '" width="190" height="150" rx="16" style="fill:var(--shade)"/>' +
      '<rect class="definition-face" x="' + x + '" y="' + y + '" width="190" height="150" rx="16" style="fill:var(--tile);stroke:var(--hair);stroke-width:3"/>' +
      W.bars('definition-l', x + 22, y + 28, [[0, 110, 'ink'], [16, 130], [16, 90], [0, 60]], 26, 10) +
      (i === this.target ? '<rect class="definition-edit" x="' + (x + 38) + '" y="' + (y + 54) + '" width="130" height="10" rx="5" style="fill:var(--accent)"/>' : '') +
      '<g transform="translate(' + (x + 166) + ' ' + (y + 126) + ') scale(0.62)">' + W.tick('definition-tick') + '</g></g>').join('');
    const [tx, ty] = cells[this.target];
    kit.stage.append(kit.h('<div class="ground"><div class="cam definition-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('definition-bg') + tiles +
      '<rect class="definition-scan" x="926" y="176" width="218" height="178" rx="22" style="fill:none;stroke:var(--main);stroke-width:5;stroke-dasharray:14 10"/>' +
      '<rect class="definition-found" x="' + (tx - 8) + '" y="' + (ty - 8) + '" width="206" height="166" rx="22" style="fill:none;stroke:var(--accent);stroke-width:6"/></svg>' +
      '<div class="definition-steps"><span>Read</span><span>Find</span><span>Change once</span><span>Know</span></div>' +
      '<span class="tag ok definition-ok">Nothing else broke</span></div>' +
      W.head('definition-head', 'A working definition', 'Easy to change, safely.', 'Not elegance: how cheaply and safely the next change can be made.', 'left:110px;top:300px;width:700px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cells, cam: q('.definition-cam'), head: q('.definition-head'), tiles: all('.definition-tile'), scan: q('.definition-scan'), found: q('.definition-found'),
      edit: q('.definition-edit'), ticks: all('.definition-tick'), steps: all('.definition-steps span'), ok: q('.definition-ok') });
    W.portrait(kit, { hoist: ['.definition-head'], frame: [640, 1000], crop: [910, 170, 900, 720], css: '.definition-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 8.5, 1, 1.025, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.tiles.forEach((g, i) => { g.style.opacity = eo(seg(t, 0.3 + i * 0.05, 0.7 + i * 0.05)); });
    // Read: the scan frame walks the tiles in reading order, then settles on the one to change.
    const rp = seg(t, 1.4, 3.2), k = Math.min(this.target, Math.floor(rp * (this.target + 1)));
    const [sx, sy] = this.cells[k];
    this.scan.setAttribute('x', sx - 14); this.scan.setAttribute('y', sy - 14);
    this.scan.style.opacity = (eo(seg(t, 1.3, 1.6)) * (1 - eo(seg(t, 3.4, 3.7)))).toFixed(3);
    const fp = seg(t, 3.3, 3.7);
    this.found.style.opacity = eo(fp);
    // Change once: one line is rewritten in the found file.
    const ep = eio(seg(t, 4.2, 4.9));
    this.edit.setAttribute('width', (130 * ep).toFixed(1));
    // Know: every file's checks come back, in a wave.
    this.ticks.forEach((tk, i) => {
      const p = seg(t, 5.4 + i * 0.06, 5.75 + i * 0.06);
      tk.style.opacity = eo(p); tk.style.transformBox = 'fill-box'; tk.style.transformOrigin = 'center';
      tk.style.transform = 'scale(' + lerp(0.3, 1, eob(p, 1.8)).toFixed(3) + ')';
    });
    const on = [1.4, 3.3, 4.2, 5.4];
    this.steps.forEach((s, i) => { s.classList.toggle('on', t >= on[i]); s.style.opacity = eo(seg(t, 0.8 + i * 0.1, 1.2 + i * 0.1)); });
    W.pop(this.ok, t, 6.3, this.K, 'translate(-50%,0)');
  },
});
