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
  history-stage-title:
    fontFamily: "Georgia, serif"
    fontSize: "2rem"
    fontWeight: 400
    lineHeight: 1.2
  history-stage-title-mobile:
    fontFamily: "Georgia, serif"
    fontSize: "1.75rem"
    fontWeight: 400
    lineHeight: 1.2
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
  history-node:
    backgroundColor: "{colors.palette}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 8px"
---

# Design System: Script Studio

## Overview

The compact shell puts writing and preview directly below the header. There is no hero, repeated footer, output count, or specimen note. Short Save/Open and SVG/PNG actions keep the workspace concise. Grouped alphabet tabs and two collapsed disclosures provide explanation and appearance controls when needed.

The implementation in `src/style.css`, `src/index.html`, `src/app.js`, `src/phonetics.js`, `src/evolution.js`, and `src/descendants.js` is the authority. Earlier Classical desktop and 375px screenshots in `.impeccable/review/` show the paired Vowels palette and repaired initial outlines; `marks.jpg` records the approved prosody palette. Browser checks exercised keyboard tab selection, IPA and mark insertion, Appearance controls, and transparent PNG export; mobile client and scroll widths were both 375px. Classical source tests cover the shared preview/export outlines, 11 paired vowel buttons with 22 SVGs, approved prosody, and the schwa alias. Technical checks remain separate from creator acceptance of precise reconstructed curves.

Refreshed `evolution-desktop.jpg`, `evolution-mobile.jpg`, `evolution-editor.jpg`, and `evolution-mobile-tree.jpg` in `.impeccable/review/` record the history extension. The 390 × 844px `evolution-mobile-viewport.jpg` and browser checks confirm the intro remains visible on reopening, the stage heading precedes branch/date metadata, and the modal has no horizontal overflow (337px client and scroll widths). Opening returns to scroll position 0 with focus on Close. These checks establish interaction and layout behavior, not acceptance of the provisional genealogy or every allograph.

The nine-hand extension keeps the same workbench while introducing Ridge Alphabet and Harbor Blocks as structural descendants. `structural-alphabet-desktop.jpg`, `structural-harbor-desktop.jpg`, and `structural-harbor-mobile.jpg` in `.impeccable/review/` show independent sound previews and mode-specific artwork. `harbor-diagnostics.png` records onset/coda forms, all vowel components, ordered vowel pairs, empty positions, prosody, and bracketed overflow. These captures document the implemented structure, not a complete orthography or accepted historical reconstruction.

## Colors

The accent identifies actions, selected-tab underlines, links, and focus outlines. Ink supplies text and dark-paper artwork backgrounds; muted supplies supporting labels. Canvas, paper, output, and paper-surround provide tonal separation. Line divides the workspace, tabs, and disclosures. Field and palette distinguish editable and insertable content. Warning marks unsupported-sign guidance; soft supplies secondary-button hover.

## Typography

Body, compact brand heading, controls, group headings, and typing keys use the local sans-serif stack. The brand is the page’s h1; there is no display-serif introduction. At mobile widths its size becomes 1rem. The textarea uses 1.15rem text with a line height of 1.6. Georgia remains for dialog titles and the empty-state message. The history explorer adds a local stage-title role, regular-weight Georgia with a 1.2 line height; use `history-stage-title` on desktop and `history-stage-title-mobile` at 480px and below. It introduces no new page-level display treatment.

**Phonetic labels** use the purpose-specific `phonetic-label` token: Charis SIL, Doulos SIL, then Georgia/serif. This stack supports the IPA symbols shown on sound buttons, with no network font dependency. A smaller sans-serif typing key appears only when it differs from the IPA label, for example ɛ above è. All current chart keys have confirmed IPA values. Mark names use the regular sans-serif caption treatment, with their IPA contour or stress sign below in the `prosody-ipa` font role.

## Layout

The main container is centered, at most 1536px wide, with desktop padding of 24px above and 32px at the sides and below. The workbench has a 300–360px composer and flexible output; at 1500px and above the composer becomes 390px. At 1050px and below, side padding becomes 24px, the composer becomes 310px, and draft status is hidden.

At 760px and below, main side padding becomes 12px. The workbench becomes one column: input, hint, source actions, preview with Appearance, then alphabet. The composer uses `display: contents` for that order. The offline-copy action is hidden only at 390px and below. Current 375px browser checks found no horizontal overflow.

Consonants, Vowels, and Marks occupy one tab panel at a time. Consonant groups use up to six equal columns. Vowel groups use three columns, retaining that grid on mobile: the seven earlier hands pair a diacritic on the left with its initial form on the right. Ridge Alphabet and Harbor Blocks instead show one full vowel form per button. Marks remain two rows of four. Tab panels reserve a minimum height of 355px on desktop and 340px on mobile. Appearance opens to two columns of controls with the letter-size range spanning both columns.

