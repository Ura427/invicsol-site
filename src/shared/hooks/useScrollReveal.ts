'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Reveals an element once it enters the viewport, via IntersectionObserver
 * rather than a scroll listener (cheaper, and doesn't run on every scroll frame).
 * jsdom doesn't implement IntersectionObserver, so tests rely on the global mock
 * installed in jest.setup.ts.
 */
export function useScrollReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
