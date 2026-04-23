# InsideBoard AI BrandOS — File Architecture & Process

## File structure

```
insideboard-brandOS/          ← project root
├── brandOS-tokens.css        # CSS variables, palette, typography, spacing tokens
├── brandOS-components.css    # All component styles, layout, navigation, responsive rules
├── index.html              # Pure HTML structure — named index.html for GitHub Pages
├── brandOS-content.md        # Content source of truth — update this, not the HTML
├── PROCESS.md                # This file — architecture and update process
└── CLAUDE.md                 # Permanent context file — auto-read by Claude Code on session start
```

---

## Role of each file

### `brandOS-tokens.css`
CSS variables only: primary palette, warm gray scale, IRON agent colors, functional palette, semantic tokens, spacing scale, typography stacks, density variants, base reset.

**Edit when:** A color value changes, a new token is added, a spacing unit is adjusted.
**Never edit to:** Add component styles, layout rules, or anything that isn't a pure variable or base reset.

### `brandOS-components.css`
All component styles: layout shell, nav, hero, chapter, rules, callouts, formulas, audience cards, type specimens, swatches, color bars, register switcher, tweaks panel, mobile nav, all responsive breakpoints.

**Edit when:** A component's visual behavior changes, a new component is added, a responsive rule is updated.
**Never edit to:** Define token values (those live in brandOS-tokens.css).

### `index.html`
Pure HTML structure. Links to `brandOS-tokens.css` and `brandOS-components.css`. Contains inline JS (40 lines — register switcher, density tweaks, nav active state, mobile toggle). Each section is delimited by `<!-- SECTION: id -->` and `<!-- /SECTION: id -->` markers.

**Edit when:** Content changes (a section is rewritten, updated, or added).
**Never edit to:** Change visual styles — edit the CSS files instead.
**Never add:** `<style>` blocks inside this file.

### `brandOS-content.md`
The source of truth for all BrandOS content. Written in Markdown. Maps 1:1 to the HTML sections.

**Edit when:** Brand decisions evolve, sections are validated, new layers are added.
**This is the only file Claude reads to update content.**

---

## Update protocols

### Update type 1 — Content change (most frequent)
A section of `brandOS-content.md` has been updated. Regenerate the corresponding HTML section.

**Prompt to use in Claude Code:**
```
Read brandOS-components.css to understand the available classes.
Read brandOS-content.md section [SECTION ID — e.g. "2·2 Tone & voice"].
Using str_replace, update only the HTML section between <!-- SECTION: s22 --> and <!-- /SECTION: s22 --> in index.html.
Do not touch any other section. Do not rewrite the file. Use str_replace only.
```

---

### Update type 2 — Visual token change
A color value, spacing unit, or font token has changed.

**Prompt to use in Claude Code:**
```
Open brandOS-tokens.css.
Update [TOKEN NAME] from [OLD VALUE] to [NEW VALUE].
Use str_replace. Do not touch brandOS-components.css or index.html.
```

---

### Update type 3 — Component behavior change
A component's layout or style needs to change (e.g., the audience cards need a different padding, a new callout variant is added).

**Prompt to use in Claude Code:**
```
Open brandOS-components.css.
Find the [COMPONENT NAME] section (marked with a /* COMPONENT */ comment).
Update [SPECIFIC RULE] using str_replace.
Do not rewrite the file. Do not touch brandOS-tokens.css or index.html.
```

---

### Update type 4 — New section added
A new layer or section needs to be added to the BrandOS.

**Step 1:** Add the new content to `brandOS-content.md` under the correct layer heading.

**Step 2 — Prompt to use in Claude Code:**
```
Read brandOS-components.css for available classes.
Read the new section [SECTION TITLE] from brandOS-content.md.
Add a new HTML section after <!-- /SECTION: [PREVIOUS SECTION ID] --> in index.html.
Use this structure:
<!-- SECTION: [NEW ID] -->
<section class="chapter" id="[NEW ID]">
  ...
</section>
<!-- /SECTION: [NEW ID] -->
Also add the corresponding nav item in <!-- SECTION: nav --> under the correct layer group.
Use str_replace only. Do not rewrite the file.
```

---

### Update type 5 — Full content regeneration (rare)
`brandOS-content.md` has changed significantly across multiple sections. Regenerate `index.html` from scratch.

**Prompt to use in Claude Code:**
```
Read brandOS-tokens.css and brandOS-components.css in full — these define all available classes and variables.
Read brandOS-content.md in full — this is the content source.
Regenerate index.html following exactly the structure of the current index.html:
- Link to brandOS-tokens.css and brandOS-components.css (no inline styles)
- Use the same section IDs (s00, s11, s12... s50)
- Wrap each section with <!-- SECTION: id --> and <!-- /SECTION: id --> markers
- Preserve the nav structure, tweaks panel, and inline JS block verbatim
- Do not add <style> blocks
Write the result to index.html.
```

---

## Rules for Claude Code (non-negotiable)

1. **str_replace only for targeted updates** — never rewrite an entire file when only a section has changed.
2. **One file per operation** — a content update touches `index.html` only. A token update touches `brandOS-tokens.css` only.
3. **Never add `<style>` blocks to `index.html`** — all styles live in the CSS files.
4. **Never read `brandOS-tokens.css` for content updates** — only `brandOS-components.css` (for class names) and `brandOS-content.md` (for content).
5. **Section markers are stable** — `<!-- SECTION: id -->` and `<!-- /SECTION: id -->` must be preserved in all operations.

---

## Section ID map

| ID    | Content                        | Layer |
|-------|-------------------------------|-------|
| s00   | Introduction & Governance      | 00    |
| s11   | Positioning                    | 01    |
| s12   | The Closed Loop                | 01    |
| s13   | The Success Formula            | 01    |
| s14   | Audiences                      | 01    |
| s15   | Application territories        | 01    |
| s16   | IRON                           | 01    |
| s17   | Trust architecture             | 01    |
| s21   | Verbal architecture            | 02    |
| s22   | Tone & voice                   | 02    |
| s23   | Verbal registers               | 02    |
| s24   | Audience messaging             | 02    |
| s25   | Non-negotiable rules           | 02    |
| s26   | Anti-patterns                  | 02    |
| s27   | Reference card                 | 02    |
| s01   | Type system                    | 03    |
| s02   | Color system                   | 03    |
| s02b  | Data visualisation             | 03    |
| s03   | Space & grid                   | 03    |
| s04   | Iconography                    | 03    |
| s05   | Illustration & visual treatment| 03    |
| s06   | The butterfly mark             | 03    |
| s07   | Composition patterns           | 03    |
| s08   | Photography                    | 03    |
| s09   | Motion & interaction           | 03    |
| s10   | Transversal coherence          | 03    |
| s40   | Brand Experience Map           | 04    |
| s50   | Brand Voice in Action          | 05    |
