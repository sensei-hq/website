// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
// The working board: washi paper with a faint dot grid. AI output arrives as cards; the cycle is a ring of six stations.
window.W = {
  board(id) {
    return '<defs><pattern id="' + id + '" width="48" height="48" patternUnits="userSpaceOnUse"><circle cx="24" cy="24" r="2.4" style="fill:var(--dot)"/></pattern></defs>' +
      '<g class="board"><rect x="-400" y="-300" width="2720" height="1680" fill="url(#' + id + ')"/></g>';
  },
  glyph(kind, color) {
    const s = 'style="fill:none;stroke:' + color + ';stroke-width:9;stroke-linecap:round;stroke-linejoin:round"';
    const f = 'style="fill:' + color + '"';
    if (kind === 'spark') return '<path d="M0 -34 Q4 -4 34 0 Q4 4 0 34 Q-4 4 -34 0 Q-4 -4 0 -34 Z" ' + f + '/>';
    if (kind === 'brace') return '<path d="M-12 -30 Q-24 -30 -24 -18 V-8 Q-24 0 -32 0 Q-24 0 -24 8 V18 Q-24 30 -12 30 M12 -30 Q24 -30 24 -18 V-8 Q24 0 32 0 Q24 0 24 8 V18 Q24 30 12 30" ' + s + '/>';
    if (kind === 'ring') return '<circle r="26" ' + s + '/><circle r="9" ' + f + '/>';
    if (kind === 'list') return '<g ' + s + '><path d="M-12 -22 H28 M-12 0 H28 M-12 22 H18"/></g><g ' + f + '><circle cx="-26" cy="-22" r="5"/><circle cx="-26" cy="0" r="5"/><circle cx="-26" cy="22" r="5"/></g>';
    if (kind === 'check') return '<circle r="28" ' + s + '/><path d="M-13 1 L-3 11 L15 -9" ' + s + '/>';
    if (kind === 'steps') return '<path d="M-30 24 H-10 V6 H10 V-12 H30" ' + s + '/><circle cx="30" cy="-26" r="6" ' + f + '/>';
    if (kind === 'doc') return '<path d="M-22 -30 H10 L24 -16 V30 H-22 Z" ' + s + '/>';
    return '<path d="M-30 6 Q-15 -20 0 6 T30 6" ' + s + '/>';
  },
  node(cls, kind, tone, size) {
    const z = size || 156, h = z / 2, band = tone === 'hot' ? 'var(--accent)' : tone === 'ok' ? 'var(--jade)' : 'var(--main)';
    return '<g class="' + cls + '">' +
      '<rect x="' + -h + '" y="' + (-h + 12) + '" width="' + z + '" height="' + z + '" rx="' + z * 0.19 + '" style="fill:var(--shade)"/>' +
      '<rect class="' + cls + '-face" x="' + -h + '" y="' + -h + '" width="' + z + '" height="' + z + '" rx="' + z * 0.19 + '" style="fill:var(--tile);stroke:var(--hair);stroke-width:3"/>' +
      '<rect class="' + cls + '-band" x="' + -h * 0.6 + '" y="' + -h + '" width="' + h * 1.2 + '" height="10" rx="5" style="fill:' + band + '"/>' +
      '<g transform="translate(0 4) scale(' + z / 156 + ')">' + W.glyph(kind, tone === 'hot' ? 'var(--accent)' : 'var(--main)') + '</g></g>';
  },
  tick(cls, color) {
    return '<g class="' + cls + '"><circle r="24" style="fill:' + (color || 'var(--jade)') + '"/><path d="M-11 1 L-3 9 L12 -8" style="fill:none;stroke:var(--ground);stroke-width:6;stroke-linecap:round;stroke-linejoin:round"/></g>';
  },
  // An output card: a paper slip of code or prose lines, centred on (0,0).
  slip(cls, kind, seed) {
    let lines = '';
    for (let k = 0; k < 4; k++) {
      const w = 40 + ((seed * 37 + k * 53) % 60), x = kind === 'code' ? -50 + (k % 2) * 14 : -50;
      lines += '<path d="M' + x + ' ' + (-20 + k * 16) + ' h' + w + '" style="stroke:' + (kind === 'code' && k === 1 ? 'var(--accent)' : 'color-mix(in srgb, var(--second) 35%, var(--tile))') + ';stroke-width:6;stroke-linecap:round"/>';
    }
    return '<g class="' + cls + '"><rect x="-66" y="-34" width="132" height="84" rx="10" style="fill:var(--shade)"/><rect x="-66" y="-42" width="132" height="84" rx="10" style="fill:var(--tile);stroke:var(--hair);stroke-width:2.5"/>' + lines + '</g>';
  },
  // The cycle: six stations on a ring, clockwise from the top.
  cyc: { c: [1340, 560], r: 330,
    st: [['spark', 'Concept'], ['list', 'Requirements'], ['check', 'Verification'], ['brace', 'Design + UX'], ['steps', 'Phased plan'], ['ring', 'Results']],
    at(i) { const a = (-90 + 60 * i) * Math.PI / 180; return [W.cyc.c[0] + W.cyc.r * Math.cos(a), W.cyc.c[1] + W.cyc.r * Math.sin(a)]; },
    arcs(cls) {
      let s = '';
      for (let i = 0; i < 6; i++) {
        const a = W.cyc.at(i), b = W.cyc.at((i + 1) % 6), r = W.cyc.r;
        s += '<path class="' + cls + '" pathLength="1" d="M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' A' + r + ' ' + r + ' 0 0 1 ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1) + '" style="fill:none;stroke:var(--wire);stroke-width:6;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1"/>';
      }
      return s;
    },
    stations(cls) { return W.cyc.st.map((s, i) => { const p = W.cyc.at(i); return '<g class="' + cls + '" transform="translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ')">' + W.node(cls + '-n', s[0], 'ink', 128) + '</g>'; }).join(''); },
    tags(cls) { return W.cyc.st.map((s, i) => { const p = W.cyc.at(i); return '<div class="tag ' + cls + '" style="left:' + p[0].toFixed(0) + 'px;top:' + (p[1] + 74).toFixed(0) + 'px">' + s[1] + '</div>'; }).join(''); },
  },
  head(cls, eyebrow, line, sub, style) {
    return '<div class="words ' + cls + '" style="' + style + '">' + (eyebrow ? '<p class="eyebrow">' + eyebrow + '</p>' : '') +
      '<h2 class="line">' + line + '</h2>' + (sub ? '<p class="sub">' + sub + '</p>' : '') + '</div>';
  },
  showHead(el, t, t0, K) {
    [...el.children].forEach((k) => {
      if (k.classList.contains('line')) K.TextFx.fadeFromRight(k, t, t0 + 0.15);
      else { const d = k.classList.contains('eyebrow') ? 0 : 0.9, p = K.eo(K.seg(t, t0 + d, t0 + d + 0.5)); k.style.opacity = p; k.style.transform = 'translateX(' + K.lerp(26, 0, p) + 'px)'; }
    });
  },
  checks(cls, items, style) {
    return '<div class="checks ' + cls + '" style="' + style + '">' + items.map(s => '<div class="chk"><i></i><span>' + s + '</span></div>').join('') + '</div>';
  },
  showChecks(el, t, t0, gap, K) {
    [...el.children].forEach((r, i) => {
      const p = K.seg(t, t0 + i * gap, t0 + i * gap + 0.5);
      r.style.opacity = K.eo(p);
      r.style.transform = 'translateY(' + K.lerp(22, 0, K.eo(p)) + 'px)';
      r.firstChild.style.transform = 'scale(' + K.lerp(0.2, 1, K.eob(K.seg(t, t0 + i * gap + 0.2, t0 + i * gap + 0.55), 1.8)) + ')';
    });
  },
  push(el, t, dur, a, b, K) { el.style.transform = 'scale(' + K.lerp(a, b, K.eio(K.seg(t, 0, dur))).toFixed(4) + ')'; },
};

// ── Portrait (9:16) ────────────────────────────────────────────────────────────────────────────────
// The same scenes as the 16:9 film, recomposed from two columns into rows: each scene lifts its words
// out ("hoist", then placed by its own CSS) and shows one region of its 1920x1080 board ("crop"), scaled
// to fill the frame band ("frame": [top, height]) beneath or around them.
W.portrait = function (kit, spec) {
  const ground = kit.stage.querySelector('.ground');
  if (!ground || kit.W >= kit.H) return;
  const PW = kit.W;
  const lifted = (spec.hoist || []).flatMap((s) => [...ground.querySelectorAll(s)]);
  const inner = document.createElement('div');
  inner.className = 'pt-inner';
  [...ground.children].forEach((el) => { if (!lifted.includes(el)) inner.appendChild(el); });
  const [fy, fh] = spec.frame;
  const [cx, cy, cw, ch] = spec.crop;
  const s = Math.min(PW / cw, fh / ch);
  const frame = document.createElement('div');
  frame.className = 'pt-frame';
  frame.style.cssText = 'position:absolute;left:0;top:' + fy + 'px;width:' + PW + 'px;height:' + fh + 'px;overflow:hidden';
  inner.style.cssText = 'position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:0 0;transform:translate(' +
    ((PW - cw * s) / 2 - cx * s).toFixed(1) + 'px,' + ((fh - ch * s) / 2 - cy * s).toFixed(1) + 'px) scale(' + s.toFixed(4) + ')';
  frame.appendChild(inner);
  ground.appendChild(frame);
  lifted.forEach((el) => ground.appendChild(el));
  if (spec.css) kit.css(spec.css);
};
