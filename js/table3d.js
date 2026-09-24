/* ---------- assets ---------- */
const WOODS=['wood','gray','walnut','oak','espresso'];
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
function hasWebGL(){ try{ const c=document.createElement('canvas'); return !!(window.THREE&&(c.getContext('webgl')||c.getContext('experimental-webgl'))); }catch(e){ return false; } }
const IMG={};
function loadImg(k,src){ return new Promise(r=>{ const i=new Image(); i.onload=()=>{IMG[k]=i;r(i)}; i.onerror=()=>r(null); i.src=src; }); }

/* ---------- sample advertisers (fictional, no real information) ---------- */
const ADS=[
  {name:'RIDGELINE EQUIPMENT',tag:'Tractors · Mowers · Parts',phone:'(555) 010-4471',bg:'#f26522',fg:'#ffffff',accent:'#1a1a1a'},
  {name:'HARBOR FAMILY DENTAL',tag:'New patients welcome',phone:'(555) 010-2280',bg:'#ffffff',fg:'#14213d',accent:'#2a9d8f'},
  {name:'BLUE PINE AUTO',tag:'Import & domestic repair',phone:'(555) 010-7719',bg:'#14213d',fg:'#ffffff',accent:'#e9c46a'},
  {name:'MAPLE & MAIN REALTY',tag:'Your neighborhood experts',phone:'(555) 010-3305',bg:'#fdf6e3',fg:'#8f1d1d',accent:'#8f1d1d'},
  {name:'SUMMIT HEATING & AIR',tag:'24-hour service',phone:'(555) 010-9142',bg:'#c1272d',fg:'#ffffff',accent:'#ffffff'},
  {name:'THE LEATHER LOFT',tag:'Boots · Saddles · Repair',phone:'(555) 010-6608',bg:'#5b3a1e',fg:'#f4eee4',accent:'#e0b45a'},
  {name:'IRONWOOD FITNESS',tag:'First month free',phone:'(555) 010-1157',bg:'#111111',fg:'#ffffff',accent:'#8ce04a'},
  {name:'SUNRISE PET CLINIC',tag:'Compassionate care',phone:'(555) 010-8823',bg:'#e9f4fb',fg:'#1b4b72',accent:'#f4a261'},
  {name:'CANYON LAW GROUP',tag:'Free consultation',phone:'(555) 010-5504',bg:'#1e3a2f',fg:'#f4eee4',accent:'#c9a24d'},
  {name:'BRIGHTWATER PLUMBING',tag:'Licensed · Insured',phone:'(555) 010-6690',bg:'#0077b6',fg:'#ffffff',accent:'#ffd166'},
  {name:'OLIVE TREE INSURANCE',tag:'Home · Auto · Life',phone:'(555) 010-2314',bg:'#ffffff',fg:'#2d6a4f',accent:'#2d6a4f'},
  {name:'NORTH FORK HARDWARE',tag:'Since 1974',phone:'(555) 010-7431',bg:'#d62828',fg:'#ffffff',accent:'#fcbf49'},
];
function rr(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function drawAd(ctx,ad,w,h,alpha){
  ctx.save(); ctx.globalAlpha=alpha;
  ctx.shadowColor='rgba(0,0,0,.35)'; ctx.shadowBlur=w*.04; ctx.shadowOffsetY=w*.012;
  ctx.fillStyle=ad.bg;
  if(ad.circle){ ctx.beginPath(); ctx.arc(0,0,w/2,0,7); } else rr(ctx,-w/2,-h/2,w,h,w*.03);
  ctx.fill(); ctx.shadowColor='transparent';
  ctx.strokeStyle='rgba(255,255,255,.55)'; ctx.lineWidth=w*.012; ctx.stroke();
  ctx.clip();
  if(ad.circle){
    ctx.fillStyle=ad.accent; ctx.fillRect(-w/2,h/2-h*.12,w,h*.12);
    ctx.fillStyle=ad.fg; ctx.textAlign='center'; ctx.textBaseline='middle';
    if(ad.logo){ const box=w*.55, r=Math.min(box/ad.logo.width,box*.7/ad.logo.height); ctx.drawImage(ad.logo,-ad.logo.width*r/2,-h*.2-ad.logo.height*r/2,ad.logo.width*r,ad.logo.height*r); }
    else { let fs=h*.2; ctx.font=`${fs}px "Bebas Neue", Impact, sans-serif`; while(ctx.measureText(ad.name).width>w*.8&&fs>h*.07){fs*=.94;ctx.font=`${fs}px "Bebas Neue", Impact, sans-serif`;} ctx.fillText(ad.name,0,-h*.2); }
    ctx.font=`500 ${h*.09}px "Libre Franklin", sans-serif`; ctx.globalAlpha=alpha*.85; ctx.fillText(ad.tag,0,h*.06); ctx.globalAlpha=alpha;
    ctx.font=`700 ${h*.11}px "Libre Franklin", sans-serif`; ctx.fillText(ad.phone,0,h*.24);
    ctx.restore(); return;
  }
  ctx.fillStyle=ad.accent; ctx.fillRect(-w/2,h/2-h*.08,w,h*.08);
  ctx.fillStyle=ad.fg; ctx.textAlign='left'; ctx.textBaseline='middle';
  const tall=h/w>.7, pad=w*.07, tw=w-pad*2-(tall?0:w*.24);
  if(ad.logo){ const r=Math.min(tw/ad.logo.width,h*.34/ad.logo.height); ctx.drawImage(ad.logo,-w/2+pad,-h*.4,ad.logo.width*r,ad.logo.height*r); }
  else { let fs=h*.26; ctx.font=`${fs}px "Bebas Neue", Impact, sans-serif`; while(ctx.measureText(ad.name).width>tw && fs>h*.08){ fs*=.94; ctx.font=`${fs}px "Bebas Neue", Impact, sans-serif`; } ctx.fillText(ad.name,-w/2+pad,-h*.22); }
  ctx.font=`500 ${h*.11}px "Libre Franklin", sans-serif`; ctx.globalAlpha=alpha*.85; ctx.fillText(ad.tag,-w/2+pad,h*.02); ctx.globalAlpha=alpha;
  ctx.font=`700 ${h*.15}px "Libre Franklin", sans-serif`; ctx.fillStyle=ad.fg; ctx.fillText(ad.phone,-w/2+pad,h*.24);
  if(!tall){ const q=h*.42, qx=w/2-pad-q, qy=-h/2+h*.14; ctx.fillStyle='#fff'; ctx.fillRect(qx,qy,q,q); ctx.fillStyle='#111';
    let seed=ad.name.length*7; const n=7,c=q/n;
    for(let i=0;i<n;i++)for(let j=0;j<n;j++){ seed=(seed*9301+49297)%233280; const corner=(i<3&&j<3)||(i<3&&j>3)||(i>3&&j<3); if(corner? (i%3!==1||j%3!==1)&&!(i===1&&j===1)&&!(i===1&&j===5)&&!(i===5&&j===1) : seed/233280>.5) ctx.fillRect(qx+i*c+c*.1,qy+j*c+c*.1,c*.8,c*.8); } }
  ctx.restore();
}
const AD_SIZES={'8x4':[8,4],'5x3':[5,3],'4x4':[4,4],'4x2':[4,2],'3c':[3,3,true]};
function isLight(hex){ const n=parseInt(hex.slice(1),16); return (((n>>16)*299+((n>>8)&255)*587+(n&255)*114)/1000)>150; }
function userAdSpec(a){ const light=isLight(a.bg); return {name:(a.name||'YOUR BUSINESS').toUpperCase(),tag:a.tag||'Your offer or tagline',phone:a.phone||'(555) 010-0000',bg:a.bg,fg:light?'#14213d':'#ffffff',accent:light?'#8f1d1d':'#e0b45a',logo:a.logoImg,circle:!!AD_SIZES[a.size][2]}; }

/* ---------- table design renderer ---------- */
function drawDesign(cv,s,adProgress=1){
  const ctx=cv.getContext('2d'), W=cv.width, c=W/2, sq=s.shape==='square';
  ctx.clearRect(0,0,W,W); ctx.save();
  if(sq){ rr(ctx,0,0,W,W,W*.04); } else { ctx.beginPath(); ctx.arc(c,c,c,0,Math.PI*2); }
  ctx.clip();
  // background
  if(s.bg.startsWith('wood:')&&s.bgImg){ // scanned catalog sample stretched to fill the whole top, corner to corner
    ctx.imageSmoothingQuality='high'; ctx.drawImage(s.bgImg,0,0,W,W); }
  else if(s.bg==='custom'&&s.bgImg){ const im=s.bgImg, r=Math.max(W/im.width,W/im.height); ctx.drawImage(im,c-im.width*r/2,c-im.height*r/2,im.width*r,im.height*r); }
  else if(WOODS.includes(s.bg)&&IMG[s.bg]){ const p=ctx.createPattern(IMG[s.bg],'repeat'); ctx.fillStyle=p; ctx.save(); ctx.scale(.75,.75); ctx.fillRect(0,0,W/.75,W/.75); ctx.restore(); }
  else if(s.bg==='paper'){ ctx.fillStyle='#f3ece0'; ctx.fillRect(0,0,W,W); if(IMG.paper){ ctx.globalAlpha=.5; ctx.fillStyle=ctx.createPattern(IMG.paper,'repeat'); ctx.fillRect(0,0,W,W); ctx.globalAlpha=1; } }
  else if(s.bg.startsWith('pantone:')){ ctx.fillStyle=s.color||'#f3ece0'; ctx.fillRect(0,0,W,W); }
  else { ctx.fillStyle=s.bg==='navy'?'#14213d':'#8f1d1d'; ctx.fillRect(0,0,W,W); }
  const dark=s.bg==='navy'||s.bg==='brick'||((s.bg==='custom'||s.bg.startsWith('wood:')||s.bg.startsWith('pantone:'))&&s.bgDark)||['wood','walnut','espresso','gray'].includes(s.bg);
  const ink=dark?'#f4eee4':'#14213d', gold='#b8862b';
  // gold rules / frame
  ctx.strokeStyle=gold; ctx.globalAlpha=.85; ctx.lineWidth=W*.004;
  if(sq){ rr(ctx,W*.035,W*.035,W*.93,W*.93,W*.02); ctx.stroke(); ctx.lineWidth=W*.0015; rr(ctx,W*.05,W*.05,W*.9,W*.9,W*.015); ctx.stroke(); }
  else { ctx.beginPath(); ctx.arc(c,c,c*.965,0,7); ctx.stroke(); ctx.lineWidth=W*.0015; ctx.beginPath(); ctx.arc(c,c,c*.94,0,7); ctx.stroke(); }
  ctx.globalAlpha=1;
  // ad ring
  const n=s.slots, tileW=W*(sq?(n>=12?.16:n>=10?.18:.2):(n>=10?.19:.22)), tileH=tileW*.5;
  for(let i=0;i<n;i++){
    const t=Math.min(1,Math.max(0,(adProgress*n-i))); if(t<=0) continue;
    let x,y,rot;
    if(sq){ // distribute across four sides: top, bottom, right, left
      const base=Math.floor(n/4), extra=n%4, counts=[base+(extra>0?1:0),base+(extra>1?1:0),base+(extra>2?1:0),base]; // top,bottom,right,left
      let idx=i, side=0; while(idx>=counts[side]){ idx-=counts[side]; side++; }
      const inset=W*.14, m=tileW*.62, L=W-inset*2-m*2, f=(idx+.5)/counts[side];
      if(side===0){x=inset+m+L*f;y=inset;rot=0;}
      else if(side===1){x=W-inset-m-L*f;y=W-inset;rot=Math.PI;}
      else if(side===2){x=W-inset;y=inset+m+L*f;rot=Math.PI/2;}
      else {x=inset;y=W-inset-m-L*f;rot=-Math.PI/2;}
    } else { const a=-Math.PI/2+i*(Math.PI*2/n); x=c+Math.cos(a)*c*.7; y=c+Math.sin(a)*c*.7; rot=a+Math.PI/2; }
    ctx.save(); ctx.translate(x,y); ctx.rotate(rot+Math.PI);
    if(i===0&&s.userAd){ const sz=AD_SIZES[s.userAd.size], ppi=W/36; drawAd(ctx,userAdSpec(s.userAd),sz[0]*ppi,sz[1]*ppi,t); }
    else drawAd(ctx,ADS[i%ADS.length],tileW,tileH,t);
    ctx.restore();
  }
  // center plate + logo + name
  const R=sq?c*.46:c*.42;
  const logo=s.logoImg;
  if(logo){
    ctx.save(); ctx.shadowColor='rgba(0,0,0,.25)'; ctx.shadowBlur=W*.03;
    ctx.fillStyle=dark?'rgba(244,238,228,.94)':'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.arc(c,c,R,0,7); ctx.fill(); ctx.restore();
    ctx.strokeStyle=gold; ctx.lineWidth=W*.003; ctx.beginPath(); ctx.arc(c,c,R*.93,0,7); ctx.stroke();
    const box=R*1.3, r=Math.min(box/logo.width,box*(s.name?.7:1)/logo.height), lw=logo.width*r, lh=logo.height*r;
    ctx.drawImage(logo,c-lw/2,c-lh/2-(s.name?R*.14:0),lw,lh);
    if(s.name){ ctx.fillStyle='#14213d'; ctx.textAlign='center'; ctx.textBaseline='middle'; let fs=R*.28; ctx.font=`${fs}px "Bebas Neue", Impact, sans-serif`; while(ctx.measureText(s.name).width>R*1.6&&fs>R*.1){fs*=.94;ctx.font=`${fs}px "Bebas Neue", Impact, sans-serif`;} ctx.fillText(s.name,c,c+R*.55); }
  } else {
    ctx.strokeStyle=ink; ctx.globalAlpha=.6; ctx.lineWidth=W*.0025; ctx.beginPath(); ctx.arc(c,c,R,0,7); ctx.stroke(); ctx.globalAlpha=1;
    ctx.fillStyle=ink; ctx.textAlign='center'; ctx.textBaseline='middle';
    const nm=s.name||'YOUR LOGO HERE'; let fs=R*.5; ctx.font=`${fs}px "Bebas Neue", Impact, sans-serif`; while(ctx.measureText(nm).width>R*1.7&&fs>R*.15){fs*=.94;ctx.font=`${fs}px "Bebas Neue", Impact, sans-serif`;}
    ctx.fillText(nm,c,c-R*.05);
    ctx.fillStyle=gold; ctx.fillRect(c-R*.35,c+R*.22,R*.7,W*.002);
    ctx.font=`700 ${R*.11}px "Libre Franklin", sans-serif`; ctx.fillStyle=ink; ctx.fillText(s.name?'LOCALLY OWNED  ·  FAMILY RUN':'UPLOAD YOUR LOGO TO PREVIEW',c,c+R*.4);
  }
  ctx.restore();
}


/* ---------- procedural diner room (used behind hero tables) ---------- */
function noiseCanvas(size,base,amt){ const c=document.createElement('canvas'); c.width=c.height=size; const x=c.getContext('2d'); const d=x.createImageData(size,size);
  for(let i=0;i<d.data.length;i+=4){ const v=base+(Math.random()-.5)*amt; d.data[i]=d.data[i+1]=d.data[i+2]=v; d.data[i+3]=255; } x.putImageData(d,0,0); return c; }
function checkerTexture(){ const c=document.createElement('canvas'); c.width=c.height=512; const x=c.getContext('2d');
  for(let i=0;i<8;i++)for(let j=0;j<8;j++){ const dark=(i+j)%2; x.fillStyle=dark?'#26221f':'#e6ddcc'; x.fillRect(i*64,j*64,64,64);
    const g=x.createLinearGradient(i*64,j*64,i*64+64,j*64+64); g.addColorStop(0,'rgba(255,255,255,.06)'); g.addColorStop(1,'rgba(0,0,0,.08)'); x.fillStyle=g; x.fillRect(i*64,j*64,64,64);
    x.strokeStyle='rgba(0,0,0,.35)'; x.lineWidth=2; x.strokeRect(i*64+1,j*64+1,62,62); }
  const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(16,16); t.encoding=THREE.sRGBEncoding; t.anisotropy=16; return t; }
function windowTexture(){ const c=document.createElement('canvas'); c.width=256; c.height=384; const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,0,384); g.addColorStop(0,'#fff6e6'); g.addColorStop(.5,'#ffdfae'); g.addColorStop(1,'#d9a15e'); x.fillStyle=g; x.fillRect(0,0,256,384);
  x.fillStyle='rgba(90,70,50,.28)'; x.fillRect(0,260,256,124); x.fillStyle='rgba(255,255,255,.35)'; x.fillRect(0,60,256,30);
  x.fillStyle='#2a1c14'; x.fillRect(124,0,8,384); x.fillRect(0,186,256,8);
  const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; return t; }
