// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('depth', {
  init(kit) {
    kit.css('.depth-req { left:900px; top:150px; width:620px; box-sizing:border-box; padding:26px 30px; display:flex; flex-direction:column; gap:14px; box-shadow:0 14px 30px rgba(0,0,0,.07) }' +
      '.depth-req h4 { margin:0; font-size:22px; font-weight:600; letter-spacing:0.08em; color:var(--mute) } .depth-req h3 { margin:0 0 6px; font-size:36px; font-weight:600 }' +
      '.depth-row { display:flex; align-items:center; gap:16px; padding:12px 16px; border-radius:12px; border:2px solid var(--hair); font-size:27px; line-height:1.25; background:var(--tile) }' +
      '.depth-ic { flex:none; position:relative; width:40px; height:40px } .depth-ic svg { position:absolute; inset:0 }' +
      '.depth-flag { position:absolute; padding:10px 18px; border-radius:12px; font-size:24px; font-weight:600; background:var(--tile); border:2px solid var(--accent); white-space:nowrap }');
    const bar = ['Observable acceptance criteria', 'Inputs, outputs and dependencies', 'No TBDs left', 'Open questions answered', 'Scope: what’s in, what’s out'];
    const ic = '<span class="depth-ic"><svg viewBox="-24 -24 48 48">' + W.cross('depth-x') + '</svg><svg viewBox="-24 -24 48 48">' + W.tick('depth-v') + '</svg></span>';
    const rows = bar.map((s) => '<div class="depth-row">' + ic + '<span>' + s + '</span></div>').join('');
    // Reviewers that assume the plan is wrong, each asking what was missed.
    this.R = [[1730, 230, 'tri', 'Empty report?'], [1730, 520, 'ring', 'Very large export?'], [1730, 810, 'grid', 'Who may export?']];
    let art = '';
    this.R.forEach(([x, y, k], i) => {
      art += '<path class="depth-wire" pathLength="1" style="fill:none;stroke:var(--wire);stroke-width:6;stroke-linecap:round"/>' + '<g class="depth-rev" transform="translate(' + x + ' ' + y + ')">' + W.node('depth-node', k, 'hot', 110) + '</g>';
    });
    const flags = this.R.map(([x, y, , s]) => '<span class="depth-flag" style="left:' + (x - 120) + 'px;top:' + (y + 62) + 'px">' + s + '</span>').join('');
    kit.stage.append(kit.h('<div class="ground"><div class="cam depth-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('depth-bg') + art + '</svg>' +
      '<div class="card depth-req"><h4>REQUEST · BEFORE WORK STARTS</h4><h3>Add CSV export to reports</h3>' + rows + '</div>' + flags + '</div>' +
      W.head('depth-head', 'Thin asks', 'Gaps get caught before work starts.', '', 'left:110px;top:110px;width:700px') +
      W.checks('depth-checks', ['Plan depth review: every piece must clear the bar', 'Adversarial review hunts for what was missed'], 'left:110px;top:560px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.depth-cam'), head: q('.depth-head'), checks: q('.depth-checks'), req: q('.depth-req'), rows: all('.depth-row'),
      xs: all('.depth-x'), vs: all('.depth-v'), revs: all('.depth-rev'), wires: all('.depth-wire'), flags: all('.depth-flag') });
    this.ready = false;
    W.portrait(kit, { hoist: ['.depth-head', '.depth-checks'], frame: [520, 820], crop: [860, 120, 1020, 860],
      css: '.depth-head{left:70px!important;top:120px!important;width:940px!important} .depth-checks{left:70px!important;top:1400px!important;width:940px!important} .chk{font-size:36px!important;padding:18px 24px!important}' });
  },
  // Once the fonts have set the text: the request is centred on the board's height, and a curved connector runs from the
  // middle of its right edge to each reviewer.
  layout() {
    const top = Math.round((1080 - this.req.offsetHeight) / 2);
    this.req.style.top = top + 'px';
    const x = this.req.offsetLeft + this.req.offsetWidth, y = top + this.req.offsetHeight / 2;
    this.R.forEach(([rx, ry], i) => {
      const ex = rx - 62;
      this.wires[i].setAttribute('d', 'M' + x + ' ' + y + ' C' + (x + 90) + ' ' + y + ' ' + (ex - 90) + ' ' + ry + ' ' + ex + ' ' + ry);
    });
    this.ready = true;
  },
  render(t) {
    if (!this.ready) this.layout();
    W.push(this.cam, t, 14, 1, 1.025, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    const rp = seg(t, 0.6, 1.2);
    this.req.style.opacity = eo(rp); this.req.style.transform = 'translateY(' + lerp(40, 0, eob(rp, 1.3)).toFixed(1) + 'px)';
    // The bar first shows what's missing, then each gap is answered before anything is built.
    // Timed to the voiceover: each fix lands as the take names that criterion; the reviewers arrive on "adversarial review".
    this.rows.forEach((r, i) => {
      const a = seg(t, 1.3 + i * 0.35, 1.7 + i * 0.35), fix = seg(t, 5.2 + i * 0.55, 5.55 + i * 0.55);
      r.style.opacity = eo(a);
      this.xs[i].style.opacity = (eo(a) * (1 - eo(fix))).toFixed(3);
      this.vs[i].style.opacity = eo(fix).toFixed(3);
      this.vs[i].setAttribute('transform', 'scale(' + lerp(0.3, 1, eob(fix, 1.8)).toFixed(3) + ')');
      r.style.borderColor = fix > 0 && fix < 1 ? 'var(--jade)' : 'var(--hair)';
    });
    this.revs.forEach((g, i) => {
      const p = eob(seg(t, 8.8 + i * 0.3, 9.3 + i * 0.3), 1.6), y = this.R[i][1];
      g.style.opacity = clamp01(p * 2);
      g.setAttribute('transform', 'translate(' + this.R[i][0] + ' ' + y + ') scale(' + lerp(0.5, 1, p).toFixed(3) + ')');
      this.wires[i].style.strokeDasharray = 1;
      this.wires[i].style.strokeDashoffset = (1 - eio(seg(t, 9.2 + i * 0.3, 9.8 + i * 0.3))).toFixed(3);
      const f = seg(t, 10.0 + i * 0.4, 10.4 + i * 0.4), fl = this.flags[i];
      fl.style.opacity = eo(f);
      fl.style.transform = 'scale(' + lerp(0.6, 1, eob(f, 1.8)).toFixed(3) + ')';
      fl.style.borderColor = t > 11.8 + i * 0.3 ? 'var(--jade)' : 'var(--accent)';
    });
    W.showChecks(this.checks, t, 4.6, 4.4, this.K);
  },
});
