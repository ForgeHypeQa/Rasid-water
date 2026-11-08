/* ============ Live map (Leaflet) + driver position simulation ============ */
const DEPOT={lat:25.2062,lng:51.4705,name:'Rasid depot, Industrial Area'};
const KM=(a,b)=>{const R=6371,dLa=(b[0]-a[0])*Math.PI/180,dLo=(b[1]-a[1])*Math.PI/180,x=Math.sin(dLa/2)**2+Math.cos(a[0]*Math.PI/180)*Math.cos(b[0]*Math.PI/180)*Math.sin(dLo/2)**2;return 2*R*Math.asin(Math.sqrt(x))};
const pathLen=p=>{let l=0;for(let i=1;i<p.length;i++)l+=KM(p[i-1],p[i]);return l};
function along(p,frac){const total=pathLen(p);if(!total)return {pt:p[0],heading:0};let d=frac*total;for(let i=1;i<p.length;i++){const seg=KM(p[i-1],p[i]);if(d<=seg||i===p.length-1){const t=seg?clamp(d/seg,0,1):1;const pt=[p[i-1][0]+(p[i][0]-p[i-1][0])*t,p[i-1][1]+(p[i][1]-p[i-1][1])*t];const h=Math.atan2(p[i][1]-p[i-1][1],p[i][0]-p[i-1][0])*180/Math.PI;return {pt,heading:h}}d-=seg}return {pt:p[p.length-1],heading:0}}
function curve(a,b){const n=14,out=[];const mx=(a[0]+b[0])/2+(b[1]-a[1])*.12,my=(a[1]+b[1])/2-(b[0]-a[0])*.12;for(let i=0;i<=n;i++){const t=i/n;out.push([(1-t)*(1-t)*a[0]+2*(1-t)*t*mx+t*t*b[0],(1-t)*(1-t)*a[1]+2*(1-t)*t*my+t*t*b[1]])}return out}

/* ---- road geometry via OSRM (works when hosted; falls back to curves in restricted previews) ---- */
const ROADS={cache:{},pending:{},
 key:pts=>pts.map(p=>p[0].toFixed(4)+','+p[1].toFixed(4)).join('|'),
 get(pts){if(pts.length<2)return pts;const k=ROADS.key(pts);if(ROADS.cache[k])return ROADS.cache[k];
  if(!ROADS.pending[k]&&ROADS.enabled!==false){ROADS.pending[k]=true;const coords=pts.map(p=>p[1]+','+p[0]).join(';');
   const ctl=new AbortController();setTimeout(()=>ctl.abort(),6000);
   fetch('https://router.project-osrm.org/route/v1/driving/'+coords+'?overview=full&geometries=geojson&steps=false',{signal:ctl.signal}).then(r=>r.json()).then(j=>{if(j&&j.routes&&j.routes[0]){ROADS.cache[k]=j.routes[0].geometry.coordinates.map(c=>[c[1],c[0]]);MAPS.redraw()}}).catch(()=>{ROADS.fail=(ROADS.fail||0)+1;if(ROADS.fail>=3)ROADS.enabled=false}).finally(()=>{delete ROADS.pending[k]})}
  let out=[];for(let i=1;i<pts.length;i++){const c=curve(pts[i-1],pts[i]);out=out.concat(i===1?c:c.slice(1))}return out}};

/* ---- simulated / real driver position ---- */
const SIM={legs:{},gps:null,
 route(r){const st=[...r.stops].sort((a,b)=>a.seq-b.seq),pend=st.filter(s=>s.status==='pending'),done=st.filter(s=>s.status!=='pending').sort((a,b)=>new Date(a.completed_at)-new Date(b.completed_at));
  const last=done[done.length-1],fromC=last?cust(last.cid):null,from=fromC?[fromC.lat,fromC.lng]:[DEPOT.lat,DEPOT.lng];
  const nx=pend[0];const ahead=pend.map(s=>{const c=cust(s.cid);return [c.lat,c.lng]});
  const path=ahead.length?ROADS.get([from,...ahead]):[from];
  const donePath=done.length?ROADS.get([[DEPOT.lat,DEPOT.lng],...done.map(s=>{const c=cust(s.cid);return [c.lat,c.lng]})]):[];
  let pos={lat:from[0],lng:from[1],heading:0,remainingKm:0,etaMin:0,next:nx,arrived:!nx};
  if(nx){const nxC=cust(nx.cid),leg=ROADS.get([from,[nxC.lat,nxC.lng]]),len=pathLen(leg),key=r.id+':'+nx.id;
   if(SIM.gps&&S.role==='driver'&&r.driver===S.me.id){pos.lat=SIM.gps[0];pos.lng=SIM.gps[1];pos.remainingKm=KM(SIM.gps,[nxC.lat,nxC.lng]);pos.etaMin=Math.max(1,Math.round(pos.remainingKm/30*60));pos.real=true}
   else{const L0=SIM.legs[key]||(SIM.legs[key]={t0:Date.now()});const dur=clamp(len/30*3600*1000,45000,110000);const raw=Math.min(.95,(Date.now()-L0.t0)/dur),p=raw<.95?1-Math.pow(1-raw,1.6):.95;const a=along(leg,p);pos.lat=a.pt[0];pos.lng=a.pt[1];pos.heading=a.heading;pos.remainingKm=(1-p)*len;pos.etaMin=Math.max(1,Math.round(pos.remainingKm/30*60))}}
  return {pos,path,donePath,stops:st,next:nx,from}},
 startGps(){if(!navigator.geolocation)return toast('Location is not available on this device');if(SIM.watch)return;SIM.watch=navigator.geolocation.watchPosition(p=>{SIM.gps=[p.coords.latitude,p.coords.longitude];MAPS.tick()},()=>{toast('Could not get your location. Showing the simulated position.');SIM.stopGps()},{enableHighAccuracy:true,maximumAge:5000,timeout:10000});S.d.gpsOn=true;render()},
 stopGps(){if(SIM.watch){navigator.geolocation.clearWatch(SIM.watch);SIM.watch=null}SIM.gps=null;S.d.gpsOn=false;render()}};

