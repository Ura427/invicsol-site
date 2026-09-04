import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

type Variant = 'primary' | 'outline' | 'gold';

interface BaseProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

/**
 * A discriminated union on `href`: passing `href` renders a locale-aware
 * `<Link>`, omitting it renders a real `<button>`. This keeps callers from
 * needing a separate `LinkButton` component while still giving each rendered
 * element its correct, non-overlapping prop set (an anchor never accepts
 * `type="submit"`; a button never accepts `href`).
 */
type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & { href?: undefined };

type ButtonAsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const VARIANT_STYLES: Record<Variant, string> = {
  primary:
    'bg-navy-800 text-white hover:bg-navy-700 shadow-sm px-6 py-3 rounded-full font-semibold transition-colors',
  outline:
    'border border-navy-800 text-navy-800 hover:bg-navy-800 hover:text-white px-6 py-3 rounded-full font-semibold transition-colors',
  gold: 'bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 hover:brightness-105 shadow-sm px-6 py-3 rounded-full font-semibold transition-all',
};

export function Button(props: ButtonProps) {
  const { variant = 'primary', children, className = '', ...rest } = props;
  const classes = `${VARIANT_STYLES[variant]} inline-flex items-center justify-center gap-2 ${className}`;

  if ('href' in rest && typeof rest.href === 'string') {
    const { href, ...anchorRest } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  const buttonRest = rest as Omit<ButtonAsButton, 'variant' | 'children' | 'className'>;
  return (
    <button type={buttonRest.type ?? 'button'} className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
