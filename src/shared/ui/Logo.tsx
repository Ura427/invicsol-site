import { LOGO_SHAPES, LOGO_VIEWBOX } from './logoShapes';

interface LogoProps {
  /** Rendered width in px. Height follows the mark's own proportions. */
  size?: number;
  className?: string;
}

const GOLD = '#f0a92a';
/**
 * navy-800, the same value as the footer's background — so on the footer the
 * mark's dark shapes fall away entirely and it reads as a single gold drawing,
 * which is what a one-colour version would have had to fake.
 */
const NAVY = '#0d1e3d';

/**
 * The INVICSOL mark.
 *
 * Geometry lives in logoShapes.ts, generated from the owner's artwork rather
 * than hand-drawn — see the comment there. This file only decides how it is
 * painted.
 *
 * Inline rather than an <img> so the mark participates in the page: it can be
 * recoloured, it never flashes in after the HTML, and it costs no request. The
 * shipping geometry is the simplified one for exactly that reason — the full
 * trace is twice the path data and the difference is invisible at 30px.
 */
export function Logo({ size = 32, className = '' }: LogoProps) {
  const height = Math.round((size * LOGO_VIEWBOX.height) / LOGO_VIEWBOX.width);

  return (
    <svg
      viewBox={`0 0 ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}`}
      width={size}
      height={height}
      className={className}
      role="img"
      aria-label="INVICSOL"
    >
      {LOGO_SHAPES.map((shape) => (
        <path key={shape.d} d={shape.d} fill={shape.gold ? GOLD : NAVY} />
      ))}
    </svg>
  );
}
