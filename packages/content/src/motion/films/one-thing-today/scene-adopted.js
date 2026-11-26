// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('adopted', {
  init(kit) {
    kit.css('.adopted-m { left:880px; top:170px; width:600px; height:620px; box-sizing:border-box; padding:26px 30px; border-color:var(--jade); border-width:3px; box-shadow:0 16px 34px rgba(0,0,0,.09) }' +
      '.adopted-m h4 { margin:0 0 6px; font-size:22px; font-weight:600; letter-spacing:0.1em; color:var(--jade) } .adopted-t { margin:0 0 14px; font-family:var(--display); font-size:38px; line-height:1.15 }' +
      '.adopted-r { display:flex; gap:14px; padding:12px 0; border-top:2px solid var(--hair); font-size:23px; line-height:1.3 } .adopted-r b { flex:none; width:90px; font-weight:600; color:var(--mute) }' +
      '.adopted-strip { position:absolute; left:30px; right:30px; bottom:100px } .adopted-strip p { margin:0 0 8px; font-size:19px; font-weight:600; letter-spacing:0.08em; color:var(--mute) }' +
      '.adopted-act { position:absolute; left:1530px; display:flex; align-items:center; gap:12px; padding:12px 22px; border-radius:999px; background:var(--tile); border:2px solid var(--hair); font-size:24px; font-weight:600 }' +
      '.adopted-ladder { position:absolute; left:1530px; top:470px; width:290px } .adopted-ladder p { margin:0 0 10px; font-size:20px; font-weight:600; letter-spacing:0.08em; color:var(--mute) }' +
      '.adopted-ladder span { display:block; margin-bottom:8px; padding:9px 16px; border-radius:10px; border:2px solid var(--hair); font-size:22px; background:var(--tile) } .adopted-ladder span.on { border-color:var(--jade); background:color-mix(in srgb, var(--jade) 14%, var(--tile)) }');
    // One memory Sensei adopted for you, laid open: what it is, why, how to apply it, where; and how often it was used this week.
    const use = [2, 4, 3, 6, 5, 7, 6];
    const bars = use.map((v, i) => '<rect class="adopted-b" data-h="' + v * 9 + '" x="' + (910 + i * 76) + '" y="770" width="56" height="0" rx="6" style="fill:var(--jade)"/>').join('');
    kit.stage.append(kit.h('<div class="ground"><div class="cam adopted-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('adopted-bg') + '</svg>' +
      '<div class="card adopted-m"><h4>ADOPTED FOR YOU · MEMORY</h4><p class="adopted-t">Reuse the existing rate limiter.</p>' +
      '<div class="adopted-r"><b>Why</b>A second limiter was reverted in 3 sessions.</div><div class="adopted-r"><b>How</b>Import from auth/limits.ts; extend, don’t copy.</div>' +
      '<div class="adopted-r"><b>Where</b>This repository, auth/ and api/</div><div class="adopted-strip"><p>USED · LAST 7 DAYS</p></div></div>' +
      '<svg class="art" viewBox="0 0 1920 1080">' + bars + '</svg>' +
      '<div class="adopted-act" style="top:200px">' + '<svg width="26" height="26" viewBox="-13 -13 26 26"><path d="M-7 1 L-2 6 L8 -6" style="fill:none;stroke:var(--jade);stroke-width:4;stroke-linecap:round"/></svg>Reinforce</div>' +
      '<div class="adopted-act" style="top:280px"><svg width="26" height="26" viewBox="-13 -13 26 26"><path d="M0 -8 V3 M0 8 V8.5" style="fill:none;stroke:var(--accent);stroke-width:4;stroke-linecap:round"/></svg>Challenge</div>' +
      '<div class="adopted-ladder"><p>PROMOTION</p><span>Candidate</span><span class="adopted-on">Memory</span><span>Rule</span></div></div>' +
      W.head('adopted-head', 'Adopted', 'See what it adopted for you.', 'Each memory shows what it is, why, how it applies, and how often it was used.', 'left:110px;top:300px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.adopted-cam'), head: q('.adopted-head'), m: q('.adopted-m'), rows: all('.adopted-r'), bars: all('.adopted-b'), acts: all('.adopted-act'), lad: q('.adopted-ladder'), steps: all('.adopted-ladder span') });
    W.portrait(kit, { hoist: ['.adopted-head'], frame: [620, 1060], crop: [870, 150, 960, 660], css: '.adopted-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 12, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    W.fade(this.m, t, 0.8, this.K);
    this.rows.forEach((r, i) => W.fade(r, t, 2.0 + i * 0.7, this.K, 0.4, 10));
    this.bars.forEach((b, i) => { const h = +b.dataset.h * eob(seg(t, 4.4 + i * 0.12, 4.8 + i * 0.12), 1.2); b.setAttribute('y', (770 - Math.max(0, h)).toFixed(1)); b.setAttribute('height', Math.max(0, h).toFixed(1)); });
    this.acts.forEach((a, i) => W.fade(a, t, 6.4 + i * 0.3, this.K));
    W.fade(this.lad, t, 7.6, this.K);
    this.steps.forEach((s, i) => s.classList.toggle('on', i === (t > 9.0 ? 2 : 1) && t > 7.8));
  },
});
