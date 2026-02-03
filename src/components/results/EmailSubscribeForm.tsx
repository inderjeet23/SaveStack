'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function EmailSubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('submitting');

    // TODO: Wire up to subscribeEmail() from Supabase queries
    // For now, simulate success
    await new Promise((resolve) => setTimeout(resolve, 500));
    setStatus('success');
    setEmail('');
  };

  if (status === 'success') {
    return (
      <p className="text-sm text-green-600">
        Thanks! We&apos;ll notify you when new incentives are available.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-sm mx-auto sm:flex-row">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
      <Button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Subscribing...' : 'Subscribe'}
      </Button>
    </form>
  );
}
