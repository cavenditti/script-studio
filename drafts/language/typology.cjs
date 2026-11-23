/* LOCAL LANGUAGE DRAFT. Morphological typology of the daughter varieties.
   Not imported by the application or public build.

   Island ordinary speech is parsed into the same AST as the Classical core, so
   the existing finite-model evaluator can check that an agglutinative word and
   an explicit prefix formula make the same promise. Market Ridge (isolating,
   positional places) is parsed the same way. Delta (isolating, written without
   word spaces) is only segmented: its ordinary syntax is deliberately not
   given a guaranteed single parse. Harbor forms are derived from Island words. */
const L=require('./model.cjs');
const V=new Set(['a','e','i','o','u','h','æ','œ','è','ò','y']);
const seg=s=>s.match(/gh|ş|ž|\{\d\}|[a-zæœèòy]/g)||[];
const PLACES=['ta','ti','tu'];
const VARS=['mi','ni','li','ri'];

/* Word-division and morphology per script profile. `division` describes the
   written convention, `morphology` the ordinary spoken grammar. The two are
   independent: Delta is isolating yet written in unbroken clause ribbons. */
const varieties=[
  {id:'stone',morphology:'isolating',division:'spaced',note:'one invariant word per counted slot'},
  {id:'reed',morphology:'isolating',division:'continuous',note:'scriptio continua: a whole formula is one ink line'},
  {id:'classical',morphology:'isolating',division:'spaced',note:'school word-spacing makes every scope word auditable'},
  {id:'ridge',morphology:'agglutinative (dependent-marking)',division:'spaced',note:'place suffixes and name proclitic on each argument'},
  {id:'delta',morphology:'isolating',division:'continuous',note:'whole clauses written as one cursive ribbon'},
  {id:'island',morphology:'agglutinative (incorporating)',division:'spaced',note:'content roots, negation, tense and evidence built into long words'},
  {id:'civic',morphology:'isolating',division:'spaced',note:'print restores word spaces and the audited prefix register'},
  {id:'ridge-alpha',morphology:'isolating (positional)',division:'spaced',note:'suffixes lost; argument position alone fixes the place'},
  {id:'harbor',morphology:'fusional',division:'spaced',note:'eroded Island suffixes fuse with stems; stem alternation'},
];

/* Island combining stem: compounding truncates a final unstressed /i u/ after
   /m n l r/ in a polysyllable. Harbor later generalizes this to free words. */
function truncate(form){
  const t=seg(form);
  if(t.filter(c=>V.has(c)).length>1&&['i','u'].includes(t.at(-1))&&['m','n','l','r'].includes(t.at(-2)))t.pop();
  return t.join('');
}
const island=L.lexicon.map(e=>({...e,classical:L.reflex(e.proto,'classical'),form:L.reflex(e.proto,'island')}))
  .map(e=>({...e,stem:e.arity===1?truncate(e.form):null}));
const market=L.lexicon.map(e=>({...e,classical:L.reflex(e.proto,'classical'),form:L.reflex(e.proto,'ridge-alpha')}));

const pa=(root,args)=>({op:'pa',root,args});
const restrict=(q,variable,root,body)=>({op:q,variable,body:{op:q==='ru'?'ki':'ke',left:pa(root,[{variable}]),right:body}});

/* Island ordinary clause:
     OPERATOR* ARGUMENT* PREDICATE
   OPERATOR   no | ma                          free words, widest scope, in order
   ARGUMENT   na-NAME-PLACE | Q-STEM-PLACE      Q = ru every, su some, mu which
   PREDICATE  (STEM-)ROOT(-wu)(-te|-to)(-we|-wa|-wo)
   Scope, outermost first: operators, evidence, tense, quantified arguments in
   left-to-right order, negation -wu, the incorporated stem, the predicate.
   An incorporated stem is always a narrowest-scope existential and fills the
   single place no argument word supplies. Returns every reading. */
