from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
from .orbital_mechanics import ephemeris, transfer
from .propulsion import size_vehicle
from .terrain_astar import generate_terrain, find_path

app = FastAPI(title="ATLAS Scientific Engine", version="1.0")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_methods=["*"], allow_headers=["*"])

@app.get("/health")
def health():
    return {"status": "online", "engine": "ATLAS Python Scientific Engine"}

@app.get("/ephemeris")
def get_ephemeris():
    return {"timestamp": datetime.now(timezone.utc).isoformat(), "bodies": ephemeris()}

@app.post("/trajectory")
def get_trajectory(payload: dict):
    return transfer(payload.get("origin", "Earth"), payload.get("target", "Mars"))

@app.post("/propulsion")
def get_propulsion(payload: dict):
    # Educational simulation only; not suitable for designing or operating a real launch vehicle.
    return size_vehicle(float(payload.get("payloadKg", 1000)), float(payload.get("deltaV", 5.5)),
                        float(payload.get("isp", 310)), int(payload.get("stages", 2)))

@app.get("/terrain")
def terrain(body: str = "Moon", seed: int = 42):
    return generate_terrain(body, seed)

@app.post("/path")
def path(payload: dict):
    return find_path(payload.get("seed", 42), payload.get("start", [3, 3]), payload.get("goal", [72, 72]))
