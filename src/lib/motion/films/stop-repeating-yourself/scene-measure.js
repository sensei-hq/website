// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('measure', {
  init(kit) {
    kit.css('.measure-chart { left:880px; top:140px; width:940px; height:680px; box-sizing:border-box; padding:28px 34px; box-shadow:0 14px 30px rgba(0,0,0,.07) }' +
      '.measure-chart h4 { margin:0; font-size:24px; font-weight:600; letter-spacing:0.08em; color:var(--mute) }' +
      '.measure-note { position:absolute; right:34px; top:30px; font-size:20px; color:var(--mute) }' +
      '.measure-verdict { left:1180px; top:860px }');
    // Illustrative only: no real numbers. Before the rule, sessions often needed correcting; after, more land first time.
    const v = [0.40, 0.36, 0.44, 0.39, 0.35, 0.43, 0.41, 0.52, 0.57, 0.61, 0.66, 0.63, 0.70, 0.73];
    this.v = v; this.base = 760; this.H = 460;
    const x0 = 950, w = 42, gap = 16;
    this.x = v.map((_, i) => x0 + i * (w + gap) + (i >= 7 ? 24 : 0));
    let bars = '';
    v.forEach((h, i) => { bars += '<rect class="measure-bar" x="' + this.x[i] + '" width="' + w + '" rx="8" style="fill:' + (i >= 7 ? 'var(--jade)' : 'var(--main)') + '"/>'; });
    const mx = this.x[7] - 21;
    kit.stage.append(kit.h('<div class="ground"><div class="cam measure-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('measure-bg') + '</svg>' +
      '<div class="card measure-chart"><h4>SESSIONS THAT LAND FIRST TIME</h4><span class="measure-note">Illustrative</span></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><line x1="930" x2="1790" y1="' + this.base + '" y2="' + this.base + '" style="stroke:var(--hair);stroke-width:3"/>' + bars +
      '<g class="measure-mark"><line x1="' + mx + '" x2="' + mx + '" y1="250" y2="' + this.base + '" style="stroke:var(--accent);stroke-width:4;stroke-dasharray:10 10"/></g></svg>' +
      '<span class="tag hot measure-rule" style="left:' + mx + 'px;top:208px">Rule in use</span>' +
      '<span class="tag ok measure-verdict">Kept: it helped</span></div>' +
      W.head('measure-head', 'Measured', 'Every change is measured.', 'If a rule helps, it stays. If it doesn’t, you’ll see that too.', 'left:110px;top:330px;width:660px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.measure-cam'), head: q('.measure-head'), chart: q('.measure-chart'), bars: all('.measure-bar'), mark: q('.measure-mark'), rule: q('.measure-rule'), verdict: q('.measure-verdict') });
    W.portrait(kit, { hoist: ['.measure-head'], frame: [600, 1180], crop: [860, 120, 980, 820], css: '.measure-head{left:70px!important;top:140px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 10, 1, 1.025, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    const cp = seg(t, 0.5, 1.1);
    this.chart.style.opacity = eo(cp);
    this.bars.forEach((b, i) => {
      const p = eob(seg(t, 1.2 + i * 0.16 + (i >= 7 ? 1.4 : 0), 1.7 + i * 0.16 + (i >= 7 ? 1.4 : 0)), 1.2), h = this.H * this.v[i] * clamp01(p);
      b.setAttribute('y', (this.base - h).toFixed(1)); b.setAttribute('height', Math.max(0, h).toFixed(1));
    });
    const m = seg(t, 2.5, 3.0);
    this.mark.style.opacity = eo(m); this.rule.style.opacity = eo(m);
    // The verdict lands on "and it stays".
    const vp = seg(t, 7.0, 7.4);
    this.verdict.style.opacity = eo(vp); this.verdict.style.transform = 'translate(-50%,0) scale(' + lerp(0.6, 1, eob(vp, 1.8)).toFixed(3) + ')';
  },
});
