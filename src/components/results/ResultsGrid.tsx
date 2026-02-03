'use client';

import { useState } from 'react';
import { IncentiveCard } from './IncentiveCard';
import { Button } from '@/components/ui/button';
import type { EligibilityResult, IncentiveLayer } from '@/types';

interface ResultsGridProps {
  results: EligibilityResult[];
  showIneligible?: boolean;
}

const layerOrder: IncentiveLayer[] = ['federal', 'state', 'utility', 'manufacturer'];

const layerTitles: Record<IncentiveLayer, string> = {
  federal: 'Federal Tax Credits',
  state: 'State Rebates',
  utility: 'Utility Incentives',
  manufacturer: 'Manufacturer Promotions',
};

const layerDescriptions: Record<IncentiveLayer, string> = {
  federal: 'Tax credits claimed when you file your federal tax return',
  state: 'IRA-funded HOMES and HEEHRA rebate programs',
  utility: 'Incentives from your local utility company',
  manufacturer: 'Seasonal rebates and promotions from manufacturers',
};

export function ResultsGrid({ results, showIneligible = false }: ResultsGridProps) {
  const [expandedLayers, setExpandedLayers] = useState<Set<IncentiveLayer>>(
    new Set(layerOrder)
  );

  // Group results by layer
  const groupedResults = layerOrder.reduce(
    (acc, layer) => {
      acc[layer] = results.filter((r) => r.incentive.layer === layer);
      return acc;
    },
    {} as Record<IncentiveLayer, EligibilityResult[]>
  );

  // Filter eligible/ineligible
  const getVisibleResults = (layerResults: EligibilityResult[]) => {
    if (showIneligible) return layerResults;
    return layerResults.filter((r) => r.eligible);
  };

  const toggleLayer = (layer: IncentiveLayer) => {
    setExpandedLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layer)) {
        next.delete(layer);
      } else {
        next.add(layer);
      }
      return next;
    });
  };

  const hasResults = results.some((r) => showIneligible || r.eligible);

  if (!hasResults) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No incentives found</h3>
        <p className="text-muted-foreground">
          We couldn&apos;t find any incentives matching your criteria. Try adjusting your
          selections or contact us for help.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {layerOrder.map((layer) => {
        const layerResults = groupedResults[layer];
        const visibleResults = getVisibleResults(layerResults);
        const eligibleCount = layerResults.filter((r) => r.eligible).length;
        const isExpanded = expandedLayers.has(layer);

        if (visibleResults.length === 0) return null;

        return (
          <section key={layer} className="space-y-4">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleLayer(layer)}
            >
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  {layerTitles[layer]}
                  <span className="text-sm font-normal text-muted-foreground">
                    ({eligibleCount} eligible)
                  </span>
                </h2>
                <p className="text-sm text-muted-foreground">{layerDescriptions[layer]}</p>
              </div>
              <Button variant="ghost" size="sm">
                {isExpanded ? '−' : '+'}
              </Button>
            </div>

            {isExpanded && (
              <div className="grid gap-4 md:grid-cols-2">
                {visibleResults.map((result) => (
                  <IncentiveCard key={result.incentive.id} result={result} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
