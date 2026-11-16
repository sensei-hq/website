// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('relay', {
  init(kit) {
    kit.css('.relay-phone { position:absolute; left:1430px; top:150px; width:340px; height:680px; box-sizing:border-box; padding:10px; border-radius:42px; background:var(--soft); box-shadow:0 14px 30px rgba(0,0,0,.10) }' +
      '.relay-screen { height:100%; box-sizing:border-box; padding:34px 14px 16px; border-radius:33px; background:var(--ground); display:flex; flex-direction:column; gap:12px }' +
      '.relay-n { box-sizing:border-box; padding:12px 14px; border-radius:14px; background:var(--tile); border:2px solid var(--hair); font-size:19px; line-height:1.3 }' +
      '.relay-n b { display:block; font-size:15px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--mute); margin-bottom:4px } .relay-n.hot { border-color:var(--accent) } .relay-n.hot b { color:var(--accent) }' +
      '.relay-acts { display:flex; gap:8px; margin-top:10px } .relay-acts span { padding:6px 14px; border-radius:999px; font-size:17px; font-weight:600; border:2px solid var(--hair) } .relay-acts span:first-child { background:var(--main); color:var(--ground); border-color:var(--main) }' +
      '.relay-bar { height:8px; border-radius:4px; background:var(--hair); margin-top:8px; overflow:hidden } .relay-bar i { display:block; height:100%; width:0; background:var(--jade) }' +
      '.relay-not { position:absolute; left:900px; top:690px; width:440px; font-size:22px; line-height:1.4; color:var(--mute) }');
    // Your laptop runs the work; your phone, paired over an encrypted channel, gets only status and the decisions you're asked to make.
    kit.stage.append(kit.h('<div class="ground"><div class="cam relay-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('relay-bg') +
      '<g class="relay-lap"><rect x="930" y="300" width="340" height="220" rx="16" style="fill:var(--tile);stroke:var(--main);stroke-width:5"/><rect x="890" y="520" width="420" height="26" rx="10" style="fill:var(--main)"/>' +
      W.bars('', 960, 336, [[0, 180, 'ink'], [20, 220], [20, 160, 'ok'], [0, 120], [20, 200]], 34, 12) + '</g>' +
      '<path class="relay-link" pathLength="1" d="M1290 420 Q1360 380 1420 420" style="fill:none;stroke:var(--jade);stroke-width:5;stroke-dasharray:10 10"/>' +
      '<g class="relay-lock" transform="translate(1356 360)"><path d="M-10 -2 V-10 Q-10 -20 0 -20 Q10 -20 10 -10 V-2" style="fill:none;stroke:var(--jade);stroke-width:4"/><rect x="-14" y="-2" width="28" height="22" rx="5" style="fill:var(--jade)"/></g></svg>' +
      '<div class="relay-phone"><div class="relay-screen">' +
      '<div class="relay-n"><b>Run · auth refactor</b>Step 4 of 7<div class="relay-bar"><i></i></div></div>' +
      '<div class="relay-n hot"><b>Needs you</b>Push to main?<div class="relay-acts"><span>Approve</span><span>Decline</span></div></div>' +
      '<div class="relay-n"><b>Question</b>Keep the old token format for a week?<div class="relay-acts"><span>Yes</span><span>No</span></div></div></div></div>' +
      '<p class="relay-not">Only status and the choices you’re asked to make cross over. Never code or transcripts.</p></div>' +
      W.head('relay-head', 'Relay', 'Stay in the loop, away from the keyboard.', 'Watch a run, approve a gated action, answer a question, from your phone.', 'left:110px;top:300px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.relay-cam'), head: q('.relay-head'), lap: q('.relay-lap'), link: q('.relay-link'), lock: q('.relay-lock'), phone: q('.relay-phone'), ns: all('.relay-n'), bar: q('.relay-bar i'), acts: all('.relay-acts span'), not: q('.relay-not') });
    W.portrait(kit, { hoist: ['.relay-head'], frame: [620, 1060], crop: [870, 140, 960, 700], css: '.relay-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 11, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.lap.style.opacity = eo(seg(t, 0.6, 1.1));
    W.fade(this.phone, t, 1.4, this.K, 0.6, 40);
    W.draw(this.link, t, 2.2, 3.0, this.K); this.lock.style.opacity = eo(seg(t, 2.8, 3.2));
    this.ns.forEach((n, i) => W.fade(n, t, 3.4 + i * 1.3, this.K, 0.4, 10));
    this.bar.style.width = (100 * (0.3 + 0.27 * eio(seg(t, 3.8, 6)))).toFixed(1) + '%';
    const press = t > 6.6 && t < 6.9; this.acts[0].style.transform = 'scale(' + (press ? 0.9 : 1) + ')'; this.acts[0].style.background = t > 6.8 ? 'var(--jade)' : '';
    this.acts[0].style.borderColor = t > 6.8 ? 'var(--jade)' : '';
    W.fade(this.not, t, 7.8, this.K);
  },
});
