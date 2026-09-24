/* ---------- states ---------- */
const emnState={name:'',shape:'square',bg:'paper',slots:8,logoImg:null};
const userState={name:'',shape:'square',bg:'paper',slots:8,logoImg:null,bgImg:null,bgDark:false};
const adState={size:'8x4',name:'',tag:'',phone:'',bg:'#14213d',logoImg:null,pov:'above'};
let adHost=null, mode='table', seat='restaurant';

let hero,how,des;
Promise.all([loadImg('logo',ASSETS.logo),loadImg('mark',ASSETS.mark),loadImg('paper',ASSETS.paper),loadImg('wood',ASSETS.wood),loadImg('gray',ASSETS.gray),loadImg('walnut',ASSETS.walnut),loadImg('oak',ASSETS.oak),loadImg('espresso',ASSETS.espresso)]).then(()=>{
  emnState.logoImg=IMG.logo; adHost=Object.assign({},emnState,{userAd:adState});
  hero=makeTable(document.getElementById('heroScene'),{rot:.4,state:emnState,shift:.14,room:true}); hero.setCamera(...(innerWidth<640?[0,2.8,5.9]:[0,2.3,5.4]));
  how=makeTable(document.getElementById('howScene'),{rot:.6,idle:false,state:emnState,shift:-.2});
  des=makeTable(document.getElementById('designerScene'),{rot:.2,state:userState,dark:true}); 
  document.fonts.ready.then(()=>{hero.refresh();how.refresh();refreshUser();}); setTimeout(()=>{hero.refresh();how.refresh();refreshUser();},900);
  updateHow(); applySeat(location.hash==='#advertisers'?'advertiser':'restaurant',false);
});

/* ---------- seat (audience) toggle ---------- */
function applySeat(sv,setHash=true){ seat=sv;
  document.querySelectorAll('#seatToggle button,#contactToggle button').forEach(b=>b.classList.toggle('active',b.dataset.seat===sv));
  document.querySelectorAll('.swap>div,.next-set').forEach(d=>d.classList.toggle('on',d.dataset.seat===sv));
  if(hero){ const m=innerWidth<640; if(sv==='restaurant'){ hero.setCamera(...(m?[0,2.8,5.9]:[0,2.3,5.4])); hero.setRot(.4);} else { hero.setCamera(...(m?[-2.9,2.1,6.0]:[-2.4,1.5,3.6])); hero.setRot(2.2);} }
  setMode(sv==='restaurant'?'table':'ad');
  if(setHash){ try{ history.replaceState(null,'',sv==='restaurant'?'#restaurants':'#advertisers'); }catch(e){} }
  document.querySelectorAll('.seat-only').forEach(d=>d.classList.toggle('on',d.dataset.seat===sv));
}
document.querySelectorAll('#seatToggle button,#contactToggle button,[data-seat-link]').forEach(b=>b.addEventListener('click',e=>{ applySeat(b.dataset.seat); if(b.tagName==='A'){ e.preventDefault(); scrollTo({top:0,behavior:'smooth'}); } }));

/* ---------- designer mode ---------- */
function setMode(m){ mode=m;
  document.querySelectorAll('#mode button').forEach(b=>b.classList.toggle('active',b.dataset.mode===m));
  document.querySelectorAll('.panel-set').forEach(p=>p.classList.toggle('on',p.dataset.mode===m));
  document.getElementById('modeTag').textContent=m==='table'?'Restaurant · live preview':'Advertiser · true-scale preview';
  document.getElementById('conceptTitle').textContent=m==='table'?'Your table concept is attached':'Your ad concept is attached';
  if(des){ des.state=m==='table'?userState:adHost; applyPov(); }
  refreshUser();
}
document.querySelectorAll('#mode button').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
function applyPov(){ if(!des) return;
  if(mode==='ad'&&adState.pov==='diner'){ des.setIdle(false); des.setRot(Math.PI); des.setCamera(0,1.15,3.3); des.setLook(0,-.15,0); }
  else { des.setIdle(true); des.setCamera(0,2.6,4.6); des.setLook(0,-.15,0); } }

const thumb=document.getElementById('conceptThumb');
function refreshUser(){ if(des) des.refresh();
  if(mode==='table'){ drawDesign(thumb,userState,1);
    const bgName=userState.bgLabel||{paper:'Cream paper',custom:'Custom background'}[userState.bg]||userState.bg;
    document.getElementById('conceptText').textContent=`${userState.name||'Your logo here'} · ${userState.shape==='square'?'Square':'Round'} · ${bgName} · ${userState.slots} slots${userState.logoImg?' · logo attached':''}`;
    document.getElementById('sizeLabel').textContent=userState.shape==='square'?'Square · 30" x 30"':'Round · 36" diameter';
  } else { const x=thumb.getContext('2d'); x.clearRect(0,0,256,256); x.fillStyle='#f3ece0'; x.fillRect(0,0,256,256);
    const sz=AD_SIZES[adState.size], sc=Math.min(200/sz[0],200/sz[1]); x.save(); x.translate(128,128); drawAd(x,userAdSpec(adState),sz[0]*sc,sz[1]*sc,1); x.restore();
    const label={'8x4':'8" x 4"','5x3':'5" x 3"','4x4':'4" x 4"','4x2':'4" x 2"','3c':'3" circle'}[adState.size];
    document.getElementById('conceptText').textContent=`${adState.name||'Your business'} · ${label}${adState.logoImg?' · logo attached':''}`;
    document.getElementById('sizeLabel').textContent=`Ad at true scale · ${label} on a 36" table`;
  } }