function contactShadow(){ const c=document.createElement('canvas'); c.width=c.height=256; const x=c.getContext('2d'); const g=x.createRadialGradient(128,128,10,128,128,128); g.addColorStop(0,'rgba(0,0,0,.55)'); g.addColorStop(.6,'rgba(0,0,0,.18)'); g.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle=g; x.fillRect(0,0,256,256); return new THREE.CanvasTexture(c); }
function makeEnvironment(renderer){ // small emissive scene baked into a reflection map so metals, gloss, and leather pick up the room
  const s=new THREE.Scene(); const pm=new THREE.PMREMGenerator(renderer);
  s.add(new THREE.Mesh(new THREE.SphereGeometry(30,16,16),new THREE.MeshBasicMaterial({color:0x3a2a22,side:THREE.BackSide})));
  const add=(x,y,z,w,h,col,ry=0)=>{ const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:col})); m.position.set(x,y,z); m.rotation.y=ry; m.lookAt(0,0,0); s.add(m); };
  add(0,3,-12,6,3,0xfff0d8); add(-12,3,-2,4,3,0xffe6c4); add(12,3,-2,4,3,0xffe6c4); add(0,9,0,3,3,0xffd39a); add(-4,9,-3,1.2,1.2,0xffc98a); add(4,9,-3,1.2,1.2,0xffc98a);
  const env=pm.fromScene(s,.04).texture; pm.dispose(); return env; }
