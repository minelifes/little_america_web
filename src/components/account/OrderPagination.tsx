import Box from "@mui/material/Box";
import { colors } from "../../theme/theme";

interface OrderPaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function OrderPagination({ page, totalPages, onChange }: OrderPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 4 }}>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <Box
          key={n}
          component="button"
          type="button"
          onClick={() => onChange(n)}
          sx={{
            width: 34,
            height: 34,
            borderRadius: "8px",
            border: `1px solid ${n === page ? colors.mainTextColor : "rgba(0,0,0,0.15)"}`,
            background: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: n === page ? 700 : 400,
            color: colors.mainTextColor,
          }}
        >
          {n}
        </Box>
      ))}
    </Box>
  );
}
