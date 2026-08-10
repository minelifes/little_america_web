import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { CATEGORY_STORAGE_URL } from "../../api/constants";
import { whiteTransparentGradient } from "../../theme/gradients";
import { colors } from "../../theme/theme";
import { ROUTES } from "../../routes";
import type { CategoryModel } from "../../api/types";

interface CategoryCardProps {
  category: CategoryModel;
  width?: number | string;
}

// Ported from lib/resources/widgets/categories/category_item_widget.dart
// Renders as a real <a href> via react-router's Link (not a <button
// onClick=navigate>) so crawlers can discover/follow category pages —
// client-side routing (no full reload) is unchanged.
export default function CategoryCard({ category, width = 300 }: CategoryCardProps) {
  return (
    <Box
      component={Link}
      to={`${ROUTES.byCategory}${category.id}`}
      sx={{
        width,
        p: 0,
        border: "none",
        background: "none",
        textDecoration: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        // Group-hover: the image scales up, the rounded/clipped container
        // below stays fixed size (overflow: hidden crops the zoomed image).
        "&:hover .category-card-image": {
          transform: "scale(1.08)",
        },
      }}
    >
      <Box sx={{ height: 8 }} />
      <Box sx={{ width: "100%", height: 240, position: "relative", borderRadius: "16px", overflow: "hidden" }}>
        <Box
          component="img"
          className="category-card-image"
          src={category.image?.url ? `${CATEGORY_STORAGE_URL}${category.image.url}` : ""}
          alt={category.name}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
          }}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            backgroundColor: "#f4f5f8",
            transform: "scale(1)",
            transition: "transform 600ms ease",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 142,
            background: whiteTransparentGradient,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-start",
            px: "20px",
            pb: "10px",
          }}
        >
          <Box
            component="span"
            sx={{
              color: colors.mainTextColor,
              fontSize: 15,
              fontWeight: 400,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              textAlign: "left",
            }}
          >
            {category.name.toUpperCase()}
          </Box>
        </Box>
      </Box>
      <Box sx={{ height: 8 }} />
    </Box>
  );
}
