/* Design aid for Harbor's reduced components. Not part of the build.
   For each consonant with a detached secondary stroke it tries: keep, drop the
   stroke (never the stem-bearing one) or join it with an axis-aligned bridge,
   and greedily accepts the simplest change that keeps every component at least
   T units (Hausdorff, softened centrelines) from every other one.
   node scripts/derive-harbor-forms.cjs [T=6]
   The result seeded harborForms in src/descendants.js; l, r and w were then
   tidied by hand. It reads the original alphabet, so run it against that. */
// Measure against the original forms, not the current reduced ones.
const D0=require('../src/descendants.js');for(const k of Object.keys(D0.harborForms))delete D0.harborForms[k];
const D=require('../src/descendants.js');
const keys=Object.keys(D.alphabet);let tmpN=0;
const inkOf=paths=>{const k='__t'+(tmpN++);D.alphabet[k]=paths;const p=D.ink(k);return p;};
const split=paths=>paths.flatMap(d=>d.split(/(?=M)/));
// connected groups of subpaths
function groups(subs){const sets=subs.map(d=>inkOf([d]));const par=subs.map((_,i)=>i),f=i=>par[i]===i?i:(par[i]=f(par[i]));
  for(let i=0;i<subs.length;i++)for(let j=i+1;j<subs.length;j++){outer:for(const a of sets[i])for(const b of sets[j])if(Math.hypot(a[0]-b[0],a[1]-b[1])<1.5){par[f(i)]=f(j);break outer;}}
  const g={};subs.forEach((d,i)=>(g[f(i)]??=[]).push(d));return Object.values(g);}
const ends=d=>{const nums=d.match(/-?\d*\.?\d+/g).map(Number);const cmds=d.match(/[A-Z]/g);
  // compute start and end points by walking
  let x=0,y=0,i=0,start=null;for(const c of d.match(/[A-Z][^A-Z]*/g)){const v=(c.slice(1).match(/-?\d*\.?\d+/g)||[]).map(Number);
   if(c[0]==='M'){x=v[0];y=v[1];start=[x,y];}else if(c[0]==='H')x=v.at(-1);else if(c[0]==='V')y=v.at(-1);else {x=v.at(-2);y=v.at(-1);} }
  return [start,[x,y]];};
// axis-aligned bridges from an end of group A to group B
function bridges(A,B){const pb=inkOf(B),out=[];
  for(const d of A)for(const e of ends(d)){
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){let best=null;
      for(const q of pb){const along=(q[0]-e[0])*dx+(q[1]-e[1])*dy,off=Math.abs((q[0]-e[0])*dy-(q[1]-e[1])*dx);if(along>1&&off<.8&&(!best||along<best))best=along;}
      if(best&&best<=22)out.push({d:`M${e[0]} ${e[1]}L${+(e[0]+dx*best).toFixed(1)} ${+(e[1]+dy*best).toFixed(1)}`,len:best});}}
  return out;}
const haus=(A,B)=>{const d=(P,Q)=>{let m=0;for(const p of P){let b=Infinity;for(const q of Q){const t=Math.hypot(p[0]-q[0],p[1]-q[1]);if(t<b)b=t;}if(b>m)m=b;}return m;};return Math.max(d(A,B),d(B,A));};
const cands={};
for(const k of keys){
  const subs=split(D.alphabet[k]),gs=groups(subs),list=[{paths:subs,pieces:gs.length,note:'keep',len:0}];
  if(gs.length>1&&k!=='i'){
    for(let i=0;i<gs.length;i++){if(inkOf(gs[i]).some(q=>q[1]<2||q[1]>34))continue;const rest=gs.filter((_,j)=>j!==i).flat();list.push({paths:rest,pieces:gs.length-1,note:'drop '+gs[i].join(''),len:inkOf(gs[i]).length});}
    if(gs.length===2)for(const [A,B] of [[gs[0],gs[1]],[gs[1],gs[0]]])for(const b of bridges(A,B).sort((x,y)=>x.len-y.len).slice(0,4))list.push({paths:[...subs,b.d],pieces:1,note:'bridge '+b.d,len:1000+b.len});
  }
  for(const c of list){c.ink=inkOf(c.paths);if(k==='i')for(let t=0;t<12;t++)c.ink.push([17+2.8*Math.cos(t*Math.PI/6),15+2.8*Math.sin(t*Math.PI/6)]);}
  cands[k]=list;
}
// Search: minimise pieces, then prefer bridge over drop over keep? prefer fewer pieces, then shorter added length, keep distinctness >= T
const T=Number(process.argv[2]||6);
const order=keys.slice().sort((a,b)=>cands[b].length-cands[a].length);
for(const k of keys)cands[k].sort((a,b)=>a.pieces-b.pieces||a.len-b.len);
const choice={};let best=null,bestScore=Infinity,steps=0;
const cache=new Map();const dist=(a,b)=>{const key=a.id+'|'+b.id;if(!cache.has(key))cache.set(key,haus(a.ink,b.ink));return cache.get(key);};
let id=0;for(const k of keys)for(const c of cands[k])c.id=id++;
const lb=i=>order.slice(i).reduce((s,k)=>s+cands[k][0].pieces,0);
function go(i,score){if(++steps>2e6)return;if(score+lb(i)>=bestScore)return;
  if(i===order.length){bestScore=score;best={...choice};return;}
  const k=order[i];
  for(const c of cands[k]){let ok=true;for(const [k2,c2] of Object.entries(choice))if(dist(c,c2)<T){ok=false;break;}
    if(!ok)continue;choice[k]=c;go(i+1,score+c.pieces);delete choice[k];}}
best={};for(const k of keys)best[k]=cands[k].find(c=>c.note==='keep');
for(let round=0;round<3;round++)for(const k of keys){for(const c of cands[k]){if(c.pieces>=best[k].pieces&&c!==best[k])continue;const bad=keys.filter(k2=>k2!==k&&dist(c,best[k2])<T);if(!bad.length){best[k]=c;break;}else if(process.env.V)console.log('reject',k,c.note,bad.map(b=>b+':'+dist(c,best[b]).toFixed(1)).join(','));}}
bestScore=keys.reduce((s,k)=>s+best[k].pieces,0);
console.log('T',T,'pieces',bestScore,'steps',steps);
const out={};for(const k of keys){const c=best[k];out[k]=c.paths;if(c.note!=='keep')console.log(k,c.note);}
console.log(JSON.stringify(out));
let m=Infinity,mp='';for(let i=0;i<keys.length;i++)for(let j=i+1;j<keys.length;j++){const d=dist(best[keys[i]],best[keys[j]]);if(d<m){m=d;mp=keys[i]+'/'+keys[j];}}console.log('min distance',m.toFixed(2),mp);
