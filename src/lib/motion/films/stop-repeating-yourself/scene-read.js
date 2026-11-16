// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('read', {
  init(kit) {
    kit.css('.read-log { left:960px; top:120px; width:780px; box-sizing:border-box; padding:26px 30px; display:flex; flex-direction:column; gap:10px; box-shadow:0 14px 30px rgba(0,0,0,.06) }' +
      '.read-log h4 { margin:0 0 6px; font-size:22px; font-weight:600; letter-spacing:0.08em; color:var(--mute) }' +
      '.read-row { display:flex; gap:16px; align-items:baseline; padding:10px 14px; border-radius:10px; font-size:27px; line-height:1.3; position:relative }' +
      '.read-row b { flex:none; width:52px; font-size:20px; font-weight:700; letter-spacing:0.06em; color:var(--mute) } .read-row.you b { color:var(--second) } .read-row.hit { padding-right:120px }' +
      '.read-row mark { background:none; color:var(--accent); font-weight:600 }' +
      '.read-hl { position:absolute; inset:0; border-radius:10px; background:color-mix(in srgb, var(--accent) 12%, transparent); border:2px solid var(--accent); transform-origin:0 50% }' +
      '.read-tag { position:absolute; right:14px; top:50%; transform:translateY(-50%); padding:4px 12px; border-radius:999px; font-size:18px; font-weight:700; letter-spacing:0.06em; background:var(--accent); color:var(--ground) }' +
      '.read-scan { position:absolute; left:960px; width:780px; height:4px; border-radius:2px; background:var(--jade); box-shadow:0 0 18px var(--jade) }');
    // One session, as the transcript shows it. Each follow-up that corrects the AI's work is the signal.
    const R = [['you', 'Add CSV export to the reports page.'], ['ai', 'Done. I added an endpoint with a raw SQL query.'],
      ['you', '<mark>That’s not what I asked.</mark> Use the repository pattern.', 'WRONG'], ['ai', 'Switched to ReportRepository and renamed the columns.'],
      ['you', '<mark>Why did you</mark> rename the columns? Keep them as they were.', 'WHY'], ['ai', 'Restored the names and commented every line.'],
      ['you', '<mark>Revert</mark> the line-by-line comments.', 'REVERT']];
    const rows = R.map(([who, s, tag]) => '<div class="read-row ' + who + (tag ? ' hit' : '') + '">' + (tag ? '<i class="read-hl"></i>' : '') + '<b>' + (who === 'you' ? 'YOU' : 'AI') + '</b><span>' + s + '</span>' +
      (tag ? '<span class="read-tag">' + tag + '</span>' : '') + '</div>').join('');
    kit.stage.append(kit.h('<div class="ground"><div class="cam read-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('read-bg') + '</svg>' +
      '<div class="card read-log"><h4>SESSION TRANSCRIPT</h4>' + rows + '</div><i class="read-scan"></i></div>' +
      W.head('read-head', 'Sensei · transcript analysis', 'Sensei reads your sessions.', 'Every follow-up that corrects the AI is a signal.', 'left:110px;top:330px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.read-cam'), head: q('.read-head'), rows: all('.read-row'), log: q('.read-log'), scan: q('.read-scan'), tags: all('.read-tag') });
    W.portrait(kit, { hoist: ['.read-head'], frame: [560, 1300], crop: [930, 60, 840, 960], css: '.read-head{left:70px!important;top:140px!important;width:940px!important}' });
    this.ready = false;
  },
  // Placed once the fonts have set the text: the transcript is centred on the board's height, and each row's centre is kept for the scan.
  layout() {
    this.log.style.top = Math.round((1080 - this.log.offsetHeight) / 2) + 'px';
    const top = this.log.offsetTop;
    this.y = this.rows.map((r) => top + r.offsetTop + r.offsetHeight / 2);
    this.ys = this.y[0] - 34; this.ye = this.y[this.y.length - 1] + 34;
    this.hits = this.rows.map((r, i) => (r.classList.contains('hit') ? i : -1)).filter((i) => i >= 0);
    this.ready = true;
  },
  render(t) {
    if (!this.ready) this.layout();
    W.push(this.cam, t, 14, 1, 1.025, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.log.style.opacity = eo(seg(t, 0.5, 1.0));
    this.rows.forEach((r, i) => { const p = seg(t, 0.8 + i * 0.5, 1.2 + i * 0.5); r.style.opacity = eo(p); r.style.transform = 'translateX(' + lerp(24, 0, eo(p)).toFixed(1) + 'px)'; });
    // The scan reads the session top to bottom; each correction lights up as it passes, with the kind Sensei counts it as.
    // Timed to the voiceover: the scan reaches each quoted correction ("that's not what I asked", "revert that")
    // as the take names it, and finishes on "is a signal".
    const s0 = 5.2, s1 = 11.2, sy = lerp(this.ys, this.ye, eio(seg(t, s0, s1)));
    this.scan.style.top = sy.toFixed(1) + 'px';
    this.scan.style.opacity = t > s0 - 0.2 && t < s1 + 0.3 ? 1 : 0;
    this.hits.forEach((i, k) => {
      let lo = s0, hi = s1;
      for (let n = 0; n < 18; n++) { const m = (lo + hi) / 2; if (lerp(this.ys, this.ye, eio(seg(m, s0, s1))) < this.y[i]) lo = m; else hi = m; }
      const hl = this.rows[i].querySelector('.read-hl'), p = seg(t, lo, lo + 0.3), g = seg(t, lo + 0.2, lo + 0.55);
      hl.style.opacity = eo(p); hl.style.transform = 'scaleX(' + lerp(0.2, 1, eo(p)).toFixed(3) + ')';
      this.tags[k].style.opacity = eo(g); this.tags[k].style.transform = 'translateY(-50%) scale(' + lerp(0.6, 1, eob(g, 1.8)).toFixed(3) + ')';
    });
  },
});
