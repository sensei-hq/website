// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('resolve', {
  init(kit) {
    kit.css('.resolve-r { position:absolute; left:1000px; width:700px; height:70px; box-sizing:border-box; display:flex; align-items:center; gap:14px; padding:0 18px; border-radius:12px; background:var(--tile); border:2px solid var(--hair); font-size:22px; box-shadow:0 6px 14px rgba(0,0,0,.04) }' +
      '.resolve-r i { flex:none; width:118px; font-style:normal; font-size:15px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; padding:4px 0; text-align:center; border-radius:6px; color:var(--ground) }' +
      '.resolve-r em { margin-left:auto; font-style:normal; font-size:17px; letter-spacing:.06em; text-transform:uppercase; color:var(--mute) }' +
      '.resolve-r u { position:absolute; left:-40px; top:19px; width:28px; height:30px; text-decoration:none }' +
      '.resolve-steps { position:absolute; left:880px; top:180px; display:flex; gap:10px; flex-wrap:wrap; width:940px } .resolve-steps span { padding:8px 16px; border-radius:999px; font-size:20px; font-weight:600; background:var(--tile); border:2px solid var(--hair); color:var(--mute) }' +
      '.resolve-steps span.on { background:var(--main); border-color:var(--main); color:var(--ground) }');
    // Every rule that could apply to one repository, as gathered, then in resolved order. Values from Sensei's packs.
    const R = [['Keep changes small and single-purpose', 'required', 'Built-in', 3], ['Reuse the existing rate limiter', 'recommended', 'Workspace', 4], ['No secrets in source', 'mandatory', 'Dōjō', 0],
      ['Keep changes small and single-purpose', 'recommended', 'You', 3], ['No unwrap on the request path', 'required', 'Repository', 2], ['Never log tokens or PII', 'mandatory', 'Dōjō', 1]];
    const col = { mandatory: 'var(--accent)', required: 'var(--main)', recommended: 'var(--mute)' };
    const lock = '<svg viewBox="-14 -16 28 32"><path d="M-8 -2 V-8 Q-8 -14 0 -14 Q8 -14 8 -8 V-2" style="fill:none;stroke:var(--accent);stroke-width:3.5"/><rect x="-11" y="-2" width="22" height="16" rx="4" style="fill:var(--accent)"/></svg>';
    this.R = R;
    kit.stage.append(kit.h('<div class="ground"><div class="cam resolve-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('resolve-bg') + '</svg>' +
      '<div class="resolve-steps"><span>Gather</span><span>Sort by strength</span><span>Then by scope</span><span>Lock mandatory</span><span>Merge duplicates</span></div>' +
      R.map(([s, tier, lv]) => '<div class="resolve-r"><i style="background:' + col[tier] + '">' + tier + '</i>' + s + '<em>' + lv + '</em>' + (tier === 'mandatory' ? '<u>' + lock + '</u>' : '') + '</div>').join('') + '</div>' +
      W.head('resolve-head', 'Resolved', 'One order, every time.', 'Sensei gathers every rule that applies, sorts by strength then scope, locks the mandatory ones and merges duplicates.', 'left:110px;top:280px;width:700px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.resolve-cam'), head: q('.resolve-head'), rows: all('.resolve-r'), locks: all('.resolve-r u'), steps: all('.resolve-steps span') });
    W.portrait(kit, { hoist: ['.resolve-head'], frame: [640, 1000], crop: [860, 160, 960, 620], css: '.resolve-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 12.5, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    const at = [1.0, 3.6, 5.0, 6.6, 8.2];
    this.steps.forEach((s, i) => { W.fade(s, t, 0.6 + i * 0.1, this.K, 0.4, 8); s.classList.toggle('on', t >= at[i] && (i === 4 || t < at[i + 1] + 0.6)); });
    const Y = (k) => 290 + k * 84;
    // Gathered order → resolved order (strength, then scope); the duplicate slides under its stronger twin and fades.
    const sp = eio(seg(t, at[1], at[2] + 0.8));
    this.rows.forEach((r, i) => {
      const final = this.R[i][3], dup = i === 3, y = dup ? lerp(Y(i), Y(final), eio(seg(t, at[4], at[4] + 0.8))) : lerp(Y(i), Y(final), sp);
      r.style.top = (dup && t < at[4] ? lerp(Y(i), Y(5), sp) : (dup ? lerp(Y(5), Y(final), eio(seg(t, at[4], at[4] + 0.8))) : y)).toFixed(1) + 'px';
      const inn = eo(seg(t, at[0] + i * 0.3, at[0] + 0.4 + i * 0.3));
      r.style.opacity = (dup ? inn * (1 - eo(seg(t, at[4] + 0.6, at[4] + 1.0))) : inn).toFixed(3);
    });
    this.locks.forEach((l) => W.pop(l, t, at[3] + 0.2, this.K));
  },
});
