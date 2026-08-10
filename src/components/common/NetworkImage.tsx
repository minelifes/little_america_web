import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import { colors } from "../../theme/theme";

interface NetworkImageProps {
  src: string;
  alt?: string;
  radius?: number;
  fit?: "cover" | "contain" | "fill";
  sx?: SxProps<Theme>;
}

// Ported from lib/resources/widgets/app_network_image.dart — a rounded,
// white-backed image container with a fallback icon on error.
export default function NetworkImage({
  src,
  alt = "",
  radius = 16,
  fit = "cover",
  sx,
}: NetworkImageProps) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: `${radius}px`,
        overflow: "hidden",
        backgroundColor: "#ffffff",
        ...sx,
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        loading="lazy"
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: fit,
          display: "block",
          color: colors.mainTextColor,
        }}
      />
    </Box>
  );
}
