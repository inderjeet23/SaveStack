import Link from 'next/link';

const footerLinks = {
  states: [
    { name: 'California', href: '/california' },
    { name: 'New York', href: '/new-york' },
    { name: 'Colorado', href: '/colorado' },
    { name: 'Washington', href: '/washington' },
    { name: 'All States', href: '/states' },
  ],
  upgrades: [
    { name: 'Heat Pump Rebates', href: '/heat-pump-rebates' },
    { name: 'Solar Incentives', href: '/solar-rebates' },
    { name: 'Insulation Rebates', href: '/insulation-rebates' },
    { name: 'EV Charger Credits', href: '/ev-charger-rebates' },
  ],
  resources: [
    { name: 'How Stacking Works', href: '/guides/how-to-stack-energy-rebates' },
    { name: 'IRA Rebates Explained', href: '/guides/ira-rebate-program' },
    { name: 'Tax Credit Guide', href: '/guides/energy-tax-credits' },
    { name: 'FAQ', href: '/faq' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">S</span>
              </div>
              <span className="text-xl font-bold">SaveStack</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Find every energy rebate and tax credit available for your home upgrade.
              Stop leaving money on the table.
            </p>
          </div>

          {/* States */}
          <div>
            <h3 className="text-sm font-semibold">States</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.states.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Upgrades */}
          <div>
            <h3 className="text-sm font-semibold">Upgrades</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.upgrades.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold">Resources</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} SaveStack. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Disclaimer: Incentive amounts are estimates and subject to change.
              Always verify with official sources before making purchasing decisions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
