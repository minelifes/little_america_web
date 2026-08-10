import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

// Ported from lib/resources/widgets/loaders/product_item_loader.dart
export default function ProductCardSkeleton({ width = 264 }: { width?: number | string }) {
  return (
    <Box sx={{ width, height: 380, display: "flex", flexDirection: "column" }}>
      <Skeleton variant="rounded" width="100%" height={200} />
      <Skeleton variant="text" width="80%" height={28} sx={{ mt: 2 }} />
      <Skeleton variant="text" width="60%" height={20} />
      <Box sx={{ flex: 1 }} />
      <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
      <Skeleton variant="rounded" width="100%" height={42} />
    </Box>
  );
}
