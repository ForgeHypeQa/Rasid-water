/* ============ ForgeHype Water — demo core ============ */
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const ymd=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const parseYmd=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const TODAY=new Date();TODAY.setHours(0,0,0,0);
const TODAY_S=ymd(TODAY);
const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const hm=ts=>{const d=new Date(ts);return pad(d.getHours())+':'+pad(d.getMinutes())};
const fmtD=(d,o)=>new Date(d).toLocaleDateString(LANG(),Object.assign({weekday:'short',day:'numeric',month:'short'},o||{}));
const fmtDay=d=>new Date(d).toLocaleDateString(LANG(),{day:'numeric',month:'short'});
const fmtLong=d=>new Date(d).toLocaleDateString(LANG(),{weekday:'long',day:'numeric',month:'long'});
const money=n=>(S.data?S.data.settings.currency:'QAR')+' '+Number(n).toLocaleString('en-GB');
const uid=()=>Math.random().toString(36).slice(2,9);
const initials=n=>n.split(' ').filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const sum=(a,f)=>a.reduce((s,x)=>s+(f?f(x):x),0);
const rel=ts=>{const m=Math.round((Date.now()-new Date(ts))/60000);if(m<1)return 'just now';if(m<60)return m+' min ago';const h=Math.round(m/60);if(h<24)return h+' h ago';return fmtDay(ts)};
let _tt;const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(_tt);_tt=setTimeout(()=>t.classList.remove('on'),2600)};
const LANG=()=>(S.c&&S.c.ar&&S.role==='customer')?'ar-QA':'en-GB';

/* ---- icons (stroke) ---- */
const P={
home:'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
clock:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
ticket:'M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a3 3 0 0 0 0-6zM13 6v2M13 11v2M13 16v2',
chat:'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z',
user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
users:'M9 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2 20a7 7 0 0 1 14 0M17 12a3 3 0 1 0 0-6M22 19a5 5 0 0 0-5-5',
truck:'M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
route:'M6 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM6 7v4a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4',
grid:'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
phone:'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
nav:'M3 11l18-8-8 18-2-8z',
camera:'M4 8h3l2-3h6l2 3h3v11H4zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
check:'M5 12l5 5L20 7',
x:'M6 6l12 12M18 6L6 18',
plus:'M12 5v14M5 12h14',
minus:'M5 12h14',
left:'M15 5l-7 7 7 7',right:'M9 5l7 7-7 7',down:'M6 9l6 6 6-6',up:'M18 15l-6-6-6 6',
bell:'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4',
drop:'M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z',
pause:'M8 5v14M16 5v14',
cal:'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18M8 3v4M16 3v4',
search:'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-3.5-3.5',
sliders:'M4 7h10M18 7h2M4 17h4M12 17h8M16 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM8 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
download:'M12 4v12M7 11l5 5 5-5M4 20h16',
mail:'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l9 6 9-6',
pin:'M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
refresh:'M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5',
logout:'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
moon:'M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z',
sun:'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
alert:'M12 9v4M12 17h.01M10.3 3.9L2 19h20L13.7 3.9a2 2 0 0 0-3.4 0z',
chart:'M4 20V10M10 20V4M16 20v-7M22 20H2',
undo:'M9 14L4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3',
globe:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18',
card:'M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18M7 15h4',
info:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01',
eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
copy:'M8 8h12v12H8zM4 16V4h12',
send:'M22 2L11 13M22 2l-7 20-4-9-9-4z',
box:'M3 8l9-5 9 5-9 5zM3 8v8l9 5 9-5V8M12 13v8',
more:'M5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
edit:'M4 20h4l10-10-4-4L4 16zM13 7l4 4',
wa:'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12zM9 9.5c.3 2.3 2.2 4.2 4.5 4.5l1-1.2 2 .9c-.3 1.6-1.7 2-3.4 1.5A8 8 0 0 1 8.3 10c-.5-1.7-.1-3.1 1.5-3.4l.9 2z',
sparkle:'M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2zM19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z',
shield:'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
list:'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
locate:'M12 2v3M12 19v3M2 12h3M19 12h3M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
star:'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z'
};
const ic=(n,cls='')=>`<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[n]}"/></svg>`;

/* ---- state & persistence ---- */
const LS='fh-water-demo-v1';
let S={role:null,me:null,data:null,theme:null,
 c:{tab:'home',hist:'cal',flt:'All',mOff:0,sel:TODAY_S,ar:false},
 d:{scr:'route',tab:'route',cur:null,full:0,empty:0,photo:null,why:'No answer at the door',busy:false},
 a:{tab:'home',preview:null,asId:null,f:{q:'',z:'All',c:'All',t:'All'},rdate:TODAY_S,repRange:14}};
function save(){try{localStorage.setItem(LS,JSON.stringify({day:TODAY_S,data:S.data,role:S.role,me:S.me,theme:S.theme,a:{preview:S.a.preview,asId:S.a.asId},ar:S.c.ar}))}catch(e){}}
function load(){try{const j=JSON.parse(localStorage.getItem(LS)||'null');if(!j)return false;if(j.day!==TODAY_S){S.theme=j.theme;return false}
 S.data=j.data;S.role=j.role;S.me=j.me;S.theme=j.theme;S.c.ar=!!j.ar;if(j.a){S.a.preview=j.a.preview;S.a.asId=j.a.asId}return true}catch(e){return false}}
