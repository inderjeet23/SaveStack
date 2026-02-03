# SaveStack - Project Context

## GitHub Workflow (IMPORTANT)

**Repository:** https://github.com/inderjeet23/SaveStack.git

### At Session Start
```bash
git pull origin main
```
Always pull latest changes before starting work.

### After Making Changes
```bash
git add -A && git commit -m "Description of changes

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>" && git push
```
Push changes after completing a feature or fix. Netlify auto-deploys on push.

---

## What This Project Is
SaveStack is a web-based home energy incentive calculator that aggregates rebates and tax credits across 5 layers:
- Federal tax credits (25C/25D)
- IRA state rebates (HOMES + HEEHRA)
- Utility rebates
- Manufacturer promotions

Users enter their zip code, income, home type, and desired upgrades to see personalized savings.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL) - Connected
- **Styling**: Tailwind CSS + shadcn/ui
- **Hosting**: Netlify (auto-deploys from GitHub)

## Current Status
MVP is deployed. Dark mode working. **Database needs real incentive data.**

### What's Built
- Landing page with hero, features, upgrade categories
- Multi-step calculator (zip code → household → upgrades → results)
- URL-based results page (shareable links)
- Eligibility calculation engine with AMI/income checks
- Stacking logic for combining incentives
- Dark mode toggle
- Netlify deployment

### What's Needed
1. **Seed real incentive data** - Federal 25C/25D credits + state IRA rebates
2. **Seed AMI thresholds** - Zip code to state mapping + income thresholds
3. **Fix zip-to-state lookup** - Currently defaults to CA (needs AMI data)

## Key Files

### App Structure
```
src/app/
├── page.tsx              # Landing page
├── calculator/page.tsx   # Multi-step form
├── results/page.tsx      # Results with URL params
└── layout.tsx            # Root layout with Header/Footer/ThemeProvider
```

### Components
```
src/components/
├── calculator/           # ZipCodeInput, HouseholdSelector, UpgradeSelector
├── results/              # IncentiveCard, TotalSavings, ResultsGrid, CopyLinkButton
├── layout/               # Header, Footer
├── ui/                   # shadcn components
├── theme-provider.tsx    # next-themes provider
└── theme-toggle.tsx      # Dark mode toggle
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

### Environment Variables
Located in `.env.local` (not committed):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Types
- All TypeScript interfaces: `src/types/index.ts`

## Commands
```bash
npm run dev      # Start dev server
npm run build    # Build for production
git pull         # Get latest from GitHub
git push         # Deploy to Netlify (auto)
```

## Supabase
- Project: `qetjtpecxrdhvlkhangi`
- Dashboard: https://supabase.com/dashboard/project/qetjtpecxrdhvlkhangi

## PRD Reference
Full PRD is at: `/Users/inder/Documents/SaveStack/SaveStack_PRD.docx`

Launch states: California, New York, Colorado, Michigan, North Carolina, Georgia, Arizona, Washington, Maine, Wisconsin
