import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import NetworkImage from "../common/NetworkImage";
import OrderStatusBadge from "./OrderStatusBadge";
import { storageImageUrl } from "../../api/constants";
import { colors } from "../../theme/theme";
import { ROUTES } from "../../routes";
import type { OrderSummary } from "../../api/types";

// Matches the reference screenshot's order-summary card.
export default function OrderListCard({ order }: { order: OrderSummary }) {
  const navigate = useNavigate();
  const combinedTitle = order.items.map((i) => i.title).join(", ");
  const firstImage = order.items[0]?.image;

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, py: 3, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
      <Box sx={{ width: 72, height: 72, flexShrink: 0 }}>
        <NetworkImage src={firstImage ? storageImageUrl(firstImage) : ""} alt={combinedTitle} radius={12} />
      </Box>

      <Box sx={{ flex: "2 1 260px", minWidth: 0 }}>
        <Box
          sx={{
            fontSize: 14,
            fontWeight: 600,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {combinedTitle}
        </Box>
        <Box sx={{ mt: "4px", fontSize: 13, color: colors.additionalTextColor }}>{order.items.length} позиції</Box>
      </Box>

      <Box sx={{ flex: "1 1 260px", minWidth: 220, display: "flex", flexDirection: "column", gap: "8px" }}>
        <InfoRow label="Номер замовлення:" value={`№${order.number}`} />
        <InfoRow label="Сума замовлення:" value={`${order.sum.toFixed(2)} UAH`} />
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Box component="span" sx={{ fontSize: 13, color: colors.additionalTextColor }}>
            Статус:
          </Box>
          <OrderStatusBadge status={order.status} />
        </Box>

        <Box
          component="button"
          type="button"
          onClick={() => navigate(`${ROUTES.accountOrderDetail}${order.number}`)}
          sx={{
            mt: 1,
            height: 44,
            border: `1px solid ${colors.mainTextColor}`,
            borderRadius: "10px",
            background: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.5px",
            color: colors.mainTextColor,
          }}
        >
          ПЕРЕГЛЯНУТИ ЧЕК
        </Box>
      </Box>
    </Box>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
      <Box component="span" sx={{ fontSize: 13, color: colors.additionalTextColor }}>
        {label}
      </Box>
      <Box component="span" sx={{ fontSize: 13, fontWeight: 700 }}>
        {value}
      </Box>
    </Box>
  );
}
