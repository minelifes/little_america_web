import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

// Loading placeholder for OrderListCard, same layout/dimensions so the
// list doesn't jump when real data arrives. Matches the project's existing
// skeleton convention (see components/home/ProductCardSkeleton.tsx).
export default function OrderListCardSkeleton() {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, py: 3, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
      <Skeleton variant="rounded" width={72} height={72} sx={{ flexShrink: 0 }} />

      <Box sx={{ flex: "2 1 260px", minWidth: 0 }}>
        <Skeleton variant="text" width="90%" height={22} />
        <Skeleton variant="text" width="40%" height={20} sx={{ mt: "4px" }} />
      </Box>

      <Box sx={{ flex: "1 1 260px", minWidth: 220, display: "flex", flexDirection: "column", gap: "8px" }}>
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="rounded" width="100%" height={44} sx={{ mt: 1 }} />
      </Box>
    </Box>
  );
}
