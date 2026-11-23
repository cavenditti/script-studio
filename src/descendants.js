/* Structural descendants of the Two-Rail tradition. Script geometry only; the language lives in philology.js. */
(function(root){
  'use strict';
  const E=typeof module==='object'&&module.exports?require('./engine.js'):root.ScriptEngine;
  const alphabet={
    j:['M28 6H11C0 6 0 29 11 29H23V20'],
    c:['M5 1V8H29','M8 28H18Q27 28 27 18'],
    p:['M5 1V8H19Q28 8 28 18','M8 28H30'],
    d:['M6 1V28M6 8H29M6 28H29'],
    'ş':['M5 1V8H28V28H8'],
    k:['M8 8H30','M5 35V28H18Q27 28 27 18'],
    b:['M8 8H19Q28 8 28 18','M5 35V28H30'],
    t:['M6 35V8H29M6 28H29'],
    'ž':['M8 8H28V28H5V35'],
    g:['M5 1V21Q5 29 13 29H19Q27 29 27 19','M16 8H30'],
    n:['M5 1V21Q5 29 13 29H30','M16 8H20Q28 8 28 18'],
    l:['M5 1V29H29M16 8H29'],
    s:['M5 1V29H28V8H16'],
    gh:['M5 35V16Q5 8 13 8H30','M15 28H20Q28 28 28 18'],
    m:['M5 35V16Q5 8 13 8H20Q28 8 28 18','M16 28H30'],
    r:['M5 35V8H29M16 28H29'],
    z:['M5 35V8H28V29H16'],
    f:['M5 1V8H30','M8 28H20V8'],
    v:['M8 8H30','M5 35V28H20V8'],
    w:['M5 1V29H30','M16 8H25V23'],
    a:['M7 29V7H17Q30 7 30 18Q30 29 17 29Z'],
    e:['M29 35V6H7V14Q7 25 22 25'],
    'è':['M7 7H29V29H7V19'],
    o:['M29 7H17Q7 7 7 21V29H29'],
    'ò':['M7 18V7H18Q29 7 29 18Q29 29 18 29H7'],
    y:['M18 17V6H6V22Q6 32 17 32Q27 32 30 21'],
    i:['M28 6H11C0 6 0 29 11 29H23V20'],
    u:['M28 18C28 5 6 5 6 18C6 31 28 31 28 18Z'],
    'æ':['M4 30L11 12H25L31 4'],
    'œ':['M5 6V29H16V11H31'],
    h:['M27 7C5-1 2 36 27 29']
  };
  // Harbor's reduced components. Each consonant keeps the stroke that carries
  // its stem; a detached secondary stroke is dropped where the letter stays
  // distinct without it, or joined into the stem stroke where it does not.
  // Every component is therefore one connected shape (i keeps its dot).
  // Derived with scripts/derive-harbor-forms.cjs, then l, r and w tidied by hand.
  const harborForms={
    c:['M5 1V8H29'],
    p:['M5 1V8H19Q28 8 28 18'],
    k:['M5 35V28H18Q27 28 27 18'],
    b:['M5 35V28H30'],
    g:['M5 1V21Q5 29 13 29H19Q27 29 27 19'],
    n:['M5 1V21Q5 29 13 29H30'],
    l:['M5 1V29H29','M16 29V8'],
    gh:['M5 35V16Q5 8 13 8H30'],
    m:['M5 35V16Q5 8 13 8H20Q28 8 28 18'],
    r:['M5 35V8H29','M16 8V28'],
    w:['M5 1V29H29V8']
  };
  // Cluster signs. Inside a consonant cluster every consonant is written as one
  // unbranched stroke, so a cluster reads as a collection of single strokes.
  // Each keeps the stem direction and a trace of its letter; all twenty stay at
  // least 7 letter units apart.
  const harborStrokes={
    j:'M28 6H11C0 6 0 29 11 29H23V20',c:'M5 1V8H29',p:'M5 1V8H19Q28 8 28 18',d:'M29 8H6V28',
    'ş':'M5 1V8H28V28H8',k:'M5 35V28H18Q27 28 27 18',b:'M5 35V28H30',t:'M29 28H6V8H29',
    'ž':'M8 8H28V28H5V35',g:'M5 1V21Q5 29 13 29H19Q27 29 27 19',n:'M5 1V21Q5 29 13 29H30',
    l:'M5 1V29H16V8',s:'M5 1V29H28V8H16',gh:'M5 35V16Q5 8 13 8H30',m:'M5 35V16Q5 8 13 8H20Q28 8 28 18',
    r:'M5 35V8H16V28',z:'M5 35V8H28V29H16',f:'M5 1V8H20V28H8',v:'M5 35V28H20V8H30',w:'M5 1V29H29V8'
  };
  // Closed vowel outlines keep tighter corners so a stays distinct from u.
  const softenRadius={a:3};
  // The Harbor reform borrows the alphabet's sound forms, not its linear layout.
  // Components keep one constant scale and fuse by contact: each joins the
  // previous one in its row where their strokes first meet, and each row joins
  // the row above the same way. Shared rails become one stroke.
  const blockMetrics=Object.freeze({height:88,scale:.78,nucleusY:28,pad:4,nest:12,touch:-2,outer:8.4,inner:3.6,shareBins:4,joinMin:1.5,joinMax:22,joinClear:2.2,joinAim:.05,connected:1.5,clusterScale:.62,clusterGap:3,clusterNest:2,soften:7,maxOnset:3,maxNucleus:2,maxCoda:3});
  const n=x=>String(Math.round(x*100)/100),xml=E.xml;
  const path=(d,ink,width=3.4,extra='')=>`<path d="${d}" fill="none" stroke="${xml(ink)}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
  function letter(key,ink){
    return (alphabet[key]||[]).map(d=>path(d,ink)).join('')+(key==='i'?`<circle cx="17" cy="15" r="2.8" fill="${xml(ink)}"/>`:'');
  }
  // An empty nucleus is a small crossed square: a visible absence, never a schwa.
  const EMPTY='M12 12H24V24H12ZM12 12L24 24M24 12L12 24';
  // Parse the alphabet's absolute-command paths into segments.
  function segments(d){
    const tok=d.match(/[A-Za-z]|-?\d*\.?\d+/g),subs=[];let i=0,cmd='',x=0,y=0,cur=null;const num=()=>Number(tok[i++]);
    const add=seg=>{cur.segs.push(seg);const e=seg.pts.at(-1);x=e[0];y=e[1];};
    while(i<tok.length){
      if(/[A-Za-z]/.test(tok[i]))cmd=tok[i++];
      if(cmd==='M'){x=num();y=num();cur={start:[x,y],segs:[],closed:false};subs.push(cur);cmd='L';}
      else if(cmd==='L')add({t:'L',p0:[x,y],pts:[[num(),num()]]});
      else if(cmd==='H')add({t:'L',p0:[x,y],pts:[[num(),y]]});
      else if(cmd==='V')add({t:'L',p0:[x,y],pts:[[x,num()]]});
      else if(cmd==='Q')add({t:'Q',p0:[x,y],pts:[[num(),num()],[num(),num()]]});
      else if(cmd==='C')add({t:'C',p0:[x,y],pts:[[num(),num()],[num(),num()],[num(),num()]]});
      else if(cmd==='Z'){if(Math.hypot(x-cur.start[0],y-cur.start[1])>.01)add({t:'L',p0:[x,y],pts:[cur.start.slice()]});cur.closed=true;}
      else throw new Error('Unsupported path command '+cmd);
    }
    return subs;
  }
  const unit=(a,b)=>{const l=Math.hypot(b[0]-a[0],b[1]-a[1])||1;return [(b[0]-a[0])/l,(b[1]-a[1])/l];};
  // Harbor's softened hand: every straight corner becomes a short quadratic
  // arc, so fused components read as one organic sign rather than a diagram.
  function soften(subs,r){
    return subs.map(sp=>{
      const segs=sp.segs.map(g=>({...g,p0:g.p0.slice(),pts:g.pts.map(q=>q.slice())})),out=[];
      const n=segs.length,joins=sp.closed?n:n-1;
      const cut=new Array(n).fill(0).map(()=>({a:0,b:0}));
      const corner=[];
      for(let j=0;j<joins;j++){
        const A=segs[j],B=segs[(j+1)%n];
        if(A.t!=='L'||B.t!=='L')continue;
        const c=A.pts[0],ua=unit(A.p0,c),ub=unit(c,B.pts[0]);
        if(Math.abs(ua[0]*ub[1]-ua[1]*ub[0])<.05)continue;
        const la=Math.hypot(c[0]-A.p0[0],c[1]-A.p0[1]),lb=Math.hypot(B.pts[0][0]-c[0],B.pts[0][1]-c[1]);
        const k=Math.min(r,la/2,lb/2);cut[j].b=k;cut[(j+1)%n].a=k;corner[j]={c,ua,ub,k};
      }
      const pt=(p,u,k)=>[p[0]+u[0]*k,p[1]+u[1]*k];
      for(let j=0;j<n;j++){
        const g=segs[j];
        if(g.t==='L'){const u=unit(g.p0,g.pts[0]);g.p0=pt(g.p0,u,cut[j].a);g.pts[0]=pt(g.pts[0],u,-cut[j].b);}
        out.push(g);
        const cj=corner[j];if(cj)out.push({t:'Q',p0:g.pts[0],pts:[cj.c,pt(cj.c,cj.ub,cj.k)]});
      }
      // A closed outline whose first corner was rounded starts after the arc.
      const start=out[0].p0;
      return {start,segs:out,closed:sp.closed};
    });
  }
  const serialize=subs=>subs.map(sp=>'M'+n(sp.start[0])+' '+n(sp.start[1])+sp.segs.map(g=>g.t+g.pts.map(q=>n(q[0])+' '+n(q[1])).join(' ')).join('')+(sp.closed?'Z':'')).join('');
  // Harbor component geometry: softened paths, sampled centrelines and free
  // stroke ends with their outward direction (for organic joins).
  const harborCache=new Map();
  // `key` is a sound key, '∅', or 'stroke:'+key for a cluster sign.
  function harbor(key){
    if(harborCache.has(key))return harborCache.get(key);
    const sound=key.startsWith('stroke:')?key.slice(7):key;
    const source=key==='∅'?null:key.startsWith('stroke:')?[harborStrokes[sound]]:harborForms[key]||alphabet[key]||[];
    const subs=key==='∅'?segments(EMPTY):soften(source.flatMap(segments),softenRadius[sound]??blockMetrics.soften);
    const pts=[],ends=[];
    for(const sp of subs){
      pts.push(sp.start);
      for(const g of sp.segs){
        const p0=g.p0,c=g.pts;
        for(let k=1,steps=g.t==='L'?Math.max(1,Math.ceil(Math.hypot(c[0][0]-p0[0],c[0][1]-p0[1]))):16;k<=steps;k++){
          const t=k/steps,u=1-t;
          if(g.t==='L')pts.push([p0[0]+(c[0][0]-p0[0])*t,p0[1]+(c[0][1]-p0[1])*t]);
          else if(g.t==='Q')pts.push([u*u*p0[0]+2*u*t*c[0][0]+t*t*c[1][0],u*u*p0[1]+2*u*t*c[0][1]+t*t*c[1][1]]);
          else pts.push([u*u*u*p0[0]+3*u*u*t*c[0][0]+3*u*t*t*c[1][0]+t*t*t*c[2][0],u*u*u*p0[1]+3*u*u*t*c[0][1]+3*u*t*t*c[1][1]+t*t*t*c[2][1]]);
        }
      }
      if(!sp.closed&&key!=='∅'&&sp.segs.length){
        const f=sp.segs[0],l=sp.segs.at(-1);
        ends.push({at:sp.start,dir:unit(f.pts[0],sp.start)});
        ends.push({at:l.pts.at(-1),dir:unit(l.pts.at(-2)||l.p0,l.pts.at(-1))});
      }
    }
    if(key==='i')for(let k=0;k<12;k++)pts.push([17+2.8*Math.cos(k*Math.PI/6),15+2.8*Math.sin(k*Math.PI/6)]);
    const value={d:serialize(subs),pts,ends};harborCache.set(key,value);return value;
  }
  const ink=key=>harbor(key).pts;
  const harborPreview=key=>{const g=`<path d="${harbor(key).d}"/>`+(key==='i'?'<circle cx="17" cy="15" r="1.2"/>':'');return pictogram(g,g,'currentColor','palette-'+key);};
  const harborLetter=(key,inkColor)=>path(harbor(key).d,inkColor)+(key==='i'?`<circle cx="17" cy="15" r="2.8" fill="${xml(inkColor)}"/>`:'');
  const shift=(pts,dx,dy)=>pts.map(([x,y])=>[x+dx,y+dy]);
  const extent=(pts,a)=>pts.reduce((r,p)=>[Math.min(r[0],p[a]),Math.max(r[1],p[a])],[Infinity,-Infinity]);
  // Distance to move `next` along `axis` (0 = x, 1 = y) so it fuses with
  // `prev`. Between rows, facing strokes that run parallel for at least eight
  // units become one shared stroke; otherwise components stop a small gap
  // apart, which an organic ligature can bridge. Nesting is limited so a component never slides inside its neighbour.
  function contact(prev,next,axis,o={}){
    const m={...blockMetrics,...o},other=1-axis,far=new Map(),near=new Map();
    for(const p of prev){const b=Math.round(p[other]/2);far.set(b,Math.max(far.get(b)??-Infinity,p[axis]));}
    for(const p of next){const b=Math.round(p[other]/2);near.set(b,Math.min(near.get(b)??Infinity,p[axis]));}
    const plain=extent(prev,axis)[1]-extent(next,axis)[0]+m.touch,gaps=[];
    for(const [b,v] of far)if(near.has(b))gaps.push(v-near.get(b));
    if(!gaps.length)return plain;
    const share=Math.max(...gaps),shared=axis===1&&gaps.filter(g=>share-g<.6).length>=m.shareBins;
    if(shared)return Math.max(share,plain-m.nest);
    // Profiles are binned, so close the remaining diagonal gap exactly. Moving
    // by d changes no distance by more than d, so the inks cannot cross.
    let at=share+m.touch;
    for(let k=0;k<2;k++){const moved=next.map(p=>axis?[p[0],p[1]+at]:[p[0]+at,p[1]]);at-=Math.max(0,distance(prev,moved)-m.touch);}
    return Math.max(at,plain-m.nest);
  }
  function distance(A,B){let best=Infinity;for(const [x,y] of A)for(const [u,v] of B){const d=(x-u)*(x-u)+(y-v)*(y-v);if(d<best)best=d;}return Math.sqrt(best);}
  // Fuse one row left to right, centred on x=0 in letter units.
  function fuseRow(tokens,kind){
    const parts=[];let union=[];
    // A row of two or more consonants is a cluster and uses single-stroke signs.
    // Cluster signs are drawn smaller and stand a little apart, so the row
    // reads as a collection of separate strokes rather than one knot.
    const m=blockMetrics,cluster=kind!=='nucleus'&&tokens.length>1,f=cluster?m.clusterScale:1;
    for(const t of tokens){const form=cluster?'stroke:'+t.key:t.key,pts=ink(form).map(([x,y])=>[x*f,y*f]);const dx=parts.length?contact(union,pts,0,cluster?{touch:m.clusterGap,nest:0}:{}):0;parts.push({key:t.key,form,kind,f,dx,dy:0});union=union.concat(shift(pts,dx,0));}
    if(parts.length){const [a,b]=extent(union,0),c=(a+b)/2;parts.forEach(p=>p.dx-=c);union=shift(union,-c,0);}
    return {parts,union,cluster};
  }
  function units(text){
    const tokens=E.tokenize(text).map(t=>t.type==='unknown'&&t.raw==='·'?{...t,type:'boundary'}:t);
    const result=[];let word=[];
    const flush=()=>{if(word.length)result.push({type:'word',tokens:word});word=[];};
    for(const t of tokens){if(['consonant','vowel','mark','stress','boundary'].includes(t.type))word.push(t);else {flush();result.push(t);}}
    flush();return {tokens,units:result};
  }
  // Graphic default: consecutive vowels share a core; the last consonant
  // between nuclei starts the next syllable. A middle dot overrides the split.
  function syllabify(tokens){
    const result=[];let chunk=[];
    const flush=()=>{
      if(!chunk.length)return;
      const phones=[],annotations=[],orphans=[];
      for(const t of chunk){if(t.type==='consonant'||t.type==='vowel')phones.push(t);else if(phones.length)annotations.push({...t,after:phones.length-1});else orphans.push(t);}
      if(orphans.length)result.push({type:'orphan',tokens:orphans});
      if(!phones.length){chunk=[];return;}
      const runs=[];
      for(let i=0;i<phones.length;i++)if(phones[i].type==='vowel'){const start=i;while(phones[i+1]?.type==='vowel')i++;runs.push({start,end:i});}
      if(!runs.length)runs.push({start:phones.length,end:phones.length-1});
      const owner=new Array(phones.length),syllables=[];let start=0;
      for(let i=0;i<runs.length;i++){
        const run=runs[i],next=runs[i+1],end=next?next.start-1:phones.length;
        const syllable={type:'syllable',onset:phones.slice(start,run.start),nucleus:phones.slice(run.start,run.end+1),coda:phones.slice(run.end+1,end),marks:[],stress:false,phones:phones.slice(start,end)};
        for(let p=start;p<end;p++)owner[p]=syllables.length;
        syllables.push(syllable);start=end;
      }
      for(const a of annotations){const s=syllables[owner[a.after]];if(a.type==='mark')s.marks.push(a.key);else s.stress=true;}
      result.push(...syllables);chunk=[];
    };
    for(const t of tokens){if(t.type==='boundary')flush();else chunk.push(t);}flush();return result;
  }
  // Organic ligatures: when two neighbouring components do not already touch,
  // a free stroke end that points toward the other and stops just short of it
  // continues in a curve until it meets it. At most one join per pair.
  function joins(components,S){
    const m=blockMetrics,out=[];
    const groups={onset:[],nucleus:[],coda:[]};for(const c of components)groups[c.kind].push(c);
    const pairs=[];
    for(const row of Object.values(groups))for(let i=1;i<row.length;i++)pairs.push([[row[i-1]],[row[i]]]);
    if(groups.onset.length)pairs.push([groups.onset,groups.nucleus]);
    if(groups.coda.length)pairs.push([groups.nucleus,groups.coda]);
    const ends=c=>c.key==='∅'?[]:harbor(c.form).ends.map(e=>({at:[c.x+e.at[0]*S*c.f,c.y+e.at[1]*S*c.f],dir:e.dir}));
    const touching=(A,B)=>A.some(a=>B.some(b=>a.points.some(p=>b.points.some(q=>Math.hypot(p[0]-q[0],p[1]-q[1])<m.connected*S))));
    for(const [A,B] of pairs){
      if(touching(A,B))continue;
      let best=null;
      for(const [from,to] of [[A,B],[B,A]])for(const a of from)for(const e of ends(a))for(const b of to){
        let p=null,dist=Infinity;for(const q of b.points){const d=Math.hypot(q[0]-e.at[0],q[1]-e.at[1]);if(d<dist){dist=d;p=q;}}
        const u=[(p[0]-e.at[0])/(dist||1),(p[1]-e.at[1])/(dist||1)],aim=e.dir[0]*u[0]+e.dir[1]*u[1];
        if(dist<m.joinMin*S||dist>m.joinMax*S||aim<m.joinAim)continue;
        const score=dist/(.4+aim);if(best&&score>=best.score)continue;
        // The curve must run through open space, never across another stroke.
        const c=[e.at[0]+e.dir[0]*dist*.7,e.at[1]+e.dir[1]*dist*.7];let clear=true;
        for(let t=.25;t<=.76&&clear;t+=.1){const u2=1-t,x=u2*u2*e.at[0]+2*u2*t*c[0]+t*t*p[0],y=u2*u2*e.at[1]+2*u2*t*c[1]+t*t*p[1];
          for(const k of components){if((k===a||k===b)&&(t<.4||t>.6))continue;for(const q of k.points)if(Math.hypot(q[0]-x,q[1]-y)<m.joinClear*S){clear=false;break;}}}
        if(clear)best={score,e,p,dist,c};
      }
      if(best){const {e,p,c}=best;out.push({d:`M${n(e.at[0])} ${n(e.at[1])}Q${n(c[0])} ${n(c[1])} ${n(p[0])} ${n(p[1])}`,from:e.at,control:c,to:p});}
    }
    return out;
  }
  // Outline union: ink strokes of width `outer` minus a mask of width `inner`.
  let pictograms=0;
  function pictogram(inkGeometry,maskGeometry,inkColor,idBase){
    const m=blockMetrics,id=`${String(idBase||'harbor').replace(/[^a-zA-Z0-9_-]/g,'')||'harbor'}-pictogram-${++pictograms}`;
    const box='x="-40" y="-40" width="400" height="180"';
    return `<mask id="${id}" maskUnits="userSpaceOnUse" ${box}><rect ${box} fill="white"/><g fill="none" stroke="black" stroke-width="${m.inner}" stroke-linecap="round" stroke-linejoin="round">${maskGeometry}</g></mask><g mask="url(#${id})" data-pictogram="true"><g fill="none" stroke="${xml(inkColor)}" stroke-width="${m.outer}" stroke-linecap="round" stroke-linejoin="round">${inkGeometry}</g></g>`;
  }
  function block(s,inkColor,idBase){
    const m=blockMetrics,escape=s.onset.length>m.maxOnset||s.nucleus.length>m.maxNucleus||s.coda.length>m.maxCoda;
    const markTile=(marks,x0,offset=0)=>marks.map((key,i)=>`<g transform="translate(${n(x0+18*Math.floor(i/4))} ${16+18*(i%4)}) scale(.65)" data-prosody-slot="${offset+i}">${E.mark(key,0,0,inkColor)}</g>`).join('');
    if(escape){
      // Spell out oversized groups at a constant readable size. The bracket is
      // a graphic escape, never an extra vowel or a syllable boundary.
      const items=s.phones.map(t=>({width:34,body:`<g transform="translate(2 28) scale(.8)" data-escape-letter="${xml(t.key)}">${letter(t.key,inkColor)}</g>`}));
      for(const key of s.marks)items.push({width:28,body:`<g transform="translate(14 44) scale(.65)" data-prosody-only="true">${E.mark(key,0,0,inkColor)}</g>`});
      items.forEach((tile,i)=>{tile.body=path(`M0 ${i===0?8:0}V0H${tile.width}${i===items.length-1?'V8':''}`,inkColor,1.3)+tile.body;if(i===0&&s.stress)tile.body+=path('M12-9H22',inkColor,3);});
      return {width:34,height:m.height,body:'',escape:true,tiles:items,components:[],ligatures:[]};
    }
    const onset=fuseRow(s.onset,'onset'),nucleus=fuseRow(s.nucleus.length?s.nucleus:[{key:'∅'}],'nucleus'),coda=fuseRow(s.coda,'coda');
    const rowJoin=row=>row.cluster?{touch:0,nest:m.clusterNest}:{};
    const oy=onset.parts.length?-contact(onset.union,nucleus.union,1,rowJoin(onset)):0,cy=coda.parts.length?contact(nucleus.union,coda.union,1,rowJoin(coda)):0;
    onset.parts.forEach(p=>p.dy=oy);coda.parts.forEach(p=>p.dy=cy);
    const parts=[...onset.parts,...nucleus.parts,...coda.parts];
    const all=parts.flatMap(p=>shift(ink(p.form).map(([x,y])=>[x*p.f,y*p.f]),p.dx,p.dy)),[minX,maxX]=extent(all,0);
    const S=m.scale,left=m.pad-minX*S,glyphWidth=(maxX-minX)*S+2*m.pad;
    const place=p=>({x:left+p.dx*S,y:m.nucleusY+p.dy*S});
    const components=parts.map(p=>{const at=place(p);return {key:p.key,form:p.form,kind:p.kind,f:p.f,x:at.x,y:at.y,points:ink(p.form).map(([x,y])=>[at.x+x*S*p.f,at.y+y*S*p.f])};});
    // The syllable becomes one pictogram: every component and ligature is
    // stroked together at the outline width, then the inner stroke width is
    // masked out. Overlapping strokes therefore merge into a single contour
    // instead of crossing.
    const ligatures=joins(components,S);
    const geometry=tagged=>components.map(c=>{
      const at=`transform="translate(${n(c.x)} ${n(c.y)}) scale(${n(S*c.f)})"`+(c.f!==1?` stroke-width="${n((tagged?m.outer:m.inner)/c.f)}"`:'');
      if(c.key==='∅')return `<path ${at} d="${EMPTY}"${tagged?' data-empty-nucleus="true"':''}/>`;
      return `<path ${at} d="${harbor(c.form).d}"${tagged?` data-${c.kind}-part="${xml(c.key)}"${c.form!==c.key?' data-cluster-stroke="true"':''}`:''}/>`+(c.key==='i'?`<circle ${at} cx="17" cy="15" r="1.2"/>`:'');
    }).join('')+`<g transform="scale(${S})">`+ligatures.map(j=>`<path d="M${n(j.from[0]/S)} ${n(j.from[1]/S)}Q${n(j.control[0]/S)} ${n(j.control[1]/S)} ${n(j.to[0]/S)} ${n(j.to[1]/S)}"${tagged?' data-ligature="true"':''}/>`).join('')+'</g>';
    let body=pictogram(geometry(true),geometry(false),inkColor,idBase);
    const markX=glyphWidth+8;
    body+=markTile(s.marks.slice(0,8),markX);
    if(s.stress)body+=path(`M${n(glyphWidth/2-5)}-9H${n(glyphWidth/2+5)}`,inkColor,3);
    const width=s.marks.length>4?markX+40:s.marks.length?markX+22:glyphWidth;
    const tiles=[{width,body}];
    // Excess annotations continue in bounded tiles rather than shrinking ink.
    for(let start=8;start<s.marks.length;start+=8){const marks=s.marks.slice(start,start+8);tiles.push({width:marks.length>4?48:30,body:`<g data-prosody-only="true">${markTile(marks,0,start)}</g>`});}
    return {width,height:m.height,body,escape:false,tiles,components,ligatures,glyphWidth};
  }
  function render(text,options={},system='blocks'){
    const o={...E.defaults,...options},width=Math.max(300,Math.min(2400,Number(o.width)||1000)),size=Math.max(.45,Math.min(2.5,Number(o.size)||1));
    const margin=32,max=(width-2*margin)/size,lineHeight=system==='blocks'?108:88;
    const data=units(text),paint=[],placements=[],syllables=[],unknown=[...new Set(data.tokens.filter(t=>t.type==='unknown').map(t=>t.raw))],orphanMarks=[],notes=[];
    let x=0,y=system==='blocks'?18:36,lines=1,maxX=0,vowelless=false,escaped=false;
    const nextLine=()=>{maxX=Math.max(maxX,x);x=0;y+=lineHeight;lines++;};
    const put=(body,w,attrs='',gap=0)=>{const fit=Math.min(1,max/w),advance=w*fit;if(x>0&&x+advance>max)nextLine();paint.push(`<g transform="translate(${n(x)} ${n(y)}) scale(${fit})"${attrs}>${body}</g>`);placements.push({x,y,width:advance,scale:fit});x+=advance+gap;maxX=Math.max(maxX,x);};
    const literal=(raw,rust=false)=>put(`<text x="0" y="${system==='blocks'?58:28}" fill="${rust?'#a53e29':xml(o.ink)}" font-family="Georgia,serif" font-size="23">${xml(raw)}</text>`,Math.max(18,Array.from(raw).length*14));
    for(const unit of data.units){
      if(unit.type==='newline'){nextLine();continue;}
      if(unit.type==='space'){if(x)x+=22;continue;}
      if(unit.type!=='word'){literal(unit.raw,unit.type==='unknown');continue;}
      const syllableList=syllabify(unit.tokens);
      const prepared=[];
      for(const s of syllableList){
        if(s.type==='orphan'){prepared.push({orphan:s});continue;}
        syllables.push(s);if(!s.nucleus.length)vowelless=true;
        if(system==='blocks'){const b=block(s,o.ink,o.idPrefix);if(b.escape)escaped=true;b.tiles.forEach((tile,i)=>prepared.push({s,b:tile,width:tile.width+(b.escape?0:12),escape:b.escape,part:i,group:syllables.length-1}));}
        else {
          const nucleusIndex=s.onset.length,target=s.nucleus.length?nucleusIndex:Math.max(0,s.phones.length-1);
          s.phones.forEach((t,i)=>{
            let body=letter(t.key,o.ink),w=44;
            if(i===target){s.marks.forEach((m,j)=>{body+=`<g transform="translate(${17+j*18}-8) scale(.65)">${E.mark(m,0,0,o.ink)}</g>`;});w=Math.max(w,34+18*Math.max(0,s.marks.length-1));if(s.stress)body+=path('M12-24H22',o.ink,2.6);}
            prepared.push({t,body,width:w});
          });
        }
      }
      const wordWidth=prepared.reduce((sum,p)=>sum+(p.width||30),0);
      if(x>0&&wordWidth<=max&&x+wordWidth>max)nextLine();
      for(const p of prepared){
        if(p.orphan){for(const t of p.orphan.tokens){literal(t.raw,true);if(t.type==='mark')orphanMarks.push(t.raw);}continue;}
        if(system==='blocks'){
          const info=p.part===0?` data-syllable="${xml(p.s.phones.map(t=>t.key).join(' '))}" data-onset="${xml(p.s.onset.map(t=>t.key).join(' '))}" data-nucleus="${xml(p.s.nucleus.map(t=>t.key).join(' '))}" data-coda="${xml(p.s.coda.map(t=>t.key).join(' '))}"`:'';
          put(p.b.body,p.b.width,`${info} data-syllable-group="${p.group}" data-block-part="${p.part}"${p.escape?' data-block-escape="true"':''}`,p.escape?0:12);
        }
        else put(p.body,p.width,` data-alphabet-letter="${xml(p.t.key)}" data-kind="${p.t.type}"`);
      }
    }
    if(system==='blocks'&&vowelless)notes.push('The small crossed square marks an empty nucleus; no vowel is supplied.');
    if(escaped)notes.push('This group exceeds 3 onset, 2 vowel or 3 coda components; a bracketed spell-out keeps every sound readable.');
    const height=Math.max(210,Math.ceil((y+(system==='blocks'?92:46))*size+2*margin));
    let guides='';if(o.guides)for(let row=0;row<lines;row++){const base=(system==='blocks'?18:36)+row*lineHeight;guides+=path(`M0 ${base+(system==='blocks'?88:36)}H${max}`,'#9eacb6',.6,' stroke-dasharray="3 7"');}
    const bg=o.transparent?'':`<rect width="100%" height="100%" fill="${xml(o.background)}"/>`;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${xml(text||'Empty script composition')}"><title>${xml(text||'Script composition')}</title>${bg}<g transform="translate(${margin} ${margin}) scale(${size})">${guides}${paint.join('')}</g></svg>`;
    return {svg,width,height,lines,unknown,placements,joins:[],orphanMarks,notes,syllables,marks:data.tokens.filter(t=>t.type==='mark').length,consonants:data.tokens.filter(t=>t.type==='consonant').length,vowels:data.tokens.filter(t=>t.type==='vowel').length,contentBounds:{x:margin-5*size,y:margin+(system==='blocks'?6:6)*size,width:Math.min(width-margin,maxX*size+10*size),height:(y+(system==='blocks'?92:46)-6)*size}};
  }
  function compact(result,padding=5){const b=result.contentBounds,x=b.x-padding,y=b.y-padding,w=Math.max(30,b.width+2*padding),h=Math.max(30,b.height+2*padding);return result.svg.replace(/width="[^"]*" height="[^"]*" viewBox="[^"]*"/,`width="${n(w)}" height="${n(h)}" viewBox="${n(x)} ${n(y)} ${n(w)} ${n(h)}"`);}
  const hidden=svg=>svg.replace('role="img"','aria-hidden="true"');
  function preview(key,type,system){
    if(type==='mark')return hidden(compact(render('a{'+key+'}',{width:300,transparent:true,ink:'currentColor'},system)));
    return `<svg viewBox="-4 -4 44 44" aria-hidden="true">${system==='blocks'?harborPreview(key):letter(key,'currentColor')}</svg>`;
  }
  const api={alphabet,harborForms,harborStrokes,letter,harborLetter,harborPreview,ink,harbor,blockMetrics,units,syllabify,block,render,compact,preview};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.ScriptDescendants=api;
})(typeof globalThis!=='undefined'?globalThis:this);
