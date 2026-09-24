/* ---------- subpage logic: restaurants, advertisers, installations, about ---------- */
const emnState={name:'',shape:'square',bg:'paper',slots:8,logoImg:null};
const userState={name:'',shape:'square',bg:'paper',slots:8,logoImg:null,bgImg:null,bgDark:false};
const adState={size:'8x4',name:'',tag:'',phone:'',bg:'#14213d',logoImg:null,pov:'above'};
const PAGE=location.pathname.split('/').pop().replace('.html','')||'index';
const mode=PAGE==='advertisers'?'ad':'table';
let adHost=null, pageScene=null, des=null;
const $=id=>document.getElementById(id);

Promise.all([loadImg('logo',ASSETS.logo),loadImg('paper',ASSETS.paper),loadImg('wood',ASSETS.wood),loadImg('gray',ASSETS.gray),loadImg('walnut',ASSETS.walnut),loadImg('oak',ASSETS.oak),loadImg('espresso',ASSETS.espresso)]).then(()=>{
  emnState.logoImg=IMG.logo; adHost=Object.assign({},emnState,{userAd:adState});
  const ps=$('pageScene'); if(ps){ pageScene=makeTable(ps,{rot:.4,state:mode==='ad'?emnState:userState,shift:.14,room:true}); pageScene.setCamera(...(innerWidth<640?[0,2.8,5.9]:[0,2.3,5.4])); }
  const ds=$('designerScene'); if(ds){ des=makeTable(ds,{rot:.2,state:mode==='ad'?adHost:userState,dark:true}); }
  document.fonts.ready.then(refreshUser); setTimeout(refreshUser,900);
});
function applyPov(){ if(!des) return;
  if(mode==='ad'&&adState.pov==='diner'){ des.setIdle(false); des.setRot(Math.PI); des.setCamera(0,1.15,3.3); des.setLook(0,-.15,0); }
  else { des.setIdle(true); des.setCamera(0,2.6,4.6); des.setLook(0,-.15,0); } }
const thumb=$('conceptThumb');
function refreshUser(){ if(pageScene) pageScene.refresh(); if(des) des.refresh();
  const ct=$('conceptText'), sl=$('sizeLabel'), tt=$('conceptTitle');
  if(mode==='table'){ if(thumb) drawDesign(thumb,userState,1);
    const bgName=userState.bgLabel||{paper:'Cream paper',custom:'Custom background'}[userState.bg]||userState.bg;
    if(ct) ct.textContent=`${userState.name||'Your logo here'} · ${userState.shape==='square'?'Square':'Round'} · ${bgName} · ${userState.slots} slots${userState.logoImg?' · logo attached':''}`;
    if(sl) sl.textContent=userState.shape==='square'?'Square · 30" x 30"':'Round · 36" diameter';
  } else { if(tt) tt.textContent='Your ad concept is attached'; const tag=$('modeTag'); if(tag) tag.textContent='Advertiser · true-scale preview';
    if(thumb){ const x=thumb.getContext('2d'); x.clearRect(0,0,256,256); x.fillStyle='#f3ece0'; x.fillRect(0,0,256,256);
      const sz=AD_SIZES[adState.size], sc=Math.min(200/sz[0],200/sz[1]); x.save(); x.translate(128,128); drawAd(x,userAdSpec(adState),sz[0]*sc,sz[1]*sc,1); x.restore(); }
    const label={'8x4':'8" x 4"','5x3':'5" x 3"','4x4':'4" x 4"','4x2':'4" x 2"','3c':'3" circle'}[adState.size];
    if(ct) ct.textContent=`${adState.name||'Your business'} · ${label}${adState.logoImg?' · logo attached':''}`;
    if(sl) sl.textContent=`Ad at true scale · ${label} on a 36" table`;
  } }
