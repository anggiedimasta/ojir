import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '~/config/env';

const sql = postgres(env.DATABASE_URL);
const db = drizzle(sql);

async function applyMigration() {
  try {
    console.log('Applying migration...');

    // Add new columns to transactions table
    await sql`ALTER TABLE ojir_transaction ADD COLUMN IF NOT EXISTS fee numeric(15, 2) DEFAULT '0.00' NOT NULL`;
    await sql`ALTER TABLE ojir_transaction ADD COLUMN IF NOT EXISTS total_amount numeric(15, 2) DEFAULT '0.00' NOT NULL`;
    await sql`ALTER TABLE ojir_transaction ADD COLUMN IF NOT EXISTS recipient_bank varchar(255)`;
    await sql`ALTER TABLE ojir_transaction ADD COLUMN IF NOT EXISTS recipient_bank_account varchar(255)`;
    await sql`ALTER TABLE ojir_transaction ADD COLUMN IF NOT EXISTS transfer_purpose varchar(255)`;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS transaction_fee_idx ON ojir_transaction USING btree (fee)`;
    await sql`CREATE INDEX IF NOT EXISTS transaction_total_amount_idx ON ojir_transaction USING btree (total_amount)`;
    await sql`CREATE INDEX IF NOT EXISTS transaction_recipient_bank_idx ON ojir_transaction USING btree (recipient_bank)`;
    await sql`CREATE INDEX IF NOT EXISTS transaction_transfer_purpose_idx ON ojir_transaction USING btree (transfer_purpose)`;

    // Update existing records to set total_amount = amount where total_amount is 0
    await sql`UPDATE ojir_transaction SET total_amount = amount WHERE total_amount = 0 OR total_amount IS NULL`;

    // Update the specific transaction record with better data
    await sql`
      UPDATE ojir_transaction
      SET
        fee = 2500.00,
        total_amount = 502500.00,
        amount = 500000.00,
        recipient_bank = 'BCA',
        recipient_bank_account = '3310530084',
        transfer_purpose = 'Wealth Transfer',
        location = NULL
      WHERE transaction_ref_no = '20250710BMRIIDJA010O0223565938'
    `;

    console.log('Migration applied successfully!');
  } catch (error) {
    console.error('Error applying migration:', error);
  } finally {
    await sql.end();
  }
}

applyMigration();