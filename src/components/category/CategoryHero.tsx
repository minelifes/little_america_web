import Box from "@mui/material/Box";
import { CATEGORY_STORAGE_URL } from "../../api/constants";
import type { CategoryModel } from "../../api/types";

// Ported from lib/resources/pages/by_category/widgets/header_image.dart —
// a heavily blurred (backdrop-filter ~30px) full-width banner using the
// category's own image, with its name + description overlaid in white.
export default function CategoryHero({ category }: { category: CategoryModel }) {
  const imgUrl = category.image?.url ? `${CATEGORY_STORAGE_URL}${category.image.url}` : "";

  return (
    <Box sx={{ position: "relative", width: "100%", height: { xs: 260, md: 360 }, overflow: "hidden" }}>
      {imgUrl && (
        <Box
          component="img"
          src={imgUrl}
          alt=""
          aria-hidden
          sx={{
            position: "absolute",
            inset: "-20px",
            width: "calc(100% + 40px)",
            height: "calc(100% + 40px)",
            objectFit: "cover",
            filter: "blur(30px)",
            transform: "scale(1.1)",
          }}
        />
      )}
      <Box sx={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.25)" }} />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "flex-end",
          pl: { xs: 3, md: "8%" },
          pr: { xs: 3, md: "20%" },
          pb: { xs: 4, md: "56px" },
          pt: { xs: "110px", md: "150px" },
        }}
      >
        <Box sx={{ maxWidth: 700 }}>
          <Box sx={{ color: "#FDFDFD", fontSize: { xs: 24, md: 32 }, fontWeight: 500, lineHeight: 1.2 }}>
            {category.name}
          </Box>
          {category.description && (
            <Box sx={{ mt: 2, color: "#FDFDFD", fontSize: { xs: 14, md: 18 }, fontWeight: 500 }}>
              {category.description}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
