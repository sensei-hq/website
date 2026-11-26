// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01, TextFx } = kit;
Object.assign(W, {
  // The person at the keyboard, as a pointer: the tip sits at (0,0).
  pointer(cls) {
    return '<g class="' + cls + '"><path d="M4 8 L4 62 L18 49 L30 74 L42 68 L30 44 L48 44 Z" style="fill:var(--shade)"/>' +
      '<path d="M0 0 L0 56 L14 43 L26 68 L38 62 L26 38 L44 38 Z" style="fill:var(--second);stroke:var(--ground);stroke-width:4;stroke-linejoin:round"/></g>';
  },
});
kit.scene('manual', {
  init(kit) {
    let art = '';
    W.crew.forEach((c, i) => {
      art += '<g class="manual-cell" transform="translate(' + c.x + ' ' + c.y + ')">' + W.silo('manual-silo') + '<g class="manual-bob">' + W.node('manual-node', c.kind, 'idle') + '</g></g>';
    });
    kit.stage.append(kit.h('<div class="ground"><div class="cam manual-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('manual-bg') + art +
      '<g class="manual-loop" transform="translate(1330 720)"><circle r="150" pathLength="1" style="fill:none;stroke:var(--accent);stroke-width:8;stroke-linecap:round;stroke-dasharray:0.82 0.18"/><path d="M150 -28 L132 6 L170 4 Z" style="fill:var(--accent)"/></g>' +
      '<g class="manual-card">' + W.card('manual-slip') + '</g><g class="manual-you">' + W.pointer('manual-ptr') + '</g></svg></div>' +
      '<div class="tag ctl manual-tag" style="left:0;top:0">You</div>' +
      '<div class="tag manual-self" style="left:1330px;top:905px">Self-review, again</div>' +
      '<div class="words manual-words" style="left:110px;top:150px;width:680px"><h2 class="line manual-line">So you become the relay.</h2><p class="sub manual-sub">Copying tasks between chats, passing messages along, and checking every result yourself.</p></div></div>'));
    const q = (s) => kit.stage.querySelector(s);
    Object.assign(this, { cam: q('.manual-cam'), card: q('.manual-card'), you: q('.manual-you'), tag: q('.manual-tag'), self: q('.manual-self'), loop: q('.manual-loop'), line: q('.manual-line'), sub: q('.manual-sub') });
    this.bobs = [...kit.stage.querySelectorAll('.manual-bob')];
    this.leds = [...kit.stage.querySelectorAll('.manual-node-led')];
    // The errand: pick up at one assistant, carry to the next, carry the result on, then review it alone.
    // Timed to the voiceover: pick-up on "copying tasks", drop on "passing messages", review on "reviewing every result".
    this.keys = [[0, 800, 880], [1.2, 1040, 360], [1.6, 1040, 360], [3.2, 1680, 360], [3.6, 1680, 360], [5.2, 1360, 750], [6.8, 1360, 750]];
    W.portrait(kit, {"hoist": [".manual-words"], "frame": [520, 1340], "crop": [760, 150, 1060, 810], "css": ".manual-words{left:70px!important;right:auto!important;top:140px!important;bottom:auto!important;width:940px!important;max-width:none!important;}"});
  },
  at(t) {
    const k = this.keys;
    if (t <= k[0][0]) return [k[0][1], k[0][2]];
    for (let i = 1; i < k.length; i++) if (t <= k[i][0]) { const p = eio(seg(t, k[i - 1][0], k[i][0])); return [lerp(k[i - 1][1], k[i][1], p), lerp(k[i - 1][2], k[i][2], p) - Math.sin(p * Math.PI) * 90]; }
    return [k[k.length - 1][1], k[k.length - 1][2]];
  },
  render(t) {
    this.cam.style.transform = 'scale(' + lerp(1.035, 1.06, eio(seg(t, 0, 7.5))) + ')';
    this.bobs.forEach((b, i) => b.setAttribute('transform', 'translate(0 ' + (4 * Math.sin(t * 1.9 + i * 1.1)).toFixed(2) + ')'));
    let [x, y] = this.at(t);
    // During the review the pointer circles the work, round and round.
    const rv = seg(t, 5.6, 8);
    if (rv > 0) { const a = rv * Math.PI * 3.2; x += Math.sin(a) * 40 * eo(seg(t, 5.6, 6.0)); y += (1 - Math.cos(a)) * 20 * eo(seg(t, 5.6, 6.0)); }
    const press = (t > 1.2 && t < 1.6) || (t > 3.2 && t < 3.6) ? 0.9 : 1;
    this.you.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(' + press + ')');
    this.tag.style.left = (x + 70) + 'px'; this.tag.style.top = (y + 70) + 'px';
    this.tag.style.transform = 'translate(-20%, 0) scale(' + (this.cam.style.transform ? 1 : 1) + ')';
    // The card rides under the pointer between pick-up and drop.
    const held = t > 1.3 && t < 5.4;
    const pop = eob(seg(t, 1.25, 1.55), 1.7), land = seg(t, 5.2, 5.6);
    const cs = held ? lerp(0.3, 1, pop) : lerp(1, 0.35, eo(land));
    this.card.setAttribute('transform', 'translate(' + (x - 30).toFixed(1) + ' ' + (y - 12).toFixed(1) + ') rotate(' + (-6 + 4 * Math.sin(t * 3)).toFixed(2) + ') scale(' + cs.toFixed(3) + ')');
    this.card.style.opacity = t < 1.25 ? 0 : (t < 5.4 ? 1 : 1 - land);
    this.leds.forEach((l, i) => { const on = (i === 0 && t > 1.2 && t < 2.2) || (i === 2 && t > 3.2 && t < 4.3) || (i === 4 && t > 5.3); l.style.fill = on ? 'var(--accent)' : 'color-mix(in srgb, var(--second) 20%, var(--tile))'; });
    const lp = seg(t, 5.7, 8);
    this.loop.style.opacity = eo(seg(t, 5.6, 6.0));
    this.loop.setAttribute('transform', 'translate(1330 720) rotate(' + (lp * 300).toFixed(1) + ')');
    this.self.style.opacity = eo(seg(t, 5.9, 6.3));
    this.self.style.transform = 'translate(-50%, ' + lerp(16, 0, eo(seg(t, 5.9, 6.3))) + 'px)';
    TextFx.fadeFromRight(this.line, t, 0.15);
    this.sub.style.opacity = eo(seg(t, 0.9, 1.5));
    this.sub.style.transform = 'translateX(' + lerp(28, 0, eo(seg(t, 0.9, 1.5))) + 'px)';
  },
});
