
import { NextResponse } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import { query } from "../../../lib/db.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await query(
      "SELECT * FROM telemetry_logs ORDER BY timestamp_utc DESC LIMIT 100"
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Telemetry GET error:", error);

    return NextResponse.json(
      { error: "Could not retrieve telemetry", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const payload = await req.json();

    const timestamp = new Date().toISOString();
    const hash = createHash("sha256")
      .update(JSON.stringify(payload))
      .digest("hex");

    const id = randomUUID();

    const result = await query(
      `INSERT INTO telemetry_logs (
        id, timestamp_utc, packet_type,
        source_portal, payload_summary, sha256_hash
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, timestamp_utc`,
      [
        id,
        timestamp,
        String(payload.type || "MISSION_STATUS"),
        String(payload.source || "LOCAL_DEMO"),
        JSON.stringify(payload).slice(0, 4000),
        hash
      ]
    );

    return NextResponse.json({
      id: result.rows[0].id,
      timestamp: result.rows[0].timestamp_utc,
      algorithm: "SHA-256",
      hash,
      stored: true,
      note: "Hash only; not encryption, digital signature, or authenticated uplink."
    });
  } catch (error) {
    console.error("Telemetry POST error:", error);

    return NextResponse.json(
      { error: "Could not save telemetry", details: error.message },
      { status: 500 }
    );
  }
}
