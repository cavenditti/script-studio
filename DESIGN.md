---
name: Script Studio
description: Implemented visual system with browser checks; creator glyph acceptance remains open.
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
  display:
    fontFamily: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif'
    fontSize: "clamp(2.4rem, 3.1vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-.035em"
  body:
    fontFamily: '"Avenir Next", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "16px"
  title:
    fontSize: ".9375rem"
    fontWeight: 650
  label:
    fontSize: ".875rem"
    fontWeight: 550
  caption:
    fontSize: ".8125rem"
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
    padding: "10px 14px"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
  text-button:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
    padding: "7px 0"
  text-input:
    backgroundColor: "{colors.field}"
    rounded: "{rounded.surface}"
    padding: "14px"
  glyph-button:
    backgroundColor: "{colors.palette}"
    textColor: "{colors.ink}"
    rounded: "{rounded.glyph}"
    padding: "7px 3px 5px"
---

# Design System: Script Studio

## Overview

This document records the implemented CSS in `src/style.css` and the current script-rendering controls. Desktop and mobile browser checks have been completed, including 375px and 390px viewports, mark insertion, and transparent PNG export. The current desktop and 375px captures are saved under `.impeccable/review/`, showing `for vor`, `pin nin`, `din dir dil diz`, and `gueses`. The review also compared the two user-provided screenshots illustrating unwanted switches and square-ending corner defects. These technical and layout checks do not establish Carlo’s acceptance of the reconstructed glyphs, joins, or mark placement; that remains open.

The interface pairs a serif introduction with compact system-font controls. Pale surfaces frame the script artwork, while a muted teal identifies actions. The existing implementation is the authority for the values below; no creative identity has been approved separately.

## Colors

The accent identifies primary actions, links, focus outlines, and the emphasized introduction. Ink supplies text and dark-paper artwork backgrounds; muted supplies supporting copy. Canvas, paper, output, and paper-surround form the tonal hierarchy. Line separates regions. Field and palette distinguish editable and insertable content. Warning marks unsupported-sign guidance. The soft token is also used by secondary-button hover.

## Typography

Display uses the local serif stack in the frontmatter. Body and controls use the local sans-serif stack without network fonts. Section titles are compact and semibold; helper text and counts use smaller sizes. The textarea uses larger text (1.15rem) with a generous line height (1.6). Dialog titles and the empty-state message use Georgia. At the mobile breakpoint the display becomes 2.65rem with a line height of 1.05.

## Layout

The main container is centered with a maximum width of 1536px and desktop side padding of 44px. The bordered workbench has a composer column of 300–360px and a flexible output column. At 1500px and above the composer is 390px wide. Settings use two equal columns, with the letter-size range spanning both; consonant and vowel palettes use four and six columns respectively.

At 1050px and below, side padding drops to 28px, the composer becomes 310px, draft status is hidden, and export actions stack below their heading. At 760px and below, main side padding becomes 16px and the workbench becomes one column: input, hints, source actions, output, then alphabet. The composer uses `display: contents` to enable this order. Consonants use five columns; vowels retain six. The offline-copy action is hidden at this breakpoint. The accent/tone palette remains four columns and two rows at every width, preserving the reference chart’s positional labels. Current mobile captures confirm that arrangement.

Artwork width follows the paper’s measured client width, clamped to 300–1000px, and recomposes on window resize. This produces narrower line breaks on mobile rather than only shrinking a desktop-wide composition. Export uses the current composition dimensions; the current browser-generated transparent PNG, `.impeccable/review/export-context-routing.png`, was checked at 2133 × 1806px with transparent and opaque alpha values.

Script spacing is fixed at 85% in the renderer and saved options. The spacing slider has been removed; legacy saved spacing values are ignored. This fixed glyph-advance factor is separate from the UI spacing tokens above. Clusters can still reserve extra width for attached vowels and marks.

## Elevation & Depth

Surfaces rely primarily on tone and thin dividers. Paper has a faint shadow (`0 6px 18px #1b292c0b`); dialogs use a larger shadow (`0 18px 80px #152d3d33`) and a dark translucent backdrop (`#10252c80`). Toasts use `0 6px 20px #152d3d22`. No raised hover animation is implemented.

## Shapes

Rounded containers enclose the workspace and reference dialog. Smaller radii distinguish paper surrounds, text fields, controls, and glyph buttons as recorded in the frontmatter. The artwork itself remains sharp vector strokes; UI corner shapes do not alter glyph geometry. Main consonants and the available full-size special initial vowels use 8-unit strokes. Genuine joined rail switches use tangent S curves: g/n/l/s/w descend from the upper rail; gh/m/r/z rise from the lower rail. Unused neighbouring rails continue through the switching region, leaving only a thin clearance around the actual curve. Alpha masks affect these rail extensions only; the curve remains unmasked and no opaque white seam is painted.

If the required incoming rail is absent and the available rail already aligns with the destination, the entry continues straight: `for`/`vor` keep the upper rail, while `pin`/`nin` keep the lower rail. Outside legs retain an 8-unit entry gap while their other straight entry reaches back to the preceding rail where possible. Square-ending consonants use filled caps inside the glyph’s advance edge, ending exactly at that edge with corners spanning y=4–28 in glyph coordinates. These are current implementation rules, with creator acceptance still open.

## Components

Primary export buttons use the accent; secondary export buttons use white with a thin border. Text buttons support lower-emphasis actions. Button background and text transition over .15s; disabled buttons use .45 opacity. Focus-visible elements receive a 2px accent outline with a 4px offset. Reduced-motion preferences remove transitions.

The textarea is vertically resizable, with a minimum height of 151px on desktop and 115px on mobile. Glyph buttons combine an inline vector preview with a text label and a minimum height of 53px; vowel buttons use 50px. Settings use one labeled native letter-size range, selects, and checkboxes; there is no spacing control. The reference viewer uses a native dialog with a sticky header and fluid images. Toasts appear at the bottom center with a constrained width.

Eight accent/tone buttons use the same glyph-button treatment in a fixed two-by-four palette. Labels R1 C1 through R2 C4 describe chart positions; insertion syntax is `{1}` through `{8}`. They attach to the preceding consonant with its vowels, or to an initial vowel. Their linguistic meanings remain unassigned. An unattached mark remains visible with corrective guidance. The browser palette-insertion check produced `din{1}`.

## Do's and Don'ts

- **Do** preserve the distinction between script artwork, input controls, and supporting reference material.
- **Do** reuse the implemented palette, local font stacks, focus outline, and reduced-motion behavior.
- **Do** keep reference photographs at their original aspect ratios.
- **Don't** describe technical browser checks as Carlo’s approval of reconstructed glyphs or linguistic meanings.
- **Don't** require external fonts or icon packages for the standalone editor.
- **Don't** apply UI styling changes to the original glyph drawings or photographs.
