import Box from "@mui/material/Box";
import { lineGradient } from "../../theme/gradients";

interface GradientLineProps {
  height?: number;
  padding?: string;
  gradient?: string;
}

// Ported from lib/resources/widgets/gradient_line.dart
export default function GradientLine({
  height = 2,
  padding = "84px 32px 36px 32px",
  gradient = lineGradient,
}: GradientLineProps) {
  return (
    <Box sx={{ padding }}>
      <Box sx={{ height, background: gradient }} />
    </Box>
  );
}