function applyTheme(){const r=document.documentElement;const dark=S.theme==='dark'||(!S.theme&&matchMedia('(prefers-color-scheme:dark)').matches);r.dataset.theme=dark?'dark':'light';
 if(S.data)r.style.setProperty('--acc',ACCENTS[S.data.settings.accent]||ACCENTS.orange)}
const ACCENTS={orange:'#FF5A00',blue:'#1463F3',teal:'#0E9F8A',green:'#19A05B',navy:'#243B8A',plum:'#8A2E8A'};

/* ---- seeded demo data ---- */
function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const refCode=r=>{const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<6;i++)s+=A[Math.floor(r()*A.length)];return s};
function genData(){
 const r=rng(20261107);
 const zones=[
  {id:'z1',name:'Al Waab',drv:'d1',lat:25.258,lng:51.452},{id:'z2',name:'Al Rayyan',drv:'d1',lat:25.292,lng:51.424},{id:'z3',name:'Al Gharrafa',drv:'d1',lat:25.332,lng:51.433},
  {id:'z4',name:'West Bay',drv:'d2',lat:25.322,lng:51.531},{id:'z5',name:'Al Dafna',drv:'d2',lat:25.311,lng:51.528},{id:'z6',name:'Lusail',drv:'d2',lat:25.418,lng:51.492},{id:'z7',name:'The Pearl',drv:'d2',lat:25.371,lng:51.552}];
 const drivers=[
  {id:'d1',name:'Mohammed Al-Marri',email:'driver1@forgehype.qa',phone:'+974 5511 2201',vehicle:'Van 1',plate:'384 921',active:true,zones:['z1','z2','z3']},
  {id:'d2',name:'Yousef Al-Hajri',email:'driver2@forgehype.qa',phone:'+974 5511 2202',vehicle:'Van 2',plate:'517 044',active:true,zones:['z4','z5','z6','z7']}];
 const staff=[{id:'a1',name:'Fatima Al-Sulaiti',email:'admin@forgehype.qa',role:'admin'},{id:'a2',name:'Aisha Al-Naimi',email:'support@forgehype.qa',role:'support'}];
 const wd=TODAY.getDay(), T=n=>(wd+n+7)%7;
 const C=(id,name,email,phone,building,street,zone,day,ws,we,bottles,target,gate,login)=>({id,name,email,phone,building,street,zone,weekday:T(day),ws,we,bottles,target,gate:gate||'',login:!!login,status:'active',holds:[],resched:null,emailSaved:!!login&&id!=='c1',lang:'en',notif:{wa:true,email:true}});
 const customers=[
  C('c1','Khalid Al-Thani','khalid@demo.qa','+974 5533 1001','Villa 12','Street 340, Al Waab','z1',0,'07:00','09:00',3,42,'Leave at the side gate if no answer',true),
  C('c2','Noora Al-Kuwari','noora@demo.qa','+974 5533 1002','Apartment 1204, Tower 3','Diplomatic Street, West Bay','z4',0,'08:00','10:00',2,26,'Call from reception',true),
  C('c3','Hamad Al-Mohannadi','hamad@demo.qa','+974 5533 1003','Villa 7','Street 921, Al Rayyan','z2',2,'09:00','11:00',4,7,'',true),
  C('c4','Maryam Al-Sulaiti','maryam@demo.qa','+974 5533 1004','Villa 3','Al Dafna, near Doha Exhibition Centre','z5',3,'07:00','09:00',3,14,'Ring the bell twice',true),
  C('c5','Ahmed Al-Emadi','ahmed@demo.qa','+974 5533 1005','Villa 21, Fox Hills','Lusail','z6',5,'10:00','12:00',5,88,'',true),
  C('c6','Abdulla Al-Naimi','','+974 5540 2201','Villa 44','Street 820, Al Waab','z1',0,'07:00','09:00',2,33),
  C('c7','Sara Al-Attiyah','','+974 5540 2202','Villa 9','Bu Hamour, Al Waab','z1',0,'07:00','09:00',3,51),
  C('c8','Jassim Al-Kaabi','','+974 5540 2203','Villa 18','Street 905, Al Rayyan','z2',0,'08:00','10:00',3,19,'Gate code 2244'),
  C('c9','Aisha Al-Mannai','','+974 5540 2204','Villa 2','Al Gharrafa, Street 50','z3',0,'08:00','10:00',4,60),
  C('c10','Nasser Al-Dosari','','+974 5540 2205','Villa 30','Street 1010, Al Rayyan','z2',0,'09:00','11:00',2,11),
  C('c11','Hessa Al-Muftah','','+974 5540 2206','Apartment 702, Zig Zag Tower','West Bay','z4',0,'07:00','09:00',2,38),
  C('c12','Saad Al-Khater','','+974 5540 2207','Villa 5','Al Dafna','z5',0,'08:00','10:00',3,24),
  C('c13','Latifa Al-Misnad','','+974 5540 2208','Villa 16, Fox Hills','Lusail','z6',0,'09:00','11:00',3,47),
  C('c14','Rashid Al-Buainain','','+974 5540 2209','Apartment 1808, Porto Arabia','The Pearl','z7',0,'10:00','12:00',2,9),
  C('c15','Moza Al-Ansari','','+974 5540 2210','Villa 11, Qanat Quartier','The Pearl','z7',0,'10:00','12:00',4,72),
  C('c16','Faisal Al-Sada','','+974 5540 2211','Villa 27','Al Gharrafa','z3',1,'07:00','09:00',3,28),
  C('c17','Dana Al-Mahmoud','','+974 5540 2212','Apartment 405, Marina Tower','Lusail','z6',2,'08:00','10:00',2,56),
  C('c18','Ali Al-Hitmi','','+974 5540 2213','Villa 8','Street 361, Al Waab','z1',4,'07:00','09:00',3,35)];
 /* more customers so every weekday has a route */
 const EXTRA=['Hassan Al-Jaber','Amna Al-Siddiqi','Tamim Al-Kuwari','Shaikha Al-Mahmoud','Khalifa Al-Nuaimi','Reem Al-Hammadi','Saif Al-Shamsi','Noof Al-Darwish','Mubarak Al-Khulaifi','Wadha Al-Marri','Ghanim Al-Hajri','Alanoud Al-Thani','Ibrahim Al-Baker','Haya Al-Ansari','Majid Al-Kaabi','Lolwa Al-Obaidli','Turki Al-Sulaiti','Mariam Al-Emadi','Sultan Al-Mohannadi','Hind Al-Naimi','Abdulrahman Al-Attiyah','Fahad Al-Buainain','Jawaher Al-Misnad','Nawaf Al-Dosari'];
 const ADDR={z1:['Villa ','Street 3',', Al Waab'],z2:['Villa ','Street 9',', Al Rayyan'],z3:['Villa ','Street ',', Al Gharrafa'],z4:['Apartment ','','West Bay'],z5:['Villa ','','Al Dafna'],z6:['Villa ','Fox Hills, ','Lusail'],z7:['Apartment ','Porto Arabia, ','The Pearl']};
 const TOW=['Burj Doha','Tornado Tower','Palm Tower','Al Fardan Tower'];
 const WIN=[['07:00','09:00'],['08:00','10:00'],['09:00','11:00'],['10:00','12:00'],['16:00','18:00']];
 EXTRA.forEach((nm,i)=>{const z=zones[i%7],a=ADDR[z.id],w=WIN[i%5],day=1+(i%5);const n=3+Math.floor(r()*40);
  const building=z.id==='z4'?'Apartment '+(400+Math.floor(r()*1800))+', '+TOW[i%4]:z.id==='z7'?'Apartment '+(100+Math.floor(r()*2000))+', Porto Arabia':'Villa '+n;
  const street=z.id==='z4'?'West Bay':z.id==='z7'?'The Pearl':z.id==='z5'?'Al Dafna':z.id==='z6'?'Fox Hills, Lusail':(a[1]+(z.id==='z3'?Math.floor(10+r()*80):Math.floor(10+r()*89)))+a[2];
  customers.push(C('c'+(19+i),nm,'','+974 5560 '+(3100+i*7),building,street,z.id,day,w[0],w[1],2+Math.floor(r()*3),8+Math.floor(r()*80),i%6===0?'Ring the bell twice':''))});
 customers.forEach((c,i)=>{c.no=10400+i*7+Math.floor(r()*5);const z=zones.find(z=>z.id===c.zone);c.lat=+(z.lat+(r()-.5)*.026).toFixed(5);c.lng=+(z.lng+(r()-.5)*.03).toFixed(5);c.empties=1+Math.floor(r()*4);c.since=ymd(addDays(TODAY,-(120+Math.floor(r()*500))))});
 /* ledger: 16 weeks of history */
 const ledger=[];const packs=[{id:'p30',coupons:30,price:220},{id:'p60',coupons:60,price:420},{id:'p120',coupons:120,price:780}];
 const push=e=>ledger.push(Object.assign({id:uid()},e));
 const todayDone={c2:'08:12',c6:'07:08',c7:'07:31',c9:'08:15',c11:'07:20',c12:'08:40'},todayMiss={c8:['07:52','Gate or door locked']};
 customers.forEach((c,ci)=>{
  const diff=(c.weekday-wd+7)%7; const lastDate=addDays(TODAY,diff===0?0:diff-7);
  const dates=[];for(let k=diff===0?16:15;k>=(diff===0?1:0);k--)dates.push(addDays(lastDate,-7*k));
  const missIdx=(ci%3===0)?3+(ci%5):-1;
  const used=dates.filter((d,i)=>i!==missIdx).length*c.bottles;
  let k=Math.ceil((used+c.target-60)/60);k=clamp(k,1,4);let opening=c.target+used-60*k;if(opening<10){k--;opening+=60}
  const tupAt=[];for(let j=0;j<k;j++)tupAt.push(Math.floor((j+ .6)*dates.length/k)-1);
  push({cid:c.id,kind:'topup',at:addDays(dates[0],-3).toISOString(),coupons:opening,amount:null,detail:'Opening balance',pack:null});
  dates.forEach((d,i)=>{
   if(tupAt.includes(i)){const t=new Date(d);t.setHours(18,30+Math.floor(r()*20));t.setDate(t.getDate()-2);push({cid:c.id,kind:'topup',at:t.toISOString(),coupons:60,amount:420,detail:'Card payment',pack:'p60'})}
   const t=new Date(d);const [h,m]=c.ws.split(':').map(Number);t.setHours(h,m+Math.floor(r()*90));
   if(i===missIdx)push({cid:c.id,kind:'missed',at:t.toISOString(),coupons:0,detail:['No answer at the door','Phone not reachable','Customer is away'][ci%3]});
   else push({cid:c.id,kind:'delivered',at:t.toISOString(),coupons:-c.bottles,bottles:c.bottles,empties:c.bottles,ref:refCode(r),driver:zones.find(z=>z.id===c.zone).drv});
  });
 });
 /* recent top-ups, so this month's sales are not empty */
 [['c12',2,'p60','Cash payment at office'],['c14',6,'p60','Card payment'],['c1',4,'p30','Card payment'],['c7',1,'p60','Card payment'],['c15',5,'p120','Card payment'],['c20',3,'p60','Apple Pay'],['c27',1,'p60','Card payment']].forEach(([cid,ago,pid,how])=>{
  const op=ledger.find(e=>e.cid===cid&&e.detail==='Opening balance'),pk=packs.find(p=>p.id===pid);if(!op)return;op.coupons-=Math.max(0,Math.min(pk.coupons,op.coupons-10));
  const t=addDays(TODAY,-ago);t.setHours(9+Math.floor(r()*11),Math.floor(r()*60));push({cid,kind:'topup',at:t.toISOString(),coupons:pk.coupons,amount:pk.price,detail:how,pack:pid})});
 /* today's routes */
 const nameOf={d1:'Al Waab & Al Rayyan',d2:'West Bay & Lusail'};
 const routes=['d1','d2'].map(did=>{const dz=drivers.find(d=>d.id===did).zones;const cs=customers.filter(c=>c.weekday===wd&&dz.includes(c.zone));
  cs.sort((a,b)=>a.ws.localeCompare(b.ws)||a.name.localeCompare(b.name));
  if(did==='d1'){const o=['c6','c7','c8','c9','c1','c10'];cs.sort((a,b)=>o.indexOf(a.id)-o.indexOf(b.id))}else{const o=['c11','c2','c12','c13','c14','c15'];cs.sort((a,b)=>o.indexOf(a.id)-o.indexOf(b.id))}
  return {id:'r_'+did+'_'+TODAY_S,date:TODAY_S,name:nameOf[did],driver:did,stops:cs.map((c,i)=>{const s={id:'s'+uid(),cid:c.id,seq:i+1,status:'pending',planned:c.bottles,delivered:0,empties:0,completed_at:null,miss_reason:null,photo:null,ref:null,gps:null};
   if(todayDone[c.id]){const [h,m]=todayDone[c.id].split(':').map(Number);const t=new Date(TODAY);t.setHours(h,m);s.status='delivered';s.completed_at=t.toISOString();s.delivered=c.bottles;s.empties=c.bottles-(c.id==='c7'?1:0);s.ref=refCode(r);s.gps=[c.lat,c.lng];
    push({cid:c.id,kind:'delivered',at:s.completed_at,coupons:-c.bottles,bottles:c.bottles,empties:s.empties,ref:s.ref,driver:did,stop:s.id})}
   if(todayMiss[c.id]){const [h,m]=todayMiss[c.id][0].split(':').map(Number);const t=new Date(TODAY);t.setHours(h,m);s.status='missed';s.completed_at=t.toISOString();s.miss_reason=todayMiss[c.id][1];
    push({cid:c.id,kind:'missed',at:s.completed_at,coupons:0,detail:s.miss_reason,stop:s.id})}
   return s})}});
 /* holds & reschedules */
 customers.find(c=>c.id==='c4').holds.push({start:ymd(addDays(TODAY,6)),days:5});
 /* tickets */
 const iso=(dOff,h,m)=>{const t=addDays(TODAY,dOff);t.setHours(h,m);return t.toISOString()};
 const tickets=[
  {id:'t1',cid:'c3',subject:'Bottle seal was broken on one bottle',status:'open',created_at:iso(0,9,40),messages:[{from:'customer',body:'One of the four bottles delivered on my last delivery had a loose seal. Can you replace it?',at:iso(0,9,40)}]},
  {id:'t2',cid:'c2',subject:'Driver arrived outside the time window',status:'in_progress',created_at:iso(-1,11,5),messages:[{from:'customer',body:'The delivery came at 10:40, after my 8 to 10 window. I was already out.',at:iso(-1,11,5)},{from:'support',body:'Sorry about that, Noora. We have flagged it with Yousef and moved you earlier on the route from this week.',at:iso(-1,12,20)}]},
  {id:'t3',cid:'c14',subject:'Need an invoice for last top-up',status:'open',created_at:iso(-1,16,12),messages:[{from:'customer',body:'Please send a tax invoice for the 60-coupon pack I bought on the 1st.',at:iso(-1,16,12)}]},
  {id:'t4',cid:'c5',subject:'Change delivery to the afternoon',status:'resolved',created_at:iso(-6,14,0),messages:[{from:'customer',body:'Can my delivery window be moved to 2 to 4 pm?',at:iso(-6,14,0)},{from:'support',body:'Done. Your window is now 10 to 12 on the same day, which is the latest slot in Lusail. Let us know if that works.',at:iso(-6,15,30)},{from:'customer',body:'That works, thanks.',at:iso(-6,16,0)}]}];
 const notes=[];
 const settings={company:'ForgeHype Water',accent:'orange',currency:'QAR',supportPhone:'+974 4444 0000',supportWa:'+974 5500 0000',lowAt:10,warnAt:20,holdMax:14};
 const audit=[{at:iso(-1,12,20),who:'Aisha Al-Naimi',what:'Replied to ticket from Noora Al-Kuwari'},{at:iso(-1,9,2),who:'Fatima Al-Sulaiti',what:'Generated routes for '+fmtD(TODAY)},{at:iso(-2,17,45),who:'Fatima Al-Sulaiti',what:'Added 60 coupons to Saad Al-Khater (card payment at office)'}];
 return {zones,drivers,staff,customers,ledger,packs,routes,tickets,notes,settings,audit};
}