function imgTexture(im,rx,ry){ const t=new THREE.Texture(im); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(rx,ry); t.encoding=THREE.sRGBEncoding; t.anisotropy=8; t.needsUpdate=true; return t; }
function buildRoom(scene, renderer){
  const R=new THREE.Group(); scene.add(R); const FY=-1.2;
  const bump=new THREE.CanvasTexture(noiseCanvas(256,128,60)); bump.wrapS=bump.wrapT=THREE.RepeatWrapping; bump.repeat.set(4,4);
  const leather=new THREE.MeshPhysicalMaterial({color:0x6a1c1c,roughness:.55,metalness:0,bumpMap:bump,bumpScale:.012,clearcoat:.25,clearcoatRoughness:.5});
  const woodMap=IMG.walnut?imgTexture(IMG.walnut,1,1):null;
  const wood=new THREE.MeshPhysicalMaterial({color:woodMap?0xffffff:0x4a2f1e,map:woodMap,roughness:.35,clearcoat:.6,clearcoatRoughness:.3});
  const wain=new THREE.MeshPhysicalMaterial({color:woodMap?0xbfa48a:0x3a2519,map:woodMap,roughness:.5,clearcoat:.3});
  const plaster=new THREE.MeshStandardMaterial({color:0x6b5446,roughness:.95,bumpMap:bump,bumpScale:.004});
  const chrome=new THREE.MeshStandardMaterial({color:0xd9d9d9,metalness:1,roughness:.18});
  const RB=(w,h,d,r)=>new THREE.RoundedBoxGeometry(w,h,d,4,r);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(60,60),new THREE.MeshPhysicalMaterial({map:checkerTexture(),roughness:.62,metalness:0,clearcoat:.12,clearcoatRoughness:.5})); floor.rotation.x=-Math.PI/2; floor.position.y=FY; floor.receiveShadow=true; R.add(floor);
  const cs=new THREE.Mesh(new THREE.PlaneGeometry(4.6,4.6),new THREE.MeshBasicMaterial({map:contactShadow(),transparent:true,depthWrite:false})); cs.rotation.x=-Math.PI/2; cs.position.y=FY+.004; R.add(cs);
  const ceil=new THREE.Mesh(new THREE.PlaneGeometry(60,60),new THREE.MeshStandardMaterial({color:0x2b2320,roughness:1})); ceil.rotation.x=Math.PI/2; ceil.position.y=FY+5.2; R.add(ceil);
  const back=new THREE.Mesh(new THREE.PlaneGeometry(60,6),plaster); back.position.set(0,FY+3,-11); back.receiveShadow=true; R.add(back);
  const wainB=new THREE.Mesh(RB(60,1.15,.14,.02),wain); wainB.position.set(0,FY+.575,-10.93); R.add(wainB);
  const railB=new THREE.Mesh(new THREE.BoxGeometry(60,.06,.2),wood); railB.position.set(0,FY+1.18,-10.9); R.add(railB);
  const left=new THREE.Mesh(new THREE.PlaneGeometry(40,6),plaster); left.rotation.y=Math.PI/2; left.position.set(-13,FY+3,0); R.add(left);
  const right=new THREE.Mesh(new THREE.PlaneGeometry(40,6),plaster); right.rotation.y=-Math.PI/2; right.position.set(13,FY+3,0); R.add(right);
  const wt=windowTexture();
  function win(x,y,z,ry,w=2.2,h=3.0){ const g=new THREE.Group(); g.position.set(x,y,z); g.rotation.y=ry;
    const pane=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:wt})); g.add(pane);
    const fm=new THREE.MeshPhysicalMaterial({color:0x2a1c14,roughness:.45,clearcoat:.4});
    [[0,h/2+.07,w+.28,.14],[0,-h/2-.07,w+.28,.14],[-w/2-.07,0,.14,h],[w/2+.07,0,.14,h]].forEach(([fx,fy,fw,fh])=>{ const f=new THREE.Mesh(RB(fw,fh,.16,.02),fm); f.position.set(fx,fy,.03); g.add(f); });
    const sill=new THREE.Mesh(RB(w+.5,.08,.34,.02),fm); sill.position.set(0,-h/2-.14,.12); g.add(sill);
    const glow=new THREE.PointLight(0xffd7a8,.45,9,2); glow.position.set(0,0,.8); g.add(glow); R.add(g); }
  win(-6,FY+2.9,-10.9,0); win(0,FY+2.9,-10.9,0); win(6,FY+2.9,-10.9,0); win(12.9,FY+2.9,-3,-Math.PI/2);
  function booth(x,z,ry){ const g=new THREE.Group(); g.position.set(x,FY,z); g.rotation.y=ry;
    const base=new THREE.Mesh(RB(2.4,.22,.9,.02),wain); base.position.set(0,.11,0); g.add(base);
    const seat=new THREE.Mesh(RB(2.4,.42,.92,.12),leather); seat.position.set(0,.43,0); seat.castShadow=true; g.add(seat);
    const bk=new THREE.Mesh(RB(2.4,1.5,.3,.1),leather); bk.position.set(0,1.1,-.38); bk.rotation.x=-.06; g.add(bk);
    const cap=new THREE.Mesh(RB(2.44,.08,.36,.03),wood); cap.position.set(0,1.88,-.4); g.add(cap);
    // stitched channels
    for(let i=-1;i<=1;i++){ const line=new THREE.Mesh(new THREE.BoxGeometry(.02,1.3,.02),new THREE.MeshStandardMaterial({color:0x3a0e0e})); line.position.set(i*.8,1.1,-.22); g.add(line); }
    R.add(g); }
  function boothTable(x,z){ const top=new THREE.Mesh(RB(1.6,.08,1.1,.03),wood); top.position.set(x,FY+.78,z); top.castShadow=true; R.add(top);
    const trim=new THREE.Mesh(new THREE.BoxGeometry(1.64,.04,1.14),chrome); trim.position.set(x,FY+.76,z); R.add(trim);
    const leg=new THREE.Mesh(new THREE.CylinderGeometry(.05,.07,.74,24),chrome); leg.position.set(x,FY+.37,z); R.add(leg);
    const foot=new THREE.Mesh(new THREE.CylinderGeometry(.3,.34,.05,32),chrome); foot.position.set(x,FY+.03,z); R.add(foot); }
  [-9,-3,3,9].forEach(x=>{ booth(x,-9.6,0); booth(x,-7.2,Math.PI); boothTable(x,-8.4); });
  [-4.5,1.2].forEach(z=>{ booth(12,z,-Math.PI/2); booth(9.6,z,Math.PI/2); boothTable(10.8,z); });
  [-4.5,1.2].forEach(z=>{ booth(-12,z,Math.PI/2); booth(-9.6,z,-Math.PI/2); boothTable(-10.8,z); });
  function pendant(x,z,lit){ const g=new THREE.Group(); g.position.set(x,FY+5.2,z);
    const cord=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,1.5,6),new THREE.MeshStandardMaterial({color:0x111111})); cord.position.y=-.75; g.add(cord);
    const pts=[]; for(let i=0;i<=12;i++){ const u=i/12; pts.push(new THREE.Vector2(.14+Math.pow(u,1.6)*.34,-u*.44)); }
    const shade=new THREE.Mesh(new THREE.LatheGeometry(pts,48),new THREE.MeshPhysicalMaterial({color:0x151515,roughness:.3,metalness:.6,clearcoat:.5,side:THREE.DoubleSide})); shade.position.y=-1.5; g.add(shade);
    const inner=new THREE.Mesh(new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p.x-.01,p.y)),48),new THREE.MeshBasicMaterial({color:0xffe6be,side:THREE.BackSide})); inner.position.y=-1.5; g.add(inner);
    const bulb=new THREE.Mesh(new THREE.SphereGeometry(.07,16,16),new THREE.MeshBasicMaterial({color:0xfff6e0})); bulb.position.y=-1.78; g.add(bulb);
    if(lit){ const l=new THREE.PointLight(0xffc98a,lit,9,2); l.position.y=-1.9; g.add(l); }
    R.add(g); }
  pendant(-1.9,-1.2,.8); pendant(1.9,-1.2,.8); pendant(-4,-7,.6); pendant(4,-7,.6); pendant(9.6,-1.6,.5); pendant(-9.6,-1.6,.5);
  scene.fog=new THREE.Fog(0x3a2b24,10,28);
  scene.environment=makeEnvironment(renderer);
  return R;
}

