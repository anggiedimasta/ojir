import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../src/env.js";

const connectionString = env.DATABASE_URL;
const client = postgres(connectionString);
const db = drizzle(client);

async function seedMasterData() {

  // Seed banks
  const bankData = [
    {
      id: crypto.randomUUID(),
      code: "mandiri",
      name: "Bank Mandiri",
      display_name: "Bank Mandiri",
      icon_path: "/icons/bank/mandiri.png",
      is_active: true,
      sort_order: 1,
      created_at: new Date(),
    },
    {
      id: crypto.randomUUID(),
      code: "bca",
      name: "Bank BCA",
      display_name: "Bank BCA",
      icon_path: "/icons/bank/bca.png",
      is_active: true,
      sort_order: 2,
      created_at: new Date(),
    },
    {
      id: crypto.randomUUID(),
      code: "bni",
      name: "Bank BNI",
      display_name: "Bank BNI",
      icon_path: "/icons/bank/bni.png",
      is_active: true,
      sort_order: 3,
      created_at: new Date(),
    },
    {
      id: crypto.randomUUID(),
      code: "bri",
      name: "Bank BRI",
      display_name: "Bank BRI",
      icon_path: "/icons/bank/bri.png",
      is_active: true,
      sort_order: 4,
      created_at: new Date(),
    },
    {
      id: crypto.randomUUID(),
      code: "cimb",
      name: "Bank CIMB Niaga",
      display_name: "Bank CIMB Niaga",
      icon_path: "/icons/bank/cimb.png",
      is_active: true,
      sort_order: 5,
      created_at: new Date(),
    },
    {
      id: crypto.randomUUID(),
      code: "other",
      name: "Other Banks",
      display_name: "Other Banks",
      icon_path: "/icons/bank/other.png",
      is_active: true,
      sort_order: 999,
      created_at: new Date(),
    },
  ];

  // Seed payment methods
  const paymentMethodData = [
    {
      id: crypto.randomUUID(),
      code: "qris",
      name: "QRIS",
      display_name: "QRIS",
      description: "Quick Response Code Indonesian Standard",
      icon_path: "/icons/payment/qris.png",
      is_active: true,
      sort_order: 1,
      created_at: new Date(),
    },
    {
      id: crypto.randomUUID(),
      code: "transfer",
      name: "Bank Transfer",
      display_name: "Bank Transfer",
      description: "Traditional bank transfer",
      icon_path: "/icons/payment/transfer.png",
      is_active: true,
      sort_order: 2,
      created_at: new Date(),
    },
    {
      id: crypto.randomUUID(),
      code: "virtual-account",
      name: "Virtual Account",
      display_name: "Virtual Account",
      description: "Virtual account payment",
      icon_path: "/icons/payment/virtual-account.png",
      is_active: true,
      sort_order: 3,
      created_at: new Date(),
    },
    {
      id: crypto.randomUUID(),
      code: "bi-fast",
      name: "BI-FAST",
      display_name: "BI-FAST",
      description: "Bank Indonesia Fast Payment System",
      icon_path: "/icons/payment/bi-fast.png",
      is_active: true,
      sort_order: 4,
      created_at: new Date(),
    },
    {
      id: crypto.randomUUID(),
      code: "other",
      name: "Other Methods",
      display_name: "Other Methods",
      description: "Other payment methods",
      icon_path: "/icons/payment/other.png",
      is_active: true,
      sort_order: 999,
      created_at: new Date(),
    },
  ];

  try {
    // Insert banks
    for (const bank of bankData) {
      await client`
        INSERT INTO ojir_bank (id, code, name, display_name, icon_path, is_active, sort_order, created_at)
        VALUES (${bank.id}, ${bank.code}, ${bank.name}, ${bank.display_name}, ${bank.icon_path}, ${bank.is_active}, ${bank.sort_order}, ${bank.created_at})
        ON CONFLICT (code) DO NOTHING
      `;
    }

    // Insert payment methods
    for (const method of paymentMethodData) {
      await client`
        INSERT INTO ojir_payment_method (id, code, name, display_name, description, icon_path, is_active, sort_order, created_at)
        VALUES (${method.id}, ${method.code}, ${method.name}, ${method.display_name}, ${method.description}, ${method.icon_path}, ${method.is_active}, ${method.sort_order}, ${method.created_at})
        ON CONFLICT (code) DO NOTHING
      `;
    }

  } catch (error) {
    console.error("❌ Error seeding master data:", error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run if called directly
if (require.main === module) {
  seedMasterData()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}