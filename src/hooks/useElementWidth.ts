import { useEffect, useRef, useState } from "react";

/**
 * Tracks the rendered pixel width of an element via ResizeObserver.
 * Used to build responsive custom SVG shapes (e.g. the header's pill+bump
 * silhouette), where the path geometry must be recomputed in real pixels
 * rather than relying on non-uniform SVG viewBox scaling (which would
 * distort the circular bump).
 */
export default function useElementWidth<T extends HTMLElement>(fallback = 1200): [React.RefObject<T | null>, number] {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(fallback);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(w);
    });
    observer.observe(el);
    setWidth(el.getBoundingClientRect().width || fallback);
    return () => observer.disconnect();
  }, [fallback]);

  return [ref, width];
}