/* ---------- 3D scene factory ---------- */
function makeTable(container, opts={}){
  if(!hasWebGL()){ // static 2D fallback: top-down rendering of the same design
    const cv=document.createElement('canvas'); cv.width=cv.height=1024; cv.className='fallback'; cv.setAttribute('role','img'); cv.setAttribute('aria-label','Custom restaurant tabletop with local business ads'); container.appendChild(cv);
    const api={state:opts.state,adProgress:1,refresh(p){ if(p!=null) api.adProgress=p; drawDesign(cv,api.state,api.adProgress); },setDesignOpacity(){},setProps(){},setCamera(){},setRot(){},setIdle(){},running:true};
    api.refresh(1); return api; }
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<640?1.5:2)); renderer.outputEncoding=THREE.sRGBEncoding; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.02;
  renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap; container.appendChild(renderer.domElement); renderer.domElement.setAttribute('role','img'); renderer.domElement.setAttribute('aria-label',opts.label||'Interactive 3D restaurant table. Drag to rotate.');
  const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(32,1,.1,50); camera.position.set(0,2.6,4.6);
  const key=new THREE.SpotLight(0xfff1dc,2.1,20,Math.PI/5,.6,1); key.position.set(1.5,5,2); key.castShadow=true; key.shadow.mapSize.set(2048,2048); key.shadow.bias=-.0005; scene.add(key);
  scene.add(new THREE.HemisphereLight(0xd9e6f5,0x5a4a3a,.7));
  const rim=new THREE.PointLight(0xb8862b,.8,10); rim.position.set(-3,1.5,-2); scene.add(rim);
  const g=new THREE.Group(); scene.add(g);
  let composer=null, tableRenderer=null, roomGroup=null;
  if(opts.room){ roomGroup=buildRoom(scene,renderer); renderer.setClearColor(0x2b1e18,1); renderer.toneMappingExposure=.82; key.intensity=.8; key.angle=Math.PI/6; key.color.set(0xffdcb0); key.penumbra=.8; scene.children.filter(o=>o.isHemisphereLight).forEach(h=>{h.intensity=.22;h.color.set(0xb9a48c);h.groundColor.set(0x3a2a20);});
    if(THREE.EffectComposer&&THREE.UnrealBloomPass){ composer=new THREE.EffectComposer(renderer); composer.addPass(new THREE.RenderPass(scene,camera)); const bloom=new THREE.UnrealBloomPass(new THREE.Vector2(512,512),.1,.5,.985); composer.addPass(bloom); }
    renderer.domElement.classList.add('room-layer');
    tableRenderer=new THREE.WebGLRenderer({antialias:true,alpha:true}); tableRenderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<640?1.5:2)); tableRenderer.outputEncoding=THREE.sRGBEncoding; tableRenderer.toneMapping=THREE.ACESFilmicToneMapping; tableRenderer.toneMappingExposure=.95; tableRenderer.shadowMap.enabled=true; tableRenderer.shadowMap.type=THREE.PCFSoftShadowMap; tableRenderer.setClearColor(0x000000,0);
    tableRenderer.domElement.classList.add('table-layer'); container.appendChild(tableRenderer.domElement); }
  else { const floor=new THREE.Mesh(new THREE.CircleGeometry(4,64),new THREE.ShadowMaterial({opacity:opts.dark?.45:.2})); floor.rotation.x=-Math.PI/2; floor.position.y=-1.2; floor.receiveShadow=true; scene.add(floor); }
  const metal=new THREE.MeshStandardMaterial({color:0x2b2b2b,metalness:.9,roughness:.3});
  const base=new THREE.Mesh(new THREE.CylinderGeometry(.55,.6,.06,64),metal); base.position.y=-1.17; base.castShadow=true; g.add(base);
  const post=new THREE.Mesh(new THREE.CylinderGeometry(.07,.09,1.1,32),metal); post.position.y=-.6; post.castShadow=true; g.add(post);
  const edgeMat=new THREE.MeshPhysicalMaterial({color:0x3b2a1c,roughness:.45,clearcoat:.5,clearcoatRoughness:.3});
  const cv=document.createElement('canvas'); cv.width=cv.height=1024;
  const tex=new THREE.CanvasTexture(cv); tex.encoding=THREE.sRGBEncoding; tex.anisotropy=8;
  const designMat=new THREE.MeshBasicMaterial({map:tex,transparent:true,toneMapped:false});
  const glossMat=new THREE.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.035,roughness:.1,clearcoat:1,clearcoatRoughness:.15,metalness:0});
  // round set
  const round=new THREE.Group();
  const rtop=new THREE.Mesh(new THREE.CylinderGeometry(1.3,1.3,.09,96),edgeMat); rtop.position.y=-.05; rtop.castShadow=true; rtop.receiveShadow=true; round.add(rtop);
  const rbev=new THREE.Mesh(new THREE.TorusGeometry(1.3,.03,16,96),new THREE.MeshStandardMaterial({color:0xb8862b,metalness:.85,roughness:.3})); rbev.rotation.x=Math.PI/2; round.add(rbev);
  const rdes=new THREE.Mesh(new THREE.CircleGeometry(1.28,96),designMat); rdes.rotation.x=-Math.PI/2; rdes.position.y=.001; rdes.receiveShadow=true; round.add(rdes);
  const rgl=new THREE.Mesh(new THREE.CircleGeometry(1.28,96),glossMat); rgl.rotation.x=-Math.PI/2; rgl.position.y=.004; round.add(rgl);
  g.add(round);
  // square set
  const square=new THREE.Group(); const S=2.5;
  const stop=new THREE.Mesh(THREE.RoundedBoxGeometry?new THREE.RoundedBoxGeometry(S,.09,S,3,.025):new THREE.BoxGeometry(S,.09,S),edgeMat); stop.position.y=-.05; stop.castShadow=true; stop.receiveShadow=true; square.add(stop);
  const frameMat=new THREE.MeshStandardMaterial({color:0xd6a548,metalness:.85,roughness:.28});
  [[0,S/2],[0,-S/2],[S/2,0],[-S/2,0]].forEach(([x,z],i)=>{ const m=new THREE.Mesh(new THREE.BoxGeometry(i<2?S+.06:.06,.05,i<2?.06:S+.06),frameMat); m.position.set(x,0,z); square.add(m); });
  const sdes=new THREE.Mesh(new THREE.PlaneGeometry(S-.06,S-.06),designMat); sdes.rotation.x=-Math.PI/2; sdes.position.y=.001; sdes.receiveShadow=true; square.add(sdes);
  const sgl=new THREE.Mesh(new THREE.PlaneGeometry(S-.06,S-.06),glossMat); sgl.rotation.x=-Math.PI/2; sgl.position.y=.004; square.add(sgl);
  square.visible=false; g.add(square);
  // props
  const cupMat=new THREE.MeshStandardMaterial({color:0xf4eee4,roughness:.5,side:THREE.DoubleSide});
  const cup=new THREE.Mesh(new THREE.CylinderGeometry(.11,.09,.16,32,1,true),cupMat); cup.position.set(.75,.09,.45); cup.castShadow=true; g.add(cup);
  const coffee=new THREE.Mesh(new THREE.CircleGeometry(.1,32),new THREE.MeshStandardMaterial({color:0x2a1a12,roughness:.2})); coffee.rotation.x=-Math.PI/2; coffee.position.set(.75,.15,.45); g.add(coffee);
  const saucer=new THREE.Mesh(new THREE.CylinderGeometry(.19,.17,.015,32),cupMat); saucer.position.set(.75,.012,.45); g.add(saucer);
  const napkin=new THREE.Mesh(new THREE.BoxGeometry(.22,.2,.14),new THREE.MeshStandardMaterial({color:0x8a8078,metalness:.9,roughness:.3})); napkin.position.set(-.8,.1,-.35); napkin.castShadow=true; g.add(napkin);
  const salt=new THREE.Mesh(new THREE.CylinderGeometry(.035,.04,.16,24),new THREE.MeshPhysicalMaterial({color:0xffffff,transmission:.5,roughness:.15,transparent:true,opacity:.9})); salt.position.set(-.55,.08,-.4); g.add(salt);
  const pepper=salt.clone(); pepper.position.x=-.45; g.add(pepper);
  const props=[cup,coffee,saucer,napkin,salt,pepper];

  const look=new THREE.Vector3(0,opts.room?-.35:-.15,opts.room?-.3:0); if(opts.room){ camera.fov=34; camera.updateProjectionMatrix(); }
  let rotY=opts.rot||.35, targetRot=rotY, dragging=false, lastX=0, idle=opts.idle!==false&&!REDUCED, camTarget=camera.position.clone();
  const el=container; el.style.cursor='grab'; el.style.touchAction='pan-y';
  el.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;el.setPointerCapture(e.pointerId)});
  el.addEventListener('pointermove',e=>{ if(!dragging) return; targetRot+=(e.clientX-lastX)*.008; lastX=e.clientX; });
  el.addEventListener('pointerup',()=>dragging=false); el.addEventListener('pointercancel',()=>dragging=false);
  function resize(){ const w=container.clientWidth,h=container.clientHeight; renderer.setSize(w,h,false); if(composer) composer.setSize(w,h); if(tableRenderer) tableRenderer.setSize(w,h,false); camera.aspect=w/h; const sh=(opts.shift&&w>960)?opts.shift:0; if(sh) camera.setViewOffset(w,h,-w*sh,0,w,h); else camera.clearViewOffset(); camera.updateProjectionMatrix(); }
  new ResizeObserver(resize).observe(container); resize();
  const api={ state:opts.state, adProgress:1,
    refresh(p){ if(p!=null) api.adProgress=p; drawDesign(cv,api.state,api.adProgress); tex.needsUpdate=true; round.visible=api.state.shape!=='square'; square.visible=!round.visible; },
    setDesignOpacity(o){ designMat.opacity=o; rgl.visible=sgl.visible=o>.5; },
    setProps(v){ props.forEach(m=>m.visible=v); },
    setCamera(x,y,z){ camTarget.set(x,y,z); }, setLook(x,y,z){ look.set(x,y,z); }, setRot(r){ targetRot=r; }, setIdle(v){ idle=v; }, cam:camera, tgt:camTarget, lk:look, running:true };
  api.refresh(1);
  let t0=performance.now();
  (function loop(now){ requestAnimationFrame(loop); if(!api.running){ t0=now; return; } const dt=Math.min((now-t0)/1000,.05); t0=now;
    const k=1-Math.pow(.92,Math.min(dt,.1)*60), kc=1-Math.pow(.95,Math.min(dt,.1)*60); if(idle&&!dragging) targetRot+=dt*.12; rotY+=(targetRot-rotY)*k; g.rotation.y=rotY; g.position.y=Math.sin(now*.0006)*.02;
    camera.position.lerp(camTarget,kc); camera.lookAt(look.x,look.y,look.z); if(composer) composer.render(); else renderer.render(scene,camera);
    if(tableRenderer){ const fog=scene.fog; scene.fog=null; roomGroup.visible=false; tableRenderer.render(scene,camera); roomGroup.visible=true; scene.fog=fog; } })(t0);
  new IntersectionObserver(([e])=>api.running=e.isIntersecting).observe(container);
  return api;
}

