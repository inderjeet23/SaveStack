'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">S</span>
          </div>
          <span className="text-xl font-bold">SaveStack</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/calculator"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Calculator
          </Link>
          <Link
            href="/california"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            States
          </Link>
          <Link
            href="/guides"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Guides
          </Link>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center space-x-4">
          <Button asChild>
            <Link href="/calculator">Find My Savings</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container mx-auto flex flex-col space-y-4 px-4 py-4">
            <Link
              href="/calculator"
              className="text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Calculator
            </Link>
            <Link
              href="/california"
              className="text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              States
            </Link>
            <Link
              href="/guides"
              className="text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Guides
            </Link>
            <Button asChild className="w-full">
              <Link href="/calculator" onClick={() => setMobileMenuOpen(false)}>
                Find My Savings
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
