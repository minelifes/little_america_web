import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { colors } from "../../theme/theme";

export interface BreadcrumbItem {
  name: string;
  /** Omit for the current/last crumb — renders as bold, non-clickable text. */
  path?: string;
}

// Ported from lib/resources/widgets/breadcrumbs.dart
export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", rowGap: "4px" }}>
      {items.map((item, i) => (
        <Box key={`${item.name}-${i}`} sx={{ display: "flex", alignItems: "center" }}>
          {i > 0 && (
            <Box component="span" sx={{ mx: 1, color: colors.additionalTextColor2, fontSize: 14 }}>
              ›
            </Box>
          )}
          {item.path ? (
            <Box
              component="button"
              onClick={() => navigate(item.path!)}
              sx={{
                background: "none",
                border: "none",
                cursor: "pointer",
                p: 0,
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 400,
                letterSpacing: "0.5px",
                color: colors.additionalTextColor,
              }}
            >
              {item.name.toUpperCase()}
            </Box>
          ) : (
            <Box
              component="span"
              sx={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.5px",
                color: colors.mainTextColor,
              }}
            >
              {item.name.toUpperCase()}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}
