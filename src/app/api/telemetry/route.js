import { NextResponse } from 'next/server';
import { createHash,randomUUID } from 'node:crypto';
import { database } from '../../../lib/db.js';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(){try{return NextResponse.json(await database(({db,rows})=>rows(db,'SELECT * FROM telemetry_logs ORDER BY timestamp_utc DESC LIMIT 100')));}catch(e){return NextResponse.json({error:e.message},{status:500});}}
export async function POST(req){try{const payload=await req.json(),timestamp=new Date().toISOString(),hash=createHash('sha256').update(JSON.stringify(payload)).digest('hex'),id=randomUUID();await database(({db})=>db.run('INSERT INTO telemetry_logs (id,timestamp_utc,packet_type,source_portal,payload_summary,sha256_hash) VALUES (?,?,?,?,?,?)',[id,timestamp,String(payload.type||'MISSION_STATUS'),String(payload.source||'LOCAL_DEMO'),JSON.stringify(payload).slice(0,4000),hash]),{write:true});return NextResponse.json({id,timestamp,algorithm:'SHA-256',hash,stored:true,note:'Hash only; not encryption, digital signature, or authenticated uplink.'});}catch(e){return NextResponse.json({error:e.message},{status:500});}}
