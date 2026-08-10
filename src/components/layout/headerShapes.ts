// Builds a single closed SVG path for the header's "pill bar with a circular
// badge fused into it" silhouette — one continuous shape (not two overlapping
// boxes), so it can take a single drop-shadow with no seam between bar and
// circle.

interface Point {
  x: number;
  y: number;
}

const round = (n: number) => Math.round(n * 100) / 100;
const p = ({ x, y }: Point) => `${round(x)} ${round(y)}`;

/**
 * Bar with the circular badge fused over its left end-cap (desktop header).
 * The badge circle is concentric with the bar's left cap and larger than it,
 * so it fully encloses that cap — the two straight edges of the bar simply
 * meet the circle's boundary where it crosses the top/bottom lines.
 */
export function leftBumpPillPath({
  width,
  sideInset,
  barTop,
  barHeight,
  circleSize,
  squareRightEnd = false,
}: {
  width: number;
  sideInset: number;
  barTop: number;
  barHeight: number;
  circleSize: number;
  /** Flattens the bar's rounded right cap into a square corner — used when
   * the search dropdown is open directly below, so the shape's corners don't
   * leave a gap against the dropdown's flat rectangular top edge. */
  squareRightEnd?: boolean;
}): string {
  const r = barHeight / 2;
  const R = circleSize / 2;
  const barRight = width - sideInset;
  const barBottom = barTop + barHeight;
  const capCenterX = sideInset + r;
  const dx = Math.sqrt(Math.max(R * R - r * r, 0));

  const topCross: Point = { x: capCenterX + dx, y: barTop };
  const bottomCross: Point = { x: capCenterX + dx, y: barBottom };

  const rightEnd = squareRightEnd
    ? [`L ${p({ x: barRight, y: barTop })}`, `L ${p({ x: barRight, y: barBottom })}`]
    : [
        `L ${p({ x: barRight - r, y: barTop })}`,
        `A ${r} ${r} 0 0 1 ${p({ x: barRight, y: barTop + r })}`,
        `L ${p({ x: barRight, y: barBottom - r })}`,
        `A ${r} ${r} 0 0 1 ${p({ x: barRight - r, y: barBottom })}`,
      ];

  return [
    `M ${p(topCross)}`,
    ...rightEnd,
    `L ${p(bottomCross)}`,
    // Major arc of the badge circle, sweeping through the left bulge.
    `A ${R} ${R} 0 1 1 ${p(topCross)}`,
    "Z",
  ].join(" ");
}

/**
 * Bar with the circular badge fused into the middle of its top/bottom edges
 * (mobile header) — the bar's own left/right end-caps stay untouched.
 */
export function centerBumpPillPath({
  width,
  sideInset,
  barTop,
  barHeight,
  circleSize,
  squareRightEnd = false,
}: {
  width: number;
  sideInset: number;
  barTop: number;
  barHeight: number;
  circleSize: number;
  /** Flattens the bar's rounded right cap into a square corner — used when
   * the search dropdown is open directly below, so the shape's corners don't
   * leave a gap against the dropdown's flat rectangular top edge. */
  squareRightEnd?: boolean;
}): string {
  const r = barHeight / 2;
  const R = circleSize / 2;
  const barLeft = sideInset;
  const barRight = width - sideInset;
  const barBottom = barTop + barHeight;
  const circleCenterX = width / 2;
  const dx = Math.sqrt(Math.max(R * R - r * r, 0));

  const topLeft: Point = { x: circleCenterX - dx, y: barTop };
  const topRight: Point = { x: circleCenterX + dx, y: barTop };
  const bottomRight: Point = { x: circleCenterX + dx, y: barBottom };
  const bottomLeft: Point = { x: circleCenterX - dx, y: barBottom };

  const rightEnd = squareRightEnd
    ? [`L ${p({ x: barRight, y: barTop })}`, `L ${p({ x: barRight, y: barBottom })}`]
    : [
        `L ${p({ x: barRight - r, y: barTop })}`,
        `A ${r} ${r} 0 0 1 ${p({ x: barRight, y: barTop + r })}`,
        `L ${p({ x: barRight, y: barBottom - r })}`,
        `A ${r} ${r} 0 0 1 ${p({ x: barRight - r, y: barBottom })}`,
      ];

  return [
    `M ${p({ x: barLeft + r, y: barTop })}`,
    `L ${p(topLeft)}`,
    // Minor arc bulging above the top edge.
    `A ${R} ${R} 0 0 1 ${p(topRight)}`,
    ...rightEnd,
    `L ${p(bottomRight)}`,
    // Minor arc bulging below the bottom edge.
    `A ${R} ${R} 0 0 1 ${p(bottomLeft)}`,
    `L ${p({ x: barLeft + r, y: barBottom })}`,
    `A ${r} ${r} 0 0 1 ${p({ x: barLeft, y: barBottom - r })}`,
    `L ${p({ x: barLeft, y: barTop + r })}`,
    `A ${r} ${r} 0 0 1 ${p({ x: barLeft + r, y: barTop })}`,
    "Z",
  ].join(" ");
}
