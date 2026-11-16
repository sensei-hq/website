// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('streams', {
  init(kit) {
    kit.css('.streams-src { position:absolute; left:880px; width:360px; height:130px; box-sizing:border-box; padding:20px 24px 0 98px; box-shadow:0 10px 22px rgba(0,0,0,.06) }' +
      '.streams-src h4 { margin:0; font-size:30px; font-weight:600 } .streams-src p { margin:6px 0 0; font-size:22px; line-height:1.3; color:var(--mute) }' +
      '.streams-src svg { position:absolute; left:22px; top:30px; width:60px; height:60px }' +
      '.streams-store { left:1470px; top:330px; width:350px; height:330px; box-sizing:border-box; padding:200px 26px 0; text-align:center; border-color:var(--main); border-width:3px; box-shadow:0 16px 34px rgba(0,0,0,.09) }' +
      '.streams-store h4 { margin:0; font-size:32px; font-weight:600 } .streams-store p { margin:6px 0 0; font-size:22px; color:var(--jade); font-weight:600; letter-spacing:0.06em; text-transform:uppercase }');
    const ic = (b) => '<svg viewBox="-30 -30 60 60"><g style="fill:none;stroke:var(--main);stroke-width:4.5;stroke-linecap:round;stroke-linejoin:round">' + b + '</g></svg>';
    const S = [['Folders', 'Scanned once, then watched', ic('<path d="M-24 -14 H-6 L0 -8 H24 V20 H-24 Z"/>')],
      ['Git', 'Branches and commits', ic('<circle cx="-12" cy="-16" r="6"/><circle cx="-12" cy="18" r="6"/><circle cx="14" cy="-2" r="6"/><path d="M-12 -10 V12 M-12 4 Q-12 -2 8 -2"/>')],
      ['Sessions', 'Prompts, tool calls, results', ic('<path d="M-24 -18 H24 V10 H-4 L-14 20 V10 H-24 Z"/>')],
      ['Usage', 'Tokens, cost, context', ic('<path d="M-22 20 V4 M-8 20 V-6 M6 20 V-14 M20 20 V-22"/>')]];
    const Y = (i) => 210 + i * 156;
    let wires = '', packets = '';
    S.forEach((_, i) => {
      const a = [1240, Y(i) + 65], b = [1470, 495], c = [1380, Y(i) + 65];
      wires += '<path class="streams-w" pathLength="1" d="M' + a + ' Q' + c + ' ' + b + '" style="fill:none;stroke:var(--wire);stroke-width:5;stroke-linecap:round"/>';
      for (let k = 0; k < 3; k++) packets += '<circle class="streams-p" data-i="' + i + '" data-k="' + k + '" r="8" style="fill:var(--accent)"/>';
    });
    kit.stage.append(kit.h('<div class="ground"><div class="cam streams-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('streams-bg') + wires + '</svg>' +
      S.map(([h, p, i], k) => '<div class="card streams-src" style="top:' + Y(k) + 'px">' + i + '<h4>' + h + '</h4><p>' + p + '</p></div>').join('') +
      '<div class="card streams-store"><h4>Sensei</h4><p>On your machine</p></div>' +
      '<svg class="art" viewBox="0 0 1920 1080">' + packets + W.logo('streams-logo', 1645, 440, 150) + '</svg></div>' +
      W.head('streams-head', 'What it captures', 'Four streams, one place.', 'Point it at a folder once; it stays up to date by itself.', 'left:110px;top:320px;width:700px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.streams-cam'), head: q('.streams-head'), src: all('.streams-src'), wires: all('.streams-w'), packets: all('.streams-p'), store: q('.streams-store'), logo: q('.streams-logo') });
    W.portrait(kit, { hoist: ['.streams-head'], frame: [600, 1100], crop: [865, 190, 970, 640], css: '.streams-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 12.5, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    W.fade(this.store, t, 0.6, this.K); this.logo.style.opacity = eo(seg(t, 0.8, 1.3));
    // One source per beat of the voice: its card, its wire, then a steady flow of packets into the store.
    const at = [1.6, 3.4, 5.2, 7.0];
    this.src.forEach((c, i) => W.fade(c, t, at[i], this.K));
    this.wires.forEach((w, i) => W.draw(w, t, at[i] + 0.3, at[i] + 0.9, this.K));
    this.packets.forEach((p) => {
      const i = +p.dataset.i, k = +p.dataset.k, start = at[i] + 0.9;
      if (t < start) { p.style.opacity = 0; return; }
      const u = ((t - start) / 1.8 + k / 3) % 1, w = this.wires[i], L = w.getTotalLength(), pt = w.getPointAtLength(u * L);
      p.setAttribute('cx', pt.x.toFixed(1)); p.setAttribute('cy', pt.y.toFixed(1));
      p.style.opacity = (Math.sin(u * Math.PI) * eo(seg(t, start, start + 0.4))).toFixed(3);
    });
  },
});
