const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../src/engine.js'),H=require('../src/evolution.js');
const specimen="din rento' ghma n{1} p{2} s{3} r{4} w{5} z{6} m{7} l{8}\nè ò y i";
test('classical and legacy settings preserve the original renderer exactly',()=>{
  for(const options of [{},{hand:'classical',transparent:true},{hand:'unknown',joined:false}])assert.equal(H.render(specimen,options).svg,E.render(specimen,options).svg);
});
test('genealogy is rooted and acyclic; borrowings are separate from descent',()=>{
  const ids=new Set(H.profiles.map(p=>p.id));assert.equal(ids.size,11);
  assert.equal(H.profiles.filter(p=>p.parent===null).length,1);
  for(const p of H.profiles){let current=p;const ancestors=new Set();while(current.parent){assert.ok(ids.has(current.parent));assert.ok(!ancestors.has(current.id));ancestors.add(current.id);current=H.get(current.parent);}for(const id of p.influences||[])assert.ok(ids.has(id));}
  assert.ok(!H.profiles.some(p=>p.id==='civic'));assert.equal(H.get('ridge').parent,'stone');assert.equal(H.get('ridge-alpha').parent,'stone');assert.equal(H.get('capitals').parent,'ridge-alpha');assert.equal(H.get('reed').parent,'ridge');assert.equal(H.get('classical').parent,'reed');assert.deepEqual(H.get('island').influences,['harbor']);assert.equal(H.get('seal').parent,'reed');assert.equal(H.get('harbor').parent,'seal');assert.deepEqual(H.get('harbor').influences,['ridge-alpha']);assert.equal(H.get('cord').parent,'harbor');assert.equal(H.get('cord').name,'Tidecord');
});
test('every historical hand retains letters, vowels, prosody and source text',()=>{
  const results=new Set();
  for(const p of H.profiles){const r=H.render(specimen,{hand:p.id,transparent:true});results.add(r.svg);assert.equal(r.consonants,15);assert.equal(r.vowels,8);assert.equal(r.marks,8);assert.deepEqual(r.unknown,[]);assert.ok(!/NaN|undefined/.test(r.svg));assert.ok(!r.svg.includes('<rect width="100%"'));for(let i=1;i<=8;i++)assert.match(r.svg,new RegExp(`data-mark="${i}"`));}
  assert.equal(results.size,11);
});
test('isolating traditions break joins; cursive descendants retain continuous rails',()=>{
  for(const hand of ['stone','reed','ridge'])assert.equal(H.render('nt',{hand}).joins.length,0);
  for(const hand of ['classical','delta','island'])assert.match(H.render('nt',{hand}).svg,/data-branch-rail="lower"/);
  for(const hand of ['classical','delta','island'])assert.equal(H.render('din',{hand}).joins[0].continuous,true);
  // Delta is a slanted cursive with word-final exit strokes; Island sets Harbor vowel shapes over the ribbon.
  const delta=H.render('sara tin',{hand:'delta'}).svg;assert.match(delta,/skewX\(-20\)/);assert.equal((delta.match(/data-cursive-exit="true"/g)||[]).length,2);
  const island=H.render('sara tini lœnu',{hand:'island'});assert.equal((island.svg.match(/data-harbor-vowel=/g)||[]).length,6);assert.ok(!island.svg.includes(' hd="'));assert.match(island.svg,/data-branch-rail|data-letter/);
});
test('historical allographs change returns and marks, preserving carrier dot position',()=>{
  // Stone is cut straight: no curve commands, square tool ends, a diamond dot on i.
  for(const key of ['g','n','m','a','u','y'])assert.ok(!/[QC]/.test(H.preview(key,key.length&&E.vowels[key]?'vowel':'consonant','stone').match(/d="([^"]*)"/)[1]),key);
  assert.match(H.preview('i','vowel','stone'),/stroke-linecap="square"/);assert.match(H.preview('i','vowel','stone'),/M17 11L21 15L17 19L13 15Z/);
  assert.match(H.render('pa',{hand:'stone'}).svg,/data-raised-vowel="a"/);assert.ok(!H.render('a',{hand:'stone'}).svg.includes('data-raised-vowel'));
  // Upland Capitals: every sound is a single unbranched stroke.
  for(const key of [...Object.keys(E.consonants),...Object.keys(E.vowels)]){const d=[...H.preview(key,E.vowels[key]?'vowel':'consonant','capitals').matchAll(/ d="([^"]*)"/g)].map(m=>m[1]);assert.equal(d.length,1,key);assert.equal((d[0].match(/M/g)||[]).length,1,key);}
  // Reed Seals keep the two-rail chamber; Tidecord hangs syllables from a word cord.
  assert.match(H.render('plant',{hand:'seal'}).svg,/data-seal-chamber="true"/);
  const ro=H.render('pa #tun #we #zan',{hand:'cord'});assert.match(ro.svg,/data-cord="true"/);assert.equal((ro.svg.match(/data-ideogram-word=/g)||[]).length,2);assert.equal((ro.svg.match(/data-knot="true"/g)||[]).length,2);assert.ok(!/A22 22/.test(ro.svg),'no roundel circles');assert.deepEqual(ro.unknown,['#']);
  // One bead per vowel; onsets hang below the cord, codas stand above it.
  const tn=H.render('tun',{hand:'cord'});assert.equal((tn.svg.match(/data-bead="true"/g)||[]).length,1);assert.match(tn.svg,/data-onset-part="t" data-cord-stroke="hanging"/);assert.match(tn.svg,/data-coda-part="n" data-cord-stroke="standing"/);
  assert.equal((H.render('kai',{hand:'cord'}).svg.match(/data-bead="true"/g)||[]).length,2);assert.match(H.render('st',{hand:'cord'}).svg,/data-empty-nucleus="true"/);
  // Cells of one word touch, so the cord runs unbroken through the word.
  const sa=H.render('sara',{hand:'cord'}),cx=[...sa.svg.matchAll(/<path d="M(-?[\d.]+) 30H([\d.]+)"[^>]*data-cord="true"/g)].map(m=>[Number(m[1]),Number(m[2])]);assert.equal(cx.length,2);assert.ok(Math.abs(sa.placements[0].x+cx[0][1]-(sa.placements[1].x+cx[1][0]))<.01);
  assert.deepEqual(H.render('#tun lon',{hand:'cord'}).unknown,[]);
  assert.match(H.preview('u','vowel','delta'),/<ellipse/);
  assert.match(H.render('s',{hand:'island'}).svg,/data-historical-cap="rounded"/);
  assert.notEqual(H.preview('p','consonant','delta'),H.preview('p','consonant','classical'));
  for(const p of H.profiles)for(const key of Object.keys(E.consonants))assert.ok(H.preview(key,'consonant',p.id).includes('<path'));
});

test('embedded historical specimens isolate their mask references',()=>{
  const first=H.render('din',{hand:'delta',idPrefix:'one',transparent:true}).svg;
  const second=H.render('din',{hand:'classical',idPrefix:'two',transparent:true}).svg;
  assert.match(first,/id="one-through-1"/);assert.match(first,/url\(#one-through-1\)/);assert.match(second,/id="two-through-1"/);
  assert.ok(!first.includes('url(#through-'));assert.ok(!second.includes('url(#through-'));
});
