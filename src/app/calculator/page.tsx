import { Metadata } from 'next';
import { CalculatorForm } from '@/components/calculator';

export const metadata: Metadata = {
  title: 'Energy Savings Calculator | SaveStack',
  description:
    'Calculate your personalized home energy rebates and tax credits. Find federal, state, utility, and manufacturer incentives in under 2 minutes.',
  openGraph: {
    title: 'Energy Savings Calculator | SaveStack',
    description:
      'Calculate your personalized home energy rebates and tax credits. Find federal, state, utility, and manufacturer incentives in under 2 minutes.',
  },
};

export default function CalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold md:text-4xl">Find Your Energy Savings</h1>
          <p className="mt-2 text-muted-foreground">
            Answer a few questions to see all available incentives for your home.
          </p>
        </div>

        <CalculatorForm />
      </div>
    </div>
  );
}
