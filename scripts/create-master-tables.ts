import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../src/env.js";
import fs from "fs";
import path from "path";

const connectionString = env.DATABASE_URL;
const client = postgres(connectionString);

async function createMasterTables() {

  try {
    // Read the SQL file
    const sqlPath = path.join(process.cwd(), "scripts", "create-master-tables.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    // Execute the SQL
    await client.unsafe(sql);

  } catch (error) {
    console.error("❌ Error creating master data tables:", error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run if called directly
if (require.main === module) {
  createMasterTables()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Table creation failed:", error);
      process.exit(1);
    });
}