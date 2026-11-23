# Later branches: phonological words become new graphic units

**LOCAL LANGUAGE DRAFT.** This note covers Harbor Talar, which descends from Island, and its writing, which descends from the Reed Seals. The upland varieties are in [history.md](history.md).

## Harbor Talar, id harbor, 850 to 1300

Harbor inherits Island's vowel and affricate mergers. Two further lexical rules follow:

1. Postvocalic `/r/ → /l/`.
2. Delete final unstressed `/i u/` after `/m n l r/` in polysyllabic lexical citation forms.

`*tuni → Classical tyni → Island tuni → Harbor tun`; `*loni → lœni → loni → lon`; `*nori → nœri → nori → noli → nol`.

The latter chain is ordered: the liquid change precedes apocope. Final-vowel loss creates more closed syllables in a branch whose older writing was based on consonants carrying vowel marks. It also increases the number of distinct sound sequences that a single syllable ligature can contain.

The frequent clause-final observation particle `we` develops a contracted clitic `-w` after a vowel. `wa` and `wo` retain their full citation forms; collapsing all three to the same consonant would erase their contrast. This selective grammaticalization is an additional morphological proposal, not an exception smuggled into the lexical sound-law function. Formal or contrastive speech can restore `we`.

Ordinary Harbor inherits Island's agglutinative clause and fuses its endings (see [typology.md](typology.md)): `nasarata nalenati tuniw`. A careful, learned clause may be written analytically:

```
pa tun ta na sara ti na lenaw
```

Sara perceives Lena, with claimed direct support. The final name plus observation clitic syllabifies `le·naw`; the `n + a + w` syllable fits one compound block. The particle still scopes over the completed clause, not just Lena, even though it shares the final phonological word. The Classical parser deliberately does not implement this daughter construction.

**Writing:** the Harbor script does not descend from Island Bookhand. It continues the Reed Seals, a syllable-cell tradition carved since the Early period. Harbor schools take those seal cells into ordinary writing. The teaching reform replaces the ambiguous spine prototype with a fused syllable sign built from simplified components, in which each borrowed consonant keeps only its stem stroke or joins its second stroke to it: onsets above, vowels in the middle, codas below, each component joined to its neighbours where their strokes meet. A consonant rail resting on a flat vowel top becomes one shared stroke; corners are rounded, free stroke ends flow into neighbours in short curved ligatures, and the whole syllable is drawn as one outlined pictogram. Every row reads left to right. Simplified sound components are borrowed from the Ridge Alphabet; this is a graphic borrowing, not a change to Harbor’s Island ancestry or a merger of languages.

The sign holds up to three onsets, two vowels and three codas at a constant component size. Larger groups use bracketed alphabetic spell-out rather than inventing vowels or erasing consonants. Empty onsets and codas remain blank; a crossed square indicates an empty nucleus. Tone flags sit outside the right edge, while primary stress sits above. They encode pitch and stress, not hidden grammatical operators. A syllable may include a bound morpheme, but the glyph components still spell sounds.

There is no automatic claim that every initial cluster accepted by the graphics engine is native Harbor phonotactics. Examples such as `plant` demonstrate graphic capacity. The small inherited lexicon does not yet justify a full cluster inventory, and consonants without a written vowel are marked as unresolved/vowelless clusters rather than pronounced with an invented schwa.

## Graphic grouping versus linguistic analysis

The public renderer has a transparent default: consecutive vowels share a core; the last consonant between nuclei begins the next group. It reads `katra` as `kat·ra`. Explicit `ka·tra` instead gives a two-consonant onset in the second block. This is a graphic convenience, not a universal syllabification theorem.

A speaker or editor can supply the desired boundary. `kai` has a compound vowel core; `ka·i` has two. The same alphabetic transcription retains all five letters of `katra` under either grouping. Written blocks and grammatical scope remain distinct layers.
