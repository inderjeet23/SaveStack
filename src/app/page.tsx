import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UPGRADE_CATEGORIES } from '@/types';

const stats = [
  { value: '$8,000+', label: 'Max IRA rebates' },
  { value: '30%', label: 'Federal tax credit' },
  { value: '5 Layers', label: 'Of stackable savings' },
];

const features = [
  {
    title: 'Federal Tax Credits',
    description: 'Historical 25C/25D credits for 2025 tax filing and current incentives.',
    badge: 'Up to 30%',
  },
  {
    title: 'IRA State Rebates',
    description: 'HOMES and HEEHRA programs with income-qualified savings up to $8,000.',
    badge: 'Income-based',
  },
  {
    title: 'Utility Rebates',
    description: 'Local utility company incentives that stack with federal and state programs.',
    badge: 'Varies',
  },
  {
    title: 'Manufacturer Promos',
    description: 'Seasonal rebates from Samsung, LG, Carrier, Rheem, and more.',
    badge: 'Limited time',
  },
];

const steps = [
  {
    step: '1',
    title: 'Enter your location',
    description: 'Your zip code determines state and utility programs available to you.',
  },
  {
    step: '2',
    title: 'Tell us about your home',
    description: 'Income, household size, and home type affect your eligibility.',
  },
  {
    step: '3',
    title: 'Select your upgrades',
    description: 'Choose the improvements you are considering for your home.',
  },
  {
    step: '4',
    title: 'See your savings',
    description: 'Get a personalized breakdown of every incentive you qualify for.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              Updated for 2026
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Find Every Energy Rebate
              <br />
              <span className="text-primary">Before You Pay Full Price</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Most homeowners miss $2,000–$10,000 in available incentives.
              <br className="hidden sm:inline" />
              Find out what you&apos;re leaving on the table.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/calculator">Calculate My Savings</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/guides/how-to-stack-energy-rebates">How Stacking Works</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              The Incentive Maze Is Costing You Money
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Five programs. Different rules. Different deadlines.
              <br />
              Miss one and the money&apos;s gone.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <Badge variant="secondary">{feature.badge}</Badge>
                  </div>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">How SaveStack Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Under 2 minutes. No PDFs. No government websites.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-4">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link href="/calculator">Start Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Upgrades We Cover */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Upgrades We Cover</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From HVAC to solar, we track incentives for all major home energy upgrades.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {UPGRADE_CATEGORIES.map((category) => (
              <Card key={category.id} className="hover:border-primary transition-colors">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">
                    {category.icon === 'thermometer' && '🌡️'}
                    {category.icon === 'droplets' && '💧'}
                    {category.icon === 'home' && '🏠'}
                    {category.icon === 'square' && '🪟'}
                    {category.icon === 'zap' && '⚡'}
                    {category.icon === 'sun' && '☀️'}
                    {category.icon === 'battery' && '🔋'}
                    {category.icon === 'plug' && '🔌'}
                    {category.icon === 'flame' && '🔥'}
                    {category.icon === 'wind' && '💨'}
                    {category.icon === 'cloud' && '☁️'}
                  </div>
                  <h3 className="font-medium text-sm">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">
              Ready to Find Your Savings?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Join thousands of homeowners who have discovered incentives they didn&apos;t know existed.
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/calculator">Calculate My Savings Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
