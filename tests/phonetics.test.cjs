const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../src/engine.js'),P=require('../src/phonetics.js');

test('phonetic groups retain every consonant and vowel exactly once',()=>{
  for(const [kind,symbols] of [['consonant',E.consonants],['vowel',E.vowels]]){
    const keys=P.groups[kind].flatMap(group=>group.keys);
    assert.equal(new Set(keys).size,keys.length);
    assert.deepEqual([...keys].sort(),Object.keys(symbols).sort());
    for(const key of keys)assert.ok(P.sounds[key]);
  }
});
test('confirmed IPA values use their sound groups',()=>{
  assert.equal(P.sounds.h.ipa,'ə');assert.equal(P.sounds.y.ipa,'y');
  assert.equal(P.sounds.c.ipa,'tʃ');assert.equal(P.sounds.g.ipa,'dʒ');assert.equal(P.sounds.gh.ipa,'ɡ');
  assert.deepEqual(P.groups.consonant.find(group=>group.label==='Affricates').keys,['c','g']);
  assert.ok(P.groups.consonant.find(group=>group.label==='Stops').keys.includes('gh'));
  assert.ok(P.groups.vowel.find(group=>group.label==='High').keys.includes('y'));assert.ok(P.groups.vowel.find(group=>group.label==='Mid').keys.includes('h'));
  assert.equal(P.sounds['ş'].ipa,'ʃ');assert.equal(P.sounds['ž'].ipa,'ʒ');assert.equal(P.sounds['è'].ipa,'ɛ');assert.equal(P.sounds['ò'].ipa,'ɔ');
});
