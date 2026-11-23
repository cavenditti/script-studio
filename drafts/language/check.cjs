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
assert.equal(L.reflex('tuni','classical'),'tyni');assert.equal(L.reflex('loni','delta'),'len');assert.equal(L.reflex('kani','island'),'kani');assert.equal(L.reflex('tja','ridge'),'tsa');assert.equal(L.reflex('tas','delta'),'ta{3}');assert.equal(L.reflex('tja','ridge-alpha'),'sa');assert.equal(L.reflex('tuni','harbor'),'tun');assert.equal(L.reflex('nori','harbor'),'nol');
for(const text of [A,B,N,Z,'fa we pa tyni ta na sara ti na lena','su ni ke pa lœni ta ni pa dar ta na sara ti na lena tu ni','ma pa tyni ta na sara ti na lena','mu mi pa tyni ta mi ti na lena']){L.parse(text);assert.deepEqual(E.render(text).unknown,[]);}
console.log('PASS: 31 roots × 9 stages; distinct Classical roots; scope countermodels; place ordering; rejection of free/shadowed variables and malformed predicates; evidence boundary; script compatibility.');
