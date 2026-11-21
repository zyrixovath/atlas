import { ok } from "../_util.js";
const data = [
 ["Mercury",.387,47.36,87.97],["Venus",.723,35.02,224.7],["Earth",1,29.78,365.25],
 ["Mars",1.524,24.07,686.98],["Jupiter",5.203,13.07,4332.6],["Saturn",9.537,9.69,10759.2],
 ["Uranus",19.19,6.81,30688.5],["Neptune",30.07,5.43,60182],["Moon",.00257,1.02,27.32],
 ["Ceres",2.77,17.9,1680],["Pluto",39.48,4.74,90560]
];
export async function GET() {
 const bodies=data.map(([name,distanceAU,velocityKms,periodDays],i)=>({name,distanceAU,velocityKms,periodDays,longitudeDeg:(i*37.7+12)%360}));
 return ok({timestamp:new Date().toISOString(),accuracy:"Illustrative orbital reference model",bodies});
}
