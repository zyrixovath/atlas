import {drawOrbit} from "./visuals.js";import {api} from "./apiClient.js";import {AtlasState} from "./stateSync.js";
const c=document.querySelector("#orrery");if(c){drawOrbit(c);setInterval(()=>drawOrbit(c),1000);}
const bodyList=document.querySelector("#bodyList");
const data=await api("ephemeris");
if(bodyList&&data){bodyList.innerHTML=data.bodies.map(b=>`<tr><td><button class="text-button" data-target="${b.name}">${b.name}</button></td><td>${b.longitudeDeg.toFixed(1)}°</td><td>${b.distanceAU} AU</td><td>${b.velocityKms} km/s</td></tr>`).join("");}
bodyList?.addEventListener("click",e=>{const target=e.target.dataset.target;if(target){AtlasState.set({target});location.href="planner.html";}});
document.querySelector("#syncNow")?.addEventListener("click",()=>location.reload());
