-- Fix masked account numbers in existing transactions
-- This script removes the asterisks from source_account fields

UPDATE ojir_transaction
SET source_account = REPLACE(source_account, '****', '')
WHERE source_account LIKE '****%';

-- Verify the fix
SELECT
    id,
    recipient,
    source_account,
    transaction_ref_no,
    created_at
FROM ojir_transaction
WHERE source_account LIKE '****%'
ORDER BY created_at DESC;

-- Show fixed records
SELECT
    id,
    recipient,
    source_account,
    transaction_ref_no,
    created_at
FROM ojir_transaction
WHERE source_account ~ '^[0-9]+$'  -- Only numeric account numbers
ORDER BY created_at DESC
LIMIT 10;