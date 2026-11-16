// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('sensei', {
  init(kit) {
    kit.css('.sensei-col { position:absolute; top:300px; width:176px; display:flex; flex-direction:column; gap:12px }' +
      '.sensei-col h4 { margin:0 0 4px; font-size:22px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--mute); text-align:center }' +
      '.sensei-m { box-sizing:border-box; height:96px; padding:12px 14px; border-radius:14px; background:var(--tile); border:2px solid var(--hair); font-size:22px; line-height:1.25; font-weight:500; display:flex; align-items:center; box-shadow:0 8px 18px rgba(0,0,0,.05) }' +
      '.sensei-m.on { border-color:var(--accent); border-width:3px; background:color-mix(in srgb, var(--accent) 8%, var(--tile)) }' +
      '.sensei-pair { left:1159px; top:126px }');
    // Sensei's metric groups (a selection of each). Throughput, a velocity number, is shown with rework share.
    const G = [['Outcome', ['Rework share', 'First-turn resolution', 'Spec deviation']], ['Quality', ['Duplication', 'Edit before read', 'Churn']],
      ['Velocity', ['Throughput', 'Time to useful result']], ['Usage', ['Tokens per day', 'Cache reuse']], ['Cost', ['Cost per result']]];
    const cols = G.map(([g, ms], i) => '<div class="sensei-col" style="left:' + (880 + i * 191) + 'px"><h4>' + g + '</h4>' + ms.map((m) => '<div class="sensei-m">' + m + '</div>').join('') + '</div>').join('');
    // Rework share tops the outcome column (x 968), throughput the velocity column (x 1350): the link arcs over the quality column.
    kit.stage.append(kit.h('<div class="ground"><div class="cam sensei-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('sensei-bg') + '</svg>' + cols +
      '<svg class="art" viewBox="0 0 1920 1080"><path class="sensei-link" pathLength="1" d="M968 290 C968 170, 1350 170, 1350 290" style="fill:none;stroke:var(--accent);stroke-width:5;stroke-dasharray:1 1;stroke-linecap:round"/></svg>' +
      '<span class="tag hot sensei-pair">Always shown together</span></div>' +
      W.head('sensei-head', 'In Sensei', 'Speed is never shown alone.', 'Metrics grouped by what they answer, velocity next to its quality companion.', 'left:110px;top:300px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.sensei-cam'), head: q('.sensei-head'), cols: all('.sensei-col'), ms: all('.sensei-m'), link: q('.sensei-link'), pair: q('.sensei-pair') });
    this.pairIdx = [0, 6];
    W.portrait(kit, { hoist: ['.sensei-head'], frame: [640, 1000], crop: [865, 110, 970, 720], css: '.sensei-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 9, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    this.cols.forEach((c, i) => W.fade(c, t, 0.8 + i * 0.35, this.K));
    this.ms.forEach((m, i) => m.classList.toggle('on', this.pairIdx.includes(i) && t > 3.6));
    W.draw(this.link, t, 3.8, 4.8, this.K);
    W.pop(this.pair, t, 4.8, this.K, 'translate(-50%,0)');
  },
});
