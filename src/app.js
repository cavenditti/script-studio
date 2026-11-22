(function(){
  'use strict';
  const E=ScriptEngine,$=id=>document.getElementById(id);let storageKey='carlo-script-studio-v1';
  const source=$('source');let current,saveTimer,toastTimer,canStore=true,clearedDraft=null;
  // Illustrative phonetic labels, not a claimed transcription of the original.
  const demo='ghera shoma\nkaru vèna';
  const controlIds=['size','initial','ink','joined','guides','transparent'];
  const options=()=>({size:Number($('size').value)/100,spacing:.85,initial:$('initial').value,ink:$('ink').value,joined:$('joined').checked,guides:$('guides').checked,transparent:$('transparent').checked,width:Math.max(300,Math.min(1000,Math.round($('paper').clientWidth||1000))),background:$('ink').value==='#ffffff'?'#1b292c':'#ffffff'});
  const documentData=()=>({format:'carlo-script-studio',version:1,text:source.value,options:options()});
  function toast(text){$('toast').textContent=text;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,3800);}
  function saveDraft(){try{localStorage.setItem(storageKey,JSON.stringify(documentData()));$('draft-status').textContent='Draft saved in this browser';}catch{canStore=false;$('draft-status').textContent='Save a document to keep your work';}}
  function render(persist=true){
    current=E.render(source.value,options());
    $('rendered').innerHTML=current.svg;
    $('example-note').hidden=source.value!==demo;
    $('empty-preview').hidden=!!source.value.trim();
    $('paper').classList.toggle('dark-paper',$('ink').value==='#ffffff');
    $('input-count').textContent=`${Array.from(source.value).length} characters`;
    $('render-count').textContent=source.value.trim()?`${current.consonants} consonants · ${current.vowels} vowels`:'Live composition';
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
  for(const [collection,id,type] of [[E.consonants,'consonant-palette','consonant'],[E.vowels,'vowel-palette','vowel'],[E.marks,'mark-palette','mark']]){
    $(id).replaceChildren();
    for(const [key,g] of Object.entries(collection)){
      const button=document.createElement('button');button.type='button';button.className='glyph-button';
      const value=type==='mark'?`{${key}}`:key;
      button.innerHTML=E.preview(key,type)+`<span>${E.xml(type==='mark'?g.label:key)}</span>`;button.title=`Insert ${g.label}${type==='mark'?' ('+value+')':g.aliases?' (also '+g.aliases.join(', ')+')':''}`;button.setAttribute('aria-label',`Insert ${g.label}`);
      button.addEventListener('click',()=>{const start=source.selectionStart,end=source.selectionEnd;if(source.value.length-(end-start)+value.length>100000){toast('This document has reached 100,000 characters. Start a new document to continue.');return;}clearedDraft=null;$('clear').textContent='Clear';source.setRangeText(value,start,end,'end');source.focus();render();});$(id).append(button);
    }
  }
  function download(content,type,name){const url=URL.createObjectURL(content instanceof Blob?content:new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
  const filename=()=>((source.value.trim().split(/\s/)[0]||'composition').replace(/[^a-zA-Z0-9èòæœşž-]/g,'').slice(0,32)||'composition');
  source.addEventListener('input',()=>{clearedDraft=null;$('clear').textContent='Clear';render();});controlIds.forEach(id=>$(id).addEventListener('input',()=>render()));
  $('export-svg').addEventListener('click',()=>{download(current.svg,'image/svg+xml',filename()+'.svg');toast('SVG exported. It stays sharp at any size.');});
  $('export-png').addEventListener('click',async()=>{
    const button=$('export-png'),snapshot={...current};button.disabled=true;button.textContent='Exporting…';
    try{
      const image=new Image(),url=URL.createObjectURL(new Blob([snapshot.svg],{type:'image/svg+xml'}));
      try{await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error('Could not render the artwork. Try exporting SVG.'));image.src=url;});
        const canvas=document.createElement('canvas');const scale=Math.min(3,16000/Math.max(snapshot.width,snapshot.height));canvas.width=Math.ceil(snapshot.width*scale);canvas.height=Math.ceil(snapshot.height*scale);const ctx=canvas.getContext('2d');if(!ctx)throw new Error('PNG export is unavailable. Try exporting SVG.');ctx.drawImage(image,0,0,canvas.width,canvas.height);
        const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('Could not export this image. Try a shorter passage or export SVG.');download(blob,'image/png',filename()+'.png');toast('PNG exported at high resolution.');
      }finally{URL.revokeObjectURL(url);}
    }catch(error){toast(error.message);}finally{button.disabled=!source.value.trim();button.textContent='Export PNG';}
  });
  $('save-document').addEventListener('click',()=>{saveDraft();download(JSON.stringify(documentData(),null,2),'application/json',filename()+'.script.json');toast('Document saved with your text and settings.');});
  $('open-document').addEventListener('click',()=>$('document-file').click());
  $('document-file').addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;
    try{if(file.size>2*1024*1024)throw new Error('That file is too large. Choose a Script Studio document under 2 MB.');const data=JSON.parse(await file.text());
      if(source.value.trim())download(JSON.stringify(documentData(),null,2),'application/json','before-open.script.json');
      applyDocument(data);render();toast('Document opened. The previous text was saved as a backup.');
    }catch(error){toast(error instanceof SyntaxError?'This is not a valid document. Choose a .script.json file.':error.message);}event.target.value='';
  });
  $('clear').addEventListener('click',()=>{if(clearedDraft!==null&&!source.value){source.value=clearedDraft;clearedDraft=null;$('clear').textContent='Clear';render();source.focus();return;}if(!source.value)return;clearedDraft=source.value;source.value='';$('clear').textContent='Undo clear';render();toast('Cleared. Choose Undo clear to restore the text.');});
  const reference=()=>$('references').showModal();$('open-reference').addEventListener('click',reference);$('show-chart').addEventListener('click',reference);$('close-reference').addEventListener('click',()=>$('references').close());$('references').addEventListener('click',e=>{if(e.target===$('references')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
  $('download-app').addEventListener('click',()=>{const copy=document.documentElement.cloneNode(true),offlineId=globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2);copy.querySelector('#document-data').textContent=JSON.stringify({...documentData(),offlineId}).replace(/</g,'\\u003c');copy.querySelector('#references').removeAttribute('open');copy.querySelector('#toast').setAttribute('hidden','');download('<!doctype html>\n'+copy.outerHTML,'text/html','Script-Studio.html');toast('Offline copy saved, including your current composition.');});
  let restored=false;
  let embedded=null,saved=null;
  try{embedded=JSON.parse($('document-data').textContent);}catch{}
  if(embedded&&typeof embedded.offlineId==='string'&&/^[a-zA-Z0-9-]{1,100}$/.test(embedded.offlineId))storageKey+=':'+embedded.offlineId;
  try{saved=localStorage.getItem(storageKey);}catch{canStore=false;}
  if(saved)try{applyDocument(JSON.parse(saved));restored=true;$('draft-status').textContent='Draft restored from this browser';}catch{canStore=false;}
  if(!restored&&embedded)try{applyDocument(embedded);restored=true;$('draft-status').textContent='Composition loaded from this offline copy';}catch{}
  if(!restored){source.value=demo;$('draft-status').textContent='Illustrative text · try your own';}
  if(!canStore)$('draft-status').textContent='Save a document to keep your work';
  render(false);
  window.addEventListener('resize',()=>render(false));
  window.addEventListener('pagehide',()=>{if(canStore)saveDraft();});
  window.ScriptStudio={render,documentData,applyDocument};
})();
