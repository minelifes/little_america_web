import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

// Loading placeholder for ReceiptView, used by both OrderDetailPage and
// BonusDetailPage while their shared useOrderDetail() query is in flight.
export default function ReceiptViewSkeleton() {
  return (
    <>
      <Skeleton variant="text" width={120} height={32} />
      <Skeleton variant="text" width={80} height={20} sx={{ mt: "4px", mb: 3 }} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
        {[0, 1].map((i) => (
          <Box
            key={i}
            sx={{ display: "flex", alignItems: "center", gap: 2, backgroundColor: "rgba(0,0,0,0.02)", borderRadius: "14px", p: 2 }}
          >
            <Skeleton variant="rounded" width={64} height={64} sx={{ flexShrink: 0 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Skeleton variant="text" width="70%" height={20} />
              <Skeleton variant="text" width="40%" height={16} sx={{ mt: "2px" }} />
            </Box>
            <Skeleton variant="text" width={60} height={20} />
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 6, mb: 4 }}>
        <Box sx={{ flex: "1 1 260px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <Skeleton variant="text" width="90%" height={18} />
          <Skeleton variant="text" width="90%" height={18} />
          <Skeleton variant="text" width="90%" height={18} />
          <Skeleton variant="text" width="90%" height={18} />
        </Box>
        <Box sx={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <Skeleton variant="text" width="50%" height={18} sx={{ mb: "4px" }} />
          <Skeleton variant="text" width="80%" height={18} />
          <Skeleton variant="text" width="80%" height={18} />
          <Skeleton variant="text" width="80%" height={18} />
        </Box>
      </Box>

      <Skeleton variant="rounded" width="100%" height={140} sx={{ maxWidth: 480, borderRadius: "14px" }} />
    </>
  );
}
