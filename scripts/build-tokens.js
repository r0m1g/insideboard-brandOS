#!/usr/bin/env node
/*
 * scripts/build-tokens.js
 *
 * Read tokens.json (W3C Design Tokens, 3-tier: primitive → semantic → component)
 * and emit brandOS-tokens.css.
 *
 *   node scripts/build-tokens.js
 *
 * See ADR-002 for the rationale.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'tokens.json');
const OUT = path.join(ROOT, 'brandOS-tokens.css');

// ----------------------------------------------------------------------------
// Walk the token tree → flat list of leaves { path, name, type, value }
// ----------------------------------------------------------------------------

function walk(node, parts = []) {
  if (node && typeof node === 'object' && '$value' in node) {
    return [{
      path: parts.join('.'),
      name: parts[parts.length - 1],
      type: node.$type,
      value: node.$value,
    }];
  }
  const out = [];
  for (const [k, v] of Object.entries(node || {})) {
    if (k.startsWith('$') || !v || typeof v !== 'object') continue;
    out.push(...walk(v, [...parts, k]));
  }
  return out;
}

// ----------------------------------------------------------------------------
// Resolve a W3C alias or typed value to a CSS-ready string.
// Leaf-name equals CSS variable name in this project, so only the last
// segment of the alias path is needed.
// ----------------------------------------------------------------------------

function resolveValue(value, type) {
  if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
    const leaf = value.slice(1, -1).split('.').pop();
    return `var(--${leaf})`;
  }
  if (type === 'fontFamily' && Array.isArray(value)) {
    const GENERIC = new Set([
      'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy',
      'system-ui', 'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded',
      'math', 'emoji', 'fangsong',
    ]);
    return value.map(f => GENERIC.has(f) ? f : `"${f}"`).join(', ');
  }
  return String(value);
}

// ----------------------------------------------------------------------------
// Classify a primitive color leaf into its :root sub-section.
// Order matters: IRON must match before generic fn-* fallback.
// ----------------------------------------------------------------------------

const COLOR_SECTIONS = [
  { label: 'PRIMARY PALETTE',
    match: n => ['white', 'ivory', 'gray-50', 'stone', 'ink', 'ember'].includes(n) },
  { label: 'WARM GRAY SCALE — 11 steps',
    match: n => /^gray-(100|200|300|400|500|600|700|800|900|950)$/.test(n) },
  { label: 'IRON AGENTS — reserved, do not use outside agent contexts',
    match: n => ['fn-coral', 'fn-blue', 'fn-sage', 'fn-lavender'].includes(n) },
  { label: 'GENERAL FUNCTIONAL PALETTE',
    match: n => /^fn-/.test(n) },
  { label: 'SEMANTIC TOKENS', match: () => false }, // semantic layer handled separately
];

function classifyPrimitiveColor(name) {
  for (const s of COLOR_SECTIONS.slice(0, 4)) if (s.match(name)) return s.label;
  throw new Error(`Unclassified primitive color token: ${name}`);
}

// ----------------------------------------------------------------------------
// Map each leaf to its :root section name. Returns null for tokens that are
// handled outside :root (density variants).
// ----------------------------------------------------------------------------

function sectionFor(t) {
  const [tier, group] = t.path.split('.');
  if (tier === 'primitive') {
    if (group === 'color')   return classifyPrimitiveColor(t.name);
    if (group === 'spacing') return 'SPACING SCALE';
    if (group === 'font')    return 'TYPOGRAPHY';
  }
  if (tier === 'semantic') {
    if (group === 'color')                               return 'SEMANTIC TOKENS';
    if (group === 'density' && t.name === 'default')    return 'DENSITY';
    if (group === 'density')                            return null; // variant → own selector
  }
  if (tier === 'component') return 'COMPONENT TOKENS';
  return null;
}

// ----------------------------------------------------------------------------
// Emit :root body, grouped with sub-section comments.
// ----------------------------------------------------------------------------

const SECTION_ORDER = [
  'PRIMARY PALETTE',
  'WARM GRAY SCALE — 11 steps',
  'IRON AGENTS — reserved, do not use outside agent contexts',
  'GENERAL FUNCTIONAL PALETTE',
  'SEMANTIC TOKENS',
  'SPACING SCALE',
  'TYPOGRAPHY',
  'DENSITY',
  'COMPONENT TOKENS',
];

// semantic.density.default is special: the CSS variable name is --density,
// not --default (which is what the leaf key would produce).
function cssVarName(t) {
  if (t.path === 'semantic.density.default') return 'density';
  return t.name;
}

function emitRoot(leaves) {
  const blocks = new Map(SECTION_ORDER.map(label => [label, []]));

  for (const t of leaves) {
    const section = sectionFor(t);
    if (!section) continue;
    const value = resolveValue(t.value, t.type);
    blocks.get(section).push(`  --${cssVarName(t)}: ${value};`);
  }

  return [...blocks.entries()]
    .filter(([, lines]) => lines.length)
    .map(([label, lines]) => `  /* --- ${label} --- */\n${lines.join('\n')}`)
    .join('\n\n');
}

// ----------------------------------------------------------------------------
// Density variants — one selector per semantic.density.{name} != default.
// ----------------------------------------------------------------------------

function emitDensityVariants(leaves) {
  const variants = leaves
    .filter(t => t.path.startsWith('semantic.density.') && t.name !== 'default')
    .map(t => ({ selector: `[data-density="${t.name}"]`, value: resolveValue(t.value, t.type) }));
  if (!variants.length) return '';
  const w = Math.max(...variants.map(v => v.selector.length));
  return variants
    .map(v => `${v.selector.padEnd(w)} { --density: ${v.value}; }`)
    .join('\n');
}

// ----------------------------------------------------------------------------
// Static header (banner + @font-face). @font-face is configuration, not tokens.
// Edit fonts here when the font roster changes.
// ----------------------------------------------------------------------------

const HEADER = `/* ==========================================================================
   INSIDEBOARD AI — BRAND TOKENS
   GENERATED FILE — do not edit by hand.
   Source:    tokens.json  (W3C Design Tokens Community Group format)
   Generator: scripts/build-tokens.js
   To change a value, edit tokens.json and re-run \`node scripts/build-tokens.js\`.
   See ADR-002 for the rationale.
   ========================================================================== */

