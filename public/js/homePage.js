import {drawStars} from "./visuals.js";
import {api} from "./apiClient.js";
const c=document.querySelector("#starfield");if(c)drawStars(c);
const health=await api("health");const status=document.querySelector("#backendStatus");if(status){status.textContent=health?.status==="ok"?`BACKEND ONLINE · SQLITE · ${health.stats.missions} MISSIONS`:`BACKEND OFFLINE · CHECK /api/health`;status.className="status "+(health?.status==="ok"?"good":"bad");}
const portals=document.querySelector("#portalStatus");
if(portals){const d=await api("isro-clearance");portals.innerHTML=(d?.portals||[]).map(p=>`<div class="portal"><b>${p.name}</b><span>${p.status}</span><small>${p.purpose}</small></div>`).join("");}
const tbody=document.querySelector("#missionRows");
async function load(){if(!tbody)return;const rows=await api("missions")||[];tbody.innerHTML=rows.map(m=>`<tr><td>${m.missionName||"Untitled"}</td><td>${m.origin||"—"} → ${m.target||"—"}</td><td>${m.mode||m.recommended_mode||"Demo"}</td><td><button class="btn tiny" data-load="${m.id}">LOAD</button> <button class="btn tiny danger" data-delete="${m.id}">DELETE</button></td></tr>`).join("");}
await load();
tbody?.addEventListener("click",async e=>{const id=e.target.dataset.load||e.target.dataset.delete;if(!id)return;const rows=await api("missions")||[];const m=rows.find(x=>x.id===id);if(e.target.dataset.load&&m){const {AtlasState}=await import("./stateSync.js");AtlasState.set(m);location.href="planner.html";}if(e.target.dataset.delete){await fetch("/api/missions",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});load();}});

// Bhuvan NRSC WMS integration: catalogue + map are fetched through our own backend.
const bhuvanStatus=document.querySelector("#bhuvanStatus");
const bhuvanSelect=document.querySelector("#bhuvanLayer");
const bhuvanImage=document.querySelector("#bhuvanMap");
const bhuvanMessage=document.querySelector("#bhuvanMapMessage");
async function loadBhuvanLayers(){
 if(!bhuvanSelect)return;
 try{
  const response=await fetch("/api/bhuvan?mode=layers",{cache:"no-store"});
  const data=await response.json();
  if(!response.ok)throw new Error(data.error||"Bhuvan catalogue request failed");
  bhuvanSelect.innerHTML=data.layers.map(x=>`<option value="${x.name}">${x.title} · ${x.name}</option>`).join("");
  bhuvanStatus.textContent=`CONNECTED · ${data.layers.length} LAYERS`;
  bhuvanStatus.className="status good";
  bhuvanMessage.textContent="Select a Bhuvan layer, then choose LOAD BHUVAN MAP.";
 }catch(error){
  bhuvanStatus.textContent="SERVICE UNAVAILABLE";
  bhuvanStatus.className="status bad";
  bhuvanSelect.innerHTML='<option value="">Bhuvan layer catalogue unavailable</option>';
  bhuvanMessage.textContent=error.message+" — check backend terminal/network access, then retry.";
 }
}
async function renderBhuvanMap(){
 if(!bhuvanSelect?.value)return;
 bhuvanMessage.textContent="Requesting selected layer from Bhuvan NRSC…";
 bhuvanImage.style.display="none";
 const url=`/api/bhuvan?mode=map&layer=${encodeURIComponent(bhuvanSelect.value)}&bbox=68,6,98,36`;
 try{
  const response=await fetch(url,{cache:"no-store"});
  if(!response.ok){const err=await response.json();throw new Error(err.error||err.details||"Map request failed");}
  const blob=await response.blob();
  const objectUrl=URL.createObjectURL(blob);
  const old=bhuvanImage.dataset.objectUrl;
  if(old)URL.revokeObjectURL(old);
  bhuvanImage.dataset.objectUrl=objectUrl;
  bhuvanImage.onload=()=>{bhuvanImage.style.display="block";bhuvanMessage.style.display="none";};
  bhuvanImage.onerror=()=>{bhuvanMessage.style.display="block";bhuvanMessage.textContent="Bhuvan returned an image that the browser could not display.";};
  bhuvanImage.src=objectUrl;
 }catch(error){bhuvanMessage.style.display="block";bhuvanMessage.textContent=error.message;}
}
document.querySelector("#loadBhuvan")?.addEventListener("click",renderBhuvanMap);
 document.querySelector("#retryBhuvan")?.addEventListener("click",async()=>{await loadBhuvanLayers();});
await loadBhuvanLayers();
