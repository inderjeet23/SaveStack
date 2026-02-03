# SaveStack - Project Context

## What This Project Is
SaveStack is a web-based home energy incentive calculator that aggregates rebates and tax credits across 5 layers:
- Federal tax credits (25C/25D)
- IRA state rebates (HOMES + HEEHRA)
- Utility rebates
- Manufacturer promotions

Users enter their zip code, income, home type, and desired upgrades to see personalized savings.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL) - NOT YET SET UP
- **Styling**: Tailwind CSS + shadcn/ui
- **Hosting**: Vercel (planned)

## Current Status
MVP code is complete and builds successfully. **Supabase needs to be set up.**

### What's Built
- Landing page with hero, features, upgrade categories
- Multi-step calculator (zip code → household → upgrades → results)
- URL-based results page (shareable links)
- Eligibility calculation engine with AMI/income checks
- Stacking logic for combining incentives
- Mock incentive data for demo purposes

### What's Needed
1. **Create Supabase project** - Use MCP to create project called "savestack"
2. **Run database migration** - Execute `supabase/migrations/001_initial_schema.sql`
3. **Update .env.local** - Add real Supabase URL and anon key
4. **Seed real incentive data** - Research and add actual incentives for 10 launch states

## Key Files

### App Structure
```
src/app/
├── page.tsx              # Landing page
├── calculator/page.tsx   # Multi-step form
├── results/page.tsx      # Results with URL params
└── layout.tsx            # Root layout with Header/Footer
```

### Components
```
src/components/
├── calculator/           # ZipCodeInput, HouseholdSelector, UpgradeSelector
├── results/              # IncentiveCard, TotalSavings, ResultsGrid
├── layout/               # Header, Footer
└── ui/                   # shadcn components
```

### Core Logic
```
src/lib/
├── calculations/
│   ├── eligibility.ts    # Check user eligibility for incentives
│   ├── stacking.ts       # Determine which incentives can combine
│   └── ami.ts            # Area Median Income calculations
└── supabase/
    ├── client.ts         # Supabase client
    └── queries.ts        # Database queries
```

### Database
- Schema: `supabase/migrations/001_initial_schema.sql`
- Tables: `incentives`, `state_programs`, `ami_thresholds`, `upgrade_categories`, `email_subscribers`

### Types
- All TypeScript interfaces: `src/types/index.ts`

## Commands
```bash
npm run dev      # Start dev server
npm run build    # Build for production
```

## Next Steps After Supabase Setup
1. Run migration to create tables
2. Seed state_programs data (10 launch states)
3. Seed incentive data (federal + state for CA, NY, CO, etc.)
4. Update results page to fetch from Supabase instead of mock data
5. Deploy to Vercel

## PRD Reference
Full PRD is at: `/Users/inder/Documents/SaveStack/SaveStack_PRD.docx`

Launch states: California, New York, Colorado, Michigan, North Carolina, Georgia, Arizona, Washington, Maine, Wisconsin
