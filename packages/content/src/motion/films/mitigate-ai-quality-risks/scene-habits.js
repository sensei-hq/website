// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('habits', {
  init(kit) {
    kit.css('.habits-list { position:absolute; left:880px; top:140px; width:940px; display:flex; flex-direction:column; gap:16px }' +
      '.habits-row { position:relative; display:flex; align-items:center; gap:24px; height:118px; box-sizing:border-box; padding:0 28px 0 22px; background:var(--tile); border:2px solid var(--hair); border-radius:18px; box-shadow:0 10px 22px rgba(0,0,0,.05); font-size:32px; line-height:1.25; font-weight:500 }' +
      '.habits-row svg { flex:none; width:76px; height:76px } .habits-row b { flex:none; width:36px; font-family:var(--display); font-weight:400; font-size:44px; color:var(--accent) }' +
      '.habits-row span { flex:1 } .habits-row .chk-i { flex:none; width:40px; height:40px; border-radius:50%; background:var(--jade); position:relative }' +
      '.habits-row .chk-i::after { content:""; position:absolute; left:13px; top:7px; width:10px; height:19px; border:solid var(--ground); border-width:0 5px 5px 0; transform:rotate(45deg) }');
    const ic = (body) => '<svg viewBox="-40 -40 80 80"><rect x="-38" y="-38" width="76" height="76" rx="16" style="fill:var(--ground);stroke:var(--hair);stroke-width:3"/>' +
      '<g style="fill:none;stroke:var(--main);stroke-width:5;stroke-linecap:round;stroke-linejoin:round">' + body + '</g></svg>';
    const I = [
      ic('<path d="M-14 -22 H8 L16 -14 V22 H-14 Z"/><path d="M-6 -6 H8 M-6 4 H8 M-6 14 H2"/>'),
      ic('<circle r="20"/><path d="M-9 0 L-2 7 L10 -7"/>'),
      ic('<rect x="-20" y="-20" width="16" height="16" rx="3"/><rect x="4" y="-20" width="16" height="16" rx="3"/><rect x="-20" y="4" width="40" height="16" rx="3"/>'),
      ic('<path d="M-22 18 H-8 V4 H6 V-10 H20"/><circle cx="20" cy="-18" r="3"/>'),
      ic('<path d="M-18 -20 H12 Q18 -20 18 -14 V22 H-12 Q-18 22 -18 16 Z"/><path d="M-18 14 Q-18 8 -12 8 H18"/><path d="M-8 -10 H8"/>')];
    const H = ['Write the requirements down, and read them', 'Define how it will be verified, before building', 'Agree the design: patterns, principles, architecture',
      'Work in phases, each with a check', 'Encode conventions as rules, not reminders'];
    kit.stage.append(kit.h('<div class="ground"><div class="cam habits-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('habits-bg') + '</svg>' +
      '<div class="habits-list">' + H.map((s, i) => '<div class="habits-row">' + I[i] + '<b>' + (i + 1) + '</b><span>' + s + '</span><i class="chk-i"></i></div>').join('') + '</div></div>' +
      W.head('habits-head', 'The habits', 'Do the thinking first.', 'Decide more before the assistant writes anything.', 'left:110px;top:320px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.habits-cam'), head: q('.habits-head'), rows: all('.habits-row'), ticks: all('.habits-row .chk-i') });
    W.portrait(kit, { hoist: ['.habits-head'], frame: [600, 1100], crop: [865, 125, 970, 700], css: '.habits-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 16, 1, 1.015, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    // One habit per beat of the voice; its tick lands as the next begins.
    const HA = [1.0, 4.6, 8.4, 9.9, 12.6];
    this.rows.forEach((r, i) => {
      const a = HA[i];
      W.fade(r, t, a, this.K, 0.5, 20);
      const p = seg(t, a + 1.4, a + 1.8);
      this.ticks[i].style.opacity = eo(p);
      this.ticks[i].style.transform = 'scale(' + lerp(0.3, 1, eob(p, 1.8)).toFixed(3) + ')';
    });
  },
});
