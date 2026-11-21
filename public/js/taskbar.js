import {AtlasState} from "./stateSync.js";
const links=[["HOME","index.html"],["01 LIVE SOLAR SYSTEM","solar.html"],["02 MISSION PLANNER","planner.html"],["03 SURFACE MAPS","surface.html"],["04 TELEMETRY & BIO-RAD","telemetry.html"]];
const active=location.pathname.split("/").pop()||"index.html";
const nav=document.createElement("header");nav.className="topbar";
nav.innerHTML=`<a class="brand" href="index.html"><span class="orbit-mark">◎</span><span>ATLAS<small>TEAM NEBULLA KNIGHTS · S34 · ASTRA 2026</small></span></a><nav>${links.map(([n,u])=>`<a class="${active===u?"active":""}" href="${u}">${n}</a>`).join("")}</nav><div class="top-actions"><span id="utcClock" class="mono"></span><button class="btn tiny" id="saveMission">SAVE</button><button class="btn tiny ghost" id="loadMission">LOAD</button></div>`;
document.body.prepend(nav);
function tick(){const el=document.getElementById("utcClock");if(el)el.textContent=new Date().toISOString().replace("T"," ").slice(0,19)+" UTC";}
tick();setInterval(tick,1000);
document.getElementById("saveMission").onclick=async()=>{const s=AtlasState.get();const missionName=prompt("Mission name:",`${s.origin} → ${s.target}`);if(!missionName)return;const r=await fetch("/api/missions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...s,missionName})});alert(r.ok?"Mission saved.":"Save failed.");};
document.getElementById("loadMission").onclick=async()=>{const r=await fetch("/api/missions"),items=await r.json();const names=items.map((x,i)=>`${i+1}. ${x.missionName||"Untitled"}`).join("\n");const n=Number(prompt("Choose mission number:\n"+names));if(n>0&&items[n-1]){AtlasState.set(items[n-1]);alert("Mission loaded across ATLAS pages.");}};
