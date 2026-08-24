// lib/db/index.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString && typeof window === "undefined") {
	throw new Error(
		"DATABASE_URL is missing in server environment variables. Check .env.local",
	);
}

// Fallback dummy string prevents neon() from throwing during client-side evaluation
const sql = neon(
	connectionString || "postgres://dummy:dummy@localhost:5432/dummy",
);
export const db = drizzle(sql, { schema });
