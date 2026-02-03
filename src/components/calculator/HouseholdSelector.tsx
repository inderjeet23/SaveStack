'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { INCOME_BRACKETS, HOUSEHOLD_SIZES, HOME_TYPES, HomeType } from '@/types';

interface HouseholdSelectorProps {
  income: number;
  householdSize: number;
  homeType: HomeType;
  isOwner: boolean;
  onIncomeChange: (value: number) => void;
  onHouseholdSizeChange: (value: number) => void;
  onHomeTypeChange: (value: HomeType) => void;
  onOwnershipChange: (value: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export function HouseholdSelector({
  income,
  householdSize,
  homeType,
  isOwner,
  onIncomeChange,
  onHouseholdSizeChange,
  onHomeTypeChange,
  onOwnershipChange,
  onNext,
  onBack,
}: HouseholdSelectorProps) {
  const isValid = income > 0 && householdSize > 0 && homeType;

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Tell us about your household</CardTitle>
        <CardDescription>
          This information helps determine your eligibility for income-based rebates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Household Income */}
          <div className="space-y-2">
            <Label htmlFor="income">Household Income</Label>
            <Select
              value={income.toString()}
              onValueChange={(val) => onIncomeChange(Number(val))}
            >
              <SelectTrigger id="income">
                <SelectValue placeholder="Select income range" />
              </SelectTrigger>
              <SelectContent>
                {INCOME_BRACKETS.map((bracket) => (
                  <SelectItem key={bracket.value} value={bracket.value.toString()}>
                    {bracket.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              We only use this to check eligibility. We don&apos;t store your exact income.
            </p>
          </div>

          {/* Household Size */}
          <div className="space-y-2">
            <Label htmlFor="householdSize">Household Size</Label>
            <Select
              value={householdSize.toString()}
              onValueChange={(val) => onHouseholdSizeChange(Number(val))}
            >
              <SelectTrigger id="householdSize">
                <SelectValue placeholder="Select household size" />
              </SelectTrigger>
              <SelectContent>
                {HOUSEHOLD_SIZES.map((size) => (
                  <SelectItem key={size.value} value={size.value.toString()}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Home Type */}
          <div className="space-y-2">
            <Label htmlFor="homeType">Home Type</Label>
            <Select value={homeType} onValueChange={(val) => onHomeTypeChange(val as HomeType)}>
              <SelectTrigger id="homeType">
                <SelectValue placeholder="Select home type" />
              </SelectTrigger>
              <SelectContent>
                {HOME_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ownership Status */}
          <div className="space-y-3">
            <Label>Do you own this home?</Label>
            <RadioGroup
              value={isOwner ? 'yes' : 'no'}
              onValueChange={(val) => onOwnershipChange(val === 'yes')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="owner-yes" />
                <Label htmlFor="owner-yes" className="font-normal cursor-pointer">
                  Yes, I own it
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="owner-no" />
                <Label htmlFor="owner-no" className="font-normal cursor-pointer">
                  No, I rent
                </Label>
              </div>
            </RadioGroup>
            {!isOwner && (
              <p className="text-sm text-amber-600">
                Some incentives require homeownership, but many are still available to renters.
              </p>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
            <Button type="button" onClick={onNext} disabled={!isValid} className="flex-1">
              Continue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
