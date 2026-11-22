(function(){
  'use strict';
  const E=ScriptEngine,P=ScriptPhonetics,$=id=>document.getElementById(id);let storageKey='carlo-script-studio-v1';
  const source=$('source');let current,saveTimer,toastTimer,canStore=true,clearedDraft=null;
  // Illustrative phonetic labels, not a claimed transcription of the original.
  const demo='ghera shoma\nkaru vèna';
  const controlIds=['size','initial','ink','joined','guides','transparent'];
  const options=()=>({size:Number($('size').value)/100,spacing:.85,initial:$('initial').value,ink:$('ink').value,joined:$('joined').checked,guides:$('guides').checked,transparent:$('transparent').checked,width:Math.max(300,Math.min(1000,Math.round($('paper').clientWidth||1000))),background:$('ink').value==='#ffffff'?'#1b292c':'#ffffff'});
  const documentData=()=>({format:'carlo-script-studio',version:1,text:source.value,options:options()});
  function toast(text){$('toast').textContent=text;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,3800);}
  function saveDraft(){try{localStorage.setItem(storageKey,JSON.stringify(documentData()));$('draft-status').textContent='Saved locally';}catch{canStore=false;$('draft-status').textContent='Use Save to keep this draft';}}
  function render(persist=true){
    current=E.render(source.value,options());
    $('rendered').innerHTML=current.svg;
    $('example-note').hidden=source.value!==demo;
    $('empty-preview').hidden=!!source.value.trim();
    $('paper').classList.toggle('dark-paper',$('ink').value==='#ffffff');
    $('input-count').textContent=`${Array.from(source.value).length} chars`;
    $('size-value').value=$('size').value+'%';
    const warnings=[];
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
    for(const id of ['joined','guides','transparent'])if(typeof o[id]==='boolean')$(id).checked=o[id];
    if(typeof o.size==='number'&&Number.isFinite(o.size))$('size').value=Math.min(1.8,Math.max(.6,o.size))*100;
    for(const id of ['initial','ink'])if([...$(id).options].some(item=>item.value===o[id]))$(id).value=o[id];
  }
  function insert(value){const start=source.selectionStart,end=source.selectionEnd;if(source.value.length-(end-start)+value.length>100000){toast('Document limit reached: 100,000 characters.');return;}clearedDraft=null;$('clear').textContent='Clear';source.setRangeText(value,start,end,'end');source.focus();render();}
  function soundButton(key,type){
    const g=type==='mark'?E.marks[key]:type==='consonant'?E.consonants[key]:E.vowels[key],sound=P.sounds[key];
    const button=document.createElement('button');button.type='button';button.className='glyph-button'+(type==='vowel'?' vowel-button':'');const value=type==='mark'?`{${key}}`:key;
    const label=type==='mark'?g.name:sound?.ipa||key;
    const forms=type==='vowel'?`<span class="vowel-forms"><span title="Diacritic">${E.preview(key,'vowel')}</span><span title="Word-initial form">${E.preview(key,'initial')}</span></span>`:E.preview(key,type);
    button.innerHTML=forms+`<span class="${type==='mark'?'mark-label':'sound-label'}">${E.xml(label)}</span>`+(type==='mark'?`<span class="mark-ipa">${g.ipa}</span>`:sound?.ipa&&sound.ipa!==key?`<span class="key-hint">${E.xml(key)}</span>`:'');
    button.title=type==='mark'?`${g.name}${g.kind==='tone'?' tone':' stress'} /${g.ipa}/ · ${g.label} · ${value}`:`${key} · ${sound?.ipa?'/'+sound.ipa+'/ · ':''}${sound?.name||g.label}`;
    button.setAttribute('aria-label',`Insert ${type==='mark'?g.name:key}${type==='mark'?' /'+g.ipa+'/':sound?.ipa?' /'+sound.ipa+'/':''}`);button.addEventListener('click',()=>insert(value));return button;
  }
  for(const [type,id] of [['consonant','consonant-palette'],['vowel','vowel-palette']]){
    $(id).replaceChildren();
    for(const group of P.groups[type]){
      const section=document.createElement('section');section.className='phonetic-group';
      const heading=document.createElement('h3');heading.textContent=group.label;heading.title=group.help;section.append(heading);
      const palette=document.createElement('div');palette.className='palette sound-palette'+(type==='vowel'?' paired-vowel-palette':'');group.keys.forEach(key=>palette.append(soundButton(key,type)));section.append(palette);$(id).append(section);
    }
  }
  $('mark-palette').replaceChildren();Object.keys(E.marks).forEach(key=>$('mark-palette').append(soundButton(key,'mark')));
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
  $('download-app').addEventListener('click',()=>{const copy=document.documentElement.cloneNode(true),offlineId=globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2);copy.querySelector('#document-data').textContent=JSON.stringify({...documentData(),offlineId}).replace(/</g,'\\u003c');copy.querySelector('#references').removeAttribute('open');copy.querySelector('#toast').setAttribute('hidden','');download('<!doctype html>\n'+copy.outerHTML,'text/html','Script-Studio.html');toast('Offline copy saved, including your current composition.');});
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
