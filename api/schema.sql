-- Run this in Supabase SQL Editor (https://app.supabase.com → SQL Editor)

-- Add missing columns to existing dealer_orders table (safe to re-run)
ALTER TABLE dealer_orders ADD COLUMN IF NOT EXISTS po_no TEXT DEFAULT '';
ALTER TABLE dealer_orders ADD COLUMN IF NOT EXISTS place TEXT DEFAULT '';
ALTER TABLE dealer_orders ADD COLUMN IF NOT EXISTS village TEXT DEFAULT '';
ALTER TABLE dealer_orders ADD COLUMN IF NOT EXISTS total_ordered_weight REAL DEFAULT 0;

CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT DEFAULT 'Admin',
  reset_password_token TEXT,
  reset_password_expires TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bill_counters (
  id INTEGER PRIMARY KEY DEFAULT 1,
  seq INTEGER DEFAULT 0
);
INSERT INTO bill_counters (id, seq) VALUES (1, 1000) ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bill_no INTEGER UNIQUE NOT NULL,
  farmer_name TEXT NOT NULL,
  farmer_number TEXT DEFAULT '',
  commodity JSONB DEFAULT '[]',
  weight REAL DEFAULT 0,
  weight_details TEXT DEFAULT '',
  total_amount REAL NOT NULL,
  paid_amount REAL DEFAULT 0,
  due_amount REAL DEFAULT 0,
  payment_status TEXT DEFAULT 'unpaid',
  payments JSONB DEFAULT '[]',
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dealer_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  po_no TEXT DEFAULT '',
  dealer_name TEXT NOT NULL,
  dealer_phone TEXT DEFAULT '',
  place TEXT DEFAULT '',
  village TEXT DEFAULT '',
  total_ordered_weight REAL DEFAULT 0,
  order_date DATE DEFAULT CURRENT_DATE,
  expected_delivery DATE,
  status TEXT DEFAULT 'pending',
  dispatches JSONB DEFAULT '[]',
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
