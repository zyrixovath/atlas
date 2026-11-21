import initSqlJs from 'sql.js';
import fs from 'node:fs/promises';
import path from 'node:path';
const DB_PATH=path.join(process.cwd(),'data','atlas_mission.db');
let initPromise;
let queue=Promise.resolve();
async function init(){
 const SQL=await initSqlJs();
 await fs.mkdir(path.dirname(DB_PATH),{recursive:true});
 let db;
 try { db=new SQL.Database(new Uint8Array(await fs.readFile(DB_PATH))); }
 catch(e) { if(e.code!=='ENOENT') throw e; db=new SQL.Database(); }
 db.run(`CREATE TABLE IF NOT EXISTS missions (id TEXT PRIMARY KEY, mission_name TEXT NOT NULL, origin TEXT, target TEXT, flyby TEXT, recommended_mode TEXT, launch_date_utc TEXT, total_dv REAL, tof_days REAL, payload_kg REAL, engine_type TEXT, stages INTEGER, surface_body TEXT, created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS rover_paths (id TEXT PRIMARY KEY, mission_id TEXT, body TEXT, seed INTEGER, start_coord TEXT, goal_coord TEXT, distance_m REAL, max_slope_deg REAL, battery_used_pct REAL, waypoints_json TEXT, created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS telemetry_logs (id TEXT PRIMARY KEY, timestamp_utc TEXT NOT NULL, packet_type TEXT, source_portal TEXT, payload_summary TEXT, sha256_hash TEXT NOT NULL);`);
 const n=db.exec('SELECT COUNT(*) AS n FROM missions')[0]?.values?.[0]?.[0]??0;
 if(!n){const stmt=db.prepare('INSERT INTO missions (id,mission_name,origin,target,recommended_mode,created_at) VALUES (?,?,?,?,?,?)');
 for(const row of [['seed-lunar','Chandrayaan-X Lunar South Pole','Earth','Moon','Demonstration transfer',new Date().toISOString()],['seed-mars','Mangalyaan-II Jezero Traverse','Earth','Mars','Demonstration transfer',new Date().toISOString()]])stmt.run(row);
 stmt.free();}
 await save(db);return db;
}
async function save(db){const tmp=DB_PATH+'.tmp';await fs.writeFile(tmp,Buffer.from(db.export()));await fs.rename(tmp,DB_PATH);}
function rows(db,sql,params=[]){const stmt=db.prepare(sql);stmt.bind(params);const out=[];while(stmt.step())out.push(stmt.getAsObject());stmt.free();return out;}
export async function database(work,{write=false}={}){
 const run=async()=>{if(!initPromise)initPromise=init();const db=await initPromise;const result=await work({db,rows});if(write)await save(db);return result;};
 // Serialize reads and writes: sql.js database is a shared in-memory instance.
 const pending=queue.then(run);queue=pending.catch(()=>{});return pending;
}
