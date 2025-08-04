-- Fix PLN Prabayar transaction direction from 'in' to 'out'
-- PLN Prabayar transactions are top-ups (expenses), not income

UPDATE ojir_transaction
SET direction = 'out'
WHERE recipient LIKE '%PLN Prabayar%'
  AND direction = 'in';

-- Verify the fix
SELECT
    id,
    recipient,
    direction,
    transaction_ref_no,
    created_at
FROM ojir_transaction
WHERE recipient LIKE '%PLN Prabayar%'
ORDER BY created_at DESC;

-- Show all PLN Prabayar transactions after fix
SELECT
    id,
    recipient,
    direction,
    amount,
    transaction_ref_no,
    created_at
FROM ojir_transaction
WHERE recipient LIKE '%PLN Prabayar%'
ORDER BY created_at DESC;