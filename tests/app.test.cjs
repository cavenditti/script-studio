const {parseHTML}=require('linkedom');
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const path=require('node:path');const project=path.resolve(__dirname,'..');const E=require(path.join(project,'src/engine.js'));
const P=require(path.join(project,'src/phonetics.js'));
const H=require(path.join(project,'src/evolution.js'));
const html=fs.readFileSync(path.join(project,'dist/index.html'),'utf8');
const app=fs.readFileSync(path.join(project,'src/app.js'),'utf8');
let uuid=0;
function boot(markup=html,stored=new Map(),storageBlocked=false){
  const {document,window}=parseHTML(markup),downloads=[],timers=[],events={};
  for(const s of document.querySelectorAll('select'))Object.defineProperty(s,'options',{get(){return Array.from(this.querySelectorAll('option'))}});
  for(const s of document.querySelectorAll('select')){let value=s.querySelector('option')?.getAttribute('value')||'';Object.defineProperty(s,'value',{get(){return value},set(v){value=v}});}
  for(const el of document.querySelectorAll('input[type=checkbox]'))el.checked=el.hasAttribute('checked');
  for(const dialog of document.querySelectorAll('dialog')){dialog.showModal=()=>dialog.setAttribute('open','');dialog.close=()=>dialog.removeAttribute('open');}
  const field=document.getElementById('source');field.selectionStart=field.selectionEnd=0;field.focus=()=>{};field.setRangeText=(str,start,end)=>{field.value=field.value.slice(0,start)+str+field.value.slice(end);field.selectionStart=field.selectionEnd=start+str.length};
  const context={document,ScriptEngine:E,ScriptPhonetics:P,ScriptEvolution:H,Blob,console,crypto:{randomUUID:()=>`copy-${++uuid}`},URL:{createObjectURL:b=>{downloads.push(b);return 'blob:test'},revokeObjectURL(){}},setTimeout:(fn,delay)=>{timers.push({fn,delay});return timers.length},clearTimeout(){},localStorage:{getItem:key=>{if(storageBlocked)throw new Error('blocked');return stored.get(key)||null},setItem:(key,value)=>{if(storageBlocked)throw new Error('blocked');stored.set(key,value)}},window:{addEventListener:(event,fn)=>events[event]=fn}};
  vm.runInNewContext(app,context,{filename:'app.js'});
  const click=id=>document.getElementById(id).dispatchEvent(new window.Event('click'));
  const input=value=>{field.value=value;field.dispatchEvent(new window.Event('input'))};
  return {document,window,api:context.window.ScriptStudio,downloads,stored,field,click,input,flush:()=>{for(const t of timers.splice(0))if(t.delay===400)t.fn()},pagehide:()=>events.pagehide()};
}
(async()=>{
  const first=boot();assert.equal(first.document.querySelectorAll('.glyph-button').length,39);assert.match(first.document.getElementById('rendered').innerHTML,/<svg/);assert.equal(first.document.getElementById('reference-chart').getAttribute('src').startsWith('data:image/jpeg;base64,'),true);
  assert.equal(first.document.querySelectorAll('.vowel-button').length,11);for(const button of first.document.querySelectorAll('.vowel-button'))assert.equal(button.querySelectorAll('svg').length,2);
  assert.equal(first.document.getElementById('spacing'),null);assert.equal(first.api.documentData().options.spacing,.85);
  assert.equal(first.document.getElementById('panel-vowels').hidden,true);first.click('tab-vowels');assert.equal(first.document.getElementById('panel-vowels').hidden,false);assert.equal(first.document.getElementById('panel-consonants').hidden,true);assert.match(first.document.getElementById('phonetic-legend').textContent,/close-mid/);first.click('tab-marks');assert.equal(first.document.getElementById('panel-marks').hidden,false);assert.match(first.document.getElementById('phonetic-legend').textContent,/secondary stress/);assert.match(first.document.getElementById('mark-palette').textContent,/Falling/);first.click('tab-consonants');
  assert.equal(first.document.querySelector('.page-intro'),null);assert.equal(first.document.querySelector('.specimen-note'),null);
  first.input('kèna');first.flush();assert.equal(JSON.parse(first.stored.get('carlo-script-studio-v1')).text,'kèna');
  const reload=boot(html,first.stored);assert.equal(reload.field.value,'kèna');
  reload.click('clear');assert.equal(reload.field.value,'');reload.click('clear');assert.equal(reload.field.value,'kèna');
  reload.click('download-app');const offlineHtml=await reload.downloads.at(-1).text();assert.ok(!offlineHtml.includes('<script>kèna'));
  const offline=boot(offlineHtml);assert.equal(offline.field.value,'kèna');assert.equal(offline.document.querySelectorAll('.glyph-button').length,39);
  offline.input('mora');offline.flush();const reopen=boot(offlineHtml,offline.stored);assert.equal(reopen.field.value,'mora');
  const blocked=boot(offlineHtml,new Map(),true);assert.equal(blocked.field.value,'kèna');
  reopen.click('export-svg');const svg=await reopen.downloads.at(-1).text();assert.match(svg,/<svg/);assert.match(svg,/<title>mora<\/title>/);
  reopen.input('q');assert.equal(reopen.document.getElementById('render-warning').hidden,false);
  reopen.input('din{8}');assert.match(reopen.document.getElementById('rendered').innerHTML,/data-mark="8"/);
  reopen.input('{1}din');assert.match(reopen.document.getElementById('render-warning').textContent,/Place \{1\}/);
  reopen.input('');assert.equal(reopen.document.getElementById('export-png').disabled,true);
  assert.throws(()=>reopen.api.applyDocument({format:'carlo-script-studio',version:1,text:'a'.repeat(100001)}),/100,000/);
  reopen.api.applyDocument({format:'carlo-script-studio',version:1,text:'for',options:{spacing:1.45}});assert.equal(reopen.api.documentData().options.spacing,.85);
  const history=boot();history.click('open-evolution');history.document.getElementById('evolution').scrollTop=200;history.click('close-evolution');history.click('open-evolution');assert.equal(history.document.getElementById('evolution').scrollTop,0);const stage=history.document.getElementById('history-stage');stage.value='ridge';stage.dispatchEvent(new history.window.Event('change'));assert.match(history.document.getElementById('history-detail').textContent,/Ridge Cut/);history.click('use-hand');assert.equal(history.api.documentData().options.hand,'ridge');assert.equal(history.document.getElementById('joined').disabled,true);history.flush();assert.equal(boot(html,history.stored).api.documentData().options.hand,'ridge');history.click('download-app');const historicalCopy=boot(await history.downloads.at(-1).text());assert.equal(historicalCopy.api.documentData().options.hand,'ridge');assert.equal(historicalCopy.document.querySelectorAll('#history-stage option').length,9);historicalCopy.api.applyDocument({format:'carlo-script-studio',version:1,text:'nt',options:{}});historicalCopy.api.render(false);assert.equal(historicalCopy.api.documentData().options.hand,'classical');assert.equal(historicalCopy.document.getElementById('joined').disabled,false);
  for(const hand of ['ridge-alpha','harbor']){const doc=boot();doc.api.applyDocument({format:'carlo-script-studio',version:1,text:'plant',options:{hand}});doc.api.render();assert.equal(doc.api.documentData().options.hand,hand);assert.equal(doc.document.getElementById('initial').disabled,true);assert.equal(doc.document.querySelector('.vowel-button').querySelectorAll('svg').length,1);assert.match(doc.document.getElementById('attachment-hint').textContent,hand==='harbor'?/block/:/full letter/);doc.click('download-app');const copy=boot(await doc.downloads.at(-1).text());assert.equal(copy.api.documentData().options.hand,hand);}
  console.log('PASS: app boot, embedded references, autosave/reload, clear/undo, offline export, offline reload, blocked-storage fallback, SVG export, unknown signs, empty state, document limit.');
})().catch(e=>{console.error(e);process.exitCode=1});
