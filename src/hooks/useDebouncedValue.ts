import { useEffect, useState } from "react";

/** Delays reflecting `value` by `delayMs` — used for the appbar live-search
 * dropdown so it doesn't fire a request on every keystroke. The Dart source
 * (search_widget.dart) doesn't debounce at all (it relies on cancelling the
 * in-flight request via a CancelToken instead), but a short debounce is a
 * strict UX improvement here and doesn't change the visible behavior. */
export default function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
