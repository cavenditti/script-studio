/* Philology of the fictional script family: the spoken variety behind each
   historical hand, its sound changes and grammar, cognates and example
   sentences in that variety's own spelling and word division.
   Mirrors drafts/language; drafts/language/check.cjs verifies every cognate
   and parseable example against the language model. */
(function(root){
  'use strict';
  // Six comparison meanings; values are each stage's reflex in editor keys.
  const meanings=['person','record','perceive','stone','water','sleep'];
  const intro='Each hand belongs to a spoken variety of Talar, a provisional language invented for this script. Languages descend by regular sound change; scripts are copied, borrowed and reformed. The two histories are related but separate. Examples are written in each variety’s own spelling and word division, so the same sentence can look radically different.';
  const pitfalls=[
    'Harbor Talar is an Island language written in a script from the Reed Seals. Script descent and language descent part ways.',
    'Upland Capitals look like a late alphabet, but they descend from the Ridge Alphabet and the Stone Register. Upland Talar never had the Classical fronted vowels.',
    'Island Bookhand’s vowel shapes come from Harbor Blocks. That is late graphic borrowing; the Island ribbon still descends from Classical.',
    'Island loni “record” is not an unchanged proto form: it passed through Classical lœni and changed back.',
    'Ridge Cut looks angular like the Stone Register, but it is the ancestor of the ink tradition. The Ridge Alphabet, also from Stone, belongs to the upland line instead.',
    'Seal and Classical spellings can keep archaic forms, so conservative writing can mask sound change.',
    'A formal logical register is not the whole language. Everyday speech drives the changes.'
  ];
  const stages={
    stone:{
      language:'Proto-Talar',morphology:'Isolating',division:'Spaced: one word per counted slot; vowels raised after their consonant',
      sound:['Reconstructed citation forms, root-initial stress','Vowels /a e i o u ə/'],
      grammar:'Predicates name numbered places; prefix particles mark predication (pa), places (ta ti tu), names (na) and logical scope.',
      cognates:['tun','loni','tuni','tas','ner','zanu'],
      examples:[
        {text:'pa tuni ta na sara ti na lena',gloss:'Sara perceives Lena.',parts:'pa PREDICATE · tuni perceive · ta place-1 · na NAME sara · ti place-2 · na NAME lena'},
        {text:'pa zanu ta na lena',gloss:'Lena sleeps.',parts:'pa · zanu sleep · ta place-1 · na lena'}
      ]},
    ridge:{
      language:'Proto-Talar on ridge labels',morphology:'Isolating',division:'Spaced; vowels now marks over their consonant',
      sound:['No sound change: this is a script stage of Proto-Talar, not a new language'],
      grammar:'The same prefix grammar as the Stone Register. Label cutters hang each sign on two ruled rails and reduce raised vowels to marks, the structure that Early Ink and every Classical-related script inherit.',
      cognates:['tun','loni','tuni','tas','ner','zanu'],
      examples:[
        {text:'pa tuni ta na sara ti na lena',gloss:'Sara perceives Lena.',parts:'pa · tuni perceive · ta place-1 · na sara · ti place-2 · na lena'},
        {text:'pa zanu ta na lena',gloss:'Lena sleeps.',parts:'pa · zanu sleep · ta · na lena'}
      ]},
    'ridge-alpha':{
      language:'Old Upland Talar',morphology:'Isolating, positional',division:'Spaced, one full letter per sound',
      sound:['Splits from Proto-Talar before Early Talar, so it never shows the Classical vowel fronting','w → v everywhere: waro → varo “river”'],
      grammar:'The upland variety drops pa and the place words. The predicate comes first and its arguments follow in place order, so position alone fixes the place. The logical operators survive as invariant free words.',
      cognates:['tun','loni','tuni','tas','ner','zanu'],
      examples:[
        {text:'tuni na sara na lena',gloss:'Sara perceives Lena.',parts:'tuni perceive · na sara (place 1) · na lena (place 2)'},
        {text:'zanu na lena',gloss:'Lena sleeps.',parts:'zanu sleep · na lena'},
        {text:'ru mi ki tun mi su ni ke loni ni tuni mi ni',gloss:'Every person perceives some record.',parts:'the prefix formula with positional places'}
      ]},
    capitals:{
      language:'Upland Talar',morphology:'Isolating, positional',division:'Spaced, one single-stroke letter per sound',
      sound:['Inherits Old Upland w → v','a final unstressed i u after a consonant reduces to schwa (h): tuni → tunh, zanu → zanh'],
      grammar:'Keeps the positional clause of Old Upland: predicate first, arguments in place order, operators as free words.',
      cognates:['tun','lonh','tunh','tas','ner','zanh'],
      examples:[
        {text:'tunh na sara na lena',gloss:'Sara perceives Lena.',parts:'tunh perceive · na sara · na lena'},
        {text:'zanh na lena',gloss:'Lena sleeps.',parts:'zanh sleep · na lena'}
      ]},
    reed:{
      language:'Early Talar',morphology:'Isolating',division:'Continuous: a whole formula is one ink line',
      sound:['/w/ → /v/ before /u/: *wuna → vuna “bind”'],
      grammar:'Still analytic. The audience knows the formula, so scribes write it without word spaces.',
      cognates:['tun','loni','tuni','tas','ner','zanu'],
      examples:[
        {text:'patunitanasaratinalena',gloss:'Sara perceives Lena.',parts:'pa · tuni · ta · na sara · ti · na lena, written without spaces'},
        {text:'pazanutanalena',gloss:'Lena sleeps.',parts:'pa · zanu · ta · na lena'}
      ]},
    seal:{
      language:'Early Talar, maritime seal use',morphology:'Isolating',division:'Spaced: one seal cell per syllable',
      sound:['Records Early Talar; seal formulas preserve old spellings long after the coast speaks Island and then Harbor Talar'],
      grammar:'Seals hold names, owners and short formulas in the Early prefix construction. The script branch is a writing tradition, not a separate language.',
      cognates:['tun','loni','tuni','tas','ner','zanu'],
      examples:[
        {text:'pa tuni ta na sara ti na lena',gloss:'Sara perceives Lena.',parts:'Early Talar formula, one cell per syllable'},
        {text:'na lena',gloss:'Lena (an owner’s seal).',parts:'na NAME · lena'}
      ]},
    classical:{
      language:'Classical Talar',morphology:'Isolating, explicit logical register',division:'Spaced by school rule, so every scope word can be audited',
      sound:['tj dj sj zj → c g ş ž','a u o → æ y œ before i/j: tuni → tyni, loni → lœni','e o → è ò before a final liquid: ner → nèr'],
      grammar:'Quantifiers (ru every, su some), connectives (ke and, ko or, ki if, ku iff), negation (no) and evidence (we, wa, wo) are prefix words with fixed scope, so every formal sentence has exactly one reading.',
      cognates:['tun','lœni','tyni','tas','nèr','zanu'],
      examples:[
        {text:'pa tyni ta na sara ti na lena',gloss:'Sara perceives Lena.',parts:'pa · tyni perceive · ta place-1 · na sara · ti place-2 · na lena'},
        {text:'ru mi ki pa tun ta mi su ni ke pa lœni ta ni pa tyni ta mi ti ni',gloss:'Every person perceives some record (possibly a different one each).',parts:'∀x (person(x) → ∃y (record(y) ∧ perceive(x, y)))'},
        {text:'su ni ke pa lœni ta ni pa dar ta na sara ti na lena tu ni',gloss:'Sara gives Lena a record.',parts:'∃y (record(y) ∧ transfer(Sara, Lena, y))'}
      ]},
    delta:{
      language:'Delta Talar',morphology:'Isolating',division:'Continuous: each clause is one cursive ribbon',
      sound:['y œ æ → i e e','t d → r between vowels: mata → mara “parent”','final i u lost after m n l r: tini → tin, zanu → zan','final s → falling tone: tas → ta{3} “stone”'],
      grammar:'Speech stays isolating: subject, predicate, object, with arguments omitted when context supplies them. Only the writing joins the words, in a slanted cursive that never lifts the pen inside a clause. Readers recover them from a small set of function words; the one clash in the seed lexicon is vuna “bind” versus vu na.',
      cognates:['tun','len','tin','ta{3}','nèr','zan'],
      examples:[
        {text:'saratinlena',gloss:'Sara perceives Lena.',parts:'sara · tin perceive · lena, spoken as three free words'},
        {text:'saradarlenalen',gloss:'Sara gives Lena a record.',parts:'sara · dar give · lena · len record'},
        {text:'lenazan',gloss:'Lena sleeps.',parts:'lena · zan sleep'}
      ]},
    island:{
      language:'Island Talar',morphology:'Agglutinative, incorporating',division:'Spaced, long words',
      sound:['y œ æ → u o a: tyni → tuni, lœni → loni (a reversal, not a survival)','c g → ş ž','v → w between vowels: nava → nawa “know”','compounds drop a final i u after m n l r: loni → lon-'],
      grammar:'One-place content roots are compounded into the predicate (lon-tuni “record-perceive”) and always scope narrowest. Arguments carry place suffixes and quantifier prefixes (ru- every, su- some), with the leftmost taking widest scope. Negation -wu, tense -te/-to and evidence -we/-wa/-wo are suffixed to the predicate.',
      cognates:['tun','loni','tuni','tas','nèr','zanu'],
      examples:[
        {text:'nasarata nalenati tuniwe',gloss:'Sara perceives Lena (I saw it).',parts:'na-sara-ta · na-lena-ti · tuni-we perceive-OBSERVED'},
        {text:'rutunta lontuni',gloss:'Every person perceives some record.',parts:'ru-tun-ta every-person-place1 · lon-tuni record-perceive'},
        {text:'sulonti rutunta tuni',gloss:'There is one record that every person perceives.',parts:'su-lon-ti some-record-place2 first: wide scope'},
        {text:'nasarata nalenati londar',gloss:'Sara gives Lena a record.',parts:'lon-dar record-give: the record is incorporated'}
      ]},
    harbor:{
      language:'Harbor Talar',morphology:'Fusional',division:'Spaced pictograms, one per syllable',
      sound:['r → l after a vowel: dar → dal','final i u lost after m n l r: tuni → tun (now homophonous with tun “person”)','the observation suffix -we contracts to -w after a vowel'],
      grammar:'The language descends from Island Talar, but its script descends from the Reed Seals. Island suffixes erode and fuse with the stem. Apocope only applies at the end of a word, so the stem alternates: bare tun, but tuni- before a suffix. One syllable can carry several categories: -tew is past and observed.',
      cognates:['tun','lon','tun','tas','nèl','zan'],
      examples:[
        {text:'nasarata nalenati tuniw',gloss:'Sara perceives Lena (I saw it).',parts:'tuni-w: the stem keeps its vowel before the fused evidence ending'},
        {text:'nalenata zanuw',gloss:'Lena sleeps (I saw it).',parts:'zanu-w, but bare zan'},
        {text:'rutunta lontuniwutew',gloss:'(I saw that) no person perceived any record.',parts:'lon-tuni-wu-tew record-perceive-NOT-PAST.OBSERVED'}
      ]},
    roundel:{
      language:'Late Harbor Talar',morphology:'Isolating, monosyllabic',division:'Spaced circles, one per syllable, plus ideograms',
      sound:['any final vowel after a single consonant is lost: mata → mat “parent”, lena → len “rest”','most native words are now one syllable','tun “person” and tun “perceive” fall together, as do şa “hot” and şa “shine”'],
      grammar:'The fused Harbor endings wear away and are replaced by free particles, so the language becomes isolating again: subject, object, predicate, then a final evidence word. Ideograms (written #word) separate homophones and mark the commonest words.',
      cognates:['tun','lon','tun','tas','nèl','zan'],
      examples:[
        {text:'sara lena tun #we',gloss:'Sara perceives Lena (I saw it).',parts:'sara · lena · tun perceive · #we ideogram SEEN (an eye)'},
        {text:'#ru #tun lon tun',gloss:'Every person perceives some record.',parts:'#ru EVERY · #tun PERSON ideogram, unlike the spelled tun “perceive” · lon record · tun perceive'},
        {text:'#na lena zan #we',gloss:'Lena sleeps (I saw it).',parts:'#na NAME cartouche · lena · zan sleep · #we SEEN'}
      ]}
  };
  const get=id=>stages[id]||stages.classical;
  const api={meanings,intro,pitfalls,stages,get};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.ScriptPhilology=api;
})(typeof globalThis!=='undefined'?globalThis:this);
