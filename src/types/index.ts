// Incentive layer types
export type IncentiveLayer = 'federal' | 'state' | 'utility' | 'manufacturer';

// Incentive status
export type IncentiveStatus = 'active' | 'paused' | 'expired' | 'upcoming';

// Claim types
export type ClaimType = 'tax_credit' | 'point_of_sale' | 'mail_in' | 'instant';

// Home types
export type HomeType = 'single_family' | 'condo' | 'manufactured' | 'rental';

// Income threshold types for IRA programs
export type IncomeThresholdType = 'ami_80' | 'ami_150' | 'none';

// IRA program status
export type ProgramStatus = 'live' | 'paused' | 'pending' | 'not_participating';

// Upgrade categories
export type UpgradeCategory =
  | 'heat_pump'
  | 'heat_pump_water_heater'
  | 'insulation'
  | 'windows'
  | 'electrical_panel'
  | 'solar'
  | 'ev_charger'
  | 'battery'
  | 'stove'
  | 'dryer'
  | 'weatherization';

// Stacking rules for incentives
export interface StackingRules {
  combinable_with: IncentiveLayer[];
  excluded_with: string[]; // Specific incentive IDs or layer names
  notes?: string;
}

// Core incentive record
export interface Incentive {
  id: string;
  layer: IncentiveLayer;
  name: string;
  description: string;
  dollar_amount: number | null;
  percentage_amount: number | null;
  max_amount: number | null;
  upgrade_categories: UpgradeCategory[];
  state_code: string | null; // null for federal
  utility_name: string | null;
  income_threshold_type: IncomeThresholdType;
  home_types: HomeType[];
  ownership_required: boolean;
  stacking_rules: StackingRules;
  status: IncentiveStatus;
  effective_date: string | null;
  expiration_date: string | null;
  claim_type: ClaimType;
  claim_steps: string[];
  claim_url: string | null;
  source_url: string | null;
  last_verified: string;
  created_at: string;
}

// State IRA program status
export interface StateProgram {
  id: string;
  state_code: string;
  state_name: string;
  homes_status: ProgramStatus;
  heehra_status: ProgramStatus;
  homes_launch_date: string | null;
  heehra_launch_date: string | null;
  program_notes: string | null;
  last_updated: string;
}

// AMI threshold data
export interface AMIThreshold {
  id: string;
  zip_code: string;
  county_name: string | null;
  state_code: string;
  ami_80_4person: number;
  ami_150_4person: number;
  year: number;
}

// Upgrade category metadata
export interface UpgradeCategoryInfo {
  id: UpgradeCategory;
  name: string;
  description: string;
  icon: string;
  display_order: number;
}

// Calculator input from user
export interface CalculatorInput {
  zipCode: string;
  householdIncome: number;
  householdSize: number;
  homeType: HomeType;
  isOwner: boolean;
  selectedUpgrades: UpgradeCategory[];
}

// Eligibility result for a single incentive
export interface EligibilityResult {
  incentive: Incentive;
  eligible: boolean;
  reason?: string;
  estimatedAmount: number;
  percentageOfCost?: number;
}

// Grouped results by layer
export interface ResultsByLayer {
  federal: EligibilityResult[];
  state: EligibilityResult[];
  utility: EligibilityResult[];
  manufacturer: EligibilityResult[];
}

// Total savings calculation
export interface SavingsCalculation {
  results: ResultsByLayer;
  totalEligibleIncentives: number;
  totalStackableSavings: number;
  maxPotentialSavings: number;
  stateProgram: StateProgram | null;
}

// URL query params for shareable results
export interface ResultsQueryParams {
  zip: string;
  income: string;
  size: string;
  home: HomeType;
  owner: string;
  upgrades: string; // comma-separated
}

// State metadata for SEO pages
export interface StateMetadata {
  code: string;
  name: string;
  slug: string;
}

