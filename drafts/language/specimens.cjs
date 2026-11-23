/* LOCAL LANGUAGE DRAFT. Regenerates specimens.svg: each variety's ordinary
   sentence in its own hand and word-division convention.
   node drafts/language/specimens.cjs && rsvg-convert drafts/language/specimens.svg -o drafts/language/specimens.png */
const fs=require('node:fs'),path=require('node:path');
const H=require('../../src/evolution.js'),T=require('./typology.cjs');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const sections=[
  {title:'Sara perceives Lena (ordinary register of each variety)',rows:[
    ['stone','pa tuni ta na sara ti na lena'],
    ['capitals','na sara ta na lena ti tunh'],
    ['reed','patunitanasaratinalena'],
    ['seal','pa tuni ta na sara ti na lena'],
    ['classical','pa tyni ta na sara ti na lena'],
    ['ridge','tini nasarata nalenati'],
    ['delta','saratinlena'],
    ['island','nasarata nalenati tuniwe'],
    ['civic','pa tin ta na sara ti na lena'],
    ['ridge-alpha','tin na sara na lena'],
    ['harbor','nasarata nalenati tuniw'],
    ['roundel','sara lena tun #we'],
  ]},
  {title:'Every person perceives some record (narrow-scope record)',rows:[
    ['classical','ru mi ki pa tun ta mi su ni ke pa lœni ta ni pa tyni ta mi ti ni'],
    ['island','rutunta lontuniwe'],
    ['ridge-alpha','ru mi ki tun mi su ni ke lèn ni tin mi ni'],
    ['roundel','#ru #tun lon tun'],
  ]},
];
const meta=Object.fromEntries(T.varieties.map(v=>[v.id,v]));
let y=90;const parts=[];
for(const s of sections){
  parts.push(`<text x="32" y="${y}" font-family="Georgia,serif" font-size="26" fill="#1b292c">${esc(s.title)}</text>`);y+=30;
  for(const [hand,text] of s.rows){
    const p=H.get(hand),m=meta[hand],r=H.render(text,{hand,width:1400,transparent:true,idPrefix:'spec-'+hand+'-'+y});
    if(r.unknown&&r.unknown.length)throw new Error(hand+': unknown '+r.unknown.join(','));
    const h=Number((r.svg.match(/height="([\d.]+)"/)||[])[1]||200);
    parts.push(`<g transform="translate(0 ${y})"><text x="32" y="35" font-family="Georgia,serif" font-size="24" fill="#1b292c">${esc(p.name)}</text><text x="32" y="62" font-family="Arial,sans-serif" font-size="15" fill="#7a5a2a">${esc(m.morphology)} · ${m.division==='continuous'?'written without word spaces':'word-spaced'}</text><text x="32" y="86" font-family="Arial,sans-serif" font-size="16" fill="#566569">${esc(text)}</text><g transform="translate(0 85) scale(.9)">${r.svg}</g></g>`);
    y+=85+h*.9+20;
  }
  y+=30;
}
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="${Math.ceil(y)}" viewBox="0 0 1400 ${Math.ceil(y)}" role="img" aria-label="Private provisional language: varieties, morphology and word division"><rect width="100%" height="100%" fill="white"/><text x="32" y="42" font-family="Georgia,serif" font-size="28" fill="#1b292c">LOCAL LANGUAGE DRAFT · morphology and word division by variety</text>${parts.join('')}</svg>`;
fs.writeFileSync(path.join(__dirname,'specimens.svg'),svg);
console.log('specimens.svg',Math.ceil(y),'px tall');