/* ---- derived data ---- */
const D=()=>S.data;
const cust=id=>D().customers.find(c=>c.id===id);
const drv=id=>D().drivers.find(d=>d.id===id);
const zone=id=>D().zones.find(z=>z.id===id);
const zname=c=>{const z=zone(c.zone);return z?z.name:''};
const bal=cid=>sum(D().ledger.filter(e=>e.cid===cid),e=>e.coupons);
const ledgerOf=cid=>D().ledger.filter(e=>e.cid===cid).sort((a,b)=>new Date(b.at)-new Date(a.at));
const usedBetween=(cid,from,to)=>-sum(D().ledger.filter(e=>e.cid===cid&&e.kind==='delivered'&&new Date(e.at)>=from&&new Date(e.at)<to),e=>e.coupons);
const avgMonthly=cid=>Math.round(usedBetween(cid,addDays(TODAY,-84),addDays(TODAY,1))/84*30);
const daysLeft=cid=>{const a=avgMonthly(cid);return a?Math.round(bal(cid)/(a/30)):null};
const status=c=>{const b=bal(c.id),s=D().settings;return b<=s.lowAt?['rose','Low']:b<=s.warnAt?['sand','Running low']:['mint','Healthy']};
const lastTopup=cid=>ledgerOf(cid).find(e=>e.kind==='topup'&&e.amount);
const onHold=(c,ds)=>c.holds.some(h=>{const s=parseYmd(h.start),e=addDays(s,h.days-1);const d=parseYmd(ds);return d>=s&&d<=e});
const nextHold=c=>c.holds.map(h=>({...h,end:ymd(addDays(parseYmd(h.start),h.days-1))})).filter(h=>h.end>=TODAY_S).sort((a,b)=>a.start.localeCompare(b.start))[0];
const stopsOf=cid=>D().routes.flatMap(r=>r.stops.filter(s=>s.cid===cid).map(s=>({...s,route:r})));
const todayStop=cid=>stopsOf(cid).find(s=>s.route.date===TODAY_S);
function nextDelivery(c){
 const ts=todayStop(c.id);if(ts&&ts.status==='pending')return {date:TODAY_S,today:true,stop:ts};
 let d=addDays(TODAY,1);for(let i=0;i<60;i++){const s=ymd(d);
  if(d.getDay()===c.weekday&&!onHold(c,s)){if(c.resched&&c.resched.from===s)return {date:c.resched.to,moved:true};return {date:s}}
  if(c.resched&&c.resched.to===s&&!onHold(c,s))return {date:s,moved:true};
  d=addDays(d,1)}
 return {date:null}}