// US States list
export const US_STATES: StateMetadata[] = [
  { code: 'AL', name: 'Alabama', slug: 'alabama' },
  { code: 'AK', name: 'Alaska', slug: 'alaska' },
  { code: 'AZ', name: 'Arizona', slug: 'arizona' },
  { code: 'AR', name: 'Arkansas', slug: 'arkansas' },
  { code: 'CA', name: 'California', slug: 'california' },
  { code: 'CO', name: 'Colorado', slug: 'colorado' },
  { code: 'CT', name: 'Connecticut', slug: 'connecticut' },
  { code: 'DE', name: 'Delaware', slug: 'delaware' },
  { code: 'FL', name: 'Florida', slug: 'florida' },
  { code: 'GA', name: 'Georgia', slug: 'georgia' },
  { code: 'HI', name: 'Hawaii', slug: 'hawaii' },
  { code: 'ID', name: 'Idaho', slug: 'idaho' },
  { code: 'IL', name: 'Illinois', slug: 'illinois' },
  { code: 'IN', name: 'Indiana', slug: 'indiana' },
  { code: 'IA', name: 'Iowa', slug: 'iowa' },
  { code: 'KS', name: 'Kansas', slug: 'kansas' },
  { code: 'KY', name: 'Kentucky', slug: 'kentucky' },
  { code: 'LA', name: 'Louisiana', slug: 'louisiana' },
  { code: 'ME', name: 'Maine', slug: 'maine' },
  { code: 'MD', name: 'Maryland', slug: 'maryland' },
  { code: 'MA', name: 'Massachusetts', slug: 'massachusetts' },
  { code: 'MI', name: 'Michigan', slug: 'michigan' },
  { code: 'MN', name: 'Minnesota', slug: 'minnesota' },
  { code: 'MS', name: 'Mississippi', slug: 'mississippi' },
  { code: 'MO', name: 'Missouri', slug: 'missouri' },
  { code: 'MT', name: 'Montana', slug: 'montana' },
  { code: 'NE', name: 'Nebraska', slug: 'nebraska' },
  { code: 'NV', name: 'Nevada', slug: 'nevada' },
  { code: 'NH', name: 'New Hampshire', slug: 'new-hampshire' },
  { code: 'NJ', name: 'New Jersey', slug: 'new-jersey' },
  { code: 'NM', name: 'New Mexico', slug: 'new-mexico' },
  { code: 'NY', name: 'New York', slug: 'new-york' },
  { code: 'NC', name: 'North Carolina', slug: 'north-carolina' },
  { code: 'ND', name: 'North Dakota', slug: 'north-dakota' },
  { code: 'OH', name: 'Ohio', slug: 'ohio' },
  { code: 'OK', name: 'Oklahoma', slug: 'oklahoma' },
  { code: 'OR', name: 'Oregon', slug: 'oregon' },
  { code: 'PA', name: 'Pennsylvania', slug: 'pennsylvania' },
  { code: 'RI', name: 'Rhode Island', slug: 'rhode-island' },
  { code: 'SC', name: 'South Carolina', slug: 'south-carolina' },
  { code: 'SD', name: 'South Dakota', slug: 'south-dakota' },
  { code: 'TN', name: 'Tennessee', slug: 'tennessee' },
  { code: 'TX', name: 'Texas', slug: 'texas' },
  { code: 'UT', name: 'Utah', slug: 'utah' },
  { code: 'VT', name: 'Vermont', slug: 'vermont' },
  { code: 'VA', name: 'Virginia', slug: 'virginia' },
  { code: 'WA', name: 'Washington', slug: 'washington' },
  { code: 'WV', name: 'West Virginia', slug: 'west-virginia' },
  { code: 'WI', name: 'Wisconsin', slug: 'wisconsin' },
  { code: 'WY', name: 'Wyoming', slug: 'wyoming' },
];

// Upgrade categories with metadata
export const UPGRADE_CATEGORIES: UpgradeCategoryInfo[] = [
  {
    id: 'heat_pump',
    name: 'Heat Pump HVAC',
    description: 'Central heat pump for heating and cooling',
    icon: 'thermometer',
    display_order: 1,
  },
  {
    id: 'heat_pump_water_heater',
    name: 'Heat Pump Water Heater',
    description: 'Energy-efficient electric water heater',
    icon: 'droplets',
    display_order: 2,
  },
  {
    id: 'insulation',
    name: 'Insulation & Air Sealing',
    description: 'Improve home envelope efficiency',
    icon: 'home',
    display_order: 3,
  },
  {
    id: 'electrical_panel',
    name: 'Electrical Panel',
    description: 'Panel upgrade for electrification',
    icon: 'zap',
    display_order: 4,
  },
  {
    id: 'windows',
    name: 'Windows & Doors',
    description: 'Energy-efficient windows and exterior doors',
    icon: 'square',
    display_order: 5,
  },
  {
    id: 'solar',
    name: 'Solar Panels',
    description: 'Rooftop or ground-mount solar PV',
    icon: 'sun',
    display_order: 6,
  },
  {
    id: 'battery',
    name: 'Battery Storage',
    description: 'Home battery for solar storage',
    icon: 'battery',
    display_order: 7,
  },
  {
    id: 'ev_charger',
    name: 'EV Charger',
    description: 'Level 2 home charging station',
    icon: 'plug',
    display_order: 8,
  },
  {
    id: 'stove',
    name: 'Electric Stove',
    description: 'Induction or electric cooktop/range',
    icon: 'flame',
    display_order: 9,
  },
  {
    id: 'dryer',
    name: 'Heat Pump Dryer',
    description: 'Energy-efficient clothes dryer',
    icon: 'wind',
    display_order: 10,
  },
  {
    id: 'weatherization',
    name: 'Weatherization',
    description: 'General home weatherization work',
    icon: 'cloud',
    display_order: 11,
  },
];

// Income brackets for form selection
export const INCOME_BRACKETS = [
  { value: 30000, label: 'Under $30,000' },
  { value: 50000, label: '$30,000 - $50,000' },
  { value: 80000, label: '$50,000 - $80,000' },
  { value: 100000, label: '$80,000 - $100,000' },
  { value: 150000, label: '$100,000 - $150,000' },
  { value: 200000, label: '$150,000 - $200,000' },
  { value: 250000, label: '$200,000 - $250,000' },
  { value: 300000, label: 'Over $250,000' },
];

// Household sizes for form selection
export const HOUSEHOLD_SIZES = [
  { value: 1, label: '1 person' },
  { value: 2, label: '2 people' },
  { value: 3, label: '3 people' },
  { value: 4, label: '4 people' },
  { value: 5, label: '5 people' },
  { value: 6, label: '6 people' },
  { value: 7, label: '7 people' },
  { value: 8, label: '8+ people' },
];

// Home type options for form
export const HOME_TYPES = [
  { value: 'single_family' as HomeType, label: 'Single Family Home' },
  { value: 'condo' as HomeType, label: 'Condo / Townhouse' },
  { value: 'manufactured' as HomeType, label: 'Manufactured / Mobile Home' },
  { value: 'rental' as HomeType, label: 'Rental Property' },
];
