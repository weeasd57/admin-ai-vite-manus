-- Create plan_limits table to store dynamic usage limits
CREATE TABLE IF NOT EXISTS plan_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_name VARCHAR(50) NOT NULL,
  plan_type VARCHAR(20) NOT NULL DEFAULT 'monthly', -- monthly, yearly
  database_size_mb INTEGER NOT NULL DEFAULT 500,
  max_users INTEGER NOT NULL DEFAULT 50000,
  storage_mb INTEGER NOT NULL DEFAULT 1000,
  api_requests INTEGER NOT NULL DEFAULT 500000,
  realtime_connections INTEGER NOT NULL DEFAULT 500,
  realtime_messages INTEGER NOT NULL DEFAULT 2000000,
  edge_functions_invocations INTEGER NOT NULL DEFAULT 500000,
  edge_functions_execution_time_hours INTEGER NOT NULL DEFAULT 400,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on plan_name for faster queries
CREATE INDEX IF NOT EXISTS idx_plan_limits_plan_name ON plan_limits(plan_name);
CREATE INDEX IF NOT EXISTS idx_plan_limits_active ON plan_limits(is_active);

-- Insert default plan limits
INSERT INTO plan_limits (plan_name, plan_type, database_size_mb, max_users, storage_mb, api_requests, realtime_connections, realtime_messages, edge_functions_invocations, edge_functions_execution_time_hours, is_active) VALUES
('Free', 'monthly', 500, 50000, 1000, 500000, 2, 2000000, 500000, 10, true),
('Pro', 'monthly', 8000, 100000, 100000, 5000000, 500, 5000000, 2000000, 400, true),
('Team', 'monthly', 32000, 100000, 100000, 10000000, 1000, 10000000, 5000000, 1000, true),
('Enterprise', 'monthly', 128000, 500000, 200000, 25000000, 5000, 25000000, 10000000, 2000, true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_plan_limits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER trigger_update_plan_limits_updated_at
    BEFORE UPDATE ON plan_limits
    FOR EACH ROW
    EXECUTE FUNCTION update_plan_limits_updated_at();

-- Create user_plan_assignments table to assign plans to users
CREATE TABLE IF NOT EXISTS user_plan_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_name VARCHAR(50) NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user_plan_assignments
CREATE INDEX IF NOT EXISTS idx_user_plan_assignments_user_id ON user_plan_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_plan_assignments_plan_name ON user_plan_assignments(plan_name);
CREATE INDEX IF NOT EXISTS idx_user_plan_assignments_active ON user_plan_assignments(is_active);

-- Insert a default plan assignment (you can modify this based on your needs)
-- This assumes you have a way to identify the current user or organization
INSERT INTO user_plan_assignments (user_id, plan_name, is_active) 
SELECT id, 'Pro', true 
FROM auth.users 
WHERE email = 'admin@example.com'  -- Replace with actual admin email
ON CONFLICT DO NOTHING;

-- Create a view to get current user's plan limits
CREATE OR REPLACE VIEW user_current_plan_limits AS
SELECT 
    u.id as user_id,
    u.email,
    upa.plan_name,
    pl.database_size_mb,
    pl.max_users,
    pl.storage_mb,
    pl.api_requests,
    pl.realtime_connections,
    pl.realtime_messages,
    pl.edge_functions_invocations,
    pl.edge_functions_execution_time_hours,
    upa.assigned_at,
    upa.expires_at
FROM auth.users u
JOIN user_plan_assignments upa ON u.id = upa.user_id
JOIN plan_limits pl ON upa.plan_name = pl.plan_name
WHERE upa.is_active = true 
AND pl.is_active = true
AND (upa.expires_at IS NULL OR upa.expires_at > NOW());

-- Enable Row Level Security (RLS) if needed
ALTER TABLE plan_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plan_assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (adjust based on your security requirements)
CREATE POLICY "Users can view their own plan limits" ON user_plan_assignments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all plan limits" ON plan_limits
    FOR SELECT USING (true); -- Adjust this based on your admin role system

-- Grant necessary permissions
GRANT SELECT ON plan_limits TO authenticated;
GRANT SELECT ON user_plan_assignments TO authenticated;
GRANT SELECT ON user_current_plan_limits TO authenticated;
