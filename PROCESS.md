# InsideBoard AI BrandOS — File Architecture & Process

## File structure

```
insideboard-brandOS/          ← project root
├── tokens.json               # Design tokens — source of truth (W3C format)
├── brandOS-tokens.css        # GENERATED from tokens.json — do not hand-edit
├── brandOS-components.css    # All component styles, layout, navigation, responsive rules
├── index.html                # Pure HTML structure — named index.html for GitHub Pages
├── brandOS-content.md        # Content source of truth — update this, not the HTML
├── scripts/
│   └── build-tokens.js       # Generator: tokens.json → brandOS-tokens.css
├── PROCESS.md                # This file — architecture and update process
└── CLAUDE.md                 # Permanent context file — auto-read by Claude Code on session start
```

---

## Role of each file

### `tokens.json`
Design tokens in W3C Design Tokens Community Group format — source of truth for the palette, gray scale, IRON agent colors, functional palette, semantic aliases, spacing scale, typography stacks, and density multipliers.

**Edit when:** A color value changes, a new token is added, a spacing unit is adjusted, a font stack changes.
**After editing:** run `node scripts/build-tokens.js` to regenerate `brandOS-tokens.css`.

### `brandOS-tokens.css`
**Generated** from `tokens.json` by `scripts/build-tokens.js`. Contains the `:root` CSS variable block, density variant selectors, and the `@font-face` + base reset header.

**Never edit by hand.** Hand-edits will be lost on the next regeneration. To change a token, edit `tokens.json`. To change a font roster, edit the `HEADER` constant in `scripts/build-tokens.js`.

### `scripts/build-tokens.js`
Minimal Node generator. Reads `tokens.json`, walks the leaf tokens, resolves W3C aliases (`{color.ivory}` → `var(--ivory)`), and writes `brandOS-tokens.css`. Run with `node scripts/build-tokens.js`. No dependencies, no build system.

### `brandOS-components.css`
All component styles: layout shell, nav, hero, chapter, rules, callouts, formulas, audience cards, type specimens, swatches, color bars, register switcher, tweaks panel, mobile nav, all responsive breakpoints.

**Edit when:** A component's visual behavior changes, a new component is added, a responsive rule is updated.
**Never edit to:** Define token values (those live in tokens.json).

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

**After any content update, also verify:**
- Nav `<li>` and hero `.lb` badge match the new section/layer name
- If a new nav item or badge was added, the corresponding `id` exists in `index.html`
- If new multi-column grids or tables were added, a responsive rule exists in `brandOS-components.css`

---

### Update type 2 — Visual token change
A color value, spacing unit, font stack, or density multiplier has changed.

`brandOS-tokens.css` is a **generated** file. Never edit it directly. Edit `tokens.json` (the W3C Design Tokens source of truth), then re-run the generator.

**Prompt to use in Claude Code:**
```
Open tokens.json.
Update [TOKEN PATH — e.g. color.ember, spacing.s4, density.comfortable] from [OLD VALUE] to [NEW VALUE].
Use str_replace. Do not touch brandOS-components.css, index.html, or brandOS-tokens.css.
After the edit, run: node scripts/build-tokens.js
```

**Notes:**
- Aliases use W3C reference syntax: `"$value": "{color.ivory}"` — leaf-name only matters; the generator emits `var(--ivory)`.
- Adding a new token: add a new leaf under the correct group in `tokens.json` with `$type` and `$value`. Then re-run the generator. The leaf key becomes the CSS variable name (`--<leafkey>`).
- The generator preserves `@font-face` and the base reset — those are not tokens. To change a font roster, edit the `HEADER` constant in `scripts/build-tokens.js`.

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

**Step 3 — mandatory after every structural change:**
Update the Section ID map below to reflect the new section. Verify that:
- The new ID matches the `<!-- SECTION: id -->` marker added to `index.html`
- The Layer name matches the `## Layer XX · Name` heading in `brandOS-content.md`
- Status is set to `✓ in HTML`

