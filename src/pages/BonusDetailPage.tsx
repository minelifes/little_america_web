import Box from "@mui/material/Box";
import { useNavigate, useParams } from "react-router-dom";
import AccountPageLayout from "../components/account/AccountPageLayout";
import ReceiptView from "../components/account/ReceiptView";
import ReceiptViewSkeleton from "../components/account/ReceiptViewSkeleton";
import { useOrderDetail } from "../api/hooks";
import { colors } from "../theme/theme";
import { ROUTES } from "../routes";

// NOT ported from Dart — bonus transaction receipt, matching the reference
// screenshot exactly ("ТРАНЗАКЦІЇ БОНУСІВ › ЧЕК" breadcrumb + "Тип
// замовлення: Онлайн" instead of the order receipt's status badge). Reuses
// ReceiptView and the same GET /api/v2/order/web/{number} endpoint as
// OrderDetailPage — a bonus transaction is just a view onto the order that
// earned it, same as before (see the backend's WalletHistory.orderId link).
export default function BonusDetailPage() {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  // isLoading (not isFetching) — see OrderDetailPage's identical comment:
  // don't blank a cached receipt back to a skeleton just because the page
  // remounted, only when there's truly nothing cached yet.
  const { data: order, isLoading, isError } = useOrderDetail(number);

  return (
    <AccountPageLayout active="bonuses">
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: 13, color: colors.additionalTextColor, mb: 3 }}>
        <Box
          component="button"
          type="button"
          onClick={() => navigate(ROUTES.accountBonuses)}
          sx={{
            background: "none",
            border: "none",
            p: 0,
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.5px",
            color: colors.additionalTextColor,
          }}
        >
          ТРАНЗАКЦІЇ БОНУСІВ
        </Box>
        <Box component="span">›</Box>
        <Box component="span" sx={{ color: colors.mainTextColor, fontWeight: 700 }}>
          ЧЕК
        </Box>
      </Box>

      {isLoading && <ReceiptViewSkeleton />}
      {!isLoading && (isError || !order) && (
        <Box sx={{ fontSize: 14, color: colors.additionalTextColor }}>Транзакцію не знайдено.</Box>
      )}

      {!isLoading && order && (
        <ReceiptView
          order={order}
          metaExtra={{
            label: "Тип замовлення:",
            content: (
              <Box component="span" sx={{ fontSize: 13, fontWeight: 700 }}>
                {order.isOnline ? "Онлайн" : "У магазині"}
              </Box>
            ),
          }}
        />
      )}
    </AccountPageLayout>
  );
}
