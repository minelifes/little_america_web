import { useState } from "react";
import Box from "@mui/material/Box";
import BrandSelect from "./BrandSelect";
import SortChips from "./SortChips";
import PriceRangeSlider from "./PriceRangeSlider";
import { colors } from "../../theme/theme";
import { iconHoverSx } from "../../theme/interactions";
import type { BrandModel, SearchFilters } from "../../api/types";

type SortValue = NonNullable<SearchFilters["sort"]>;

interface FilterPanelProps {
  brands: BrandModel[];
  brandId: string | null;
  onBrandChange: (id: string | null) => void;
  sort: SortValue | null;
  onSortChange: (value: SortValue | null) => void;
  price: [number, number];
  onPriceChange: (value: [number, number]) => void;
  onApply: () => void;
  onClear: () => void;
}

const rowSx = { display: "flex", flexWrap: "wrap" as const, alignItems: "center", gap: 3, py: 2 };
const labelSx = { fontSize: 14, fontWeight: 700, minWidth: 160 };

// NOT ported from Dart — this whole panel is designed from scratch. The
// Flutter source has an AppExpansionWidget for it but its children are fully
// commented out (`children: []`), so there was no layout/logic to port.
export default function FilterPanel({
  brands,
  brandId,
  onBrandChange,
  sort,
  onSortChange,
  price,
  onPriceChange,
  onApply,
  onClear,
}: FilterPanelProps) {
  const [applyHover, setApplyHover] = useState(false);

  return (
    <Box sx={{ pb: 1 }}>
      <Box sx={rowSx}>
        <Box component="span" sx={labelSx}>
          Бренд:
        </Box>
        <BrandSelect brands={brands} value={brandId} onChange={onBrandChange} />
      </Box>

      <Box sx={rowSx}>
        <Box component="span" sx={labelSx}>
          Сортування за:
        </Box>
        <SortChips value={sort} onChange={onSortChange} />
      </Box>

      <Box sx={rowSx}>
        <Box component="span" sx={labelSx}>
          Ціна:
        </Box>
        <PriceRangeSlider value={price} onChange={onPriceChange} />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3, pt: 2 }}>
        <Box
          component="button"
          onClick={onClear}
          sx={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 700,
            color: colors.additionalTextColor,
            textDecoration: "underline",
            px: "10px",
            py: "6px",
            borderRadius: "999px",
            ...iconHoverSx,
          }}
        >
          ЗНЯТИ ВСІ ФІЛЬТРИ
        </Box>
        <Box
          component="button"
          onClick={onApply}
          onMouseEnter={() => setApplyHover(true)}
          onMouseLeave={() => setApplyHover(false)}
          sx={{
            border: `1px solid ${colors.mainColor}`,
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.5px",
            color: applyHover ? colors.mainTextColor : "#ffffff",
            backgroundColor: applyHover ? "#ffffff" : colors.mainColor,
            transition: "background-color 200ms ease-in-out, color 200ms ease-in-out",
            px: "20px",
            py: "10px",
            borderRadius: "8px",
          }}
        >
          ЗАСТОСУВАТИ ФІЛЬТРИ
        </Box>
      </Box>
    </Box>
  );
}