function chipGroup(id,obj,key,parse){ const el=$(id); if(!el) return; el.addEventListener('click',e=>{ const b=e.target.closest('.chip'); if(!b) return; obj[key]=parse(b.dataset[key]); [...el.children].forEach(c=>c.classList.toggle('active',c===b)); if(key==='pov') applyPov(); refreshUser(); }); }
chipGroup('shapes',userState,'shape',v=>v); chipGroup('slots',userState,'slots',v=>+v); chipGroup('adSizes',adState,'size',v=>v); chipGroup('pov',adState,'pov',v=>v);
if($('adColors')) $('adColors').addEventListener('click',e=>{ const b=e.target.closest('.swatch'); if(!b) return; adState.bg=b.dataset.c; [...e.currentTarget.children].forEach(c=>c.classList.toggle('active',c===b)); refreshUser(); });
if($('rname')) $('rname').addEventListener('input',e=>{userState.name=e.target.value;refreshUser();});
[['adName','name'],['adTag','tag'],['adPhone','phone']].forEach(([id,k])=>{ if($(id)) $(id).addEventListener('input',e=>{adState[k]=e.target.value;refreshUser();}); });
function readFile(input,cb){ const f=input.files&&input.files[0]; if(!f) return; const rd=new FileReader(); rd.onload=()=>{ const im=new Image(); im.onload=()=>cb(im,rd.result); im.src=rd.result; }; rd.readAsDataURL(f); }
function luminance(im){ const c=document.createElement('canvas'); c.width=c.height=16; const x=c.getContext('2d'); x.drawImage(im,0,0,16,16); const d=x.getImageData(0,0,16,16).data; let s=0; for(let i=0;i<d.length;i+=4) s+=(d[i]*299+d[i+1]*587+d[i+2]*114)/1000; return s/(d.length/4); }
function upload(fileId,prevId,clearId,onLoad,onClear){ const f=$(fileId); if(!f) return;
  f.addEventListener('change',e=>readFile(e.target,(im,src)=>{ onLoad(im); $(prevId).innerHTML=`<img src="${src}" alt="">`; $(clearId).hidden=false; refreshUser(); }));
  $(clearId).addEventListener('click',e=>{ e.preventDefault(); e.stopPropagation(); onClear(); $(prevId).textContent='◆'; e.target.hidden=true; f.value=''; refreshUser(); }); }
upload('bgFile','bgPrev','bgClear',im=>{ userState.bgImg=im; userState.bgDark=luminance(im)<128; userState.bg='custom'; userState.bgLabel='Custom upload'; [...$('bgs').children].forEach(c=>c.classList.remove('active')); },()=>{ userState.bgImg=null; userState.bg='paper'; userState.bgLabel='Cream paper'; $('bgs').children[0].classList.add('active'); });
upload('logoFile','logoPrev','logoClear',im=>userState.logoImg=im,()=>userState.logoImg=null);
upload('adLogoFile','adLogoPrev','adLogoClear',im=>adState.logoImg=im,()=>adState.logoImg=null);
/* contact toggle on pages with both audiences */
document.querySelectorAll('#contactToggle button').forEach(b=>b.addEventListener('click',()=>{ document.querySelectorAll('#contactToggle button').forEach(x=>x.classList.toggle('active',x===b)); document.querySelectorAll('.next-set').forEach(d=>d.classList.toggle('on',d.dataset.seat===b.dataset.seat)); }));
/* gallery filters */
document.querySelectorAll('.filters .chip').forEach(b=>b.addEventListener('click',()=>{ document.querySelectorAll('.filters .chip').forEach(x=>x.classList.toggle('active',x===b)); const f=b.dataset.f;
  document.querySelectorAll('.gcard').forEach(c=>{ c.hidden=!(f==='all'||(c.dataset.tags||'').split(' ').includes(f)); }); }));

/* ---------- background catalogs: wood samples + Pantone (loaded only when the customizer is near) ---------- */
function loadCatalog(){ if(window.WOOD_CODES) return Promise.resolve(); if(window._catP) return window._catP; return window._catP=new Promise(r=>{ const s=document.createElement('script'); s.src='js/catalog.js?v=4'; s.onload=r; document.body.appendChild(s); }); }
(function(){ const d=document.getElementById('designer'); if(!d) return; const io=new IntersectionObserver(es=>{ if(es.some(e=>e.isIntersecting)){ io.disconnect(); loadCatalog().then(initCatalog); } },{rootMargin:'900px 0px'}); io.observe(d);
  const bgs=document.getElementById('bgs'); if(bgs) bgs.addEventListener('click',()=>loadCatalog().then(initCatalog),{once:true}); })();
