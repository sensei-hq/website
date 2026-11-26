// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('map', {
  init(kit) {
    kit.css('.map-lv { position:absolute; left:880px; top:180px; display:flex; gap:10px } .map-lv span { padding:8px 18px; border-radius:999px; font-size:22px; font-weight:600; border:2px solid var(--hair); background:var(--tile); color:var(--mute) }' +
      '.map-lv span.on { background:var(--main); border-color:var(--main); color:var(--ground) }');
    // Level 0: modules and the bands between them. Level 1: one module's files in role columns. Level 2: one file's symbols with callers and callees.
    const M = [['auth', 960, 300], ['api', 1240, 300], ['billing', 1520, 300], ['db', 960, 560], ['ui', 1240, 560], ['jobs', 1520, 560]];
    const B = [[1, 0], [1, 3], [0, 3], [2, 3], [4, 1], [5, 2], [5, 3]];
    const c = (i) => [M[i][1] + 110, M[i][2] + 70];
    let l0 = B.map(([a, b]) => '<path d="M' + c(a) + ' L' + c(b) + '" style="stroke:var(--wire);stroke-width:' + (a === 1 && b === 0 ? 12 : 7) + ';stroke-linecap:round;opacity:.8"/>').join('');
    l0 += M.map(([n, x, y], i) => '<g><rect x="' + x + '" y="' + y + '" width="220" height="140" rx="18" style="fill:var(--tile);stroke:' + (i === 0 ? 'var(--accent)' : 'var(--main)') + ';stroke-width:' + (i === 0 ? 5 : 3) + '"/>' +
      '<text x="' + (x + 110) + '" y="' + (y + 82) + '" text-anchor="middle" style="font:400 38px var(--display);fill:var(--second)">' + n + '</text></g>').join('');
    // L1: auth's files by role.
    const cols = [['code', ['limits.ts', 'session.ts', 'tokens.ts']], ['test', ['limits.spec.ts', 'session.spec.ts']], ['docs', ['auth.md']]];
    let l1 = cols.map(([r, fs], k) => '<text x="' + (960 + k * 290) + '" y="300" style="font:600 22px var(--sans);letter-spacing:.1em;fill:var(--mute)">' + r.toUpperCase() + '</text>' +
      fs.map((f, j) => '<g><rect x="' + (960 + k * 290) + '" y="' + (320 + j * 100) + '" width="250" height="78" rx="12" style="fill:var(--tile);stroke:' + (k === 0 && j === 0 ? 'var(--accent)' : 'var(--hair)') + ';stroke-width:' + (k === 0 && j === 0 ? 5 : 3) + '"/>' +
        '<text x="' + (980 + k * 290) + '" y="' + (367 + j * 100) + '" style="font:22px var(--mono);fill:var(--second)">' + f + '</text></g>').join('')).join('');
    // L2: limits.ts's symbols, with a caller and a callee.
    const S = [['RateLimiter', 1240, 360], ['allow()', 1240, 470], ['reset()', 1240, 580]];
    let l2 = '<rect x="1160" y="300" width="300" height="360" rx="18" style="fill:var(--tile);stroke:var(--accent);stroke-width:4"/><text x="1180" y="340" style="font:22px var(--mono);fill:var(--mute)">limits.ts</text>' +
      S.map(([n, x, y]) => '<g><rect x="1190" y="' + (y - 30) + '" width="240" height="60" rx="10" style="fill:var(--ground);stroke:var(--main);stroke-width:3"/><text x="1210" y="' + (y + 8) + '" style="font:22px var(--mono);fill:var(--second)">' + n + '</text></g>').join('') +
      '<path d="M1030 470 H1190" style="stroke:var(--main);stroke-width:4" marker-end="url(#map-h)"/><text x="900" y="478" style="font:22px var(--mono);fill:var(--mute)">login()</text><text x="900" y="440" style="font:600 18px var(--sans);letter-spacing:.1em;fill:var(--mute)">CALLER</text>' +
      '<path d="M1430 470 H1580" style="stroke:var(--main);stroke-width:4" marker-end="url(#map-h)"/><text x="1590" y="478" style="font:22px var(--mono);fill:var(--mute)">store.get()</text><text x="1590" y="440" style="font:600 18px var(--sans);letter-spacing:.1em;fill:var(--mute)">CALLEE</text>';
    kit.stage.append(kit.h('<div class="ground"><div class="cam map-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('map-bg') +
      '<defs><marker id="map-h" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" style="fill:var(--main)"/></marker></defs>' +
      '<g class="map-l0">' + l0 + '</g><g class="map-l1">' + l1 + '</g><g class="map-l2">' + l2 + '</g></svg>' +
      '<div class="map-lv"><span>Modules</span><span>Files</span><span>Symbols</span></div></div>' +
      W.head('map-head', 'The code map', 'A map that opens on modules.', 'Go down a level when you choose: modules, files, symbols.', 'left:110px;top:320px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.map-cam'), head: q('.map-head'), L: [q('.map-l0'), q('.map-l1'), q('.map-l2')], lv: all('.map-lv span') });
    W.portrait(kit, { hoist: ['.map-head'], frame: [640, 1000], crop: [870, 160, 960, 580], css: '.map-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 12.5, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    // Each level zooms out of the block chosen on the level above.
    const sw = [[0.8, 4.6], [4.6, 8.2], [8.2, 99]];
    this.L.forEach((g, i) => {
      const [a, b] = sw[i], inn = eo(seg(t, a, a + 0.6)), out = eio(seg(t, b, b + 0.5));
      g.style.opacity = (inn * (1 - out)).toFixed(3);
      g.style.transformOrigin = i === 0 ? '1070px 370px' : '1085px 360px';
      g.style.transform = 'scale(' + (lerp(0.85, 1, inn) * lerp(1, 1.6, out)).toFixed(3) + ')';
    });
    this.lv.forEach((s, i) => { s.style.opacity = eo(seg(t, 0.6 + i * 0.1, 1.0 + i * 0.1)); s.classList.toggle('on', t >= sw[i][0] && t < sw[i][1] + 0.2); });
  },
});
