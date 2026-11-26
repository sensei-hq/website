// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('sessions', {
  init(kit) {
    kit.css('.sessions-ev { position:absolute; left:880px; width:430px; height:60px; box-sizing:border-box; display:flex; align-items:center; gap:14px; padding:0 18px; border-radius:14px; background:var(--tile); border:2px solid var(--hair); font-size:24px; box-shadow:0 6px 14px rgba(0,0,0,.04) }' +
      '.sessions-ev i { flex:none; width:14px; height:14px; border-radius:50%; background:var(--main) } .sessions-ev.hot i { background:var(--accent) } .sessions-ev em { margin-left:auto; font-style:normal; font-family:var(--mono); font-size:19px; color:var(--mute) }' +
      '.sessions-sum { left:1420px; top:200px; width:400px; box-sizing:border-box; padding:26px 30px; border-color:var(--main); border-width:3px; box-shadow:0 16px 34px rgba(0,0,0,.09) }' +
      '.sessions-sum h4 { margin:0 0 16px; font-size:24px; font-weight:600; letter-spacing:0.1em; color:var(--mute) } .sessions-kv { display:flex; justify-content:space-between; align-items:baseline; padding:12px 0; border-top:2px solid var(--hair); font-size:26px; white-space:nowrap }' +
      '.sessions-kv b { font-family:var(--display); font-weight:400; font-size:34px }');
    // One session as the events Sensei records (illustrative), then the session record they become.
    const E = [['Session start', '09:14', ''], ['Prompt', '“add rate limits”', ''], ['Tool call · Read', 'session.ts', ''], ['Tool result', '', ''], ['Tool call · Edit', 'limits.ts', ''],
      ['Prompt', '“revert that”', 'hot'], ['Tool call · Edit', 'limits.ts', ''], ['Session end', '09:28', '']];
    const K = [['Length', '14 min'], ['First turn', 'No'], ['Corrections', '1'], ['Tool calls', '23'], ['Tokens', '48k'], ['Context used', '61%']];
    kit.stage.append(kit.h('<div class="ground"><div class="cam sessions-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('sessions-bg') +
      '<path class="sessions-ar" pathLength="1" d="M1326 510 H1404" style="fill:none;stroke:var(--main);stroke-width:6;stroke-linecap:round"/></svg>' +
      E.map(([k, v, c], i) => '<div class="sessions-ev ' + c + '" style="top:' + (190 + i * 74) + 'px"><i></i>' + k + (v ? '<em>' + v + '</em>' : '') + '</div>').join('') +
      '<div class="card sessions-sum"><h4>SESSION · ILLUSTRATIVE</h4>' + K.map(([k, v]) => '<div class="sessions-kv">' + k + '<b>' + v + '</b></div>').join('') + '</div></div>' +
      W.head('sessions-head', 'Sessions', 'Every session, as events.', 'Prompts, tool calls and results become one record: how long, first time or not, what it cost.', 'left:110px;top:300px;width:700px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.sessions-cam'), head: q('.sessions-head'), ev: all('.sessions-ev'), sum: q('.sessions-sum'), kv: all('.sessions-kv'), ar: q('.sessions-ar') });
    W.portrait(kit, { hoist: ['.sessions-head'], frame: [640, 1080], crop: [865, 170, 970, 630], css: '.sessions-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 12.5, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.ev.forEach((e, i) => W.fade(e, t, 1.0 + i * 0.55, this.K, 0.35, 10));
    W.draw(this.ar, t, 6.0, 6.5, this.K);
    W.fade(this.sum, t, 6.3, this.K);
    this.kv.forEach((k, i) => W.fade(k, t, 6.8 + i * 0.35, this.K, 0.35, 8));
  },
});
