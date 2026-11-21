const KEY="atlas-mission-state-v1";
const defaults={origin:"Earth",target:"Mars",mode:"Auto-recommend",launchDate:"",deltaV:5.5,tof:259,payloadKg:1000,isp:310,stages:2,shieldCm:10,body:"Moon"};
export const AtlasState={
 get(){try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return {...defaults}}},
 set(patch){const next={...this.get(),...patch};localStorage.setItem(KEY,JSON.stringify(next));window.dispatchEvent(new CustomEvent("atlas:state",{detail:next}));return next},
 subscribe(fn){window.addEventListener("atlas:state",e=>fn(e.detail));}
};
