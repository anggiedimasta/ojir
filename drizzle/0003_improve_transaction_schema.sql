-- Migration: Improve transaction schema for better data context
-- Date: 2025-01-10

-- Add new columns to transactions table
ALTER TABLE ojir_transaction
ADD COLUMN fee decimal(15,2) DEFAULT 0.00,
ADD COLUMN total_amount decimal(15,2) DEFAULT 0.00,
ADD COLUMN recipient_bank varchar(255),
ADD COLUMN recipient_bank_account varchar(255),
ADD COLUMN transfer_purpose varchar(255);

-- Update existing records to set total_amount = amount where total_amount is 0
UPDATE ojir_transaction
SET total_amount = amount
WHERE total_amount = 0 OR total_amount IS NULL;

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS transaction_fee_idx ON ojir_transaction(fee);
CREATE INDEX IF NOT EXISTS transaction_total_amount_idx ON ojir_transaction(total_amount);
CREATE INDEX IF NOT EXISTS transaction_recipient_bank_idx ON ojir_transaction(recipient_bank);
CREATE INDEX IF NOT EXISTS transaction_transfer_purpose_idx ON ojir_transaction(transfer_purpose);

-- Update the specific transaction record with better data
UPDATE ojir_transaction
SET
  fee = 2500.00,
  total_amount = 502500.00,
  amount = 500000.00,
  recipient_bank = 'BCA',
  recipient_bank_account = '3310530084',
  transfer_purpose = 'Wealth Transfer',
  location = NULL
WHERE transaction_ref_no = '20250710BMRIIDJA010O0223565938';