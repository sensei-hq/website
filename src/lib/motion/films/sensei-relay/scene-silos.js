// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01, TextFx } = kit;
// The six assistants of this film, by place on the board. Later scenes reuse this list.
W.crew = [
  { kind: 'spark', x: 1010, y: 330 }, { kind: 'brace', x: 1330, y: 330 }, { kind: 'ring', x: 1650, y: 330 },
  { kind: 'tri', x: 1010, y: 720 }, { kind: 'grid', x: 1330, y: 720 }, { kind: 'wave', x: 1650, y: 720 },
];
kit.scene('silos', {
  init(kit) {
    let art = '';
    W.crew.forEach((c, i) => {
      art += '<g class="silos-cell" data-i="' + i + '">' + W.silo('silos-silo') + '<g class="silos-bob">' + W.node('silos-node', c.kind, 'idle') + '</g>' +
        '<g class="silos-dots">' + [0, 1, 2].map(k => '<circle cx="' + (-22 + k * 22) + '" cy="-150" r="8" style="fill:var(--soft)"/>').join('') + '</g></g>';
    });
    kit.stage.append(kit.h('<div class="ground"><div class="cam silos-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('silos-dots-bg') + art + '</svg></div>' +
      '<div class="words silos-words" style="left:110px;top:330px;width:700px"><h1 class="line silos-line">Lots of assistants. Each one works alone.</h1><p class="sub silos-sub">Separate chats, separate context, no shared plan.</p></div></div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.cam = q('.silos-cam');
    this.cells = [...kit.stage.querySelectorAll('.silos-cell')].map((g, i) => ({ g, bob: g.querySelector('.silos-bob'), led: g.querySelector('.silos-node-led'), dots: [...g.querySelectorAll('.silos-dots circle')], c: W.crew[i] }));
    this.line = q('.silos-line'); this.sub = q('.silos-sub');
    W.portrait(kit, {"hoist": [".silos-words"], "frame": [560, 1300], "crop": [860, 160, 950, 720], "css": ".silos-words{left:70px!important;right:auto!important;top:140px!important;bottom:auto!important;width:940px!important;max-width:none!important;}"});
  },
  render(t) {
    this.cam.style.transform = 'scale(' + lerp(1.0, 1.035, eio(seg(t, 0, 6.5))) + ')';
    // Timed to the voiceover: the six assistants arrive across "an assistant for everything now".
    this.cells.forEach((o, i) => {
      const p = seg(t, -0.6 + i * 0.7, 0.1 + i * 0.7);
      const s = lerp(0.82, 1, eob(p, 1.6));
      o.g.setAttribute('transform', 'translate(' + o.c.x + ' ' + o.c.y + ') scale(' + s.toFixed(3) + ')');
      o.g.style.opacity = clamp01(p * 1.6);
      const bob = 4 * Math.sin(t * 1.9 + i * 1.1);
      o.bob.setAttribute('transform', 'translate(0 ' + bob.toFixed(2) + ')');
      // Each works on its own: a quiet typing dot pulse, never in step with the others.
      o.dots.forEach((d, k) => { d.setAttribute('cy', (-150 - 8 * Math.max(0, Math.sin(t * 3.4 + i * 0.9 - k * 0.7))).toFixed(1)); });
      o.led.style.opacity = 0.5 + 0.5 * Math.sin(t * 2.2 + i * 1.7);
    });
    TextFx.fadeFromRight(this.line, t, -0.5);
    // The sub lands on "but each one works alone".
    this.sub.style.opacity = eo(seg(t, 3.6, 4.2));
    this.sub.style.transform = 'translateX(' + lerp(28, 0, eo(seg(t, 3.6, 4.2))) + 'px)';
  },
});
