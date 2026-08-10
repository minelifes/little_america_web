import Box from "@mui/material/Box";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CloseIcon from "../common/CloseIcon";
import GradientLine from "../common/GradientLine";
import { iconHoverSx } from "../../theme/interactions";

interface AuthDrawerHeaderProps {
  title: string;
  /** "close" (X, top-level screens) vs "back" (chevron, forgot-password steps) — matches the reference screenshots exactly. */
  variant: "close" | "back";
  onAction: () => void;
}

const actionButtonSx = {
  background: "none",
  border: "none",
  cursor: "pointer",
  width: 36,
  height: 36,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  ...iconHoverSx,
} as const;

// Header + divider, matching CartDrawer's header/GradientLine pattern: title
// on the left, close (X) on the right for top-level screens. The "back"
// variant (forgot-password steps) keeps its chevron on the left instead —
// back and close read differently by convention, so only "close" moved.
export default function AuthDrawerHeader({ title, variant, onAction }: AuthDrawerHeaderProps) {
  if (variant === "back") {
    return (
      <>
        <Box sx={{ display: "grid", gridTemplateColumns: "40px 1fr 40px", alignItems: "center", px: 3, pt: 3, pb: 2 }}>
          <Box component="button" type="button" onClick={onAction} aria-label="back" sx={{ ...actionButtonSx, justifySelf: "start" }}>
            <ChevronLeftIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box component="span" sx={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.5px", textAlign: "center" }}>
            {title}
          </Box>
          <Box />
        </Box>
        <GradientLine padding="0 24px 16px 24px" />
      </>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, pt: 3, pb: 2 }}>
        <Box component="span" sx={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.5px" }}>
          {title}
        </Box>
        <Box component="button" type="button" onClick={onAction} aria-label="close" sx={actionButtonSx}>
          <CloseIcon size={20} />
        </Box>
      </Box>
      <GradientLine padding="0 24px 16px 24px" />
    </>
  );
}
