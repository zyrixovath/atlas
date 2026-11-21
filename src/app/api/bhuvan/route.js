import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ENDPOINTS = [
  "https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms",
  "https://bhuvan-vec1.nrsc.gov.in/bhuvan/wms",
  "https://bhuvan-vec3.nrsc.gov.in/bhuvan/wms",
  "https://bhuvan-gp1.nrsc.gov.in/bhuvan/wms"
];
const cache = { layers: null, endpoint: null, checkedAt: 0 };
const json = (body, status=200) => NextResponse.json(body, { status });

async function requestAt(endpoint, params) {
  const url = new URL(endpoint);
  for (const [k,v] of Object.entries(params)) url.searchParams.set(k, String(v));
  const response = await fetch(url, {
    headers: {
      "User-Agent": "ATLAS-S34-Educational-Prototype/1.0",
      "Accept": "application/xml,image/png,*/*"
    },
    signal: AbortSignal.timeout(10000),
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response;
}

function parseLayers(xml) {
  // Extract each named Layer's direct Name and Title, without accidentally
  // treating nested child layers as the parent layer.
  const layers = [];
  const re = /<Layer\b[^>]*>\s*<Name>\s*([^<]+)\s*<\/Name>\s*<Title>\s*([^<]+)\s*<\/Title>/gi;
  let m;
  while ((m = re.exec(xml))) {
    const name = m[1].trim();
    const title = m[2].trim();
    if (name && title) layers.push({ name, title });
  }
  return [...new Map(layers.map(x => [x.name, x])).values()];
}

async function discover() {
  if (cache.layers && Date.now() - cache.checkedAt < 5*60*1000) {
    return { layers: cache.layers, endpoint: cache.endpoint, cached: true };
  }
  const failures = [];
  for (const endpoint of ENDPOINTS) {
    try {
      const response = await requestAt(endpoint, {
        SERVICE:"WMS", VERSION:"1.1.1", REQUEST:"GetCapabilities"
      });
      const xml = await response.text();
      if (!xml.includes("WMS_Capabilities") && !xml.includes("WMT_MS_Capabilities")) {
        throw new Error("Unexpected response; not a WMS capabilities document");
      }
      const layers = parseLayers(xml);
      if (!layers.length) throw new Error("WMS responded but no named layers could be parsed");
      cache.layers = layers;
      cache.endpoint = endpoint;
      cache.checkedAt = Date.now();
      return { layers, endpoint, cached: false };
    } catch (error) {
      failures.push({ endpoint, error: error.name === "TimeoutError" ? "Timed out after 10 seconds" : error.message });
    }
  }
  const error = new Error("All configured Bhuvan WMS endpoints failed from this server.");
  error.failures = failures;
  throw error;
}

export async function GET(req) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("mode") || "layers";
  try {
    const found = await discover();
    if (mode === "health") {
      return json({
        provider:"Bhuvan / NRSC",
        status:"connected",
        service:"OGC WMS 1.1.1",
        endpoint:found.endpoint,
        layerCount:found.layers.length,
        cached:found.cached,
        checkedAt:new Date().toISOString(),
        attribution:"Bhuvan, National Remote Sensing Centre (NRSC), ISRO"
      });
    }
    if (mode === "layers") {
      return json({
        provider:"Bhuvan / NRSC",
        service:"OGC WMS 1.1.1",
        endpoint:found.endpoint,
        layers:found.layers
      });
    }
    if (mode === "map") {
      const layer = url.searchParams.get("layer");
      if (!layer) return json({error:"Choose a layer returned by /api/bhuvan?mode=layers."},400);
      if (!found.layers.some(x => x.name === layer)) {
        return json({error:"Requested layer is not in the current Bhuvan capabilities document."},400);
      }
      const bbox = url.searchParams.get("bbox") || "68,6,98,36";
      const parts = bbox.split(",").map(Number);
      if (parts.length !== 4 || parts.some(n => !Number.isFinite(n)) ||
          parts[0] < -180 || parts[2] > 180 || parts[1] < -90 || parts[3] > 90 ||
          parts[0] >= parts[2] || parts[1] >= parts[3]) {
        return json({error:"Invalid map bounding box."},400);
      }
      const response = await requestAt(found.endpoint, {
        SERVICE:"WMS", VERSION:"1.1.1", REQUEST:"GetMap",
        LAYERS:layer, STYLES:"", SRS:"EPSG:4326", BBOX:parts.join(","),
        WIDTH:1000, HEIGHT:650, FORMAT:"image/png", TRANSPARENT:"true"
      });
      const type = response.headers.get("content-type") || "";
      if (!type.includes("image")) {
        return json({error:"Bhuvan did not return an image.",details:(await response.text()).slice(0,700)},502);
      }
      return new NextResponse(await response.arrayBuffer(), {
        headers:{
          "Content-Type":type,
          "Cache-Control":"public, max-age=300",
          "X-ATLAS-Data-Source":"Bhuvan NRSC WMS",
          "X-ATLAS-WMS-Endpoint":found.endpoint
        }
      });
    }
    return json({error:"Unsupported mode. Use health, layers, or map."},400);
  } catch (error) {
    return json({
      provider:"Bhuvan / NRSC",
      status:"unavailable",
      error:error.message,
      failures:error.failures || [],
      checkedAt:new Date().toISOString(),
      note:"If every official endpoint fails, this computer/network may not be able to reach NRSC right now. The backend will not substitute fabricated portal data."
    },502);
  }
}