const driverFor=c=>drv(zone(c.zone).drv);
const openTickets=()=>D().tickets.filter(t=>t.status!=='resolved');
const monthStart=()=>new Date(TODAY.getFullYear(),TODAY.getMonth(),1);
function audit(what){D().audit.unshift({at:new Date().toISOString(),who:S.me?S.me.name:'System',what});D().audit=D().audit.slice(0,60)}
function notify(cid,kind,body){D().notes.unshift({id:uid(),cid,kind,body,at:new Date().toISOString(),read:false})}

/* ---- business actions (shared by driver + admin) ---- */
const ACT={
 confirm(stopId,full,empties,photo,gps){const {s,r}=findStop(stopId);if(!s||s.status!=='pending')return 'Stop is not pending';const c=cust(s.cid);
  if(bal(c.id)<full)notify(c.id,'low','Delivery of '+full+' bottles took your balance below zero. Please top up.');
  s.status='delivered';s.completed_at=new Date().toISOString();s.delivered=full;s.empties=empties;s.photo=photo||null;s.ref=refCode(Math.random);s.gps=gps||[c.lat,c.lng];
  D().ledger.push({id:uid(),cid:c.id,kind:'delivered',at:s.completed_at,coupons:-full,bottles:full,empties,ref:s.ref,driver:r.driver,stop:s.id});
  c.empties=Math.max(0,c.empties+full-empties);
  notify(c.id,'ok',full+' bottles delivered. Ref '+s.ref+'. '+bal(c.id)+' coupons left.');
  const b=bal(c.id);if(b<=D().settings.lowAt)notify(c.id,'low','Only '+b+' coupons left. Top up to keep deliveries coming.');
  save();return null},
 miss(stopId,reason,photo){const {s}=findStop(stopId);if(!s||s.status!=='pending')return 'Stop is not pending';const c=cust(s.cid);
  s.status='missed';s.completed_at=new Date().toISOString();s.miss_reason=reason;s.photo=photo||null;
  D().ledger.push({id:uid(),cid:c.id,kind:'missed',at:s.completed_at,coupons:0,detail:reason,stop:s.id});
  notify(c.id,'bad','We came by at '+hm(s.completed_at)+' but could not reach you ('+reason.toLowerCase()+'). No coupons were used. Reschedule from the app.');
  save();return null},
 undo(stopId){const {s}=findStop(stopId);if(!s||s.status==='pending')return 'Nothing to undo';if(Date.now()-new Date(s.completed_at)>30*60000)return 'Undo is only available for 30 minutes';
  const c=cust(s.cid);if(s.status==='delivered')c.empties=Math.max(0,c.empties-s.delivered+s.empties);
  D().ledger=D().ledger.filter(e=>e.stop!==s.id);D().notes=D().notes.filter(n=>!(n.cid===c.id&&Math.abs(new Date(n.at)-new Date(s.completed_at))<2000));
  s.status='pending';s.completed_at=null;s.delivered=0;s.empties=0;s.miss_reason=null;s.photo=null;s.ref=null;save();return null},
 order(routeId,ids){const r=D().routes.find(r=>r.id===routeId);ids.forEach((id,i)=>{const s=r.stops.find(s=>s.id===id);if(s)s.seq=i+1});r.stops.sort((a,b)=>a.seq-b.seq);save()},
 topup(cid,packId,method){const p=D().packs.find(p=>p.id===packId);D().ledger.push({id:uid(),cid,kind:'topup',at:new Date().toISOString(),coupons:p.coupons,amount:p.price,detail:method||'Card payment',pack:p.id});
  notify(cid,'top','+'+p.coupons+' coupons added. Payment of '+money(p.price)+' received.');audit('Top-up of '+p.coupons+' coupons by '+cust(cid).name+' ('+(method||'card')+')');save()},
 adjust(cid,delta,note){D().ledger.push({id:uid(),cid,kind:'topup',at:new Date().toISOString(),coupons:delta,amount:null,detail:note||'Admin adjustment',pack:null,adjust:true});audit((delta>0?'Added ':'Removed ')+Math.abs(delta)+' coupons for '+cust(cid).name+(note?' ('+note+')':''));save()},
 generate(dateS){const d=parseYmd(dateS),wd=d.getDay();let added=0;
  D().drivers.filter(x=>x.active).forEach(dr=>{const cs=D().customers.filter(c=>c.status==='active'&&dr.zones.includes(c.zone)&&!onHold(c,dateS)&&((c.weekday===wd&&!(c.resched&&c.resched.from===dateS))||(c.resched&&c.resched.to===dateS)));
   if(!cs.length)return;let r=D().routes.find(r=>r.date===dateS&&r.driver===dr.id);
   if(!r){r={id:'r_'+dr.id+'_'+dateS,date:dateS,name:dr.id==='d1'?'Al Waab & Al Rayyan':'West Bay & Lusail',driver:dr.id,stops:[]};D().routes.push(r)}
   cs.sort((a,b)=>a.ws.localeCompare(b.ws)).forEach(c=>{if(r.stops.some(s=>s.cid===c.id))return;r.stops.push({id:'s'+uid(),cid:c.id,seq:r.stops.length+1,status:'pending',planned:c.bottles,delivered:0,empties:0,completed_at:null,miss_reason:null,photo:null,ref:null,gps:null});added++})});
  audit('Generated routes for '+fmtD(d)+' ('+added+' stops added)');save();return added},
 ticket(cid,subject,body){const t={id:'t'+uid(),cid,subject,status:'open',created_at:new Date().toISOString(),messages:[{from:'customer',body,at:new Date().toISOString()}]};D().tickets.unshift(t);save();return t},
 reply(tid,from,body){const t=D().tickets.find(t=>t.id===tid);t.messages.push({from,body,at:new Date().toISOString()});if(from==='support'){if(t.status==='open')t.status='in_progress';notify(t.cid,'chat','Support replied to "'+t.subject+'".')}save()},
 ticketStatus(tid,st){const t=D().tickets.find(t=>t.id===tid);t.status=st;if(st==='resolved'){t.resolved_at=new Date().toISOString();notify(t.cid,'ok','Your request "'+t.subject+'" was marked resolved.')}save()}
};
function findStop(id){for(const r of D().routes){const s=r.stops.find(s=>s.id===id);if(s)return {s,r}}return {}}

