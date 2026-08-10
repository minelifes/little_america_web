import Box from "@mui/material/Box";
import CloseIcon from "../common/CloseIcon";
import { colors } from "../../theme/theme";
import { iconHoverSx } from "../../theme/interactions";

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

// NOT ported from Dart — shows a currently-applied filter (category/brand/
// sort/price) as a removable chip next to the filter toggle button.
export default function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        pl: "14px",
        pr: "10px",
        py: "7px",
        borderRadius: "20px",
        backgroundColor: colors.mainColor,
      }}
    >
      <Box component="span" sx={{ fontSize: 12, fontWeight: 700, color: "#ffffff", whiteSpace: "nowrap" }}>
        {label}
      </Box>
      <Box
        component="button"
        onClick={onRemove}
        aria-label={`Видалити фільтр ${label}`}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "none",
          border: "none",
          cursor: "pointer",
          width: 22,
          height: 22,
          borderRadius: "50%",
          p: 0,
          ...iconHoverSx,
        }}
      >
        <CloseIcon size={12} color="#ffffff" />
      </Box>
    </Box>
  );
}
