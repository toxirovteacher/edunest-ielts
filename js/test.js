
const CLOUD_URL = "https://tuffyskazbkbezsghgtk.supabase.co/functions/v1/api";
const LOGO=new URL('img/logo.png',document.baseURI).href;
const ST='edunest_ielts:';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ls={get:k=>{try{return localStorage.getItem(ST+k)}catch(e){return null}},set:(k,v)=>{try{v==null?localStorage.removeItem(ST+k):localStorage.setItem(ST+k,v)}catch(e){}}};
const IC={full:'<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',gear:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
 prev:'<svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>',next:'<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>',vol:'<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>'};
/* min = minutes shown before the test (audio + 2 min check for Listening) */
const TESTS={l1:{file:'ielts-l1',kind:'listening',min:35},l2:{file:'ielts-l2',kind:'listening',min:39},l3:{file:'ielts-l3',kind:'listening',min:41},
  l5:{file:'ielts-l5',kind:'listening',min:34},l6:{file:'ielts-l6',kind:'listening',min:30},l7:{file:'ielts-l7',kind:'listening',min:26},l8:{file:'ielts-l8',kind:'listening',min:28},
  l9:{file:'ielts-l9',kind:'listening',min:26},l10:{file:'ielts-l10',kind:'listening',min:26},
  r1:{file:'ielts-r1',kind:'reading',min:60},r2:{file:'ielts-r2',kind:'reading',min:60},r3:{file:'ielts-r3',kind:'reading',min:60},r4:{file:'ielts-r4',kind:'reading',min:60},
  r5:{file:'ielts-r5',kind:'reading',min:60},r6:{file:'ielts-r6',kind:'reading',min:60},r7:{file:'ielts-r7',kind:'reading',min:60},r8:{file:'ielts-r8',kind:'reading',min:60},
  r10:{file:'ielts-r10',kind:'reading',min:60}};
/* "Choose TWO/THREE" sets: one list of checkboxes, each correct letter = 1 mark in any order (DOC.groups: [{q:[11,12],ans:['E','C']}]) */
const GRP=()=>(DOC&&DOC.groups)||[];
const grpOf=n=>GRP().find(g=>g.q.includes(n));
const BANDS={listening:[[39,9],[37,8.5],[35,8],[32,7.5],[30,7],[26,6.5],[23,6],[18,5.5],[16,5],[13,4.5],[10,4],[8,3.5],[6,3],[4,2.5],[1,1],[0,0]],
             reading:[[39,9],[37,8.5],[35,8],[33,7.5],[30,7],[27,6.5],[23,6],[19,5.5],[15,5],[13,4.5],[10,4],[8,3.5],[6,3],[4,2.5],[1,1],[0,0]]};
const band=(k,raw)=>BANDS[k].find(([m])=>raw>=m)[1];
document.addEventListener('contextmenu',e=>{if(!e.target.closest('input'))e.preventDefault()});
['copy','cut'].forEach(ev=>document.addEventListener(ev,e=>{if(!(document.activeElement&&document.activeElement.matches('input.gap')))e.preventDefault()}));

let S=null;try{S=JSON.parse(ls.get('session')||'null')}catch(e){}
const TID=location.hash.replace('#','');const T=TESTS[TID];
let IK=null,DOC=null,USER=null,audio=null,audioUrl=null;
let A={},ui={part:0,mode:'exam',start:0,end:0,tick:0,audioEnded:false,cur:0},RESULT=null;

function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2600)}
function screen(html){$('#exam').classList.add('hide');const s=$('#screen');s.classList.remove('hide');s.innerHTML=`<div class="card">${html}</div>`}
function brandHTML(){return `<a class="brand" href="./#/me"><img src="${LOGO}" alt=""><span>EDUNEST<small>IELTS platformasi</small></span></a>`}
function fail(h,p,link,lt){screen(`${brandHTML()}<h1>${esc(h)}</h1><p class="muted">${esc(p)}</p><a class="btn" href="${link||'./#/login'}">${esc(lt||'Kirish')}</a>`)}

