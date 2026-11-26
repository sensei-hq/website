// @ts-nocheck: a scene module, run by the motion kit (src/lib/motion/films.ts), not imported.
// The security board: washi paper with a faint dot grid. Assistants are paper tiles, content is cards, links are ink wires.
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
    if (kind === 'tri') return '<path d="M0 -30 L28 22 H-28 Z" ' + s + '/>';
    if (kind === 'grid') return '<g ' + f + '><rect x="-28" y="-28" width="22" height="22" rx="5"/><rect x="6" y="-28" width="22" height="22" rx="5"/><rect x="-28" y="6" width="22" height="22" rx="5"/><rect x="6" y="6" width="22" height="22" rx="11"/></g>';
    if (kind === 'db') return '<g ' + s + '><ellipse cx="0" cy="-20" rx="28" ry="10"/><path d="M-28 -20 V20 Q0 34 28 20 V-20 M-28 0 Q0 14 28 0"/></g>';
    if (kind === 'lock') return '<path d="M-16 -6 V-18 Q-16 -32 0 -32 Q16 -32 16 -18 V-6" ' + s + '/><rect x="-26" y="-6" width="52" height="38" rx="8" ' + f + '/>';
    return '<path d="M-30 6 Q-15 -20 0 6 T30 6" ' + s + '/>';
  },
  // A tile centred on (0,0), lit from above: a pale face with a hairline and a soft shadow.
  node(cls, kind, tone, size) {
    const z = size || 156, h = z / 2, band = tone === 'hot' ? 'var(--accent)' : tone === 'ok' ? 'var(--jade)' : 'var(--main)';
    return '<g class="' + cls + '">' +
      '<rect x="' + -h + '" y="' + (-h + 12) + '" width="' + z + '" height="' + z + '" rx="' + z * 0.19 + '" style="fill:var(--shade)"/>' +
      '<rect x="' + -h + '" y="' + -h + '" width="' + z + '" height="' + z + '" rx="' + z * 0.19 + '" style="fill:var(--tile);stroke:var(--hair);stroke-width:3"/>' +
      '<rect class="' + cls + '-band" x="' + -h * 0.6 + '" y="' + -h + '" width="' + h * 1.2 + '" height="10" rx="5" style="fill:' + band + '"/>' +
      '<g transform="translate(0 4) scale(' + z / 156 + ')">' + W.glyph(kind, tone === 'hot' ? 'var(--accent)' : 'var(--main)') + '</g></g>';
  },
  // A shield: the guard that stands between content and action. Pivot at its centre.
  shield(cls, color) {
    return '<g class="' + cls + '"><path d="M0 -70 L56 -48 V4 Q56 50 0 74 Q-56 50 -56 4 V-48 Z" style="fill:var(--shade)" transform="translate(0 10)"/>' +
      '<path d="M0 -70 L56 -48 V4 Q56 50 0 74 Q-56 50 -56 4 V-48 Z" style="fill:' + (color || 'var(--jade)') + '"/>' +
      '<path d="M-20 2 L-5 17 L22 -12" style="fill:none;stroke:var(--ground);stroke-width:9;stroke-linecap:round;stroke-linejoin:round"/></g>';
  },
  tick(cls, color) {
    return '<g class="' + cls + '"><circle r="24" style="fill:' + (color || 'var(--jade)') + '"/><path d="M-11 1 L-3 9 L12 -8" style="fill:none;stroke:var(--ground);stroke-width:6;stroke-linecap:round;stroke-linejoin:round"/></g>';
  },
  cross(cls) {
    return '<g class="' + cls + '"><circle r="24" style="fill:var(--accent)"/><path d="M-9 -9 L9 9 M9 -9 L-9 9" style="fill:none;stroke:var(--ground);stroke-width:6;stroke-linecap:round"/></g>';
  },
  pointer(cls) {
    return '<g class="' + cls + '"><path d="M4 8 L4 62 L18 49 L30 74 L42 68 L30 44 L48 44 Z" style="fill:var(--shade)"/>' +
      '<path d="M0 0 L0 56 L14 43 L26 68 L38 62 L26 38 L44 38 Z" style="fill:var(--second);stroke:var(--ground);stroke-width:4;stroke-linejoin:round"/></g>';
  },
  qpt(a, c, b, p) {
    const u = 1 - p;
    return [u * u * a[0] + 2 * u * p * c[0] + p * p * b[0], u * u * a[1] + 2 * u * p * c[1] + p * p * b[1]];
  },
  wire(cls, a, c, b, color) {
    return '<path class="' + cls + '" pathLength="1" d="M' + a[0] + ' ' + a[1] + ' Q' + c[0] + ' ' + c[1] + ' ' + b[0] + ' ' + b[1] + '" style="fill:none;stroke:' + (color || 'var(--wire)') + ';stroke-width:6;stroke-linecap:round"/>';
  },
  // A heading block: eyebrow, line, sub, anchored by its top-left corner.
  head(cls, eyebrow, line, sub, style) {
    return '<div class="words ' + cls + '" style="' + style + '">' + (eyebrow ? '<p class="eyebrow">' + eyebrow + '</p>' : '') +
      '<h2 class="line">' + line + '</h2>' + (sub ? '<p class="sub">' + sub + '</p>' : '') + '</div>';
  },
  // The heading arrives in order: eyebrow, line word by word, then the sub.
  showHead(el, t, t0, K) {
    const kids = [...el.children];
    kids.forEach((k) => {
      if (k.classList.contains('line')) K.TextFx.fadeFromRight(k, t, t0 + 0.15);
      else { const d = k.classList.contains('eyebrow') ? 0 : 0.9, p = K.eo(K.seg(t, t0 + d, t0 + d + 0.5)); k.style.opacity = p; k.style.transform = 'translateX(' + K.lerp(26, 0, p) + 'px)'; }
    });
  },
  // A list of mitigations, each row a tick and one line of words.
  checks(cls, items, style) {
    return '<div class="checks ' + cls + '" style="' + style + '">' + items.map(s => '<div class="chk"><i></i><span>' + s + '</span></div>').join('') + '</div>';
  },
  showChecks(el, t, t0, gap, K) {
    [...el.children].forEach((r, i) => {
      const p = K.seg(t, t0 + i * gap, t0 + i * gap + 0.5);
      r.style.opacity = K.eo(p);
      r.style.transform = 'translateY(' + K.lerp(22, 0, K.eo(p)) + 'px)';
      const dot = r.firstChild; dot.style.transform = 'scale(' + K.lerp(0.2, 1, K.eob(K.seg(t, t0 + i * gap + 0.2, t0 + i * gap + 0.55), 1.8)) + ')';
    });
  },
  // A slow push on a camera layer, never reversing.
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
