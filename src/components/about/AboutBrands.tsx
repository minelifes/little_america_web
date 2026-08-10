import Box from "@mui/material/Box";
import { colors } from "../../theme/theme";
import carmex from "../../assets/about/brands/carmex.webp";
import starbucks from "../../assets/about/brands/starbucks.webp";
import vs from "../../assets/about/brands/vs.webp";
import bilou from "../../assets/about/brands/bilou.webp";
import bb from "../../assets/about/brands/bb.webp";
import now from "../../assets/about/brands/now.webp";

const BRANDS = [carmex, starbucks, vs, bilou, bb, now];

// Ported from the brand-logo strip in about_page.dart.
export default function AboutBrands() {
  return (
    <Box sx={{ px: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto", mt: "84px", textAlign: "center" }}>
      <Box component="span" sx={{ fontSize: 20, color: colors.additionalTextColor2 }}>
        В нашому асортименті є товари таких брендів як
      </Box>
      <Box sx={{ mt: 4, display: "flex", flexWrap: "wrap", justifyContent: "space-around", gap: 2 }}>
        {BRANDS.map((src, i) => (
          <Box key={i} component="img" src={src} alt="" sx={{ width: 120, height: 120, objectFit: "contain" }} />
        ))}
      </Box>
    </Box>
  );
}
