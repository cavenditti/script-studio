const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../src/engine.js'),H=require('../src/evolution.js');
const specimen="din rento' ghma n{1} p{2} s{3} r{4} w{5} z{6} m{7} l{8}\nè ò y i";
test('classical and legacy settings preserve the original renderer exactly',()=>{
  for(const options of [{},{hand:'classical',transparent:true},{hand:'unknown',joined:false}])assert.equal(H.render(specimen,options).svg,E.render(specimen,options).svg);
});
test('genealogy is rooted and acyclic; borrowings are separate from descent',()=>{
  const ids=new Set(H.profiles.map(p=>p.id));assert.equal(ids.size,12);
  assert.equal(H.profiles.filter(p=>p.parent===null).length,1);
  for(const p of H.profiles){let current=p;const ancestors=new Set();while(current.parent){assert.ok(ids.has(current.parent));assert.ok(!ancestors.has(current.id));ancestors.add(current.id);current=H.get(current.parent);}for(const id of p.influences||[])assert.ok(ids.has(id));}
  assert.equal(H.get('civic').parent,'delta');assert.equal(H.get('capitals').parent,'stone');assert.equal(H.get('reed').parent,'stone');assert.equal(H.get('seal').parent,'reed');assert.equal(H.get('harbor').parent,'seal');assert.ok(H.get('harbor').influences.includes('island'));assert.equal(H.get('roundel').parent,'harbor');assert.deepEqual(H.get('civic').influences,['ridge','island']);
});
test('every historical hand retains letters, vowels, prosody and source text',()=>{
  const results=new Set();
  for(const p of H.profiles){const r=H.render(specimen,{hand:p.id,transparent:true});results.add(r.svg);assert.equal(r.consonants,15);assert.equal(r.vowels,8);assert.equal(r.marks,8);assert.deepEqual(r.unknown,[]);assert.ok(!/NaN|undefined/.test(r.svg));assert.ok(!r.svg.includes('<rect width="100%"'));for(let i=1;i<=8;i++)assert.match(r.svg,new RegExp(`data-mark="${i}"`));}
  assert.equal(results.size,12);
});
test('isolating traditions break joins; cursive descendants retain continuous rails',()=>{
  for(const hand of ['stone','reed','ridge'])assert.equal(H.render('nt',{hand}).joins.length,0);
  for(const hand of ['classical','delta','island','civic'])assert.match(H.render('nt',{hand}).svg,/data-branch-rail="lower"/);
  for(const hand of ['classical','delta','island','civic'])assert.equal(H.render('din',{hand}).joins[0].continuous,true);
});
test('historical allographs change returns and marks, preserving carrier dot position',()=>{
  // Stone is cut straight: no curve commands, square tool ends, a diamond dot on i.
  for(const key of ['g','n','m','a','u','y'])assert.ok(!/[QC]/.test(H.preview(key,key.length&&E.vowels[key]?'vowel':'consonant','stone').match(/d="([^"]*)"/)[1]),key);
  assert.match(H.preview('i','vowel','stone'),/stroke-linecap="square"/);assert.match(H.preview('i','vowel','stone'),/M17 11L21 15L17 19L13 15Z/);
  assert.match(H.render('pa',{hand:'stone'}).svg,/data-raised-vowel="a"/);assert.ok(!H.render('a',{hand:'stone'}).svg.includes('data-raised-vowel'));
  // Upland Capitals: every sound is a single unbranched stroke.
  for(const key of [...Object.keys(E.consonants),...Object.keys(E.vowels)]){const d=[...H.preview(key,E.vowels[key]?'vowel':'consonant','capitals').matchAll(/ d="([^"]*)"/g)].map(m=>m[1]);assert.equal(d.length,1,key);assert.equal((d[0].match(/M/g)||[]).length,1,key);}
  // Reed Seals keep the two-rail chamber; Roundels draw circles and ideograms.
  assert.match(H.render('plant',{hand:'seal'}).svg,/data-seal-chamber="true"/);
  const ro=H.render('pa #tun #we #zan',{hand:'roundel'});assert.match(ro.svg,/data-roundel="true"/);assert.equal((ro.svg.match(/data-ideogram-word=/g)||[]).length,2);assert.deepEqual(ro.unknown,['#']);
  assert.deepEqual(H.render('#tun lon',{hand:'roundel'}).unknown,[]);
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
