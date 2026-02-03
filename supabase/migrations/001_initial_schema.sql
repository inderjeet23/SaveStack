-- SaveStack Database Schema
-- Migration: 001_initial_schema
-- Created: February 2026

-- Core incentive data table
CREATE TABLE incentives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layer TEXT NOT NULL CHECK (layer IN ('federal', 'state', 'utility', 'manufacturer')),
  name TEXT NOT NULL,
  description TEXT,
  dollar_amount INTEGER,
  percentage_amount INTEGER,
  max_amount INTEGER,
  upgrade_categories TEXT[] NOT NULL,
  state_code TEXT,
  utility_name TEXT,
  income_threshold_type TEXT DEFAULT 'none' CHECK (income_threshold_type IN ('ami_80', 'ami_150', 'none')),
  home_types TEXT[] DEFAULT ARRAY['single_family', 'condo', 'manufactured'],
  ownership_required BOOLEAN DEFAULT true,
  stacking_rules JSONB DEFAULT '{"combinable_with": [], "excluded_with": []}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'expired', 'upcoming')),
  effective_date DATE,
  expiration_date DATE,
  claim_type TEXT CHECK (claim_type IN ('tax_credit', 'point_of_sale', 'mail_in', 'instant')),
  claim_steps TEXT[],
  claim_url TEXT,
  source_url TEXT,
  last_verified TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for common queries
CREATE INDEX idx_incentives_layer ON incentives(layer);
CREATE INDEX idx_incentives_state_code ON incentives(state_code);
CREATE INDEX idx_incentives_status ON incentives(status);
CREATE INDEX idx_incentives_upgrade_categories ON incentives USING GIN(upgrade_categories);

-- State IRA program status tracker
CREATE TABLE state_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code TEXT NOT NULL UNIQUE,
  state_name TEXT NOT NULL,
  homes_status TEXT DEFAULT 'pending' CHECK (homes_status IN ('live', 'paused', 'pending', 'not_participating')),
  heehra_status TEXT DEFAULT 'pending' CHECK (heehra_status IN ('live', 'paused', 'pending', 'not_participating')),
  homes_launch_date DATE,
  heehra_launch_date DATE,
  program_notes TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for state lookups
CREATE INDEX idx_state_programs_state_code ON state_programs(state_code);

-- AMI thresholds by zip code (HUD data)
CREATE TABLE ami_thresholds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zip_code TEXT NOT NULL,
  county_name TEXT,
  state_code TEXT NOT NULL,
  ami_80_4person INTEGER NOT NULL,
  ami_150_4person INTEGER NOT NULL,
  year INTEGER DEFAULT 2024,
  UNIQUE(zip_code, year)
);

-- Create indexes for AMI lookups
CREATE INDEX idx_ami_thresholds_zip_code ON ami_thresholds(zip_code);
CREATE INDEX idx_ami_thresholds_state_code ON ami_thresholds(state_code);

-- Upgrade categories reference table
CREATE TABLE upgrade_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INTEGER
);

-- Email subscribers for alerts
CREATE TABLE email_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  zip_code TEXT,
  state_code TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Create index for email lookups
CREATE INDEX idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX idx_email_subscribers_state_code ON email_subscribers(state_code);

-- Insert default upgrade categories
INSERT INTO upgrade_categories (id, name, description, icon, display_order) VALUES
  ('heat_pump', 'Heat Pump HVAC', 'Central heat pump for heating and cooling', 'thermometer', 1),
  ('heat_pump_water_heater', 'Heat Pump Water Heater', 'Energy-efficient electric water heater', 'droplets', 2),
  ('insulation', 'Insulation & Air Sealing', 'Improve home envelope efficiency', 'home', 3),
  ('windows', 'Windows & Doors', 'Energy-efficient windows and exterior doors', 'square', 4),
  ('electrical_panel', 'Electrical Panel', 'Panel upgrade for electrification', 'zap', 5),
  ('solar', 'Solar Panels', 'Rooftop or ground-mount solar PV', 'sun', 6),
  ('battery', 'Battery Storage', 'Home battery for solar storage', 'battery', 7),
  ('ev_charger', 'EV Charger', 'Level 2 home charging station', 'plug', 8),
  ('stove', 'Electric Stove', 'Induction or electric cooktop/range', 'flame', 9),
  ('dryer', 'Heat Pump Dryer', 'Energy-efficient clothes dryer', 'wind', 10),
  ('weatherization', 'Weatherization', 'General home weatherization work', 'cloud', 11);

-- Insert state programs for 10 launch states
INSERT INTO state_programs (state_code, state_name, homes_status, heehra_status, program_notes) VALUES
  ('CA', 'California', 'live', 'live', 'Programs active through GoGreenFinancing.com'),
  ('NY', 'New York', 'live', 'pending', 'HOMES live via NYSERDA; HEEHRA pending'),
  ('CO', 'Colorado', 'live', 'live', 'Programs active through Colorado Energy Office'),
  ('MI', 'Michigan', 'pending', 'pending', 'Programs expected Q2 2026'),
  ('NC', 'North Carolina', 'pending', 'pending', 'Programs in development'),
  ('GA', 'Georgia', 'pending', 'pending', 'Programs expected 2026'),
  ('AZ', 'Arizona', 'pending', 'pending', 'Programs in development'),
  ('WA', 'Washington', 'live', 'pending', 'HOMES live; HEEHRA pending'),
  ('ME', 'Maine', 'live', 'pending', 'HOMES live via Efficiency Maine'),
  ('WI', 'Wisconsin', 'pending', 'pending', 'Programs expected 2026');

-- Row Level Security (RLS) policies
-- Enable RLS on all tables
ALTER TABLE incentives ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ami_thresholds ENABLE ROW LEVEL SECURITY;
ALTER TABLE upgrade_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public read access to incentives, state_programs, ami_thresholds, and upgrade_categories
CREATE POLICY "Public read access for incentives" ON incentives FOR SELECT USING (true);
CREATE POLICY "Public read access for state_programs" ON state_programs FOR SELECT USING (true);
CREATE POLICY "Public read access for ami_thresholds" ON ami_thresholds FOR SELECT USING (true);
CREATE POLICY "Public read access for upgrade_categories" ON upgrade_categories FOR SELECT USING (true);

-- Allow insert for email subscribers (public can subscribe)
CREATE POLICY "Public insert for email_subscribers" ON email_subscribers FOR INSERT WITH CHECK (true);

-- Function to update last_updated timestamp
CREATE OR REPLACE FUNCTION update_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update last_updated on state_programs
CREATE TRIGGER state_programs_last_updated
  BEFORE UPDATE ON state_programs
  FOR EACH ROW
  EXECUTE FUNCTION update_last_updated();

-- Function to update last_verified timestamp on incentives
CREATE OR REPLACE FUNCTION update_last_verified()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_verified = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update last_verified on incentives
CREATE TRIGGER incentives_last_verified
  BEFORE UPDATE ON incentives
  FOR EACH ROW
  EXECUTE FUNCTION update_last_verified();
