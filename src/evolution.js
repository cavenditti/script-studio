/* A provisional fictional genealogy. The classical profile is Carlo's original. */
(function(root){
  'use strict';
  const E=typeof module==='object'&&module.exports?require('./engine.js'):root.ScriptEngine;
  const D=typeof module==='object'&&module.exports?require('./descendants.js'):root.ScriptDescendants;
  const profiles=[
    {id:'stone',name:'Stone Register',era:'−700 to −350',parent:null,branch:'Common ancestry',material:'Incised boundary stones and counting slips',mode:'cut',stroke:5.8,detached:true,
      change:'Separate signs; bends become short angular cuts and dots become diamond punctures.',reason:'Two ruled guides begin as alignment aids. A lifted tool leaves each consonant independent.',retained:'The two levels and the direction of each returning stroke already distinguish sign families.'},
    {id:'reed',name:'Early Ink',era:'−350 to 0',parent:'stone',branch:'Common ancestry',material:'Reed pen on prepared sheets',mode:'reed',stroke:6.5,detached:true,
      change:'Curved returns replace cut corners; signs remain separate, with round pen stops.',reason:'Copyists lift the pen between signs but round the turn inside each letter.',retained:'Vowels stay associated with one consonant rather than becoming an independent alphabet.'},
    {id:'classical',name:'Classical',era:'0 to 300',parent:'reed',branch:'The original script',material:'Formal pen writing and teaching copies',mode:'classical',stroke:8,detached:false,
      change:'Straight rails join across letters; genuine rail changes receive a flowing S-curve.',reason:'A school standard regularizes the hand without erasing outside legs or internal returns.',retained:'The current original rendering is preserved exactly; reconstructed curves remain open to the creator’s refinement.'},
    {id:'ridge',name:'Ridge Cut',era:'300 to 900',parent:'classical',branch:'Northern branch',material:'Narrow wood and metal labels',mode:'ridge',stroke:7,detached:true,
      change:'Word ribbons separate into signs; curves become chamfers, hooks become short beaks, and dots become diamonds.',reason:'The branch resegments an inherited cursive system for a cutting tool. It resembles the ancestor through convergence, not direct descent.',retained:'Upper and lower returns remain distinct; vowels are still written explicitly.'},
    {id:'delta',name:'Delta Cursive',era:'300 to 900',parent:'classical',branch:'River branch',material:'Quick contracts on inexpensive sheets',mode:'delta',stroke:6.4,detached:false,
      change:'Terminal return bowls open into oblique strokes; round dots stretch into pen-shaped ovals.',reason:'Writers shorten the turn at the end of a sign while keeping the continuous rails.',retained:'Switch direction, outside legs, vowel attachment, and the eight prosodic distinctions survive.'},
    {id:'island',name:'Island Bookhand',era:'300 to 1000',parent:'classical',branch:'Maritime branch',material:'Long-lived bound manuscripts',mode:'book',stroke:7.2,detached:false,
      change:'Return bowls broaden and end in a short inward foot; square end bars acquire rounded ends.',reason:'Book copyists exaggerate the returns that distinguish similar letter families.',retained:'The running band is retained rather than replaced by isolated letters.'},
    {id:'civic',name:'Civic Print',era:'900 onward',parent:'delta',influences:['ridge','island'],branch:'Later river standard',material:'Reusable type and public signs',mode:'civic',stroke:7.5,detached:false,
      change:'Delta’s open returns gain a short horizontal foot; curves use repeatable chamfers and round marks return.',reason:'A river printing standard adopts cut corners from Ridge and explicit return feet from Island. Those are borrowings, not extra parents.',retained:'Rail continuity remains the organizing feature, with each vowel and tone still recoverable.'},
    {id:'ridge-alpha',name:'Ridge Alphabet',era:'750 onward',parent:'ridge',branch:'Northern alphabetic branch',material:'Independent letters for names, loans and public reading',mode:'alphabet',system:'alphabet',stroke:3.4,detached:true,
      change:'The long guide rails disappear. Consonants become compact free-standing letters, and every vowel gains an equally full baseline letter.',reason:'Ridge teachers promote the old initial-vowel forms to ordinary vowels and detach the diagnostic joints of consonants from their two-rail scaffolding.',retained:'One full letter records each typed consonant or vowel, including gh, c and g as single sounds; tone and stress remain explicit.'},
    {id:'harbor',name:'Harbor Blocks',era:'850 onward',parent:'island',influences:['ridge-alpha'],branch:'Maritime syllable-block branch',material:'Compact syllable seals and manuscript monograms',mode:'blocks',system:'blocks',stroke:3.4,detached:true,
      change:'A fused syllable sign of simplified one-shape components replaces the word ribbon: initial consonants above, vowels in the middle, final consonants below, overlapping and joined by shared rails and short curved ligatures, then drawn as one outlined pictogram. Every row reads left to right.',reason:'Island syllable seals are regularized by a teaching reform. It borrows recognizable sound forms from Ridge Alphabet, while keeping the syllable as the unit of writing.',retained:'Up to three initials, two vowels and three finals fuse into one sign. Tone sits beside the sign and primary stress above it. · sets a boundary; oversized groups use a readable bracketed spell-out.'}
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
  function style(svg,hand){
    const p=get(hand);if(p.id==='classical')return svg;
    const ratio=p.stroke/8;
    let result=svg.replace(/\bd="([^"]*)"/g,(_,d)=>'d="'+evolvePath(d,p.mode)+'"');
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
    return result;
  }
  function render(text,options={}){
    const p=get(options.hand);
    if(p.system)return {...D.render(text,options,p.system),hand:p.id};
    const base=E.render(text,{...options,joined:p.detached?false:options.joined===undefined?true:options.joined});
    let svg=style(base.svg,p.id);
    if(options.idPrefix){const prefix=String(options.idPrefix).replace(/[^a-zA-Z0-9_-]/g,'')||'specimen';svg=svg.replace(/id="(through-\d+)"/g,(_,id)=>`id="${prefix}-${id}"`).replace(/url\(#(through-\d+)\)/g,(_,id)=>`url(#${prefix}-${id})`);}
    return {...base,hand:p.id,svg};
  }
  const preview=(key,type,hand)=>get(hand).system?D.preview(key,type,get(hand).system):style(E.preview(key,type),hand);
  const mini=hand=>get(hand).system?D.compact(render('nat',{hand,width:300,transparent:true})):render('nat',{hand,width:300,transparent:true}).svg.replace(/viewBox="[^"]*"/,'viewBox="32 35 240 76"');
  const specimen=hand=>{const r=render('din rento',{hand,width:650,transparent:true,idPrefix:'history-detail'});return get(hand).system?D.compact(r):r.svg.replace(/width="650" height="210" viewBox="[^"]*"/,'width="620" height="105" viewBox="25 25 620 105"');};
  const api={profiles,get,evolvePath,style,render,preview,mini,specimen};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.ScriptEvolution=api;
})(typeof globalThis!=='undefined'?globalThis:this);