async function decrypt(buf){
  if(String.fromCharCode(...buf.slice(0,4))!=='EDN1')throw new Error('bad');
  const base=await crypto.subtle.importKey('raw',new TextEncoder().encode(IK),'PBKDF2',false,['deriveKey']);
  const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:buf.slice(4,20),iterations:150000,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['decrypt']);
  return new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:buf.slice(20,32)},key,buf.slice(32)));
}
async function fetchBin(name,onp){
  const r=await fetch(name+'.bin',{cache:'no-cache'});if(!r.ok)throw new Error('net');
  const total=+r.headers.get('content-length')||0;if(!r.body||!total||!onp)return new Uint8Array(await r.arrayBuffer());
  const rd=r.body.getReader();const chunks=[];let got=0;
  for(;;){const {done,value}=await rd.read();if(done)break;chunks.push(value);got+=value.length;onp(got/total)}
  const out=new Uint8Array(got);let o=0;for(const c of chunks){out.set(c,o);o+=c.length}return out;
}

/* ---------- boot ---------- */
async function boot(){
  if(!T){fail('Test topilmadi','Havola noto‘g‘ri. Bosh sahifadan testni tanlang.','./#/me','Bosh sahifa');return}
  if(!S){fail('Avval kiring','Testni ishlash uchun Telegram orqali kiring — 10 soniya.','./#/login','Telegram orqali kirish');return}
  let me=null;try{me=await fetch(CLOUD_URL+'?'+new URLSearchParams({action:'ime',id:S.uid,t:S.t})).then(r=>r.json())}catch(e){}
  if(!me){fail('Internet yo‘q','Ulanishni tekshirib, sahifani yangilang.','javascript:location.reload()','Qayta urinish');return}
  if(!me.ok||!me.ik){ls.set('session',null);fail('Qayta kiring','Kirish muddati tugagan. Telegram orqali qayta kiring.');return}
  IK=me.ik;USER=me.user;
  try{DOC=JSON.parse(new TextDecoder().decode(await decrypt(await fetchBin(T.file))))}catch(e){fail('Yuklanmadi','Testni ochib bo‘lmadi. Sahifani yangilang.','javascript:location.reload()','Qayta urinish');return}
  document.title='EDUNEST IELTS · '+DOC.title;
  const saved=loadState();
  intro(saved);
}
const stKey=()=>'run:'+S.uid+':'+TID;
function saveState(){ls.set(stKey(),JSON.stringify({A,start:ui.start,end:ui.end}))}
function loadState(){try{const s=JSON.parse(ls.get(stKey())||'null');if(s&&s.end>Date.now())return s}catch(e){}return null}

function intro(saved){
  const L=T.kind==='listening';
  screen(`${brandHTML()}<h1>${esc(DOC.title)}</h1><p class="muted">${L?'Kompyuterdagi IELTS formatida: audio faqat bir marta eshittiriladi.':'Kompyuterdagi IELTS formatida: matn va savollar yonma-yon.'}</p>
   <div class="facts"><div><b>${DOC.parts.length}</b><small>${L?'qism':'matn'}</small></div><div><b>40</b><small>savol</small></div><div><b>${L?'~'+(T.min||35):'60'}</b><small>daqiqa</small></div></div>
   <ul class="rules">${L?'<li>Audio boshlangach to‘xtatib bo‘lmaydi — xuddi imtihondagidek.</li><li>Quloqchin taqing va ovoz balandligini tekshiring.</li><li>Audio tugagach, javoblarni tekshirish uchun 2 daqiqa beriladi.</li>'
     :'<li>Vaqt 60 daqiqa. Vaqt tugasa, test avtomatik topshiriladi.</li><li>Matndagi so‘zni belgilab, «Highlight» qilishingiz mumkin.</li><li>Pastdagi raqamlar orqali istalgan savolga o‘tasiz.</li>'}
     <li>Natija darhol chiqadi: band ball, sertifikat va har bir savolning to‘g‘ri javobi.</li></ul>
   ${L?'<div id="aload"><small class="muted" id="apct">Audio yuklanmoqda… 0%</small><div class="prog"><i id="abar"></i></div></div>':''}
   <button class="btn wide" id="go" ${L?'disabled':''}>${saved?'Testni davom ettirish':'Testni boshlash'}</button>
   ${saved?'<button class="btn line wide" id="restart" style="margin-top:10px">Boshidan boshlash</button>':''}`);
  $('#go').onclick=()=>start(saved);
  if(saved)$('#restart').onclick=()=>{ls.set(stKey(),null);start(null)};
  if(L)loadAudio();
}
async function loadAudio(){
  try{
    const raw=await decrypt(await fetchBin(DOC.audio,p=>{const v=Math.round(p*100);$('#abar').style.width=v+'%';$('#apct').textContent='Audio yuklanmoqda… '+v+'%'}));
    audioUrl=URL.createObjectURL(new Blob([raw],{type:'audio/mpeg'}));audio=new Audio(audioUrl);audio.preload='auto';
    await new Promise(r=>{audio.addEventListener('loadedmetadata',r,{once:true});setTimeout(r,4000)});
    $('#apct').textContent='Audio tayyor ✓';$('#go').disabled=false;
  }catch(e){$('#apct').textContent='Audio yuklanmadi. Sahifani yangilang.'}
}