function initCatalog(){
  const wg=document.getElementById('woodGrid'), pg=document.getElementById('panGrid'), bgs=document.getElementById('bgs');
  if(!wg||!window.WOOD_CODES||wg.dataset.ready) return; wg.dataset.ready='1';
  const woodCat=document.getElementById('woodCat'), panCat=document.getElementById('panCat');
  function lum(hex){ const n=parseInt(hex.slice(1),16); return (((n>>16)*299+((n>>8)&255)*587+(n&255)*114)/1000); }
  function imgLum(im){ const c=document.createElement('canvas'); c.width=c.height=16; const x=c.getContext('2d'); x.drawImage(im,0,0,16,16); const d=x.getImageData(0,0,16,16).data; let s=0; for(let i=0;i<d.length;i+=4) s+=(d[i]*299+d[i+1]*587+d[i+2]*114)/1000; return s/(d.length/4); }
  function showCat(which){ woodCat.hidden=which!=='woodcat'; panCat.hidden=which!=='pantone'; }
  // wood grid
  WOOD_CODES.forEach(code=>{ const d=document.createElement('div'); d.className='sample'; d.dataset.code=code; d.style.backgroundImage=`url("${WOOD_IMG[code]}")`; d.innerHTML=`<b>#${code}</b>`; d.title='Wood sample #'+code;
    d.addEventListener('click',()=>{ const im=new Image(); im.onload=()=>{ userState.bgImg=im; userState.bgDark=imgLum(im)<128; userState.bg='wood:'+code; userState.bgLabel='Wood #'+code;
      [...wg.children].forEach(x=>x.classList.toggle('active',x===d)); [...bgs.children].forEach(x=>x.classList.toggle('active',x.dataset.bg==='woodcat')); document.getElementById('woodPick').textContent='#'+code+' selected'; refreshUser(); }; im.src=WOOD_IMG[code]; }); wg.appendChild(d); });
  // pantone grid (rendered in chunks so 1,089 chips don't stall the page)
  const search=document.getElementById('panSearch');
  function renderPan(filter){ pg.innerHTML=''; const list=PANTONE.filter(p=>!filter||p.n.toLowerCase().includes(filter)); let i=0;
    (function chunk(){ const frag=document.createDocumentFragment(); for(let k=0;k<120&&i<list.length;k++,i++){ const p=list[i]; const d=document.createElement('div'); d.className='sample'; d.style.background=p.h; d.dataset.n=p.n; d.innerHTML=`<b>${p.n}</b>`; d.title='PANTONE '+p.n+' · '+p.h;
        d.addEventListener('click',()=>{ userState.bg='pantone:'+p.n; userState.color=p.h; userState.bgDark=lum(p.h)<128; userState.bgLabel='PANTONE '+p.n; [...pg.children].forEach(x=>x.classList.toggle('active',x===d)); [...bgs.children].forEach(x=>x.classList.toggle('active',x.dataset.bg==='pantone')); document.getElementById('panPick').textContent=p.n+' selected'; refreshUser(); }); frag.appendChild(d); }
      pg.appendChild(frag); if(i<list.length) requestAnimationFrame(chunk); })(); }
  renderPan(''); search.addEventListener('input',e=>renderPan(e.target.value.trim().toLowerCase()));
  // chip clicks
  bgs.addEventListener('click',e=>{ const b=e.target.closest('.chip'); if(!b) return; const v=b.dataset.bg; showCat(v);
    if(v==='paper'){ userState.bg='paper'; userState.bgLabel='Cream paper'; [...bgs.children].forEach(x=>x.classList.toggle('active',x===b)); refreshUser(); }
    else { [...bgs.children].forEach(x=>x.classList.toggle('active',x===b)); if(v==='woodcat'&&!userState.bg.startsWith('wood:')){ wg.firstChild&&wg.firstChild.click(); } if(v==='pantone'&&!userState.bg.startsWith('pantone:')){ const first=[...pg.children].find(x=>x.dataset.n==='186')||pg.firstChild; first&&first.click(); } } },true);
}
