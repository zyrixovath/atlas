
import { NextResponse } from "next/server";
import { query } from "../../../lib/db.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await query(`
      SELECT
        (SELECT COUNT(*) FROM missions) AS missions,
        (SELECT COUNT(*) FROM rover_paths) AS rover_paths,
        (SELECT COUNT(*) FROM telemetry_logs) AS telemetry_logs
    `);

    return NextResponse.json({
      status: "ok",
      database: "Supabase PostgreSQL",
      connected: true,
      timestamp: new Date().toISOString(),
      stats: {
        missions: Number(result.rows[0].missions),
        roverPaths: Number(result.rows[0].rover_paths),
        telemetryPackets: Number(result.rows[0].telemetry_logs)
      }
    });
  } catch (error) {
    console.error("ATLAS health check failed:", error);

    return NextResponse.json(
      {
        status: "error",
        database: "unavailable",
        connected: false,
        error: error.message
      },
      { status: 503 }
    );
  }
}
