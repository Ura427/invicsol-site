'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const LINKS = [
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/projects', label: 'Projects' },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <span className="font-bold text-gray-900">INVICSOL Admin</span>
          <nav className="flex gap-4">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium ${
                  pathname.startsWith(link.href)
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