function chipGroup(id,obj,key,parse){ document.getElementById(id).addEventListener('click',e=>{ const b=e.target.closest('.chip'); if(!b) return; obj[key]=parse(b.dataset[key]); [...e.currentTarget.children].forEach(c=>c.classList.toggle('active',c===b)); if(key==='pov') applyPov(); refreshUser(); }); }
chipGroup('shapes',userState,'shape',v=>v); chipGroup('slots',userState,'slots',v=>+v); chipGroup('adSizes',adState,'size',v=>v); chipGroup('pov',adState,'pov',v=>v);
document.getElementById('adColors').addEventListener('click',e=>{ const b=e.target.closest('.swatch'); if(!b) return; adState.bg=b.dataset.c; [...e.currentTarget.children].forEach(c=>c.classList.toggle('active',c===b)); refreshUser(); });
document.getElementById('rname').addEventListener('input',e=>{userState.name=e.target.value;refreshUser();});
[['adName','name'],['adTag','tag'],['adPhone','phone']].forEach(([id,k])=>document.getElementById(id).addEventListener('input',e=>{adState[k]=e.target.value;refreshUser();}));
function readFile(input,cb){ const f=input.files&&input.files[0]; if(!f) return; const rd=new FileReader(); rd.onload=()=>{ const im=new Image(); im.onload=()=>cb(im,rd.result); im.src=rd.result; }; rd.readAsDataURL(f); }
function luminance(im){ const c=document.createElement('canvas'); c.width=c.height=16; const x=c.getContext('2d'); x.drawImage(im,0,0,16,16); const d=x.getImageData(0,0,16,16).data; let s=0; for(let i=0;i<d.length;i+=4) s+=(d[i]*299+d[i+1]*587+d[i+2]*114)/1000; return s/(d.length/4); }
document.getElementById('bgFile').addEventListener('change',e=>readFile(e.target,(im,src)=>{ userState.bgImg=im; userState.bgDark=luminance(im)<128; userState.bg='custom'; userState.bgLabel='Custom upload';
  [...document.getElementById('bgs').children].forEach(c=>c.classList.remove('active')); document.getElementById('bgPrev').innerHTML=`<img src="${src}">`; document.getElementById('bgClear').hidden=false; refreshUser(); }));
document.getElementById('logoFile').addEventListener('change',e=>readFile(e.target,(im,src)=>{ userState.logoImg=im; document.getElementById('logoPrev').innerHTML=`<img src="${src}">`; document.getElementById('logoClear').hidden=false; refreshUser(); }));
document.getElementById('adLogoFile').addEventListener('change',e=>readFile(e.target,(im,src)=>{ adState.logoImg=im; document.getElementById('adLogoPrev').innerHTML=`<img src="${src}">`; document.getElementById('adLogoClear').hidden=false; refreshUser(); }));
document.getElementById('bgClear').addEventListener('click',e=>{ e.preventDefault(); e.stopPropagation(); userState.bgImg=null; userState.bg='paper'; userState.bgLabel='Cream paper'; document.getElementById('bgs').children[0].classList.add('active'); document.getElementById('bgPrev').textContent='🖼'; e.target.hidden=true; document.getElementById('bgFile').value=''; refreshUser(); });
document.getElementById('logoClear').addEventListener('click',e=>{ e.preventDefault(); e.stopPropagation(); userState.logoImg=null; document.getElementById('logoPrev').textContent='◆'; e.target.hidden=true; document.getElementById('logoFile').value=''; refreshUser(); });
document.getElementById('adLogoClear').addEventListener('click',e=>{ e.preventDefault(); e.stopPropagation(); adState.logoImg=null; document.getElementById('adLogoPrev').textContent='◆'; e.target.hidden=true; document.getElementById('adLogoFile').value=''; refreshUser(); });


/* ---------- scroll-driven How It Works ---------- */
const howSec=document.getElementById('how'), steps=[...document.querySelectorAll('.step')], prog=document.querySelectorAll('#prog i');
const cams=[[0,3.4,7.0],[0,4.8,4.0],[-2.4,3.0,5.8],[0,3.3,6.8]];
function updateHow(){ if(!how) return; if(REDUCED){ how.setDesignOpacity(1); how.setProps(true); how.refresh(1); steps.forEach((s,i)=>s.classList.toggle('on',i===3)); return; }
  const r=howSec.getBoundingClientRect(), total=r.height-innerHeight, p=Math.min(1,Math.max(0,-r.top/total));
  const seg=Math.min(3,Math.floor(p*4)), local=(p*4)-seg;
  steps.forEach((s,i)=>s.classList.toggle('on',i===seg)); prog.forEach((el,i)=>el.style.setProperty('--p',i<seg?1:i===seg?local:0));
  if(seg===0){ how.setDesignOpacity(0); how.setProps(false); how.refresh(0); }
  if(seg===1){ how.setDesignOpacity(local); how.setProps(false); how.refresh(0); }
  if(seg===2){ how.setDesignOpacity(1); how.setProps(local>.6); how.refresh(local); }
  if(seg===3){ how.setDesignOpacity(1); how.setProps(true); how.refresh(1); }
  const mc=innerWidth<640?cams[seg].map((v,k)=>k===0?v:v*.95):cams[seg]; how.setCamera(...mc); how.setRot(.6+p*2.4);
}
addEventListener('scroll',updateHow,{passive:true});

/* ---------- background catalogs: wood samples + Pantone ---------- */
(function(){
  const wg=document.getElementById('woodGrid'), pg=document.getElementById('panGrid'), bgs=document.getElementById('bgs');
  if(!wg||!window.WOOD_CODES) return;
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
})();
