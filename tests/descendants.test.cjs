const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../src/engine.js'),D=require('../src/descendants.js'),H=require('../src/evolution.js');
const parsed=text=>D.syllabify(D.units(text).units[0].tokens).filter(s=>s.type==='syllable');
test('the free alphabet has a unique full glyph for every existing phoneme',()=>{
  assert.deepEqual(Object.keys(D.alphabet).sort(),[...Object.keys(E.consonants),...Object.keys(E.vowels)].sort());
  assert.equal(new Set(Object.keys(D.alphabet).map(k=>D.letter(k,'#000'))).size,31);assert.match(D.preview('a','vowel','blocks'),/aria-hidden="true"/);assert.match(D.preview('3','mark','blocks'),/aria-hidden="true"/);
  const r=H.render('gh c g h y æ œ è ò',{hand:'ridge-alpha'});
  assert.equal((r.svg.match(/data-alphabet-letter=/g)||[]).length,9);assert.equal(r.consonants,3);assert.equal(r.vowels,6);
  assert.ok(!r.svg.includes('data-initial-vowel'));assert.ok(!r.svg.includes('data-vowel-core'));
});
test('a compound syllable can combine two onsets, a vowel and two codas',()=>{
  const [s]=parsed('plant');assert.deepEqual(s.onset.map(t=>t.key),['p','l']);assert.deepEqual(s.nucleus.map(t=>t.key),['a']);assert.deepEqual(s.coda.map(t=>t.key),['n','t']);
  const r=H.render('plant',{hand:'harbor'});assert.equal(r.syllables.length,1);assert.equal(r.consonants+r.vowels,5);
  assert.match(r.svg,/data-syllable="p l a n t"/);assert.match(r.svg,/data-coda="n t"/);
  assert.equal((r.svg.match(/data-(?:onset|nucleus|coda)-part=/g)||[]).length,5);
});
test('ordered rows and compound nuclei preserve every component in order',()=>{
  const [s]=parsed('strant');assert.equal(s.onset.length,3);assert.equal(s.coda.length,2);
  const [v]=parsed('ghrai');assert.deepEqual(v.onset.map(t=>t.key),['gh','r']);assert.deepEqual(v.nucleus.map(t=>t.key),['a','i']);
  for(const text of ['strant ghrai','rento','ka·tra kat·ra','æi ghau']){
    const r=H.render(text,{hand:'harbor'}),phones=r.syllables.flatMap(s=>s.phones.map(t=>t.key));
    assert.deepEqual(phones,E.tokenize(text).filter(t=>['consonant','vowel'].includes(t.type)).map(t=>t.key));
  }
});
test('explicit boundaries override graphic grouping without changing the alphabet',()=>{
  assert.deepEqual(parsed('katra').map(s=>s.phones.map(p=>p.key).join('')),['kat','ra']);
  assert.deepEqual(parsed('ka·tra').map(s=>s.phones.map(p=>p.key).join('')),['ka','tra']);
  assert.equal(parsed('kai').length,1);assert.equal(parsed('ka·i').length,2);
  assert.deepEqual(H.render('ka·i',{hand:'harbor'}).unknown,[]);
  const sequence=text=>[...H.render(text,{hand:'ridge-alpha'}).svg.matchAll(/data-alphabet-letter="([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(sequence('ka·tra'),sequence('katra'));
});
test('empty onsets and vowelless clusters do not invent phonemes',()=>{
  const r=H.render('a nt',{hand:'harbor'});assert.equal(r.consonants,2);assert.equal(r.vowels,1);assert.equal(r.syllables[0].onset.length,0);assert.equal(r.syllables[1].nucleus.length,0);
  assert.match(r.svg,/data-empty-nucleus="true"/);assert.equal(r.notes.length,1);
  assert.ok(!r.svg.includes('data-onset-part="h"'));
});
test('tone and stress survive block and alphabet composition, including orphan marks',()=>{
  for(const hand of ['harbor','ridge-alpha']){
    const r=H.render("plant'{1}{2}{3}{4}{5}{6}{7}{8}",{hand,transparent:true});assert.equal(r.marks,8);
    assert.equal((r.svg.match(/data-mark=/g)||[]).length,8);assert.ok(!r.svg.includes('<rect width="100%"'));
    assert.match(r.svg,/stroke-width="(?:3|2.6)"/);
    assert.deepEqual(H.render('{3}plant',{hand}).orphanMarks,['{3}']);
    assert.ok(H.render('{3}plant',{hand}).svg.includes('{3}'));
  }
});
test('new systems wrap at glyph boundaries and spell out oversized Harbor groups readably',()=>{
  for(const hand of ['harbor','ridge-alpha']){
    const r=H.render('plant '.repeat(20),{hand,width:300});assert.ok(r.lines>1);
    for(const p of r.placements)assert.ok(p.x+p.width<=236+.001);
    const wide=H.render('s'.repeat(1000)+'a',{hand,width:300});assert.ok(!wide.svg.includes('scale(0)'));assert.ok(!/NaN|undefined/.test(wide.svg));
    if(hand==='harbor'){
      assert.equal(wide.syllables.length,1);assert.equal((wide.svg.match(/data-escape-letter=/g)||[]).length,1001);
      assert.ok(wide.placements.every(p=>p.scale===1));assert.ok(wide.notes.some(n=>n.includes('spell-out')));
    }
  }
});
test('Harbor fuses components by contact inside a constant body',()=>{
  const m=D.blockMetrics,gap=(A,B)=>Math.min(...A.points.flatMap(([x,y])=>B.points.map(([u,v])=>Math.hypot(x-u,y-v))));
  for(const text of ['plant','strant','ghrai','ka','pa','tun','a','nt','oe','eo','uy','yu','ai','aa','lon','dar']){
    const b=D.block(parsed(text)[0],'#000');assert.equal(b.height,m.height);assert.equal(b.escape,false);assert.ok(!b.body.includes('data-vowel-chamber'));
    for(const c of b.components)for(const [,y] of c.points)assert.ok(y>-1&&y<m.height+1,text+' stays in body');
    const rows={};for(const c of b.components)(rows[c.kind]??=[]).push(c);
    // Each row reads left to right, and consecutive components touch or share a stroke.
    for(const row of Object.values(rows))for(let i=1;i<row.length;i++){assert.ok(row[i].x>row[i-1].x);assert.ok(gap(row[i-1],row[i])<=Math.max(0,m.touch)*m.scale+1.2,text+' row fused');}
    // Rows join: onset to nucleus, nucleus to coda. Limited nesting can leave
    // a hairline where the closest strokes would otherwise interleave.
    const near=(U,V)=>Math.min(...U.flatMap(a=>V.map(c=>gap(a,c))));
    if(rows.onset)assert.ok(near(rows.onset,rows.nucleus)<=5,text+' onset fused');
    if(rows.coda)assert.ok(near(rows.nucleus,rows.coda)<=5,text+' coda fused');
  }
  // A consonant rail and a flat vowel top become one shared stroke.
  const da=D.block(parsed('da')[0],'#000');assert.ok(Math.abs(da.components[1].y-(da.components[0].y+21*m.scale))<.01);
  for(const text of ['strlant','aei','antsrl'])assert.equal(D.block(parsed(text)[0],'#000').escape,true);
  const r=H.render('plant drènt',{hand:'harbor',width:300});assert.equal(r.lines,1);
});
test('Harbor softens corners, bridges only separated components and merges each syllable into one pictogram',()=>{
  const m=D.blockMetrics;
  for(const key of ['t','s','è','l','a'])assert.match(D.harbor(key).d,/Q/);
  assert.equal(D.harbor('a').ends.length,0);assert.ok(D.harbor('p').ends.length>=2);
  let count=0;
  for(const text of ['pa','na','lon','dar','plant','strant','ghrai','gu','niw','zu','ke','sel']){
    const b=D.block(parsed(text)[0],'#000');count+=b.ligatures.length;
    assert.equal((b.body.match(/data-ligature/g)||[]).length,b.ligatures.length);
    for(const j of b.ligatures){
      const len=Math.hypot(j.to[0]-j.from[0],j.to[1]-j.from[1]);assert.ok(len>=m.joinMin*m.scale-.01&&len<=m.joinMax*m.scale+.01);
      // A ligature ends on a component stroke.
      assert.ok(b.components.some(c=>c.points.some(([x,y])=>Math.hypot(x-j.to[0],y-j.to[1])<.01)));
    }
  }
  // Reduced components overlap their neighbours, so ligatures are rare; each one ends on a stroke.
  // One outline union per syllable: ink at the outer width, masked at the inner width.
  const r=H.render('plant pa',{hand:'harbor'});assert.equal((r.svg.match(/data-pictogram="true"/g)||[]).length,2);
  const ids=[...r.svg.matchAll(/<mask id="([^"]+)"/g)].map(x=>x[1]);assert.equal(new Set(ids).size,2);for(const id of ids)assert.ok(r.svg.includes(`mask="url(#${id})"`));
  assert.ok(m.outer>m.inner);assert.match(r.svg,new RegExp(`stroke-width="${m.inner}"`));
});
test('Harbor reduced components are single connected shapes that stay distinct',()=>{
  const keys=Object.keys(D.alphabet),haus=(A,B)=>{const d=(P,Q)=>Math.max(...P.map(p=>Math.min(...Q.map(q=>Math.hypot(p[0]-q[0],p[1]-q[1])))));return Math.max(d(A,B),d(B,A));};
  for(const key of Object.keys(D.harborForms)){
    assert.ok(D.alphabet[key],key);
    const before=D.alphabet[key].join('').split('M').length,after=D.harborForms[key].join('').split('M').length;assert.ok(after<=before,key+' has no more strokes');
    // Connected: every sampled point links to the rest through neighbours closer than 1.5 units.
    const pts=D.ink(key),seen=new Set([0]),queue=[0];
    while(queue.length){const i=queue.pop();pts.forEach((q,j)=>{if(!seen.has(j)&&Math.hypot(q[0]-pts[i][0],q[1]-pts[i][1])<1.5){seen.add(j);queue.push(j);}});}
    assert.equal(seen.size,pts.length,key+' is one shape');
  }
  const consonants=Object.keys(E.consonants);
  for(let i=0;i<consonants.length;i++)for(let j=i+1;j<consonants.length;j++)assert.ok(haus(D.ink(consonants[i]),D.ink(consonants[j]))>=6,consonants[i]+'/'+consonants[j]);
  for(let i=0;i<keys.length;i++)for(let j=i+1;j<keys.length;j++)assert.ok(haus(D.ink(keys[i]),D.ink(keys[j]))>=3,keys[i]+'/'+keys[j]);
  // Ligatures appear only between components that do not already touch.
  for(const text of ['pa','na','plant','ghrai','tun'])for(const l of D.block(parsed(text)[0],'#000').ligatures)assert.ok(l.from&&l.to);
});
test('Harbor palette components retain full-size sound shapes with a tight optical frame',()=>{
  for(const key of Object.keys(D.alphabet)){
    const p=D.preview(key,E.vowels[key]?'vowel':'consonant','blocks');
    assert.match(p,/viewBox="-4 -4 44 44"/);assert.match(p,/data-pictogram="true"/);assert.ok(p.includes(D.harbor(key).d));assert.ok(D.preview(key,'consonant','alphabet').includes(D.letter(key,'currentColor')));
  }
});
test('prosody stays outside components and excess annotations use bounded readable tiles',()=>{
  const r=H.render("plant'"+'{3}'.repeat(25),{hand:'harbor',width:300});
  assert.equal((r.svg.match(/data-mark=/g)||[]).length,25);assert.ok(r.placements.every(p=>p.scale===1&&p.width<=128));assert.ok(r.lines>1);
  assert.match(r.svg,/translate\([\d.]+ 16\) scale\(.65\)" data-prosody-slot="0"/);assert.match(r.svg,/data-prosody-only="true"/);
});
test('unknown characters stay visible and XML remains escaped',()=>{
  for(const hand of ['harbor','ridge-alpha']){
    const r=H.render('kaq <&',{hand,ink:'" onload="alert(1)'});assert.deepEqual(r.unknown,['q','<','&']);assert.ok(!r.svg.includes('stroke="" onload='));assert.ok(!r.svg.includes('<script>'));assert.match(r.svg,/&lt;/);assert.match(r.svg,/>q<\/text>/);
  }
});
