# Worked language examples

**LOCAL LANGUAGE DRAFT.** These are new invented sentences, not transcriptions of Carlo's original specimen. Plain text examples below use the current script's typing keys; IPA appears separately when useful. Hyphens used in morphological discussion are analytical separators.

## Everyday reference

```
fa we pa tyni ta na sara ti na lena
```

“I assert, with claimed direct observational support, that Sara perceives Lena.”

`fa ASSERT · we OBSERVATIONAL-SUPPORT · pa PREDICATION · tyni PERCEIVE · ta PLACE-1 · na NAME · sara · ti PLACE-2 · na NAME · lena`

Place tags specify participants; evidence marks the speaker's support claim. No word means “this statement must be true.”

## A transfer with all three places

```
su ni ke pa lœni ta ni pa dar ta na sara ti na lena tu ni
```

“There is a record that Sara transfers to Lena.”

`∃y(record(y) ∧ transfer(Sara,Lena,y))`

`dar` assigns recipient to place 2 and transferred thing to place 3. Swapping their labels would change the event. Merely reordering the labelled pairs would not.

## Some record for each reader, or one record for everyone?

A:
```
ru mi ki pa tun ta mi su ni ke pa lœni ta ni pa tyni ta mi ti ni
```

Every person perceives at least one record; it need not be the same record.

B:
```
su ni ke pa lœni ta ni ru mi ki pa tun ta mi pa tyni ta mi ti ni
```

There is at least one particular record perceived by every person.

A model where Sara sees only record 1 and Lena only record 2 makes A true and B false. This is the first test in `check.cjs`.

## “Not everyone” is not “nobody”

```
no ru mi ki pa tun ta mi su ni ke pa lœni ta ni pa tyni ta mi ti ni
```

Not every person perceives a record: `¬∀x(person(x) → ∃y(record(y) ∧ perceive(x,y)))`.

```
ru mi ki pa tun ta mi no su ni ke pa lœni ta ni pa tyni ta mi ti ni
```

No person perceives any record: `∀x(person(x) → ¬∃y(record(y) ∧ perceive(x,y)))`.

If Sara sees a record and Lena sees none, the first is true and the second false. The negated universal entails that at least one person fails to perceive a record. The universal negative alone does not entail that people exist. Neither requires any records to exist.

## Asking rather than asserting

```
ma pa tyni ta na sara ti na lena
mu mi pa tyni ta mi ti na lena
```

“Does Sara perceive Lena?” / “Who or what perceives Lena?” The second does not restrict answers to people. To ask for a person, use:

```
mu mi ke pa tun ta mi pa tyni ta mi ti na lena
```

## The same plain clause through the branches

| Variety | Example | What changed |
| --- | --- | --- |
| Classical, explicit | pa tyni ta na sara ti na lena | full predicate and participant marking |
| Ridge, ordinary | tini nasarata nalenati | /y/ > /i/; place markers become suffixes, na a proclitic; pa omitted |
| Delta, ordinary | sara tin lena, written saratinlena | unrounding and apocope; isolating clause order; cursive writes the clause without spaces |
| Island, careful local | pa tuni ta na sara ti na lena we | /y/ > /u/; claimed observation becomes a final particle |
| Island, ordinary | nasarata nalenati tuniwe | agglutinative: place suffixes on arguments, evidence suffix on the verb |
| Market Ridge, ordinary | tin na sara na lena | apocope; suffixes lost; place by position |
| Harbor, contracted careful local | pa tun ta na sara ti na lenaw | final-i loss; observation clitic -w shares the final syllable block |
| Harbor, ordinary | nasarata nalenati tuniw | fusional: stem tuni- before a suffix, tun alone |
| Civic, audited | pa tin ta na sara ti na lena | Delta root with restored explicit participant marking |

The comparison holds the illustrative names constant. It does not claim proper names are immune to sound change. Ridge, Delta and Harbor sentences are design sketches. The parsers validate Classical, ordinary Island and ordinary Market Ridge syntax ([typology.md](typology.md)). Historical script selection does not convert one row into another.

## A dispute that belongs in a novel

A Delta clerk writes an ordinary clause whose quantifier scope is contextually clear to the local guild. An Island witness repeats it with a reportative particle, distancing themself from the claim. A Civic court demands the audited prefix form, exposing that “one record for every house” and “a record for each house” make different promises. The conflict comes from habits of use and institutional power, not from one people being logical and another irrational.

## A tone-driven lexical contrast

Classical `tas` “stone” loses final /s/ in Delta through a proposed /h/ stage and becomes `ta{3}` /ta˦˨/. The inherited place-1 particle `ta` has no such lexical falling tone. Losing a consonant has increased the burden on a small written mark. In this local proposal a speaker cannot safely erase that mark in a context where both readings are possible. Other contour marks remain available for discourse intonation and new lexical contrasts, without changing the creator-approved pitch values.
