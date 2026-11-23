(function(){
  'use strict';
  const E=ScriptEngine,P=ScriptPhonetics,H=ScriptEvolution,L=typeof ScriptPhilology==='object'?ScriptPhilology:null,$=id=>document.getElementById(id);let storageKey='carlo-script-studio-v1';
  const source=$('source');let current,saveTimer,toastTimer,canStore=true,clearedDraft=null;
  // Illustrative phonetic labels, not a claimed transcription of the original.
  const demo='ghera shoma\nkaru vèna';
  const controlIds=['size','initial','ink','hand','joined','guides','transparent'];
  const options=()=>({size:Number($('size').value)/100,spacing:.85,initial:$('initial').value,ink:$('ink').value,hand:$('hand').value,joined:$('joined').checked,guides:$('guides').checked,transparent:$('transparent').checked,width:Math.max(300,Math.min(1000,Math.round($('paper').clientWidth||1000))),background:$('ink').value==='#ffffff'?'#1b292c':'#ffffff'});
  const documentData=()=>({format:'carlo-script-studio',version:1,text:source.value,options:options()});
  function toast(text){$('toast').textContent=text;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,3800);}
  function saveDraft(){try{localStorage.setItem(storageKey,JSON.stringify(documentData()));$('draft-status').textContent='Saved locally';}catch{canStore=false;$('draft-status').textContent='Use Save to keep this draft';}}
  function render(persist=true){
    current=H.render(source.value,options());
    if(paletteHand!==current.hand){buildPalettes();paletteHand=current.hand;}
    $('open-evolution').textContent=H.get(current.hand).name;
    const profile=H.get(current.hand);
    $('joined').disabled=profile.detached;
    $('initial').disabled=!!profile.system;
    const hints={alphabet:['Each sound has a full letter.','Full vowel letters'],capitals:['Each sound is one unbroken stroke.','Single-stroke vowel letters'],incised:['A vowel after a consonant is a small raised letter.','Vowel letters · raised after a consonant'],blocks:['One block per syllable. Use · to set a boundary.','Vowel components · middle row of each block'],seal:['One seal cell per syllable. Use · to set a boundary.','Vowel components · inside the rail chamber'],roundel:['One circle per syllable. Write #tun, #lon, #nèl, #tas, #we, #wu, #ru, #su or #na for an ideogram.','Vowel components · inside each circle']};
    const hint=hints[profile.system]||['Vowels follow their consonant.','Diacritic · word-initial form'];
    $('attachment-hint').textContent=hint[0];
    $('vowel-form-legend').textContent=hint[1];
    $('rendered').innerHTML=current.svg;
    $('example-note').hidden=source.value!==demo;
    $('empty-preview').hidden=!!source.value.trim();
    $('paper').classList.toggle('dark-paper',$('ink').value==='#ffffff');
    $('input-count').textContent=`${Array.from(source.value).length} chars`;
    $('size-value').value=$('size').value+'%';
    const warnings=[...(current.notes||[])];
    if(current.unknown.length)warnings.push(`No assigned signs for: ${current.unknown.join(', ')}. These stay visible in rust; use the chart’s labels to replace them.`);
    if(current.orphanMarks.length)warnings.push(`Place ${current.orphanMarks.join(', ')} after a consonant or initial vowel to attach the mark.`);
    $('render-warning').hidden=!warnings.length;$('render-warning').textContent=warnings.join(' ');
    $('export-svg').disabled=$('export-png').disabled=!source.value.trim();
    if(persist){clearTimeout(saveTimer);saveTimer=setTimeout(saveDraft,400);}
  }
  function applyDocument(data){
    if(!data||data.format!=='carlo-script-studio'||data.version!==1||typeof data.text!=='string'||data.text.length>100000)throw new Error('Choose a Script Studio document (version 1, up to 100,000 characters).');
    clearedDraft=null;$('clear').textContent='Clear';
    source.value=data.text;
    const o=data.options||{};
    $('hand').value=H.get(o.hand).id;
    for(const id of ['joined','guides','transparent'])if(typeof o[id]==='boolean')$(id).checked=o[id];
    if(typeof o.size==='number'&&Number.isFinite(o.size))$('size').value=Math.min(1.8,Math.max(.6,o.size))*100;
    for(const id of ['initial','ink'])if([...$(id).options].some(item=>item.value===o[id]))$(id).value=o[id];
  }
  function insert(value){const start=source.selectionStart,end=source.selectionEnd;if(source.value.length-(end-start)+value.length>100000){toast('Document limit reached: 100,000 characters.');return;}clearedDraft=null;$('clear').textContent='Clear';source.setRangeText(value,start,end,'end');source.focus();render();}
  function soundButton(key,type){
    const g=type==='mark'?E.marks[key]:type==='consonant'?E.consonants[key]:E.vowels[key],sound=P.sounds[key];
    const button=document.createElement('button');button.type='button';button.className='glyph-button'+(type==='vowel'?' vowel-button':'');const value=type==='mark'?`{${key}}`:key;
    const label=type==='mark'?g.name:sound?.ipa||key;
    const preview=(key,type)=>H.preview(key,type,$('hand').value);
    const independent=!!H.get($('hand').value).system;
    if(type==='vowel'&&independent)button.classList.add('independent-vowel');
    const forms=type==='vowel'&&independent?`<span class="vowel-forms">${preview(key,'vowel')}</span>`:type==='vowel'?`<span class="vowel-forms"><span title="Diacritic">${preview(key,'vowel')}</span><span title="Word-initial form">${preview(key,'initial')}</span></span>`:preview(key,type);
    button.innerHTML=forms+`<span class="${type==='mark'?'mark-label':'sound-label'}">${E.xml(label)}</span>`+(type==='mark'?`<span class="mark-ipa">${g.ipa}</span>`:sound?.ipa&&sound.ipa!==key?`<span class="key-hint">${E.xml(key)}</span>`:'');
    button.title=type==='mark'?`${g.name}${g.kind==='tone'?' tone':' stress'} /${g.ipa}/ · ${g.label} · ${value}`:`${key} · ${sound?.ipa?'/'+sound.ipa+'/ · ':''}${sound?.name||g.label}`;
    button.setAttribute('aria-label',`Insert ${type==='mark'?g.name:key}${type==='mark'?' /'+g.ipa+'/':sound?.ipa?' /'+sound.ipa+'/':''}`);button.addEventListener('click',()=>insert(value));return button;
  }
  let paletteHand=null;
  function buildPalettes(){for(const [type,id] of [['consonant','consonant-palette'],['vowel','vowel-palette']]){
    $(id).replaceChildren();
    for(const group of P.groups[type]){
      const section=document.createElement('section');section.className='phonetic-group';
      const heading=document.createElement('h3');heading.textContent=group.label;heading.title=group.help;section.append(heading);
      const palette=document.createElement('div');palette.className='palette sound-palette'+(type==='vowel'?' paired-vowel-palette':'');group.keys.forEach(key=>palette.append(soundButton(key,type)));section.append(palette);$(id).append(section);
    }
  }
  $('mark-palette').replaceChildren();Object.keys(E.marks).forEach(key=>$('mark-palette').append(soundButton(key,'mark')));}
  buildPalettes();
  const tabKinds=['consonants','vowels','marks'];
  function selectPalette(kind,focus=false){
    for(const item of tabKinds){const selected=item===kind;$('tab-'+item).setAttribute('aria-selected',String(selected));$('tab-'+item).tabIndex=selected?0:-1;$('panel-'+item).hidden=!selected;}
    const groups=P.groups[kind==='consonants'?'consonant':'vowel'];
    $('phonetic-legend').innerHTML=kind==='marks'?'<p>Tone sets the pitch pattern; stress marks syllable prominence. They can combine. The external bar marks primary stress /ˈ/; the internal bar marks secondary stress /ˌ/.</p><dl>'+Object.entries(E.marks).map(([key,m])=>`<dt>${E.xml(m.name)} /${m.ipa}/</dt><dd>${m.label} · {${key}}</dd>`).join('')+'</dl>':'<dl>'+groups.map(g=>`<dt>${E.xml(g.label)}</dt><dd>${E.xml(g.help)}</dd>`).join('')+'</dl>';
    if(focus)$('tab-'+kind).focus();
  }
  tabKinds.forEach((kind,index)=>{const tab=$('tab-'+kind);tab.addEventListener('click',()=>selectPalette(kind));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%3;else if(event.key==='ArrowLeft')next=(index+2)%3;else if(event.key==='Home')next=0;else if(event.key==='End')next=2;else return;event.preventDefault();selectPalette(tabKinds[next],true);});});selectPalette('consonants');
  function download(content,type,name){const url=URL.createObjectURL(content instanceof Blob?content:new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
  const filename=()=>((source.value.trim().split(/\s/)[0]||'composition').replace(/[^a-zA-Z0-9èòæœşž-]/g,'').slice(0,32)||'composition');
  source.addEventListener('input',()=>{clearedDraft=null;$('clear').textContent='Clear';render();});controlIds.forEach(id=>$(id).addEventListener('input',()=>render()));
  $('export-svg').addEventListener('click',()=>{download(current.svg,'image/svg+xml',filename()+'.svg');toast('SVG exported.');});
  $('export-png').addEventListener('click',async()=>{
    const button=$('export-png'),snapshot={...current};button.disabled=true;button.textContent='Saving…';
    try{
      const image=new Image(),url=URL.createObjectURL(new Blob([snapshot.svg],{type:'image/svg+xml'}));
      try{await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error('Could not render the artwork. Try exporting SVG.'));image.src=url;});
        const canvas=document.createElement('canvas');const scale=Math.min(3,16000/Math.max(snapshot.width,snapshot.height));canvas.width=Math.ceil(snapshot.width*scale);canvas.height=Math.ceil(snapshot.height*scale);const ctx=canvas.getContext('2d');if(!ctx)throw new Error('PNG export is unavailable. Try exporting SVG.');ctx.drawImage(image,0,0,canvas.width,canvas.height);
        const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('Could not export this image. Try a shorter passage or export SVG.');download(blob,'image/png',filename()+'.png');toast('PNG exported.');
      }finally{URL.revokeObjectURL(url);}
    }catch(error){toast(error.message);}finally{button.disabled=!source.value.trim();button.textContent='PNG';}
  });
  $('save-document').addEventListener('click',()=>{saveDraft();download(JSON.stringify(documentData(),null,2),'application/json',filename()+'.script.json');toast('Document saved.');});
  $('open-document').addEventListener('click',()=>$('document-file').click());
  $('document-file').addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;
    try{if(file.size>2*1024*1024)throw new Error('That file is too large. Choose a Script Studio document under 2 MB.');const data=JSON.parse(await file.text());
      if(source.value.trim())download(JSON.stringify(documentData(),null,2),'application/json','before-open.script.json');
      applyDocument(data);render();toast('Document opened. The previous text was saved as a backup.');
    }catch(error){toast(error instanceof SyntaxError?'This is not a valid document. Choose a .script.json file.':error.message);}event.target.value='';
  });
  $('clear').addEventListener('click',()=>{if(clearedDraft!==null&&!source.value){source.value=clearedDraft;clearedDraft=null;$('clear').textContent='Clear';render();source.focus();return;}if(!source.value)return;clearedDraft=source.value;source.value='';$('clear').textContent='Undo clear';render();toast('Cleared. Choose Undo clear to restore the text.');});
  const reference=()=>$('references').showModal();$('open-reference').addEventListener('click',reference);$('close-reference').addEventListener('click',()=>$('references').close());$('references').addEventListener('click',e=>{if(e.target===$('references')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
  // Language behind the hand: variety, sound changes, grammar, cognates and
  // example sentences drawn in this hand's own spelling and word division.
  function exampleArt(text,hand,i){
    return H.render(text,{hand,width:1600,transparent:true,idPrefix:`philology-${hand}-${i}`}).svg;
  }
  // Crop each drawing to its ink once it is in the document.
  function cropArt(){
    for(const svg of $('history-detail').querySelectorAll('.philology-art svg')){
      if(typeof svg.getBBox!=='function')continue;
      try{const b=svg.getBBox(),pad=8;if(!b.width)continue;svg.setAttribute('viewBox',`${b.x-pad} ${b.y-pad} ${b.width+2*pad} ${b.height+2*pad}`);svg.setAttribute('width',String(Math.round(b.width+2*pad)));svg.setAttribute('height',String(Math.round(b.height+2*pad)));}catch{}
    }
  }
  function philology(hand){
    if(!L)return '';
    const s=L.get(hand),x=E.xml;
    const cognates=L.meanings.map((m,i)=>`<tr><th scope="row">${x(m)}</th><td lang="x-talar">${x(s.cognates[i])}</td></tr>`).join('');
    const examples=s.examples.map((e,i)=>`<figure class="philology-example"><div class="philology-art">${exampleArt(e.text,hand,i)}</div><figcaption><span class="philology-text" lang="x-talar">${x(e.text)}</span><span class="philology-gloss">${x(e.gloss)}</span><span class="philology-parts">${x(e.parts)}</span></figcaption></figure>`).join('');
    return `<section class="philology" aria-label="Language"><h4>${x(s.language)}</h4><p class="philology-type">${x(s.morphology)} · ${x(s.division)}</p><dl><dt>Sound changes</dt><dd><ul>${s.sound.map(t=>`<li>${x(t)}</li>`).join('')}</ul></dd><dt>Grammar</dt><dd>${x(s.grammar)}</dd></dl><table class="philology-cognates"><caption>Cognates</caption><tbody>${cognates}</tbody></table><h4 class="philology-examples-title">In this hand</h4>${examples}</section>`;
  }
  function showStage(id){
    const p=H.get(id);$('history-stage').value=p.id;
    const sample=H.specimen(p.id);
    $('history-detail').innerHTML=`<h3>${E.xml(p.name)}</h3><p class="history-branch">${E.xml(p.branch)} · ${E.xml(p.era)}</p><div class="history-specimen">${sample}</div><p class="history-material">${E.xml(p.material)}</p><button class="button primary" id="use-hand">Use this hand</button><dl><dt>What changes</dt><dd>${E.xml(p.change)}</dd><dt>Why it changes</dt><dd>${E.xml(p.reason)}</dd><dt>What survives</dt><dd>${E.xml(p.retained)}</dd></dl>${philology(p.id)}`;
    cropArt();
    for(const b of $('history-tree').querySelectorAll('button'))b.setAttribute('aria-pressed',String(b.dataset.hand===p.id));
    $('use-hand').addEventListener('click',()=>{$('hand').value=p.id;render();$('evolution').close();});
  }
  // Each branch gets width in proportion to the stages it ends in.
  const leaves=id=>{const kids=H.profiles.filter(p=>p.parent===id);return kids.length?kids.reduce((sum,p)=>sum+leaves(p.id),0):1;};
  function historyBranch(parent){return '<ul>'+H.profiles.filter(p=>p.parent===parent).map(p=>`<li style="flex-grow:${leaves(p.id)}"><button class="history-node" data-hand="${p.id}" aria-pressed="false"><b>${E.xml(p.name)}</b><span>${E.xml(p.era)}</span><span class="history-mini" aria-hidden="true">${H.mini(p.id)}</span></button>${historyBranch(p.id)}</li>`).join('')+'</ul>';}
  $('history-tree').innerHTML=historyBranch(null);
  if(L){$('history-intro').textContent=L.intro;$('history-pitfalls').innerHTML=L.pitfalls.map(t=>`<li>${E.xml(t)}</li>`).join('');}
  $('history-stage').replaceChildren();
  for(const p of H.profiles){const o=document.createElement('option');o.value=p.id;o.textContent=p.name;$('history-stage').append(o);}
  for(const b of $('history-tree').querySelectorAll('button'))b.addEventListener('click',()=>showStage(b.dataset.hand));
  $('history-stage').addEventListener('change',()=>showStage($('history-stage').value));
  $('open-evolution').addEventListener('click',()=>{showStage($('hand').value);$('evolution').showModal();$('evolution').scrollTop=0;});
  $('close-evolution').addEventListener('click',()=>$('evolution').close());
  $('download-app').addEventListener('click',()=>{const copy=document.documentElement.cloneNode(true),offlineId=globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2);copy.querySelector('#document-data').textContent=JSON.stringify({...documentData(),offlineId}).replace(/</g,'\\u003c');copy.querySelector('#references').removeAttribute('open');copy.querySelector('#evolution').removeAttribute('open');copy.querySelector('#toast').setAttribute('hidden','');download('<!doctype html>\n'+copy.outerHTML,'text/html','Script-Studio.html');toast('Offline copy saved, including your current composition.');});
  let restored=false;
  let embedded=null,saved=null;
  try{embedded=JSON.parse($('document-data').textContent);}catch{}
  if(embedded&&typeof embedded.offlineId==='string'&&/^[a-zA-Z0-9-]{1,100}$/.test(embedded.offlineId))storageKey+=':'+embedded.offlineId;
  try{saved=localStorage.getItem(storageKey);}catch{canStore=false;}
  if(saved)try{applyDocument(JSON.parse(saved));restored=true;$('draft-status').textContent='Draft restored';}catch{canStore=false;}
  if(!restored&&embedded)try{applyDocument(embedded);restored=true;$('draft-status').textContent='Offline draft';}catch{}
  if(!restored){source.value=demo;$('draft-status').textContent='Example text';}
  if(!canStore)$('draft-status').textContent='Use Save to keep this draft';
  render(false);
  window.addEventListener('resize',()=>render(false));
  window.addEventListener('pagehide',()=>{if(canStore)saveDraft();});
  window.ScriptStudio={render,documentData,applyDocument};
})();
