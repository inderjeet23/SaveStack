import type { AMIThreshold, IncomeThresholdType } from '@/types';

/**
 * AMI (Area Median Income) adjustment factors by household size
 * Base AMI is for a 4-person household; these factors scale for other sizes
 * Source: HUD methodology
 */
const AMI_ADJUSTMENT_FACTORS: Record<number, number> = {
  1: 0.7,
  2: 0.8,
  3: 0.9,
  4: 1.0,
  5: 1.08,
  6: 1.16,
  7: 1.24,
  8: 1.32,
};

/**
 * Get the AMI adjustment factor for a household size
 */
export function getAMIAdjustmentFactor(householdSize: number): number {
  if (householdSize < 1) return AMI_ADJUSTMENT_FACTORS[1];
  if (householdSize > 8) return AMI_ADJUSTMENT_FACTORS[8];
  return AMI_ADJUSTMENT_FACTORS[householdSize];
}

/**
 * Calculate the income threshold for a given AMI level and household size
 */
export function calculateIncomeThreshold(
  amiThreshold: AMIThreshold,
  householdSize: number,
  level: IncomeThresholdType
): number {
  if (level === 'none') return Infinity;

  const factor = getAMIAdjustmentFactor(householdSize);
  const baseAMI = level === 'ami_80' ? amiThreshold.ami_80_4person : amiThreshold.ami_150_4person;

  // Adjust from 4-person base to actual household size
  return Math.round(baseAMI * factor);
}

/**
 * Check if a household income qualifies for a given AMI level
 */
export function checkIncomeEligibility(
  householdIncome: number,
  householdSize: number,
  amiThreshold: AMIThreshold | null,
  requiredLevel: IncomeThresholdType
): { eligible: boolean; reason?: string } {
  // No income requirement
  if (requiredLevel === 'none') {
    return { eligible: true };
  }

  // No AMI data available for this area
  if (!amiThreshold) {
    return {
      eligible: true,
      reason: 'AMI data not available for your area. Eligibility assumed.',
    };
  }

  const threshold = calculateIncomeThreshold(amiThreshold, householdSize, requiredLevel);

  if (householdIncome <= threshold) {
    return { eligible: true };
  }

  const thresholdLabel = requiredLevel === 'ami_80' ? '80% AMI' : '150% AMI';
  return {
    eligible: false,
    reason: `Household income exceeds ${thresholdLabel} threshold of $${threshold.toLocaleString()} for your area.`,
  };
}

/**
 * Default AMI values for areas without specific data
 * Based on national median (used as fallback)
 */
export const DEFAULT_AMI: AMIThreshold = {
  id: 'default',
  zip_code: '00000',
  county_name: 'National Average',
  state_code: 'US',
  ami_80_4person: 69000, // ~80% of national median
  ami_150_4person: 129000, // ~150% of national median
  year: 2024,
};
