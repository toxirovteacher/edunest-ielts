
const CLOUD_URL = "https://tuffyskazbkbezsghgtk.supabase.co/functions/v1/api";
const ST='edunest_ielts:';
const LOGO=new URL('img/logo.png',document.baseURI).href;const PHOTO=new URL('img/photo.jpg',document.baseURI).href;
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ls={get:k=>{try{return localStorage.getItem(ST+k)}catch(e){return null}},set:(k,v)=>{try{v==null?localStorage.removeItem(ST+k):localStorage.setItem(ST+k,v)}catch(e){}}};
const ss={get:k=>{try{return sessionStorage.getItem(ST+k)}catch(e){return null}},set:(k,v)=>{try{v==null?sessionStorage.removeItem(ST+k):sessionStorage.setItem(ST+k,v)}catch(e){}}};
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('on'),2600)}
async function cget(p,ms){const c=new AbortController();const tm=setTimeout(()=>c.abort(),ms||20000);try{const r=await fetch(CLOUD_URL+'?'+new URLSearchParams(p),{signal:c.signal});return await r.json()}finally{clearTimeout(tm)}}
async function cpost(b){const r=await fetch(CLOUD_URL,{method:'POST',body:JSON.stringify(b)});return r.json()}
/* the teacher's photo always in full quality (teacher.jpg); the small built-in copy only if that file fails */
const tph=i=>{i.addEventListener('error',()=>{if(i.src!==PHOTO)i.src=PHOTO});i.src='teacher.jpg'};
document.querySelectorAll('img.lg').forEach(i=>i.src=LOGO);document.querySelectorAll('img.tph').forEach(tph);

const TGI='<svg class="tgi" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.9 4.3 18.7 19.4c-.2 1-.9 1.3-1.7.8l-4.8-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.4 13.2l-4.7-1.5c-1-.3-1-1 .2-1.5L20.5 3c.9-.3 1.6.2 1.4 1.3z"/></svg>';
/* the test library: same ids and minutes as TESTS in test.html (build.py checks they match).
   Numbers follow the teacher's pack (Listening 4 is not in the pack yet, so l4 is missing on purpose). */
const TESTS=[
 {k:'listening',id:'l1',min:35},{k:'listening',id:'l2',min:39},{k:'listening',id:'l3',min:41},{k:'listening',id:'l5',min:34},
 {k:'listening',id:'l6',min:30},{k:'listening',id:'l7',min:26},{k:'listening',id:'l8',min:28},
 {k:'reading',id:'r1',min:60},{k:'reading',id:'r2',min:60},{k:'reading',id:'r3',min:60},{k:'reading',id:'r4',min:60}];
const SK={listening:'Listening',reading:'Reading'};
const TN=id=>{const x=TESTS.find(t=>t.id===id);return x?SK[x.k]+' · Test '+id.slice(1):String(id)};
const bestOf=(res,id)=>{const r=(res||[]).filter(x=>x.test===id);return r.length?r.reduce((a,b)=>+b.band>+a.band?b:a):null};
/* stacking skill cards (same effect as the Multi-Level landing): each card's sticky top is lowered when the card is
   taller than the screen, so it scrolls to its bottom edge first; the covered card shrinks a little */
function stkFx(){const K=$('#lpStack');if(!K||K.dataset.fx)return;K.dataset.fx=1;const C=[...K.children];let q=0;
  const T=()=>{const m=innerWidth<=860,H=innerHeight;C.forEach((c,i)=>{const h=c.offsetHeight;if(!h)return;
    const v=Math.min((m?76:92)+i*(m?10:14),H-h-12)+'px';if(c.style.top!==v)c.style.top=v})};
  const f=()=>{q=0;T();for(let i=0;i<C.length-1;i++){if(!C[i].offsetHeight)continue;const a=C[i].getBoundingClientRect(),b=C[i+1].getBoundingClientRect();
    C[i].style.setProperty('--k',Math.max(0,Math.min(1,1-(b.top-a.top)/(C[i].offsetHeight||1))).toFixed(3))}};
  addEventListener('resize',T,{passive:true});if(window.ResizeObserver)new ResizeObserver(T).observe(K);T();
  addEventListener('scroll',()=>{if(!q&&!$('#landing').classList.contains('hide')){q=1;requestAnimationFrame(f)}},{passive:true});f()}
