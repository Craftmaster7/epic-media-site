/* ---------- counters, pins, gallery tilt, parallax, toggle ---------- */
const io=new IntersectionObserver(es=>es.forEach(en=>{ if(!en.isIntersecting) return; const el=en.target,end=+el.dataset.count,t0=performance.now();
  (function tick(n){ const p=Math.min(1,(n-t0)/1600),e=1-Math.pow(1-p,3); el.textContent=Math.round(end*e).toLocaleString(); if(p<1) requestAnimationFrame(tick); })(t0); io.unobserve(el); }),{threshold:.6});
document.querySelectorAll('[data-count]').forEach(el=>io.observe(el));
const pinsEl=document.getElementById('pins'); if(pinsEl) for(let i=0;i<35;i++){ const p=document.createElement('span'); p.className='pin'; p.style.left=(3+Math.random()*94)+'%'; p.style.top=(10+Math.random()*80)+'%'; p.style.setProperty('--d',(Math.random()*3)+'s'); pinsEl.appendChild(p); }
document.querySelectorAll('.gcard').forEach(c=>{ c.addEventListener('pointermove',e=>{ const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height; c.style.transform=`rotateY(${(x-.5)*12}deg) rotateX(${(.5-y)*10}deg)`; c.style.setProperty('--mx',x*100+'%'); c.style.setProperty('--my',y*100+'%'); }); c.addEventListener('pointerleave',()=>c.style.transform=''); });
const win=document.getElementById('window'); if(win){ const bg=win.querySelector('.bg'); win.addEventListener('pointermove',e=>{ const r=win.getBoundingClientRect(); bg.style.setProperty('--px',((e.clientX-r.left)/r.width-.5)*-40+'px'); bg.style.setProperty('--py',((e.clientY-r.top)/r.height-.5)*-24+'px'); }); }

/* ---------- shared nav: mobile drawer + scroll-spy ---------- */
(function(){
  const burger=document.getElementById('burger'), menu=document.getElementById('menu');
  if(burger){ burger.addEventListener('click',()=>{ const open=document.body.classList.toggle('menu-open'); burger.setAttribute('aria-expanded',open); }); menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('menu-open'))); }
  const links=[...document.querySelectorAll('#menu a[data-spy]')]; if(!links.length) return;
  const secs=links.map(a=>document.querySelector(a.dataset.spy)).filter(Boolean);
  const spy=new IntersectionObserver(es=>{ es.forEach(e=>{ if(!e.isIntersecting) return; links.forEach(a=>a.classList.toggle('active',a.dataset.spy==='#'+e.target.id)); }); },{rootMargin:'-40% 0px -55% 0px'});
  secs.forEach(x=>spy.observe(x));
})();
/* ---------- lead form: sends to Web3Forms if a key is set, otherwise opens an email ---------- */
document.querySelectorAll('form.lead').forEach(f=>{
  const CFG=window.SITE_CONFIG||{};
  f.addEventListener('submit',async e=>{ e.preventDefault(); let ok=true;
    f.querySelectorAll('[required]').forEach(i=>{ const bad=!i.value.trim()||(i.type==='email'&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value)); i.classList.toggle('bad',bad); if(bad) ok=false; });
    const msg=f.querySelector('.form-msg'); if(!ok){ msg.textContent='Please check the highlighted fields.'; msg.className='form-msg err'; return; }
    const seatBtn=f.querySelector('#contactToggle .active'); const seat=seatBtn?seatBtn.textContent.trim():(location.pathname.includes('advertisers')?'Local business':'Restaurant owner');
    const vals=[...f.querySelectorAll('input.text')].map(i=>i.getAttribute('aria-label')+': '+i.value);
    const concept=f.querySelector('#conceptText'); const thumb=f.querySelector('#conceptThumb');
    const summary=`I am a: ${seat}\n${vals.join('\n')}${concept?'\nConcept: '+concept.textContent:''}`;
    const btn=f.querySelector('button[type=submit]'); btn.disabled=true; msg.textContent='Sending…'; msg.className='form-msg';
    if(CFG.formAccessKey){
      try{ const body={access_key:CFG.formAccessKey,subject:'Website lead: '+seat,from_name:'Epic Media Networks website',message:summary};
        vals.forEach(v=>{ const [k,...r]=v.split(': '); body[k]=r.join(': '); }); body['I am a']=seat; if(concept) body['Concept']=concept.textContent;
        if(thumb){ try{ body['Concept image (data URL)']=thumb.toDataURL('image/png'); }catch(e){} }
        const r=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(body)});
        const j=await r.json(); if(!j.success) throw new Error(j.message||'send failed');
        f.classList.add('sent'); msg.textContent='Thanks. We\'ll reach out within one business day.'; msg.className='form-msg ok'; return;
      }catch(err){ msg.textContent='Sorry, that didn\'t send. Please call '+(CFG.phone||'us')+' or try again.'; msg.className='form-msg err'; btn.disabled=false; return; }
    }
    // no key configured: open the visitor's email app with everything pre-filled
    location.href='mailto:'+(CFG.leadEmail||'')+'?subject='+encodeURIComponent('Website lead: '+seat)+'&body='+encodeURIComponent(summary);
    f.classList.add('sent'); msg.textContent='Your email app should open with the details filled in. Send it and we\'ll reach out within one business day.'; msg.className='form-msg ok'; });
  f.querySelectorAll('input').forEach(i=>i.addEventListener('input',()=>i.classList.remove('bad')));
});
/* ---------- scheduler + phone from config ---------- */
(function(){ const CFG=window.SITE_CONFIG||{};
  document.querySelectorAll('a').forEach(a=>{ const t=a.textContent.trim().toLowerCase();
    if(t==='schedule a call'){ if(CFG.schedulerUrl){ a.href=CFG.schedulerUrl; a.target='_blank'; a.rel='noopener'; } else { a.href=CFG.phoneHref||'tel:+16024107141'; a.textContent='Call '+(CFG.phone||'(602) 410-7141'); } } });
})();
/* ---------- in-page links: scroll even where the URL can't change (embedded previews) ---------- */
document.addEventListener('click',e=>{ const a=e.target.closest('a[href^="#"]'); if(!a) return; const id=a.getAttribute('href').slice(1); if(!id) return; const el=document.getElementById(id); if(!el) return;
  e.preventDefault(); el.scrollIntoView({behavior:'smooth',block:'start'}); try{ history.replaceState(null,'','#'+id); }catch(x){} });
/* ---------- floor edge: end the room at the hero's proof line, table keeps going ---------- */
(function(){
  function setEdge(){ document.querySelectorAll('.hero, .page-hero').forEach(h=>{ const note=h.querySelector('.hero-note'), cv=h.querySelector('canvas.room-layer'); if(!note||!cv) return;
    const hb=h.getBoundingClientRect(), nb=note.getBoundingClientRect(); cv.style.setProperty('--fe',Math.round(nb.bottom-hb.top+90)+'px'); }); }
  addEventListener('resize',setEdge); addEventListener('load',setEdge); setTimeout(setEdge,300); setTimeout(setEdge,1500); document.fonts&&document.fonts.ready.then(setEdge);
})();
