import { db } from '~/server/db';
import { transactions } from '~/server/db/schema';
import { eq, like } from 'drizzle-orm';

async function fixMaskedAccounts() {
  console.log('🔧 Starting to fix masked account numbers...');

  try {
    // Find all transactions with masked account numbers
    const maskedTransactions = await db
      .select({
        id: transactions.id,
        recipient: transactions.recipient,
        sourceAccount: transactions.sourceAccount,
        transactionRefNo: transactions.transactionRefNo,
        createdAt: transactions.createdAt,
      })
      .from(transactions)
      .where(like(transactions.sourceAccount, '****%'));

    console.log(`📊 Found ${maskedTransactions.length} transactions with masked account numbers`);

    if (maskedTransactions.length === 0) {
      console.log('✅ No masked account numbers found. All good!');
      return;
    }

    // Show what will be fixed
    console.log('\n📋 Transactions to be fixed:');
    maskedTransactions.forEach((tx) => {
      console.log(`  - ${tx.recipient}: ${tx.sourceAccount} → ${tx.sourceAccount.replace('****', '')}`);
    });

    // Update all masked account numbers
    let updatedCount = 0;
    for (const tx of maskedTransactions) {
      const cleanAccount = tx.sourceAccount.replace('****', '');

      await db
        .update(transactions)
        .set({ sourceAccount: cleanAccount })
        .where(eq(transactions.id, tx.id));

      updatedCount++;
      console.log(`✅ Fixed: ${tx.recipient} (${tx.transactionRefNo})`);
    }

    console.log(`\n🎉 Successfully fixed ${updatedCount} transactions!`);

    // Verify the fix
    const remainingMasked = await db
      .select({ count: transactions.id })
      .from(transactions)
      .where(like(transactions.sourceAccount, '****%'));

    console.log(`\n🔍 Verification: ${remainingMasked.length} transactions still have masked accounts`);

    if (remainingMasked.length === 0) {
      console.log('✅ All masked account numbers have been successfully fixed!');
    } else {
      console.log('⚠️  Some masked account numbers still remain. Manual review may be needed.');
    }

  } catch (error) {
    console.error('❌ Error fixing masked account numbers:', error);
    throw error;
  }
}

// Run the fix if this script is executed directly
if (import.meta.main) {
  fixMaskedAccounts()
    .then(() => {
      console.log('✨ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

export { fixMaskedAccounts };