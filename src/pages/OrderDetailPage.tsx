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
  // isLoading (not isFetching) — an order's detail rarely changes once
  // placed, so once it's cached from a previous visit we want to show it
  // immediately, not blank the page back to a skeleton on every remount
  // (e.g. clicking into the same order a second time). React Query still
  // quietly revalidates it in the background; isLoading only stays true
  // for the very first fetch, when there's nothing cached yet to show.
  const { data: order, isLoading, isError } = useOrderDetail(number);

  // The list this order belongs to depends on how it was placed — an
  // in-store sale ("Мої покупки") vs a storefront checkout ("Замовлення",
  // see OrderDetail.isOnline) — so the back-breadcrumb and sidebar
  // highlight follow the order's own origin instead of always assuming
  // "Замовлення".
  const isOnline = order?.isOnline ?? true;
  const backRoute = isOnline ? ROUTES.accountOrders : ROUTES.accountPurchases;
  const backLabel = isOnline ? "ТЕПЕРІШНІ ЗАМОВЛЕННЯ" : "МОЇ ПОКУПКИ";

  return (
    <AccountPageLayout active={isOnline ? "orders" : "purchases"}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: 13, color: colors.additionalTextColor, mb: 3 }}>
        <Box
          component="button"
          type="button"
          onClick={() => navigate(backRoute)}
          sx={{ background: "none", border: "none", p: 0, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700, letterSpacing: "0.5px", color: colors.additionalTextColor }}
        >
          {backLabel}
        </Box>
        <Box component="span">›</Box>
        <Box component="span" sx={{ color: colors.mainTextColor, fontWeight: 700 }}>
          №{number}
        </Box>
      </Box>

      {isLoading && <ReceiptViewSkeleton />}
      {!isLoading && (isError || !order) && (
        <Box sx={{ fontSize: 14, color: colors.additionalTextColor }}>Замовлення не знайдено.</Box>
      )}

      {!isLoading && order && (
        <ReceiptView order={order} metaExtra={{ label: "Статус:", content: <OrderStatusBadge status={order.status} /> }} />
      )}
    </AccountPageLayout>
  );
}