/* ---------- exam ---------- */
function start(saved){
  const L=T.kind==='listening';
  if(saved){A=saved.A||{};ui.start=saved.start;ui.end=saved.end}
  else{A={};ui.start=Date.now();ui.end=ui.start+(L?((audio&&isFinite(audio.duration)?audio.duration:1970)+DOC.review):DOC.minutes*60)*1000}
  saveState();
  $('#screen').classList.add('hide');const ex=$('#exam');ex.classList.remove('hide');
  ex.innerHTML=`<div class="top">${brandHTML().replace('./#/me','javascript:void 0')}<span class="who">Test taker: <b>${esc(USER.name)}</b></span>
     <div class="timer" id="timer">--:--</div>
     <div class="tools">${L?`<label class="vol" title="Volume">${IC.vol}<input type="range" id="vol" min="0" max="1" step="0.05" value="${ls.get('vol')||0.9}" aria-label="Volume"></label>`:''}
       <button class="ib" id="optsBtn" aria-label="Options">${IC.gear}</button><button class="ib" id="fsBtn" aria-label="Full screen">${IC.full}</button></div></div>
   <div id="rbar"></div><div id="ban"></div>
   <div class="ptitle" id="ptitle"></div>
   <div class="mtabs ${L?'hide':''}" id="mtabs"><button class="on" data-v="p">Passage</button><button data-v="q">Questions</button></div>
   <div class="body ${L?'':'split'}" id="body">${L?'':'<div class="pane passage" id="pp"></div><div class="divider" id="div" role="separator" aria-label="Resize"></div>'}<div class="pane qs" id="pq"></div></div>
   <div class="nav"><div class="parts" id="parts"></div><div class="arrows"><button class="ib" id="prev" aria-label="Previous">${IC.prev}</button><button class="ib" id="next" aria-label="Next">${IC.next}</button></div><button class="submit" id="sub">Submit</button></div>`;
  bindTop();renderParts();showPart(0);
  ui.tick=setInterval(tick,500);tick();
  if(L)playAudio();
}
function bindTop(){
  $('#fsBtn').onclick=()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen().catch(()=>{})};
  $('#optsBtn').onclick=e=>{e.stopPropagation();toggleOpts()};
  const v=$('#vol');if(v){v.oninput=()=>{if(audio)audio.volume=+v.value;ls.set('vol',v.value)}}
  $('#prev').onclick=()=>stepQ(-1);$('#next').onclick=()=>stepQ(1);
  $('#sub').onclick=()=>ui.mode==='review'?location.href='./#/me':confirmSubmit();
  $$('#mtabs button').forEach(b=>b.onclick=()=>{$$('#mtabs button').forEach(x=>x.classList.toggle('on',x===b));$('#body').classList.toggle('show-q',b.dataset.v==='q')});
  const d=$('#div');if(d){let drag=false;d.onpointerdown=e=>{drag=true;d.setPointerCapture(e.pointerId)};d.onpointerup=()=>drag=false;
    d.onpointermove=e=>{if(!drag)return;const r=$('#body').getBoundingClientRect();const p=Math.min(72,Math.max(28,(e.clientX-r.left)/r.width*100));$('#body').style.setProperty('--left',p+'%')}}
}
function playAudio(){
  if(!audio)return;audio.volume=+($('#vol')?$('#vol').value:0.9);
  const el=(Date.now()-ui.start)/1000;
  if(el>0.5&&isFinite(audio.duration)){if(el>=audio.duration){ui.audioEnded=true;banner();return}audio.currentTime=el}
  audio.onended=()=>{ui.audioEnded=true;banner()};
  audio.play().catch(()=>{$('#ban').innerHTML='<div class="banner red" id="tap">Audioni boshlash uchun shu yerni bosing</div>';$('#tap').onclick=()=>{audio.play();$('#ban').innerHTML=''}});
  banner();
}
function banner(){if(T.kind!=='listening'||ui.mode!=='exam')return;$('#ban').innerHTML=ui.audioEnded?'<div class="banner">Audio tugadi. Javoblaringizni tekshirib chiqing — test vaqt tugaganda avtomatik topshiriladi.</div>':''}
function tick(){
  if(ui.mode!=='exam')return;const left=Math.max(0,Math.round((ui.end-Date.now())/1000));
  const t=$('#timer');t.textContent=String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0')+(T.kind==='listening'&&!ui.audioEnded?' · audio':'');
  t.classList.toggle('warn',left<=300);
  if(left<=0){clearInterval(ui.tick);submit(true)}
}

