// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('pair', {
  init(kit) {
    kit.css('.pair-card { top:150px; width:460px; height:470px; box-sizing:border-box; padding:24px 28px; box-shadow:0 14px 30px rgba(0,0,0,.07) }' +
      '.pair-card h4 { margin:0; width:270px; font-size:30px; line-height:1.2; font-weight:600 } .pair-card p { margin:6px 0 0; font-size:23px; line-height:1.3; color:var(--mute); width:300px }' +
      '.pair-num { position:absolute; right:26px; top:18px; font-family:var(--display); font-size:64px; line-height:1 }' +
      '.pair-warn { left:880px; top:650px; width:940px; height:180px; box-sizing:border-box; padding:24px 28px 24px 330px; border-color:var(--accent); box-shadow:0 14px 30px rgba(0,0,0,.08); display:flex; align-items:center; font-size:32px; line-height:1.3 }' +
      '.pair-warn b { color:var(--accent); font-weight:600 } .pair-lab { font:600 20px var(--sans); letter-spacing:0.06em }');
    // Illustrative: 20 sessions, 6 needed a correction (70% first-turn resolution); those took 24% of the effort.
    const hit = [2, 4, 7, 11, 13, 18];
    let dots = '';
    for (let i = 0; i < 20; i++) {
      const cx = 940 + (i % 5) * 84, cy = 400 + Math.floor(i / 5) * 60, bad = hit.includes(i);
      dots += '<circle class="pair-dot" data-bad="' + (bad ? 1 : 0) + '" cx="' + cx + '" cy="' + cy + '" r="20" style="fill:var(--jade)"/>';
    }
    const bar = '<g class="pair-bar"><rect x="1400" y="420" width="380" height="64" rx="14" style="fill:var(--main)"/><rect class="pair-rw" x="1400" y="420" width="0" height="64" rx="14" style="fill:var(--accent)"/>' +
      '<text class="pair-lab" x="1400" y="520" style="fill:var(--accent)">CORRECTED SESSIONS</text><text class="pair-lab" x="1780" y="520" text-anchor="end" style="fill:var(--main)">THE REST</text></g>';
    // Read together: resolution holds high while rework climbs.
    const spark = '<g class="pair-spark"><path class="pair-sf" pathLength="1" d="M915 720 L960 714 L1005 718 L1050 712 L1095 710 L1140 712 L1185 708" style="fill:none;stroke:var(--jade);stroke-width:6;stroke-linecap:round"/>' +
      '<path class="pair-sr" pathLength="1" d="M915 800 L960 796 L1005 788 L1050 782 L1095 770 L1140 760 L1185 744" style="fill:none;stroke:var(--accent);stroke-width:6;stroke-linecap:round"/>' +
      '<text class="pair-lab" x="915" y="696" style="fill:var(--jade)">RESOLUTION</text><text class="pair-lab" x="915" y="822" style="fill:var(--accent)">REWORK</text></g>';
    kit.stage.append(kit.h('<div class="ground"><div class="cam pair-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('pair-bg') + '</svg>' +
      '<div class="card pair-card pair-a" style="left:880px"><h4>First-turn resolution</h4><p>Sessions done without a correction turn</p><span class="pair-num" style="color:var(--jade)"><span class="pair-na">0</span>%</span></div>' +
      '<div class="card pair-card pair-b" style="left:1360px"><h4>Rework share</h4><p>Effort that came from corrected sessions</p><span class="pair-num" style="color:var(--accent)"><span class="pair-nb">0</span>%</span></div>' +
      '<div class="card pair-warn"><span>High resolution and <b>rising rework</b>: work deferred, not done.</span></div>' +
      '<svg class="art" viewBox="0 0 1920 1080">' + dots + bar + spark + '</svg></div>' +
      W.head('pair-head', 'The pair', 'Two numbers, read together.', 'Never read a speed metric alone.', 'left:110px;top:320px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.pair-cam'), head: q('.pair-head'), a: q('.pair-a'), b: q('.pair-b'), warn: q('.pair-warn'), dots: all('.pair-dot'), rw: q('.pair-rw'),
      na: q('.pair-na'), nb: q('.pair-nb'), spark: q('.pair-spark'), bar: q('.pair-bar'), sf: q('.pair-sf'), sr: q('.pair-sr'), barLabs: [...kit.stage.querySelectorAll('.pair-lab')].slice(0, 2) });
    W.portrait(kit, { hoist: ['.pair-head'], frame: [600, 1100], crop: [865, 135, 970, 710], css: '.pair-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 17, 1, 1.015, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    // Metric one: sessions arrive; the ones that needed correcting turn red.
    W.fade(this.a, t, 0.8, this.K);
    this.dots.forEach((d, i) => {
      d.style.opacity = eo(seg(t, 1.2 + i * 0.06, 1.5 + i * 0.06));
      d.style.fill = d.dataset.bad === '1' && t > 2.9 ? 'var(--accent)' : 'var(--jade)';
    });
    this.na.textContent = Math.round(70 * eio(seg(t, 3.0, 3.9)));
    // Metric two (on "rework share"): the effort those sessions took.
    W.fade(this.b, t, 5.6, this.K);
    const r = eio(seg(t, 6.2, 7.6));
    this.rw.setAttribute('width', (380 * 0.24 * r).toFixed(1));
    this.nb.textContent = Math.round(24 * r);
    this.bar.style.opacity = eo(seg(t, 5.7, 6.1));
    // Read together, on "read them together".
    W.fade(this.warn, t, 10.4, this.K);
    this.spark.style.opacity = eo(seg(t, 10.4, 10.8));
    W.draw(this.sf, t, 10.6, 12.0, this.K); W.draw(this.sr, t, 10.8, 12.2, this.K);
  },
});
