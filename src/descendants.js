/* Structural descendants of the Two-Rail tradition. No language draft is read. */
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
  // The Harbor reform borrows the alphabet's sound forms, not its linear layout.
  // Components keep one constant scale and fuse by contact: each joins the
  // previous one in its row where their strokes first meet, and each row joins
  // the row above the same way. Shared rails become one stroke.
  const blockMetrics=Object.freeze({height:88,scale:.78,nucleusY:28,pad:4,nest:4,touch:3.2,shareBins:4,maxOnset:3,maxNucleus:2,maxCoda:3});
  const n=x=>String(Math.round(x*100)/100),xml=E.xml;
  const path=(d,ink,width=3.4,extra='')=>`<path d="${d}" fill="none" stroke="${xml(ink)}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
  function letter(key,ink){
    return (alphabet[key]||[]).map(d=>path(d,ink)).join('')+(key==='i'?`<circle cx="17" cy="15" r="2.8" fill="${xml(ink)}"/>`:'');
  }
  // An empty nucleus is a small crossed square: a visible absence, never a schwa.
  const EMPTY='M12 12H24V24H12ZM12 12L24 24M24 12L12 24';
  // Sample stroke centerlines of the (absolute-command) letter paths.
  const inkCache=new Map();
  function ink(key){
    if(inkCache.has(key))return inkCache.get(key);
    const pts=[];
    for(const d of key==='∅'?[EMPTY]:alphabet[key]||[]){
      const tok=d.match(/[A-Za-z]|-?\d*\.?\d+/g);let i=0,cmd='',x=0,y=0,sx=0,sy=0;const num=()=>Number(tok[i++]);
      const line=(x1,y1)=>{const steps=Math.max(1,Math.ceil(Math.hypot(x1-x,y1-y)));for(let k=1;k<=steps;k++)pts.push([x+(x1-x)*k/steps,y+(y1-y)*k/steps]);x=x1;y=y1;};
      const curve=(c)=>{const p0=[x,y];for(let k=1;k<=24;k++){const t=k/24,u=1-t;let q;if(c.length===2)q=[u*u*p0[0]+2*u*t*c[0][0]+t*t*c[1][0],u*u*p0[1]+2*u*t*c[0][1]+t*t*c[1][1]];else q=[u*u*u*p0[0]+3*u*u*t*c[0][0]+3*u*t*t*c[1][0]+t*t*t*c[2][0],u*u*u*p0[1]+3*u*u*t*c[0][1]+3*u*t*t*c[1][1]+t*t*t*c[2][1]];pts.push(q);}const e=c.at(-1);x=e[0];y=e[1];};
      while(i<tok.length){
        if(/[A-Za-z]/.test(tok[i]))cmd=tok[i++];
        if(cmd==='M'){x=sx=num();y=sy=num();pts.push([x,y]);cmd='L';}
        else if(cmd==='L')line(num(),num());
        else if(cmd==='H')line(num(),y);
        else if(cmd==='V')line(x,num());
        else if(cmd==='Q')curve([[num(),num()],[num(),num()]]);
        else if(cmd==='C')curve([[num(),num()],[num(),num()],[num(),num()]]);
        else if(cmd==='Z'){line(sx,sy);}
        else throw new Error('Unsupported path command '+cmd);
      }
    }
    if(key==='i')for(let k=0;k<12;k++)pts.push([17+2.8*Math.cos(k*Math.PI/6),15+2.8*Math.sin(k*Math.PI/6)]);
    inkCache.set(key,pts);return pts;
  }
  const shift=(pts,dx,dy)=>pts.map(([x,y])=>[x+dx,y+dy]);
  const extent=(pts,a)=>pts.reduce((r,p)=>[Math.min(r[0],p[a]),Math.max(r[1],p[a])],[Infinity,-Infinity]);
  // Distance to move `next` along `axis` (0 = x, 1 = y) so it fuses with
  // `prev`. Where the facing strokes run parallel for at least eight units they
  // become one shared stroke; otherwise the inks just touch at their closest
  // point. Nesting is limited so a component never slides inside its neighbour.
  function contact(prev,next,axis){
    const m=blockMetrics,other=1-axis,far=new Map(),near=new Map();
    for(const p of prev){const b=Math.round(p[other]/2);far.set(b,Math.max(far.get(b)??-Infinity,p[axis]));}
    for(const p of next){const b=Math.round(p[other]/2);near.set(b,Math.min(near.get(b)??Infinity,p[axis]));}
    const plain=extent(prev,axis)[1]-extent(next,axis)[0]+m.touch,gaps=[];
    for(const [b,v] of far)if(near.has(b))gaps.push(v-near.get(b));
    if(!gaps.length)return plain;
    const share=Math.max(...gaps),shared=gaps.filter(g=>share-g<.6).length>=m.shareBins;
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
    for(const t of tokens){const pts=ink(t.key);const dx=parts.length?contact(union,pts,0):0;parts.push({key:t.key,kind,dx,dy:0});union=union.concat(shift(pts,dx,0));}
    if(parts.length){const [a,b]=extent(union,0),c=(a+b)/2;parts.forEach(p=>p.dx-=c);union=shift(union,-c,0);}
    return {parts,union};
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
  function block(s,inkColor){
    const m=blockMetrics,escape=s.onset.length>m.maxOnset||s.nucleus.length>m.maxNucleus||s.coda.length>m.maxCoda;
    const markTile=(marks,x0,offset=0)=>marks.map((key,i)=>`<g transform="translate(${n(x0+18*Math.floor(i/4))} ${16+18*(i%4)}) scale(.65)" data-prosody-slot="${offset+i}">${E.mark(key,0,0,inkColor)}</g>`).join('');
    if(escape){
      // Spell out oversized groups at a constant readable size. The bracket is
      // a graphic escape, never an extra vowel or a syllable boundary.
      const items=s.phones.map(t=>({width:34,body:`<g transform="translate(2 28) scale(.8)" data-escape-letter="${xml(t.key)}">${letter(t.key,inkColor)}</g>`}));
      for(const key of s.marks)items.push({width:28,body:`<g transform="translate(14 44) scale(.65)" data-prosody-only="true">${E.mark(key,0,0,inkColor)}</g>`});
      items.forEach((tile,i)=>{tile.body=path(`M0 ${i===0?8:0}V0H${tile.width}${i===items.length-1?'V8':''}`,inkColor,1.3)+tile.body;if(i===0&&s.stress)tile.body+=path('M12-9H22',inkColor,3);});
      return {width:34,height:m.height,body:'',escape:true,tiles:items,components:[]};
    }
    const onset=fuseRow(s.onset,'onset'),nucleus=fuseRow(s.nucleus.length?s.nucleus:[{key:'∅'}],'nucleus'),coda=fuseRow(s.coda,'coda');
    const oy=onset.parts.length?-contact(onset.union,nucleus.union,1):0,cy=coda.parts.length?contact(nucleus.union,coda.union,1):0;
    onset.parts.forEach(p=>p.dy=oy);coda.parts.forEach(p=>p.dy=cy);
    const parts=[...onset.parts,...nucleus.parts,...coda.parts];
    const all=parts.flatMap(p=>shift(ink(p.key),p.dx,p.dy)),[minX,maxX]=extent(all,0);
    const S=m.scale,left=m.pad-minX*S,glyphWidth=(maxX-minX)*S+2*m.pad;
    const place=p=>({x:left+p.dx*S,y:m.nucleusY+p.dy*S});
    const components=parts.map(p=>{const at=place(p);return {key:p.key,kind:p.kind,x:at.x,y:at.y,points:ink(p.key).map(([x,y])=>[at.x+x*S,at.y+y*S])};});
    let body='';
    for(const c of components){
      if(c.key==='∅')body+=`<g transform="translate(${n(c.x)} ${n(c.y)}) scale(${S})">${path(EMPTY,inkColor,2.4,' data-empty-nucleus="true"')}</g>`;
      else body+=`<g transform="translate(${n(c.x)} ${n(c.y)}) scale(${S})" data-${c.kind}-part="${xml(c.key)}">${letter(c.key,inkColor)}</g>`;
    }
    const markX=glyphWidth+8;
    body+=markTile(s.marks.slice(0,8),markX);
    if(s.stress)body+=path(`M${n(glyphWidth/2-5)}-9H${n(glyphWidth/2+5)}`,inkColor,3);
    const width=s.marks.length>4?markX+40:s.marks.length?markX+22:glyphWidth;
    const tiles=[{width,body}];
    // Excess annotations continue in bounded tiles rather than shrinking ink.
    for(let start=8;start<s.marks.length;start+=8){const marks=s.marks.slice(start,start+8);tiles.push({width:marks.length>4?48:30,body:`<g data-prosody-only="true">${markTile(marks,0,start)}</g>`});}
    return {width,height:m.height,body,escape:false,tiles,components,glyphWidth};
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
        if(system==='blocks'){const b=block(s,o.ink);if(b.escape)escaped=true;b.tiles.forEach((tile,i)=>prepared.push({s,b:tile,width:tile.width+(b.escape?0:12),escape:b.escape,part:i,group:syllables.length-1}));}
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
    return `<svg viewBox="-4 -4 44 44" aria-hidden="true">${letter(key,'currentColor')}</svg>`;
  }
  const api={alphabet,letter,ink,blockMetrics,units,syllabify,block,render,compact,preview};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.ScriptDescendants=api;
})(typeof globalThis!=='undefined'?globalThis:this);
