/* A provisional fictional genealogy. The classical profile is Carlo's original. */
(function(root){
  'use strict';
  const E=typeof module==='object'&&module.exports?require('./engine.js'):root.ScriptEngine;
  const D=typeof module==='object'&&module.exports?require('./descendants.js'):root.ScriptDescendants;
  const profiles=[
    {id:'stone',name:'Stone Register',era:'−700 to −550',parent:null,branch:'Common ancestry',material:'Incised boundary stones and counting slips',mode:'incised',system:'incised',stroke:5,detached:true,
      change:'Free-standing consonant letters cut with a square tool: every curve becomes two straight cuts. A vowel after a consonant is a small raised letter; a vowel at the start of a syllable is full size.',reason:'Counting slips record each sound as its own sign, halfway between a later alphabet and a consonant script with vowel marks.',retained:'The two ruled levels and the direction of each stem already distinguish the letter families that every later branch inherits.'},
    {id:'ridge-alpha',name:'Ridge Alphabet',era:'−550 to −350',parent:'stone',branch:'Upland alphabetic branch',material:'Independent letters scratched on ridge-top tallies and boundary posts',mode:'alphabet',system:'alphabet',stroke:3.4,detached:true,
      change:'The raised vowels of the Stone Register grow into full letters on the line, and the cut corners relax into a light, even stroke. Every consonant and vowel is now an independent letter.',reason:'Upland tally keepers need names and loanwords spelled sound by sound. Writing each vowel at full size makes reading order unambiguous.',retained:'The Stone letter shapes and their stem directions; tone and stress remain explicit marks.'},
    {id:'ridge',name:'Ridge Cut',era:'−550 to −350',parent:'stone',branch:'Lowland ancestor of the ink tradition',material:'Narrow wood and metal labels',mode:'ridge',stroke:7,detached:true,
      change:'Signs stretch along two ruled guide rails; curves become chamfers, hooks short beaks and dots diamonds. Vowels shrink from raised letters into marks over their consonant.',reason:'Label cutters write long and narrow. They hang every sign on the same two rails and reduce vowels to marks, creating the consonant-and-mark structure that every Classical-related script inherits.',retained:'Independent signs and angular cutting from the Stone Register; upper and lower returns stay distinct.'},
    {id:'capitals',name:'Upland Capitals',era:'−350 onward',parent:'ridge-alpha',branch:'Upland alphabetic branch',material:'Chiselled monuments, painted shop signs and wax tablets',mode:'capitals',system:'capitals',stroke:4,detached:true,
      change:'Every Ridge Alphabet letter is reduced to one unbroken stroke, narrowed and lengthened into capital-letter proportions.',reason:'Upland stonecutters and sign painters favour letters that a single chisel run or brush pull can make. The result looks closer to a Latin alphabet than to its ancestors.',retained:'Stem direction (rising or descending) still separates consonant families, and i keeps a dot to distinguish it from j.'},
    {id:'reed',name:'Early Ink',era:'−350 to 0',parent:'ridge',branch:'Common ancestry',material:'Reed pen on prepared sheets',mode:'reed',stroke:6.5,detached:true,
      change:'A reed pen rounds the Ridge chamfers back into curved returns; signs remain separate, with round pen stops.',reason:'Copyists lift the pen between signs but round the turn inside each letter.',retained:'Vowels stay associated with one consonant rather than becoming an independent alphabet.'},
    {id:'classical',name:'Classical',era:'0 to 300',parent:'reed',branch:'The original script',material:'Formal pen writing and teaching copies',mode:'classical',stroke:8,detached:false,
      change:'Straight rails join across letters; genuine rail changes receive a flowing S-curve.',reason:'A school standard regularizes the hand without erasing outside legs or internal returns.',retained:'The current original rendering is preserved exactly; reconstructed curves remain open to the creator’s refinement.'},
    {id:'delta',name:'Delta Cursive',era:'300 to 900',parent:'classical',branch:'River branch',material:'Quick contracts on inexpensive sheets',mode:'delta',stroke:6.4,detached:false,
      change:'A true cursive: the ribbon slants forward, every corner becomes a curve, terminal returns open into oblique strokes and round dots stretch into pen-shaped ovals.',reason:'Contract writers never lift the pen inside a clause; speed slants the line and rounds every turn.',retained:'Switch direction, outside legs, vowel attachment, and the eight prosodic distinctions survive.'},
    {id:'island',name:'Island Bookhand',era:'300 to 1000',parent:'classical',influences:['harbor'],branch:'Maritime branch',material:'Long-lived bound manuscripts',mode:'book',stroke:7.2,detached:false,
      change:'Return bowls broaden and end in a short inward foot; square end bars acquire rounded ends. Late copyists draw the vowels with the compact vowel shapes of Harbor Blocks, set over the Classical ribbon.',reason:'Book copyists exaggerate the returns that distinguish similar letter families. Contact with Harbor writing supplies clearer vowel shapes than the old thin diacritics.',retained:'The running Classical band, its rails, joins and consonant forms.'},
    {id:'seal',name:'Reed Seals',era:'0 to 850',parent:'reed',branch:'Maritime seal branch',material:'Carved seals, stamped cargo tags and clay bullae',mode:'seal',system:'seal',stroke:3.4,detached:true,
      change:'Signs gather into one cell per syllable: initial consonants above, vowels between two short rails kept from the ink line, final consonants below. Each row reads left to right.',reason:'A seal must hold a whole name in a small square, so carvers stack the sounds of each syllable instead of running them along a line.',retained:'Full sound shapes and the two inherited rails, now shortened to a vowel chamber.'},
    {id:'harbor',name:'Harbor Blocks',era:'850 to 1300',parent:'seal',influences:['ridge-alpha'],branch:'Maritime syllable-block branch',material:'Compact syllable seals and manuscript monograms',mode:'blocks',system:'blocks',stroke:3.4,detached:true,
      change:'A fused syllable sign of simplified one-shape components replaces the word ribbon: initial consonants above, vowels in the middle, final consonants below, overlapping and joined by shared rails and short curved ligatures, then drawn as one outlined pictogram. Every row reads left to right.',reason:'Harbor schools regularize the old seal cells for ordinary writing, dropping the chamber and fusing each cell. Their speakers’ language descends from Island Talar; the script descends from the seals and borrows simplified sound forms from the Ridge Alphabet.',retained:'Up to three initials, two vowels and three finals fuse into one sign. Tone sits beside the sign and primary stress above it. · sets a boundary; oversized groups use a readable bracketed spell-out.'},
    {id:'roundel',name:'Harbor Roundels',era:'1300 onward',parent:'harbor',branch:'Late maritime branch',material:'Painted hull marks, harbour ledgers and coin legends',mode:'roundel',system:'roundel',stroke:3,detached:true,
      change:'Each syllable becomes a circle: the vowel sits inside, single-stroke consonants rest on the rim or hang from it. Frequent words are written with ideograms (#word): person, record, water, stone, seen, not, every, some and name.',reason:'As Harbor words wear down to single syllables, many become homophones. Ideograms and a fixed circular frame make crowded ledgers readable at a glance.',retained:'Onset above and coda below, single-stroke consonants, the vowel forms of Harbor Blocks, and the same prosody marks.'}
  ];
  const get=id=>profiles.find(p=>p.id===id)||profiles.find(p=>p.id==='classical');
  const number=n=>String(Math.round(n*100)/100);
  // Parse the small SVG path vocabulary used by the base renderer. Historical
  // allographs alter actual outlines; no skew, font substitution, or bitmap filter.
  function evolvePath(d,mode){
    if(mode==='classical'||mode==='reed')return d;
    const tokens=d.match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?/g)||[];
    const arity={M:2,L:2,H:1,V:1,Q:4,C:6,Z:0};
    let i=0,x=0,y=0,startX=0,startY=0,command='';const out=[];
    const point=(a,b)=>number(a)+' '+number(b);
    while(i<tokens.length){
      if(/[a-zA-Z]/.test(tokens[i]))command=tokens[i++];
      const upper=command.toUpperCase(),relative=command!==upper,n=arity[upper];
      if(n===undefined)throw new Error('Unsupported historical path command: '+command);
      if(upper==='Z'){out.push('Z');x=startX;y=startY;command='';continue;}
      const a=tokens.slice(i,i+n).map(Number);i+=n;
      if(a.length!==n||a.some(v=>!Number.isFinite(v)))throw new Error('Invalid historical outline');
      if(relative){if(upper==='H')a[0]+=x;else if(upper==='V')a[0]+=y;else for(let j=0;j<n;j+=2){a[j]+=x;a[j+1]+=y;}}
      if(upper==='M'){x=a[0];y=a[1];startX=x;startY=y;out.push('M'+point(x,y));command=relative?'l':'L';}
      else if(upper==='H'){x=a[0];out.push('H'+number(x));}
      else if(upper==='V'){y=a[0];out.push('V'+number(y));}
      else if(upper==='L'){x=a[0];y=a[1];out.push('L'+point(x,y));}
      else {
        const endX=a[n-2],endY=a[n-1];
        const hook=upper==='Q'&&endY===16&&(a[1]===8||a[1]===24)&&a[0]===endX;
        if(hook&&mode==='book')out.push('Q'+point(a[0]+4,a[1])+' '+point(endX+4,endY)+'H'+number(endX-2));
        else if(hook&&(mode==='delta'||mode==='civic'))out.push('L'+point(endX+2,endY)+(mode==='civic'?'H'+number(endX-3):''));
        else if(mode==='cut'||mode==='ridge'||mode==='civic'){
          const at=t=>upper==='Q'?[(1-t)**2*x+2*(1-t)*t*a[0]+t*t*endX,(1-t)**2*y+2*(1-t)*t*a[1]+t*t*endY]:[(1-t)**3*x+3*(1-t)**2*t*a[0]+3*(1-t)*t*t*a[2]+t**3*endX,(1-t)**3*y+3*(1-t)**2*t*a[1]+3*(1-t)*t*t*a[3]+t**3*endY];
          const times=mode==='cut'?[.5]:[.25,.75];
          times.forEach(t=>out.push('L'+point(...at(t))));out.push('L'+point(endX,endY));
        }else out.push(upper+a.map(number).join(' '));
        x=endX;y=endY;
      }
    }
    return out.join('');
  }
  // Island Bookhand borrows Harbor's compact vowel shapes and sets them over
  // the Classical ribbon in place of the thin diacritics. The placeholder
  // attribute hd= keeps the borrowed path out of the ribbon transforms below.
  function harborVowels(svg){
    if(!D.harbor)return svg;
    const art=(key,x,y)=>`<g transform="translate(${x} ${y}) translate(-9.4 -13.2) scale(.52)" data-harbor-vowel="${key}"><path hd="${D.harbor(key).d}" fill="none" stroke="INK" stroke-width="7.4" stroke-linecap="round" stroke-linejoin="round"/>${key==='i'?'<circle cx="17" cy="15" r="2.8" fill="INK"/>':''}</g>`;
    let out=svg;
    for(const [key,v] of Object.entries(E.vowels)){
      if(v.path){const esc=v.path.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');out=out.replace(new RegExp(`<g transform="translate\\(([-\\d.]+) ([-\\d.]+)\\)"><path d="${esc}" fill="none" stroke="([^"]+)"[^>]*/></g>`,'g'),(_,x,y,ink)=>art(key,x,y).replace(/INK/g,ink));}
      else if(v.circle){out=out.replace(new RegExp(`<g transform="translate\\(([-\\d.]+) ([-\\d.]+)\\)"><circle r="${v.circle}" fill="([^"]+)" stroke="([^"]+)" stroke-width="${v.open?2:0}"/></g>`,'g'),(_,x,y,fill,ink)=>art(key,x,y).replace(/INK/g,ink));}
    }
    return out;
  }
  function style(svg,hand){
    const p=get(hand);if(p.id==='classical')return svg;
    const ratio=p.stroke/8;
    if(p.mode==='book')svg=harborVowels(svg);
    let result=svg.replace(/\bd="([^"]*)"/g,(_,d)=>'d="'+evolvePath(d,p.mode)+'"');
    // Delta Cursive: every corner of an open stroke becomes a curve and each
    // letter slants forward about its own origin, so the rails still meet.
    if(p.mode==='delta'&&D.softenPath){
      result=result.replace(/<path d="([^"]*)" fill="none"/g,(_,d)=>`<path d="${D.softenPath(d,7)}" fill="none"`);
      result=result.replace(/transform="translate\(([^)]*)\) scale\(([^)]*)\)" data-letter=/g,(_,t,sc)=>`transform="translate(${t}) scale(${sc}) skewX(-20)" data-letter=`);
    }
    result=result.replace(/<rect x="([^"]+)" y="4" width="8" height="24" fill="([^"]+)" data-square-cap="true"\/>/g,(_,x,ink)=>{
      const right=Number(x)+8;
      if(p.mode==='book')return `<path d="M${number(right-p.stroke/2)} 8V24" stroke="${ink}" stroke-width="8" stroke-linecap="round" data-historical-cap="rounded"/>`;
      return `<rect x="${number(right-p.stroke)}" y="${number(8-p.stroke/2)}" width="${p.stroke}" height="${number(16+p.stroke)}" fill="${ink}" data-historical-cap="cut"/>`;
    });
    // Explicitly alter round allographs while retaining filled/open distinctions.
    if(['cut','ridge'].includes(p.mode))result=result.replace(/<circle ([^>]*?)r="([\d.]+)"([^>]*?)\/>/g,(_,before,r,after)=>`<path d="M0 ${-r}L${r} 0L0 ${r}L${-r} 0Z" transform="translate(${(before.match(/cx="([^"]+)"/)||[])[1]||0} ${(before.match(/cy="([^"]+)"/)||[])[1]||0})" ${before.replace(/c[xy]="[^"]*"/g,'')}${after}/>`);
    if(p.mode==='delta')result=result.replace(/<circle ([^>]*?)r="([\d.]+)"([^>]*?)\/>/g,(_,before,r,after)=>`<ellipse ${before}rx="${number(Number(r)*1.2)}" ry="${number(Number(r)*.82)}"${after}/>`);
    result=result.replace(/stroke-width="([\d.]+)"/g,(_,w)=>`stroke-width="${number(Number(w)*ratio)}"`);
    if(p.mode==='book')result=result.replace(/stroke-linejoin="miter"/g,'stroke-linejoin="round"');
    if(p.mode==='reed'||p.mode==='delta')result=result.replace(/stroke-linecap="butt"/g,'stroke-linecap="round"');
    return result.replace(/ hd="/g,' d="');
  }
  function render(text,options={}){
    const p=get(options.hand);
    if(p.system)return {...D.render(text,options,p.system),hand:p.id};
    const base=E.render(text,{...options,joined:p.detached?false:options.joined===undefined?true:options.joined});
    let source=base.svg;
    // Delta Cursive: the last letter of each word leaves the line with a
    // rising exit stroke, as a pen does before it lifts.
    if(p.mode==='delta'){
      const pl=base.placements;let i=-1;
      source=source.replace(/(<g transform="translate\([^)]*\) scale\(([^)]*)\)" data-letter="[^"]*">)/g,(open,_,sc)=>{
        i++;const a=pl[i],b=pl[i+1];if(!a)return open;
        const last=!b||b.y!==a.y||b.x>a.x+a.width+4;if(!last)return open;
        const w=a.width/(Number(sc)||1);
        return open+`<path d="M${number(w-2)} 24Q${number(w+14)} 24 ${number(w+18)} 6" fill="none" stroke="INKX" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" data-cursive-exit="true"/>`;
      }).replace(/INKX/g,E.xml(options.ink||E.defaults.ink));
    }
    let svg=style(source,p.id);
    if(options.idPrefix){const prefix=String(options.idPrefix).replace(/[^a-zA-Z0-9_-]/g,'')||'specimen';svg=svg.replace(/id="(through-\d+)"/g,(_,id)=>`id="${prefix}-${id}"`).replace(/url\(#(through-\d+)\)/g,(_,id)=>`url(#${prefix}-${id})`);}
    return {...base,hand:p.id,svg};
  }
  const preview=(key,type,hand)=>get(hand).system?D.preview(key,type,get(hand).system):style(E.preview(key,type),hand);
  const mini=hand=>get(hand).system?D.compact(render('nat',{hand,width:300,transparent:true})):render('nat',{hand,width:300,transparent:true}).svg.replace(/viewBox="[^"]*"/,'viewBox="32 35 240 76"');
  const specimen=hand=>{const r=render('din rento',{hand,width:650,transparent:true,idPrefix:'history-detail'});return get(hand).system?D.compact(r):r.svg.replace(/width="650" height="210" viewBox="[^"]*"/,'width="620" height="105" viewBox="25 25 620 105"');};
  const api={profiles,get,evolvePath,style,render,preview,mini,specimen};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.ScriptEvolution=api;
})(typeof globalThis!=='undefined'?globalThis:this);
