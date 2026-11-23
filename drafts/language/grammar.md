# Classical Talar: a logic-inspired core

**LOCAL LANGUAGE DRAFT.** The formal register belongs to a society that negotiates boundaries, water rights and shared archives. Its founders regularized an existing spoken language for agreements. The result is learned precision, not a population speaking mathematics at breakfast.

## Sound and spelling

Use the editor's keys. `gh` is /ɡ/, `c` /tʃ/, `g` /dʒ/, `ş` /ʃ/, `ž` /ʒ/, `y` /y/, `h` /ə/, `è` /ɛ/, and `ò` /ɔ/. Other keys retain the approved values. A root normally carries initial stress; function words are unstressed unless contrasted. The apostrophe can make stress explicit: `ty'ni`. It attaches to the preceding consonant/vowel unit, so it follows the stressed vowel. A primary-stress apostrophe after `tyni` would stress the second syllable instead.

Ancestral roots favor (C)(j/w)V(C), with two-syllable roots common. Classical palatalization creates affricates and postalveolar fricatives; vowel fronting creates surface /æ œ y/. Final-liquid lowering supplies /ɛ ɔ/. This small lexicon does not yet establish the independent phonemic status of every surface vowel. Do not mistake the editor's full alphabet for a proven phoneme inventory of each historical stage.

Words are separated in normalized transcription. A word's vowel signs follow its consonants in the input and sit over those consonants in the drawing. Joined letter ribbons are orthographic words, not automatic scope brackets. Complex tones use the already approved mark meanings. Unmarked tone is unspecified by the script; ordinary Classical reading uses contextual intonation.

## The central design decision: predicates have named places

A content root denotes a relation rather than belonging permanently to a noun or verb class. It has a dictionary entry with a fixed number of places:

| Root | Relation | Places |
| --- | --- | --- |
| tun | is a person | 1: person |
| lœni | is a record | 1: record |
| tyni | perceives | 1: perceiver; 2: percept |
| dar | transfers | 1: giver; 2: recipient; 3: thing transferred |
| sama | is similar to | 1: compared entity; 2: comparison standard |

`ta`, `ti`, `tu` introduce places 1, 2, 3. They do **not** universally mean agent, patient and instrument. A person in `tun` is not an agent, and the second place of `dar` is a recipient. Dictionary place structure carries those distinctions.

`pa` introduces a predication. Exactly the root's required places must follow, each once. Within that predication labelled arguments may be reordered:

```
pa tyni ta na sara ti na lena
pa tyni ti na lena ta na sara
```

Both mean that Sara perceives Lena. There is no covert reversal when the percept comes first. `na` introduces a one-word name; lowercase names are used in normalized transcription. The names here are illustrative, not reconstructed historical names.

A nominal description is itself a predication: `pa lœni ta ni` says that ni is a record. There is no article that silently introduces an existential quantifier.

## Reference and scope

Four short variable words, `mi ni li ri`, are neutral discourse indices, not first-/second-/third-person pronouns. They refer only to a variable bound within the formula. A repeated binder for an already-bound variable is disallowed in the draft core; rename it instead. Longer indexed variables can be added later.

| Word | Construction | Reading |
| --- | --- | --- |
| su | su VARIABLE FORMULA | there exists an entity such that… |
| ru | ru VARIABLE FORMULA | for every entity… |
| no | no FORMULA | it is not the case that… |
| ke | ke FORMULA FORMULA | both statements hold |
| ko | ko FORMULA FORMULA | at least one statement holds; inclusive or |
| ki | ki FORMULA FORMULA | if the first, then the second; material implication in the formal core |
| ku | ku FORMULA FORMULA | the statements have the same truth value |
| vi / vu | a complete formula | true / false |

These are prefix constructions with fixed arity. Their scopes are structural, not inferred from stress, punctuation or the reader's preferred interpretation. Parentheses in explanatory glosses are not spoken words. The parser can determine where each complete formula ends from the operators and predicate valencies.

Quantifiers range over a shared domain. Restrictions are explicit. “Every person…” begins `ru mi ki pa tun ta mi …`; it does not quantify only over humans by magic. A universal statement need not imply that any person exists. Add a separate existential statement when that commitment matters.

### Two different obligations

```
ru mi ki pa tun ta mi su ni ke pa lœni ta ni pa tyni ta mi ti ni
```

Every person perceives some record; each person may perceive a different one.

`∀x(person(x) → ∃y(record(y) ∧ perceive(x,y)))`

```
su ni ke pa lœni ta ni ru mi ki pa tun ta mi pa tyni ta mi ti ni
```

There is a record that every person perceives.

`∃y(record(y) ∧ ∀x(person(x) → perceive(x,y)))`

These are not stylistic paraphrases. A clerk cannot swap the binders without changing the obligation. `check.cjs` evaluates a countermodel in which the first is true and the second false.

## Evidence, time and speech acts

| Word | Construction | Use |
| --- | --- | --- |
| fa | fa FORMULA | assertion; can be omitted in a standalone statement |
| we | we FORMULA | the speaker claims direct observational support |
| wa | wa FORMULA | the speaker claims inferential support |
| wo | wo FORMULA | the speaker attributes the statement to a report |
| te | te FORMULA | the statement holds at a contextually supplied past reference time |
| to | to FORMULA | the statement holds at a contextually supplied future reference time |
| ma | ma FORMULA | asks whether the statement holds |
| mu | mu VARIABLE FORMULA | asks for values of a variable satisfying the formula |

An evidence marker records a **claim about support**, not a guarantee of truth. A lying witness can say `we`. Past/future reference is context supplied; this draft does not yet model event intervals, perfectivity or tense agreement. Unmarked time is unspecified, not automatically present.

The finite-model evaluator implements the truth-functional and quantified fragment, with `fa` as an assertion wrapper. It deliberately refuses to certify evidence, time and questions. `parse` records their scopes; a fuller semantics still needs sources, speakers, worlds and times. In particular `wo no P` attributes a denial to a report, whereas `no wo P` denies that there is the specified reported support. They are not De Morgan variants of the same plain proposition.

## What a conversation sounds like

A formal exchange:

```
ma pa tyni ta na sara ti na lena
fa we pa tyni ta na sara ti na lena
```

“Does Sara perceive Lena?” / “Yes: I assert it with direct observational support.” Ordinary conversation usually gives a short `vi` or an echoed predicate instead. Full answers are available for a hearing, a dispute, a lesson or a joke about someone being pedantic.

The precision register bans omitted arguments and free variables. Everyday Classical Talar permits recoverable arguments to remain unsaid, coordinated subjects to share a predicate, and quotations to carry irony. Those constructions require discourse context and are **outside** the unambiguous parser. The daughter languages expand those everyday patterns; none loses the cultural ability to reason carefully.

## Matters deliberately left open

No classifier system, grammatical gender, obligatory plural or inclusive/exclusive pronoun contrast has been fixed. Counting and measure phrases need a separate design. Predicate valencies currently have only one to three places; abstraction and predicate-valued arguments are not yet defined. Avoid pretending that arbitrary natural-language claims already have unique translations into this small fragment.

The inspiration is explicit scope and relational places, familiar from logical languages, not a relexification of Lojban. The particles, grammar, history and examples above are original provisional design. See [The Complete Lojban Language, chapter 16](https://lojban.org/publications/cll.before-20160606/cll_v1.1_xhtml-chapter-chunks/chapter-quantifiers.html) for a real discussion of quantifier order and negation boundaries; its particular conventions are not imported here.

## The new structural scripts

The Ridge Alphabet writes the same phonetic transcription as a stream of full consonant and vowel letters. Harbor Blocks group a phonological syllable into one composite sign. Neither writing mode by itself binds a logical variable, assigns a predicate place, or changes scope. The explicit formal particles still do that work. In particular a tone flag has the creator-approved pitch value; the public renderer does not secretly turn it into a case, quantifier or logical operator.