/* ---------- parts + questions ---------- */
function renderParts(){
  $('#parts').innerHTML=DOC.parts.map((p,i)=>{const nums=[];for(let q=p.from;q<=p.to;q++)nums.push(q);
    return `<div class="part" data-i="${i}"><button data-p="${i}">${p.title}</button><span class="cnt" id="cnt${i}"></span><div class="nums">${nums.map(q=>`<button class="num" data-n="${q}" aria-label="Question ${q}">${q}</button>`).join('')}</div></div>`}).join('');
  $$('#parts [data-p]').forEach(b=>b.onclick=()=>showPart(+b.dataset.p));
  $$('#parts .num').forEach(b=>b.onclick=()=>goQ(+b.dataset.n));
  paintNav();
}
function showPart(i){
  ui.part=i;const p=DOC.parts[i];
  $('#ptitle').innerHTML=`<b>${T.kind==='listening'?p.title.toUpperCase():'READING '+p.title.toUpperCase()}</b><span>${p.sub?esc(p.sub)+' · ':''}Questions ${p.from}–${p.to}</span>`;
  if($('#pp')){$('#pp').innerHTML=p.passage;$('#pp').scrollTop=0}
  $('#pq').innerHTML=p.questions;$('#pq').scrollTop=0;
  $$('.part').forEach(x=>x.classList.toggle('on',+x.dataset.i===i));
  wire();if(ui.mode==='review')mark();paintNav();
}
function wire(){
  $$('#pq input.gap').forEach(i=>{const n=i.dataset.q;i.placeholder=n;i.value=A[n]||'';
    i.oninput=()=>{A[n]=i.value;saveState();paintNav()};i.onfocus=()=>setCur(+n);
    i.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();stepQ(1)}}});
  $$('#pq select[data-k=pick]').forEach(s=>{const n=s.dataset.q;s.value=A[n]||'';s.onchange=()=>{A[n]=s.value;saveState();paintNav()};s.onfocus=()=>setCur(+n)});
  $$('#pq input[type=radio]').forEach(r=>{const n=r.name.slice(1);r.checked=A[n]===r.value;r.onchange=()=>{A[n]=r.value;saveState();paintNav();setCur(+n)}});
  $$('#pq [data-grp]').forEach(box=>{const g=grpOf(+box.dataset.grp.split('-')[0]);if(!g)return;const max=g.q.length;
    const cbs=[...box.querySelectorAll('input[type=checkbox]')];const cur=String(A[g.q[0]]||'').split('');
    cbs.forEach(c=>{c.checked=cur.includes(c.value);c.onchange=()=>{let on=cbs.filter(x=>x.checked);
      if(on.length>max){c.checked=false;on=on.filter(x=>x!==c);toast(max+' tadan ortiq tanlab bo‘lmaydi')}
      const v=on.map(x=>x.value).sort().join('');g.q.forEach(q=>A[q]=v.length>=g.q.indexOf(q)+1?v:'');saveState();paintNav();setCur(g.q[0])}})});
  // the teacher's text says "Drag …" (his original pages used drag-and-drop); here those answers are dropdowns
  if($('#pq select[data-k=pick]')){const tw=document.createTreeWalker($('#pq'),NodeFilter.SHOW_TEXT);let t;const hit=new Set();
    while((t=tw.nextNode()))if(/\bdrag\b/i.test(t.nodeValue)){const e=t.parentElement.closest('p,li,div');if(e)hit.add(e)}
    hit.forEach(e=>{if(!e.querySelector('.tip'))e.insertAdjacentHTML('beforeend',' <small class="tip">(bu yerda: javobni ro‘yxatdan tanlang)</small>')})}
  if(ui.mode!=='exam')$$('#pq input, #pq select').forEach(x=>x.disabled=true);
}
function elFor(n){const g=grpOf(n);if(g)return $(`#pq [data-grp="${g.q[0]}-${g.q[g.q.length-1]}"]`);return $(`#pq [data-q="${n}"]`)||$(`#pq [data-n="${n}"]`)||($(`#pq input[name="q${n}"]`)||{}).closest&&$(`#pq input[name="q${n}"]`).closest('tr,[data-k=q],label')}
function partOf(n){return DOC.parts.findIndex(p=>n>=p.from&&n<=p.to)}
function goQ(n){const i=partOf(n);if(i!==ui.part)showPart(i);
  if(window.innerWidth<=860&&T.kind==='reading'){$$('#mtabs button')[1].click()}
  const el=elFor(n);if(el){el.scrollIntoView({behavior:'smooth',block:'center'});const f=el.matches('input,select')?el:el.querySelector('input,select');if(f&&ui.mode==='exam')setTimeout(()=>f.focus({preventScroll:true}),250)}
  setCur(n)}
