// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('prevent', {
  init(kit) {
    kit.css('.prevent-t { position:absolute; left:870px; top:130px; width:960px; display:grid; grid-template-columns:250px 1fr 1fr; gap:10px }' +
      '.prevent-t > div { box-sizing:border-box; min-height:96px; padding:14px 18px; border-radius:14px; font-size:25px; line-height:1.25; display:flex; align-items:center }' +
      '.prevent-h { min-height:0 !important; padding:4px 18px !important; font-size:22px !important; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--mute) }' +
      '.prevent-h.p { color:var(--jade) } .prevent-h.c { color:var(--main) }' +
      '.prevent-f { font-weight:600; background:var(--tile); border:2px solid var(--hair) }' +
      '.prevent-p { background:color-mix(in srgb, var(--jade) 12%, var(--tile)); border:2px solid color-mix(in srgb, var(--jade) 45%, transparent) }' +
      '.prevent-c { background:var(--tile); border:2px solid var(--hair) }' +
      '.prevent-loop { position:absolute; left:1350px; top:820px; transform:translate(-50%,0); display:flex; align-items:center; gap:16px; padding:14px 28px; border-radius:999px; background:var(--main); color:var(--ground); font-size:28px; font-weight:600; white-space:nowrap }' +
      '.prevent-loop i { font-style:normal; color:color-mix(in srgb, var(--ground) 60%, transparent) }');
    // For each pattern: what Sensei does before the work (prevent) and after it (catch).
    const R = [['Edit before read', 'Grounds the task: read the spec and code first', 'Counts edits made before any read'],
      ['Shallow analysis', 'Checks the plan’s depth before work starts', 'Flags “I misread” retractions; adversarial review'],
      ['Spec deviation', 'Scope and acceptance criteria made explicit', 'Shows the plan quote against the action'],
      ['Duplication', 'Searches the code index before a new helper', 'Measures duplication at each sampled commit'],
      ['Context pressure', 'Your rules re-injected when context compacts', 'Tracks sessions that hit compaction']];
    const cells = '<div class="prevent-h"></div><div class="prevent-h p">Prevent · before</div><div class="prevent-h c">Catch · after</div>' +
      R.map(([f, p, c]) => '<div class="prevent-f">' + f + '</div><div class="prevent-p">' + p + '</div><div class="prevent-c">' + c + '</div>').join('');
    kit.stage.append(kit.h('<div class="ground"><div class="cam prevent-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('prevent-bg') + '</svg>' +
      '<div class="prevent-t">' + cells + '</div><div class="prevent-loop">Your correction <i>→</i> a rule for next time</div></div>' +
      W.head('prevent-head', 'How Sensei helps', 'Prevent it. Catch what slips.', 'And what you correct becomes a rule.', 'left:110px;top:320px;width:660px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.prevent-cam'), head: q('.prevent-head'), hs: all('.prevent-h'), f: all('.prevent-f'), p: all('.prevent-p'), c: all('.prevent-c'), loop: q('.prevent-loop') });
    W.portrait(kit, { hoist: ['.prevent-head'], frame: [600, 1180], crop: [860, 110, 980, 800], css: '.prevent-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 15, 1, 1.015, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.hs.forEach((h, i) => W.fade(h, t, 0.5 + i * 0.1, this.K));
    // One row per pattern: the name, then the prevent, then the catch.
    this.f.forEach((el, i) => {
      const a = 1.0 + i * 2.0;
      W.fade(el, t, a, this.K, 0.4, 12);
      W.fade(this.p[i], t, a + 0.4, this.K, 0.4, 12);
      W.fade(this.c[i], t, a + 0.9, this.K, 0.4, 12);
    });
    W.pop(this.loop, t, 11.6, this.K, 'translate(-50%,0)');
  },
});
