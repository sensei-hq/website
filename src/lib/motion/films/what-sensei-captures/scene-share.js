// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('share', {
  init(kit) {
    kit.css('.share-prev { left:900px; top:170px; width:600px; height:600px; box-sizing:border-box; padding:24px 30px; border-color:var(--main); border-width:3px; box-shadow:0 16px 34px rgba(0,0,0,.09) }' +
      '.share-prev h4 { margin:0 0 14px; font-size:24px; font-weight:600; letter-spacing:0.1em; color:var(--mute) } .share-rule { font-family:var(--display); font-size:36px; line-height:1.2; margin:0 0 20px }' +
      '.share-row { display:flex; gap:14px; align-items:center; padding:12px 0; border-top:2px solid var(--hair); font-size:25px } .share-row b { flex:none; width:170px; font-weight:600 }' +
      '.share-row span { position:relative; white-space:nowrap } .share-row span s { position:absolute; left:-4px; right:-4px; top:50%; height:4px; background:var(--accent); transform-origin:0 50% }' +
      '.share-row em { font-style:normal; color:var(--jade); font-weight:600; margin-left:8px }' +
      '.share-btn { position:absolute; left:1270px; top:690px; padding:14px 30px; border-radius:999px; background:var(--main); color:var(--ground); font-size:26px; font-weight:600 }' +
      '.share-dojo { left:1580px; top:330px; width:240px; height:240px; box-sizing:border-box; padding:150px 16px 0; text-align:center; font-size:28px; font-weight:600; border-style:dashed; border-width:3px }');
    // What would leave, shown before it leaves: the rule, never the code, with names stripped. Then you confirm.
    kit.stage.append(kit.h('<div class="ground"><div class="cam share-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('share-bg') + '</svg>' +
      '<div class="card share-prev"><h4>PREVIEW · WHAT WOULD BE SHARED</h4><p class="share-rule">Reuse the existing rate limiter; don’t add a second one.</p>' +
      '<div class="share-row"><b>Code</b><span>Not shared</span></div>' +
      '<div class="share-row"><b>Transcript</b><span>Not shared</span></div>' +
      '<div class="share-row"><b>Repository</b><span class="share-name">acme/billing<s></s></span><em>anonymised</em></div>' +
      '<div class="share-row"><b>Evidence</b><span>4 sessions, as counts</span></div></div>' +
      '<div class="share-btn">Share</div><div class="card share-dojo">Your dōjō</div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><path class="share-fly" pathLength="1" d="M1440 700 Q1560 640 1640 520" style="fill:none;stroke:var(--jade);stroke-width:5;stroke-dasharray:1 1;stroke-linecap:round"/>' +
      '<g transform="translate(1700 400)">' + W.node('share-team', 'ring', 'ok', 96) + '</g>' + W.pointer('share-ptr') + '</svg></div>' +
      W.head('share-head', 'Your choice', 'Sharing is yours to choose.', 'Opt in, see exactly what would leave, anonymised, then confirm.', 'left:110px;top:320px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.share-cam'), head: q('.share-head'), prev: q('.share-prev'), rows: all('.share-row'), strike: q('.share-name s'), em: q('.share-row em'),
      btn: q('.share-btn'), dojo: q('.share-dojo'), team: q('.share-team'), fly: q('.share-fly'), ptr: q('.share-ptr') });
    W.portrait(kit, { hoist: ['.share-head'], frame: [640, 1000], crop: [880, 150, 960, 640], css: '.share-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 12, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    W.fade(this.prev, t, 0.8, this.K);
    this.rows.forEach((r, i) => W.fade(r, t, 1.8 + i * 0.6, this.K, 0.4, 10));
    this.strike.style.transform = 'scaleX(' + eio(seg(t, 3.6, 4.1)).toFixed(3) + ')';
    this.em.style.opacity = eo(seg(t, 4.1, 4.4));
    W.fade(this.btn, t, 5.0, this.K); W.fade(this.dojo, t, 5.0, this.K); this.team.style.opacity = eo(seg(t, 5.2, 5.6));
    // The pointer presses Share; only then does it go.
    const pp = eio(seg(t, 5.8, 7.0));
    this.ptr.setAttribute('transform', 'translate(' + lerp(1620, 1360, pp).toFixed(1) + ' ' + lerp(860, 712, pp).toFixed(1) + ')');
    this.ptr.style.opacity = eo(seg(t, 5.6, 6.0)) * (1 - eo(seg(t, 8.6, 9.0)));
    const press = t > 7.1 && t < 7.4;
    this.btn.style.transform = 'scale(' + (press ? 0.94 : 1) + ')'; this.btn.style.background = t > 7.2 ? 'var(--jade)' : 'var(--main)';
    W.draw(this.fly, t, 7.4, 8.4, this.K);
    this.dojo.style.borderStyle = t > 8.4 ? 'solid' : 'dashed'; this.dojo.style.borderColor = t > 8.4 ? 'var(--jade)' : 'var(--hair)';
  },
});
