export async function api(path, options={}) {
 try {
  const r=await fetch(`/api/${path}`,{headers:{"Content-Type":"application/json"},...options});
  if(!r.ok) throw new Error(`API ${r.status}`);
  return await r.json();
 } catch(e) { console.warn("ATLAS API fallback:",e); return null; }
}
export const post=(path,body)=>api(path,{method:"POST",body:JSON.stringify(body)});
