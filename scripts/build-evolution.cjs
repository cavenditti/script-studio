/* Reproducible public script specimens. No language draft is read here. */
const fs=require('node:fs'),path=require('node:path');
const H=require('../src/evolution.js'),D=require('../src/descendants.js'),E=require('../src/engine.js');
const out=path.resolve(__dirname,'../docs/evolution');fs.mkdirSync(out,{recursive:true});
const esc=E.xml;
let cursor=110;
const rows=H.profiles.map(p=>{
  const y=cursor,r=H.render('din rento ghma\nn p s r w',{hand:p.id,width:1000,transparent:true,idPrefix:'atlas-'+p.id});
  cursor+=p.system==='blocks'?290:225;
  return `<g transform="translate(0 ${y})"><line x1="36" y1="0" x2="1264" y2="0" stroke="#d9e0e0"/><text x="36" y="41" font-size="25" fill="#1b292c">${esc(p.name)}</text><text x="36" y="70" font-size="15" fill="#566569">${esc(p.era)}</text><text x="36" y="99" font-size="15" fill="#295c65">${esc(p.branch)}</text><g transform="translate(280 6) scale(.92)">${r.svg}</g></g>`;
});
const atlas=`<svg xmlns="http://www.w3.org/2000/svg" width="1300" height="${cursor+50}" viewBox="0 0 1300 ${cursor+50}" role="img" aria-labelledby="title desc"><title id="title">A possible Two-Rail script family: comparative atlas</title><desc id="desc">Eleven fictional stages around Carlo's original Classical script, including two alphabets, syllable cells, fused syllable pictograms and circular signs with ideograms. Identical modern keys din rento ghma and n p s r w are drawn in every hand; bare consonants have an explicit empty-nucleus sign in Harbor.</desc><rect width="1300" height="${cursor+50}" fill="white"/><g font-family="Georgia,serif"><text x="36" y="47" font-size="33" fill="#1b292c">A possible Two-Rail family</text><text x="36" y="78" font-family="Arial,sans-serif" font-size="17" fill="#566569">Eleven stages · the same phonetic keys · ribbons, alphabets, syllable cells and circles</text>${rows.join('')}</g><text x="36" y="${cursor+28}" font-family="Arial,sans-serif" font-size="15" fill="#566569">Classical stays intact. The new branches change the unit of writing while preserving the input sound sequence.</text></svg>`;
fs.writeFileSync(path.join(out,'atlas.svg'),atlas);
const coords={stone:[470,80],'ridge-alpha':[100,200],capitals:[100,320],ridge:[760,200],reed:[760,320],classical:[470,460],seal:[1050,460],delta:[320,610],island:[620,610],harbor:[1050,610],cord:[1050,740]};
const node=p=>{const [x,y]=coords[p.id],original=p.id==='classical';return `<g><rect x="${x}" y="${y}" width="240" height="80" rx="5" fill="${original?'#295c65':'#f4f6f6'}" stroke="#b6c8ca"/><text x="${x+120}" y="${y+31}" text-anchor="middle" font-size="21" fill="${original?'white':'#1b292c'}">${esc(p.name)}</text><text x="${x+120}" y="${y+57}" text-anchor="middle" font-size="15" fill="${original?'white':'#566569'}">${esc(p.era)}${original?' · original':''}</text></g>`;};
const edges=H.profiles.filter(p=>p.parent).map(p=>{const [x,y]=coords[p.id],[px,py]=coords[p.parent];return `<path d="M${px+120} ${py+80}V${y-25}H${x+120}V${y}" fill="none" stroke="#295c65" stroke-width="2" marker-end="url(#arrow)"/>`;});
// Graphic borrowing: dashed routes chosen per pair so they avoid the nodes.
const routes={'harbor>island':'M1050 650H862','ridge-alpha>harbor':'M220 280V292H40V872H1340V650H1292'};
const borrowings=H.profiles.flatMap(p=>(p.influences||[]).map(from=>{const d=routes[from+'>'+p.id];if(!d)throw new Error('No borrowing route for '+from+' > '+p.id);return `<path d="${d}" stroke="#8d6651" stroke-width="2" stroke-dasharray="7 6" fill="none" marker-end="url(#arrow)"/>`;}));
const tree=`<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="930" viewBox="0 0 1400 930" role="img" aria-labelledby="title desc"><title id="title">Proposed script descent and borrowing</title><desc id="desc">Stone Register branches into the Ridge Alphabet, which leads to Upland Capitals, and into Ridge Cut, which leads to Early Ink. Early Ink gives rise to Classical, with Delta and Island, and to the Reed Seals, which lead to Harbor Blocks and finally Tidecord. Dashed lines mark graphic borrowing.</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10" fill="none" stroke="#295c65" stroke-width="1.5"/></marker></defs><rect width="1400" height="930" fill="white"/><g font-family="Georgia,serif"><text x="36" y="40" font-size="28" fill="#1b292c">One ancestor, different units of writing</text>${edges.join('')}${borrowings.join('')}${H.profiles.map(node).join('')}</g><g font-family="Arial,sans-serif" font-size="16" fill="#566569"><path d="M36 905H100" stroke="#295c65" stroke-width="2"/><text x="112" y="910">descent</text><path d="M260 905H324" stroke="#8d6651" stroke-width="2" stroke-dasharray="7 6"/><text x="336" y="910">graphic borrowing</text><text x="730" y="910">Dates and branches remain provisional.</text></g></svg>`;
fs.writeFileSync(path.join(out,'family-tree.svg'),tree);
const sample='plant drènt ghrai';
const comparison=['classical','ridge-alpha','harbor'].map((hand,i)=>{
  const p=H.get(hand),r=H.render(sample,{hand,width:1200,transparent:true});
  const caption=hand==='classical'?'Consonant ribbon with attached vowels':hand==='ridge-alpha'?'Every consonant and vowel is a full independent letter':'One outlined pictogram per syllable: onset / vowel / coda merged into a single contour';
  return `<g transform="translate(0 ${90+i*210})"><text x="35" y="20" font-size="25">${esc(p.name)}</text><text x="35" y="47" font-family="Arial,sans-serif" font-size="16" fill="#566569">${caption}</text><g transform="translate(0 45)">${r.svg}</g></g>`;
}).join('');
const s=D.syllabify(D.units('plant{3}').units[0].tokens)[0],b=D.block(s,'#161c20');
const diagram=`<g transform="translate(470 840) scale(2)">${b.body}</g>`;
const detail=`<g font-family="Arial,sans-serif" fill="#566569" font-size="17"><text x="35" y="795">Read rows from top to bottom, each left to right: p + l / a / n + t</text><path d="M300 875H470" stroke="#295c65" fill="none"/><text x="35" y="881">Onset: p + l, touching</text><path d="M300 920H470" stroke="#295c65" fill="none"/><text x="35" y="926">Vowel: a, joined to the onset</text><path d="M300 970H470" stroke="#295c65" fill="none"/><text x="35" y="976">Coda: n + t, joined below</text><path d="M676 872H860" stroke="#295c65" fill="none"/><text x="880" y="878">Falling tone /˦˨/</text><text x="35" y="1090">The comparison strings are phonetic-key examples, not translations or historical words.</text></g>`;
const structural=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1130" viewBox="0 0 1200 1130" role="img" aria-labelledby="title desc"><title id="title">From ribbon to alphabet and fused syllable sign</title><desc id="desc">Identical sound sequences shown in Classical, Ridge Alphabet and Harbor Blocks. A five-phoneme Harbor sign fuses three rows: initials p l, vowel a, finals n t. Falling tone sits outside the sign.</desc><rect width="1200" height="1130" fill="white"/><g font-family="Georgia,serif" fill="#1b292c"><text x="35" y="42" font-size="31">Same sounds, radically different writing</text><text x="35" y="68" font-family="Arial,sans-serif" font-size="17" fill="#566569">Phonetic keys: plant · drènt · ghrai</text>${comparison}</g><line x1="35" y1="752" x2="1165" y2="752" stroke="#d9e0e0"/>${diagram}${detail}</svg>`;
fs.writeFileSync(path.join(out,'structural-branches.svg'),structural);
// Native-size cells expose distinctions that an enlarged specimen can hide.
let dy=90;const diagnostics=[];
function section(title,examples,columns=10){
  diagnostics.push(`<text x="35" y="${dy}" font-size="21">${esc(title)}</text>`);dy+=25;
  examples.forEach((text,i)=>{const x=35+(i%columns)*(1130/columns),y=dy+Math.floor(i/columns)*133;
    const r=H.render(text,{hand:'harbor',width:300,transparent:true}),svg=D.compact(r,0);
    diagnostics.push(`<g transform="translate(${x} ${y})"><text y="15" font-family="Arial,sans-serif" font-size="15" fill="#566569">${esc(text)}</text><g transform="translate(0 25)">${svg}</g></g>`);
  });dy+=Math.ceil(examples.length/columns)*133+22;
}
const cs=Object.keys(E.consonants);
section('All consonants in the onset row',cs.map(k=>k+'a'));
section('All consonants in the coda row',cs.map(k=>'a'+k));
section('All vowel components',Object.keys(E.vowels),6);
section('Ordered compound vowels and empty positions',['oe','eo','uy','yu','ai','aa','a','nt'],8);
section('Clusters and independent prosody',["plant'{3}",'strant','ghrai','ka{1}','ka{2}','ka{3}','ka{4}','ka{5}','ka{6}','ka{7}','ka{8}'],6);
// Eight marks, overflow and explicit boundaries get their own full-width rows.
for(const text of ["plant'{1}{2}{3}{4}{5}{6}{7}{8}",'strlant aei antsrl','katra ka·tra kai ka·i']){
  diagnostics.push(`<text x="35" y="${dy}" font-family="Arial,sans-serif" font-size="16" fill="#566569">${esc(text)}</text>`);
  diagnostics.push(`<g transform="translate(5 ${dy+7})">${H.render(text,{hand:'harbor',width:1160,transparent:true}).svg}</g>`);dy+=180;
}
const sheet=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${dy+30}" viewBox="0 0 1200 ${dy+30}" role="img" aria-labelledby="title desc"><title id="title">Harbor component and rendering diagnostics</title><desc id="desc">All consonants in both positions, all vowels, ordered compound nuclei, empty nucleus, clusters, tone and stress, bounded spell-out, and explicit boundaries. Cells are drawn at the editor's default size.</desc><rect width="1200" height="${dy+30}" fill="white"/><g font-family="Georgia,serif" fill="#1b292c"><text x="35" y="39" font-size="30">Harbor: every component at reading size</text><text x="35" y="65" font-family="Arial,sans-serif" font-size="16" fill="#566569">One outlined pictogram per syllable · unchanged component orientation · overlaps merge into one contour</text>${diagnostics.join('')}</g></svg>`;
fs.writeFileSync(path.join(out,'harbor-diagnostics.svg'),sheet);
console.log('Wrote eleven-hand atlas, branching tree, structural decomposition and Harbor diagnostic plate.');
