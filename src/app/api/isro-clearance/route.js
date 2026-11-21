import { NextResponse } from "next/server";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(){
 let bhuvan={name:"Bhuvan",purpose:"NRSC OGC WMS geospatial layers",status:"Checking service…"};
 try{
  const r=await fetch(new URL("https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms?service=WMS&version=1.1.1&request=GetCapabilities"),{signal:AbortSignal.timeout(12000),cache:"no-store"});
  if(!r.ok)throw new Error(`HTTP ${r.status}`);
  const xml=await r.text();
  if(!xml.includes("WMS_Capabilities")&&!xml.includes("WMT_MS_Capabilities"))throw new Error("Unexpected WMS response");
  bhuvan.status="CONNECTED · WMS capabilities received";
 }catch(e){bhuvan.status=`UNAVAILABLE · ${e.message}`;}
 return NextResponse.json({site:"SDSC SHAR Sriharikota",status:bhuvan.status.startsWith("CONNECTED")?"BHUVAN CONNECTED":"PARTIAL / OTHER PORTALS NOT CONNECTED",
 portals:[bhuvan,
 {name:"Bhoonidhi",purpose:"Satellite data catalogue / STAC API",status:"Access may require user enablement from NRSC"},
 {name:"MOSDAC",purpose:"Meteorological and satellite data",status:"No authenticated API connection configured"},
 {name:"VEDAS",purpose:"Thematic geospatial applications",status:"No service endpoint configured"}],
 disclaimer:"Bhuvan is checked through its published OGC WMS GetCapabilities service. Other portals are not represented as connected. This is not an ISRO launch-clearance or weather-readiness feed."});
}
