interface LogoProps {
  /** Rendered height in px. Below 40 the compact variant is used automatically. */
  size?: number;
  /**
   * 'brand' is navy body on gold pin — the default.
   * 'mono' inherits `currentColor` for both, for dark backgrounds or anywhere
   * the mark has to sit inside a single-colour context (footer, print, stamps).
   */
  tone?: 'brand' | 'mono';
  className?: string;
}

const RATIO = 64 / 52;

/**
 * The INVICSOL mark, as a responsive pair rather than one drawing.
 *
 * The detailed version carries seven rays and a three-row panel grid; under
 * roughly 40px those hairlines merge into a smudge, so a compact version takes
 * over with five rays, one grid line, thicker strokes and a filled panel array.
 * Same silhouette either way, so they read as one logo.
 *
 * Inline rather than an <img> so `mono` can inherit currentColor — an <img>
 * cannot be recoloured by the page, which is exactly what the navy footer needs.
 */
export function Logo({ size = 32, tone = 'brand', className = '' }: LogoProps) {
  const compact = size < 40;

  // Mono is drawn as line art, not as the two-tone mark with its colours
  // collapsed. Collapsing them paints the sun and panels in the same colour as
  // the body they sit on, which produces a solid blob — the interior detail has
  // to be left open so the background shows through instead.
  if (tone === 'mono') {
    return (
      <svg
        viewBox="0 0 52 64"
        width={size}
        height={Math.round(size * RATIO)}
        className={className}
        role="img"
        aria-label="INVICSOL"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M26 61.4C21.6 56.9 5.5 43.6 5.5 26.5 5.5 15.2 14.7 6 26 6S46.5 15.2 46.5 26.5C46.5 43.6 30.4 56.9 26 61.4Z"
          strokeWidth="3.4"
        />
        <path d="M19.4 27.4A6.6 6.6 0 0 1 32.6 27.4Z" fill="currentColor" stroke="none" />
        <g strokeWidth="2.2">
          <path d="M26 15.8V18.6" />
          <path d="M18.4 18.8 20.1 21.2" />
          <path d="M33.6 18.8 31.9 21.2" />
          <path d="M14.4 26H17" />
          <path d="M37.6 26H35" />
          <path d="M12.6 33.4 26 31.2 39.4 33.4 26 49.4Z" />
          <path d="M26 32V48.6" />
          <path d="M15 39.6 26 37.8 37 39.6" />
        </g>
      </svg>
    );
  }

  const pin = '#e8a020';
  const body = '#0d1e3d';
  const detail = '#e8a020';
  const cut = '#0d1e3d';

  return (
    <svg
      viewBox="0 0 52 64"
      width={size}
      height={Math.round(size * RATIO)}
      className={className}
      role="img"
      aria-label="INVICSOL"
    >
      <path
        d="M26 63.2C25.4 63.2 24.9 63 24.5 62.6 20.2 58.3 3.5 44.6 3.5 26.5 3.5 14.1 13.6 4 26 4S48.5 14.1 48.5 26.5C48.5 44.6 31.8 58.3 27.5 62.6 27.1 63 26.6 63.2 26 63.2Z"
        fill={pin}
      />

      {compact ? (
        <>
          <path
            d="M26 57.4C21.4 52.6 9 41.4 9 26.5 9 17.1 16.6 9.5 26 9.5S43 17.1 43 26.5C43 41.4 30.6 52.6 26 57.4Z"
            fill={body}
          />
          <path d="M18.8 27.4A7.2 7.2 0 0 1 33.2 27.4Z" fill={detail} />
          <g stroke={detail} strokeWidth="2.6" strokeLinecap="round">
            <path d="M26 15.4V18.6" />
            <path d="M17.6 18.4 19.4 21" />
            <path d="M34.4 18.4 32.6 21" />
            <path d="M13.6 25.6H16.6" />
            <path d="M38.4 25.6H35.4" />
          </g>
          <path d="M11 32.6 26 30.2 41 32.6 26 50.6Z" fill={detail} />
          <g stroke={cut} strokeWidth="2.2" strokeLinecap="round">
            <path d="M26 31V49.4" />
            <path d="M13.6 38.6 26 36.8 38.4 38.6" />
          </g>
        </>
      ) : (
        <>
          <path
            d="M26 58.6C21.6 54.1 8 42.2 8 26.5 8 16.6 16.1 8.5 26 8.5S44 16.6 44 26.5C44 42.2 30.4 54.1 26 58.6Z"
            fill={body}
          />
          <path d="M18.4 26.2A7.6 7.6 0 0 1 33.6 26.2Z" fill={detail} />
          <g stroke={detail} strokeWidth="1.7" strokeLinecap="round">
            <path d="M26 12.6V16.4" />
            <path d="M18.6 14.6 20.5 17.9" />
            <path d="M33.4 14.6 31.5 17.9" />
            <path d="M13.2 20 16.5 21.9" />
            <path d="M38.8 20 35.5 21.9" />
            <path d="M11.2 26.2H15" />
            <path d="M40.8 26.2H37" />
          </g>
          <g
            stroke={detail}
            strokeWidth="1.7"
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="none"
          >
            <path d="M9 32.4 26 29.6 43 32.4 26 52.6Z" />
            <path d="M26 29.6V52.6" />
            <path d="M11.6 39.2 26 36.8 40.4 39.2" />
            <path d="M15.6 45.4 26 43.8 36.4 45.4" />
          </g>
        </>
      )}
    </svg>
  );
}
