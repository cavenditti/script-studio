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
    'Do not group Ridge with Stone because both are angular. That is writing technology, not descent.',
    'Island loni “record” is not an unchanged proto form: it passed through Classical lœni and changed back.',
    'Delta and Market Ridge both say tin “perceive” after independent vowel loss. One shared word does not make a subgroup.',
    'Civic spelling can keep archaic forms, so conservative writing can mask sound change.',
    'A formal logical register is not the whole language. Everyday speech drives the changes.'
  ];
  const stages={
    stone:{
      language:'Proto-Talar',morphology:'Isolating',division:'Spaced: one word per counted slot',
      sound:['Reconstructed citation forms, root-initial stress','Vowels /a e i o u ə/'],
      grammar:'Predicates name numbered places; prefix particles mark predication (pa), places (ta ti tu), names (na) and logical scope.',
      cognates:['tun','loni','tuni','tas','ner','zanu'],
      examples:[
        {text:'pa tuni ta na sara ti na lena',gloss:'Sara perceives Lena.',parts:'pa PREDICATE · tuni perceive · ta place-1 · na NAME sara · ti place-2 · na NAME lena'},
        {text:'pa zanu ta na lena',gloss:'Lena sleeps.',parts:'pa · zanu sleep · ta place-1 · na lena'}
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
    ridge:{
      language:'Ridge Talar',morphology:'Agglutinative, dependent-marking',division:'Spaced',
      sound:['y → i, œ → è: tyni → tini, lœni → lèni','c g → ts dz: ca → tsa “hot”','w → v: waro → varo “river”'],
      grammar:'Place words become suffixes on each argument and na becomes a name prefix. The predicate comes first and pa is dropped.',
      cognates:['tun','lèni','tini','tas','nèr','zanu'],
      examples:[
        {text:'tini nasarata nalenati',gloss:'Sara perceives Lena.',parts:'tini perceive · na-sara-ta NAME-Sara-place1 · na-lena-ti NAME-Lena-place2'},
        {text:'zanu nalenata',gloss:'Lena sleeps.',parts:'zanu sleep · na-lena-ta'}
      ]},
    delta:{
      language:'Delta Talar',morphology:'Isolating',division:'Continuous: each clause is one cursive ribbon',
      sound:['y œ æ → i e e','t d → r between vowels: mata → mara “parent”','final i u lost after m n l r: tini → tin, zanu → zan','final s → falling tone: tas → ta{3} “stone”'],
      grammar:'Speech stays isolating: subject, predicate, object, with arguments omitted when context supplies them. Only the writing joins the words. Readers recover them from a small set of function words; the one clash in the seed lexicon is vuna “bind” versus vu na.',
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
    civic:{
      language:'Civic Talar',morphology:'Isolating, audited register',division:'Spaced by printers',
      sound:['Inherits Delta reflexes without a further blanket change'],
      grammar:'Courts and printers restore the explicit Classical prefix construction, with modern roots, so that quantifier scope can be audited again. Everyday speech stays Delta-like.',
      cognates:['tun','len','tin','ta{3}','nèr','zan'],
      examples:[
        {text:'pa tin ta na sara ti na lena',gloss:'Sara perceives Lena.',parts:'Classical construction with Delta tin'},
        {text:'pa zan ta na lena',gloss:'Lena sleeps.',parts:'pa · zan · ta · na lena'}
      ]},
    'ridge-alpha':{
      language:'Market Ridge',morphology:'Isolating, positional',division:'Spaced',
      sound:['ts dz → s z: tsa → sa “hot”','final i u lost after m n l r: tini → tin, lèni → lèn','creates homophones: nèr “water” and nèr “remember”'],
      grammar:'The trading variety drops the suffixes, pa and the place words. The predicate comes first and its arguments follow in place order, so position alone fixes the place. The logical operators survive as invariant free words. The number of arguments tells homophones apart.',
      cognates:['tun','lèn','tin','tas','nèr','zan'],
      examples:[
        {text:'tin na sara na lena',gloss:'Sara perceives Lena.',parts:'tin perceive · na sara (place 1) · na lena (place 2)'},
        {text:'zan na lena',gloss:'Lena sleeps.',parts:'zan sleep · na lena'},
        {text:'ru mi ki tun mi su ni ke lèn ni tin mi ni',gloss:'Every person perceives some record.',parts:'the Classical formula with positional places'}
      ]},
    harbor:{
      language:'Harbor Talar',morphology:'Fusional',division:'Spaced pictograms, one per syllable',
      sound:['r → l after a vowel: dar → dal','final i u lost after m n l r: tuni → tun (now homophonous with tun “person”)','the observation suffix -we contracts to -w after a vowel'],
      grammar:'Island suffixes erode and fuse with the stem. Apocope only applies at the end of a word, so the stem alternates: bare tun, but tuni- before a suffix. One syllable can carry several categories: -tew is past and observed.',
      cognates:['tun','lon','tun','tas','nèl','zan'],
      examples:[
        {text:'nasarata nalenati tuniw',gloss:'Sara perceives Lena (I saw it).',parts:'tuni-w: the stem keeps its vowel before the fused evidence ending'},
        {text:'nalenata zanuw',gloss:'Lena sleeps (I saw it).',parts:'zanu-w, but bare zan'},
        {text:'rutunta lontuniwutew',gloss:'(I saw that) no person perceived any record.',parts:'lon-tuni-wu-tew record-perceive-NOT-PAST.OBSERVED'}
      ]}
  };
  const get=id=>stages[id]||stages.classical;
  const api={meanings,intro,pitfalls,stages,get};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.ScriptPhilology=api;
})(typeof globalThis!=='undefined'?globalThis:this);
