
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { query } from "../../../lib/db.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await query(
      "SELECT * FROM rover_paths ORDER BY created_at DESC LIMIT 100"
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Rover paths GET error:", error);

    return NextResponse.json(
      { error: "Could not retrieve rover paths", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const p = await req.json();

    if (!Array.isArray(p.waypoints) || p.waypoints.length < 2) {
      return NextResponse.json(
        { error: "At least two waypoints are required" },
        { status: 400 }
      );
    }

    const id = randomUUID();

    const result = await query(
      `INSERT INTO rover_paths (
        id, mission_id, body, seed, start_coord,
        goal_coord, distance_m, max_slope_deg,
        battery_used_pct, waypoints_json
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        id,
        p.missionId || null,
        p.body || "Moon",
        Number(p.seed) || 0,
        JSON.stringify(p.start || []),
        JSON.stringify(p.goal || []),
        Number(p.distance) || 0,
        Number(p.maxSlope) || 0,
        Number(p.battery) || 0,
        JSON.stringify(p.waypoints)
      ]
    );

    return NextResponse.json(
      { ...result.rows[0], stored: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Rover paths POST error:", error);

    return NextResponse.json(
      { error: "Could not save rover path", details: error.message },
      { status: 500 }
    );
  }
}
