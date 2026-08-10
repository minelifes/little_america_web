import Box from "@mui/material/Box";
import useWindowWidth from "../../hooks/useWindowWidth";
import MoreButton from "../common/MoreButton";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { ROUTES } from "../../routes";
import type { OptimizedProductModel } from "../../api/types";

interface ProductGridProps {
  title?: string;
  products: OptimizedProductModel[];
  isLoading: boolean;
  isError?: boolean;
  showMoreButton?: boolean;
  /** e.g. render a "+300 ₴" style badge instead of the default discount chip */
  badgeText?: (product: OptimizedProductModel) => string | undefined;
}

// Ported from lib/resources/widgets/new_and_popular_products.dart
export default function ProductGrid({
  title = "НОВИНКИ",
  products,
  isLoading,
  isError = false,
  showMoreButton = true,
  badgeText,
}: ProductGridProps) {
  const width = useWindowWidth();
  const isMobileView = width < 750;

  return (
    <Box sx={{ px: isMobileView ? 1 : 4 }}>
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: showMoreButton ? "space-between" : "flex-start",
            gap: 2,
          }}
        >
          <Box component="h2" sx={{ m: 0, fontSize: isMobileView ? 14 : 18, fontWeight: 700 }}>
            {title}
          </Box>
          {showMoreButton && <MoreButton to={ROUTES.products} />}
        </Box>

        <Box
          sx={{
            mt: { xs: 4, md: "86px" },
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 2,
          }}
        >
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          ) : isError ? (
            <Box sx={{ py: 4, color: "text.secondary", fontSize: 14 }}>Не вдалося завантажити товари</Box>
          ) : (
            products.map((p) => <ProductCard key={p.id} product={p} badgeText={badgeText?.(p)} />)
          )}
        </Box>
      </Box>
    </Box>
  );
}