Artwork width follows measured paper width, clamped to 300–1000px, and recomposes on resize. Ribbon-script spacing remains fixed at 85%; legacy saved spacing is ignored and there is no spacing slider. Attached vowels and marks can reserve extra width. A prior Classical browser-exported initial-vowel PNG measured 2721 × 816px with transparent and opaque alpha values; that browser check restored the prior draft after checking the temporary specimen.

The history dialog is at most 1180px wide, with 24px content padding and a two-column tree/detail layout (1.15:1, 32px gap). At 850px and below, the detail moves above the tree and content padding becomes 20px. At 480px and below, the tree becomes an indented vertical list with left rules and right-aligned miniature specimens. These are local explorer breakpoints; the editor layout remains unchanged.

## Elevation & Depth

Tonal surfaces and thin dividers provide most separation. Paper uses `0 6px 18px #1b292c0b`; dialogs use `0 18px 80px #152d3d33` with a `#10252c80` backdrop; toasts use `0 6px 20px #152d3d22`. No raised hover animation is implemented.

## Shapes

Rounded containers enclose the workspace and native dialogs. Smaller radii distinguish paper surrounds, text fields, controls, and glyph buttons as recorded in the frontmatter. The artwork itself remains sharp vector strokes; UI corner shapes do not alter glyph geometry. Main consonants and the available full-size special initial vowels use 8-unit strokes. Special Y is a single continuous outline with mitered upper corners; è uses one outline rather than a doubled sketch; ò is an open mirrored loop with no overlapping internal bar. The initial previews use the same generator as artwork export. Where no special initial exists, the second preview shows the inline fallback. Genuine joined rail switches use tangent S curves: g/n/l/s/w descend from the upper rail; gh/m/r/z rise from the lower rail. Unused neighbouring rails continue through the switching region, leaving only a thin clearance around the actual curve. Alpha masks affect these rail extensions only; the curve remains unmasked and no opaque white seam is painted.

These geometry rules describe Classical, which remains the original rendering. The six other earlier hands alter joining and actual outline geometry through the historical profile layer. Ridge Alphabet and Harbor Blocks use the separate structural-descendant renderer; none replaces the Classical engine.

If the required incoming rail is absent and the available rail already aligns with the destination, the entry continues straight: `for`/`vor` keep the upper rail, while `pin`/`nin` keep the lower rail. Outside legs retain 8 units of entry space and reach 10 units outward from their rail, with their curve endpoints 2 units farther out than before. Attached vowel diacritics and the external stress bar sit 3 units closer to the consonants. When the preceding consonant supplies their rail, an unmasked straight continuation fills that space and the leg branches from the continuous rail, as in lower `nt`; the same rule applies to upper legs. Missing incoming rails stay open. Their other straight entry reaches back to the preceding rail where possible. Square-ending consonants use filled caps inside the glyph’s advance edge, ending exactly at that edge with corners spanning y=4–28 in glyph coordinates. These are current implementation rules, with creator acceptance still open.


### Structural descendants

Ridge Alphabet has 31 full sound letters: 20 consonants and 11 vowels. Its free-standing forms retain their own geometry, with round caps and joins on 3.4-unit strokes; the original long rails are absent. Harbor borrows those same forms without rotating or reflecting them. These are artwork rules, not new UI tokens.

Harbor signs are 88 drawing units tall; their width follows the fused components. Every component keeps one scale, .78, and there is no enclosing chamber. Harbor palette buttons show the same softened forms. Harbor draws a softened hand of the alphabet forms: every straight corner becomes a quadratic arc of radius up to 7 letter units, while curves and T-junctions are unchanged. Components fuse by contact. Within a row, each component moves left until its stroke centreline is 2.5 letter units from the previous one. The onset row sits on the vowel row and the coda row hangs from it the same way. Between rows, facing strokes that run parallel for at least eight units, such as a consonant's lower rail over a vowel's flat top, merge into one shared stroke. Rows may nest at most 5 units into each other, so a component never slides inside its neighbour. Each neighbouring pair can then gain one organic ligature, a quadratic curve that continues a free stroke end into the nearest point of the other component. It is used only when that point is 1.5–22 letter units away and does not lie behind the stroke end, and the curve must keep 2.2 units clear of other strokes. Ligatures share the 3.4-unit stroke and supply no sound. The vowel row's letter origin is fixed at y=28, so vowels align along a line of text. Rows are centred on a common axis and read left to right. Capacity is three onset consonants, two vowels, and three coda consonants.

An empty onset or coda stays blank. A small crossed square fused into the vowel row marks an empty nucleus; it supplies no vowel or schwa. Overcapacity groups use bracketed alphabetic spell-out at .8 letter scale, split into bounded reflowable tiles rather than compressed into tiny marks. Tone and secondary stress occupy up to eight positions to the right of the sign in two columns of four; primary stress stays above. Additional annotations continue in separate bounded tiles. These exceptions preserve every supplied sound and mark.