/* --- SELF-HOSTED FONTS --- */
@font-face {
  font-family: 'Outfit';
  font-style: normal;
  font-weight: 300 600;
  font-display: swap;
  src: url('assets/fonts/outfit-latin-ext.woff2') format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
@font-face {
  font-family: 'Outfit';
  font-style: normal;
  font-weight: 300 600;
  font-display: swap;
  src: url('assets/fonts/outfit-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400 500;
  font-display: swap;
  src: url('assets/fonts/jetbrains-mono-latin-ext.woff2') format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400 500;
  font-display: swap;
  src: url('assets/fonts/jetbrains-mono-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}`;

const FOOTER = `/* --- BASE RESET --- */
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; overflow-x: hidden; }
body {
  font-family: var(--sans);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.55;
  color: var(--ink);
  background: rgba(250,250,249,.5);
  -webkit-font-smoothing: antialiased;
}
a { color: inherit; }
button { font: inherit; cursor: pointer; border: 0; background: none; color: inherit; }`;

// ----------------------------------------------------------------------------
// Build
// ----------------------------------------------------------------------------

const tokens = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const leaves = walk(tokens);

const css = [
  HEADER,
  '',
  ':root {',
  emitRoot(leaves),
  '}',
  '',
  emitDensityVariants(leaves),
  '',
  FOOTER,
  '',
].join('\n');

fs.writeFileSync(OUT, css);

const tierCounts = ['primitive', 'semantic', 'component'].map(tier => {
  const n = leaves.filter(t => t.path.startsWith(tier + '.')).length;
  return `${tier}: ${n}`;
});
console.log(`✓ Wrote ${path.relative(ROOT, OUT)}  (${leaves.length} tokens — ${tierCounts.join(', ')})`);
