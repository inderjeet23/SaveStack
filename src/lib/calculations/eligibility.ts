import type {
  Incentive,
  CalculatorInput,
  EligibilityResult,
  AMIThreshold,
  UpgradeCategory,
  HomeType,
} from '@/types';
import { checkIncomeEligibility } from './ami';

/**
 * Check if an incentive applies to the selected upgrades
 */
function checkUpgradeMatch(
  incentive: Incentive,
  selectedUpgrades: UpgradeCategory[]
): boolean {
  // Check if any of the incentive's upgrade categories match selected upgrades
  return incentive.upgrade_categories.some((category) =>
    selectedUpgrades.includes(category as UpgradeCategory)
  );
}

/**
 * Check if the home type is eligible for an incentive
 */
function checkHomeTypeEligibility(
  incentive: Incentive,
  homeType: HomeType
): { eligible: boolean; reason?: string } {
  if (!incentive.home_types || incentive.home_types.length === 0) {
    return { eligible: true };
  }

  if (incentive.home_types.includes(homeType)) {
    return { eligible: true };
  }

  return {
    eligible: false,
    reason: `This incentive is only available for: ${incentive.home_types.join(', ')}.`,
  };
}

/**
 * Check if ownership status meets requirements
 */
function checkOwnershipEligibility(
  incentive: Incentive,
  isOwner: boolean
): { eligible: boolean; reason?: string } {
  if (!incentive.ownership_required) {
    return { eligible: true };
  }

  if (isOwner) {
    return { eligible: true };
  }

  return {
    eligible: false,
    reason: 'This incentive requires homeownership.',
  };
}

/**
 * Check if the incentive status is active
 */
function checkStatusEligibility(
  incentive: Incentive
): { eligible: boolean; reason?: string } {
  if (incentive.status === 'active') {
    return { eligible: true };
  }

  if (incentive.status === 'upcoming') {
    return {
      eligible: false,
      reason: `This incentive is not yet available. Expected: ${incentive.effective_date || 'TBD'}.`,
    };
  }

  if (incentive.status === 'paused') {
    return {
      eligible: false,
      reason: 'This incentive is currently paused.',
    };
  }

  if (incentive.status === 'expired') {
    return {
      eligible: false,
      reason: `This incentive expired on ${incentive.expiration_date}.`,
    };
  }

  return { eligible: true };
}

/**
 * Calculate the estimated dollar amount for an incentive
 */
function calculateEstimatedAmount(incentive: Incentive): number {
  // If there's a fixed dollar amount, use it
  if (incentive.dollar_amount) {
    return incentive.max_amount
      ? Math.min(incentive.dollar_amount, incentive.max_amount)
      : incentive.dollar_amount;
  }

  // If there's only a percentage, we can't calculate without project cost
  // Return max_amount if available, otherwise return 0
  if (incentive.percentage_amount && incentive.max_amount) {
    return incentive.max_amount;
  }

  return 0;
}

/**
 * Evaluate eligibility for a single incentive
 */
export function evaluateIncentive(
  incentive: Incentive,
  input: CalculatorInput,
  amiThreshold: AMIThreshold | null
): EligibilityResult {
  const reasons: string[] = [];
  let isEligible = true;

  // Check upgrade match
  if (!checkUpgradeMatch(incentive, input.selectedUpgrades)) {
    return {
      incentive,
      eligible: false,
      reason: 'Does not apply to selected upgrades.',
      estimatedAmount: 0,
    };
  }

  // Check status
  const statusCheck = checkStatusEligibility(incentive);
  if (!statusCheck.eligible) {
    isEligible = false;
    if (statusCheck.reason) reasons.push(statusCheck.reason);
  }

  // Check home type
  const homeTypeCheck = checkHomeTypeEligibility(incentive, input.homeType);
  if (!homeTypeCheck.eligible) {
    isEligible = false;
    if (homeTypeCheck.reason) reasons.push(homeTypeCheck.reason);
  }

  // Check ownership
  const ownershipCheck = checkOwnershipEligibility(incentive, input.isOwner);
  if (!ownershipCheck.eligible) {
    isEligible = false;
    if (ownershipCheck.reason) reasons.push(ownershipCheck.reason);
  }

  // Check income eligibility
  const incomeCheck = checkIncomeEligibility(
    input.householdIncome,
    input.householdSize,
    amiThreshold,
    incentive.income_threshold_type
  );
  if (!incomeCheck.eligible) {
    isEligible = false;
    if (incomeCheck.reason) reasons.push(incomeCheck.reason);
  }

  return {
    incentive,
    eligible: isEligible,
    reason: reasons.length > 0 ? reasons.join(' ') : undefined,
    estimatedAmount: isEligible ? calculateEstimatedAmount(incentive) : 0,
    percentageOfCost: incentive.percentage_amount || undefined,
  };
}

/**
 * Evaluate eligibility for multiple incentives
 */
export function evaluateAllIncentives(
  incentives: Incentive[],
  input: CalculatorInput,
  amiThreshold: AMIThreshold | null
): EligibilityResult[] {
  return incentives.map((incentive) => evaluateIncentive(incentive, input, amiThreshold));
}

/**
 * Filter to only eligible incentives
 */
export function getEligibleIncentives(
  incentives: Incentive[],
  input: CalculatorInput,
  amiThreshold: AMIThreshold | null
): EligibilityResult[] {
  return evaluateAllIncentives(incentives, input, amiThreshold).filter(
    (result) => result.eligible
  );
}
