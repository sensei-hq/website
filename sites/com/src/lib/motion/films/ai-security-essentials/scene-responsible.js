// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('responsible', {
  init(kit) {
    kit.css('.responsible-row { position:absolute; left:150px; top:430px; width:1620px; display:grid; grid-template-columns:repeat(5, 1fr); gap:30px; align-items:end }' +
      '.responsible-pil { display:flex; flex-direction:column; gap:12px; padding:28px 26px 30px; background:var(--tile); border:2px solid var(--hair); border-radius:18px 18px 6px 6px; transform-origin:50% 100% }' +
      '.responsible-pil svg { width:56px; height:56px } .responsible-pil h3 { margin:0; font-family:var(--display, serif); font-weight:400; font-size:40px; line-height:1.1 } .responsible-pil p { margin:0; font-size:27px; line-height:1.3; color:var(--main) }' +
      '.responsible-base { position:absolute; left:150px; top:770px; width:1620px; box-sizing:border-box; padding:26px 34px; border-radius:12px; background:var(--main); color:var(--ground); display:flex; flex-direction:column; gap:8px }' +
      '.responsible-base h3 { margin:0; font-size:26px; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:color-mix(in srgb, var(--ground) 75%, var(--main)) } .responsible-base p { margin:0; font-size:32px; line-height:1.35 }');
    const P = [['ring', 'Fairness', 'Check for bias'], ['spark', 'Transparency', 'Say how it works'], ['lock', 'Privacy', 'Protect personal data'], ['grid', 'Accountability', 'Clear ownership'], ['wave', 'Human oversight', 'People make the big calls']];
    const pil = P.map(p => '<div class="responsible-pil"><svg viewBox="-40 -40 80 80" aria-hidden="true">' + W.glyph(p[0], 'var(--accent)') + '</svg><h3>' + p[1] + '</h3><p>' + p[2] + '</p></div>').join('');
    kit.stage.append(kit.h('<div class="ground"><div class="cam responsible-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('responsible-bg') + '</svg>' +
      '<div class="responsible-row">' + pil + '</div>' +
      '<div class="responsible-base"><h3>Governance underneath</h3><p>AI use policy · Model inventory · Risk reviews · Frameworks such as NIST AI RMF and ISO/IEC 42001</p></div></div>' +
      W.head('responsible-head', 'Responsible AI', 'Trust is designed in.', 'Clear principles, held up by governance.', 'left:150px;top:80px;width:1200px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.responsible-cam'), head: q('.responsible-head'), pils: all('.responsible-pil'), base: q('.responsible-base'), icons: all('.responsible-pil svg') });
    W.portrait(kit, {"hoist": [".responsible-head", ".responsible-row", ".responsible-base"], "frame": [0, 10], "crop": [0, 0, 1920, 1080], "css": ".responsible-head{left:70px!important;right:auto!important;top:140px!important;bottom:auto!important;width:940px!important;max-width:none!important;}.responsible-row{left:70px!important;right:auto!important;top:520px!important;bottom:auto!important;width:940px!important;max-width:none!important} .responsible-row{grid-template-columns:1fr 1fr!important;gap:20px!important}.responsible-base{left:70px!important;right:auto!important;top:1420px!important;bottom:auto!important;width:940px!important;max-width:none!important}"});
  },
  render(t) {
    W.push(this.cam, t, 17, 1, 1.03, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    // Governance goes down first; each principle stands up on it, as the take names it.
    const b = eo(seg(t, 1.0, 1.8));
    this.base.style.opacity = b; this.base.style.transform = 'translateY(' + lerp(40, 0, b) + 'px)';
    this.pils.forEach((p, i) => {
      const s = seg(t, 3.2 + i * 1.0, 3.9 + i * 1.0);
      p.style.opacity = clamp01(s * 2.5);
      p.style.transform = 'scaleY(' + lerp(0.3, 1, eob(s, 1.5)).toFixed(3) + ')';
      this.icons[i].style.transform = 'rotate(' + (6 * Math.sin(t * 1.1 + i * 1.3)).toFixed(2) + 'deg)';
    });
  },
});
