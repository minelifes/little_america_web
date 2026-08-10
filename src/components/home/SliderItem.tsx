import Box from "@mui/material/Box";
import useWindowWidth from "../../hooks/useWindowWidth";
import ArrowIcon from "../common/ArrowIcon";
import WhiteButtonWithArrow from "../common/WhiteButtonWithArrow";
import { prepareImageUrl } from "../../api/constants";
import { hexToCssColor, hexToCssColorWithOpacity } from "../../utils/color";
import { whiteIconHoverSx } from "../../theme/interactions";
import type { NewsModel } from "../../api/types";

interface SliderItemProps {
  item: NewsModel;
  onPrev: () => void;
  onNext: () => void;
  onNavigate: (link: string) => void;
}

// Ported from lib/resources/widgets/slider/slider_item.dart +
// lib/resources/widgets/two_responsive_blocks.dart (two-block responsive split)
export default function SliderItem({ item, onPrev, onNext, onNavigate }: SliderItemProps) {
  const width = useWindowWidth();
  const twoColumn = width > 800;
  const imgUrl = prepareImageUrl(item.image?.url ?? "");

  // Ported behavior: the banner API returns one or two colors — two means a
  // gradient between them, one means a solid fill at 90% opacity (letting
  // the blurred image behind show through faintly).
  const bg1 = item.bg1 || "161616";
  const hasGradient = !!item.bg2 && item.bg2.trim() !== "";
  const overlayBackground = hasGradient
    ? `linear-gradient(to right, ${hexToCssColor(bg1)}, ${hexToCssColor(item.bg2!)})`
    : hexToCssColorWithOpacity(bg1, 0.9);

  return (
    <Box sx={{ width: "100%", height: 700, display: "flex", flexDirection: twoColumn ? "row" : "column" }}>
      <Box sx={{ width: twoColumn ? "50%" : "100%", height: twoColumn ? "100%" : "50%", backgroundColor: "grey.400" }}>
        <Box component="img" src={imgUrl} alt={item.title} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </Box>

      <Box
        sx={{
          width: twoColumn ? "50%" : "100%",
          height: twoColumn ? "100%" : "50%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* blurred mirrored background */}
        <Box
          component="img"
          src={imgUrl}
          alt=""
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scaleX(-1)",
            filter: "blur(3px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: overlayBackground,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            px: "16.6%",
          }}
        >
          <Box sx={{ fontWeight: 700, color: "#ffffff", fontSize: 24 }}>{item.title}</Box>
          <Box sx={{ mt: 3, mb: 8, color: "#ffffff", fontSize: 14 }}>{item.content}</Box>
          {item.link && <WhiteButtonWithArrow text="ПЕРЕЙТИ" onClick={() => onNavigate(item.link!)} />}
        </Box>

        <Box
          sx={{
            position: "absolute",
            left: "10%",
            right: "10%",
            bottom: "15%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box
            component="button"
            onClick={onPrev}
            aria-label="previous"
            sx={{
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ffffff",
              border: "none",
              borderRadius: "14px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
              cursor: "pointer",
              ...whiteIconHoverSx,
            }}
          >
            <ArrowIcon width={24} color="#161616" rotate />
          </Box>
          <Box
            component="button"
            onClick={onNext}
            aria-label="next"
            sx={{
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ffffff",
              border: "none",
              borderRadius: "14px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
              cursor: "pointer",
              ...whiteIconHoverSx,
            }}
          >
            <ArrowIcon width={24} color="#161616" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
