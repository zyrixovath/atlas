import {AtlasState} from "./stateSync.js";import {post,api} from "./apiClient.js";
const $=id=>document.getElementById(id),tof=AtlasState.get().tof||259;
function dose(){const x=+$("shield").value;const d0=1.8*tof;const d=d0*Math.exp(-.032*x);$("shieldVal").textContent=x+" cm";$("dose").textContent=d.toFixed(1)+" mSv (illustrative)";$("risk").textContent=d<300?"LOWER MODELLED BAND":d<=600?"ELEVATED MODELLED BAND":"ABOVE MODELLED THRESHOLD";$("risk").className="status "+(d<300?"good":d<=600?"warn":"bad");}
$("shield")?.addEventListener("input",dose);dose();
async function log(){const payload={type:"ATLAS_STATUS",mission:AtlasState.get(),radiationModel:$("dose").textContent,source:"local simulation"};const r=await post("telemetry",payload);if(r){$("hash").textContent=r.hash;$("terminal").textContent=`[${r.timestamp}] SHA-256 packet generated\n${JSON.stringify(payload,null,2)}\nHASH ${r.hash}\nSQLite stored: ${r.stored?"YES":"NO"}\n`+$("terminal").textContent;}}
$("signPacket")?.addEventListener("click",log);

const previous=await api("telemetry");if(Array.isArray(previous)&&previous.length){$("terminal").textContent=previous.slice(0,8).map(x=>`[${x.timestamp_utc}] ${x.packet_type} ${x.sha256_hash}`).join("\n")+"\n"+$("terminal").textContent;}