function setCur(n){ui.cur=n;$$('.num').forEach(b=>b.classList.toggle('now',+b.dataset.n===n))}
function stepQ(d){const n=Math.min(40,Math.max(1,(ui.cur||DOC.parts[ui.part].from-(d>0?1:0))+d));goQ(n)}
const answered=n=>String(A[n]||'').trim()!=='';
function paintNav(){
  $$('.num').forEach(b=>{const n=+b.dataset.n;b.classList.toggle('ans',ui.mode==='exam'&&answered(n));
    if(ui.mode==='review'&&RESULT){b.classList.toggle('right',!!RESULT.ok[n]);b.classList.toggle('wrong',!RESULT.ok[n])}});
  DOC.parts.forEach((p,i)=>{let c=0;for(let q=p.from;q<=p.to;q++)if(answered(q))c++;const e=$('#cnt'+i);if(e)e.textContent=ui.mode==='review'&&RESULT?RESULT.parts[i]+' / 10':c+' of '+(p.to-p.from+1)})}

/* ---------- highlight (reading) ---------- */
let hlb=null;
document.addEventListener('selectionchange',()=>{if(T.kind!=='reading'||!$('#pp'))return;const s=getSelection();
  if(hlb){hlb.remove();hlb=null}
  if(!s.rangeCount||s.isCollapsed)return;const r=s.getRangeAt(0);if(!$('#pp').contains(r.commonAncestorContainer))return;
  const b=r.getBoundingClientRect();hlb=document.createElement('button');hlb.className='hlbtn';hlb.textContent='Highlight';
  hlb.style.left=Math.max(8,b.left)+'px';hlb.style.top=Math.max(8,b.top-44)+'px';
  hlb.onmousedown=hlb.ontouchstart=e=>{e.preventDefault();try{const m=document.createElement('mark');m.className='hl';m.appendChild(r.extractContents());r.insertNode(m)}catch(x){}getSelection().removeAllRanges();hlb.remove();hlb=null};
  document.body.appendChild(hlb)});
document.addEventListener('click',e=>{const m=e.target.closest('mark.hl');if(m){const p=m.parentNode;while(m.firstChild)p.insertBefore(m.firstChild,m);m.remove()}});

/* ---------- options ---------- */
function toggleOpts(){let o=$('#opts');if(o){o.remove();return}
  o=document.createElement('div');o.className='opts';o.id='opts';const fs=ls.get('fs')||'16';const dk=document.body.classList.contains('dark');
  o.innerHTML=`<h4>Text size</h4><div class="seg">${[['14','A−'],['16','A'],['18','A+'],['21','A++']].map(([v,l])=>`<button data-fs="${v}" class="${fs===v?'on':''}">${l}</button>`).join('')}</div>
    <h4>Contrast</h4><div class="seg"><button data-c="0" class="${dk?'':'on'}">Light</button><button data-c="1" class="${dk?'on':''}">Dark</button></div>`;
  document.body.appendChild(o);o.onclick=e=>e.stopPropagation();
  o.querySelectorAll('[data-fs]').forEach(b=>b.onclick=()=>{ls.set('fs',b.dataset.fs);applyOpts();toggleOpts();toggleOpts()});
  o.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{ls.set('dark',b.dataset.c);applyOpts();toggleOpts();toggleOpts()})}
