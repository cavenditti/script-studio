/* IPA values confirmed by the script's creator; presentation groups use them. */
(function(root){
  'use strict';
  const sounds={
    p:{ipa:'p',name:'voiceless bilabial stop'},b:{ipa:'b',name:'voiced bilabial stop'},
    t:{ipa:'t',name:'voiceless alveolar stop'},d:{ipa:'d',name:'voiced alveolar stop'},k:{ipa:'k',name:'voiceless velar stop'},
    f:{ipa:'f',name:'voiceless labiodental fricative'},v:{ipa:'v',name:'voiced labiodental fricative'},
    s:{ipa:'s',name:'voiceless alveolar fricative'},z:{ipa:'z',name:'voiced alveolar fricative'},
    'ş':{ipa:'ʃ',name:'voiceless postalveolar fricative'},'ž':{ipa:'ʒ',name:'voiced postalveolar fricative'},
    m:{ipa:'m',name:'bilabial nasal'},n:{ipa:'n',name:'alveolar nasal'},
    l:{ipa:'l',name:'alveolar lateral approximant'},r:{ipa:'r',name:'alveolar trill'},
    j:{ipa:'j',name:'palatal approximant'},w:{ipa:'w',name:'labial-velar approximant'},
    i:{ipa:'i',name:'close front unrounded vowel'},u:{ipa:'u',name:'close back rounded vowel'},
    e:{ipa:'e',name:'close-mid front unrounded vowel'},'è':{ipa:'ɛ',name:'open-mid front unrounded vowel'},
    o:{ipa:'o',name:'close-mid back rounded vowel'},'ò':{ipa:'ɔ',name:'open-mid back rounded vowel'},
    'œ':{ipa:'œ',name:'open-mid front rounded vowel'},a:{ipa:'a',name:'open front unrounded vowel'},
    'æ':{ipa:'æ',name:'near-open front unrounded vowel'},
    c:{ipa:'tʃ',name:'voiceless postalveolar affricate'},g:{ipa:'dʒ',name:'voiced postalveolar affricate'},
    gh:{ipa:'ɡ',name:'voiced velar stop'},h:{ipa:'ə',name:'mid central vowel (schwa)'},
    y:{ipa:'y',name:'close front rounded vowel'}
  };
  const groups={
    consonant:[
      {label:'Stops',keys:['p','b','t','d','k','gh'],help:'Air stops briefly, then releases: /p b/, /t d/, /k ɡ/.'},
      {label:'Affricates',keys:['c','g'],help:'A stop releases into friction: /tʃ dʒ/. Type c or g.'},
      {label:'Fricatives',keys:['f','v','s','z','ş','ž'],help:'Air passes through a narrow opening: /f v/, /s z/, /ʃ ʒ/.'},
      {label:'Sonorants',keys:['m','n','l','r','j','w'],help:'Nasals /m n/, liquid sounds /l r/, and glides /j w/.'}
    ],
    vowel:[
      {label:'High',keys:['i','y','u'],help:'Tongue high: /i y/ are front; /u/ is back. /y u/ are rounded.'},
      {label:'Mid',keys:['e','è','œ','h','o','ò'],help:'/e o/ are close-mid; /ɛ œ ɔ/ are open-mid. /ə/ is central; type h or ə.'},
      {label:'Low',keys:['a','æ'],help:'/a/ is open; /æ/ is near-open.'}
    ]
  };
  const api={sounds,groups,reference:'https://www.internationalphoneticassociation.org/IPAcharts/IPA_charts_TI/IPA_charts_TI.html'};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.ScriptPhonetics=api;
})(typeof globalThis!=='undefined'?globalThis:this);
