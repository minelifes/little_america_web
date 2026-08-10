import Box from "@mui/material/Box";
import { useNavigate, useParams } from "react-router-dom";
import AccountPageLayout from "../components/account/AccountPageLayout";
import OrderStatusBadge from "../components/account/OrderStatusBadge";
import ReceiptView from "../components/account/ReceiptView";
import ReceiptViewSkeleton from "../components/account/ReceiptViewSkeleton";
import { useOrderDetail } from "../api/hooks";
import { colors } from "../theme/theme";
import { ROUTES } from "../routes";

// NOT ported from Dart — order receipt/detail view matching the reference
// screenshot. Backed by the real GET /api/v2/order/web/{number} endpoint
// (see api/hooks.ts useOrderDetail).
export default function OrderDetailPage() {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  // isFetching (not just isLoading) so the loader also reappears on a
  // background refetch — e.g. navigating away from this page and back —
  // not just on the very first load.
  const { data: order, isFetching, isError } = useOrderDetail(number);

  return (
    <AccountPageLayout active="orders">
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: 13, color: colors.additionalTextColor, mb: 3 }}>
        <Box
          component="button"
          type="button"
          onClick={() => navigate(ROUTES.accountOrders)}
          sx={{ background: "none", border: "none", p: 0, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700, letterSpacing: "0.5px", color: colors.additionalTextColor }}
        >
          ТЕПЕРІШНІ ЗАМОВЛЕННЯ
        </Box>
        <Box component="span">›</Box>
        <Box component="span" sx={{ color: colors.mainTextColor, fontWeight: 700 }}>
          №{number}
        </Box>
      </Box>

      {isFetching && <ReceiptViewSkeleton />}
      {!isFetching && (isError || !order) && (
        <Box sx={{ fontSize: 14, color: colors.additionalTextColor }}>Замовлення не знайдено.</Box>
      )}

      {!isFetching && order && (
        <ReceiptView order={order} metaExtra={{ label: "Статус:", content: <OrderStatusBadge status={order.status} /> }} />
      )}
    </AccountPageLayout>
  );
}
