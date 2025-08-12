-- Add Cash payment method to ojir_payment_method table
INSERT INTO ojir_payment_method (code, name, icon, is_active, created_at)
VALUES ('cash', 'Cash', 'hand-coins', true, CURRENT_TIMESTAMP)
ON CONFLICT (code) DO NOTHING;

-- Verify the payment method was added
SELECT * FROM ojir_payment_method WHERE code = 'cash';
