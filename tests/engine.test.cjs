const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../src/engine.js');

test('longest-match digraphs and phonetic aliases',()=>{
  assert.deepEqual(E.tokenize('GH sh zh š ʃ ʒ ɛ ɔ').filter(t=>!['space'].includes(t.type)).map(t=>t.key),['gh','ş','ž','ş','ş','ž','è','ò']);
});
test('vowels attach to the preceding consonant, preserving order',()=>{
  const {items}=E.compose('kai se');
  assert.deepEqual(items[0].vowels,['a','i']);
  assert.deepEqual(items[2].vowels,['e']);
});
test('word-initial vowels and line boundaries do not attach across a word',()=>{
  const {items}=E.compose('ka ima\nu');
  assert.equal(items[2].type,'vowel');assert.equal(items[2].key,'i');
  assert.equal(items.at(-1).type,'vowel');assert.equal(items.at(-1).key,'u');
});
test('unsupported letters stay visible and are reported',()=>{
  const r=E.render('kaq q x');assert.deepEqual(r.unknown,['q','x']);assert.match(r.svg,/>q<\/text>/);assert.match(r.svg,/#a53e29/);
});
test('source text and colors are XML escaped',()=>{
  const r=E.render('<script>alert("x")</script>',{ink:'" onload="alert(1)'});
  assert.ok(!r.svg.includes('<script>'));assert.ok(!r.svg.includes('fill="" onload="'));
});
test('NFC accented vowels and multiple vowels render without loss',()=>{
  assert.deepEqual(E.compose('ke\u0300o').items[0].vowels,['è','o']);
});
test('explicit newlines and word wrapping increase the output height',()=>{
  assert.equal(E.render('ka\nma').lines,2);
  const r=E.render('ka ma na la ra ta'.repeat(10),{width:300});assert.ok(r.lines>10);assert.ok(r.height>1000);
});
test('transparent joins keep real curves and alpha clearances on through rails',()=>{
  const r=E.render('din',{transparent:true});assert.ok(!r.svg.includes('<rect width="100%"'));assert.match(r.svg,/<mask /);assert.ok(!r.svg.includes('fill="#ffffff"'));assert.equal(r.joins[0].continuous,true);
});
test('din connects the upper incoming rail smoothly into n’s lower rail',()=>{
  const r=E.render('din');assert.equal(r.joins.length,1);assert.equal(r.joins[0].flow,'upper-to-lower');assert.equal(r.joins[0].continuous,true);
  assert.deepEqual(r.joins[0].from,r.joins[0].to);assert.match(r.placements[1].paths[0],/^M0 8C12 8 12 24 24 24/);
});
test('all nine inverting letters connect to the correct incoming rail',()=>{
  for(const key of ['g','n','l','s','gh','m','r','z','w']) {
    const r=E.render('di'+key);assert.equal(r.joins[0].toKey,key);assert.equal(r.joins[0].continuous,true,key);
    assert.equal(r.joins[0].flow,['gh','m','r','z'].includes(key)?'lower-to-upper':'upper-to-lower',key);
  }
});
test('unused rails continue through a genuine switch up to its clearance',()=>{
  for(const key of ['g','n','l','s','gh','m','r','z','w']) {
    const r=E.render('di'+key);assert.equal(r.placements[1].throughPaths.length,2,key);
    assert.ok(r.placements[1].throughPaths.includes('M0 8H24'));assert.ok(r.placements[1].throughPaths.includes('M0 24H24'));
  }
  assert.equal(E.render('n').placements[0].throughPaths.length,0);
  assert.equal(E.render('din',{joined:false}).placements[1].throughPaths.length,0);
});
test('inactive switches continue the available rail straight without an S curve',()=>{
  for(const text of ['for','vor','gor']) {
    const r=E.render(text);assert.equal(r.joins[0].flow,'upper-straight',text);assert.equal(r.joins[0].switched,false);assert.equal(r.joins[0].continuous,true);
    assert.match(r.placements[1].paths[0],/^M0 8H/);assert.equal(r.placements[1].throughPaths.length,0);
  }
  for(const text of ['pin','nin','min']) {
    const r=E.render(text);assert.equal(r.joins[0].flow,'lower-straight',text);assert.equal(r.joins[0].switched,false);assert.equal(r.joins[0].continuous,true);
    assert.match(r.placements[1].paths[0],/^M0 24H/);assert.equal(r.placements[1].throughPaths.length,0);
  }
});
test('spacing is fixed at the requested 85 percent even for legacy options',()=>{
  assert.equal(E.defaults.spacing,.85);
  assert.equal(E.render('din').placements[0].width,85);
  assert.equal(E.render('din',{spacing:1.45}).placements[0].width,85);
});
test('square end caps fill both corners and remain inside the advance edge',()=>{
  for(const key of ['ş','ž','s','z'])for(const width of [54.4,100]) {
    const shape=E.cell(key,width,true,'#000');assert.equal(shape.closedCap.x+shape.closedCap.width,width,key);
    assert.equal(shape.closedCap.y,4);assert.equal(shape.closedCap.y+shape.closedCap.height,28);
    assert.match(shape.svg,/data-square-cap="true"/);
    const joined=E.render(key+'n');assert.equal(joined.placements[1].x,joined.placements[0].width);
  }
});
test('word and line boundaries and detached mode do not create rail joins',()=>{
  assert.equal(E.render('di n').joins.length,0);assert.equal(E.render('di\nn').joins.length,0);assert.equal(E.render('din',{joined:false}).joins.length,0);
});
test('outside upper legs remain visible while the lower straight rail connects',()=>{
  for(const key of ['c','p','d','ş','f']) {
    const r=E.render('di'+key),before=r.placements[0],after=r.placements[1];
    assert.match(after.paths[0],/^M0 0Q1 8 12 8/,key);
    assert.ok(after.x>before.x+before.width,key+' interrupts the upper rail');
    assert.equal(after.x-after.entryGap,before.x+before.width,key+' connects the straight lower entry');
    assert.match(after.paths[1],/^M-8 24/,key);
  }
});
test('outside lower legs remain visible while the upper straight rail connects',()=>{
  for(const key of ['k','b','t','ž','v']) {
    const r=E.render('di'+key),before=r.placements[0],after=r.placements[1];
    assert.match(after.paths[1],/^M0 32Q1 24 12 24/,key);
    assert.ok(after.x>before.x+before.width,key+' interrupts the lower rail');
    assert.equal(after.x-after.entryGap,before.x+before.width,key+' connects the straight upper entry');
    assert.match(after.paths[0],/^M-8 8/,key);
  }
});
test('special initial vowels use main-letter stroke weight and full-size outlines',()=>{
  for(const key of ['a','e','è','o','ò','y','i']) {
    const svg=E.initialVowel(key,'#000');assert.match(svg,/stroke-width="8"/);assert.ok(E.initials[key].width>=50);
    assert.ok(!svg.includes('stroke-width="4.2"'));assert.match(E.render(key).svg,/data-initial-vowel/);
  }
});
test('eight optional marks attach through vowels and remain distinct',()=>{
  const shapes=new Set();
  for(let i=1;i<=8;i++){const c=E.compose(`di{${i}}n`);assert.deepEqual(c.items[0].marks,[String(i)]);assert.equal(c.items[1].marks.length,0);const r=E.render(`di{${i}}n`);assert.equal(r.marks,1);assert.match(r.svg,new RegExp(`data-mark="${i}"`));shapes.add(E.mark(String(i),0,0,'#000'));}
  assert.equal(shapes.size,8);
});
test('marks attach to initial vowels and warn when unattached',()=>{
  assert.deepEqual(E.compose('a{5}ma').items[0].marks,['5']);assert.deepEqual(E.render('{1}din').orphanMarks,['{1}']);
});
test('multiple marks on an initial vowel reserve room before the next consonant',()=>{
  const r=E.render('a{1}{2}{3}{4}n',{width:300});assert.equal(r.marks,4);assert.ok(r.placements[0].x>=96);assert.equal(r.lines,1);
});
test('both initial vowel choices exist and change the artwork',()=>{
  assert.notEqual(E.render('ama',{initial:'special'}).svg,E.render('ama',{initial:'inline'}).svg);
  assert.notEqual(E.render('i',{initial:'special'}).svg,E.render('i',{initial:'inline'}).svg);
});
test('layout and guides are bounded and toggleable',()=>{
  assert.equal(E.render('ka',{width:10}).width,300);assert.equal(E.render('ka',{width:5000}).width,2400);
  assert.match(E.render('ka',{guides:true}).svg,/stroke-dasharray/);assert.ok(!E.render('ka').svg.includes('stroke-dasharray'));
});
test('a long vowel cluster remains visible within the page',()=>{
  const r=E.render('k'+'a'.repeat(50));
  assert.equal(r.vowels,50);assert.equal(r.placements.length,1);
  assert.ok(r.placements[0].scale<1);
  assert.ok(r.placements[0].x+r.placements[0].width<=r.width-88+.001);
});
