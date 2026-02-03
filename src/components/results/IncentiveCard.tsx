'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { EligibilityResult, IncentiveLayer } from '@/types';

interface IncentiveCardProps {
  result: EligibilityResult;
  showDetails?: boolean;
}

const layerColors: Record<IncentiveLayer, string> = {
  federal: 'bg-blue-100 text-blue-800 border-blue-200',
  state: 'bg-green-100 text-green-800 border-green-200',
  utility: 'bg-purple-100 text-purple-800 border-purple-200',
  manufacturer: 'bg-orange-100 text-orange-800 border-orange-200',
};

const layerLabels: Record<IncentiveLayer, string> = {
  federal: 'Federal',
  state: 'State',
  utility: 'Utility',
  manufacturer: 'Manufacturer',
};

const claimTypeLabels: Record<string, string> = {
  tax_credit: 'Tax Credit',
  point_of_sale: 'Point of Sale',
  mail_in: 'Mail-in Rebate',
  instant: 'Instant Rebate',
};

// Friction levels for claim types
type FrictionLevel = 'low' | 'medium' | 'high';

const claimFriction: Record<string, { level: FrictionLevel; label: string }> = {
  tax_credit: { level: 'low', label: 'Claimed on tax return' },
  instant: { level: 'low', label: 'Applied automatically' },
  point_of_sale: { level: 'medium', label: 'Applied at checkout' },
  mail_in: { level: 'medium', label: 'Requires application' },
};

const frictionColors: Record<FrictionLevel, string> = {
  low: 'text-green-600',
  medium: 'text-amber-600',
  high: 'text-red-600',
};

const frictionIcons: Record<FrictionLevel, string> = {
  low: '●',
  medium: '●',
  high: '●',
};

export function IncentiveCard({ result, showDetails = true }: IncentiveCardProps) {
  const { incentive, eligible, reason, estimatedAmount, percentageOfCost } = result;
  const layer = incentive.layer as IncentiveLayer;
  const friction = incentive.claim_type ? claimFriction[incentive.claim_type] : null;

  return (
    <Card className={`relative ${!eligible ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className={layerColors[layer]}>
                {layerLabels[layer]}
              </Badge>
              {incentive.claim_type && (
                <Badge variant="secondary" className="text-xs">
                  {claimTypeLabels[incentive.claim_type]}
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg">{incentive.name}</CardTitle>
            {friction && eligible && (
              <p className={`text-xs mt-1 ${frictionColors[friction.level]}`}>
                {frictionIcons[friction.level]} {friction.label}
              </p>
            )}
          </div>
          <div className="text-right">
            {estimatedAmount > 0 && (
              <div className="text-2xl font-bold text-primary">
                ${estimatedAmount.toLocaleString()}
              </div>
            )}
            {percentageOfCost && (
              <div className="text-sm text-muted-foreground">
                {percentageOfCost}% of cost
              </div>
            )}
            {incentive.max_amount && estimatedAmount === 0 && (
              <div className="text-lg font-semibold text-muted-foreground">
                Up to ${incentive.max_amount.toLocaleString()}
              </div>
            )}
          </div>
        </div>
        {incentive.description && (
          <CardDescription className="mt-2">{incentive.description}</CardDescription>
        )}
      </CardHeader>

      {showDetails && (
        <CardContent className="pt-0">
          {/* Eligibility status */}
          {!eligible && reason && (
            <div className="mb-4 rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
              <strong>Not eligible:</strong> {reason}
            </div>
          )}

          {eligible && (
            <>
              {/* Claim steps */}
              {incentive.claim_steps && incentive.claim_steps.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">How to claim:</h4>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                    {incentive.claim_steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Expiration */}
              {incentive.expiration_date && (
                <p className="text-sm text-muted-foreground mb-4">
                  Expires: {new Date(incentive.expiration_date).toLocaleDateString()}
                </p>
              )}

              {/* CTA */}
              {incentive.claim_url && (
                <Button asChild variant="outline" size="sm">
                  <a
                    href={incentive.claim_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn More & Apply
                  </a>
                </Button>
              )}
            </>
          )}

          {/* Last verified */}
          {incentive.last_verified && (
            <p className="text-xs text-muted-foreground mt-4">
              Last verified:{' '}
              {new Date(incentive.last_verified).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      )}

      {/* Eligible indicator */}
      {eligible && (
        <div className="absolute top-3 right-3">
          <div className="h-3 w-3 rounded-full bg-green-500" title="Eligible" />
        </div>
      )}
    </Card>
  );
}
