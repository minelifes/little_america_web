import Box from "@mui/material/Box";
import ArrowIcon from "./ArrowIcon";
import { whiteIconHoverSx } from "../../theme/interactions";

interface WhiteButtonWithArrowProps {
  onClick?: () => void;
  width?: number | string;
  height?: number;
  text?: string;
}

// Ported from lib/resources/widgets/buttons/white_button_with_arrow.dart
export default function WhiteButtonWithArrow({
  onClick,
  width = 200,
  height = 42,
  text = "Перейти",
}: WhiteButtonWithArrowProps) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        px: 2,
        cursor: "pointer",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        fontFamily: "inherit",
        ...whiteIconHoverSx,
      }}
    >
      <Box component="span" sx={{ fontSize: 14, color: "#161616" }}>
        {text}
      </Box>
      <ArrowIcon width={54} color="#161616" />
    </Box>
  );
}
