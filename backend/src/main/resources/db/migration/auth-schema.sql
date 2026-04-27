-- =====================================================
-- Users Table Schema Update
-- =====================================================

-- Ensure users table has all required columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- =====================================================
-- Sample Data for Testing
-- =====================================================

-- Insert test users (passwords are hashed BCrypt)
-- NOTE: These are sample hashes for demonstration
-- In production, use proper password hashing in application

-- Admin user: admin@evaccin.sn / password123
INSERT INTO users (email, password, first_name, last_name, role, phone_number, is_active, created_at, updated_at)
SELECT * FROM (SELECT 
    'admin@evaccin.sn' as email,
    '$2a$10$N9qo8uLOickgx2ZMRZoMye.example' as password,  -- Use proper hash
    'Administrator' as first_name,
    'System' as last_name,
    'ADMIN' as role,
    '+221761234567' as phone_number,
    true as is_active,
    NOW() as created_at,
    NOW() as updated_at
) AS new_users
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@evaccin.sn')
LIMIT 1;

-- Doctor user: medecin@evaccin.sn
INSERT INTO users (email, password, first_name, last_name, role, phone_number, is_active, created_at, updated_at)
SELECT * FROM (SELECT 
    'medecin@evaccin.sn' as email,
    '$2a$10$N9qo8uLOickgx2ZMRZoMye.example' as password,  -- Use proper hash
    'Dr' as first_name,
    'Sall' as last_name,
    'MEDECIN' as role,
    '+221762345678' as phone_number,
    true as is_active,
    NOW() as created_at,
    NOW() as updated_at
) AS new_users
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'medecin@evaccin.sn')
LIMIT 1;

-- Agent user: agent@evaccin.sn
INSERT INTO users (email, password, first_name, last_name, role, phone_number, is_active, created_at, updated_at)
SELECT * FROM (SELECT 
    'agent@evaccin.sn' as email,
    '$2a$10$N9qo8uLOickgx2ZMRZoMye.example' as password,  -- Use proper hash
    'Vaccin' as first_name,
    'Agent' as last_name,
    'AGENT' as role,
    '+221763456789' as phone_number,
    true as is_active,
    NOW() as created_at,
    NOW() as updated_at
) AS new_users
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'agent@evaccin.sn')
LIMIT 1;

-- =====================================================
-- Useful Queries
-- =====================================================

-- Get all active users by role
-- SELECT * FROM users WHERE is_active = true ORDER BY role;

-- Count users by role
-- SELECT role, COUNT(*) as count FROM users WHERE is_active = true GROUP BY role;

-- Find user by email
-- SELECT * FROM users WHERE email = 'admin@evaccin.sn';

-- Deactivate user account (soft delete)
-- UPDATE users SET is_active = false WHERE email = 'agent@evaccin.sn';

-- Reset last_login (if you track it)
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login DATETIME;
