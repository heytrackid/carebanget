-- Add one-time payment status to user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'failed', 'pending')),
ADD COLUMN IF NOT EXISTS payment_customer_id TEXT, -- Store Scalev customer/order ID
ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS payment_currency TEXT DEFAULT 'IDR',
ADD COLUMN IF NOT EXISTS payment_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_payment_check TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_payment_status ON user_profiles(payment_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_payment_customer_id ON user_profiles(payment_customer_id);
