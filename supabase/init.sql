-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create roles table
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role_id UUID REFERENCES roles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  category_id UUID,
  supplier_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID,
  status TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Roles policies
CREATE POLICY "Roles are viewable by authenticated users"
  ON roles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Roles can be managed by admin users"
  ON roles FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role_id IN (
      SELECT id FROM roles WHERE name = 'admin'
    )
  ));

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role_id IN (
      SELECT id FROM roles WHERE name = 'admin'
    )
  ));

-- Products policies
CREATE POLICY "Products are viewable by authenticated users"
  ON products FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Products can be managed by admin users"
  ON products FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role_id IN (
      SELECT id FROM roles WHERE name = 'admin'
    )
  ));

-- Orders policies
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (created_by = auth.uid());

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Orders can be managed by admin users"
  ON orders FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role_id IN (
      SELECT id FROM roles WHERE name = 'admin'
    )
  ));

-- Order items policies
CREATE POLICY "Order items are viewable by order owners"
  ON order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.created_by = auth.uid()
  ));

CREATE POLICY "Order items can be created by authenticated users"
  ON order_items FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Order items can be managed by admin users"
  ON order_items FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role_id IN (
      SELECT id FROM roles WHERE name = 'admin'
    )
  ));

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

-- Create superadmin user
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