document.addEventListener('click',()=>{const o=$('#opts');if(o)o.remove()});
function applyOpts(){document.documentElement.style.setProperty('--fs',(ls.get('fs')||'16')+'px');document.body.classList.toggle('dark',ls.get('dark')==='1')}
applyOpts();

/* ---------- submit + scoring ---------- */
function modal(html){const m=$('#modal');m.innerHTML=`<div class="card">${html}</div>`;m.classList.remove('hide');m.onclick=e=>{if(e.target===m)closeModal()}}
function closeModal(){$('#modal').classList.add('hide')}
function confirmSubmit(){let miss=0;for(let q=1;q<=40;q++)if(!answered(q))miss++;
  modal(`<h2>Testni topshirasizmi?</h2><p class="muted">${miss?`<b>${miss} ta savol</b> javobsiz qoldi. Topshirgandan keyin javoblarni o‘zgartirib bo‘lmaydi.`:'Barcha savollarga javob berdingiz.'}</p>
    <div class="row2"><button class="btn line" id="mNo">Qaytish</button><button class="btn" id="mYes">Topshirish</button></div>`);
  $('#mNo').onclick=closeModal;$('#mYes').onclick=()=>{closeModal();submit(false)}}
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]/g,'');
function isOk(n){const v=A[n];if(!answered(n))return false;return DOC.answers[n].some(a=>norm(a)===norm(v))}
/* a set's marks: how many chosen letters are in the key; the first k questions of the set get them */
function grpOk(g){const ch=String(A[g.q[0]]||'').split('').slice(0,g.q.length);const k=ch.filter(c=>g.ans.includes(c)).length;const o={};g.q.forEach((q,i)=>o[q]=i<k);return o}
function submit(auto){
  clearInterval(ui.tick);ui.mode='done';if(audio){audio.pause()}
  const ok={};let raw=0;for(let q=1;q<=40;q++){ok[q]=isOk(q)}
  GRP().forEach(g=>Object.assign(ok,grpOk(g)));for(let q=1;q<=40;q++)if(ok[q])raw++;
  const parts=DOC.parts.map(p=>{let c=0;for(let q=p.from;q<=p.to;q++)if(ok[q])c++;return c});
  const b=band(T.kind,raw),mins=Math.round((Date.now()-ui.start)/60000);
  RESULT={raw,band:b,ok,parts,mins,auto};ls.set(stKey(),null);
  results();save();
}
async function save(){const body={action:'ires',id:S.uid,t:S.t,test:TID,raw:RESULT.raw,band:RESULT.band,parts:RESULT.parts,mins:RESULT.mins,ans:A};
  for(let i=0;i<3;i++){try{const j=await fetch(CLOUD_URL,{method:'POST',body:JSON.stringify(body)}).then(r=>r.json());if(j.ok){const s=$('#saved');if(s)s.textContent='Natija profilingizga saqlandi ✓';return}}catch(e){}await new Promise(r=>setTimeout(r,1500))}
  const s=$('#saved');if(s)s.textContent='Natijani saqlab bo‘lmadi — internetni tekshiring.'}
