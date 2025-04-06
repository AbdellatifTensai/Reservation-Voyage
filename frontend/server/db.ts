import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Create postgres client
const connectionString = process.env.DATABASE_URL!;
export const pool = postgres(connectionString, { ssl: "require" });

// Create drizzle client
export const db = drizzle(pool, { schema });