import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import useWindowWidth from "../../hooks/useWindowWidth";
import { useCategories } from "../../api/hooks";
import CategoryCard from "./CategoryCard";

// Ported from lib/resources/widgets/categories/category_widget.dart
export default function CategoryGrid() {
  const width = useWindowWidth();
  const isMobileView = width < 750;
  const { data: categories, isLoading, isError } = useCategories();
  const topLevel = (categories ?? []).filter((c) => c.pid === null && c.visible);

  return (
    <Box sx={{ px: isMobileView ? 1 : 4 }}>
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        <Box sx={{ pt: 4 }} />
        <Box component="h2" sx={{ m: 0, fontSize: isMobileView ? 14 : 18, fontWeight: 700 }}>
          КАТЕГОРІЇ ТОВАРІВ
        </Box>
        <Box sx={{ mt: 4, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2 }}>
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} variant="rounded" width={300} height={256} />)
          ) : isError ? (
            <Box sx={{ py: 4, color: "text.secondary", fontSize: 14 }}>Не вдалося завантажити категорії</Box>
          ) : (
            topLevel.map((c) => <CategoryCard key={c.id} category={c} />)
          )}
        </Box>
      </Box>
    </Box>
  );
}
