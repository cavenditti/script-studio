const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../src/engine.js'),H=require('../src/evolution.js');
const specimen="din rento' ghma n{1} p{2} s{3} r{4} w{5} z{6} m{7} l{8}\nè ò y i";
test('classical and legacy settings preserve the original renderer exactly',()=>{
  for(const options of [{},{hand:'classical',transparent:true},{hand:'unknown',joined:false}])assert.equal(H.render(specimen,options).svg,E.render(specimen,options).svg);
});
test('genealogy is rooted and acyclic; borrowings are separate from descent',()=>{
  const ids=new Set(H.profiles.map(p=>p.id));assert.equal(ids.size,9);
  assert.equal(H.profiles.filter(p=>p.parent===null).length,1);
  for(const p of H.profiles){let current=p;const ancestors=new Set();while(current.parent){assert.ok(ids.has(current.parent));assert.ok(!ancestors.has(current.id));ancestors.add(current.id);current=H.get(current.parent);}for(const id of p.influences||[])assert.ok(ids.has(id));}
  assert.equal(H.get('civic').parent,'delta');assert.deepEqual(H.get('civic').influences,['ridge','island']);
});
test('every historical hand retains letters, vowels, prosody and source text',()=>{
  const results=new Set();
  for(const p of H.profiles){const r=H.render(specimen,{hand:p.id,transparent:true});results.add(r.svg);assert.equal(r.consonants,15);assert.equal(r.vowels,8);assert.equal(r.marks,8);assert.deepEqual(r.unknown,[]);assert.ok(!/NaN|undefined/.test(r.svg));assert.ok(!r.svg.includes('<rect width="100%"'));for(let i=1;i<=8;i++)assert.match(r.svg,new RegExp(`data-mark="${i}"`));}
  assert.equal(results.size,9);
});
test('isolating traditions break joins; cursive descendants retain continuous rails',()=>{
  for(const hand of ['stone','reed','ridge'])assert.equal(H.render('nt',{hand}).joins.length,0);
  for(const hand of ['classical','delta','island','civic'])assert.match(H.render('nt',{hand}).svg,/data-branch-rail="lower"/);
  for(const hand of ['classical','delta','island','civic'])assert.equal(H.render('din',{hand}).joins[0].continuous,true);
});
test('historical allographs change returns and marks, preserving carrier dot position',()=>{
  assert.match(H.preview('i','initial','stone'),/translate\(34 16\)/);
  assert.ok(!/<path[^>]*\bcx=/.test(H.preview('i','initial','stone')));
  assert.match(H.preview('u','vowel','delta'),/<ellipse/);
  assert.match(H.render('s',{hand:'island'}).svg,/data-historical-cap="rounded"/);
  assert.notEqual(H.preview('p','consonant','delta'),H.preview('p','consonant','classical'));
  for(const p of H.profiles)for(const key of Object.keys(E.consonants))assert.ok(H.preview(key,'consonant',p.id).includes('<path'));
});

test('embedded historical specimens isolate their mask references',()=>{
  const first=H.render('din',{hand:'civic',idPrefix:'one',transparent:true}).svg;
  const second=H.render('din',{hand:'classical',idPrefix:'two',transparent:true}).svg;
  assert.match(first,/id="one-through-1"/);assert.match(first,/url\(#one-through-1\)/);assert.match(second,/id="two-through-1"/);
  assert.ok(!first.includes('url(#through-'));assert.ok(!second.includes('url(#through-'));
});
