
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { query } from "../../../lib/db.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatMission(m) {
  return {
    id: m.id,
    missionName: m.mission_name,
    origin: m.origin,
    target: m.target,
    flyby: m.flyby,
    mode: m.recommended_mode,
    launchDate: m.launch_date_utc,
    deltaV: m.total_dv,
    tof: m.tof_days,
    payloadKg: m.payload_kg,
    engineType: m.engine_type,
    stages: m.stages,
    body: m.surface_body,
    createdAt: m.created_at
  };
}

export async function GET() {
  try {
    const result = await query(
      "SELECT * FROM missions ORDER BY created_at DESC"
    );

    return NextResponse.json(result.rows.map(formatMission));
  } catch (error) {
    console.error("Mission GET error:", error);
    return NextResponse.json(
      { error: "Could not retrieve missions", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const b = await req.json();

    if (!b.missionName || typeof b.missionName !== "string") {
      return NextResponse.json(
        { error: "missionName is required" },
        { status: 400 }
      );
    }

    const id = randomUUID();

    const values = [
      id,
      b.missionName.trim(),
      b.origin || "Earth",
      b.target || "Mars",
      b.flyby || null,
      b.mode || "Demo",
      b.launchDate || null,
      Number(b.deltaV) || 0,
      Number(b.tof) || 0,
      Number(b.payloadKg) || 0,
      String(b.engineType || b.isp || ""),
      Number(b.stages) || 1,
      b.body || null
    ];

    const result = await query(
      `INSERT INTO missions (
        id, mission_name, origin, target, flyby,
        recommended_mode, launch_date_utc, total_dv,
        tof_days, payload_kg, engine_type, stages, surface_body
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      values
    );

    return NextResponse.json(
      formatMission(result.rows[0]),
      { status: 201 }
    );
  } catch (error) {
    console.error("Mission POST error:", error);
    return NextResponse.json(
      { error: "Could not save mission", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    const result = await query(
      "DELETE FROM missions WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Mission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      deleted: true,
      id
    });
  } catch (error) {
    console.error("Mission DELETE error:", error);
    return NextResponse.json(
      { error: "Could not delete mission", details: error.message },
      { status: 500 }
    );
  }
}
