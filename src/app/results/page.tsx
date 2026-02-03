import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TotalSavings, ResultsGrid, CopyLinkButton, EmailSubscribeForm } from '@/components/results';
import { Badge } from '@/components/ui/badge';
import type {
  CalculatorInput,
  HomeType,
  UpgradeCategory,
  SavingsCalculation,
  EligibilityResult,
  StateProgram,
} from '@/types';
import { evaluateAllIncentives, generateSavingsCalculation, DEFAULT_AMI } from '@/lib/calculations';
import { getIncentivesByUpgrades, getStateProgram } from '@/lib/supabase/queries';

export const metadata: Metadata = {
  title: 'Your Energy Savings Results | SaveStack',
  description: 'View your personalized energy rebates and tax credits breakdown.',
};

// Helper to extract state from zip code (first 3 digits indicate region)
// This is a simplified mapping - in production, use a proper zip-to-state lookup
function getStateFromZip(zipCode: string): string {
  const prefix = parseInt(zipCode.substring(0, 3), 10);
  // California zip codes: 900-961
  if (prefix >= 900 && prefix <= 961) return 'CA';
  // New York zip codes: 100-149
  if (prefix >= 100 && prefix <= 149) return 'NY';
  // Colorado zip codes: 800-816
  if (prefix >= 800 && prefix <= 816) return 'CO';
  // Michigan zip codes: 480-499
  if (prefix >= 480 && prefix <= 499) return 'MI';
  // North Carolina zip codes: 270-289
  if (prefix >= 270 && prefix <= 289) return 'NC';
  // Georgia zip codes: 300-319, 398-399
  if ((prefix >= 300 && prefix <= 319) || (prefix >= 398 && prefix <= 399)) return 'GA';
  // Arizona zip codes: 850-865
  if (prefix >= 850 && prefix <= 865) return 'AZ';
  // Washington zip codes: 980-994
  if (prefix >= 980 && prefix <= 994) return 'WA';
  // Maine zip codes: 039-049
  if (prefix >= 39 && prefix <= 49) return 'ME';
  // Wisconsin zip codes: 530-549
  if (prefix >= 530 && prefix <= 549) return 'WI';
  // Default to CA for demo
  return 'CA';
}

// Default state program for fallback
const defaultStateProgram: StateProgram = {
  id: 'default',
  state_code: 'CA',
  state_name: 'California',
  homes_status: 'pending',
  heehra_status: 'pending',
  homes_launch_date: null,
  heehra_launch_date: null,
  program_notes: null,
  last_updated: new Date().toISOString(),
};

interface ResultsPageProps {
  searchParams: Promise<{
    zip?: string;
    income?: string;
    size?: string;
    home?: string;
    owner?: string;
    upgrades?: string;
  }>;
}

async function ResultsContent({ searchParams }: ResultsPageProps) {
  const params = await searchParams;

  // Parse URL params
  const input: CalculatorInput = {
    zipCode: params.zip || '',
    householdIncome: parseInt(params.income || '100000', 10),
    householdSize: parseInt(params.size || '4', 10),
    homeType: (params.home as HomeType) || 'single_family',
    isOwner: params.owner !== '0',
    selectedUpgrades: params.upgrades
      ? (params.upgrades.split(',') as UpgradeCategory[])
      : [],
  };

  // Get state from zip code
  const stateCode = getStateFromZip(input.zipCode);

  // If no upgrades selected, show all
  const upgradesForEval =
    input.selectedUpgrades.length > 0
      ? input.selectedUpgrades
      : [
          'heat_pump',
          'heat_pump_water_heater',
          'insulation',
          'windows',
          'electrical_panel',
          'solar',
          'ev_charger',
          'battery',
          'stove',
          'dryer',
          'weatherization',
        ] as UpgradeCategory[];

  // Fetch data from Supabase
  const [incentives, stateProgram] = await Promise.all([
    getIncentivesByUpgrades(stateCode, upgradesForEval),
    getStateProgram(stateCode),
  ]);

  // Evaluate eligibility
  const results: EligibilityResult[] = evaluateAllIncentives(
    incentives,
    { ...input, selectedUpgrades: upgradesForEval },
    DEFAULT_AMI
  );

  // Generate savings calculation
  const calculation: SavingsCalculation = generateSavingsCalculation(
    results,
    stateProgram || defaultStateProgram
  );

  return (
    <div className="space-y-8">
      {/* Summary Header */}
      <div className="text-center">
        <Badge variant="secondary" className="mb-2">
          Results for {input.zipCode || 'your area'}
        </Badge>
        <h1 className="text-3xl font-bold md:text-4xl">Your Energy Savings</h1>
        <p className="mt-2 text-muted-foreground">
          Based on your {input.homeType.replace('_', ' ')} home and selected upgrades
        </p>
      </div>

      {/* Total Savings Card */}
      <TotalSavings calculation={calculation} />

      {/* Share/Save Actions */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button variant="outline" asChild>
          <Link href="/calculator">Modify Selections</Link>
        </Button>
        <CopyLinkButton />
      </div>

      {/* Detailed Results */}
      <div className="pt-8">
        <h2 className="text-2xl font-bold mb-6">Detailed Breakdown</h2>
        <ResultsGrid results={results} showIneligible={false} />
      </div>

      {/* Email Capture */}
      <div className="mt-12 p-6 rounded-lg bg-muted/50 text-center">
        <h3 className="text-lg font-semibold mb-2">Get Notified of New Incentives</h3>
        <p className="text-sm text-muted-foreground mb-4">
          We&apos;ll email you when new rebates become available in your area.
        </p>
        <EmailSubscribeForm />
      </div>
    </div>
  );
}

export default async function ResultsPage(props: ResultsPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <Suspense
          fallback={
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Calculating your savings...</p>
            </div>
          }
        >
          <ResultsContent searchParams={props.searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