function results(){
  const r=RESULT,L=T.kind==='listening';
  const msg=r.band>=7.5?'Ajoyib natija! Bu daraja ko‘plab universitetlar talabidan yuqori.':r.band>=6.5?'Yaxshi natija. Xatolarni tahlil qilsangiz, keyingi bosqichga yaqinsiz.':r.band>=5.5?'Yomon emas. Xatolaringizni javoblar bilan birga ko‘rib chiqing.':'Boshlanish nuqtasi shu. Xatolarni tahlil qilish — eng tez o‘sish yo‘li.';
  screen(`${brandHTML()}<h1>${esc(DOC.title)} — natija</h1>
    <div class="band"><div class="b"><div><b>${r.band.toFixed(1)}</b><small>Band</small></div></div><p><b>${r.raw} / 40</b> to‘g‘ri javob${r.auto?' · vaqt tugadi':''}<br><span class="muted">${msg}</span></p></div>
    <div class="pscores">${DOC.parts.map((p,i)=>`<div><b>${r.parts[i]} / ${p.to-p.from+1}</b><small>${p.title}</small></div>`).join('')}</div>
    <p class="saved" id="saved">Natija saqlanmoqda…</p>
    <div class="row2"><button class="btn ink" id="rv">Javoblarni ko‘rib chiqish</button><a class="btn line" href="./#/me">Bosh sahifa</a></div>
    <button class="btn wide certb" id="cert">Sertifikatni olish</button>
    ${L?'<p class="muted" style="font-size:14px;margin-top:14px">Maslahat: ko‘rib chiqishda audioni qayta tinglab, xato qilgan joylaringizni toping — bepul qo‘llanmadagi usul aynan shu.</p>':''}`);
  $('#screen .card').classList.add('res');
  $('#rv').onclick=review;
  $('#cert').onclick=certificate;
}
/* ---------- certificate (same layout as Multi-Level) ---------- */
async function certificate(){
  const r=RESULT,W=2000,H=1414,cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d');
  try{await document.fonts.load('800 80px Onest');await document.fonts.load('500 40px Onest')}catch(e){}
  const F=(w,sz)=>`${w} ${sz}px Onest, system-ui, sans-serif`;
  x.fillStyle='#fff';x.fillRect(0,0,W,H);
  x.fillStyle='#141B2D';x.fillRect(0,0,W,26);x.fillRect(0,H-26,W,26);
  x.fillStyle='#E3101F';x.fillRect(0,26,W,10);x.fillRect(0,H-36,W,10);
  x.strokeStyle='#DCE1EA';x.lineWidth=3;x.strokeRect(70,90,W-140,H-180);
  const logo=new Image();logo.src=LOGO;await new Promise(z=>{logo.onload=z;logo.onerror=z});
  try{x.drawImage(logo,W/2-70,150,140,140)}catch(e){}
  x.textAlign='center';x.fillStyle='#E3101F';x.font=F(800,40);x.fillText('EDUNEST ACADEMY · IELTS',W/2,350);
  x.fillStyle='#141B2D';x.font=F(800,150);x.fillText('SERTIFIKAT',W/2,510);
  x.fillStyle='#5A6378';x.font=F(500,44);x.fillText('Ushbu sertifikat',W/2,610);
  let nm=USER.name||'',sz=120;x.font=F(800,sz);while(x.measureText(nm).width>W-360&&sz>60){sz-=6;x.font=F(800,sz)}
  x.fillStyle='#141B2D';x.fillText(nm,W/2,750);
  x.fillStyle='#E3101F';x.fillRect(W/2-260,785,520,6);
  x.fillStyle='#5A6378';x.font=F(500,44);x.fillText('ga',W/2,860);
  x.fillStyle='#141B2D';x.font=F(800,58);x.fillText(`“IELTS ${DOC.title}”`,W/2,950);
  x.fillStyle='#5A6378';x.font=F(500,44);x.fillText('sinov testini to‘liq topshirgani uchun beriladi.',W/2,1020);
  const d=new Date(),dt=String(d.getDate()).padStart(2,'0')+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+d.getFullYear();
  x.fillStyle='#141B2D';x.font=F(700,40);x.fillText([`Band ${r.band.toFixed(1)}`,`To‘g‘ri javoblar: ${r.raw} / 40`,dt].join('   ·   '),W/2,1105);
  x.textAlign='left';x.fillStyle='#141B2D';x.font=F(800,44);x.fillText("A'zamjon Toxirov",150,1250);
  x.fillStyle='#5A6378';x.font=F(500,34);x.fillText('C1 o‘qituvchi, EDUNEST Academy',150,1298);
  x.strokeStyle='#141B2D';x.lineWidth=3;x.beginPath();x.moveTo(150,1195);x.lineTo(620,1195);x.stroke();
  x.textAlign='right';x.fillStyle='#5A6378';x.font=F(500,34);x.fillText('Sertifikat raqami',W-150,1250);
  x.fillStyle='#141B2D';x.font=F(800,44);x.fillText(`EDN-${S.uid}-${TID.toUpperCase()}`,W-150,1298);
  const url=cv.toDataURL('image/png'),fn=`EDUNEST-IELTS-${TID}-sertifikat.png`;
  modal(`<h2>Tabriklaymiz!</h2><p class="muted" style="margin:4px 0 0">Sertifikatingiz tayyor. Uni yuklab oling yoki do‘stlaringizga ulashing.</p><img class="certimg" src="${url}" alt="Sertifikat">
    <div class="row2"><button class="btn line" id="cClose">Yopish</button>${navigator.share?'<button class="btn ink" id="cShare">Ulashish</button>':''}<button class="btn" id="cDl">Yuklab olish</button></div>`);
  $('#modal .card').classList.add('cert');
  $('#cClose').onclick=closeModal;
  $('#cDl').onclick=()=>{const a=document.createElement('a');a.href=url;a.download=fn;document.body.appendChild(a);a.click();a.remove()};
  const sh=$('#cShare');if(sh)sh.onclick=async()=>{try{const b=await (await fetch(url)).blob();const f=new File([b],fn,{type:'image/png'});
    if(navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share({files:[f],title:'EDUNEST IELTS sertifikati'});else $('#cDl').click()}catch(e){}};
  confetti();
}
function confetti(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const cv=document.createElement('canvas');cv.className='confetti';document.body.appendChild(cv);const W=cv.width=innerWidth*devicePixelRatio,H=cv.height=innerHeight*devicePixelRatio;const x=cv.getContext('2d');
  const cols=['#E3101F','#141B2D','#F5B700','#1FA35C','#FFFFFF'];const P=Array.from({length:120},()=>({x:W/2+(Math.random()-.5)*W*.2,y:H*.38,vx:(Math.random()-.5)*W*.022,vy:-Math.random()*H*.02-H*.006,s:(6+Math.random()*8)*devicePixelRatio,c:cols[Math.random()*cols.length|0],r:Math.random()*6,vr:(Math.random()-.5)*.3}));
  let f=0;(function tick(){x.clearRect(0,0,W,H);P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=H*.0009;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);x.restore()});
    if(++f<110)requestAnimationFrame(tick);else cv.remove()})()}
