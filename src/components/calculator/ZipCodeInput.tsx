'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ZipCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  detectedState?: string;
}

export function ZipCodeInput({ value, onChange, onNext, detectedState }: ZipCodeInputProps) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '').slice(0, 5);
    onChange(input);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.length !== 5) {
      setError('Please enter a valid 5-digit zip code');
      return;
    }
    onNext();
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Where is your home located?</CardTitle>
        <CardDescription>
          Your zip code helps us find state and utility incentives available in your area.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input
              id="zipCode"
              type="text"
              inputMode="numeric"
              placeholder="Enter your 5-digit zip code"
              value={value}
              onChange={handleChange}
              className="text-center text-2xl tracking-widest"
              autoFocus
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            {detectedState && (
              <p className="text-sm text-muted-foreground text-center">
                Detected state: <span className="font-medium">{detectedState}</span>
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={value.length !== 5}>
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
