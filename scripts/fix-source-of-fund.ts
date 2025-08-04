import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { transactions } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

async function fixSourceOfFund() {
  try {
    console.log('🔧 Fixing source of fund for transaction 702507251831041775...');

    // Update the specific transaction
    const result = await db
      .update(transactions)
      .set({
        sourceOfFund: 'Credit Card - Mandiri Platinum',
        updatedAt: new Date(),
      })
      .where(eq(transactions.transactionRefNo, '702507251831041775'));

    console.log('✅ Successfully updated source of fund for transaction 702507251831041775');
    console.log('📝 Updated fields: sourceOfFund = "Credit Card - Mandiri Platinum"');

  } catch (error) {
    console.error('❌ Error updating transaction:', error);
  } finally {
    await client.end();
  }
}

// Run the script
fixSourceOfFund();