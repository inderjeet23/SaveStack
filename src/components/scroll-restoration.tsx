'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollRestoration component
 *
 * Resets scroll position to top-left on route changes.
 * This ensures users always start at the top of a new page,
 * preventing disorientation on mobile devices.
 */
export function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    // Reset scroll to top on route change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
