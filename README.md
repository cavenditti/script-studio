# Script Studio

A browser editor for Carlo's original science-fiction writing system. Open `dist/index.html` directly; no installation, server, fonts, or internet connection is required.

Type the chart's phonetic labels. Vowels sit above the preceding consonant. At a word's beginning, select full-size special forms or inline signs. `gh`, `sh`, and `zh` insert single signs; the palette inserts exact labels. The small Y-shaped chart label is provisionally entered as `y`. This is transcription, not English/Italian pronunciation conversion.

In `din`, the upper rail continues into the lower rail through `n`, with a smooth, horizontally tangent curve. Neighbouring rails extend through the unused space, with a thin transparent clearance around the actual switch. If the intended incoming rail is absent, the available rail continues straight into the destination; `for` therefore has no unnecessary switching curve. The same contextual routing applies to `g n l s w` downward and `gh m r z` upward. Outside legs remain visible and interrupt their own rail. Distinctive hooks and terminal features are preserved. Special initial vowels use the same 8-unit stroke as consonants. Spacing is fixed at 85 percent, including when opening older documents.

The eight bottom-right accent/tone variants can be inserted from the palette or typed as `{1}`–`{8}`. They are labeled R1 C1 through R2 C4, ordered across the top row then the bottom row. `di{1}n` applies the first variant to `d`; `din{8}` applies the final variant to `n`. Marks also attach to initial vowels. Their meanings are deliberately unassigned. A mark without a base stays visible and produces a placement hint.

The text starts with a clearly identified illustrative sample. It is not a transcription of the original image. Browser drafts save locally. Save/Open document preserves text and settings in `.script.json`. Export SVG for scalable artwork, or PNG for a high-resolution image, optionally transparent. Reference images are embedded unchanged. Unsupported letters remain visible in rust; punctuation and digits keep their Latin forms.

## Fidelity and open questions

Consonant outlines and accent/tone shapes are reconstructed vector paths from the supplied chart. Vowel attachment and inversion follow Carlo's confirmed rules. Some small vowel labels, exact outline curves, and special initial forms still need his review. Accent/tone meanings remain open. No novel language, script name, or sample meaning has been invented.

Edit `src/engine.js` to refine the shapes and mapping. The original attachments are preserved in `references/`.

## Development

```sh
python3 build.py
node --test tests/engine.test.cjs
python3 -m http.server 8765 --directory dist --bind 127.0.0.1
```

The build embeds all styles, code, and reference photographs in a standalone file. There are no runtime dependencies or analytics.

Optional DOM integration checks use LinkeDOM, installed outside the application:

```sh
npm install --prefix /tmp/script-studio-qa linkedom
NODE_PATH=/tmp/script-studio-qa/node_modules node tests/app.test.cjs
```

Validation completed: 24 engine tests, including genuine and inactive switches, through-rail continuation, fixed spacing, clean square caps, both outside-leg families, full-weight initials, and eight accent/tone variants. DOM integration checks cover draft restoration, offline copies, blocked-storage fallback, clearing/undo, mark attachment, SVG export, and input limits. Exported SVG was rasterized and inspected. The revised editor was also inspected in a browser at desktop and mobile widths, and a transparent PNG export completed successfully. Composition wraps to the preview width so mobile lettering retains its stroke size. The creator's acceptance of the reconstructed letter forms remains separate from technical checks.
