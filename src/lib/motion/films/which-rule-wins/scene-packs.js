// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('packs', {
  init(kit) {
    kit.css('.packs-p { position:absolute; width:226px; height:290px; box-sizing:border-box; padding:16px 16px; border-radius:16px; background:var(--tile); border:2px solid var(--hair); box-shadow:0 8px 18px rgba(0,0,0,.05) }' +
      '.packs-p h4 { margin:0; font-size:23px; line-height:1.15; font-weight:600 } .packs-p i { display:inline-block; margin:8px 0 10px; font-style:normal; font-size:14px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; padding:3px 8px; border-radius:6px; color:var(--ground) }' +
      '.packs-p p { margin:0 0 8px; padding-top:8px; border-top:2px solid var(--hair); font-size:18px; line-height:1.3 } .packs-p.stack { border-style:dashed; border-color:var(--main) }' +
      '.packs-note { position:absolute; left:880px; top:832px; width:940px; font-size:22px; color:var(--mute) }');
    // Real rule sets bundled with Sensei, each with two of its rules.
    const P = [['Security baseline', 'required', 'No secrets in source', 'Never log tokens or PII'], ['TDD discipline', 'required', 'Write the failing test first', 'Never merge on red'],
      ['Clean Code', 'recommended', 'Intention-revealing names', 'Comments explain why, not what'], ['Design principles (SOLID)', 'recommended', 'Single responsibility', 'Composition over inheritance'],
      ['Compliance baseline', 'required', 'Collect only what the feature needs', 'Encrypt regulated data'], ['UX & design', 'recommended', 'Accessibility is a requirement', 'Clear feedback for every action'],
      ['Ponytail', 'recommended', 'Question whether the code needs to exist', 'Reuse before writing something new'], ['Stack packs · Rust, TypeScript', 'recommended', 'No unwrap on the request path', 'Strict types, no any']];
    const col = { required: 'var(--main)', recommended: 'var(--mute)' };
    kit.stage.append(kit.h('<div class="ground"><div class="cam packs-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('packs-bg') + '</svg>' +
      P.map(([h, tier, a, b], i) => '<div class="packs-p' + (i === 7 ? ' stack' : '') + '" style="left:' + (880 + (i % 4) * 238) + 'px;top:' + (180 + Math.floor(i / 4) * 310) + 'px"><h4>' + h + '</h4><i style="background:' + col[tier] + '">' + tier + '</i><p>' + a + '</p><p>' + b + '</p></div>').join('') +
      '<p class="packs-note">Adopt a pack for yourself, the dōjō, a workspace or one repository. Stack packs are adopted where the stack is found. An adopter can raise a rule’s tier, never lower it.</p></div>' +
      W.head('packs-head', 'Rule sets', 'Start from packs that already work.', 'Proven rule sets for security, testing, design, compliance and your stack.', 'left:110px;top:300px;width:700px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.packs-cam'), head: q('.packs-head'), packs: all('.packs-p'), note: q('.packs-note') });
    W.portrait(kit, { hoist: ['.packs-head'], frame: [600, 1120], crop: [870, 160, 960, 780], css: '.packs-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 14, 1, 1.015, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.packs.forEach((p, i) => W.fade(p, t, 1.0 + i * 1.0, this.K, 0.5, 18));
    W.fade(this.note, t, 9.6, this.K);
  },
});
