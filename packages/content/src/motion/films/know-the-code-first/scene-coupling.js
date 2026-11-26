// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('coupling', {
  init(kit) {
    // Modules in layers (ui on top, db at the bottom). Most bands point down; one points up, two form a cycle, and two modules change together with no band at all.
    const M = { ui: [1150, 200], api: [1000, 380], jobs: [1360, 380], auth: [920, 580], billing: [1220, 580], db: [1080, 760] };
    const c = (k) => [M[k][0] + 100, M[k][1] + 50];
    const band = (a, b, cls, color, dash) => '<path class="' + cls + '" pathLength="1" d="M' + c(a) + ' L' + c(b) + '" style="fill:none;stroke:' + color + ';stroke-width:7;stroke-linecap:round' + (dash ? ';stroke-dasharray:14 12' : '') + '"/>';
    let svg = ['ui-api', 'ui-jobs', 'api-auth', 'api-billing', 'jobs-billing', 'auth-db', 'billing-db'].map((p) => band(...p.split('-'), 'coupling-b', 'var(--wire)')).join('');
    svg += band('db', 'api', 'coupling-up', 'var(--accent)');
    svg += '<path class="coupling-cy" pathLength="1" d="M1060 630 Q1140 560 1270 630" style="fill:none;stroke:var(--amber);stroke-width:7;stroke-linecap:round"/><path class="coupling-cy" pathLength="1" d="M1290 650 Q1160 720 1040 650" style="fill:none;stroke:var(--amber);stroke-width:7;stroke-linecap:round"/>';
    svg += '<path class="coupling-hid" pathLength="1" d="M' + c('ui') + ' Q1600 420 ' + c('billing') + '" style="fill:none;stroke:var(--accent);stroke-width:6;stroke-dasharray:12 12;stroke-linecap:round"/>';
    svg += Object.entries(M).map(([k, [x, y]]) => '<g class="coupling-m"><rect x="' + x + '" y="' + y + '" width="200" height="100" rx="16" style="fill:var(--tile);stroke:var(--main);stroke-width:3"/><text x="' + (x + 100) + '" y="' + (y + 62) + '" text-anchor="middle" style="font:400 34px var(--display);fill:var(--second)">' + k + '</text></g>').join('');
    kit.stage.append(kit.h('<div class="ground"><div class="cam coupling-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('coupling-bg') + svg + '</svg>' +
      '<span class="tag hot coupling-t1" style="left:1060px;top:700px">Upward: db calls api</span>' +
      '<span class="tag coupling-t2" style="left:1160px;top:510px;background:var(--amber);color:var(--ground);border-color:var(--amber)">Cycle</span>' +
      '<span class="tag hot coupling-t3" style="left:1600px;top:520px">Change together 14×, no import</span></div>' +
      W.head('coupling-head', 'What it hides', 'See what the code hides.', 'Layers broken upward, cycles, and files that always change together with nothing linking them.', 'left:110px;top:300px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.coupling-cam'), head: q('.coupling-head'), mods: all('.coupling-m'), bands: all('.coupling-b'), up: q('.coupling-up'), cy: all('.coupling-cy'), hid: q('.coupling-hid'), t: all('.coupling-cam .tag') });
    W.portrait(kit, { hoist: ['.coupling-head'], frame: [620, 1080], crop: [880, 180, 1000, 700], css: '.coupling-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 12, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.mods.forEach((m, i) => { m.style.opacity = eo(seg(t, 0.6 + i * 0.12, 1.0 + i * 0.12)); });
    this.bands.forEach((b, i) => W.draw(b, t, 1.4 + i * 0.12, 2.0 + i * 0.12, this.K));
    W.draw(this.up, t, 3.4, 4.2, this.K); W.pop(this.t[0], t, 4.2, this.K, 'translate(-50%,0)');
    this.cy.forEach((p, i) => W.draw(p, t, 5.4 + i * 0.4, 6.0 + i * 0.4, this.K)); W.pop(this.t[1], t, 6.4, this.K, 'translate(-50%,0)');
    W.draw(this.hid, t, 7.8, 8.8, this.K); W.pop(this.t[2], t, 8.8, this.K, 'translate(-50%,0)');
  },
});
