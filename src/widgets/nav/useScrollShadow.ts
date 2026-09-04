import { useEffect, useState } from 'react';

/** Pure-ish hook: true once the page has scrolled past a small threshold. */
export function useScrollShadow(threshold = 8): boolean {
  const [hasShadow, setHasShadow] = useState(false);

  useEffect(() => {
    const onScroll = () => setHasShadow(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return hasShadow;
}
