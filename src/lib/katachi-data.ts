// ─── Katachi product page content — from github.com/sensei-hq/katachi (README, docs/prd) ───
// A hobbyist's entry-level craft tool: snap a photo, say what you want, and get a
// measured, cut-ready design. What it does today, and what is still to come, is
// said as the product's own README says it — nothing here runs ahead of it.

export const KATACHI_URL = 'https://katachi.sensei-hq.com';
export const KATACHI_REPO = 'https://github.com/sensei-hq/katachi';

export interface Step {
  kanji: string;
  verb: string;
  title: string;
  text: string;
}

export interface Make {
  kanji: string;
  title: string;
  text: string;
}

export interface Machine {
  name: string;
  output: string;
  status: 'Today' | 'Coming';
}

export interface Maker {
  who: string;
  wants: string;
}

/** The loop, in the order you live it. */
export const STEPS: Step[] = [
  { kanji: '見', verb: 'Show it', title: 'Snap a photo', text: 'A sketch, the thing it has to fit, and a card or ruler for scale. Katachi finds the shapes — the layers, the pieces, the holes, the engraving.' },
  { kanji: '言', verb: 'Say it', title: 'Say what you want', text: '“Four coasters with this logo, sized for this mug, 3 mm birch.” Push to talk, or type. No vector editor, no measuring by hand.' },
  { kanji: '測', verb: 'Measure it', title: 'Measured, not guessed', text: 'Sizes come from the photo against your reference, worked out in code. The model sees and plans; the numbers are computed.' },
  { kanji: '試', verb: 'See it', title: 'Preview before you cut', text: 'A photoreal render in your material, then the whole cut played back on a virtual bed and the flat pieces assembled — before any wood is burned.' },
  { kanji: '燃', verb: 'Make it', title: 'Cut-ready files', text: 'Parts with joints, laid out on the sheet, as G-code for your laser or SVG for your cutting software. Record the burn and Katachi points out flare-ups or a shifted piece.' },
];

/** What a beginner can make in an evening. */
export const MAKES: Make[] = [
  { kanji: '層', title: 'Layered paper art', text: 'A picture split into stacked layers, cut sheet by sheet and glued into depth.' },
  { kanji: '栞', title: 'Fretwork bookmarks', text: 'A sketch traced into clean cut lines and holes you can thread a ribbon through.' },
  { kanji: '飾', title: 'Earrings and ornaments', text: 'Small pieces nested tight on one sheet, so little material goes to waste.' },
  { kanji: '城', title: 'Wooden kits', text: 'Boxes, holders and castles with finger joints sized to your sheet’s real thickness.' },
];

export const MACHINES: Machine[] = [
  { name: 'Diode lasers (GRBL) — e.g. Longer Ray 5', output: 'G-code · SVG', status: 'Today' },
  { name: 'LightBurn, xTool, Glowforge', output: 'SVG import', status: 'Today' },
  { name: 'Cricut and Silhouette', output: 'Scored, folded blanks', status: 'Coming' },
  { name: '3D printers', output: 'Extruded solids', status: 'Coming' },
];

export const MAKERS: Maker[] = [
  { who: 'The weekend maker', wants: 'Has a laser and an idea, and wants to get from one to the other without an evening in a vector editor.' },
  { who: 'The crafter', wants: 'Wants a child’s drawing or a quick sketch turned into a clean cut, sized for the jar it goes on.' },
  { who: 'The small shop', wants: 'Has forty names to engrave and wants them nested, planned and ready by morning.' },
];

export const KATACHI_NAV_LINKS = [
  ['#how', 'How it works'],
  ['#make', 'What you make'],
  ['#machines', 'Machines'],
] as const;
