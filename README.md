# ATLAS — Team Nebulla Knights (S34)

A vanilla HTML/CSS/ES-module multi-page mission-control prototype for ASTRA 2026.

## Requirements
- Node.js 20.9+ and npm
- Optional: Python 3.10+ for the separate scientific-engine demo

## Run in VS Code (Windows)
1. Extract this folder.
2. Open the `ATLAS-S34` folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Confirm you are in the project root (the prompt should end with `ATLAS-S34`).
5. Run `node -v` and `npm -v`. If either is not recognized, install Node.js LTS from https://nodejs.org and restart VS Code.
6. Run `npm install`.
7. Optional Python engine: `py -m venv .venv`, then `.venv\Scripts\activate`, then `py -m pip install -r python_engine/requirements.txt`.
8. Run `npm run dev`.
9. Open http://localhost:3000.

If Python is not installed, `npm run dev` still starts Next.js; the optional Python process will report an error, while the built-in Next.js API routes provide the fallback.

## Bolt / WebContainer
The frontend and Next.js API routes are the primary runnable path. Bolt environments vary in support for a second Python process and native Node modules. This project intentionally uses JSON-file mission persistence in the API route instead of requiring a native SQLite binding, to avoid native compilation problems in browser containers. A production deployment should replace this adapter with a managed database or a verified SQLite runtime.

## Important prototype boundaries
- The planetary positions and transfer calculations are simplified educational estimates, not precision ephemerides or validated flight trajectories.
- Propulsion outputs are classroom mass-ratio illustrations only, not operational vehicle-design instructions.
- Terrain is synthetic demonstration terrain, not measured lunar, Martian or Venusian DEM data.
- Bhuvan is integrated through the published NRSC OGC WMS endpoint. ATLAS reads GetCapabilities and proxies selected GetMap layers through `/api/bhuvan`; network access to NRSC is required. The map is a Bhuvan geospatial layer, not lunar/Martian/Venusian terrain.
- Bhoonidhi's official brochure describes a STAC/open-data API, but says online API access may need enablement by NRSC. MOSDAC and VEDAS are not connected in this build; do not label them live.
- No official launch-clearance, live weather, or planetary terrain feed is connected.
- The radiation widget is an illustrative mathematical model, not a crew-health assessment.
- SHA-256 is a one-way integrity digest, not encryption and not proof of identity.
- The four intended Indian geospatial/data portals are Bhuvan, Bhoonidhi, MOSDAC and VEDAS. Use only approved, documented datasets from those portals when replacing demo data.

## Project structure
- `public/` — five vanilla multi-page frontend screens and ES modules
- `src/app/api/` — Next.js route handlers and local API fallback calculations
- `python_engine/` — optional FastAPI educational compute service
- `data/` — local mission registry is created on first save
