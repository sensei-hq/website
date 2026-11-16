// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('repeat', {
  init(kit) {
    kit.css('.repeat-b { position:absolute; box-sizing:border-box; padding:18px 26px; border-radius:22px; font-size:30px; line-height:1.3; box-shadow:0 10px 24px rgba(0,0,0,.06) }' +
      '.repeat-you { right:120px; max-width:640px; background:var(--main); color:var(--ground); border-bottom-right-radius:6px }' +
      '.repeat-ai { left:900px; width:520px; height:68px; background:var(--tile); border:2px solid var(--hair); border-bottom-left-radius:6px; display:flex; flex-direction:column; justify-content:center; gap:12px }' +
      '.repeat-ai i { display:block; height:10px; border-radius:5px; background:var(--hair) }' +
      '.repeat-n { position:absolute; left:-30px; top:-24px; min-width:58px; height:58px; padding:0 12px; box-sizing:border-box; border-radius:29px; background:var(--accent); color:var(--ground); font-size:28px; font-weight:700; display:flex; align-items:center; justify-content:center; box-shadow:0 0 0 6px var(--board) }');
    // You and the AI, in turn. The same correction keeps coming back.
    const M = [['you', 'Use the repository pattern, not raw queries.', 140, ''], ['ai', '', 262], ['you', 'Don’t add a comment to every line.', 360, ''],
      ['ai', '', 482], ['you', 'Again: use the repository pattern.', 580, '×2'], ['ai', '', 702], ['you', 'No raw queries. Repository pattern.', 800, '×3']];
    const html = M.map(([who, text, top, n]) => who === 'ai'
      ? '<div class="repeat-b repeat-ai" style="top:' + top + 'px"><i style="width:86%"></i><i style="width:58%"></i></div>'
      : '<div class="repeat-b repeat-you" style="top:' + top + 'px">' + text + (n ? '<span class="repeat-n">' + n + '</span>' : '') + '</div>').join('');
    kit.stage.append(kit.h('<div class="ground"><div class="cam repeat-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('repeat-bg') + '</svg>' + html + '</div>' +
      W.head('repeat-head', 'Working with AI', 'Do you keep telling AI the same thing?', 'Follow the pattern. Don’t do that. Not again.', 'left:110px;top:300px;width:700px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.repeat-cam'), head: q('.repeat-head'), bubbles: all('.repeat-b'), counts: all('.repeat-n') });
    W.portrait(kit, { hoist: ['.repeat-head'], frame: [640, 1220], crop: [880, 110, 960, 810], css: '.repeat-head{left:70px!important;top:140px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 9, 1, 1.03, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.bubbles.forEach((b, i) => {
      const p = seg(t, 0.9 + i * 0.72, 1.4 + i * 0.72);
      b.style.opacity = eo(p);
      b.style.transform = 'translateY(' + lerp(26, 0, eob(p, 1.3)).toFixed(1) + 'px)';
    });
    // The repeat counter pops on the messages you've already sent before.
    this.counts.forEach((c, k) => {
      const at = 0.9 + (4 + 2 * k) * 0.72 + 0.5, p = seg(t, at, at + 0.35);
      c.style.opacity = eo(p);
      c.style.transform = 'scale(' + lerp(0.3, 1, eob(p, 2)).toFixed(3) + ')';
    });
  },
});
