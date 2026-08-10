import Box from "@mui/material/Box";
import { colors } from "../../theme/theme";
import type { SearchFilters } from "../../api/types";

type SortValue = NonNullable<SearchFilters["sort"]>;

export const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: "popularity", label: "Популярністю" },
  { value: "cheap", label: "Найдешевші" },
  { value: "new", label: "Новинки" },
  { value: "expensive", label: "Найдороші" },
];

export const sortLabel = (value: SortValue): string =>
  SORT_OPTIONS.find((o) => o.value === value)?.label ?? value;

interface SortChipsProps {
  value: SortValue | null;
  onChange: (value: SortValue | null) => void;
}

// NOT ported from Dart — no sort enum/param exists in the Flutter source.
export default function SortChips({ value, onChange }: SortChipsProps) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {SORT_OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <Box
            key={opt.value}
            component="button"
            onClick={() => onChange(active ? null : opt.value)}
            sx={{
              fontFamily: "inherit",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              px: "16px",
              py: "8px",
              borderRadius: "20px",
              border: `1px solid ${active ? colors.mainTextColor : "rgba(0,0,0,0.15)"}`,
              backgroundColor: active ? colors.mainTextColor : "transparent",
              color: active ? "#ffffff" : colors.mainTextColor,
              transition: "all 120ms ease-in-out",
              "&:hover": {
                backgroundColor: active ? colors.mainTextColor : "rgba(0,0,0,0.05)",
                borderColor: active ? colors.mainTextColor : "rgba(0,0,0,0.3)",
              },
            }}
          >
            {opt.label}
          </Box>
        );
      })}
    </Box>
  );
}
