import { db } from '~/server/db';
import { transactions } from '~/server/db/schema';
import { eq, like } from 'drizzle-orm';

async function fixPLNDirection() {
  console.log('🔧 Starting to fix PLN Prabayar transaction direction...');

  try {
    // Find all PLN Prabayar transactions with incorrect direction
    const plnTransactions = await db
      .select({
        id: transactions.id,
        recipient: transactions.recipient,
        direction: transactions.direction,
        transactionRefNo: transactions.transactionRefNo,
        createdAt: transactions.createdAt,
      })
      .from(transactions)
      .where(like(transactions.recipient, '%PLN Prabayar%'));

    console.log(`📊 Found ${plnTransactions.length} PLN Prabayar transactions`);

    if (plnTransactions.length === 0) {
      console.log('✅ No PLN Prabayar transactions found.');
      return;
    }

    // Show current state
    console.log('\n📋 Current PLN Prabayar transactions:');
    plnTransactions.forEach((tx) => {
      console.log(`  - ${tx.recipient}: direction = ${tx.direction} (${tx.transactionRefNo})`);
    });

    // Update PLN Prabayar transactions to have direction = 'out'
    let updatedCount = 0;
    for (const tx of plnTransactions) {
      if (tx.direction === 'in') {
        await db
          .update(transactions)
          .set({ direction: 'out' })
          .where(eq(transactions.id, tx.id));

        updatedCount++;
        console.log(`✅ Fixed direction: ${tx.recipient} (${tx.transactionRefNo}) in → out`);
      } else {
        console.log(`ℹ️  Already correct: ${tx.recipient} (${tx.transactionRefNo}) direction = ${tx.direction}`);
      }
    }

    console.log(`\n🎉 Successfully fixed ${updatedCount} PLN Prabayar transactions!`);

    // Verify the fix
    const updatedPLN = await db
      .select({
        id: transactions.id,
        recipient: transactions.recipient,
        direction: transactions.direction,
        transactionRefNo: transactions.transactionRefNo,
      })
      .from(transactions)
      .where(like(transactions.recipient, '%PLN Prabayar%'));

    console.log('\n🔍 Verification - Updated PLN Prabayar transactions:');
    updatedPLN.forEach((tx) => {
      console.log(`  - ${tx.recipient}: direction = ${tx.direction} (${tx.transactionRefNo})`);
    });

    const incorrectDirection = updatedPLN.filter(tx => tx.direction === 'in');
    if (incorrectDirection.length === 0) {
      console.log('✅ All PLN Prabayar transactions now have correct direction (out)!');
    } else {
      console.log(`⚠️  ${incorrectDirection.length} PLN Prabayar transactions still have incorrect direction.`);
    }

  } catch (error) {
    console.error('❌ Error fixing PLN Prabayar direction:', error);
    throw error;
  }
}

// Run the fix if this script is executed directly
if (import.meta.main) {
  fixPLNDirection()
    .then(() => {
      console.log('✨ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

export { fixPLNDirection };