This step is not optional. Never close a structural operation with the Section ID map out of sync.

---

### Update type 5 — Full content regeneration (rare)
`brandOS-content.md` has changed significantly across multiple sections. Regenerate `index.html` from scratch.

**Prompt to use in Claude Code:**
```
Read tokens.json and brandOS-components.css in full — these define all available variables and classes.
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

### Update type 6 — System playground (new component or page)
Adding or updating a component prototype in `system/`, or creating a new `system/*.html` page.

**Rules:**
- `system/` pages link to `../brandOS-tokens.css` and `../brandOS-components.css` — never duplicate CSS
- All `system/` pages use `<body class="sys">` to activate the product register skin
- Component prototypes use fake/lorem content only — never real brand content
- Once a component is validated in `system/`, it may be promoted to `index.html` via Update type 3 (component) or Update type 4 (new section)

**Prompt to use in Claude Code:**
```
Open system/components.html (or the relevant system/ page).
Add a prototype for [COMPONENT NAME] using fake content.
CSS goes in brandOS-components.css under a /* SYSTEM */ comment if it is workbench-only,
or in the main component block if it will be shared.
Use str_replace only. Do not touch index.html or brandOS-content.md.
```

**After adding a component prototype, check:**
- Does it render correctly with `body.sys` skin (white bg, Steel accent)?
- Is there a responsive rule needed in `brandOS-components.css`?
- If the component will eventually land in `index.html`, is a promotion path clear?

---

### Update type 7 — Sync to main (`/syncmain`)

Publish the current `index.html`, CSS, and `assets/` from `feat/ui-exploration` to `main` so colleagues can see the latest version on GitHub Pages.

**When to sync — Claude proposes this proactively after:**
- A content section is written and validated in `index.html`
- A visual change (token, component) is confirmed working in the browser
- A session ends with meaningful changes to the BrandOS document

**What gets synced — display files only:**
```
index.html
brandOS-tokens.css
brandOS-components.css
assets/
```

**What stays on `feat/ui-exploration` only:**
```
tokens.json          system/       docs/
scripts/             PROCESS.md    CLAUDE.md
```

**Command (say `/syncmain` or "sync main"):**
```bash
git checkout main
git checkout feat/ui-exploration -- index.html brandOS-tokens.css brandOS-components.css assets/
git add index.html brandOS-tokens.css brandOS-components.css assets/
git commit -m "chore: sync display files to main"
git push origin main
git checkout feat/ui-exploration
```

---

## Rules for Claude Code (non-negotiable)

1. **str_replace only for targeted updates** — never rewrite an entire file when only a section has changed.
2. **One file per operation** — a content update touches `index.html` only. A token update touches `tokens.json` only (then re-run the generator). A component update touches `brandOS-components.css` only.
3. **Never hand-edit `brandOS-tokens.css`** — it is generated from `tokens.json`. Edits will be silently overwritten on the next regeneration.
4. **Never add `<style>` blocks to `index.html`** — all styles live in the CSS files.
5. **Never read `tokens.json` or `brandOS-tokens.css` for content updates** — only `brandOS-components.css` (for class names) and `brandOS-content.md` (for content).
6. **Section markers are stable** — `<!-- SECTION: id -->` and `<!-- /SECTION: id -->` must be preserved in all operations.
7. **Content-first, no exception** — Before writing any visible text into `index.html` (labels, captions, mode names, demo copy — anything a user reads), verify it exists verbatim in `brandOS-content.md`. If it doesn't, add it there first, then derive the HTML from it. Never originate content directly in the HTML.

---

## Structure — source of truth

`brandOS-content.md` is the authoritative source for all structural information: layer names, section titles, section order, and what exists or is planned.

**To know what sections exist:** read `brandOS-content.md` — `## Layer` headings define layers, `### N·N Title` headings define sections.
**To know what is implemented:** scan `<!-- SECTION: id -->` markers in `index.html`.

Do not maintain a separate list. Any such list is a derived artifact and will drift.