function review(){
  ui.mode='review';$('#screen').classList.add('hide');$('#exam').classList.remove('hide');
  $('#timer').textContent=RESULT.raw+' / 40 · Band '+RESULT.band.toFixed(1);$('#timer').classList.remove('warn');$('#ban').innerHTML='';
  $('#sub').textContent='Bosh sahifa';
  $('#rbar').innerHTML=`<div class="reviewbar"><span>Ko‘rib chiqish rejimi</span>${T.kind==='listening'&&audioUrl?`<audio controls src="${audioUrl}"></audio>`:''}<button class="btn ink" id="toRes">Natija</button></div>`;
  $('#toRes').onclick=()=>{const a=$('#rbar audio');if(a)a.pause();results();save=()=>{};$('#saved').textContent=''};
  showPart(0);
}
function mark(){
  $$('#pq input, #pq select').forEach(x=>x.disabled=true);
  GRP().forEach(g=>{const box=$(`#pq [data-grp="${g.q[0]}-${g.q[g.q.length-1]}"]`);if(!box)return;
    box.querySelectorAll('input[type=checkbox]').forEach(c=>{const l=c.closest('label');if(!l)return;
      if(g.ans.includes(c.value))l.classList.add('key-opt');else if(c.checked)l.classList.add('bad-opt')})});
  for(let n=DOC.parts[ui.part].from;n<=DOC.parts[ui.part].to;n++){
    if(grpOf(n))continue;
    const ok=RESULT.ok[n],key=DOC.answers[n][0];
    const g=$(`#pq input.gap[data-q="${n}"], #pq select[data-k=pick][data-q="${n}"]`);
    // a dropdown shows its key the way the option is written (Reading 2 keys are "VI", its options "vi")
    const kt=g&&g.tagName==='SELECT'?(([...g.options].find(o=>o.value&&norm(o.value)===norm(key))||{}).value||key):key;
    if(g){g.classList.add(ok?'ok-in':'bad-in');if(!ok&&!g.nextElementSibling?.classList?.contains('key'))g.insertAdjacentHTML('afterend',`<span class="key">${esc(kt)}</span>`);continue}
    const radios=$$(`#pq input[name="q${n}"]`);
    radios.forEach(r=>{const cell=r.closest('label')||r.closest('td');if(!cell)return;
      if(norm(r.value)===norm(key))cell.classList.add(cell.tagName==='TD'?'key-cell':'key-opt');
      else if(r.checked)cell.classList.add(cell.tagName==='TD'?'bad-cell':'bad-opt')});
  }
}
addEventListener('beforeunload',e=>{if(ui.mode==='exam'&&ui.start){saveState();e.preventDefault();e.returnValue=''}});
addEventListener('hashchange',()=>location.reload());
boot();
