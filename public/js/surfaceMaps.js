import {AtlasState} from "./stateSync.js";import {api,post} from "./apiClient.js";
const canvas=document.querySelector("#terrain"),ctx=canvas?.getContext("2d");let body=AtlasState.get().body||"Moon",seed=42,start=[7,8],goal=[70,68],path=[];
function paint(){if(!ctx)return;const w=canvas.width=canvas.clientWidth*devicePixelRatio,h=canvas.height=canvas.clientHeight*devicePixelRatio,cell=w/80;ctx.clearRect(0,0,w,h);for(let y=0;y<80;y++)for(let x=0;x<80;x++){let v=Math.sin((x+seed)*.18)*Math.cos((y-seed)*.14);ctx.fillStyle=v>.45?"#a43c43":v>.12?"#b88a36":"#247d69";ctx.globalAlpha=.75;ctx.fillRect(x*cell,y*cell,cell+1,cell+1);}ctx.globalAlpha=1;if(path.length){ctx.strokeStyle="#6be6ff";ctx.lineWidth=3*devicePixelRatio;ctx.beginPath();path.forEach(([x,y],i)=>i?ctx.lineTo((x+.5)*cell,(y+.5)*cell):ctx.moveTo((x+.5)*cell,(y+.5)*cell));ctx.stroke();}[[start,"#38bdf8"],[goal,"#f59e0b"]].forEach(([[x,y],c])=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc((x+.5)*cell,(y+.5)*cell,6*devicePixelRatio,0,7);ctx.fill();});}
async function route(){
 const r=await post("surface",{start,goal,seed});
 path=r?.waypoints||[];
 paint();
 const status=document.querySelector("#routeStatus");
 const count=document.querySelector("#waypoints");
 if(count)count.textContent=String(path.length);
 if(path.length>1){
  const saved=await post("rover-paths",{body,seed,start,goal,waypoints:path,distance:r?.distanceUnits||0});
  status.textContent=`${path.length} waypoints · ${r?.status||"A* route"} · ${saved?.stored?"SAVED TO SQLITE":"DATABASE SAVE FAILED"}`;
 }else status.textContent=r?.status||"API unavailable";
}
document.querySelectorAll("[data-body]").forEach(b=>b.addEventListener("click",()=>{body=b.dataset.body;AtlasState.set({body});document.querySelector("#surfaceTitle").textContent=body+" SURFACE";seed=Math.floor(Math.random()*9999);path=[];paint();}));
document.querySelector("#newSeed")?.addEventListener("click",()=>{seed=Math.floor(Math.random()*9999);path=[];paint();});
canvas?.addEventListener("click",e=>{const r=canvas.getBoundingClientRect(),x=Math.round((e.clientX-r.left)/r.width*79),y=Math.round((e.clientY-r.top)/r.height*79);if(!window._picked){start=[x,y];window._picked=true;}else{goal=[x,y];window._picked=false;}paint();});
document.querySelector("#findRoute")?.addEventListener("click",route);paint();route();
