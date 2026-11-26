// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('trend', {
  init(kit) {
    kit.css('.trend-chart { left:900px; top:170px; width:900px; height:640px; box-sizing:border-box; padding:26px 32px; box-shadow:0 14px 30px rgba(0,0,0,.07) }' +
      '.trend-chart h4 { margin:0; font-size:24px; font-weight:600; letter-spacing:0.08em; color:var(--mute) } .trend-note { position:absolute; right:32px; top:28px; font-size:20px; color:var(--mute) }' +
      '.trend-lab { position:absolute; font-size:30px; font-weight:600; white-space:nowrap }');
    // Duplication over a year for two codebases (illustrative): A is higher but falling, B lower but climbing.
    const x = (i) => 980 + i * 64, y = (v) => 740 - v * 29;
    const A = [14, 13.6, 13, 12.4, 12, 11.2, 10.6, 10, 9.4, 8.9, 8.4, 8], B = [1, 1.2, 1.4, 1.7, 1.9, 2.2, 2.5, 2.8, 3.1, 3.4, 3.7, 4];
    const d = (v) => 'M' + v.map((n, i) => x(i) + ' ' + y(n).toFixed(1)).join(' L');
    let grid = '';
    [0, 5, 10, 15].forEach((v) => { grid += '<line x1="960" x2="1740" y1="' + y(v) + '" y2="' + y(v) + '" style="stroke:var(--hair);stroke-width:2"/><text x="948" y="' + (y(v) + 8) + '" text-anchor="end" style="font:20px var(--sans);fill:var(--mute)">' + v + '%</text>'; });
    kit.stage.append(kit.h('<div class="ground"><div class="cam trend-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('trend-bg') + '</svg>' +
      '<div class="card trend-chart"><h4>DUPLICATION, ONE YEAR</h4><span class="trend-note">Illustrative</span></div>' +
      '<svg class="art" viewBox="0 0 1920 1080">' + grid +
      '<path class="trend-a" pathLength="1" d="' + d(A) + '" style="fill:none;stroke:var(--jade);stroke-width:8;stroke-linecap:round;stroke-linejoin:round"/>' +
      '<path class="trend-b" pathLength="1" d="' + d(B) + '" style="fill:none;stroke:var(--accent);stroke-width:8;stroke-linecap:round;stroke-linejoin:round"/>' +
      '<circle class="trend-da" cx="' + x(11) + '" cy="' + y(8) + '" r="11" style="fill:var(--jade)"/><circle class="trend-db" cx="' + x(11) + '" cy="' + y(4) + '" r="11" style="fill:var(--accent)"/></svg>' +
      '<span class="trend-lab trend-la" style="left:1350px;top:' + (y(11) - 64) + 'px;color:var(--jade)">8% and falling</span>' +
      '<span class="trend-lab trend-lb" style="left:1430px;top:684px;color:var(--accent)">4% and climbing</span>' +
      '<span class="tag ok trend-va" style="left:' + x(11) + 'px;top:' + (y(8) - 92) + 'px">Healthier</span></div>' +
      W.head('trend-head', 'Read the trend', 'Direction beats a single number.', 'Quality is a trajectory.', 'left:110px;top:320px;width:700px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    Object.assign(this, { K: kit, cam: q('.trend-cam'), head: q('.trend-head'), chart: q('.trend-chart'), a: q('.trend-a'), b: q('.trend-b'), da: q('.trend-da'), db: q('.trend-db'),
      la: q('.trend-la'), lb: q('.trend-lb'), va: q('.trend-va') });
    W.portrait(kit, { hoist: ['.trend-head'], frame: [640, 1000], crop: [880, 150, 940, 680], css: '.trend-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 8.5, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.chart.style.opacity = eo(seg(t, 0.5, 1.0));
    W.draw(this.b, t, 1.2, 3.2, this.K);
    W.fade(this.lb, t, 3.0, this.K);
    this.db.style.opacity = eo(seg(t, 3.0, 3.3));
    W.draw(this.a, t, 3.2, 5.2, this.K);
    W.fade(this.la, t, 5.0, this.K);
    this.da.style.opacity = eo(seg(t, 5.0, 5.3));
    // The verdict lands on "trajectory".
    W.pop(this.va, t, 6.2, this.K, 'translate(-50%,0)');
  },
});