/* ---- auth ---- */
const DEMO_PW='0000';
function accounts(){const a=[];D().staff.forEach(s=>a.push({kind:s.role,id:s.id,name:s.name,email:s.email,label:s.role==='admin'?'Admin':'Support'}));
 D().drivers.forEach(d=>a.push({kind:'driver',id:d.id,name:d.name,email:d.email,label:'Driver, '+d.vehicle}));
 D().customers.filter(c=>c.login).forEach(c=>a.push({kind:'customer',id:c.id,name:c.name,email:c.email,label:'Customer, '+zname(c)}));return a}
function signIn(email,pw){const a=accounts().find(x=>x.email.toLowerCase()===email.trim().toLowerCase());
 if(!a)return 'No account with that email. Use one of the demo accounts below.';if(pw!==DEMO_PW)return 'Wrong password. The demo password is 0000.';
 S.me={kind:a.kind,id:a.id,name:a.name,email:a.email};S.role=a.kind==='support'?'admin':a.kind;S.a.preview=null;S.a.asId=null;
 if(S.role==='customer'){S.c.ar=cust(a.id).lang==='ar'}
 save();render();toast('Signed in as '+a.name.split(' ')[0]);return null}
function signOut(){S.me=null;S.role=null;S.a.preview=null;S.a.asId=null;S.c.tab='home';S.d.scr='route';S.a.tab='home';save();render()}
function resetDemo(){try{localStorage.removeItem(LS)}catch(e){}S.data=genData();S.a.preview=null;S.a.asId=null;S.c=Object.assign(S.c,{tab:'home',hist:'cal',flt:'All',mOff:0,sel:TODAY_S});S.d=Object.assign(S.d,{scr:'route',tab:'route',cur:null,photo:null,busy:false});S.a.tab='home';applyTheme();save();render();toast('Demo data reset')}
function toggleTheme(){const dark=document.documentElement.dataset.theme==='dark';S.theme=dark?'light':'dark';applyTheme();save();render()}

