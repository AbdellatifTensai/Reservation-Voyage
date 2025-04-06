import { db, pool } from "../server/db";
import * as schema from "../shared/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Creating database schema...");
  
  try {
    // Create tables
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "username" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "full_name" TEXT NOT NULL,
        "is_admin" BOOLEAN NOT NULL DEFAULT false
      )
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "trains" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "capacity" INTEGER NOT NULL,
        "type" TEXT NOT NULL
      )
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "routes" (
        "id" SERIAL PRIMARY KEY,
        "origin" TEXT NOT NULL,
        "destination" TEXT NOT NULL,
        "duration" INTEGER NOT NULL,
        "price" DOUBLE PRECISION NOT NULL
      )
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "bookings" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL,
        "train_id" INTEGER NOT NULL,
        "route_id" INTEGER NOT NULL,
        "departure_time" TIMESTAMP NOT NULL,
        "booking_date" TIMESTAMP NOT NULL DEFAULT NOW(),
        "status" TEXT NOT NULL DEFAULT 'confirmed'
      )
    `);
    
    // Create admin user
    const userExists = await db.execute(sql`
      SELECT * FROM "users" WHERE "username" = 'admin'
    `);
    
    if (!userExists.rows.length) {
      await db.execute(sql`
        INSERT INTO "users" ("username", "password", "full_name", "is_admin")
        VALUES ('admin', 'admin', 'Admin User', true)
      `);
      console.log("Created admin user: username=admin, password=admin");
    }
    
    // Create some sample data
    const trainsExist = await db.execute(sql`SELECT COUNT(*) FROM "trains"`);
    
    if (parseInt(trainsExist.rows[0].count) === 0) {
      await db.execute(sql`
        INSERT INTO "trains" ("name", "capacity", "type")
        VALUES
          ('Express 101', 200, 'Express'),
          ('Local 202', 150, 'Local'),
          ('Bullet 303', 300, 'High-Speed')
      `);
      console.log("Created sample train data");
    }
    
    const routesExist = await db.execute(sql`SELECT COUNT(*) FROM "routes"`);
    
    if (parseInt(routesExist.rows[0].count) === 0) {
      await db.execute(sql`
        INSERT INTO "routes" ("origin", "destination", "duration", "price")
        VALUES
          ('New York', 'Boston', 240, 79.99),
          ('Boston', 'Washington DC', 360, 99.99),
          ('Washington DC', 'Chicago', 720, 129.99)
      `);
      console.log("Created sample route data");
    }
    
    console.log("Database schema created successfully!");
  } catch (error) {
    console.error("Error creating database schema:", error);
  } finally {
    await pool.end();
  }
}

main();