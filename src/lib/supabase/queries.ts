import { supabase } from './client';
import type {
  Incentive,
  StateProgram,
  AMIThreshold,
  UpgradeCategory,
  IncentiveLayer,
} from '@/types';

/**
 * Fetch all active incentives for a given state
 */
export async function getIncentivesByState(stateCode: string): Promise<Incentive[]> {
  const { data, error } = await supabase
    .from('incentives')
    .select('*')
    .or(`state_code.eq.${stateCode},state_code.is.null,layer.eq.federal`)
    .eq('status', 'active')
    .order('layer');

  if (error) {
    console.error('Error fetching incentives:', error);
    return [];
  }

  return data as Incentive[];
}

/**
 * Fetch incentives by upgrade categories
 */
export async function getIncentivesByUpgrades(
  stateCode: string,
  upgrades: UpgradeCategory[]
): Promise<Incentive[]> {
  const { data, error } = await supabase
    .from('incentives')
    .select('*')
    .or(`state_code.eq.${stateCode},state_code.is.null,layer.eq.federal`)
    .eq('status', 'active')
    .overlaps('upgrade_categories', upgrades)
    .order('layer');

  if (error) {
    console.error('Error fetching incentives by upgrades:', error);
    return [];
  }

  return data as Incentive[];
}

/**
 * Fetch incentives by layer
 */
export async function getIncentivesByLayer(layer: IncentiveLayer): Promise<Incentive[]> {
  const { data, error } = await supabase
    .from('incentives')
    .select('*')
    .eq('layer', layer)
    .eq('status', 'active');

  if (error) {
    console.error('Error fetching incentives by layer:', error);
    return [];
  }

  return data as Incentive[];
}

/**
 * Fetch state program status
 */
export async function getStateProgram(stateCode: string): Promise<StateProgram | null> {
  const { data, error } = await supabase
    .from('state_programs')
    .select('*')
    .eq('state_code', stateCode)
    .single();

  if (error) {
    console.error('Error fetching state program:', error);
    return null;
  }

  return data as StateProgram;
}

/**
 * Fetch all state programs
 */
export async function getAllStatePrograms(): Promise<StateProgram[]> {
  const { data, error } = await supabase
    .from('state_programs')
    .select('*')
    .order('state_name');

  if (error) {
    console.error('Error fetching state programs:', error);
    return [];
  }

  return data as StateProgram[];
}

/**
 * Fetch AMI threshold for a zip code
 */
export async function getAMIByZipCode(zipCode: string): Promise<AMIThreshold | null> {
  const { data, error } = await supabase
    .from('ami_thresholds')
    .select('*')
    .eq('zip_code', zipCode)
    .order('year', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    // Not an error if no data found - some zip codes may not have AMI data
    if (error.code !== 'PGRST116') {
      console.error('Error fetching AMI threshold:', error);
    }
    return null;
  }

  return data as AMIThreshold;
}

/**
 * Get state code from zip code
 * This uses a simple lookup - in production you'd want a more complete mapping
 */
export async function getStateFromZipCode(zipCode: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('ami_thresholds')
    .select('state_code')
    .eq('zip_code', zipCode)
    .limit(1)
    .single();

  if (error) {
    return null;
  }

  return data?.state_code || null;
}

/**
 * Subscribe an email to alerts
 */
export async function subscribeEmail(
  email: string,
  zipCode?: string,
  stateCode?: string
): Promise<boolean> {
  const { error } = await supabase.from('email_subscribers').upsert(
    {
      email,
      zip_code: zipCode,
      state_code: stateCode,
      is_active: true,
    },
    {
      onConflict: 'email',
    }
  );

  if (error) {
    console.error('Error subscribing email:', error);
    return false;
  }

  return true;
}

/**
 * Fetch utility incentives for a specific utility
 */
export async function getUtilityIncentives(utilityName: string): Promise<Incentive[]> {
  const { data, error } = await supabase
    .from('incentives')
    .select('*')
    .eq('layer', 'utility')
    .eq('utility_name', utilityName)
    .eq('status', 'active');

  if (error) {
    console.error('Error fetching utility incentives:', error);
    return [];
  }

  return data as Incentive[];
}

/**
 * Search incentives by name or description
 */
export async function searchIncentives(query: string): Promise<Incentive[]> {
  const { data, error } = await supabase
    .from('incentives')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .eq('status', 'active')
    .limit(20);

  if (error) {
    console.error('Error searching incentives:', error);
    return [];
  }

  return data as Incentive[];
}
