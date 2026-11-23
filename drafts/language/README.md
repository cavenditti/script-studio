# Talar: local language workbook

**LOCAL LANGUAGE DRAFT.** A provisional language for Carlo's novel, designed alongside the proposed Two-Rail script family. “Talar” is a working name, not a reading of the original specimen. Nothing here claims to recover the language Carlo originally intended.

Start with [the grammar](grammar.md), then [the parallel history](history.md), [worked sentences](examples.md), the generated [cognate table](cognates.md), and [morphology and word division by variety](typology.md). `lexicon.json` supplies 31 ancestral roots. `model.cjs` derives their reflexes with ordered sound changes and parses the formal Classical register. `check.cjs` checks scope with finite models, argument labels, the cognates, and compatibility with the script editor.

```sh
node drafts/language/model.cjs       # regenerate cognates.md
node drafts/language/check.cjs       # validate the draft
node drafts/language/specimens.cjs   # regenerate specimens.svg (then rsvg-convert to PNG)
```

The language now appears in the app’s **Scripts and languages** dialog through `src/philology.js`. That file holds each variety’s sound changes, grammar type, word division, cognates and example sentences. `check.cjs` verifies those cognates and examples against this model. The workbook itself stays out of the build and the public atlas. Its branch IDs deliberately match the public script profiles: stone, reed, classical, ridge, delta, island, civic, ridge-alpha, harbor. Script style selection never applies these sound laws or translates a text.

The design has two simultaneous histories: a spoken family that changes by inheritance, and a learned logical register that communities repeatedly maintain, shorten, or revive. A logical notation is not a claim that its speakers think more rationally. Precise expression is an acquired register, with ordinary ambiguity, metaphor, disagreement, humour, and incomplete utterances around it.

## What exists now

- A restricted, parseable predicate grammar with named places, explicit scope, reference, quantification, questions, evidence and time operators.
- A comparative lexicon with regular changes through nine stages.
- Three daughter-language sketches, a later river standard, and the Market Ridge / Harbor offshoots with alphabetic versus syllable-block writing.
- A typological spread: isolating Classical, Delta and Market Ridge; agglutinative Ridge and incorporating Island; fusional Harbor. Early Ink and Delta Cursive write isolating speech without word spaces. `typology.cjs` parses Island and Market Ridge into the Classical logic and tests them against it.
- Examples that distinguish shared ancestry, independent convergence, learned restoration and borrowing.

The implemented parsers cover the formal Classical core, ordinary Island and ordinary Market Ridge, not every colloquial daughter grammar. The vocabulary is a seed lexicon, not a finished language. Ordinary numbers, kinship detail, full derivation, aspect, quotation, anaphora across sentences, and a larger corpus remain open. No text in Carlo's original drawing has been translated.

The bolder structural descendants are described in [the new-branches note](structural-branches.md). The glyph system groups sounds; it does not automatically supply grammar or recover unspoken vowels.
