// The banner API returns colors as hex strings in the same format Flutter's
// `HexColor.fromHex` extension accepts (ported from lib/helpers/hex_color.dart):
// 6 chars "rrggbb" (opaque), or 8 chars "aarrggbb" (Dart's Color int order —
// alpha first), with an optional leading "#".

interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

function parseHexColor(hex: string): Rgba {
  const clean = hex.trim().replace("#", "");

  if (clean.length === 8) {
    return {
      a: parseInt(clean.slice(0, 2), 16) / 255,
      r: parseInt(clean.slice(2, 4), 16),
      g: parseInt(clean.slice(4, 6), 16),
      b: parseInt(clean.slice(6, 8), 16),
    };
  }

  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
    a: 1,
  };
}

/** Converts a banner hex color to a CSS color string, preserving its own alpha. */
export function hexToCssColor(hex: string): string {
  const { r, g, b, a } = parseHexColor(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/** Converts a banner hex color to a CSS color string at a forced opacity. */
export function hexToCssColorWithOpacity(hex: string, opacity: number): string {
  const { r, g, b } = parseHexColor(hex);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
