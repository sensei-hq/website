// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('gateway', {
  init(kit) {
    kit.css('.gateway-ask { position:absolute; left:880px; width:270px; height:54px; white-space:nowrap; box-sizing:border-box; padding:12px 16px; border-radius:12px; background:var(--tile); border:2px solid var(--hair); font-size:21px; line-height:1.25 }' +
      '.gateway-chips { position:absolute; left:1500px; top:590px; width:320px; display:flex; flex-wrap:wrap; gap:8px } .gateway-chips span { padding:6px 12px; border-radius:999px; font-family:var(--mono); font-size:17px; background:var(--ground); border:2px solid var(--hair) }' +
      '.gateway-fb { left:1240px; top:566px }');
    // Calls from Sensei → one gateway → a model chosen per task, with fallback when a provider is down.
    const asks = ['Summarise a session', 'Consolidate memories', 'Suggest a doc fix'];
    const T = [[1500, 215, '火', 'Embedded Ollama', 'Default: Gemma 4, offline'], [1500, 335, '火', 'Your Ollama host', 'Bigger models, your GPUs'], [1500, 455, '雲', 'Cloud models', 'Bring your own keys']];
    kit.stage.append(kit.h('<div class="ground"><div class="cam gateway-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('gateway-bg') +
      asks.map((_, i) => '<path class="gateway-in" pathLength="1" d="M1150 ' + (280 + i * 110) + ' C1172 ' + (280 + i * 110) + ' 1172 390 1195 390" style="fill:none;stroke:var(--wire);stroke-width:4"/>').join('') +
      T.map(([x, y], i) => '<path class="gateway-out" pathLength="1" d="M1435 390 C1468 390 1468 ' + (y + 55) + ' ' + x + ' ' + (y + 55) + '" style="fill:none;stroke:' + (i === 0 ? 'var(--accent)' : 'var(--wire)') + ';stroke-width:' + (i === 0 ? 6 : 4) + '"/>').join('') +
      '<g transform="translate(1480 390) scale(0.7)"><g class="gateway-x">' + W.cross('') + '</g></g></svg>' +
      asks.map((s, i) => '<div class="gateway-ask" style="top:' + (253 + i * 110) + 'px">' + s + '</div>').join('') +
      W.box('gateway-gw', 1195, 330, 240, 120, '門', 'Gateway', 'Picks the model for each task', 'var(--accent)', ';border:3px solid var(--accent)') +
      T.map(([x, y, k, a, b]) => W.box('gateway-t', x, y, 320, 110, k, a, b, 'var(--soft)')).join('') +
      '<div class="gateway-chips"><span>Claude</span><span>GPT-4o</span><span>Qwen 2.5</span><span>Kimi K2</span></div>' +
      '<span class="tag hot gateway-fb">Provider down: next in chain</span></div>' +
      W.head('gateway-head', 'The gateway', 'One way in to every model.', 'Fast and local by default; your own models and keys when you want them.', 'left:110px;top:300px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.gateway-cam'), head: q('.gateway-head'), asks: all('.gateway-ask'), ins: all('.gateway-in'), gw: q('.gateway-gw'), outs: all('.gateway-out'),
      ts: all('.gateway-t'), chips: all('.gateway-chips span'), x: q('.gateway-x'), fb: q('.gateway-fb') });
    W.portrait(kit, { hoist: ['.gateway-head'], frame: [620, 1000], crop: [860, 200, 980, 560], css: '.gateway-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 13, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.asks.forEach((a, i) => W.fade(a, t, 0.8 + i * 0.3, this.K));
    this.ins.forEach((p, i) => W.draw(p, t, 1.6 + i * 0.2, 2.2 + i * 0.2, this.K));
    W.pop(this.gw, t, 2.4, this.K);
    // Embedded first (on "fast and local"), then the optional targets.
    W.fade(this.ts[0], t, 3.6, this.K); W.draw(this.outs[0], t, 3.8, 4.4, this.K);
    W.fade(this.ts[1], t, 5.4, this.K); W.draw(this.outs[1], t, 5.6, 6.2, this.K);
    W.fade(this.ts[2], t, 6.4, this.K); W.draw(this.outs[2], t, 6.6, 7.2, this.K);
    this.chips.forEach((c, i) => W.fade(c, t, 7.0 + i * 0.15, this.K, 0.3, 6));
    // A provider goes down; the call moves on.
    W.pop(this.x, t, 9.0, this.K); this.x.style.transformBox = 'fill-box'; this.x.style.transformOrigin = 'center';
    this.outs[1].style.opacity = t > 9.0 ? 0.3 : 1;
    W.pop(this.fb, t, 9.4, this.K, 'translate(-50%,0)');
  },
});
