const assert=require('node:assert/strict');
const L=require('./model.cjs'),H=require('../../src/evolution.js'),E=require('../../src/engine.js');
const A='ru mi ki pa tun ta mi su ni ke pa lœni ta ni pa tyni ta mi ti ni';
const B='su ni ke pa lœni ta ni ru mi ki pa tun ta mi pa tyni ta mi ti ni';
const N='no '+A;
const Z='ru mi ki pa tun ta mi no su ni ke pa lœni ta ni pa tyni ta mi ti ni';
const model={domain:['sara','lena','r1','r2'],predicates:{tun:[['sara'],['lena']],lœni:[['r1'],['r2']],tyni:[['sara','r1'],['lena','r2']]}};
assert.equal(L.evaluate(L.parse(A),model),true);assert.equal(L.evaluate(L.parse(B),model),false);
const partial={...model,predicates:{...model.predicates,tyni:[['sara','r1']]}};
assert.equal(L.evaluate(L.parse(N),partial),true);assert.equal(L.evaluate(L.parse(Z),partial),false);
assert.deepEqual(L.parse('pa tyni ta na sara ti na lena'),L.parse('pa tyni ti na lena ta na sara'));
for(const bad of ['pa tyni ta mi ti na lena','pa tyni ta na sara ta na lena','pa dar ta na sara ti na lena','ru mi ru mi pa tun ta mi','pa tun ta na sara extra'])assert.throws(()=>L.parse(bad));
assert.throws(()=>L.evaluate(L.parse('we pa tun ta na sara'),model),/richer model/);
assert.deepEqual([...L.stages].sort(),H.profiles.map(p=>p.id).sort());
assert.equal(L.lexicon.length,31);assert.equal(L.roots.size,31);
for(const entry of L.lexicon){assert.equal(entry.places.length,entry.arity);for(const stage of L.stages){const form=L.reflex(entry.proto,stage);assert.ok(form);assert.deepEqual(E.render(form).unknown,[],form);}}
assert.equal(L.reflex('tuni','classical'),'tyni');assert.equal(L.reflex('loni','delta'),'len');assert.equal(L.reflex('kani','island'),'kani');assert.equal(L.reflex('tja','ridge'),'tja');assert.equal(L.reflex('waro','ridge-alpha'),'varo');assert.equal(L.reflex('tuni','capitals'),'tunh');assert.equal(L.reflex('tas','delta'),'ta{3}');assert.equal(L.reflex('tuni','harbor'),'tun');assert.equal(L.reflex('nori','harbor'),'nol');
for(const text of [A,B,N,Z,'fa we pa tyni ta na sara ti na lena','su ni ke pa lœni ta ni pa dar ta na sara ti na lena tu ni','ma pa tyni ta na sara ti na lena','mu mi pa tyni ta mi ti na lena']){L.parse(text);assert.deepEqual(E.render(text).unknown,[]);}
const T=require('./typology.cjs');
// Same truth value on many random finite models: the Island word and the Classical formula make the same promise.
const preds={tun:1,lœni:1,tyni:2,dar:3};const people=['sara','lena','e1','e2'];
function randomModel(seed){let x=seed;const r=()=>(x=(x*1103515245+12345)%2147483648)/2147483648;const P={};for(const [k,n] of Object.entries(preds)){P[k]=[];const tuples=n===1?people.map(a=>[a]):n===2?people.flatMap(a=>people.map(b=>[a,b])):people.flatMap(a=>people.flatMap(b=>people.map(c=>[a,b,c])));for(const t of tuples)if(r()<(n===3?.08:.4))P[k].push(t);}return {domain:people,predicates:P};}
const same=(a,b)=>{for(let s=1;s<=300;s++){const m=randomModel(s);if(L.evaluate(a,m)!==L.evaluate(b,m))return false;}return true;};
const one=text=>{const r=T.parseIsland(text);assert.equal(r.length,1,text);return r[0];};
for(const [isl,cls] of [['rutunta lontuni',A],['sulonti rutunta tuni',B],['no rutunta lontuni',N],['rutunta lontuniwu',Z],['nasarata nalenati londar','su ni ke pa lœni ta ni pa dar ta na sara ti na lena tu ni'],['nalenati nasarata tuni','pa tyni ta na sara ti na lena']])assert.ok(same(one(isl),L.parse(cls)),isl);
assert.ok(!same(one('rutunta lontuni'),one('sulonti rutunta tuni')));
assert.equal(L.logical(one('rutunta lontuni')),L.logical(L.parse(A)));
assert.equal(L.logical(one('nasarata nalenati tuniwe')),L.logical(L.parse('we pa tyni ta na sara ti na lena')));
assert.equal(L.logical(one('ma nasarata nalenati tunitewa')),L.logical(L.parse('ma wa te pa tyni ta na sara ti na lena')));
assert.equal(T.parseIsland('nasarata şa').length,2);
for(const bad of ['nasarata tuni','nasarata nasarati lontuni','rutunta tuni','nasara tuni','rutuniti nalenata tuni'])assert.throws(()=>T.parseIsland(bad),bad);
// Old Upland (Ridge Alphabet): positional places, free invariant operators.
assert.equal(L.logical(T.parseMarket('ru mi ki tun mi su ni ke loni ni tuni mi ni')),L.logical(L.parse(A)));
assert.equal(L.logical(T.parseMarket('tuni na sara na lena')),L.logical(L.parse('pa tyni ta na sara ti na lena')));
assert.equal(T.parseMarket('ner na sara').root,'nèr');assert.equal(T.parseMarket('nori na sara na lena').root,'nœri');
for(const bad of ['tuni na sara','tuni mi na lena','ru mi ru mi tun mi'])assert.throws(()=>T.parseMarket(bad),bad);
// Delta ribbons: segmentation recovers words; the known clash is reported, not hidden.
assert.deepEqual(T.segmentDelta(T.joinDelta('sara tin lena'),['sara','lena']),[['sara','tin','lena']]);
assert.equal(T.segmentDelta('saravunalena',['sara','lena']).length,2);
// Harbor fusion from Island words.
assert.equal(T.harborWord([{text:'tuni'}]),'tun');assert.equal(T.harborWord([{text:'tuni'},{text:'we',suffix:true}]),'tuniw');
assert.equal(T.harborWord([{text:'tuni'},{text:'te',suffix:true},{text:'we',suffix:true}]),'tunitew');assert.equal(T.harborWord([{text:'lon'},{text:'dar'}]),'londal');
assert.deepEqual(T.varieties.map(v=>v.id).sort(),[...L.stages].sort());
for(const text of ['patunitanasaratinalena','saratinlena','nasarata nalenati tuniwe','rutunta lontuniwe','tuni na sara na lena','nasarata nalenati tuniw'])assert.deepEqual(E.render(text).unknown,[],text);
// The app's philology panel must agree with the model.
const Ph=require('../../src/philology.js'),Hv=require('../../src/evolution.js');
assert.deepEqual(Object.keys(Ph.stages).sort(),[...L.stages].sort());
for(const stage of L.stages){
  const st=Ph.stages[stage];
  Ph.meanings.forEach((meaning,i)=>assert.equal(st.cognates[i],L.reflex(L.lexicon.find(e=>e.gloss===meaning).proto,stage),stage+' '+meaning));
  for(const ex of st.examples){
    assert.deepEqual(Hv.render(ex.text,{hand:stage}).unknown,[],stage+': '+ex.text);
    if(stage==='classical')L.parse(ex.text);
    if(stage==='island')assert.equal(T.parseIsland(ex.text).length,1,ex.text);
    if(stage==='ridge-alpha')T.parseMarket(ex.text);
    if(stage==='delta')assert.equal(T.segmentDelta(ex.text,['sara','lena']).length,1,ex.text);
  }
}
console.log('PASS: 31 roots × 11 stages; distinct Classical roots; scope countermodels; place ordering; rejection of free/shadowed variables and malformed predicates; evidence boundary; script compatibility; Island and Old Upland equivalence to Classical on 300 random models; Delta segmentation; Harbor fusion; app philology panel agrees with the model.');
