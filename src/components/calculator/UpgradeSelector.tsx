'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { UPGRADE_CATEGORIES, UpgradeCategory } from '@/types';

interface UpgradeSelectorProps {
  selected: UpgradeCategory[];
  onChange: (selected: UpgradeCategory[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const iconMap: Record<string, string> = {
  thermometer: '🌡️',
  droplets: '💧',
  home: '🏠',
  square: '🪟',
  zap: '⚡',
  sun: '☀️',
  battery: '🔋',
  plug: '🔌',
  flame: '🔥',
  wind: '💨',
  cloud: '☁️',
};

export function UpgradeSelector({ selected, onChange, onNext, onBack }: UpgradeSelectorProps) {
  const handleToggle = (categoryId: UpgradeCategory) => {
    if (selected.includes(categoryId)) {
      onChange(selected.filter((id) => id !== categoryId));
    } else {
      onChange([...selected, categoryId]);
    }
  };

  const handleSelectAll = () => {
    if (selected.length === UPGRADE_CATEGORIES.length) {
      onChange([]);
    } else {
      onChange(UPGRADE_CATEGORIES.map((c) => c.id));
    }
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">What upgrades are you considering?</CardTitle>
        <CardDescription>
          Select all that apply. We&apos;ll find incentives for each upgrade you&apos;re interested in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Select All Toggle */}
          <div className="flex items-center justify-between pb-2 border-b">
            <span className="text-sm text-muted-foreground">
              {selected.length} of {UPGRADE_CATEGORIES.length} selected
            </span>
            <Button variant="ghost" size="sm" onClick={handleSelectAll}>
              {selected.length === UPGRADE_CATEGORIES.length ? 'Clear All' : 'Select All'}
            </Button>
          </div>

          {/* Upgrade Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {UPGRADE_CATEGORIES.map((category) => {
              const isSelected = selected.includes(category.id);
              return (
                <div
                  key={category.id}
                  className={`flex items-start space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleToggle(category.id)}
                >
                  <Checkbox
                    id={category.id}
                    checked={isSelected}
                    onCheckedChange={() => handleToggle(category.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={category.id}
                      className="flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <span className="text-lg">{iconMap[category.icon]}</span>
                      {category.name}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* "Not Sure" option - prominent */}
          <div className="text-center pt-2 pb-2 border-t">
            <p className="text-sm text-muted-foreground mb-3 mt-4">Not sure what you need?</p>
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => {
                onChange(UPGRADE_CATEGORIES.map((c) => c.id));
                onNext();
              }}
            >
              Show me everything
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
            <Button
              type="button"
              onClick={onNext}
              disabled={selected.length === 0}
              className="flex-1"
            >
              See My Savings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
