// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('trace', {
  init(kit) {
    kit.css('.trace-log { left:880px; top:150px; width:940px; height:700px; box-sizing:border-box; padding:24px 30px; box-shadow:0 14px 30px rgba(0,0,0,.07) }' +
      '.trace-log h4 { margin:0 0 14px; font-size:24px; font-weight:600; letter-spacing:0.08em; color:var(--mute) }' +
      '.trace-row { display:flex; align-items:center; gap:18px; height:78px; border-top:2px solid var(--hair); font-size:27px; position:relative }' +
      '.trace-row time { flex:none; width:70px; font-family:var(--mono); font-size:22px; color:var(--mute) } .trace-row b { flex:none; width:110px; font-weight:600 }' +
      '.trace-row span { flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis } .trace-row code { font-family:var(--mono); font-size:24px }' +
      '.trace-flag { flex:none; padding:7px 16px; border-radius:999px; background:var(--accent); color:var(--ground); font-size:22px; font-weight:600; white-space:nowrap }' +
      '.trace-row.hit { background:color-mix(in srgb, var(--accent) 7%, transparent) }');
    // An illustrative session log. Five of its lines are the five patterns, and each one gets flagged.
    const R = [['00:01', 'Plan', 'Add rate limits to <code>/login</code>', ''], ['00:03', 'Edit', '<code>auth/limits.ts</code>, nothing read yet', 'Edit before read'],
      ['00:04', 'Read', '<code>auth/session.ts</code>', ''], ['00:09', 'Says', '“I misread, let me actually check”', 'Shallow analysis'],
      ['00:12', 'Edit', '<code>auth/cache.ts</code>, not in the plan', 'Spec deviation'], ['00:18', 'Context', 'compacted mid-task', 'Context pressure'],
      ['00:22', 'Merge', '+38 duplicated lines', 'Duplication']];
    const rows = R.map(([tm, k, s, f]) => '<div class="trace-row' + (f ? ' hit' : '') + '"><time>' + tm + '</time><b>' + k + '</b><span>' + s + '</span>' + (f ? '<em class="trace-flag">' + f + '</em>' : '') + '</div>').join('');
    kit.stage.append(kit.h('<div class="ground"><div class="cam trace-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('trace-bg') + '</svg>' +
      '<div class="card trace-log"><h4>SESSION LOG · ILLUSTRATIVE</h4>' + rows + '</div></div>' +
      W.head('trace-head', 'The trace', 'Each one leaves a trace.', 'In the session, and in git.', 'left:110px;top:320px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.trace-cam'), head: q('.trace-head'), log: q('.trace-log'), rows: all('.trace-row'), flags: all('.trace-row') .map((r) => r.querySelector('.trace-flag')) });
    W.portrait(kit, { hoist: ['.trace-head'], frame: [600, 1120], crop: [870, 140, 960, 720], css: '.trace-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 9.5, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.log.style.opacity = eo(seg(t, 0.4, 0.9));
    this.rows.forEach((r, i) => {
      W.fade(r, t, 0.9 + i * 0.5, this.K, 0.4, 12);
      r.classList.toggle('hit', !!this.flags[i] && t > 4.6 + i * 0.35);
    });
    // The flags land together once the log is in: one per pattern.
    let k = 0;
    this.flags.forEach((f, i) => { if (!f) return; W.pop(f, t, 4.6 + i * 0.35, this.K); k++; });
  },
});