function parseIsland(text){
  const words=text.trim().normalize('NFC').toLowerCase().split(/\s+/);
  const ops=[];while(words.length>1&&['no','ma'].includes(words[0]))ops.push(words.shift());
  const predWord=words.pop();
  if(!predWord)throw new Error('Missing predicate word');
  const args=words.map(w=>{
    const place=w.slice(-2),body=w.slice(0,-2);
    if(!PLACES.includes(place))throw new Error('Argument word without place suffix: '+w);
    const n=PLACES.indexOf(place)+1;
    if(body.startsWith('na')&&body.length>2)return [{place:n,name:body.slice(2)}];
    const q=body.slice(0,2),stem=body.slice(2);
    if(!['ru','su','mu'].includes(q))throw new Error('Expected na- or quantifier prefix: '+w);
    const hits=island.filter(e=>e.stem===stem);
    if(!hits.length)throw new Error('Unknown restrictor stem '+stem);
    return hits.map(e=>({place:n,q,root:e.classical}));
  });
  const preds=[];
  for(const evid of ['','we','wa','wo'])for(const tense of ['','te','to'])for(const neg of ['','wu']){
    const suffix=neg+tense+evid;if(!predWord.endsWith(suffix))continue;
    const core=predWord.slice(0,predWord.length-suffix.length);
    for(const e of island){
      if(core===e.form)preds.push({root:e,inc:null,neg,tense,evid});
      for(const s of island)if(s.stem&&core===s.stem+e.form)preds.push({root:e,inc:s,neg,tense,evid});
    }
  }
  if(!preds.length)throw new Error('Cannot analyse predicate word '+predWord);
  const readings=[];
  const combos=args.reduce((acc,alts)=>acc.flatMap(a=>alts.map(x=>[...a,x])),[[]]);
  for(const p of preds)for(const argList of combos){
    const filled=argList.map(a=>a.place);
    if(new Set(filled).size!==filled.length||filled.some(n=>n>p.root.arity))continue;
    const open=[...Array(p.root.arity).keys()].map(i=>i+1).filter(n=>!filled.includes(n));
    if(open.length!==(p.inc?1:0))continue;
    let pool=[...VARS];const fresh=()=>{if(!pool.length)throw new Error('Too many bound places');return pool.shift();};
    const terms=[],bound=argList.map(a=>{if(a.name){terms[a.place-1]={name:a.name};return null;}const v=fresh();terms[a.place-1]={variable:v};return {...a,variable:v};});
    let incVar=null;if(p.inc){incVar=fresh();terms[open[0]-1]={variable:incVar};}
    let ast=pa(p.root.classical,terms);
    if(p.inc)ast=restrict('su',incVar,p.inc.classical,ast);
    if(p.neg)ast={op:'no',body:ast};
    for(const a of [...bound].reverse())if(a)ast=restrict(a.q,a.variable,a.root,ast);
    if(p.tense)ast={op:p.tense,body:ast};
    if(p.evid)ast={op:p.evid,body:ast};
    for(const op of [...ops].reverse())ast={op,body:ast};
    readings.push(ast);
  }
  if(!readings.length)throw new Error('No reading fills every place exactly once: '+text);
  return readings;
}

/* Market Ridge everyday register: the Classical prefix operators survive as
   free invariant words, but pa and the place words are gone. A predicate root
   is followed by its arguments in place order. Homophones created by apocope
   (nèr "water" / nèr "remember") are resolved by counting the following terms. */
function parseMarket(text){
  const t=text.trim().normalize('NFC').toLowerCase().split(/\s+/);let i=0;
  const take=()=>{if(i>=t.length)throw new Error('Unexpected end of formula');return t[i++];};
  const isTerm=()=>t[i]==='na'||VARS.includes(t[i]);
  const term=env=>{const w=take();if(w==='na')return {name:take()};if(!env.has(w))throw new Error('Unbound variable '+w);return {variable:w};};
  const form=env=>{
    const op=take();
    if(['su','ru','mu'].includes(op)){const v=take();if(!VARS.includes(v)||env.has(v))throw new Error('Invalid or shadowed binder '+v);return {op,variable:v,body:form(new Set([...env,v]))};}
    if(['fa','no','we','wa','wo','te','to','ma'].includes(op))return {op,body:form(env)};
    if(['ke','ko','ki','ku'].includes(op))return {op,left:form(env),right:form(env)};
    if(['vi','vu'].includes(op))return {op};
    const hits=market.filter(e=>e.form===op);if(!hits.length)throw new Error('Expected formula, found '+op);
    const args=[];while(isTerm())args.push(term(env));
    const fit=hits.filter(e=>e.arity===args.length);
    if(fit.length!==1)throw new Error((fit.length?'Ambiguous':'No')+' predicate '+op+' with '+args.length+' arguments');
    return pa(fit[0].classical,args);
  };
  const ast=form(new Set());if(i!==t.length)throw new Error('Trailing words: '+t.slice(i).join(' '));return ast;
}

/* Delta writes a clause as one unbroken ribbon. Readers recover words from the
   closed set of function words, the root lexicon and the names they know.
   Every segmentation is returned; more than one is a genuine reading problem. */
const deltaFunction=['pa','ta','ti','tu','na','no','su','ru','ke','ko','ki','ku','we','wa','wo','te','to','ma','mu','fa','vi','vu','mi','ni','li','ri'];
const deltaRoots=[...new Set(L.lexicon.map(e=>L.reflex(e.proto,'delta')))];
function segmentDelta(ribbon,names=[]){
  const words=[...new Set([...deltaFunction,...deltaRoots,...names])];
  const memo=new Map();
  const go=s=>{if(s==='')return [[]];if(memo.has(s))return memo.get(s);const out=[];for(const w of words)if(s.startsWith(w))for(const rest of go(s.slice(w.length)))out.push([w,...rest]);memo.set(s,out);return out;};
  return go(ribbon.normalize('NFC').toLowerCase());
}
const joinDelta=clause=>clause.trim().split(/\s+/).join('');

/* Harbor descends from Island. Its lexical rules apply to each morpheme, then
   the word-final apocope applies to the whole word and the observation suffix
   contracts after a vowel. A root keeps its old vowel before a suffix: the
   stem alternation tun ~ tuni- is the first fusional pattern. Names keep their
   form, as everywhere in this workbook. */
const harborLex=s=>s.replace(/([aeiouhæœèòy])r/g,'$1l');
function harborWord(morphs){
  let word=morphs.map(m=>m.name?m.name:harborLex(m.text)).join('');
  const last=morphs.at(-1);
  if(!last.name&&!last.suffix)word=truncate(word);
  if(last.suffix&&last.text==='we'&&V.has(word.at(-3)))word=word.slice(0,-1);
  return word;
}

module.exports={varieties,truncate,island,market,parseIsland,parseMarket,segmentDelta,joinDelta,deltaRoots,harborWord};
