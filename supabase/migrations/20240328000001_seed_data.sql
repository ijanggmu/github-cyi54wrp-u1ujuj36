-- Insert roles
INSERT INTO roles (name, description, permissions)
VALUES 
  ('admin', 'Administrator with full access', '{
    "users": ["create", "read", "update", "delete"],
    "products": ["create", "read", "update", "delete"],
    "orders": ["create", "read", "update", "delete"],
    "customers": ["create", "read", "update", "delete"],
    "suppliers": ["create", "read", "update", "delete"],
    "categories": ["create", "read", "update", "delete"],
    "inventory": ["create", "read", "update", "delete"],
    "reports": ["read"],
    "settings": ["read", "update"]
  }'::jsonb),
  ('manager', 'Manager with limited access', '{
    "users": ["read"],
    "products": ["create", "read", "update"],
    "orders": ["create", "read", "update"],
    "customers": ["create", "read", "update"],
    "suppliers": ["create", "read", "update"],
    "categories": ["read"],
    "inventory": ["read", "update"],
    "reports": ["read"],
    "settings": ["read"]
  }'::jsonb),
  ('user', 'Regular user with basic access', '{
    "products": ["read"],
    "orders": ["create", "read"],
    "customers": ["create", "read"],
    "inventory": ["read"],
    "reports": ["read"]
  }'::jsonb);

-- Insert categories
INSERT INTO categories (name, description)
VALUES 
  ('Prescription Drugs', 'Medications requiring a prescription'),
  ('Over-the-Counter', 'Medications available without prescription'),
  ('Medical Supplies', 'Medical equipment and supplies'),
  ('Personal Care', 'Personal hygiene and care products'),
  ('Vitamins & Supplements', 'Dietary supplements and vitamins');

-- Insert suppliers
INSERT INTO suppliers (name, contact_person, email, phone, address, tax_id)
VALUES 
  ('PharmaCo Ltd.', 'John Smith', 'john@pharmaco.com', '+1234567890', '123 Pharma St, City', 'TAX123456'),
  ('MediCare Supplies', 'Sarah Johnson', 'sarah@medicare.com', '+0987654321', '456 Medical Ave, Town', 'TAX789012'),
  ('HealthPlus Distributors', 'Mike Brown', 'mike@healthplus.com', '+1122334455', '789 Health Blvd, Village', 'TAX345678');

-- Insert products
INSERT INTO products (name, description, sku, barcode, price, cost, stock_quantity, reorder_level, category_id, supplier_id)
SELECT 
  p.name,
  p.description,
  p.sku,
  p.barcode,
  p.price,
  p.cost,
  p.stock_quantity,
  p.reorder_level,
  c.id as category_id,
  s.id as supplier_id
FROM (
  VALUES 
    ('Paracetamol 500mg', 'Pain reliever and fever reducer', 'PARA500', '123456789012', 5.99, 2.50, 100, 20),
    ('Ibuprofen 200mg', 'Anti-inflammatory and pain reliever', 'IBU200', '234567890123', 7.99, 3.00, 150, 30),
    ('Vitamin C 1000mg', 'Immune system support', 'VITC1000', '345678901234', 12.99, 5.00, 200, 40),
    ('Bandage 10cm', 'Medical bandage', 'BAND10', '456789012345', 3.99, 1.50, 300, 50),
    ('Hand Sanitizer', 'Alcohol-based sanitizer', 'HSAN100', '567890123456', 8.99, 3.50, 250, 30)
) AS p(name, description, sku, barcode, price, cost, stock_quantity, reorder_level)
CROSS JOIN (SELECT id FROM categories WHERE name = 'Over-the-Counter' LIMIT 1) c
CROSS JOIN (SELECT id FROM suppliers LIMIT 1) s;

-- Insert customers
INSERT INTO customers (name, email, phone, address, date_of_birth, gender, medical_history, allergies)
VALUES 
  ('Alice Johnson', 'alice@example.com', '+1112223333', '123 Main St', '1990-01-15', 'Female', 'Hypertension', 'Penicillin'),
  ('Bob Wilson', 'bob@example.com', '+4445556666', '456 Oak Ave', '1985-05-20', 'Male', 'Diabetes', 'None'),
  ('Carol Davis', 'carol@example.com', '+7778889999', '789 Pine Rd', '1978-11-30', 'Female', 'Asthma', 'Peanuts');

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
    full_name,
    email,
    role_id
  ) VALUES (
    new_user_id,
    'Super Admin',
    'admin@example.com',
    admin_role_id
  );

  -- Create user settings for superadmin
  INSERT INTO user_settings (user_id)
  VALUES (new_user_id);
END $$; 