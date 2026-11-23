/* LOCAL LANGUAGE DRAFT. Not imported by the application or public build. */
const fs=require('node:fs'),path=require('node:path');
const lexicon=require('./lexicon.json');
const vowels=new Set(['a','e','i','o','u','h','æ','œ','è','ò','y']);
const tokenize=s=>s.match(/gh|[a-zæœèòy]/g)||[];
const stages=['stone','ridge','ridge-alpha','capitals','reed','seal','classical','delta','island','harbor','cord'];
function early(s){return s.replace(/wu/g,'vu');}
function common(s){
  let t=tokenize(s);const palatal={t:'c',d:'g',s:'ş',z:'ž'};
  for(let i=0;i<t.length-1;i++)if(palatal[t[i]]&&t[i+1]==='j'){t.splice(i,2,palatal[t[i]]);}
  const front={a:'æ',u:'y',o:'œ'};
  for(let i=0;i<t.length;i++)if(front[t[i]]&&((t[i+1]==='j')||(!vowels.has(t[i+1])&&['i','j'].includes(t[i+2]))))t[i]=front[t[i]];
  for(let i=0;i<t.length-1;i++)if(['e','o'].includes(t[i])&&['r','l'].includes(t[i+1])&&i+2===t.length)t[i]=t[i]==='e'?'è':'ò';
  return t.join('');
}
function daughter(s,stage){
  // Keep postalveolar fricatives atomic rather than treating sh as s + schwa.
  let t=s.match(/gh|ş|ž|[a-zæœèòy]/g)||[];
  if(stage==='ridge')return t.map(c=>({y:'i',œ:'è',c:'ts',g:'dz',w:'v'}[c]||c)).join('');
  if(stage==='island'){
    t=t.map(c=>({y:'u',œ:'o',æ:'a',c:'ş',g:'ž'}[c]||c));
    t=t.map((c,i,a)=>c==='v'&&vowels.has(a[i-1])&&vowels.has(a[i+1])?'w':c);return t.join('');
  }
  if(stage==='delta'){
    t=t.map(c=>({y:'i',œ:'e',æ:'e'}[c]||c));
    t=t.map((c,i,a)=>['t','d'].includes(c)&&vowels.has(a[i-1])&&vowels.has(a[i+1])?'r':c);
    if(t.filter(c=>vowels.has(c)).length>1&&['i','u'].includes(t.at(-1))&&['m','n','l','r'].includes(t.at(-2)))t.pop();
    if(t.at(-1)==='s'&&vowels.has(t.at(-2))){t.pop();return t.join('')+'{3}';}
    return t.join('');
  }
  return s;
}
function terminal(s,stage){
  // Harbor: postvocalic /r/ → /l/, then final /i u/ apocope after a sonorant.
  let t=s.replace(/([aeiouhæœèòy])r/g,'$1l').match(/gh|ş|ž|[a-zæœèòy]/g)||[];
  if(t.filter(c=>vowels.has(c)).length>1&&['i','u'].includes(t.at(-1))&&['m','n','l','r'].includes(t.at(-2)))t.pop();
  return t.join('');
}
// Old Upland Talar (Ridge Alphabet) splits from Proto: /w/ → /v/ everywhere.
function oldUpland(proto){return proto.replace(/w/g,'v');}
// Upland Talar (Capitals) then reduces a final unstressed /i u/ after a
// consonant to schwa (key h).
function upland(proto){const t=tokenize(oldUpland(proto));if(t.filter(c=>vowels.has(c)).length>1&&['i','u'].includes(t.at(-1))&&!vowels.has(t.at(-2)))t[t.length-1]='h';return t.join('');}
// Late Harbor: any final vowel after a single consonant is lost in a
// polysyllable, so most words become one syllable.
function late(s){const t=s.match(/gh|ş|ž|[a-zæœèòy]/g)||[];if(t.filter(c=>vowels.has(c)).length>1&&vowels.has(t.at(-1))&&!vowels.has(t.at(-2))&&vowels.has(t.at(-3)))t.pop();return t.join('');}
function reflex(proto,stage){if(stage==='stone'||stage==='ridge')return proto;if(stage==='ridge-alpha')return oldUpland(proto);if(stage==='capitals')return upland(proto);if(stage==='seal')return early(proto);if(stage==='cord')return late(reflex(proto,'harbor'));const r=early(proto);if(stage==='reed')return r;const c=common(r);if(stage==='classical')return c;if(stage==='harbor')return terminal(daughter(c,'island'),stage);return daughter(c,stage);}
const roots=new Map(lexicon.map(entry=>[reflex(entry.proto,'classical'),entry]));
const variables=new Set(['mi','ni','li','ri']);
const roles=['ta','ti','tu'];
const unary=new Set(['fa','no','we','wa','wo','te','to','ma']);
function parse(text){
  const t=text.trim().normalize('NFC').toLowerCase().split(/\s+/),take=()=>{if(i>=t.length)throw new Error('Unexpected end of formula');return t[i++];};let i=0;
  const term=env=>{const word=take();if(word==='na')return {name:take()};if(variables.has(word)){if(!env.has(word))throw new Error('Unbound variable '+word);return {variable:word};}throw new Error('Expected variable or named term, found '+word);};
  const form=env=>{
    const op=take();
    if(['su','ru','mu'].includes(op)){const variable=take();if(!variables.has(variable)||env.has(variable))throw new Error('Invalid or shadowed binder '+variable);const nested=new Set(env);nested.add(variable);return {op,variable,body:form(nested)};}
    if(unary.has(op))return {op,body:form(env)};
    if(['ke','ko','ki','ku'].includes(op))return {op,left:form(env),right:form(env)};
    if(['vi','vu'].includes(op))return {op};
    if(op==='pa'){
      const root=take(),entry=roots.get(root);if(!entry)throw new Error('Unknown predicate '+root);const args={};
      for(let n=0;n<entry.arity;n++){const role=take();if(!roles.slice(0,entry.arity).includes(role)||args[role])throw new Error('Missing, duplicate or invalid place '+role);args[role]=term(env);}
      return {op,root,args:roles.slice(0,entry.arity).map(role=>args[role])};
    }
    throw new Error('Expected formula, found '+op);
  };
  const result=form(new Set());if(i!==t.length)throw new Error('Trailing words: '+t.slice(i).join(' '));return result;
}
function logical(ast){
  const op=ast.op;
  if(op==='pa')return ast.root+'('+ast.args.map(t=>t.variable||JSON.stringify(t.name)).join(',')+')';
  if(op==='ru'||op==='su'||op==='mu')return ({ru:'∀',su:'∃',mu:'?'}[op])+ast.variable+'['+logical(ast.body)+']';
  if(op==='no')return '¬['+logical(ast.body)+']';
  if(['ke','ko','ki','ku'].includes(op))return '('+logical(ast.left)+({ke:' ∧ ',ko:' ∨ ',ki:' → ',ku:' ↔ '}[op])+logical(ast.right)+')';
  if(op==='vi'||op==='vu')return op==='vi'?'⊤':'⊥';
  return op+'['+logical(ast.body)+']';
}
function evaluate(ast,model,env={}){
  const op=ast.op;
  if(op==='fa')return evaluate(ast.body,model,env);
  if(op==='ru'||op==='su')return model.domain[op==='ru'?'every':'some'](v=>evaluate(ast.body,model,{...env,[ast.variable]:v}));
  if(op==='pa'){const tuple=ast.args.map(t=>t.variable?env[t.variable]:t.name);return (model.predicates[ast.root]||[]).some(row=>row.length===tuple.length&&row.every((v,i)=>v===tuple[i]));}
  if(op==='no')return !evaluate(ast.body,model,env);
  if(op==='ke')return evaluate(ast.left,model,env)&&evaluate(ast.right,model,env);
  if(op==='ko')return evaluate(ast.left,model,env)||evaluate(ast.right,model,env);
  if(op==='ki')return !evaluate(ast.left,model,env)||evaluate(ast.right,model,env);
  if(op==='ku')return evaluate(ast.left,model,env)===evaluate(ast.right,model,env);
  if(op==='vi'||op==='vu')return op==='vi';
  throw new Error('Evidence, time and questions require a richer model: '+op);
}
if(require.main===module){
  const names={stone:'Proto',ridge:'Ridge labels (Proto)','ridge-alpha':'Old Upland',capitals:'Upland',reed:'Early',seal:'Seal (Early)',classical:'Classical',delta:'Delta',island:'Island',harbor:'Harbor',cord:'Late Harbor'};
  const rows=['# Cognate workbook','', '**LOCAL LANGUAGE DRAFT. Generated by model.cjs; every cell follows the listed ordered rules.**','', '| Meaning | '+stages.map(s=>names[s]).join(' | ')+' |','| --- |'+stages.map(()=>' --- |').join('')];
  for(const e of lexicon)rows.push('| '+e.gloss+' | '+stages.map(s=>reflex(e.proto,s)).join(' | ')+' |');
  rows.push('','Spellings use editor keys: gh = /ɡ/, c = /tʃ/, g = /dʒ/, ş = /ʃ/, ž = /ʒ/, h = /ə/, è = /ɛ/, ò = /ɔ/. {3} is falling tone, not a consonant. Upland h is a reduced final vowel (schwa). Seal-era texts record Early Talar. Proto entries are fictional reconstructions, conventionally starred in running prose.','');
  fs.writeFileSync(path.join(__dirname,'cognates.md'),rows.join('\n'));
}
module.exports={lexicon,stages,early,common,daughter,terminal,oldUpland,upland,late,reflex,roots,parse,logical,evaluate};
