# Script Studio

A browser editor for Carlo's original science-fiction writing system. Open `dist/index.html` directly; no installation, server, fonts, or internet connection is required.

Type the chart's phonetic labels. Vowels sit above the preceding consonant. At a word's beginning, select full-size special forms or inline signs. `gh`, `sh`, and `zh` insert single signs; the palette inserts exact labels. The small Y-shaped chart label is provisionally entered as `y`. This is transcription, not English/Italian pronunciation conversion.

The compact alphabet has Consonants, Vowels, and Marks tabs. Known sounds are grouped as stops, affricates, fricatives, and sonorants, with high/mid/low vowel groups. Each vowel entry shows its diacritic on the left and word-initial form on the right; vowels without a dedicated initial form show the inline fallback. IPA appears on the buttons; a smaller label shows a different typing key. The expandable IPA & typing guide explains the groups and links to the International Phonetic Association's chart. Appearance controls are collapsed by default.

Carlo confirmed `c` = /tʃ/, `g` = /dʒ/, `gh` = /ɡ/, `y` = /y/ and `h` = /ə/ (schwa). Both `h` and `ə` type the schwa sign. Grouping metadata lives in `src/phonetics.js`.

In `din`, the upper rail continues into the lower rail through `n`, with a smooth, horizontally tangent curve. Neighbouring rails extend through the unused space, with a thin transparent clearance around the actual switch. If the intended incoming rail is absent, the available rail continues straight into the destination; `for` therefore has no unnecessary switching curve. The same contextual routing applies to `g n l s w` downward and `gh m r z` upward. Outside legs remain visible. When the preceding consonant supplies the same rail, it continues straight through with the leg branching from it: `nt` has one continuous lower line. The mirrored rule applies to upper legs; missing incoming rails remain open. Distinctive hooks and terminal features are preserved. Special initial vowels use the same 8-unit stroke as consonants. Spacing is fixed at 85 percent, including when opening older documents.

The eight accent/tone variants can be inserted from the palette or typed as `{1}`–`{8}`, ordered across the original top row then the bottom row. They apply to the preceding syllable, including an initial vowel. Tone specifies pitch; stress specifies prominence. The external stress bar, typed as an apostrophe, retains primary stress /ˈ/.

| Input | Original position | Meaning | IPA |
| --- | --- | --- | --- |
| `{1}` | R1 C1 | High tone | ˦ |
| `{2}` | R1 C2 | Low tone | ˨ |
| `{3}` | R1 C3 | Falling tone | ˦˨ |
| `{4}` | R1 C4 | Rising tone | ˨˦ |
| `{5}` | R2 C1 | Mid tone | ˧ |
| `{6}` | R2 C2 | Rise–fall | ˨˦˨ |
| `{7}` | R2 C3 | Fall–rise | ˦˨˦ |
| `{8}` | R2 C4 | Secondary stress | ˌ |

These meanings were explicitly approved by Carlo. For example, `ka'{3}` has primary stress and falling tone, /ˈka˦˨/. A mark without a base stays visible and produces a placement hint. An unmarked syllable leaves tone unspecified.

The text starts with a clearly identified illustrative sample. It is not a transcription of the original image. Browser drafts save locally. Save/Open document preserves text and settings in `.script.json`. Export SVG for scalable artwork, or PNG for a high-resolution image, optionally transparent. Reference images are embedded unchanged. Unsupported letters remain visible in rust; punctuation and digits keep their Latin forms.

## A possible script family

Eleven fictional historical stages are available under **Appearance → Historical hand**. The Stone Register branches into the Ridge Alphabet, which leads to single-stroke Upland Capitals, and into Ridge Cut, which leads to Early Ink. Early Ink leads both to Classical (with Delta Cursive and Island Bookhand) and to the Reed Seals, whose syllable cells become Harbor Blocks and then Harbor Roundels (pen circles plus `#word` ideograms). Click the current hand’s name beside Preview to explore the branching history. Classical preserves the original rendering; the other hands change joining habits, curves, return hooks, closing bars and round marks. Ridge Alphabet gives every consonant and vowel a full letter. Harbor Blocks simplifies each letter to one continuous shape and fuses each syllable into one sign: initials above, full vowels in the middle, finals below, merged into one outlined pictogram with rounded corners and curved ligatures; consonant clusters become rows of small single-stroke signs. Each row reads left to right; tone sits outside. Up to three initials, two vowels and three finals share a cell; larger groups use a readable bracketed spell-out. Use · to specify a Harbor boundary, as in ka·tra; adjacent vowels otherwise share the middle row. Your sound sequence and approved mark values stay unchanged. Documents and offline copies remember the selected stage.

