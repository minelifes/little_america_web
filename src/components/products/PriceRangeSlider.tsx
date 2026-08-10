import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { colors } from "../../theme/theme";

// NOT ported from Dart — no min/max price endpoint exists in the Flutter
// source, so these bounds are a placeholder rather than a computed value.
// Swap for real category/catalog-wide bounds once an endpoint is confirmed.
export const PRICE_MIN = 0;
export const PRICE_MAX = 20000;

interface PriceRangeSliderProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export default function PriceRangeSlider({ value, onChange }: PriceRangeSliderProps) {
  return (
    <Box sx={{ width: "100%", maxWidth: 340 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Box component="span" sx={{ fontSize: 13, color: colors.additionalTextColor }}>
          Від {value[0].toFixed(2)} ₴
        </Box>
        <Box component="span" sx={{ fontSize: 13, color: colors.additionalTextColor }}>
          До {value[1].toFixed(2)} ₴
        </Box>
      </Box>
      <Slider
        value={value}
        onChange={(_, v) => onChange(v as [number, number])}
        min={PRICE_MIN}
        max={PRICE_MAX}
        disableSwap
        sx={{
          color: colors.mainTextColor,
          "& .MuiSlider-thumb": {
            width: 16,
            height: 16,
            backgroundColor: "#ffffff",
            border: `2px solid ${colors.mainTextColor}`,
            boxShadow: "none",
            "&:hover, &.Mui-focusVisible": { boxShadow: "0 0 0 6px rgba(22,22,22,0.12)" },
          },
          "& .MuiSlider-rail": { opacity: 1, backgroundColor: "rgba(0,0,0,0.1)" },
        }}
      />
    </Box>
  );
}
