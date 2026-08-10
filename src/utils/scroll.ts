/**
 * Ported behavior: the Flutter app's ProductWidget scrolls its controller
 * back to the top (500ms ease-out) whenever the product list reloads —
 * both on a category switch and on a pagination page change. `smooth`
 * mirrors that; route changes (ScrollToTop) use the instant variant instead
 * since that's a full page swap, not an in-place content refresh.
 */
export function scrollToTop(smooth = false) {
  window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
}
