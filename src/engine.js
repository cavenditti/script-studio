/* The outlines are redrawn from Carlo's chart, not an installed font.
   Coordinates share upper/lower rails at y=8 and y=24. */
(function (root) {
  'use strict';
  const C = {
    j: { label: 'j', paths: ['M100 8H10C-3 8-3 24 10 24H56Q66 24 66 16'] },
    c: { label: 'c', paths: ['M0 0Q1 8 12 8H100','M16 24H56Q66 24 66 16'] },
    p: { label: 'p', paths: ['M0 0Q1 8 12 8H54Q64 8 64 16','M16 24H100'] },
    d: { label: 'd', paths: ['M0 0Q1 8 12 8H100','M16 24H100'] },
    'ş': { label: 'ş', paths: ['M0 0Q1 8 12 8H64V24H16'], aliases: ['sh','š','ʃ'] },
    k: { label: 'k', paths: ['M16 8H100','M0 32Q1 24 12 24H56Q66 24 66 16'] },
    b: { label: 'b', paths: ['M16 8H54Q64 8 64 16','M0 32Q1 24 12 24H100'] },
    t: { label: 't', paths: ['M16 8H100','M0 32Q1 24 12 24H100'] },
    'ž': { label: 'ž', paths: ['M16 8H64V24H12Q1 24 0 32'], aliases: ['zh','ʒ'] },
    g: { label: 'g', paths: ['M0 0Q0 24 12 24H56Q66 24 66 16','M16 8H100'] },
    n: { label: 'n', paths: ['M0 0Q0 24 12 24H100','M16 8H54Q64 8 64 16'] },
    l: { label: 'l', paths: ['M0 0Q0 24 12 24H100','M16 8H100'] },
    s: { label: 's', paths: ['M0 0Q0 24 12 24H64V8H16'] },
    gh: { label: 'gh', paths: ['M0 32Q0 8 12 8H100','M16 24H56Q66 24 66 16'] },
    m: { label: 'm', paths: ['M0 32Q0 8 12 8H54Q64 8 64 16','M16 24H100'] },
    r: { label: 'r', paths: ['M0 32Q0 8 12 8H100','M16 24H100'] },
    z: { label: 'z', paths: ['M0 32Q0 8 12 8H64V24H16'] },
    f: { label: 'f', paths: ['M0 0Q1 8 12 8H100','M16 24H60V8'] },
    v: { label: 'v', paths: ['M16 8H100','M0 32Q1 24 12 24H60V8'] },
    w: { label: 'w', paths: ['M0 0Q0 24 12 24H100','M16 8H60V24'] }
  };
  const V = {
    a: { label:'a', path:'M-10 2Q-10-4-4-4H10', initial:'M-6-5V5Q-6 10 0 10H6V-5Z' },
    e: { label:'e', path:'M-10 2H5Q10 2 10-5', initial:'M-7-5H5V10M-7-5V1H5' },
    'è': { label:'è / ɛ', path:'M-10 2H5Q10 2 10-3L4-9', initial:'M-10-4H10V6H3V-1M-10-4V6H-3V-1', aliases:['ɛ'] },
    o: { label:'o', path:'M-10 2L0-7L10 2', initial:'M-7-5H7M-7-5V6H7' },
    'ò': { label:'ò / ɔ', path:'M-10-6L0 3L10-6', initial:'M-7-7H3Q10-7 10 1Q10 8 2 8H-7V1H1', aliases:['ɔ'] },
    h: { label:'h', path:'M3-5C-6-7-6 5 3 4', thin:true },
    i: { label:'i', circle:3.4, initialCarrier:'j' },
    u: { label:'u', circle:3.8, open:true },
    'æ': { label:'æ', path:'M-12 4Q-10-2-3-2H7L11-8' },
    'œ': { label:'œ', path:'M-11-6V4H-3V-4H12' },
    'y': { label:'y (chart Y)', path:'M-8 4Q-8-4 0-4H7V4', initial:'M-6-5V3Q-6 10 0 10Q6 10 6 3' }
  };
  // Full-size initial vowel allographs. Their small reference-sheet drawings
  // are not a size instruction: these use the consonants' 8-unit strokes.
  const INITIALS = {
    a:{width:52,paths:['M8 24V8H24Q40 8 40 16Q40 24 24 24Z']},
    e:{width:52,paths:['M40 32V8H8V14Q8 24 26 24']},
    'è':{width:72,paths:['M8 8H28V24H8V16','M38 8H58V24H38V16']},
    o:{width:52,paths:['M40 8H20Q8 8 8 20V24H40']},
    'ò':{width:52,paths:['M8 0V8H22Q40 8 40 16Q40 24 22 24H8V16H18']},
    y:{width:56,paths:['M8 8H24V18','M8 8V22Q8 32 20 32Q30 32 34 20Q36 16 44 16']},
    i:{width:108,paths:C.j.paths,dot:[34,16,3.4]}
  };
  const downLeft='M-2-8H6C3-2 0 2-6 3V-2Q-3-3-2-8Z';
  const upLeft='M-2 8H6C3 2 0-2-6-3V2Q-3 3-2 8Z';
  const MARKS = {
    '1':{label:'R1 C1',paths:[downLeft]},
    '2':{label:'R1 C2',paths:[upLeft]},
    '3':{label:'R1 C3',paths:[downLeft],mirror:true},
    '4':{label:'R1 C4',paths:[upLeft],mirror:true},
    '5':{label:'R2 C1',dot:true},
    '6':{label:'R2 C2',pair:'right'},
    '7':{label:'R2 C3',pair:'left'},
    '8':{label:'R2 C4',bar:true}
  };
  const entry={j:'loop',c:'top',p:'top',d:'top','ş':'top',k:'bottom',b:'bottom',t:'bottom','ž':'bottom',g:'down',n:'down',l:'down',s:'down',gh:'up',m:'up',r:'up',z:'up',f:'top',v:'bottom',w:'down'};
  const ending={j:'lowerHook',c:'lowerHook',p:'upperHook',d:'straight','ş':'closed',k:'lowerHook',b:'upperHook',t:'straight','ž':'closed',g:'lowerHook',n:'upperHook',l:'straight',s:'closed',gh:'lowerHook',m:'upperHook',r:'straight',z:'closed',f:'bridge',v:'bridge',w:'upperBridge'};
  const aliases = {};
  for (const [key,g] of [...Object.entries(C),...Object.entries(V)]) { aliases[key] = key; (g.aliases||[]).forEach(a=>aliases[a]=key); }
  const xml = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  const defaults = { size:1, spacing:1, joined:true, initial:'special', guides:false, ink:'#161c20', background:'#ffffff', transparent:false, width:1000 };
  function tokenize(text) {
    const chars = Array.from(String(text).normalize('NFC').toLowerCase());
    const out=[];
    for(let i=0;i<chars.length;i++) {
      const char=chars[i], pair=char+(chars[i+1]||'');
      if(char==='{'&&MARKS[chars[i+1]]&&chars[i+2]==='}') {out.push({type:'mark',key:chars[i+1],raw:chars.slice(i,i+3).join('')});i+=2;continue;}
      if(['gh','sh','zh'].includes(pair)) {out.push({type:'consonant',key:aliases[pair],raw:pair});i++;continue;}
      const key=aliases[char];
      if(C[key]) out.push({type:'consonant',key,raw:char});
      else if(V[key]) out.push({type:'vowel',key,raw:char});
      else if(char==='\n') out.push({type:'newline',raw:char});
      else if(/\s/.test(char)) out.push({type:'space',raw:char});
      else if(char==="'") out.push({type:'stress',raw:char});
      else if(/[.,;:!?…\-–—()\[\]«»“”\d]/u.test(char)) out.push({type:'punctuation',raw:char});
      else out.push({type:'unknown',raw:char});
    }
    return out;
  }
  function compose(text) {
    const tokens=tokenize(text), items=[], unknown=new Set(); let consonant=null,anchor=null;
    for(const t of tokens) {
      if(t.type==='vowel' && consonant) {consonant.vowels.push(t.key);continue;}
      if(t.type==='stress' && anchor) {anchor.stress=true;continue;}
      if(t.type==='mark' && anchor) {anchor.marks.push(t.key);continue;}
      const item={...t};
      if(t.type==='consonant') {item.vowels=[];item.marks=[];consonant=item;anchor=item;} else {consonant=null;anchor=null;if(t.type==='vowel'){item.marks=[];anchor=item;}}
      if(t.type==='unknown') unknown.add(t.raw);
      items.push(item);
    }
    return {items,tokens,unknown:[...unknown]};
  }
  function glyph(key, ink='#161c20', halo='#ffffff', withHalo=false) {
    const g=C[key]; if(!g)return '';
    const strokes=(color,width)=>g.paths.map(d=>`<path d="${d}" fill="none" stroke="${xml(color)}" stroke-width="${width}" stroke-linecap="butt" stroke-linejoin="round"/>`).join('');
    return (withHalo?strokes(halo,10.5):'')+strokes(ink,8);
  }
  function vowel(key, x, y, ink, initial=false) {
    const g=V[key];if(!g)return '';
    const body=g.circle?`<circle r="${g.circle}" fill="${g.open?'none':xml(ink)}" stroke="${xml(ink)}" stroke-width="${g.open?2:0}"/>`:`<path d="${initial&&g.initial?g.initial:g.path}" fill="none" stroke="${xml(ink)}" stroke-width="${g.thin?2.5:4.2}" stroke-linecap="butt" stroke-linejoin="miter"/>`;
    return `<g transform="translate(${x} ${y})">${body}</g>`;
  }
  function preview(key,type) {
    if(type==='mark')return `<svg viewBox="0 -4 80 40" aria-hidden="true"><path d="M4 8H72V24H4" fill="none" stroke="currentColor" stroke-width="8"/>${mark(key,38,16,'currentColor')}</svg>`;
    return `<svg viewBox="-12 -15 125 60" aria-hidden="true">${type==='vowel'?vowel(key,45,8,'currentColor'):glyph(key,'currentColor')}</svg>`;
  }
  function mark(key,x,y,ink) {
    const m=MARKS[key];if(!m)return '';
    const filled=(d,transform='')=>`<path d="${d}"${transform?` transform="${transform}"`:''} fill="${xml(ink)}"/>`;
    let body=m.dot?`<circle r="2.4" fill="${xml(ink)}"/>`:m.bar?`<path d="M0-8V8" stroke="${xml(ink)}" stroke-width="7"/>`:m.pair?
      (m.pair==='right'?filled(upLeft,'translate(-5 0) scale(-1 1)')+filled(downLeft,'translate(5 0) scale(-1 1)'):filled(downLeft,'translate(-5 0) scale(-1 1)')+filled(upLeft,'translate(5 0) scale(-1 1)')):
      m.paths.map(d=>filled(d,m.mirror?'scale(-1 1)':'')).join('');
    return `<g transform="translate(${x} ${y})" data-mark="${key}">${body}</g>`;
  }
  function initialVowel(key,ink) {
    const g=INITIALS[key];if(!g)return '';
    return g.paths.map(d=>`<path d="${d}" fill="none" stroke="${xml(ink)}" stroke-width="8" stroke-linecap="butt" stroke-linejoin="round"/>`).join('')+(g.dot?`<circle cx="${g.dot[0]}" cy="${g.dot[1]}" r="${g.dot[2]}" fill="${xml(ink)}"/>`:'');
  }
  function cell(key,width,joined,ink,connector=0) {
    const left=entry[key],right=ending[key],closed=right==='closed',cap=closed?width:width-36;
    const upperEnd=right==='upperHook'||right==='upperBridge'?cap:width;
    const lowerEnd=right==='lowerHook'||right==='bridge'?cap:width;
    let paths=[];
    const upperTail=right==='upperHook'?`H${cap-10}Q${cap} 8 ${cap} 16`:right==='upperBridge'?`H${cap}V24`:`H${upperEnd}`;
    const lowerTail=right==='lowerHook'?`H${cap-10}Q${cap} 24 ${cap} 16`:right==='bridge'?`H${cap}V8`:`H${lowerEnd}`;
    if(left==='loop')paths=[`M${width} 8H10C-3 8-3 24 10 24${lowerTail}`];
    else if(left==='down')paths=[`${joined?'M0 8C12 8 12 24 24 24':'M0 0Q0 24 24 24'}${lowerTail}`,`M24 8${upperTail}`];
    else if(left==='up')paths=[`${joined?'M0 24C12 24 12 8 24 8':'M0 32Q0 8 24 8'}${upperTail}`,`M24 24${lowerTail}`];
    else if(left==='top')paths=[`M0 0Q1 8 12 8${upperTail}`,`${joined?`M${-connector} 24`:'M16 24'}${lowerTail}`];
    else paths=[`${joined?`M${-connector} 8`:'M16 8'}${upperTail}`,`M0 32Q1 24 12 24${lowerTail}`];
    if(closed)paths.push(`M${width} 8V24`);
    return {paths,svg:paths.map(d=>`<path d="${d}" fill="none" stroke="${xml(ink)}" stroke-width="8" stroke-linecap="butt" stroke-linejoin="round"/>`).join(''),outputs:{upper:['straight','lowerHook','closed','bridge'].includes(right),lower:['straight','upperHook','closed','upperBridge'].includes(right)},entry:left};
  }
  function render(text, options={}) {
    const o={...defaults,...options};
    const width=Math.max(300,Math.min(2400,Number(o.width)||1000));
    const size=Math.max(.45,Math.min(2.5,Number(o.size)||1));
    const spacing=Math.max(.6,Math.min(2,Number(o.spacing)||1));
    const source=compose(text), margin=44, max=(width-2*margin)/size;
    const line=110,gap=o.joined?0:20*spacing;
    // Keep words together; only words wider than the page split by glyph.
    const groups=[];let group=[];
    for(const item of source.items) {
      if(['space','newline'].includes(item.type)){if(group.length)groups.push(group);groups.push([item]);group=[];}else group.push(item);
    }
    if(group.length)groups.push(group);
    const measure=t=>t.type==='consonant'?Math.max((ending[t.key]==='closed'?64:100)*spacing,26*t.vowels.length+14,t.marks.length?28*t.marks.length+72:0):t.type==='vowel'?Math.max(o.initial==='special'&&INITIALS[t.key]?INITIALS[t.key].width:32,t.marks.length?20*(t.marks.length-1)+40:0):t.type==='space'?42*spacing:26;
    let x=0,y=54,lines=1,paint=[],guides=[],previous=null;
    const placements=[],joins=[];
    const nextLine=()=>{x=0;y+=line;lines++;previous=null;};
    for(const g of groups) {
      if(g[0].type==='newline'){nextLine();continue;}
      const gw=g.reduce((n,t,i)=>n+measure(t)+(t.type==='consonant'?gap:0)+(o.joined&&i>0&&g[i-1].type==='consonant'&&t.type==='consonant'&&['top','bottom'].includes(entry[t.key])?8:0),0);
      if(x>0&&g[0].type!=='space'&&x+gw>max)nextLine();
      for(const t of g) {
        const natural=measure(t),fit=Math.min(1,max/natural),w=natural*fit;
        if(t.type==='space'){if(x>0)x+=w;previous=null;continue;}
        let leading=o.joined&&previous&&t.type==='consonant'&&['top','bottom'].includes(entry[t.key])?8:0;
        if(x>0&&x+leading+w>max){nextLine();leading=0;}
        x+=leading;
        if(t.type==='consonant') {
          // End each cell exactly where the next starts. Inverting letters
          // consume the incoming rail with a horizontal-tangent S curve.
          const connected=!!(o.joined&&previous),shape=cell(t.key,natural,connected,o.ink,leading/fit);
          if(connected&&['down','up'].includes(shape.entry)) {
            const track=shape.entry==='down'?'upper':'lower',startY=track==='upper'?8:24;
            const from={x:previous.end,y:y+startY*previous.scale},to={x,y:y+startY*fit};
            joins.push({fromKey:previous.key,toKey:t.key,flow:shape.entry==='down'?'upper-to-lower':'lower-to-upper',from,to,continuous:previous.outputs[track]&&Math.abs(from.x-to.x)<.001&&Math.abs(from.y-to.y)<.001});
          }
          paint.push(`<g transform="translate(${x} ${y}) scale(${fit})" data-letter="${xml(t.key)}">${shape.svg}${t.vowels.map((v,i)=>vowel(v,28+i*26,-12,o.ink)).join('')}${t.marks.map((m,i)=>mark(m,40+i*28,16,o.ink)).join('')}${t.stress?`<path d="M18-29h10" fill="none" stroke="${xml(o.ink)}" stroke-width="3"/>`:''}</g>`);
          placements.push({key:t.key,x,y,width:w,scale:fit,vowels:t.vowels.length,marks:t.marks.length,paths:shape.paths,entry:shape.entry,entryGap:leading});
          previous={key:t.key,end:x+w,scale:fit,outputs:shape.outputs};
        } else if(t.type==='vowel') {
          const special=o.initial==='special'&&INITIALS[t.key];
          paint.push(`<g transform="translate(${x} ${y}) scale(${fit})" data-initial-vowel="${xml(t.key)}">${special?initialVowel(t.key,o.ink):vowel(t.key,13,16,o.ink)}${t.marks.map((m,i)=>mark(m,(special?24:14)+i*20,16,o.ink)).join('')}${t.stress?`<path d="M12-12h10" stroke="${xml(o.ink)}" stroke-width="3"/>`:''}</g>`);previous=null;
        }
        else {
          paint.push(`<text x="${x}" y="${y+24}" font-family="Georgia,serif" font-size="26" fill="${['unknown','mark'].includes(t.type)?'#a53e29':xml(o.ink)}">${xml(t.raw)}</text>`);previous=null;
        }
        x+=w+(t.type==='consonant'?gap:0);
      }
    }
    const height=Math.max(210,Math.ceil((y+64)*size+margin));
    if(o.guides)for(let i=0;i<lines;i++)guides.push(`<path d="M0 ${54+i*line+8}H${max}M0 ${54+i*line+24}H${max}" stroke="#9eacb6" stroke-width=".6" stroke-dasharray="3 7" fill="none"/>`);
    const bg=o.transparent?'':`<rect width="100%" height="100%" fill="${xml(o.background)}"/>`;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${xml(text||'Empty script composition')}"><title>${xml(text||'Script composition')}</title>${bg}<g transform="translate(${margin} 8) scale(${size})">${guides.join('')}${paint.join('')}</g></svg>`;
    return {svg,width,height,lines,unknown:source.unknown,placements,joins,orphanMarks:source.items.filter(t=>t.type==='mark').map(t=>t.raw),marks:source.tokens.filter(t=>t.type==='mark').length,consonants:source.items.filter(t=>t.type==='consonant').length,vowels:source.tokens.filter(t=>t.type==='vowel').length};
  }
  const api={consonants:C,vowels:V,initials:INITIALS,marks:MARKS,defaults,tokenize,compose,glyph,vowel,initialVowel,mark,cell,preview,render,xml};
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.ScriptEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this);
