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

/**
 * Flat fills, no shadows, no gradients. The gold variant was a
 * gold-500→gold-600 gradient with a drop shadow; a decorative gradient on the
 * one element that carries every conversion is exactly the kind of default this
 * design avoids. Solid gold reads as more deliberate and stays the single
 * saturated colour on the page.
 */
const VARIANT_STYLES: Record<Variant, string> = {
  primary:
    'bg-navy-800 text-white hover:bg-navy-700 px-7 py-3.5 rounded-full font-medium tracking-[-0.01em] transition-colors',
  outline:
    'border border-navy-800/70 text-navy-800 hover:bg-navy-800 hover:text-white px-7 py-3.5 rounded-full font-medium tracking-[-0.01em] transition-colors',
  gold: 'bg-gold-500 text-navy-900 hover:bg-gold-400 px-7 py-3.5 rounded-full font-medium tracking-[-0.01em] transition-colors',
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
