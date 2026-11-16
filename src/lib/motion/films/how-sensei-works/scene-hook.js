// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('hook', {
  init(kit) {
    kit.css('.hook-chips { position:absolute; left:930px; top:330px; width:360px; display:grid; grid-template-columns:1fr 1fr; gap:10px }' +
      '.hook-chips span { padding:10px 12px; border-radius:10px; background:var(--ground); border:2px solid var(--hair); font-size:20px; font-weight:600; text-align:center }' +
      '.hook-link { position:absolute; transform:translate(-50%,-50%); font-size:15px; font-weight:700; letter-spacing:.04em; text-transform:uppercase; color:var(--mute); text-align:center; line-height:1.3 }' +
      '.hook-link b { display:block; font-size:30px; color:var(--accent); letter-spacing:0 }');
    // The simplified board: your machine on the left; the models the gateway can use, and your team, on the right.
    kit.stage.append(kit.h('<div class="ground"><div class="cam hook-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('hook-bg') + '</svg>' +
      W.zone('hook-z hook-zm', 880, 180, 450, 640, 'Your machine', '机', 'var(--main)') +
      W.box('hook-b hook-app', 910, 220, 390, 0, '観', 'Sensei app', 'Watches every session', 'var(--accent)') +
      '<div class="hook-chips"><span>CLI</span><span>MCP</span><span>Daemon</span><span>Local DB</span></div>' +
      W.box('hook-b hook-gw', 910, 470, 390, 0, '門', 'Gateway', 'Embedded Ollama · Gemma 4', 'var(--accent)') +
      W.box('hook-b hook-rl', 910, 650, 390, 0, '携', 'Relay', 'Your phone, paired', 'var(--jade)') +
      W.zone('hook-z hook-zi', 1450, 180, 380, 240, 'Other models', '択', 'var(--accent)') +
      W.box('hook-b hook-ol', 1475, 220, 330, 0, '火', 'Ollama host', 'Your GPUs', 'var(--soft)') +
      W.box('hook-b hook-by', 1475, 320, 330, 0, '雲', 'Cloud models', 'Your keys', 'var(--soft)') +
      W.zone('hook-z hook-zt', 1450, 480, 380, 340, 'Your team', '結', 'var(--jade)') +
      W.box('hook-b hook-dj', 1475, 520, 330, 0, '結', 'Dōjō', 'Hosted, or your VPC', 'var(--jade)') +
      W.box('hook-b hook-co', 1475, 680, 330, 0, '群', 'Collective', 'Public, opt-in', 'var(--soft)') +
      '<div class="hook-link hook-l1" style="left:1390px;top:300px"><b>⇄</b>Inference</div><div class="hook-link hook-l2" style="left:1390px;top:620px"><b>⇅</b>Knowledge</div></div>' +
      W.head('hook-head', 'Architecture', 'How does Sensei fit together?', 'Local first, with one gateway for models and a dōjō for your team.', 'left:110px;top:300px;width:680px') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    Object.assign(this, { K: kit, cam: q('.hook-cam'), head: q('.hook-head'), zm: q('.hook-zm'), zi: q('.hook-zi'), zt: q('.hook-zt'), app: q('.hook-app'), chips: all('.hook-chips span'),
      gw: q('.hook-gw'), rl: q('.hook-rl'), ol: q('.hook-ol'), by: q('.hook-by'), dj: q('.hook-dj'), co: q('.hook-co'), l1: q('.hook-l1'), l2: q('.hook-l2') });
    W.portrait(kit, { hoist: ['.hook-head'], frame: [620, 1000], crop: [860, 150, 990, 690], css: '.hook-head{left:70px!important;top:150px!important;width:940px!important}' });
  },
  render(t) {
    W.push(this.cam, t, 11, 1, 1.02, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    // In the order the voice names them: your machine, the gateway, other models, the team, the phone.
    W.fade(this.zm, t, 1.0, this.K); W.fade(this.app, t, 1.4, this.K);
    this.chips.forEach((c, i) => W.fade(c, t, 1.8 + i * 0.15, this.K, 0.35, 8));
    W.fade(this.gw, t, 3.2, this.K);
    W.fade(this.zi, t, 4.4, this.K); W.fade(this.ol, t, 4.7, this.K); W.fade(this.by, t, 4.9, this.K); W.pop(this.l1, t, 5.2, this.K, 'translate(-50%,-50%)');
    W.fade(this.zt, t, 6.2, this.K); W.fade(this.dj, t, 6.5, this.K); W.fade(this.co, t, 6.8, this.K); W.pop(this.l2, t, 7.0, this.K, 'translate(-50%,-50%)');
    W.fade(this.rl, t, 8.2, this.K);
  },
});
