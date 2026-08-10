import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

// Loading placeholder for BonusTransactionRow — see OrderListCardSkeleton
// for the same convention.
export default function BonusTransactionRowSkeleton() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 2,
        backgroundColor: "rgba(0,0,0,0.02)",
        borderRadius: "14px",
        p: 3,
        mb: 2,
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Skeleton variant="text" width={90} height={18} />
          <Skeleton variant="text" width={50} height={18} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Skeleton variant="text" width={130} height={20} />
          <Skeleton variant="text" width={80} height={20} />
        </Box>
      </Box>
      <Skeleton variant="circular" width={20} height={20} sx={{ flexShrink: 0 }} />
    </Box>
  );
}