/* ---- login view ---- */
function loginView(){const acc=accounts();const grp=k=>acc.filter(a=>a.kind===k);
 const row=a=>`<button class="acct" onclick="fillLogin('${a.email}')"><span class="avatar sm ${a.kind==='customer'?'tint-sky':a.kind==='driver'?'tint-mint':'tint-acc'}">${initials(a.name)}</span><span class="grow"><b>${esc(a.name)}</b><span class="sub" style="display:block">${esc(a.label)}</span></span><span class="xs mute">${esc(a.email)}</span></button>`;
 return `<div class="login"><div class="box">
 <div class="brand" style="justify-content:center;margin-bottom:28px"><span class="mark">${ic('drop')}</span>${esc(D().settings.company)}</div>
 <div class="card" style="padding:22px" id="loginCard">
  <h1 class="title" style="font-size:24px">Sign in</h1><p class="sub mt4">One sign-in for customers, drivers and the office.</p>
  <form onsubmit="event.preventDefault();doLogin()">
   <div class="grp mt16"><input class="in" id="lemail" type="email" placeholder="Email" autocomplete="username" required><input class="in" id="lpw" type="password" placeholder="Password" autocomplete="current-password" required></div>
   <div class="sm mt8" id="lerr" style="color:var(--rose-i);min-height:18px"></div>
   <button class="btn p w lg mt4" type="submit">Sign in</button>
  </form>
 </div>
 <div class="row sp mt20 mb8"><span class="h3">Demo accounts</span><span class="pill tint-sand">Password 0000</span></div>
 <p class="sub mb12">Tap an account to fill it in. Everything here is sample data for ${esc(fmtLong(TODAY))}; nothing leaves this browser.</p>
 <div class="sm sb ink2 mt12">Office</div>${grp('admin').map(row).join('')}${grp('support').map(row).join('')}
 <div class="sm sb ink2 mt16">Drivers</div>${grp('driver').map(row).join('')}
 <div class="sm sb ink2 mt16">Customers</div>${grp('customer').map(row).join('')}
 <div class="row sp mt24 sub"><span>ForgeHype Water, demo build</span><span class="row"><button class="btn sm g" onclick="toggleTheme()">${ic('moon','s')} Theme</button><button class="btn sm g" onclick="resetDemo()">Reset data</button></span></div>
 </div></div>`}