/* in-page links (results, certificates, enrol): smooth scroll without changing the #/ route */
document.querySelectorAll('[data-scroll]').forEach(a=>a.onclick=e=>{const t=document.getElementById(a.dataset.scroll);if(!t)return;e.preventDefault();t.scrollIntoView({behavior:'smooth'})});
/* teacher certificates (Multi-Level page): papers on a desk, a magnifier on hover, and a full-quality viewer */
{const S=document.getElementById('cfStage'),P=S?[...S.querySelectorAll('.cf-paper')]:[];
if(P.length){const T=[...document.querySelectorAll('.cf-tile')];
  const front=i=>{S.dataset.front=i;T.forEach(t=>t.classList.toggle('on',+t.dataset.doc===i))};
  [...P,...T].forEach(b=>{const i=+b.dataset.doc;b.addEventListener('pointerenter',()=>front(i));b.addEventListener('focus',()=>front(i))});
  if(matchMedia('(hover:hover) and (pointer:fine)').matches)P.forEach(p=>{const L=p.querySelector('.cf-lens'),Z=2.5;let bg=0;
    p.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;
      if(!bg){bg=1;const s=p.querySelector('img');L.style.backgroundImage=`url("${p.dataset.full}"),url("${s.currentSrc||s.src}")`}
      const x=e.offsetX,y=e.offsetY;L.style.backgroundSize=`${p.offsetWidth*Z}px ${p.offsetHeight*Z}px`;
      L.style.backgroundPosition=`${75-x*Z}px ${75-y*Z}px`;L.style.translate=`${x}px ${y}px`;p.classList.add('lz')});
    p.addEventListener('pointerleave',()=>p.classList.remove('lz'))});
  const ic=d=>`<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  const lb=document.createElement('div');lb.className='cf-lb';lb.hidden=true;lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-labelledby','cfLbT');
  lb.innerHTML=`<div class="cf-lb-bar"><div class="cf-lb-ttl"><b id="cfLbT"></b><small></small></div><span class="cf-lb-hd" title="To‘liq sifatdagi nusxa">HD</span>`+
    `<button type="button" data-a="z" aria-label="Kattalashtirish" aria-pressed="false">${ic('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M8 11h6"/><path class="cf-zv" d="M11 8v6"/>')}</button>`+
    `<button type="button" data-a="x" aria-label="Yopish">${ic('<path d="M6 6l12 12M18 6 6 18"/>')}</button></div>`+
    `<div class="cf-lb-view"><img class="cf-lb-img" width="960" height="1358" alt="" draggable="false"></div>`+
    `<div class="cf-lb-foot"><button type="button" data-a="p" aria-label="Oldingi hujjat">${ic('<path d="m15 6-6 6 6 6"/>')}</button>`+
    `<p><b class="cf-lb-n"></b><span class="cf-lb-cap"></span></p>`+
    `<button type="button" data-a="n" aria-label="Keyingi hujjat">${ic('<path d="m9 6 6 6-6 6"/>')}</button></div>`;
  document.body.appendChild(lb);
  const q=s=>lb.querySelector(s),img=q('.cf-lb-img'),view=q('.cf-lb-view'),hd=q('.cf-lb-hd'),zb=q('[data-a="z"]');let cur=0,back=null,tok=0,off=[],drag=null,moved=0,sx=null;
  const zoom=(z,fx,fy)=>{lb.classList.toggle('zoom',z);zb.setAttribute('aria-pressed',z);zb.setAttribute('aria-label',z?'Kichraytirish':'Kattalashtirish');
    if(z){view.scrollLeft=fx*img.offsetWidth-view.clientWidth/2;view.scrollTop=fy*img.offsetHeight-view.clientHeight/2}else view.scrollTop=view.scrollLeft=0};
  const show=i=>{cur=(i+P.length)%P.length;const p=P[cur],s=p.querySelector('img'),t=++tok;zoom(false);
    img.src=s.currentSrc||s.src;img.alt=p.dataset.alt;q('#cfLbT').textContent=p.dataset.title;q('.cf-lb-ttl small').textContent=p.dataset.sub;
    q('.cf-lb-n').textContent=(cur+1)+' / '+P.length;hd.classList.remove('on');
    const cap=q('.cf-lb-cap');cap.textContent='';if(p.dataset.no){const a=document.createElement('a');a.href=p.dataset.verify;a.target='_blank';a.rel='noopener';a.dataset.copy=p.dataset.no;
      a.textContent='sertifikat.uzbmb.uz saytida tekshirish ↗';cap.append('Raqam '+p.dataset.no+' · ',a)}else cap.textContent='Shaxsiy raqamlar yashirilgan · rasmni bosib kattalashtiring';
    const f=new Image();f.src=p.dataset.full;f.decode().then(()=>{if(t===tok){img.src=f.src;hd.classList.add('on')}}).catch(()=>{});front(cur)};
  const open=i=>{back=document.activeElement;show(i);lb.hidden=false;off=[...document.body.children].filter(c=>c!==lb&&!c.inert);off.forEach(c=>c.inert=true);
    document.documentElement.classList.add('cf-lock');requestAnimationFrame(()=>lb.classList.add('in'));q('[data-a="x"]').focus()};
  const close=()=>{lb.classList.remove('in');lb.hidden=true;off.forEach(c=>c.inert=false);off=[];document.documentElement.classList.remove('cf-lock');if(back&&back.focus)back.focus()};
  document.querySelectorAll('[data-doc]').forEach(b=>b.addEventListener('click',()=>open(+b.dataset.doc)));
  /* certificate number: the copy button copies it, and the verify link copies it too, ready to paste on the official site */
  document.addEventListener('click',e=>{const c=e.target.closest('[data-copy]');if(!c)return;const n=c.dataset.copy,b=c.classList.contains('cf-copy')?c:null;
    const ok=()=>{if(b){b.textContent='Nusxalandi ✓';clearTimeout(b._t);b._t=setTimeout(()=>b.textContent='Nusxa olish',2000)}},
      no=()=>{const k=b&&b.parentNode.querySelector('.cf-no');if(k){const r=document.createRange();r.selectNodeContents(k);const s=getSelection();s.removeAllRanges();s.addRange(r)}};
    try{navigator.clipboard.writeText(n).then(ok,no)}catch(_){no()}});
  lb.addEventListener('click',e=>{const a=e.target.closest('[data-a]');if(a){const k=a.dataset.a;if(k==='x')close();else if(k==='z')zoom(!lb.classList.contains('zoom'),.5,0);else show(cur+(k==='n'?1:-1))}
    else if(e.target===view)close()});
  img.addEventListener('click',e=>{if(moved){moved=0;return}const r=img.getBoundingClientRect();zoom(!lb.classList.contains('zoom'),(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height)});
  view.addEventListener('pointerdown',e=>{moved=0;if(e.pointerType==='mouse'&&lb.classList.contains('zoom'))drag={x:e.clientX,y:e.clientY,l:view.scrollLeft,t:view.scrollTop}});
  addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>4)moved=1;view.scrollLeft=drag.l-dx;view.scrollTop=drag.t-dy});
  addEventListener('pointerup',()=>{drag=null});
  view.addEventListener('touchstart',e=>{sx=lb.classList.contains('zoom')||e.touches.length>1?null:[e.touches[0].clientX,e.touches[0].clientY]},{passive:true});
  view.addEventListener('touchend',e=>{if(!sx)return;const t=e.changedTouches[0],dx=t.clientX-sx[0],dy=t.clientY-sx[1];sx=null;if(Math.abs(dx)>50&&Math.abs(dx)>1.5*Math.abs(dy))show(cur+(dx<0?1:-1))},{passive:true});
  document.addEventListener('keydown',e=>{if(lb.hidden)return;
    if(e.key==='Escape'){e.preventDefault();close()}else if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(cur+(e.key==='ArrowRight'?1:-1))}
    else if(e.key==='Tab'){const f=[...lb.querySelectorAll('button')],a=f[0],z=f[f.length-1],o=document.activeElement;
      if(!lb.contains(o)){e.preventDefault();a.focus()}else if(e.shiftKey&&o===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&o===z){e.preventDefault();a.focus()}}})}}

/* ---------- session ---------- */
let S=null;try{S=JSON.parse(ls.get('session')||'null')}catch(e){}
function show(id){['#landing','#guide','#app'].forEach(x=>$(x).classList.toggle('hide',x!==id));scrollTo(0,0)}
function out(){ls.set('session',null);ss.set('tk',null);S=null;location.hash='#/'}
$('#outBtn').onclick=out;

/* ---------- routes ---------- */
function route(){
  const h=location.hash.replace(/^#\/?/,'').split('/');
  clearTimeout(ui.poll);ui.flow++;
  if(h[0]==='guide'||h[0]==='c1'){show('#guide');document.title='Listening qo‘llanmasi · A\'zamjon Toxirov · EDUNEST IELTS';return}
  document.title='EDUNEST IELTS · A\'zamjon Toxirov';
  if(h[0]==='teacher'){teacher();return}
  if(h[0]==='login'){S?location.replace('#/me'):login();return}
  if(h[0]==='me'){S?dash():location.replace('#/login');return}
  if(S&&!h[0]){location.replace('#/me');return}
  show('#landing');stkFx();
}
const ui={flow:0,poll:0};
addEventListener('hashchange',route);

/* ---------- Telegram sign-in ---------- */
const STAT={wait:'Telegram’da botni oching va <b>START</b> tugmasini bosing.',contact:'Botda <b>«📱 Raqamni yuborish»</b> tugmasini bosing, so‘ng shu sahifaga qayting.',expired:'Vaqt tugadi. Qaytadan boshlang.'};
function login(){
  show('#app');$('#outBtn').classList.add('hide');$('#appSub').textContent='IELTS platformasi';
  $('#view').innerHTML=`<div class="ie-login"><div class="ie-lcard">
    <h1>EDUNEST IELTS’ga kirish</h1><p class="ie-muted">Parol kerak emas. Telegram orqali bir marta tasdiqlaysiz — keyingi safar bir bosishda kirasiz.</p>
    <div id="tgBox"><button class="lp-btn ie-tgbtn ie-wide" id="tgGo" type="button">${TGI}Telegram orqali kirish</button></div>
    <ul class="ie-why"><li>Telefon raqamingiz faqat ustoz bilan bog‘lanish uchun saqlanadi.</li><li>Sizga reklama yoki spam yuborilmaydi.</li></ul>
    <a class="ie-tlink" href="#/teacher">Ustoz paneli</a></div></div>`;
  $('#tgGo').onclick=tgFlow;
}
async function tgFlow(){
  const box=$('#tgBox'),flow=++ui.flow;box.innerHTML='<div class="ie-wait"><span class="ie-spin"></span>Tayyorlanmoqda…</div>';
  let j=null;try{j=await cpost({action:'tgStart',site:'ielts'})}catch(e){}
  if(flow!==ui.flow)return;
  if(!j||!j.ok){box.innerHTML='<p class="ie-err">Telegram bilan ulanib bo‘lmadi. Birozdan so‘ng qayta urinib ko‘ring.</p><button class="lp-btn ie-tgbtn ie-wide" id="tgGo" type="button">'+TGI+'Qayta urinish</button>';$('#tgGo').onclick=tgFlow;return}
  box.innerHTML=`<ol class="ie-steps"><li>Botni oching</li><li><b>START</b> ni bosing</li><li>Raqamingizni yuboring va shu sahifaga qayting</li></ol>
    <a class="lp-btn ie-tgbtn ie-wide" href="https://t.me/${esc(j.bot)}?start=${esc(j.nonce)}" target="_blank" rel="noopener">${TGI}Botni ochish</a>
    <p class="ie-stat" id="tgStat" aria-live="polite"><span class="dot"></span><span>${STAT.wait}</span></p>`;
  const end=Date.now()+14*60e3;
  while(flow===ui.flow&&Date.now()<end){
    let r=null;try{r=await cpost({action:'tgPoll',nonce:j.nonce})}catch(e){await new Promise(z=>setTimeout(z,1500))}
    if(flow!==ui.flow)return;
    if(r&&!r.ok){$('#tgStat').innerHTML='<span>'+STAT.expired+'</span>';return}
    if(r&&r.st==='done'&&r.t){S={uid:r.uid,t:r.t,name:r.user.name,tgu:r.user.tgu};ls.set('session',JSON.stringify(S));toast('Xush kelibsiz, '+S.name.split(' ')[0]+'!');location.hash='#/me';return}
    if(r&&STAT[r.st])$('#tgStat').innerHTML='<span class="dot"></span><span>'+STAT[r.st]+'</span>';
    await new Promise(z=>setTimeout(z,400));
  }
  if(flow===ui.flow)$('#tgStat').innerHTML='<span>'+STAT.expired+'</span>';
}

/* ---------- student dashboard ---------- */
function dash(){
  show('#app');$('#outBtn').classList.remove('hide');$('#appSub').textContent='IELTS platformasi';
  const first=(S.name||'').split(' ')[0];
  $('#view').innerHTML=`<div class="ie-wrap">
    <section class="ie-hello"><div><small>EDUNEST IELTS</small><h1>Salom, ${esc(first)}!</h1><p>${TESTS.filter(x=>x.k==='listening').length} ta Listening va ${TESTS.filter(x=>x.k==='reading').length} ta Reading testi tayyor. Band ballingizni bugun bilib oling.</p></div>
      <div class="ie-me">${S.tgu?`<span class="ie-chip tg">${TGI}${esc(S.tgu)}</span>`:''}</div></section>
    <div id="myLib">${libHTML(S.res)}</div>
    <h2 class="ie-h2">Natijalarim</h2><div id="myRes">${resHTML(S.res)}</div>
    <div class="ie-duo">
      <a class="ie-guidecard" href="#/guide"><img src="c1-guide.png" alt="" loading="lazy"><div><small>Bepul qo‘llanma</small><b>Listening’ni 1.5 oyda 7.5–8.0 ga chiqargan usul</b><span>O‘qish →</span></div></a>
      <div class="ie-teach"><img class="tph" alt="A'zamjon Toxirov"><div><b>A'zamjon Toxirov</b><span>C1 o‘qituvchi, EDUNEST Academy</span>
        <div class="ie-tlinks"><a href="https://t.me/teachertx" target="_blank" rel="noopener">Telegram’da yozish</a><a href="tel:+998507178400">Qo‘ng‘iroq</a></div></div></div>
    </div></div>`;
  document.querySelectorAll('#view img.tph').forEach(tph);
  cget({action:'ime',id:S.uid,t:S.t}).then(j=>{if(j&&j.ok===false&&j.error==='auth'){toast('Qaytadan kiring');out()}else if(j&&j.user){S.name=j.user.name;S.tgu=j.user.tgu;S.res=j.results||[];ls.set('session',JSON.stringify(S));
    const t=$('#myLib'),r=$('#myRes');if(t)t.innerHTML=libHTML(S.res);if(r)r.innerHTML=resHTML(S.res)}}).catch(()=>{});
}
/* an unfinished test on this device (the player keeps it until its timer would have ended) */
function running(){if(!S)return null;let best=null;
  TESTS.forEach(x=>{try{const s=JSON.parse(ls.get('run:'+S.uid+':'+x.id)||'null');if(s&&s.end>Date.now()&&(!best||s.start>best.start))best={x,start:s.start}}catch(e){}});return best&&best.x}
/* what to do next: an unfinished test, else the first new test of the skill with less progress, else the weakest test */
function nextTest(res){
  const run=running();if(run)return {x:run,why:'Tugallanmagan test — qolgan joyidan davom ettiring.',go:'Davom ettirish'};
  const done=new Set((res||[]).map(r=>r.test)),L=TESTS.filter(x=>x.k==='listening'),R=TESTS.filter(x=>x.k==='reading');
  const pl=L.filter(x=>done.has(x.id)).length/L.length,pr=R.filter(x=>done.has(x.id)).length/R.length;
  for(const g of (pl<=pr?[L,R]:[R,L])){const x=g.find(t=>!done.has(t.id));if(x)return {x,why:done.size?'Hali ishlanmagan test. Listening va Reading’ni navbatma-navbat ishlash eng foydali.':'Birinchi testdan boshlang: natija va sertifikat darhol chiqadi.',go:'Boshlash'}}
  const x=TESTS.slice().sort((a,b)=>+bestOf(res,a.id).band-+bestOf(res,b.id).band)[0];
  return {x,why:'Barcha testlarni ishladingiz! Eng past natijangizni qayta ishlab, yaxshilang.',go:'Qayta ishlash'};
}
function libHTML(res){
  const n=nextTest(res),done=new Set((res||[]).map(r=>r.test));
  const tile=x=>{const b=bestOf(res,x.id);return `<a class="ie-tile ie-${x.k}${b?' done':''}" href="test.html#${x.id}">
      <span class="ie-tn"><small>${SK[x.k]}</small>Test ${x.id.slice(1)}</span><span class="ie-tm">40 savol · ${x.k==='listening'?'~':''}${x.min} daqiqa</span>
      <span class="ie-tbest">${b?`Eng yaxshi: <b>${(+b.band).toFixed(1)}</b> · ${b.raw}/40`:'Hali ishlanmagan'}</span><span class="ie-tgo">${b?'Qayta ishlash':'Boshlash'} →</span></a>`};
  const grp=k=>{const g=TESTS.filter(x=>x.k===k),d=g.filter(x=>done.has(x.id)),bb=d.map(x=>+bestOf(res,x.id).band);
    return `<section class="ie-skill"><div class="ie-sh"><h2 class="ie-h2">${SK[k]}</h2><span>${d.length} / ${g.length} ishlangan${bb.length?` · eng yaxshi band <b>${Math.max(...bb).toFixed(1)}</b>`:''}</span></div>
      <div class="ie-lib">${g.map(tile).join('')}</div></section>`};
  return `<section class="ie-next"><div><small>Keyingi qadam</small><b>${esc(TN(n.x.id))}</b><p>${esc(n.why)}</p></div><a class="lp-btn" href="test.html#${n.x.id}">${esc(n.go)}</a></section>
    ${grp('listening')}${grp('reading')}<p class="ie-soon">Writing testlari tez orada qo‘shiladi.</p>`}

function resHTML(res){
  if(!res||!res.length)return '<div class="ie-empty"><b>Hali natija yo‘q</b><p>Birinchi testni ishlaganingizdan so‘ng band ballaringiz shu yerda ko‘rinadi.</p></div>';
  return `<div class="ie-res">${res.slice().sort((a,b)=>b.at-a.at).map(r=>`<div class="ie-ri"><span class="ie-bd">${(+r.band).toFixed(1)}</span><div><b>${esc(TN(r.test))}</b><small>${r.raw} / 40 to‘g‘ri · ${dt(r.at)}${r.mins?' · '+r.mins+' daqiqa':''}</small></div><a href="test.html#${esc(r.test)}">Qayta</a></div>`).join('')}</div>`}
/* ---------- teacher panel ---------- */
let TD=null;
function teacher(){
  show('#app');$('#appSub').textContent='Ustoz paneli';$('#outBtn').classList.add('hide');
  const k=ss.get('tk');
  if(!k){$('#view').innerHTML=`<div class="ie-login"><div class="ie-lcard"><h1>Ustoz paneli</h1><p class="ie-muted">Ro‘yxatdan o‘tgan foydalanuvchilar va ularning kontaktlari.</p>
      <form id="tf"><label class="ie-lab" for="tp">Ustoz paroli</label><input id="tp" type="password" autocomplete="current-password" required><button class="lp-btn ie-wide" type="submit">Kirish</button></form>
      <p class="ie-err hide" id="terr">Parol noto‘g‘ri.</p><a class="ie-tlink" href="#/">← Bosh sahifa</a></div></div>`;
    $('#tf').onsubmit=async e=>{e.preventDefault();const p=$('#tp').value.trim();let j=null;try{j=await cpost({action:'tauth',key:p})}catch(x){}
      if(j&&j.ok){ss.set('tk',p);teacher()}else $('#terr').classList.remove('hide')};return}
  $('#view').innerHTML='<div class="ie-wrap"><div class="ie-wait"><span class="ie-spin"></span>Yuklanmoqda…</div></div>';
  cget({action:'ilist',key:k}).then(j=>{if(!j.ok){ss.set('tk',null);teacher();return}TD=j.users.sort((a,b)=>b.joined-a.joined);tdraw('')}).catch(()=>{$('#view').innerHTML='<div class="ie-wrap"><p class="ie-err">Yuklab bo‘lmadi. Internetni tekshiring.</p></div>'});
}
const dt=t=>{if(!t)return '—';const d=new Date(t);return d.toLocaleDateString('uz-UZ',{day:'2-digit',month:'2-digit',year:'numeric'})+' '+d.toLocaleTimeString('uz-UZ',{hour:'2-digit',minute:'2-digit'})};
const phoneNice=p=>{const d=String(p||'').replace(/\D/g,'');return d.length===12?`+${d.slice(0,3)} ${d.slice(3,5)} ${d.slice(5,8)} ${d.slice(8,10)} ${d.slice(10)}`:(p||'—')};
/* one skill column: the latest result of that skill, which test it was, and how many different tests were done */
function bandOf(u,k){const r=(u.results||[]).filter(x=>String(x.test)[0]===k[0]).sort((a,b)=>b.at-a.at);if(!r.length)return '<i>—</i>';
  const n=new Set(r.map(x=>x.test)).size;return `<b class="ie-bd sm">${(+r[0].band).toFixed(1)}</b><i>T${esc(String(r[0].test).slice(1))} · ${r[0].raw}/40${n>1?' · '+n+' test':''}</i>`}
/* all results of one user, newest first (opens under the row) */
function detHTML(u){const r=(u.results||[]).slice().sort((a,b)=>b.at-a.at);
  return r.length?r.map(x=>`<span><b class="ie-bd sm">${(+x.band).toFixed(1)}</b>${esc(TN(x.test))} · ${x.raw}/40${x.mins?' · '+x.mins+' daq.':''} · <i>${dt(x.at)}</i></span>`).join(''):'<span><i>Hali test ishlamagan</i></span>'}
function tdraw(q){
  const now=Date.now(),day=864e5,U=TD;
  const kp=[['Jami foydalanuvchi',U.length],['Bugun qo‘shilgan',U.filter(u=>now-u.joined<day).length],['So‘nggi 7 kunda',U.filter(u=>now-u.joined<7*day).length],['Test ishlaganlar',U.filter(u=>(u.results||[]).length).length]];
  const f=q?U.filter(u=>(u.name+' '+u.tgu+' '+u.phone).toLowerCase().includes(q.toLowerCase())):U;
  $('#view').innerHTML=`<div class="ie-wrap"><div class="ie-thead"><h1>Foydalanuvchilar</h1><div class="ie-tact"><button class="lp-btn lp-btn-sm lp-btn-line" id="csv" type="button">CSV yuklab olish</button><button class="lp-btn lp-btn-sm lp-btn-line" id="tout" type="button">Chiqish</button></div></div>
    <div class="ie-kpis">${kp.map(([l,v])=>`<div class="ie-kpi"><b>${v}</b><small>${l}</small></div>`).join('')}</div>
    <input class="ie-search" id="tq" type="search" placeholder="Ism, @username yoki telefon bo‘yicha qidirish" value="${esc(q)}" aria-label="Qidirish">
    ${f.length?`<div class="ie-table" role="table"><div class="ie-tr ie-trh" role="row"><span>Ism</span><span>Telegram</span><span>Telefon</span><span>Listening</span><span>Reading</span><span>Qo‘shilgan</span><span>Oxirgi kirish</span></div>
    ${f.map((u,i)=>`<div class="ie-tr" role="row"><span class="nm"><button class="ie-nmb" type="button" data-i="${i}" aria-expanded="false" title="Barcha natijalar">${esc(u.name)}${(u.results||[]).length?` <em>${u.results.length}</em>`:''}</button></span><span>${u.tgu?`<a href="https://t.me/${esc(u.tgu.slice(1))}" target="_blank" rel="noopener">${esc(u.tgu)}</a>`:'<i>username yo‘q</i>'}</span>
      <span>${u.phone?`<a href="tel:${esc(u.phone)}">${esc(phoneNice(u.phone))}</a>`:'—'}</span><span>${bandOf(u,'listening')}</span><span>${bandOf(u,'reading')}</span><span>${dt(u.joined)}</span><span>${dt(u.seen)}</span></div><div class="ie-tdet hide" id="det${i}">${detHTML(u)}</div>`).join('')}</div>`
    :`<div class="ie-empty"><b>${q?'Hech kim topilmadi':'Hali hech kim ro‘yxatdan o‘tmagan'}</b><p>${q?'Boshqa so‘z bilan qidirib ko‘ring.':'Sayt havolasini ulashing: foydalanuvchilar Telegram orqali kirgach, shu yerda paydo bo‘ladi.'}</p></div>`}</div>`;
  const tq=$('#tq');tq.oninput=()=>{const v=tq.value,pos=tq.selectionStart;tdraw(v);const n=$('#tq');n.focus();n.setSelectionRange(pos,pos)};
  document.querySelectorAll('.ie-nmb').forEach(b=>b.onclick=()=>{const d=$('#det'+b.dataset.i);const on=d.classList.toggle('hide');b.setAttribute('aria-expanded',String(!on))});
  $('#tout').onclick=()=>{ss.set('tk',null);location.hash='#/'};
  /* CSV: the latest result of every test (one column per test) + how many times each user took a test */
  $('#csv').onclick=()=>{const lb=(u,t)=>{const r=(u.results||[]).filter(x=>x.test===t).sort((a,b)=>b.at-a.at)[0];return r?r.band+' ('+r.raw+'/40)':''};
    const rows=[['Ism','Telegram','Telefon',...TESTS.map(x=>TN(x.id)),'Testlar soni','Qo‘shilgan','Oxirgi kirish','Kirishlar'],
      ...TD.map(u=>[u.name,u.tgu,u.phone,...TESTS.map(x=>lb(u,x.id)),(u.results||[]).length,dt(u.joined),dt(u.seen),u.visits])];
    const csv='﻿'+rows.map(r=>r.map(c=>'"'+String(c==null?'':c).replace(/"/g,'""')+'"').join(',')).join('\n');
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='edunest-ielts-foydalanuvchilar.csv';a.click()};
}

/* ---------- share ---------- */
$('#c1share').onclick=async()=>{const url=location.origin+location.pathname+'#/guide',text='Listening’ni 1.5 oyda 5.0 dan 7.5–8.0 ga chiqargan usul — A\'zamjon Toxirov, EDUNEST';
  if(navigator.share){try{await navigator.share({title:'EDUNEST IELTS',text,url})}catch(e){}}else window.open('https://t.me/share/url?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(text),'_blank','noopener')};
route();
