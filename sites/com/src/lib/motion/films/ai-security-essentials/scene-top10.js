// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('top10', {
  init(kit) {
    kit.css('.top10-cols { position:absolute; left:110px; top:318px; width:1700px; display:grid; grid-template-columns:repeat(3, 1fr); gap:40px }' +
      '.top10-col { display:flex; flex-direction:column; gap:16px }' +
      '.top10-col h3 { margin:0 0 4px; font-size:28px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:var(--mute) }' +
      '.top10-card { position:relative; display:grid; grid-template-columns:64px 1fr; column-gap:14px; padding:16px 20px; background:var(--tile); border:2px solid var(--hair); border-radius:14px }' +
      '.top10-card b { grid-row:span 2; font-family:var(--display, serif); font-weight:400; font-size:44px; line-height:1; color:var(--accent) }' +
      '.top10-card p { margin:0 } .top10-name { font-size:30px; line-height:1.2; font-weight:600 } .top10-gist { font-size:24px; line-height:1.3; color:var(--main); margin-top:4px !important }' +
      '.top10-src { position:absolute; right:110px; bottom:56px; font-size:24px; color:var(--mute) }');
    const R = {
      '01': ['Prompt Injection', 'Hidden instructions steer the model'], '02': ['Sensitive Information Disclosure', 'Private data leaks out'],
      '03': ['Excessive Agency', 'Agents act with too much power'], '04': ['Supply Chain', 'Untrusted models, plugins, data'],
      '05': ['Data and Model Poisoning', 'Tampered training data'], '06': ['Unbounded Consumption', 'Runaway usage and cost'],
      '07': ['Misinformation', 'Confident, wrong answers'], '08': ['Hidden Context Exposure', 'System prompts can be extracted'],
      '09': ['Vector and Embedding Weaknesses', 'Weak spots in retrieval stores'], '10': ['Improper Output Handling', 'Output passed on unchecked'],
    };
    const col = (title, ids) => '<div class="top10-col"><h3>' + title + '</h3>' + ids.map(id => '<div class="top10-card" data-n="' + id + '"><b>' + id + '</b><p class="top10-name">' + R[id][0] + '</p><p class="top10-gist">' + R[id][1] + '</p></div>').join('') + '</div>';
    kit.stage.append(kit.h('<div class="ground"><div class="cam top10-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('top10-bg') + '</svg>' +
      '<div class="top10-cols">' + col('What goes in', ['01', '04', '05', '09']) + col('What comes out', ['02', '07', '08', '10']) + col('What it can do', ['03', '06']) + '</div>' +
      '<p class="top10-src">Source: OWASP GenAI Security Project, 2026</p></div>' +
      W.head('top10-head', 'OWASP Top 10 for LLM Applications, 2026', 'Ten risks worth knowing.', '', 'left:110px;top:70px;width:1500px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.top10-cam'), head: q('.top10-head'), src: q('.top10-src'), heads: all('.top10-col h3') });
    this.cards = all('.top10-card').sort((a, b) => a.dataset.n.localeCompare(b.dataset.n));
    W.portrait(kit, {"hoist": [".top10-head", ".top10-cols", ".top10-src"], "frame": [0, 10], "crop": [0, 0, 1920, 1080], "css": ".top10-head{left:70px!important;right:auto!important;top:120px!important;bottom:auto!important;width:940px!important;max-width:none!important;}.top10-cols{left:70px!important;right:auto!important;top:410px!important;bottom:auto!important;width:940px!important;max-width:none!important} .top10-cols{grid-template-columns:1fr!important;gap:22px!important} .top10-col{gap:10px!important} .top10-card{padding:12px 18px!important} .top10-name{font-size:30px!important} .top10-gist{font-size:24px!important} .top10-src{left:70px!important;right:auto!important;bottom:60px!important}"});
  },
  render(t) {
    W.push(this.cam, t, 23, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    // Timed to the voiceover: each group title lands on "what goes in / comes out / it can do",
    // and each card lands as the take names that risk.
    const HT = [6.0, 12.0, 18.4];
    this.heads.forEach((h, i) => { const p = eo(seg(t, HT[i], HT[i] + 0.5)); h.style.opacity = p; h.style.transform = 'translateY(' + lerp(14, 0, p) + 'px)'; });
    const LAND = [7.6, 13.8, 20.6, 9.5, 8.6, 22.1, 14.4, 15.8, 10.8, 17.2];
    this.cards.forEach((c, i) => {
      const p = seg(t, LAND[i], LAND[i] + 0.5);
      c.style.opacity = eo(p);
      let y = lerp(-26, 0, eob(p, 1.5)), s = 1;
      // Prompt injection steps forward at the end: it's next.
      if (i === 0) { const f = eio(seg(t, 22.9, 23.6)); y -= 6 * f; s = 1 + 0.04 * f; c.style.borderColor = f > 0.5 ? 'var(--accent)' : 'var(--hair)'; c.style.boxShadow = '0 ' + (14 * f).toFixed(1) + 'px ' + (30 * f).toFixed(1) + 'px rgba(0,0,0,' + (0.12 * f).toFixed(3) + ')'; }
      else c.style.opacity = eo(p) * lerp(1, 0.45, eio(seg(t, 22.9, 23.6)));
      c.style.transform = 'translateY(' + y.toFixed(1) + 'px) scale(' + s.toFixed(3) + ')';
    });
    this.src.style.opacity = eo(seg(t, 7.6, 8.2));
  },
});
