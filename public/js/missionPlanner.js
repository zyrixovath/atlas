import {AtlasState} from "./stateSync.js";import {post} from "./apiClient.js";
const s=AtlasState.get();
const $=id=>document.getElementById(id);
["origin","target","mode","payloadKg","isp","stages"].forEach(k=>{if($(k))$(k).value=s[k]??"";});
function sync(){AtlasState.set({origin:$("origin").value,target:$("target").value,mode:$("mode").value,payloadKg:+$("payloadKg").value,isp:+$("isp").value,stages:+$("stages").value});}
async function calculate(){sync();const state=AtlasState.get();const result=await post("trajectory",{origin:state.origin,target:state.target});if(!result)return;AtlasState.set({deltaV:result.deltaV_kms,tof:result.tof_days});$("recommendation").innerHTML=`<b>${result.mode}</b><span>${result.deltaV_kms} km/s · ${result.tof_days} days</span><small>${result.note}</small>`;$("dv").textContent=result.deltaV_kms;$("tof").textContent=result.tof_days;$("phase").textContent="Illustrative";await propulsion();}
async function propulsion(){const st=AtlasState.get();const r=await post("propulsion",{payloadKg:st.payloadKg,deltaV:st.deltaV,isp:st.isp,stages:st.stages});if(r){$("propMass").textContent=(r.propellantKg/1000).toFixed(2)+" t";$("liftMass").textContent=(r.liftoffMassKg/1000).toFixed(2)+" t";$("ve").textContent=r.exhaustVelocityMs+" m/s";$("propWarning").textContent=r.warning;}}
["origin","target","mode","payloadKg","isp","stages"].forEach(k=>$(k)?.addEventListener("change",calculate));
$("calculate")?.addEventListener("click",calculate);await calculate();
