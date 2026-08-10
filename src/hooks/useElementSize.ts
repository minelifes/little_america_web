import { useEffect, useRef, useState } from "react";

/**
 * Tracks an element's rendered pixel width+height via ResizeObserver. Like
 * useElementWidth, but also reports height — needed when a custom SVG shape
 * depends on the element's actual (often content-driven, e.g. wrapped text)
 * height rather than just its width.
 */
export default function useElementSize<T extends HTMLElement>(): [
  React.RefObject<T | null>,
  { width: number; height: number },
] {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) setSize({ width: rect.width, height: rect.height });
    });
    observer.observe(el);
    const rect = el.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height });
    return () => observer.disconnect();
  }, []);

  return [ref, size];
}
