---
name: Script Studio
description: Compact writing workbench with grouped IPA palettes; creator glyph acceptance remains open.
colors:
  ink: "#1b292c"
  muted: "#566569"
  line: "#d9e0e0"
  accent: "#295c65"
  soft: "#edf3f3"
  canvas: "#f4f6f6"
  paper: "#fff"
  output: "#f8fafa"
  paper-surround: "#eaf0f0"
  field: "#f7f9f9"
  palette: "#f5f7f7"
  warning: "#97412e"
typography:
  body:
    fontFamily: '"Avenir Next", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "16px"
  brand:
    fontFamily: '"Avenir Next", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "1.125rem"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "-.02em"
  title:
    fontSize: "1rem"
    fontWeight: 600
  label:
    fontSize: ".875rem"
    fontWeight: 550
  phonetic-label:
    fontFamily: '"Charis SIL", "Doulos SIL", Georgia, serif'
    fontSize: "1rem"
    lineHeight: 1.1
  prosody-ipa:
    fontFamily: '"Charis SIL", "Doulos SIL", Georgia, serif'
    fontSize: ".875rem"
    lineHeight: 1.1
  typing-key:
    fontSize: ".75rem"
    lineHeight: 1
  caption:
    fontSize: ".8125rem"
  serif-title:
    fontFamily: "Georgia, serif"
    fontSize: "1.25rem"
rounded:
  glyph: "5px"
  control: "6px"
  surface: "8px"
  container: "14px"
spacing:
  tight: "8px"
  small: "12px"
  medium: "20px"
  large: "24px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "9px 16px"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "9px 16px"
  text-button:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
    padding: "6px 0"
  text-input:
    backgroundColor: "{colors.field}"
    rounded: "{rounded.surface}"
    padding: "12px"
  glyph-button:
    backgroundColor: "{colors.palette}"
    textColor: "{colors.ink}"
    rounded: "{rounded.glyph}"
    padding: "6px 3px"
---

# Design System: Script Studio

## Overview

The compact shell puts writing and preview directly below the header. There is no hero, repeated footer, output count, or specimen note. Short Save/Open and SVG/PNG actions keep the workspace concise. Grouped alphabet tabs and two collapsed disclosures provide explanation and appearance controls when needed.

The implementation in `src/style.css`, `src/index.html`, `src/app.js`, and `src/phonetics.js` is the authority. Current desktop and 375px screenshots in `.impeccable/review/` show the paired Vowels palette and repaired initial outlines; `marks.jpg` records the approved prosody palette. Browser checks exercised keyboard tab selection, IPA and mark insertion, Appearance controls, and transparent PNG export; mobile client and scroll widths were both 375px. Source tests cover the shared preview/export outlines, 11 paired buttons with 22 SVGs, approved prosody, and the schwa alias. Technical checks remain separate from creator acceptance of precise reconstructed curves.

## Colors

The accent identifies actions, selected-tab underlines, links, and focus outlines. Ink supplies text and dark-paper artwork backgrounds; muted supplies supporting labels. Canvas, paper, output, and paper-surround provide tonal separation. Line divides the workspace, tabs, and disclosures. Field and palette distinguish editable and insertable content. Warning marks unsupported-sign guidance; soft supplies secondary-button hover.

## Typography

Body, compact brand heading, controls, group headings, and typing keys use the local sans-serif stack. The brand is the page’s h1; there is no display-serif introduction. At mobile widths its size becomes 1rem. The textarea uses 1.15rem text with a line height of 1.6. Georgia remains for dialog titles and the empty-state message.

**Phonetic labels** use the purpose-specific `phonetic-label` token: Charis SIL, Doulos SIL, then Georgia/serif. This stack supports the IPA symbols shown on sound buttons, with no network font dependency. A smaller sans-serif typing key appears only when it differs from the IPA label, for example ɛ above è. All current chart keys have confirmed IPA values. Mark names use the regular sans-serif caption treatment, with their IPA contour or stress sign below in the `prosody-ipa` font role.

## Layout

The main container is centered, at most 1536px wide, with desktop padding of 24px above and 32px at the sides and below. The workbench has a 300–360px composer and flexible output; at 1500px and above the composer becomes 390px. At 1050px and below, side padding becomes 24px, the composer becomes 310px, and draft status is hidden.

At 760px and below, main side padding becomes 12px. The workbench becomes one column: input, hint, source actions, preview with Appearance, then alphabet. The composer uses `display: contents` for that order. The offline-copy action is hidden only at 390px and below. Current 375px browser checks found no horizontal overflow.

Consonants, Vowels, and Marks occupy one tab panel at a time. Consonant groups use up to six equal columns. Vowel groups use three columns, retaining that grid on mobile: each button pairs a diacritic on the left with its initial form on the right. Marks remain two rows of four. Tab panels reserve a minimum height of 355px on desktop and 340px on mobile. Appearance opens to two columns of controls with the letter-size range spanning both columns.

Artwork width follows measured paper width, clamped to 300–1000px, and recomposes on resize. Script spacing remains fixed at 85%; legacy saved spacing is ignored and there is no spacing slider. Attached vowels and marks can reserve extra width. The latest browser-exported initial-vowel PNG is 2721 × 816px with transparent and opaque alpha values; browser interaction restored the prior draft after checking the temporary specimen.

