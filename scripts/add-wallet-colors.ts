import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { wallets } from "~/server/db/schema";
import { eq } from "drizzle-orm";

const WALLET_COLORS = [
  "google-blue", "google-green", "google-purple", "google-red", "google-orange", "google-pink",
  "google-teal", "google-yellow"
];

async function addWalletColors() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL environment variable is required");
    process.exit(1);
  }

  const client = postgres(connectionString);
  const db = drizzle(client);

  try {
    console.log("Adding default colors to existing wallets...");

    // Get all wallets without colors
    const walletsWithoutColors = await db
      .select()
      .from(wallets)
      .where(eq(wallets.color, null));

    console.log(`Found ${walletsWithoutColors.length} wallets without colors`);

    // Assign colors to wallets
    for (let i = 0; i < walletsWithoutColors.length; i++) {
      const wallet = walletsWithoutColors[i];
      const colorIndex = i % WALLET_COLORS.length;
      const color = WALLET_COLORS[colorIndex];

      await db
        .update(wallets)
        .set({ color })
        .where(eq(wallets.id, wallet.id));

      console.log(`Updated wallet "${wallet.name}" with color: ${color}`);
    }

    console.log("Successfully added colors to all wallets!");
  } catch (error) {
    console.error("Error adding wallet colors:", error);
  } finally {
    await client.end();
  }
}

addWalletColors();