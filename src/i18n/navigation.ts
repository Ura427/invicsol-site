import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Every internal link must go through these locale-aware exports — a bare
// `<a href="/...">` or next/link drops the locale prefix and gets bounced by
// middleware.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