## Components

SVG and PNG buttons keep accessible export names despite abbreviated visible labels; Save and Open retain document-action names. Primary, secondary, and text actions share the existing accent and focus treatment. Focus-visible elements receive a 2px accent outline with a 4px offset. Button state transitions take .15s and are removed for reduced-motion preferences.

The textarea is vertically resizable, with a minimum height of 148px on desktop and 112px on mobile. Consonant and mark buttons use inline vector previews and a 64px minimum height. Vowel buttons are at least 76px tall. For the seven earlier profiles they contain two side-by-side SVGs, each 32px high, under the legend “Diacritic · word-initial form”; clicking either half inserts the same vowel key, leaving the renderer to choose its contextual form. Ridge Alphabet and Harbor instead use a single tight 44 × 44 viewBox for every consonant and vowel sound form. Their vowel legends read “Full vowel letters” and “Vowel components · middle row of each block” respectively; no duplicate initial preview is shown. The existing grids, label typography, hover, and focus states remain shared. Hover titles and accessible names identify the sound or approved prosody value.

Alphabet tabs use tablist/tab/tabpanel semantics, selected states, and roving tabindex. Left/Right arrows wrap between tabs; Home/End select the first/last. Consonants are grouped as Stops, Affricates, Fricatives, and Sonorants; vowels as High (i/y/u), Mid (e/è/œ/h/o/ò), and Low (a/æ). Group metadata and concise explanations live in `src/phonetics.js`. Carlo confirmed c /tʃ/, g /dʒ/, gh /ɡ/, h /ə/, and Y /y/. Both h and ə input schwa; h is not the consonant /h/. All implemented IPA mappings are assigned. Further IPA sounds discussed in README remain candidates; the structural descendants change written forms and organization without adding sound mappings.

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

In the ribbon profiles, the external apostrophe bar marks primary stress /ˈ/. Tone and stress are independent and can combine, for example `ka'{3}`. Palette names and IPA values are visible; original chart positions and typing syntax remain in hover titles and the guide. These explanations supplement the artwork without adding persistent prose to the workspace.

### Structural writing modes

Ridge Alphabet writes one full letter for each typed sound, including digraph keys as single sounds. Harbor groups those letters into syllables using the fixed rows and limits above. Consecutive vowels share a nucleus; by default the last consonant between nuclei starts the next syllable. A middle dot overrides that graphic split. This default is a drawing convention, not a language-specific syllabification claim. The input hint changes with the selected system, and the existing status area explains empty nuclei and bracketed overflow. Preview, palette, SVG/PNG export, saved documents, and offline copies use the same selected system.

### Script-history explorer

The current hand appears as a compact text action beside Preview; it opens a native modal with the existing sticky header, Close action, backdrop, and focus treatment. Opening selects the active hand and resets the dialog scroll to the top. The Historical hand selector spans both columns in Appearance. Nine provisional hands share the current typing keys; palette previews and exports follow the selected hand. Detached traditions disable Join letters; Ridge Alphabet and Harbor Blocks also disable Initial vowels. The explorer includes Ridge → Alphabet and Island → Harbor descent; Harbor borrows its sound forms from Alphabet.

Tree nodes reuse palette surfaces, line borders, control radii, and miniature vector specimens. Hover uses the existing soft surface and palette hover border; the selected node uses an accent border and the existing pale-teal palette hover fill, with `aria-pressed` exposing selection. Nodes are at least 102px high on desktop and 84px at narrow widths. A separate Explore a stage selector offers the same profiles. The native dialog and ordinary buttons retain their standard keyboard behavior.

Each detail begins with the stage heading, then branch/date metadata, a shared-key comparison specimen, material, and Use this hand. A definition list explains what changes, why, and what survives. Browsing a stage leaves the editor hand unchanged until Use this hand applies it and closes the dialog. The descent tree and contact explanation distinguish inheritance from graphic borrowing; dates and branches remain explicitly fictional and provisional. Missing or unrecognized saved hands resolve to Classical. Hand selection persists in drafts, saved documents, and offline copies.

## Do's and Don'ts

- **Do** keep the main writing flow compact and place extended explanations in the existing disclosures.
- **Do** retain typing keys when displayed IPA differs, and keep candidate additions distinct from implemented mappings.
- **Do** reuse local font stacks, selected-tab states, focus outlines, and reduced-motion behavior.
- **Do** keep original photographs at their aspect ratios and preserve the original Classical glyph geometry.
- **Don't** treat phonetic presentation groups as changes to transliteration keys or pronunciation rules.
- **Don't** describe browser checks as creator acceptance of every reconstructed curve.
- **Don't** require external fonts or icon packages for the standalone editor.
