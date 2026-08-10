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
  // isFetching (not just isLoading) so the loader also reappears on a
  // background refetch — e.g. navigating back to this receipt a second
  // time — not just on the very first load.
  const { data: order, isFetching, isError } = useOrderDetail(number);

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

      {isFetching && <ReceiptViewSkeleton />}
      {!isFetching && (isError || !order) && (
        <Box sx={{ fontSize: 14, color: colors.additionalTextColor }}>Транзакцію не знайдено.</Box>
      )}

      {!isFetching && order && (
        <ReceiptView
          order={order}
          metaExtra={{
            label: "Тип замовлення:",
            content: (
              <Box component="span" sx={{ fontSize: 13, fontWeight: 700 }}>
                Онлайн
              </Box>
            ),
          }}
        />
      )}
    </AccountPageLayout>
  );
}