## Elevation & Depth

Tonal surfaces and thin dividers provide most separation. Paper uses `0 6px 18px #1b292c0b`; dialogs use `0 18px 80px #152d3d33` with a `#10252c80` backdrop; toasts use `0 6px 20px #152d3d22`. No raised hover animation is implemented.

## Shapes

Rounded containers enclose the workspace and reference dialog. Smaller radii distinguish paper surrounds, text fields, controls, and glyph buttons as recorded in the frontmatter. The artwork itself remains sharp vector strokes; UI corner shapes do not alter glyph geometry. Main consonants and the available full-size special initial vowels use 8-unit strokes. Special Y is a single continuous outline with mitered upper corners; è uses one outline rather than a doubled sketch; ò is an open mirrored loop with no overlapping internal bar. The initial previews use the same generator as artwork export. Where no special initial exists, the second preview shows the inline fallback. Genuine joined rail switches use tangent S curves: g/n/l/s/w descend from the upper rail; gh/m/r/z rise from the lower rail. Unused neighbouring rails continue through the switching region, leaving only a thin clearance around the actual curve. Alpha masks affect these rail extensions only; the curve remains unmasked and no opaque white seam is painted.

If the required incoming rail is absent and the available rail already aligns with the destination, the entry continues straight: `for`/`vor` keep the upper rail, while `pin`/`nin` keep the lower rail. Outside legs retain 8 units of entry space. When the preceding consonant supplies their rail, an unmasked straight continuation fills that space and the leg branches from the continuous rail, as in lower `nt`; the same rule applies to upper legs. Missing incoming rails stay open. Their other straight entry reaches back to the preceding rail where possible. Square-ending consonants use filled caps inside the glyph’s advance edge, ending exactly at that edge with corners spanning y=4–28 in glyph coordinates. These are current implementation rules, with creator acceptance still open.


## Components

SVG and PNG buttons keep accessible export names despite abbreviated visible labels; Save and Open retain document-action names. Primary, secondary, and text actions share the existing accent and focus treatment. Focus-visible elements receive a 2px accent outline with a 4px offset. Button state transitions take .15s and are removed for reduced-motion preferences.

The textarea is vertically resizable, with a minimum height of 148px on desktop and 112px on mobile. Consonant and mark buttons use inline vector previews and a 64px minimum height. Vowel buttons are at least 76px tall with two side-by-side SVGs, each 32px high. The visible legend states “Diacritic · word-initial form”; clicking either half inserts the same vowel key, leaving the renderer to choose its contextual form. Hover titles and accessible names identify the sound or approved prosody value.

Alphabet tabs use tablist/tab/tabpanel semantics, selected states, and roving tabindex. Left/Right arrows wrap between tabs; Home/End select the first/last. Consonants are grouped as Stops, Affricates, Fricatives, and Sonorants; vowels as High (i/y/u), Mid (e/è/œ/h/o/ò), and Low (a/æ). Group metadata and concise explanations live in `src/phonetics.js`. Carlo confirmed c /tʃ/, g /dʒ/, gh /ɡ/, h /ə/, and Y /y/. Both h and ə input schwa; h is not the consonant /h/. All implemented IPA mappings are assigned. Further IPA sounds discussed in README remain candidates, with no new base glyphs implemented.

The native IPA & typing disclosure gives explanations for the active palette, digraph keys, stress, mark syntax, and a link to the official IPA chart. Appearance is a separate native details disclosure, collapsed by default, containing every existing rendering control. Original photographs remain in the native reference dialog. Marks retain positional order R1 C1 through R2 C4 and syntax `{1}`–`{8}`. Their approved values are:

| Syntax | Meaning | IPA |
| --- | --- | --- |
| `{1}` | High | ˦ |
| `{2}` | Low | ˨ |
| `{3}` | Falling | ˦˨ |
| `{4}` | Rising | ˨˦ |
| `{5}` | Mid | ˧ |
| `{6}` | Rise–fall | ˨˦˨ |
| `{7}` | Fall–rise | ˦˨˦ |
| `{8}` | Secondary stress | ˌ |

The external apostrophe bar marks primary stress /ˈ/. Tone and stress are independent and can combine, for example `ka'{3}`. Palette names and IPA values are visible; original chart positions and typing syntax remain in hover titles and the guide. These explanations supplement the artwork without adding persistent prose to the workspace.

## Do's and Don'ts

- **Do** keep the main writing flow compact and place extended explanations in the existing disclosures.
- **Do** retain typing keys when displayed IPA differs, and keep candidate additions distinct from implemented mappings.
- **Do** reuse local font stacks, selected-tab states, focus outlines, and reduced-motion behavior.
- **Do** keep original photographs at their aspect ratios and preserve the existing glyph geometry.
- **Don't** treat phonetic presentation groups as changes to transliteration keys or pronunciation rules.
- **Don't** describe browser checks as creator acceptance of every reconstructed curve.
- **Don't** require external fonts or icon packages for the standalone editor.
