'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const SEARCH_DEBOUNCE_MS = 300;

/**
 * URL-backed filter state for the admin lists.
 *
 * next/navigation, not @/i18n/navigation: admin paths carry no locale prefix
 * and the locale-aware router would add one, which the auth gate then bounces.
 */
export function useFilterParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string | null, { replace = false } = {}) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);

      const query = params.toString();
      const href = query ? `${pathname}?${query}` : pathname;
      // replace for keystrokes, push for deliberate choices — otherwise the
      // back button fills with one entry per character typed.
      if (replace) router.replace(href);
      else router.push(href);
    },
    [router, pathname, searchParams],
  );

  const clear = useCallback(() => router.push(pathname), [router, pathname]);

  return { searchParams, setParam, clear };
}

/**
 * Keeps a text input responsive while the URL — and therefore the query —
 * updates behind it.
 *
 * Without the debounce every keystroke is a round trip; without the local
 * state the input value lags a render behind what was typed, which on a slow
 * query feels like dropped characters.
 */
export function useDebouncedSearch(initial: string, onCommit: (value: string) => void) {
  const [value, setValue] = useState(initial);

  // The committed value, tracked so the effect can tell a real edit from a
  // re-render and from an external URL change.
  const committedRef = useRef(initial);

  // Assigned in an effect, never during render: React may render a component
  // several times before committing, and a ref written during render would
  // capture a callback from a render that never happened.
  const onCommitRef = useRef(onCommit);
  useEffect(() => {
    onCommitRef.current = onCommit;
  });

  // Re-sync when the URL changes from somewhere else — Clear, or the back
  // button — so the box does not keep showing a term that no longer applies.
  useEffect(() => {
    if (committedRef.current !== initial) {
      committedRef.current = initial;
      setValue(initial);
    }
  }, [initial]);

  useEffect(() => {
    if (value === committedRef.current) return;

    const id = setTimeout(() => {
      committedRef.current = value;
      onCommitRef.current(value);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(id);
  }, [value]);

  return [value, setValue] as const;
}