Click the hand’s name beside Preview to open **Scripts and languages**, which pairs each script stage with the philology and example sentences of its language variety. Read the [script history](docs/script-evolution.md), [family tree](docs/evolution/family-tree.svg), [comparative atlas](docs/evolution/atlas.svg), [structural comparison/decomposition](docs/evolution/structural-branches.svg), and [complete Harbor diagnostics](docs/evolution/harbor-diagnostics.svg). This is a provisional fictional genealogy, not a decipherment or a translation system.

## Fidelity and open questions

Consonant outlines and accent/tone shapes are reconstructed vector paths from the supplied chart. Vowel attachment, inversion, and prosodic meanings follow Carlo's confirmed rules. Exact outline curves and special initial forms still need his review. Y uses one continuous initial outline with square upper corners. The è initial uses one form rather than combining the two small draft alternatives; ò has an open counter without an overlapping inner bar. Palette and exported composition share these outlines. No script name or sample translation has been invented.

Edit `src/engine.js` to refine the shapes and mapping. The original attachments are preserved in `references/`.

## Candidate sounds, not yet added

The most useful next candidates are /ø/ (the close-mid rounded partner of existing /œ/), /ŋ/ and /ɲ/ (velar and palatal nasals alongside /m n/), /ʎ/ (a palatal lateral alongside /l/), and the affricates /ts dz/ alongside /tʃ dʒ/. The consonant /h/ is another useful gap: the existing typing key h now represents the vowel /ə/, so /h/ would need its own sign. Later options include the velar fricatives /x ɣ/, the glottal stop /ʔ/, and near-close vowels /ɪ ʏ ʊ/ if those distinctions are useful. These are recommendations for discussion, not assigned letters or automatic pronunciation rules. See the [official IPA chart](https://www.internationalphoneticassociation.org/IPAcharts/IPA_charts_TI/IPA_charts_TI.html) for categories and sound samples.

## Development

```sh
python3 build.py
node --test tests/engine.test.cjs tests/phonetics.test.cjs tests/evolution.test.cjs tests/descendants.test.cjs
node scripts/build-evolution.cjs
python3 -m http.server 8765 --directory dist --bind 127.0.0.1
```

The build embeds all styles, code, and reference photographs in a standalone file. There are no runtime dependencies or analytics.

Optional DOM integration checks use LinkeDOM, installed outside the application:

```sh
npm install --prefix /tmp/script-studio-qa linkedom
NODE_PATH=/tmp/script-studio-qa/node_modules node tests/app.test.cjs
```

Validation completed: 27 base-rendering tests, 2 phonetic metadata checks, 6 evolution checks, and 11 structural-descendant checks. Evolution checks cover unchanged Classical output, an acyclic descent tree, retained text/marks, joining rules and carrier-dot placement. Structural checks cover a complete 31-letter alphabet, compound onsets/codas/nuclei, explicit boundaries, explicit empty nuclei, preserved prosody, stroke-aware gutters, palette framing, readable cluster overflow, wrapping, bounded annotations and escaped unsupported characters. Regression checks cover continuous rails with branching outside legs, missing-rail boundaries, the single-outline Y, shared preview/export geometry, paired vowel previews, confirmed tones and stress, and the schwa alias. DOM integration checks cover tab switching, draft restoration, offline copies, blocked-storage fallback, clearing/undo, mark attachment, SVG export, and input limits. Browser checks cover desktop/mobile layouts, keyboard tab navigation, IPA-labelled insertion, marks, Appearance disclosure, and transparent PNG export. Composition wraps to the preview width so mobile lettering retains its stroke size. Creator acceptance of the reconstructed letter forms remains separate from technical checks.
