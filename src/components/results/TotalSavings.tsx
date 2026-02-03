'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SavingsCalculation } from '@/types';
import { getStackingExplanation } from '@/lib/calculations';

interface TotalSavingsProps {
  calculation: SavingsCalculation;
}

export function TotalSavings({ calculation }: TotalSavingsProps) {
  const { results, totalEligibleIncentives, totalStackableSavings, stateProgram } =
    calculation;

  const stackingExplanation = getStackingExplanation(results);

  // Count incentives by layer
  const federalCount = results.federal.length;
  const stateCount = results.state.length;
  const utilityCount = results.utility.length;
  const manufacturerCount = results.manufacturer.length;

  // Calculate savings range (show ~90% as low end to soften precision)
  const lowEstimate = Math.round(totalStackableSavings * 0.9 / 100) * 100;
  const highEstimate = totalStackableSavings;

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
      <CardHeader className="text-center pb-2">
        <CardDescription className="text-primary">Your Estimated Savings</CardDescription>
        <CardTitle className="text-4xl font-bold text-primary md:text-5xl">
          ${lowEstimate.toLocaleString()}–${highEstimate.toLocaleString()}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          from {totalEligibleIncentives} eligible incentive
          {totalEligibleIncentives !== 1 ? 's' : ''}
        </p>
      </CardHeader>

      <CardContent>
        {/* Stacking explanation */}
        <p className="text-center text-muted-foreground mb-6">{stackingExplanation}</p>

        {/* Breakdown by layer */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-100">
            <div className="text-2xl font-bold text-blue-800">{federalCount}</div>
            <div className="text-xs text-blue-600">Federal</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-50 border border-green-100">
            <div className="text-2xl font-bold text-green-800">{stateCount}</div>
            <div className="text-xs text-green-600">State</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-purple-50 border border-purple-100">
            <div className="text-2xl font-bold text-purple-800">{utilityCount}</div>
            <div className="text-xs text-purple-600">Utility</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-orange-50 border border-orange-100">
            <div className="text-2xl font-bold text-orange-800">{manufacturerCount}</div>
            <div className="text-xs text-orange-600">Manufacturer</div>
          </div>
        </div>

        {/* State program status */}
        {stateProgram && (
          <div className="mt-6 p-4 rounded-lg bg-background border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{stateProgram.state_name} IRA Programs</h4>
                <p className="text-sm text-muted-foreground">{stateProgram.program_notes}</p>
              </div>
              <div className="flex gap-2">
                <Badge
                  variant={stateProgram.homes_status === 'live' ? 'default' : 'secondary'}
                >
                  HOMES: {stateProgram.homes_status}
                </Badge>
                <Badge
                  variant={stateProgram.heehra_status === 'live' ? 'default' : 'secondary'}
                >
                  HEEHRA: {stateProgram.heehra_status}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          Savings are estimates based on available program data. Actual amounts may vary.
          Always verify with official sources before making purchasing decisions.
        </p>
      </CardContent>
    </Card>
  );
}
