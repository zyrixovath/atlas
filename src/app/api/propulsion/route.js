import { ok } from "../_util.js";
export async function POST(req){
 const {payloadKg=1000,deltaV=5.5,isp=310,stages=2}=await req.json();
 const ve=isp*9.80665, ratio=Math.exp(Math.min((deltaV*1000)/(Math.max(1,stages)*ve),8));
 const prop=payloadKg*(ratio-1);
 return ok({payloadKg,deltaV,isp,stages,exhaustVelocityMs:+ve.toFixed(1),
 propellantKg:+prop.toFixed(1),liftoffMassKg:+(payloadKg+prop).toFixed(1),
 warning:"Educational mass-ratio illustration only; not suitable for real propulsion or launch-system design."});
}
