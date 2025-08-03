import postgres from "postgres";

const connectionString = process.env.DATABASE_URL?.replace(/^["']|["']$/g, '');

if (!connectionString) {
  console.error("❌ DATABASE_URL environment variable is required");
  process.exit(1);
}

const client = postgres(connectionString);

async function verifyMasterData() {

  try {
    // Check banks
    const banks = await client`SELECT * FROM ojir_bank ORDER BY sort_order`;

    // Check payment methods
    const paymentMethods = await client`SELECT * FROM ojir_payment_method ORDER BY sort_order`;

    // Check total tables
    const tables = await client`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

  } catch (error) {
    console.error("❌ Error verifying master data:", error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the verification
verifyMasterData()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Master data verification failed:", error);
    process.exit(1);
  });