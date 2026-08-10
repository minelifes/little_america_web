import Box from "@mui/material/Box";
import type { OrderStatus } from "../../api/types";

const STATUS_STYLES: Record<OrderStatus, { label: string; bg: string; color: string }> = {
  pending: { label: "Очікується підтвердження", bg: "#EFE8FA", color: "#8B6FD1" },
  shipping: { label: "В дорозі", bg: "#FDEEDD", color: "#E08A2E" },
  arrived: { label: "Прибуло у вдділення", bg: "#E4F6E9", color: "#3FAE5C" },
  done: { label: "Виконано", bg: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.4)" },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, bg, color } = STATUS_STYLES[status];
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "999px",
        backgroundColor: bg,
        color,
        fontSize: 12,
        fontWeight: 700,
        px: "12px",
        py: "6px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Box>
  );
}
