import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToTop } from "../../utils/scroll";

// React Router doesn't reset scroll position on navigation by default, so
// clicking a category (or a subcategory tile, which routes to the same
// /category/:id path with a different id) kept whatever scroll offset the
// previous page was left at. Scroll to top on every path change instead.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTop();
  }, [pathname]);

  return null;
}
