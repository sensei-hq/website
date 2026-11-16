// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
const { seg, eo, eio, eob, lerp, clamp01 } = kit;
kit.scene('phish', {
  init(kit) {
    kit.css('.phish-msg { width:600px; padding:22px 26px; display:flex; flex-direction:column; gap:10px; box-shadow:0 12px 28px rgba(0,0,0,.08) }' +
      '.phish-msg h4 { margin:0; font-size:24px; font-weight:600; color:var(--main); letter-spacing:0.04em } .phish-msg p { margin:0; font-size:28px; line-height:1.35 }' +
      '.phish-ghost { width:600px; height:150px }' +
      '.phish-wave { display:flex; align-items:center; gap:6px; height:46px } .phish-wave i { display:block; width:8px; border-radius:4px; background:var(--main) }' +
      '.phish-flag { position:absolute; right:-18px; top:-20px; padding:6px 14px; border-radius:999px; font-size:22px; font-weight:600; background:var(--accent); color:var(--ground) }');
    const ghosts = [0, 1, 2].map(i => '<div class="card phish-ghost" style="left:' + (110 + 16 * (3 - i)) + 'px;top:' + (470 + 14 * (3 - i)) + 'px"></div>').join('');
    const wave = '<div class="phish-wave">' + Array.from({ length: 22 }, () => '<i></i>').join('') + '</div>';
    kit.stage.append(kit.h('<div class="ground"><div class="cam phish-cam"><svg class="art" viewBox="0 0 1920 1080">' + W.board('phish-bg') + '</svg>' + ghosts +
      '<div class="card phish-msg" style="left:110px;top:470px"><h4>EMAIL · Accounts team</h4><p>Hi Priya, as discussed on Monday, please approve the new bank details for Harbor Supply before 3 pm.</p><span class="phish-flag">Urgent + new bank details</span></div>' +
      '<div class="card phish-msg" style="left:300px;top:675px"><h4>CALL · “Your CEO”</h4>' + wave + '<span class="phish-flag">Cloned voice</span></div>' +
      '<div class="card phish-msg" style="left:490px;top:855px"><h4>CHAT · IT support</h4><p>Can you read me the sign-in code I just sent?</p><span class="phish-flag">Asks for a code</span></div></div>' +
      W.head('phish-head', 'AI-driven phishing', 'Lures that look and sound right.', 'Personalised messages and cloned voices, produced at scale.', 'left:110px;top:80px;width:1000px') +
      W.checks('phish-checks', ['Verify requests on a second channel', 'Use phishing-resistant MFA or passkeys', 'Turn on email authentication (SPF, DKIM, DMARC)', 'Run regular awareness drills'], 'left:1240px;top:380px;width:580px') +
      '<p class="phish-note" style="position:absolute;left:1240px;bottom:60px;margin:0;font-size:22px;color:var(--mute)">Names and messages are fictional examples.</p></div>'));
    const all = (s) => [...kit.stage.querySelectorAll(s)], q = (s) => kit.stage.querySelector(s);
    Object.assign(this, { K: kit, cam: q('.phish-cam'), head: q('.phish-head'), checks: q('.phish-checks'), note: q('.phish-note'), msgs: all('.phish-msg'), ghosts: all('.phish-ghost'), flags: all('.phish-flag'), bars: all('.phish-wave i') });
    W.portrait(kit, {"hoist": [".phish-head", ".phish-checks", ".phish-note"], "frame": [520, 680], "crop": [100, 460, 1060, 580], "css": ".phish-head{left:70px!important;right:auto!important;top:140px!important;bottom:auto!important;width:940px!important;max-width:none!important;}.phish-checks{left:70px!important;right:auto!important;top:1240px!important;bottom:auto!important;width:940px!important;max-width:none!important} .chk{font-size:36px!important;padding:18px 24px!important} .phish-note{left:70px!important;bottom:70px!important;font-size:24px!important}"});
  },
  render(t) {
    W.push(this.cam, t, 16, 1, 1.025, this.K);
    W.showHead(this.head, t, -0.4, this.K);
    // Messages arrive one after another across "personal, polished and produced at scale"; copies pile up behind the first.
    this.ghosts.forEach((g, i) => { const p = eo(seg(t, 1.4 + i * 0.4, 1.9 + i * 0.4)); g.style.opacity = p * 0.9; g.style.transform = 'translateY(' + lerp(-30, 0, p) + 'px)'; });
    this.msgs.forEach((m, i) => {
      const p = seg(t, 2.2 + i * 1.5, 2.8 + i * 1.5);
      m.style.opacity = eo(p);
      m.style.transform = 'translateY(' + lerp(40, 0, eob(p, 1.4)).toFixed(1) + 'px) rotate(' + lerp(2, (i - 1) * -0.8, eo(p)).toFixed(2) + 'deg)';
    });
    // The cloned voice speaks, on "even cloned voices".
    this.bars.forEach((b, i) => { const on = seg(t, 3.6, 4.0); b.style.height = (8 + on * (14 + 26 * Math.abs(Math.sin(t * 5.3 + i * 0.9) * Math.sin(t * 2.1 + i * 0.37)))).toFixed(1) + 'px'; });
    // Then each one is caught by its tell-tale sign.
    this.flags.forEach((f, i) => { const p = seg(t, 6.4 + i * 0.6, 6.8 + i * 0.6); f.style.opacity = eo(p); f.style.transform = 'scale(' + lerp(0.6, 1, eob(p, 1.8)).toFixed(3) + ')'; });
    // Each defence lands as the take names it.
    W.showChecks(this.checks, t, 8.0, 2.4, this.K);
    this.note.style.opacity = eo(seg(t, 2.6, 3.2));
  },
});
