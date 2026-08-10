import { useState } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import ArrowIcon from "./ArrowIcon";

interface ToProductButtonProps {
  onClick?: () => void;
  /** When set (and not disabled), renders as a real react-router <Link> (a
   * real <a href>) instead of a <button onClick=navigate(...)>. Same
   * pixel-identical look and client-side navigation (no full page reload —
   * "reactivity" is preserved), but crawlers/screen readers/no-JS users get
   * an actual hyperlink instead of a JS-only click handler. Leave unset for
   * non-navigation uses (add to cart, form submit, checkout next/place
   * order) — those stay real <button> elements. */
  to?: string;
  width?: number | string;
  height?: number;
  text?: string;
  /** Overrides the default arrow icon (e.g. the "add to cart" package icon). */
  icon?: (color: string) => React.ReactNode;
  /** Greys out the button and blocks clicks/hover — used by the checkout
   * wizard's Next/Place-order buttons, which Dart disables until the current
   * step's fields validate (see OrderUserData/OrderAddress.isAllDataPassed()). */
  disabled?: boolean;
}

// Ported from lib/resources/widgets/buttons/to_product_button.dart
// Black button that inverts to white on hover, with arrow icon that follows suit.
export default function ToProductButton({
  onClick,
  to,
  width = 264,
  height = 42,
  text = "ДО ТОВАРУ",
  icon,
  disabled = false,
}: ToProductButtonProps) {
  const [hover, setHover] = useState(false);
  const active = hover && !disabled;

  const sx = {
    width,
    height,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
    px: 2,
    cursor: disabled ? "default" : "pointer",
    border: "1px solid #161616",
    borderRadius: "6px",
    backgroundColor: disabled ? "#c4c4c4" : active ? "#ffffff" : "#161616",
    borderColor: disabled ? "#c4c4c4" : "#161616",
    transition: "background-color 200ms ease-in-out",
    fontFamily: "inherit",
    textDecoration: "none",
  };

  const content = (
    <>
      <Box
        component="span"
        sx={{
          fontSize: 12,
          color: active ? "#161616" : "#ffffff",
          transition: "color 200ms ease-in-out",
        }}
      >
        {text}
      </Box>
      {icon ? icon(active ? "#161616" : "#ffffff") : <ArrowIcon width={20} color={active ? "#161616" : "#ffffff"} />}
    </>
  );

  const hoverHandlers = { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) };

  if (to && !disabled) {
    return (
      <Box component={Link} to={to} onClick={onClick} sx={sx} {...hoverHandlers}>
        {content}
      </Box>
    );
  }

  return (
    <Box component="button" disabled={disabled} onClick={disabled ? undefined : onClick} sx={sx} {...hoverHandlers}>
      {content}
    </Box>
  );
}
