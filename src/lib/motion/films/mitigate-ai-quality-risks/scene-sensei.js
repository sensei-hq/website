// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('sensei', {
  init(kit) {
    kit.css('.sensei-c { left:880px; width:940px; box-sizing:border-box; padding:20px 28px; box-shadow:0 12px 26px rgba(0,0,0,.06) }' +
      '.sensei-c h4 { margin:0; font-size:24px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--mute) }' +
      '.sensei-score { position:absolute; right:28px; top:14px; font-family:var(--display); font-size:52px; color:var(--jade) }' +
      '.sensei-pills { display:flex; flex-wrap:wrap; gap:12px; margin-top:16px } .sensei-pills span { padding:9px 18px; border-radius:999px; font-size:24px; font-weight:500; background:var(--ground); border:2px solid var(--hair) }' +
      '.sensei-pills span.ok { background:color-mix(in srgb, var(--jade) 16%, var(--tile)); border-color:var(--jade) } .sensei-pills span.no { border-color:var(--accent); color:var(--accent); border-style:dashed }' +
      '.sensei-b { position:absolute; left:930px; top:740px; padding:14px 22px; border-radius:20px; border-bottom-right-radius:6px; background:var(--main); color:var(--ground); font-size:26px }' +
      '.sensei-rule { position:absolute; left:1440px; top:722px; width:340px; box-sizing:border-box; padding:12px 20px; border-radius:14px; background:var(--tile); border:3px solid var(--jade); font-size:25px; line-height:1.3 }' +
      '.sensei-rule small { display:block; font-size:20px; color:var(--mute) } .sensei-flag { left:1460px; top:540px }');
    const P = ['Acceptance criteria', 'Inputs and outputs', 'No TBDs', 'Explicit scope', 'Goal alignment', 'Ambiguities resolved'];
    // The plan as steps; the work leaves it after step three.
    const sx = (i) => 960 + i * 190, py = 490;
    let steps = '';
    for (let i = 0; i < 5; i++) steps += '<circle cx="' + sx(i) + '" cy="' + py + '" r="13" style="fill:var(--tile);stroke:var(--main);stroke-width:4"/>';
    kit.stage.append(kit.h('<div class="ground"><div class="cam sensei-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('sensei-bg') + '</svg>' +
      '<div class="card sensei-c sensei-a" style="top:120px;height:250px"><h4>Plan depth</h4><span class="sensei-score"><span class="sensei-n">0</span>/6</span>' +
      '<div class="sensei-pills">' + P.map((s) => '<span>' + s + '</span>').join('') + '</div></div>' +
      '<div class="card sensei-c sensei-d" style="top:390px;height:220px"><h4>Departs from the plan</h4></div>' +
      '<div class="card sensei-c sensei-r" style="top:630px;height:220px"><h4>A correction becomes a rule</h4></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="sensei-plan"><line x1="' + sx(0) + '" x2="' + sx(4) + '" y1="' + py + '" y2="' + py + '" style="stroke:var(--wire);stroke-width:5;stroke-dasharray:10 10"/>' + steps + '</g>' +
      '<path class="sensei-work" pathLength="1" d="M' + sx(0) + ' ' + py + ' H' + sx(2) + ' Q' + (sx(2) + 110) + ' ' + py + ' ' + (sx(2) + 150) + ' ' + (py + 76) + '" style="fill:none;stroke:var(--accent);stroke-width:7;stroke-linecap:round"/>' +
      '<path class="sensei-to" pathLength="1" d="M1370 760 H1426" style="fill:none;stroke:var(--jade);stroke-width:6;stroke-linecap:round"/></svg>' +
      '<span class="tag hot sensei-flag">Flagged, with the evidence</span>' +
      '<div class="sensei-b">Use the repository pattern.</div>' +
      '<div class="sensei-rule"><b>Rule</b> · repository pattern<small>Loaded at the next session’s start</small></div></div>' +
      W.head('sensei-head', 'In Sensei', 'Habits you can see.', 'How deep the plan was, where work left it, and rules from what you keep correcting.', 'left:110px;top:300px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.sensei-cam'), head: q('.sensei-head'), cards: [q('.sensei-a'), q('.sensei-d'), q('.sensei-r')], pills: all('.sensei-pills span'), n: q('.sensei-n'),
      plan: q('.sensei-plan'), work: q('.sensei-work'), flag: q('.sensei-flag'), b: q('.sensei-b'), to: q('.sensei-to'), rule: q('.sensei-rule') });
    W.portrait(kit, { hoist: ['.sensei-head'], frame: [600, 1100], crop: [865, 105, 970, 760], css: '.sensei-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 10, 1, 1.015, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.cards.forEach((c, i) => W.fade(c, t, 0.6 + i * 2.8, this.K));
    // Plan depth: each criterion is checked; one is still open.
    let n = 0;
    this.pills.forEach((p, i) => { const on = t > 1.2 + i * 0.25; p.classList.toggle('ok', on && i !== 5); p.classList.toggle('no', on && i === 5); if (on && i !== 5) n++; });
    this.n.textContent = n;
    // Departure: the work follows the plan, then leaves it; flagged.
    this.plan.style.opacity = eo(seg(t, 3.5, 3.9));
    W.draw(this.work, t, 3.8, 5.2, this.K);
    W.pop(this.flag, t, 5.2, this.K, 'translate(-50%,0)');
    // A correction you keep making becomes a rule for next time.
    W.fade(this.b, t, 6.6, this.K);
    W.draw(this.to, t, 7.3, 7.7, this.K);
    W.pop(this.rule, t, 7.7, this.K);
  },
});
