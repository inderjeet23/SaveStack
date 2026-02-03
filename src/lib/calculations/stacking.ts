import type {
  EligibilityResult,
  ResultsByLayer,
  SavingsCalculation,
  StateProgram,
  IncentiveLayer,
} from '@/types';

/**
 * Group eligibility results by incentive layer
 */
export function groupByLayer(results: EligibilityResult[]): ResultsByLayer {
  const grouped: ResultsByLayer = {
    federal: [],
    state: [],
    utility: [],
    manufacturer: [],
  };

  for (const result of results) {
    const layer = result.incentive.layer as IncentiveLayer;
    if (grouped[layer]) {
      grouped[layer].push(result);
    }
  }

  return grouped;
}

/**
 * Check if two incentives can be stacked together
 */
export function canStack(
  incentive1: EligibilityResult,
  incentive2: EligibilityResult
): boolean {
  const rules1 = incentive1.incentive.stacking_rules;
  const rules2 = incentive2.incentive.stacking_rules;

  // Check if incentive1 excludes incentive2's layer or ID
  if (rules1.excluded_with.includes(incentive2.incentive.layer)) {
    return false;
  }
  if (rules1.excluded_with.includes(incentive2.incentive.id)) {
    return false;
  }

  // Check if incentive2 excludes incentive1's layer or ID
  if (rules2.excluded_with.includes(incentive1.incentive.layer)) {
    return false;
  }
  if (rules2.excluded_with.includes(incentive1.incentive.id)) {
    return false;
  }

  return true;
}

/**
 * Calculate total stackable savings from eligible incentives
 * Uses a greedy approach to maximize savings while respecting stacking rules
 */
export function calculateStackableSavings(results: EligibilityResult[]): number {
  const eligibleResults = results.filter((r) => r.eligible);

  if (eligibleResults.length === 0) return 0;

  // Sort by estimated amount (descending) to prioritize higher-value incentives
  const sorted = [...eligibleResults].sort(
    (a, b) => b.estimatedAmount - a.estimatedAmount
  );

  const selectedIncentives: EligibilityResult[] = [];
  let totalSavings = 0;

  for (const result of sorted) {
    // Check if this incentive can stack with all previously selected incentives
    const canAddToStack = selectedIncentives.every((selected) =>
      canStack(result, selected)
    );

    if (canAddToStack) {
      selectedIncentives.push(result);
      totalSavings += result.estimatedAmount;
    }
  }

  return totalSavings;
}

/**
 * Calculate maximum potential savings (if all incentives could stack)
 */
export function calculateMaxPotentialSavings(results: EligibilityResult[]): number {
  return results
    .filter((r) => r.eligible)
    .reduce((sum, r) => sum + r.estimatedAmount, 0);
}

/**
 * Generate a complete savings calculation
 */
export function generateSavingsCalculation(
  results: EligibilityResult[],
  stateProgram: StateProgram | null
): SavingsCalculation {
  const eligibleResults = results.filter((r) => r.eligible);
  const groupedResults = groupByLayer(eligibleResults);

  return {
    results: groupedResults,
    totalEligibleIncentives: eligibleResults.length,
    totalStackableSavings: calculateStackableSavings(eligibleResults),
    maxPotentialSavings: calculateMaxPotentialSavings(eligibleResults),
    stateProgram,
  };
}

/**
 * Get stacking explanation for display
 */
export function getStackingExplanation(results: ResultsByLayer): string {
  const layers: string[] = [];

  if (results.federal.length > 0) layers.push('federal tax credits');
  if (results.state.length > 0) layers.push('state rebates');
  if (results.utility.length > 0) layers.push('utility rebates');
  if (results.manufacturer.length > 0) layers.push('manufacturer promos');

  if (layers.length === 0) {
    return 'No eligible incentives found.';
  }

  if (layers.length === 1) {
    return `You qualify for ${layers[0]}.`;
  }

  const lastLayer = layers.pop();
  return `You can stack ${layers.join(', ')} and ${lastLayer} for maximum savings.`;
}

/**
 * Check if there are any stacking conflicts among eligible incentives
 */
export function findStackingConflicts(
  results: EligibilityResult[]
): { incentive1: string; incentive2: string; reason: string }[] {
  const conflicts: { incentive1: string; incentive2: string; reason: string }[] = [];
  const eligibleResults = results.filter((r) => r.eligible);

  for (let i = 0; i < eligibleResults.length; i++) {
    for (let j = i + 1; j < eligibleResults.length; j++) {
      if (!canStack(eligibleResults[i], eligibleResults[j])) {
        const rules1 = eligibleResults[i].incentive.stacking_rules;
        const rules2 = eligibleResults[j].incentive.stacking_rules;

        let reason = 'These incentives cannot be combined.';
        if (rules1.notes) reason = rules1.notes;
        else if (rules2.notes) reason = rules2.notes;

        conflicts.push({
          incentive1: eligibleResults[i].incentive.name,
          incentive2: eligibleResults[j].incentive.name,
          reason,
        });
      }
    }
  }

  return conflicts;
}
