
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not configured. Add it in Vercel Project Settings > Environment Variables."
  );
}

const globalForPostgres = globalThis;

export const pool =
  globalForPostgres.atlasPostgresPool ||
  new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 3,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000
  });

if (process.env.NODE_ENV !== "production") {
  globalForPostgres.atlasPostgresPool = pool;
}

export async function query(text, params = []) {
  return pool.query(text, params);
}

export async function checkDatabaseConnection() {
  const result = await query("SELECT NOW() AS database_time");
  return result.rows[0];
}
