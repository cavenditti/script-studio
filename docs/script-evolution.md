# A possible Two-Rail script family

This is a **provisional fictional history** built around Carlo's original writing system. The original drawings and the current Classical hand remain the visual authority. The earlier forms are proposed ancestors; the later forms are proposed descendants. Their dates, institutions and materials are design choices for a possible science-fiction setting, not a decipherment of the original specimen.

![Descent and graphic borrowing](evolution/family-tree.svg)

The setting is a connected basin with an upland watershed, a river delta and an archipelago. A shared writing school establishes a classical standard. After its network fragments, regional schools develop different habits. A later river printing standard borrows from the other two traditions. No stage is inherently better or more intelligent than another.

## Seven stages, three descendant branches

Years are relative to the classical school's foundation, year 0. Ranges describe a hand's characteristic period, not a sudden replacement of all earlier writing.

| ID | Hand | Period | Parent | Medium and principal innovation |
| --- | --- | --- | --- | --- |
| stone | Stone Register | −700 to −350 | — | Incised surfaces: independent signs, angular bends, diamond punctures |
| reed | Early Ink | −350 to 0 | Stone | Prepared sheets: rounded returns and pen stops; signs remain independent |
| classical | Classical | 0 to 300 | Early Ink | The original hand: continuous rails, genuine S-switches, visible branching legs |
| ridge | Ridge Cut | 300 to 900 | Classical | Cut labels: resegmented signs, chamfers, beaked returns, diamond marks |
| delta | Delta Cursive | 300 to 900 | Classical | Quick contracts: continuous rails, open oblique returns, oval pen marks |
| island | Island Bookhand | 300 to 1000 | Classical | Bound manuscripts: broad return bowls, inward feet, rounded closing bars |
| civic | Civic Print | 900 onward | Delta | Reusable type: open returns with explicit feet and repeatable chamfers; graphic borrowing from Ridge and Island |

Solid edges in the tree are descent. Dashed edges are graphic borrowing. Civic has one Delta parent; borrowing a letter shape does not make it the genealogical child of three spoken languages.

## A comparative plate

![Seven hands drawn from identical modern keys](evolution/atlas.svg)

Every row draws **the same modern keys**: `din rento ghma`, then `n p s r w`. These are neutral comparison strings, not translations or reconstructed historical words. Using a shared key set makes the shapes comparable; it does not claim that every modern sound or allograph existed at the earliest stage.

The editor's Classical rendering is unchanged. The historical profiles are drawing conventions over the current transcription system. They preserve the text, vowel attachment, initial vowels, outside legs, switch direction and the eight approved tone/stress meanings. Historical spelling and phonological conversion are separate tasks. A conservative manuscript could use an old sign after a sound merger; this feature does not merge keys or discard a user's marks.

## How the forms develop

### Stone → Early Ink: a change in ductus

“Ductus” means the habitual way a sign is executed. In the proposed Stone hand, the writer lifts a cutting tool between signs and approximates bends with short straight cuts. Dots become diamond punctures. The two levels begin as ruled guides, with the direction of a returning stroke carrying a stable distinction.

Early Ink keeps the separate signs but rounds the returns and pen stops. This is more than thinning the current font: letters are detached, cuts become curves, and marks recover round forms. A tool change motivates a possibility; it does not mechanically determine what every writer must do.

### Early Ink → Classical: a school standard

Repeated straight entries join neighboring rails. Actual upper-to-lower and lower-to-upper transfers become smooth S-curves. Outside legs remain recognizable, branching from an available incoming rail. Internal returns still distinguish letter families.

The original hand sits here as the reference form. It is not redrawn to make the invented ancestors seem inevitable. An alternative history could place it elsewhere; this first model deliberately gives it a central, conservative teaching role.

### Classical → Ridge: resegmentation and convergence

Ridge cutters separate the word ribbon into individual signs again. Curves become chamfered paths; return hooks turn into short angular beaks; round marks become diamonds. Both the loss of joining and the changed internal geometry are visible in the plate.

