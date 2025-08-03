import { db } from "./index";
import { banks, paymentMethods } from "./schema";

export async function seedMasterData() {
  // Seed banks
  const bankData = [
    {
      code: "mandiri",
      name: "Bank Mandiri",
      displayName: "Bank Mandiri",
      iconPath: "/icons/bank/mandiri.png",
      sortOrder: 1,
    },
    {
      code: "bca",
      name: "Bank BCA",
      displayName: "Bank BCA",
      iconPath: "/icons/bank/bca.png",
      sortOrder: 2,
    },
    {
      code: "bni",
      name: "Bank BNI",
      displayName: "Bank BNI",
      iconPath: "/icons/bank/bni.png",
      sortOrder: 3,
    },
    {
      code: "bri",
      name: "Bank BRI",
      displayName: "Bank BRI",
      iconPath: "/icons/bank/bri.png",
      sortOrder: 4,
    },
    {
      code: "cimb",
      name: "Bank CIMB Niaga",
      displayName: "Bank CIMB Niaga",
      iconPath: "/icons/bank/cimb.png",
      sortOrder: 5,
    },
    {
      code: "other",
      name: "Other Banks",
      displayName: "Other Banks",
      iconPath: "/icons/bank/other.png",
      sortOrder: 999,
    },
  ];

  // Seed payment methods
  const paymentMethodData = [
    {
      code: "qris",
      name: "QRIS",
      displayName: "QRIS",
      description: "Quick Response Code Indonesian Standard",
      iconPath: "/icons/payment/qris.png",
      sortOrder: 1,
    },
    {
      code: "transfer",
      name: "Bank Transfer",
      displayName: "Bank Transfer",
      description: "Traditional bank transfer",
      iconPath: "/icons/payment/transfer.png",
      sortOrder: 2,
    },
    {
      code: "virtual-account",
      name: "Virtual Account",
      displayName: "Virtual Account",
      description: "Virtual account payment",
      iconPath: "/icons/payment/virtual-account.png",
      sortOrder: 3,
    },
    {
      code: "bi-fast",
      name: "BI-FAST",
      displayName: "BI-FAST",
      description: "Bank Indonesia Fast Payment System",
      iconPath: "/icons/payment/bi-fast.png",
      sortOrder: 4,
    },
    {
      code: "other",
      name: "Other Methods",
      displayName: "Other Methods",
      description: "Other payment methods",
      iconPath: "/icons/payment/other.png",
      sortOrder: 999,
    },
  ];

  try {
    // Insert banks
    for (const bank of bankData) {
      await db.insert(banks).values(bank).onConflictDoNothing();
    }

    // Insert payment methods
    for (const method of paymentMethodData) {
      await db.insert(paymentMethods).values(method).onConflictDoNothing();
    }

  } catch (error) {
    console.error("❌ Error seeding master data:", error);
    throw error;
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