-- Insert admin role
INSERT INTO roles (name, description, permissions)
VALUES (
  'admin',
  'Administrator with full access',
  '{
    "users": ["create", "read", "update", "delete"],
    "products": ["create", "read", "update", "delete"],
    "orders": ["create", "read", "update", "delete"],
    "settings": ["read", "update"]
  }'::jsonb
);

-- Create superadmin user (you'll need to replace the email and password)
DO $$
DECLARE
  admin_role_id UUID;
  new_user_id UUID;
BEGIN
  -- Get the admin role ID
  SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';

  -- Create the superadmin user
  INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    role
  ) VALUES (
    'admin@example.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    'authenticated'
  ) RETURNING id INTO new_user_id;

  -- Create the profile for the superadmin user
  INSERT INTO profiles (
    id,
    email,
    full_name,
    role_id
  ) VALUES (
    new_user_id,
    'admin@example.com',
    'Super Admin',
    admin_role_id
  );
END $$; 