Ridge consequently looks older than its date. That is a philological trap: its angularity resembles Stone through a renewed cutting practice. It retains later distinctions, so it is not drawn as Stone's separate surviving sister. A family tree should follow inherited innovations rather than one conspicuous resemblance.

### Classical → Delta: abbreviated returns

The rails remain continuous, while terminal bowls open into oblique strokes. Round pen marks stretch to ovals. Upper and lower hooks keep their opposite orientation, so the abbreviation retains the information needed to tell their families apart.

The prototype does not simulate omitted predictable vowels or tones. That would require a specified language, context and recovery rules. All typed marks remain visible. A quick hand can need a contrastive diacritic even when some consonant strokes become simpler.

### Classical → Island: conservative text, distinctive allographs

Island copyists broaden the return bowls and add a short inward foot. Closing bars receive rounded ends. These are changes to the allographs—the written forms of the same signs—rather than changes to the sound table.

This branch is meant to support conservative manuscript spellings. Conservatism and visual stasis are different: a manuscript tradition may preserve a spelling while developing a strongly recognizable hand.

### Delta → Civic: standardization with contact

Civic retains Delta's open returns. It adds short horizontal feet, inspired by Island book copying, and regular chamfers associated with Ridge cutting. The result can be cut and reused without losing the running band's structure.

The dashed contact edges are essential. Similar shapes can be inherited, borrowed, independently reinvented, or deliberately restored. A later public standard is not necessarily an unbroken survival of the classical spoken language.

## What is implemented

- Seven selectable historical hands in **Appearance → Historical hand**.
- A script-history explorer opened by the current hand's name next to Preview.
- Hand-aware consonant, vowel and mark previews, SVG/PNG export, document saving and offline copies.
- A reproducible atlas and family tree, generated from the same profile data as the editor.
- Exact preservation of the Classical SVG when no historical profile is requested.

The model changes joining practice, curve geometry, terminal-return allographs, closing bars and the shapes of round marks. It does not merely skew or color the original SVG. The core engine and original image files are unchanged. In the detached historical traditions, joining is intrinsic to the hand, so the Join letters control is unavailable.

The date ranges and fully normalized repertoire are useful editorial scaffolding. They are not an archaeological corpus, an argument that every change is inevitable, or a complete font with context-specific handwriting variants. In particular, material alone does not determine script shape.

## Philological notes for later refinement

- Add transitional witnesses instead of making every innovation simultaneous.
- Distinguish a cursive personal hand from the regional school's book standard.
- Record spelling conservatism separately from the contemporary pronunciation.
- Mark loans and restorations instead of forcing every resemblance into a descent tree.
- Reassess contrast after each simplification; a fast hand still has to distinguish signs its readers need.
- Derive new tone spellings only alongside explicit linguistic changes, keeping the approved pitch/stress values stable.

## Real-method background

The fiction takes methodological cues from real writing history; it does not copy an actual script's genealogy. The [Metropolitan Museum's early tablet record](https://www.metmuseum.org/art/collection/search/327384) describes the physical difference between drawing proto-cuneiform signs and impressing a wedge-shaped stylus. That is a concrete example of tool practice shaping strokes, not proof that a specific medium universally produces our proposed forms.

For a compact account of comparative reconstruction, the [UCSB historical-reconstruction guide](https://hlw.id.ucsb.edu/sites/default/files/2024-04/Ch12_GuideHistoricalReconstruct.pdf) emphasizes deriving correspondences with regular, explicitly conditioned changes. Here the same discipline motivates declared transformations and separate inheritance/contact edges. The proposed dates, branches and glyph transformations above remain original fictional design.

## Rebuild

```sh
node scripts/build-evolution.cjs
python3 build.py
node --test tests/engine.test.cjs tests/phonetics.test.cjs tests/evolution.test.cjs
```

`src/evolution.js` contains the public profiles and drawing rules. `scripts/build-evolution.cjs` reads only the public engine and profiles. The standalone HTML embeds them; it does not fetch external assets or read local language drafts.
