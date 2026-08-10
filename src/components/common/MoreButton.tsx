import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import ArrowIcon from "./ArrowIcon";
import { whiteIconHoverSx } from "../../theme/interactions";

interface MoreButtonProps {
  onClick?: () => void;
  /** Real react-router <Link> nav when set (real <a href>, client-side
   * routing preserved) — see ToProductButton's `to` prop for rationale.
   * Leave unset for non-navigation uses (e.g. "load more" pagination). */
  to?: string;
  width?: number | string;
  height?: number;
  text?: string;
}

// Ported from lib/resources/widgets/buttons/more_button.dart
export default function MoreButton({
  onClick,
  to,
  width = 176,
  height = 42,
  text = "БІЛЬШЕ",
}: MoreButtonProps) {
  const sx = {
    width,
    height,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    px: 1,
    cursor: "pointer",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    fontFamily: "inherit",
    textDecoration: "none",
    ...whiteIconHoverSx,
  };

  const content = (
    <>
      <Box component="span" sx={{ fontSize: 14, color: "#161616" }}>
        {text}
      </Box>
      <ArrowIcon width={20} color="#161616" />
    </>
  );

  if (to) {
    return (
      <Box component={Link} to={to} onClick={onClick} sx={sx}>
        {content}
      </Box>
    );
  }

  return (
    <Box component="button" onClick={onClick} sx={sx}>
      {content}
    </Box>
  );
}