/* ---- map instances ---- */
const MAPS={inst:[],
 ok(){return typeof L!=='undefined'},
 dark(){return document.documentElement.dataset.theme==='dark'},
 icon(cls,html,size){return L.divIcon({className:'',html:`<div class="${cls}">${html}</div>`,iconSize:[size,size],iconAnchor:[size/2,size/2]})},
 stopIcon(s,isNext){const st=s.status;const cls='mk '+(st==='delivered'?'d':st==='missed'?'m':isNext?'n':'p');const html=st==='delivered'?ic('check','s'):st==='missed'?'!':s.seq;return MAPS.icon(cls,html,isNext?34:28)},
 driverIcon(label,heading){return L.divIcon({className:'',html:`<div class="drv"><span class="halo"></span><svg class="i" viewBox="0 0 24 24" style="transform:rotate(${(heading||0)-45}deg)"><path d="${P.nav}"/></svg>${label?`<span class="lbl">${esc(label)}</span>`:''}</div>`,iconSize:[38,38],iconAnchor:[19,19]})},
 homeIcon(){return L.divIcon({className:'',html:`<div class="homepin">${ic('home','s')}</div>`,iconSize:[32,40],iconAnchor:[16,38]})},
 base(el){const map=L.map(el,{zoomControl:false,attributionControl:true,scrollWheelZoom:false,tap:true});map.attributionControl.setPrefix('');
  const t=L.tileLayer('https://{s}.basemaps.cartocdn.com/'+(MAPS.dark()?'dark_all':'light_all')+'/{z}/{x}/{y}{r}.png',{subdomains:'abcd',maxZoom:19,attribution:'© OpenStreetMap © CARTO'}).addTo(map);
  let okd=false,err=0;t.on('tileload',()=>{okd=true});t.on('tileerror',()=>{err++;if(!okd&&err>=2&&!el._noted){el._noted=true;const n=document.createElement('div');n.className='mapnote';n.textContent='Map tiles are blocked in this preview. On the hosted site this is the live Doha map.';el.appendChild(n)}});
  return map},
 mountAll(){MAPS.inst.forEach(i=>{try{i.map.remove()}catch(e){}});MAPS.inst=[];if(!MAPS.ok())return;$$('.lmap').forEach(el=>{try{MAPS.mount(el)}catch(e){console.error(e)}});if(!MAPS.timer)MAPS.timer=setInterval(MAPS.tick,1000)},
 mount(el){const kind=el.dataset.kind;const map=MAPS.base(el);const inst={el,map,kind,layers:L.layerGroup().addTo(map),drivers:{},rid:el.dataset.route,cid:el.dataset.cid,did:el.dataset.driver};MAPS.inst.push(inst);MAPS.draw(inst,true);
  const rc=document.createElement('button');rc.className='maprc';rc.setAttribute('aria-label','Recenter');rc.innerHTML=ic('nav','s');rc.onclick=e=>{e.stopPropagation();MAPS.fit(inst)};el.appendChild(rc);map.on('dragstart',()=>{inst.userMoved=true})},
 redraw(){MAPS.inst.forEach(i=>MAPS.draw(i,false))},
 routesFor(inst){const today=D().routes.filter(r=>r.date===TODAY_S);if(inst.kind==='driver')return today.filter(r=>r.driver===inst.did);if(inst.kind==='customer'){const ts=todayStop(inst.cid);return ts?[ts.route]:[]}return today},
 draw(inst,first){inst.layers.clearLayers();inst.drivers={};const bounds=[];const acc=getComputedStyle(document.documentElement).getPropertyValue('--acc').trim()||'#FF5A00';
  const routes=MAPS.routesFor(inst);
  routes.forEach((r,ri)=>{const sim=SIM.route(r);const col=inst.kind==='admin'?(ri===0?acc:'#1C55D6'):acc;
   if(sim.donePath.length>1)L.polyline(sim.donePath,{color:MAPS.dark()?'#777':'#9aa0a8',weight:4,opacity:.7,dashArray:'2 8',lineCap:'round'}).addTo(inst.layers);
   if(sim.path.length>1){L.polyline(sim.path,{color:'#fff',weight:9,opacity:.9,lineCap:'round',lineJoin:'round'}).addTo(inst.layers);L.polyline(sim.path,{color:inst.kind==='admin'?col:(MAPS.dark()?'#f3f4f6':'#111318'),weight:4,opacity:.95,lineCap:'round',lineJoin:'round'}).addTo(inst.layers)}
   const customerStop=inst.kind==='customer'?sim.stops.find(s=>s.cid===inst.cid):null;
   sim.stops.forEach(s=>{const c=cust(s.cid);const ll=[c.lat,c.lng];if(inst.kind==='customer'){if(s.cid!==inst.cid)return;L.marker(ll,{icon:MAPS.homeIcon(),zIndexOffset:500}).addTo(inst.layers);bounds.push(ll);return}
    const isNext=sim.next&&sim.next.id===s.id;const m=L.marker(ll,{icon:MAPS.stopIcon(s,isNext),zIndexOffset:isNext?400:s.status==='pending'?200:100}).addTo(inst.layers);
    m.bindTooltip(`<b>${s.seq}. ${esc(c.name)}</b><br>${esc(c.building)}<br>${s.status==='pending'?c.ws+' – '+c.we+', ×'+s.planned:s.status==='delivered'?'Delivered '+hm(s.completed_at):'Missed, '+esc(s.miss_reason)}`,{direction:'top',offset:[0,-16],className:'maptip'});
    if(inst.kind==='driver'&&s.status==='pending')m.on('click',()=>DR.start(s.id));if(inst.kind==='driver'&&s.status!=='pending')m.on('click',()=>DR.detail(s.id));if(inst.kind==='admin')m.on('click',()=>AD.cdet(s.cid));
    bounds.push(ll)});
   const dr=drv(r.driver);const label=inst.kind==='driver'?'You':dr.name.split(' ')[0];const dm=L.marker([sim.pos.lat,sim.pos.lng],{icon:MAPS.driverIcon(label,sim.pos.heading),zIndexOffset:1000}).addTo(inst.layers);inst.drivers[r.id]=dm;bounds.push([sim.pos.lat,sim.pos.lng]);
   if(inst.kind==='admin')dm.bindTooltip(`<b>${esc(dr.name)}</b><br>${sim.next?'Heading to '+esc(cust(sim.next.cid).name)+', '+sim.pos.etaMin+' min':'Route complete'}`,{direction:'top',offset:[0,-20],className:'maptip'});
   if(customerStop&&inst.kind==='customer'){bounds.push([sim.pos.lat,sim.pos.lng])}});
  if(inst.kind==='admin'||inst.kind==='driver')L.marker([DEPOT.lat,DEPOT.lng],{icon:MAPS.icon('mk depot',ic('box','s'),26),zIndexOffset:50}).addTo(inst.layers).bindTooltip(DEPOT.name,{direction:'top',offset:[0,-14],className:'maptip'});
  inst.bounds=bounds;if(first||!inst.userMoved)MAPS.fit(inst);MAPS.chips(inst)},
 fit(inst){if(!inst.bounds||!inst.bounds.length)return;inst.userMoved=false;inst.map.fitBounds(L.latLngBounds(inst.bounds),{padding:[34,34],maxZoom:15,animate:false})},
 chips(inst){const routes=MAPS.routesFor(inst);const chip=inst.el.parentElement&&inst.el.parentElement.querySelector('.mapchip');if(!chip)return;
  if(inst.kind==='customer'){const r=routes[0];if(!r)return;const sim=SIM.route(r);const ts=todayStop(inst.cid);const before=sim.stops.filter(s=>s.status==='pending'&&s.seq<ts.seq).length;const c=cust(inst.cid);const km=KM([sim.pos.lat,sim.pos.lng],[c.lat,c.lng]);const eta=Math.max(1,Math.round(km/30*60))+before*6;
   chip.innerHTML=`<b>${before===0?'About '+eta+' min away':before+' stop'+(before>1?'s':'')+' before you, about '+eta+' min'}</b><span>${km.toFixed(1)} km${sim.pos.real?', live GPS':''}</span>`;return}
  if(inst.kind==='driver'){const r=routes[0];if(!r)return;const sim=SIM.route(r);if(!sim.next){chip.innerHTML='<b>Route complete</b><span>Head back to the depot</span>';return}
   chip.innerHTML=`<b>Next: ${esc(cust(sim.next.cid).name.split(' ')[0])}, ${sim.pos.remainingKm.toFixed(1)} km</b><span>About ${sim.pos.etaMin} min${sim.pos.real?', live GPS':', simulated for demo'}</span>`}},
 tick(){MAPS.inst.forEach(inst=>{if(!document.body.contains(inst.el))return;const routes=MAPS.routesFor(inst);routes.forEach(r=>{const m=inst.drivers[r.id];if(!m)return;const sim=SIM.route(r);m.setLatLng([sim.pos.lat,sim.pos.lng]);const svg=m.getElement()&&m.getElement().querySelector('svg');if(svg)svg.style.transform='rotate('+((sim.pos.heading||0)-45)+'deg)'});MAPS.chips(inst)})}};
