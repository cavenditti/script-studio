const {parseHTML}=require('linkedom');
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const path=require('node:path');const project=path.resolve(__dirname,'..');const E=require(path.join(project,'src/engine.js'));
const html=fs.readFileSync(path.join(project,'dist/index.html'),'utf8');
const app=fs.readFileSync(path.join(project,'src/app.js'),'utf8');
let uuid=0;
function boot(markup=html,stored=new Map(),storageBlocked=false){
  const {document,window}=parseHTML(markup),downloads=[],timers=[],events={};
  for(const s of document.querySelectorAll('select'))Object.defineProperty(s,'options',{get(){return Array.from(this.querySelectorAll('option'))}});
  for(const s of document.querySelectorAll('select')){let value=s.querySelector('option').getAttribute('value');Object.defineProperty(s,'value',{get(){return value},set(v){value=v}});}
  for(const el of document.querySelectorAll('input[type=checkbox]'))el.checked=el.hasAttribute('checked');
  const field=document.getElementById('source');field.selectionStart=field.selectionEnd=0;field.focus=()=>{};field.setRangeText=(str,start,end)=>{field.value=field.value.slice(0,start)+str+field.value.slice(end);field.selectionStart=field.selectionEnd=start+str.length};
  const context={document,ScriptEngine:E,Blob,console,crypto:{randomUUID:()=>`copy-${++uuid}`},URL:{createObjectURL:b=>{downloads.push(b);return 'blob:test'},revokeObjectURL(){}},setTimeout:(fn,delay)=>{timers.push({fn,delay});return timers.length},clearTimeout(){},localStorage:{getItem:key=>{if(storageBlocked)throw new Error('blocked');return stored.get(key)||null},setItem:(key,value)=>{if(storageBlocked)throw new Error('blocked');stored.set(key,value)}},window:{addEventListener:(event,fn)=>events[event]=fn}};
  vm.runInNewContext(app,context,{filename:'app.js'});
  const click=id=>document.getElementById(id).dispatchEvent(new window.Event('click'));
  const input=value=>{field.value=value;field.dispatchEvent(new window.Event('input'))};
  return {document,window,downloads,stored,field,click,input,flush:()=>{for(const t of timers.splice(0))if(t.delay===400)t.fn()},pagehide:()=>events.pagehide()};
}
(async()=>{
  const first=boot();assert.equal(first.document.querySelectorAll('.glyph-button').length,39);assert.match(first.document.getElementById('rendered').innerHTML,/<svg/);assert.equal(first.document.getElementById('reference-chart').getAttribute('src').startsWith('data:image/jpeg;base64,'),true);
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
  assert.throws(()=>reopen.window.ScriptStudio.applyDocument({format:'carlo-script-studio',version:1,text:'a'.repeat(100001)}));
  console.log('PASS: app boot, embedded references, autosave/reload, clear/undo, offline export, offline reload, blocked-storage fallback, SVG export, unknown signs, empty state, document limit.');
})().catch(e=>{console.error(e);process.exitCode=1});
