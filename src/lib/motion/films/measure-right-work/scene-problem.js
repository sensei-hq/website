// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('problem', {
  init(kit) {
    kit.css('.problem-chart { left:900px; top:170px; width:900px; height:640px; box-sizing:border-box; padding:26px 32px; box-shadow:0 14px 30px rgba(0,0,0,.07) }' +
      '.problem-chart h4 { margin:0; font-size:24px; font-weight:600; letter-spacing:0.08em; color:var(--mute) } .problem-note { position:absolute; right:32px; top:28px; font-size:20px; color:var(--mute) }' +
      '.problem-key { position:absolute; left:940px; top:840px; display:flex; gap:28px; font-size:24px; color:var(--mute) } .problem-key i { display:inline-block; width:18px; height:18px; border-radius:5px; margin-right:10px; vertical-align:-2px }');
    // Activity per day for two weeks (illustrative). The bad week is taller: much of it is fixing.
    const good = [0.42, 0.5, 0.46, 0.55, 0.48], badNew = [0.3, 0.26, 0.32, 0.28, 0.3], badFix = [0.36, 0.44, 0.4, 0.5, 0.46];
    const base = 740, H = 480, x = (i) => 960 + i * 76 + (i >= 5 ? 60 : 0);
    let bars = '';
    good.forEach((h, i) => { bars += '<rect class="problem-bar" data-h="' + h * H + '" data-b="0" x="' + x(i) + '" width="54" rx="8" style="fill:var(--main)"/>'; });
    badNew.forEach((h, i) => {
      bars += '<rect class="problem-bar" data-h="' + h * H + '" data-b="0" x="' + x(i + 5) + '" width="54" rx="8" style="fill:var(--main)"/>';
      bars += '<rect class="problem-bar" data-h="' + badFix[i] * H + '" data-b="' + h * H + '" x="' + x(i + 5) + '" width="54" rx="8" style="fill:var(--accent)"/>';
    });
    kit.stage.append(kit.h('<div class="ground"><div class="cam problem-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('problem-bg') + '</svg>' +
      '<div class="card problem-chart"><h4>ACTIVITY PER DAY</h4><span class="problem-note">Illustrative</span></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><line x1="940" x2="1770" y1="' + base + '" y2="' + base + '" style="stroke:var(--hair);stroke-width:3"/>' + bars + '</svg>' +
      '<span class="tag ok problem-ga" style="left:' + (x(2) + 27) + 'px;top:' + (base - 0.55 * H - 70) + 'px">Going well</span>' +
      '<span class="tag hot problem-ba" style="left:' + (x(7) + 27) + 'px;top:' + (base - 0.8 * H - 70) + 'px">Going badly</span>' +
      '<div class="problem-key"><span><i style="background:var(--main)"></i>New work</span><span class="problem-kf"><i style="background:var(--accent)"></i>Fixing</span></div></div>' +
      W.head('problem-head', 'The problem', 'Volume is a vanity metric.', 'It goes up when work goes badly too: fixing things is also activity.', 'left:110px;top:300px;width:700px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, base, cam: q('.problem-cam'), head: q('.problem-head'), chart: q('.problem-chart'), bars: all('.problem-bar'), ga: q('.problem-ga'), ba: q('.problem-ba'), key: q('.problem-key') });
    W.portrait(kit, { hoist: ['.problem-head'], frame: [640, 1000], crop: [880, 150, 940, 740], css: '.problem-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 8.5, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.chart.style.opacity = eo(seg(t, 0.4, 0.9));
    // Good week first, then the bad week grows taller, its fixing stacked on top.
    this.bars.forEach((r, i) => {
      const a = i < 5 ? 1.0 + i * 0.15 : 3.0 + Math.floor((i - 5) / 2) * 0.2 + ((i - 5) % 2) * 0.5;
      const h = +r.dataset.h * eob(seg(t, a, a + 0.5), 1.1), b = +r.dataset.b;
      r.setAttribute('y', (this.base - b - Math.max(0, h)).toFixed(1)); r.setAttribute('height', Math.max(0, h).toFixed(1));
    });
    W.pop(this.ga, t, 2.0, this.K, 'translate(-50%,0)');
    W.pop(this.ba, t, 5.0, this.K, 'translate(-50%,0)');
    W.fade(this.key, t, 5.4, this.K);
  },
});
