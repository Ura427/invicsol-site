'use client';

import { useEffect } from 'react';

/**
 * When a jump-link brings someone here from another page, the client-side
 * navigation can apply `#services` before the section is in the DOM and land
 * at the top. Once the content has mounted, do the jump the browser meant to.
 * Same-page anchor clicks never need this.
 */
export function ScrollToHash() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    document.getElementById(id)?.scrollIntoView();
  }, []);
  return null;
}
