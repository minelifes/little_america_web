import Box from "@mui/material/Box";
import useElementSize from "../../hooks/useElementSize";

// Dart source uses Color(0xa1E49C59) — alpha a1 (~63%), rgb E49C59.
const DASH_COLOR = "rgba(228, 156, 89, 0.63)";
// Matches Dart's arc bounding-box width (100, i.e. radius 50) / line inset
// (50, its horizontal center) in why_we_line_l.dart / why_we_line_r.dart.
const ARC_RADIUS = 50;

interface WhyWeRowProps {
  icon: string;
  text: string;
  /**
   * "bottom" — first item: icon+text on the left, plain dashed line under it
   * flush to the left edge (no side arc, matches WhyWeBottomDashed).
   * "left"/"right" — icon+text on that side, with a rounded dashed arc
   * bulging on that side connecting up to the row above and down to the row
   * below, plus a dashed line under the row inset 50px on both ends. isLast
   * drops the right-end inset (matches WhyWeLineL's isLast — the connector
   * doesn't continue past the last item).
   */
  variant: "bottom" | "left" | "right";
  isLast?: boolean;
}

// Ported from lib/resources/widgets/about_us/why_we_bottom_dashed.dart +
// why_we_line_l.dart + why_we_line_r.dart — a dashed bottom line plus (for
// "left"/"right") a half-ellipse arc bulging out that side, drawn as real
// SVG paths sized to the row's actual measured width/height (CSS border-
// radius tricks kept producing artifacts on tall/wrapped rows, so this
// mirrors the header's custom-shape approach instead: measure, then draw
// exact path geometry).
export default function WhyWeRow({ icon, text, variant, isLast = false }: WhyWeRowProps) {
  const [ref, { width: w, height: h }] = useElementSize<HTMLDivElement>();

  const linePath =
    variant === "bottom" ? `M 0 ${h} L ${w - ARC_RADIUS} ${h}` : `M ${ARC_RADIUS} ${h} L ${isLast ? w : w - ARC_RADIUS} ${h}`;
  const arcPath =
    variant === "left"
      ? `M ${ARC_RADIUS} 0 A ${ARC_RADIUS} ${h / 2} 0 0 0 ${ARC_RADIUS} ${h}`
      : variant === "right"
        ? `M ${w - ARC_RADIUS} 0 A ${ARC_RADIUS} ${h / 2} 0 0 1 ${w - ARC_RADIUS} ${h}`
        : null;

  const iconEl = (
    <Box component="img" src={icon} alt="" sx={{ width: 40, height: 40, objectFit: "contain", flexShrink: 0 }} />
  );
  const textEl = (
    <Box component="span" sx={{ flex: 1, fontSize: 15 }}>
      {text}
    </Box>
  );

  return (
    <Box ref={ref} sx={{ position: "relative" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: variant === "right" ? "flex-end" : "flex-start",
          gap: 2,
          py: 4,
          px: 4,
          pr: variant === "right" ? "72px" : 4,
          pl: variant === "left" ? "72px" : 4,
        }}
      >
        {variant === "right" ? (
          <>
            {textEl}
            {iconEl}
          </>
        ) : (
          <>
            {iconEl}
            {textEl}
          </>
        )}
      </Box>

      {w > 0 && h > 0 && (
        <Box
          component="svg"
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <path d={linePath} stroke={DASH_COLOR} strokeWidth={2} strokeDasharray="8 8" strokeLinecap="round" fill="none" />
          {arcPath && (
            <path d={arcPath} stroke={DASH_COLOR} strokeWidth={2} strokeDasharray="8 8" strokeLinecap="round" fill="none" />
          )}
        </Box>
      )}
    </Box>
  );
}
