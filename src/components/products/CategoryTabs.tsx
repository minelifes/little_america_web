import Box from "@mui/material/Box";
import { colors } from "../../theme/theme";
import type { CategoryModel } from "../../api/types";

interface CategoryTabsProps {
  categories: CategoryModel[];
  activeId: number | null;
  onChange: (id: number | null) => void;
}

// NOT ported from Dart — no equivalent widget exists in the Flutter source
// (TopProductPage has no category tabs at all). Reuses the already-cached
// top-level category list (same one used by CategoryGrid/Footer) to drive a
// horizontal tab bar; "УСІ ТОВАРИ" clears the category filter.
export default function CategoryTabs({ categories, activeId, onChange }: CategoryTabsProps) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: "28px", rowGap: 1 }}>
      <Tab label="УСІ ТОВАРИ" active={activeId === null} onClick={() => onChange(null)} />
      {categories.map((c) => (
        <Tab key={c.id} label={c.name} active={activeId === c.id} onClick={() => onChange(c.id)} />
      ))}
    </Box>
  );
}

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        background: "none",
        border: "none",
        cursor: "pointer",
        p: 0,
        pb: "10px",
        fontFamily: "inherit",
        borderBottom: active ? `2px solid ${colors.mainTextColor}` : "2px solid transparent",
        whiteSpace: "nowrap",
      }}
    >
      {/* Hover pill lives on this inner span, with padding cancelled out by
          an equal negative margin — grows the visual/hit area on hover
          without changing the outer button's content width, so the
          border-bottom underline above still hugs the text exactly like
          before. */}
      <Box
        component="span"
        sx={{
          display: "inline-block",
          px: "10px",
          py: "4px",
          mx: "-10px",
          my: "-4px",
          borderRadius: "6px",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.3px",
          color: active ? colors.mainTextColor : colors.additionalTextColor,
          transition: "background-color 200ms ease",
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.05)",
          },
        }}
      >
        {label.toUpperCase()}
      </Box>
    </Box>
  );
}