function fillLogin(e){$('#lemail').value=e;$('#lpw').value=DEMO_PW;$('#lpw').focus();$('#lerr').textContent=''}
function doLogin(){const err=signIn($('#lemail').value,$('#lpw').value);if(err){$('#lerr').textContent=err;const c=$('#loginCard');c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake')}}

/* ---- phone shell ---- */
let _clock;
function phone(inner,dir){const m=S.me;const who=S.role==='admin'?'Admin preview':m.kind==='driver'?'Driver demo':'Customer demo';return `<div class="phone"><div class="screen" dir="${dir||'ltr'}"><div class="island"></div><div class="demo-bar"><span>${who}: ${esc(m.name.split(' ')[0])}</span><button onclick="${S.role==='admin'?"AD.go('home')":'demoSheet()'}">${S.role==='admin'?ic('left','s')+' Admin':ic('sparkle','s')+' Demo'}</button></div><div class="statusbar"><span id="clk">${hm(new Date())}</span><span class="sig"><svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor"/><rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor"/><rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor"/></svg><svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.2a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zM4.7 7.3a4.7 4.7 0 0 1 6.6 0M2 4.4a8.5 8.5 0 0 1 12 0" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg><svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="22" height="12" rx="3.5" stroke="currentColor" opacity=".4" fill="none"/><rect x="2" y="2" width="19" height="9" rx="2" fill="currentColor"/><path d="M24.5 4.5v4a2 2 0 0 0 0-4z" fill="currentColor" opacity=".4"/></svg></span></div>${inner}<div id="sheetHost"></div></div></div>`}
function sheet(html,opts){const host=$('#sheetHost')||document.body;const d=document.createElement('div');d.className=host.id==='sheetHost'?'dim':'modal';d.id='dim';d.innerHTML=`<div class="sheet" role="dialog" aria-modal="true">${host.id==='sheetHost'?'<div class="grab"></div>':''}${html}</div>`;
 d.onclick=e=>{if(e.target.id==='dim')closeSheet()};const old=$('#dim');if(old)old.remove();host.appendChild(d);const f=d.querySelector('input,textarea,select');if(f&&opts&&opts.focus)f.focus()}
function closeSheet(cb){const d=$('#dim');if(d)d.remove();if(typeof cb==='function')cb()}
function tabbar(items,cur,fn){return `<div class="tabbar">${items.map(t=>`<button class="${cur===t[0]?'on':''}" onclick="${fn}('${t[0]}')">${ic(t[1])}<span>${t[2]}</span></button>`).join('')}</div>`}
function demoPill(){return `<button class="demo-pill" onclick="demoSheet()">${ic('sparkle','s')} Demo</button>`}
function demoSheet(){const m=S.me;sheet(`<h2 class="title">Demo controls</h2><p class="sub mt4">Signed in as ${esc(m.name)} (${m.kind}).</p>
 <div class="card mt16 tight"><div class="li tap" onclick="toggleTheme();closeSheet()"><span class="ic tint-grey">${ic('moon')}</span><span class="grow b">Switch light / dark</span></div>
 <div class="li tap" onclick="closeSheet();resetDemo()"><span class="ic tint-grey">${ic('refresh')}</span><span class="grow b">Reset demo data</span><span class="sub">Fresh sample data</span></div>
 <div class="li tap" onclick="closeSheet();signOut()"><span class="ic tint-rose">${ic('logout')}</span><span class="grow b">Sign out</span><span class="sub">Try another account</span></div></div>
 <button class="btn g w mt8" onclick="closeSheet()">Close</button>`)}
function railView(){const m=S.me;return `<aside class="rail"><div class="brand mb16"><span class="mark">${ic('drop')}</span>${esc(D().settings.company)}</div>
 <div class="card"><div class="sm sb mute">Signed in</div><div class="row mt8"><span class="avatar ${m.kind==='driver'?'tint-mint':'tint-sky'}">${initials(m.name)}</span><div><b>${esc(m.name)}</b><div class="sub">${m.kind==='driver'?'Driver app':'Customer app'}</div></div></div>
 <p class="sub mt12">This is what ${m.kind==='driver'?'a driver':'a customer'} sees on their phone. Use it like a real app: tap, scroll, confirm.</p>
 <div class="row mt16 wrap"><button class="btn sm g" onclick="toggleTheme()">${ic('moon','s')} Theme</button><button class="btn sm g" onclick="resetDemo()">${ic('refresh','s')} Reset data</button><button class="btn sm g" onclick="signOut()">${ic('logout','s')} Sign out</button></div></div>
 <div class="card flat"><div class="h3">Tips for the demo</div><ul class="sub" style="margin:8px 0 0;padding-left:18px;line-height:1.6">${m.kind==='driver'?'<li>Start the next stop, add a photo and confirm. The customer app and admin update instantly.</li><li>Try “No response” to see the missed-delivery flow.</li><li>Undo is available for 30 minutes.</li>':'<li>Khalid’s delivery is on the way today; Noora’s was delivered this morning.</li><li>Top up to see the payment flow (no card is charged).</li><li>Report a problem, then answer it from the admin panel.</li>'}</ul></div></aside>`}

/* ---- root render ---- */
function render(){const root=$('#root');applyTheme();
 if(!S.me){root.innerHTML=loginView();document.documentElement.dir='ltr';return}
 document.documentElement.dir='ltr';
 if(S.role==='admin'){root.innerHTML=AD.view();MAPS.mountAll();return}
 const inner=S.role==='driver'?DR.view():CU.view();
 root.innerHTML=`<div class="stage">${railView()}${phone(inner,S.role==='customer'&&S.c.ar?'rtl':'ltr')}</div>${demoPill()}`;MAPS.mountAll();
 clearInterval(_clock);_clock=setInterval(()=>{const c=$('#clk');if(c)c.textContent=hm(new Date())},15000)}
