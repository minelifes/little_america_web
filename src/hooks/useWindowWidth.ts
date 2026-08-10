import { useEffect, useState } from "react";

// Ported from Flutter's `MediaQuery.of(context).size.width` usage across the
// app — several components branch on exact pixel breakpoints (600, 750, 870,
// 1034...), so a raw window width hook keeps those thresholds identical
// instead of remapping to MUI's default breakpoints.
export default function useWindowWidth(): number {
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return width;
}
