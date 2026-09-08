interface LogoProps {
  /** Rendered height in px. Below 40 the compact variant is used automatically. */
  size?: number;
  /**
   * 'brand' is the two-tone mark — the default.
   * 'mono' inherits `currentColor` for everything, for dark backgrounds or any
   * single-colour context (footer, print, stamps).
   */
  tone?: 'brand' | 'mono';
  className?: string;
}

const RATIO = 64 / 52;
const GOLD = '#f0a92a';
const NAVY = '#15263f';

/** The nine tapered rays of the full mark, generated on a 200°–340° arc. */
const RAYS = [
  'M11.72 22.00 L17.49 23.09 L16.84 24.88Z',
  'M13.94 17.95 L19.12 20.72 L17.96 22.23Z',
  'M17.28 14.75 L21.39 18.96 L19.83 20.04Z',
  'M21.43 12.70 L24.08 17.95 L22.27 18.52Z',
  'M26.00 12.00 L26.95 17.80 L25.05 17.80Z',
  'M30.57 12.70 L29.73 18.52 L27.92 17.95Z',
  'M34.72 14.75 L32.17 20.04 L30.61 18.96Z',
  'M38.06 17.95 L34.04 22.23 L32.88 20.72Z',
  'M40.28 22.00 L35.16 24.88 L34.51 23.09Z',
];

const PIN_OUTER =
  'M26 63.2C25.4 63.2 24.9 63 24.5 62.6 20.2 58.3 3.5 44.6 3.5 26.5 3.5 14.1 13.6 4 26 4S48.5 14.1 48.5 26.5C48.5 44.6 31.8 58.3 27.5 62.6 27.1 63 26.6 63.2 26 63.2Z';

/**
 * The INVICSOL mark, traced to vector from the supplied flat artwork.
 *
 * Shipped as a responsive pair rather than one drawing. The detailed version
 * carries nine rays and a six-line panel grid; under roughly 40px those merge
 * into a smudge, so a compact version takes over with five rays and one grid
 * line per plane. Both keep the inverse fill — left plane solid, right plane
 * open — since that light-across-the-array asymmetry is what makes the mark
 * recognisable, and it shrinks far better than the grid does.
 *
 * Inline rather than an <img> so `mono` can inherit currentColor; an <img>
 * cannot be recoloured by the page, which is what the navy footer needs.
 */
export function Logo({ size = 32, tone = 'brand', className = '' }: LogoProps) {
  const compact = size < 40;
  const common = {
    viewBox: '0 0 52 64',
    width: size,
    height: Math.round(size * RATIO),
    className,
    role: 'img' as const,
    'aria-label': 'INVICSOL',
  };

  // Mono is line art with an open interior, not the two-tone mark with its
  // colours collapsed. Collapsing them paints the sun and panels in the same
  // colour as the body behind them and yields a featureless blob.
  if (tone === 'mono') {
    return (
      <svg
        {...common}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M26 61.4C21.6 56.9 5.5 43.6 5.5 26.5 5.5 15.2 14.7 6 26 6S46.5 15.2 46.5 26.5C46.5 43.6 30.4 56.9 26 61.4Z"
          strokeWidth="3"
        />
        <path d="M19.4 27.4A6.6 6.6 0 0 1 32.6 27.4Z" fill="currentColor" stroke="none" />
        <g strokeWidth="2">
          <path d="M26 15.8V18.4" />
          <path d="M18.6 18.8 20.2 21.1" />
          <path d="M33.4 18.8 31.8 21.1" />
          <path d="M14.8 26H17.2" />
          <path d="M37.2 26H34.8" />
          <path d="M12.4 32.6 25 29.8V52.6" />
          <path d="M27 29.8 39.6 32.6" />
          <path d="M27 52.6C33.2 47.6 38 40.8 39.6 32.6" />
          <path d="M25 52.6C18.8 47.6 14 40.8 12.4 32.6" />
          <path d="M13.9 38.4 25 36.2" />
          <path d="M27 36.2 38.1 38.4" />
        </g>
      </svg>
    );
  }

  if (compact) {
    return (
      <svg {...common}>
        <path d={PIN_OUTER} fill={GOLD} />
        <path
          d="M26 58.6C21.6 54.2 7.8 42.2 7.8 26.5 7.8 16.5 15.9 8.4 26 8.4S44.2 16.5 44.2 26.5C44.2 42.2 30.4 54.2 26 58.6Z"
          fill={NAVY}
        />
        <path d="M18.6 27.6A7.4 7.4 0 0 1 33.4 27.6Z" fill={GOLD} />
        <g stroke={GOLD} strokeWidth="2.4" strokeLinecap="round">
          <path d="M26 15.6V18.4" />
          <path d="M17.9 18.6 19.6 21" />
          <path d="M34.1 18.6 32.4 21" />
          <path d="M14.2 25.6H16.8" />
          <path d="M37.8 25.6H35.2" />
        </g>
        <path d="M9.4 31.4 24.7 28.2V53.8C17.6 48.4 11.6 40.6 9.4 31.4Z" fill={GOLD} />
        <path
          d="M27.3 28.2 42.6 31.4C40.4 40.6 34.4 48.4 27.3 53.8Z"
          fill="none"
          stroke={GOLD}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M28.2 36.4 41 38.6" stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
        <path d="M11.2 37 24.2 34.8" stroke={NAVY} strokeWidth="2" strokeLinecap="round" />
        <path d="M24.9 28.4V54" stroke={GOLD} strokeWidth="1.9" strokeLinecap="round" />
        <path d="M27.1 28.4V54" stroke={GOLD} strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d={PIN_OUTER} fill={GOLD} />
      <path
        d="M26 60.1C21.4 55.4 6.2 42.7 6.2 26.5 6.2 15.6 15.1 6.7 26 6.7S45.8 15.6 45.8 26.5C45.8 42.7 30.6 55.4 26 60.1Z"
        fill={NAVY}
      />

      <path d="M17.9 27.4A8.1 8.1 0 0 1 34.1 27.4Z" fill={GOLD} />
      <g fill={GOLD}>
        {RAYS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      {/* Left plane: solid gold with the grid cut out in navy */}
      <path d="M7.6 30.8 24.9 27.4V55.4C17.2 49.6 10.1 41.2 7.6 30.8Z" fill={GOLD} />
      <g stroke={NAVY} strokeWidth="1.25" strokeLinecap="round" fill="none">
        <path d="M15.3 29.3 21.4 53.4" />
        <path d="M9.1 37.4 24.4 34.4" />
        <path d="M12.6 45 24.6 42.4" />
      </g>

      {/* Right plane: open, with the grid drawn on in gold */}
      <path
        d="M27.1 27.4 44.4 30.8C41.9 41.2 34.8 49.6 27.1 55.4Z"
        fill="none"
        stroke={GOLD}
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <g stroke={GOLD} strokeWidth="1.25" strokeLinecap="round" fill="none">
        <path d="M36.7 29.3 30.6 53.4" />
        <path d="M27.6 34.4 42.9 37.4" />
        <path d="M27.4 42.4 39.4 45" />
      </g>

      <g stroke={GOLD} strokeWidth="1.25" strokeLinecap="round">
        <path d="M24.9 27.8V55.2" />
        <path d="M27.1 27.8V55.2" />
      </g>
    </svg>
  );
}
