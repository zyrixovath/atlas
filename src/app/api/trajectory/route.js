import { ok } from "../_util.js";
const AU={Mercury:.387,Venus:.723,Earth:1,Mars:1.524,Jupiter:5.203,Saturn:9.537,Uranus:19.19,Neptune:30.07,Moon:.00257,Ceres:2.77,Pluto:39.48};
export async function POST(req){
 const {origin="Earth",target="Mars"}=await req.json();
 const a=AU[origin]??1,b=AU[target]??1.524;
 return ok({origin,target,mode:"Direct transfer (illustrative)",deltaV_kms:+(2+Math.abs(b-a)*1.15).toFixed(2),
 tof_days:+(259*Math.pow((a+b)/2,1.5)).toFixed(1),
 launchWindow:"Planning estimate only",note:"Not a precision trajectory, ephemeris, or launch-window prediction."});
}
