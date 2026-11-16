// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('today', {
  init(kit) {
    kit.css('.today-hero { position:absolute; left:910px; top:250px; width:600px; box-sizing:border-box; padding:24px 28px; border-radius:18px; background:var(--ground); border:3px solid var(--accent) }' +
      '.today-hero h4 { margin:0 0 8px; font-size:20px; font-weight:600; letter-spacing:0.12em; color:var(--accent) } .today-hero p { margin:0; font-family:var(--display); font-size:36px; line-height:1.18 }' +
      '.today-rcpt { margin-top:14px !important; font-family:var(--sans) !important; font-size:21px !important; color:var(--mute) } .today-rcpt u { color:var(--second); text-decoration-color:var(--accent); text-underline-offset:4px }' +
      '.today-acts { display:flex; gap:10px; margin-top:18px } .today-acts span { padding:9px 20px; border-radius:999px; font-size:22px; font-weight:600; border:2px solid var(--hair) } .today-acts span:first-child { background:var(--main); color:var(--ground); border-color:var(--main) }' +
      '.today-ftr { position:absolute; left:1540px; top:250px; width:250px; box-sizing:border-box; padding:18px 22px; border-radius:16px; background:var(--ground); border:2px solid var(--hair) }' +
      '.today-ftr h4 { margin:0; font-size:19px; font-weight:600; letter-spacing:0.08em; color:var(--mute) } .today-ftr b { display:block; font-family:var(--display); font-weight:400; font-size:54px; color:var(--jade) }' +
      '.today-sup { position:absolute; left:910px; width:880px; height:56px; box-sizing:border-box; display:flex; align-items:center; gap:14px; padding:0 20px; border-radius:12px; background:var(--ground); border:2px solid var(--hair); font-size:23px }' +
      '.today-sup i { flex:none; width:12px; height:12px; border-radius:50%; background:var(--main) }' +
      '.today-ses { position:absolute; left:910px; top:742px; display:flex; gap:10px } .today-ses span { width:166px; height:40px; border-radius:10px; background:var(--ground); border:2px solid var(--hair) }');
    kit.stage.append(kit.h('<div class="ground"><div class="cam today-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('today-bg') + '</svg>' +
      W.win('today-win', 880, 160, 940, 640, 'Today') +
      '<div class="today-hero"><h4>ONE THING TODAY</h4><p>Auth keeps being edited before it’s read.</p><p class="today-rcpt">From <u>3 sessions</u> this week · see the receipts</p>' +
      '<div class="today-acts"><span>Apply</span><span>Review</span><span>Dismiss</span></div></div>' +
      '<div class="today-ftr"><h4>FIRST TURN</h4><b>68%</b><svg viewBox="0 0 200 40" style="width:100%;height:40px"><path class="today-spark" pathLength="1" d="M0 34 L30 30 L60 32 L90 24 L120 22 L150 16 L200 8" style="fill:none;stroke:var(--jade);stroke-width:4"/></svg></div>' +
      ['Reviews pass more often on small diffs', 'A rule was adopted for limits.ts', 'Context runs out late on long tasks'].map((s, i) => '<div class="today-sup" style="top:' + (552 + i * 62) + 'px;width:' + (i ? 880 : 880) + 'px"><i></i>' + s + '</div>').join('') +
      '<div class="today-ses"><span></span><span></span><span></span><span></span><span></span></div></div>' +
      W.head('today-head', 'Today', 'One thing, with its receipt.', 'The finding that needs you, where it came from, and one action.', 'left:110px;top:320px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.today-cam'), head: q('.today-head'), win: q('.today-win'), hero: q('.today-hero'), rcpt: q('.today-rcpt'), acts: all('.today-acts span'),
      ftr: q('.today-ftr'), spark: q('.today-spark'), sup: all('.today-sup'), ses: all('.today-ses span') });
    W.portrait(kit, { hoist: ['.today-head'], frame: [600, 1080], crop: [870, 150, 960, 660], css: '.today-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 12.5, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    W.fade(this.win, t, 0.5, this.K);
    W.pop(this.hero, t, 1.4, this.K);
    // The receipt (on "where it came from"), then the one action.
    this.rcpt.style.opacity = eo(seg(t, 3.2, 3.6));
    this.acts.forEach((a, i) => W.fade(a, t, 4.4 + i * 0.15, this.K, 0.35, 8));
    W.fade(this.ftr, t, 6.2, this.K); W.draw(this.spark, t, 6.5, 7.6, this.K);
    this.sup.forEach((s, i) => W.fade(s, t, 7.2 + i * 0.3, this.K, 0.4, 10));
    this.ses.forEach((s, i) => { s.style.opacity = eo(seg(t, 8.4 + i * 0.12, 8.7 + i * 0.12)); });
  },
});
