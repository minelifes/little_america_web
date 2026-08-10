import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useNavigate } from "react-router-dom";
import AccountPageLayout from "../components/account/AccountPageLayout";
import BonusPill from "../components/account/BonusPill";
import BonusTransactionRow from "../components/account/BonusTransactionRow";
import BonusTransactionRowSkeleton from "../components/account/BonusTransactionRowSkeleton";
import { useBonusBalance, useBonusHistory } from "../api/hooks";
import { colors } from "../theme/theme";
import { ROUTES } from "../routes";

// NOT ported from Dart — matches the reference screenshot. Backed by the
// real GET /api/v2/wallet (balance) and GET /api/v2/wallet/history
// endpoints (see api/hooks.ts useBonusBalance/useBonusHistory) — previously
// entirely local mock data (account/mockBonuses.ts). Bonus points are
// earned per-product (see ProductModel.bonus) and credited automatically
// when a web order is placed — see the backend's WalletService.
export default function BonusesPage() {
  const navigate = useNavigate();
  // isFetching (not just isLoading) so the loader also reappears on a
  // background refetch — e.g. navigating away from this page and back —
  // not just on the very first load before anything was ever cached.
  const { data: wallet, isFetching: isWalletLoading } = useBonusBalance();
  const { data: transactions, isFetching: isHistoryLoading } = useBonusHistory();

  return (
    <AccountPageLayout active="bonuses">
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 3 }}>
        <Box sx={{ fontSize: 18, fontWeight: 600 }}>Бонуси</Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box component="span" sx={{ fontSize: 13, color: colors.additionalTextColor }}>
            Баланс бонусів:
          </Box>
          {isWalletLoading ? (
            <Skeleton variant="rounded" width={70} height={28} sx={{ borderRadius: "999px" }} />
          ) : (
            <BonusPill points={wallet?.balance ?? 0} />
          )}
        </Box>
      </Box>

      {isHistoryLoading &&
        Array.from({ length: 4 }).map((_, i) => <BonusTransactionRowSkeleton key={i} />)}

      {!isHistoryLoading && transactions?.length === 0 && (
        <Box sx={{ fontSize: 14, color: colors.additionalTextColor }}>Транзакцій ще немає.</Box>
      )}

      {!isHistoryLoading &&
        transactions?.map((t) => (
          <BonusTransactionRow
            key={`${t.orderNumber}-${t.date}`}
            transaction={t}
            onClick={() => navigate(`${ROUTES.accountBonusDetail}${t.orderNumber}`)}
          />
        ))}

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 5 }}>
        <Box
          component="button"
          type="button"
          onClick={() => navigate(ROUTES.products)}
          sx={{
            height: 50,
            px: "28px",
            border: "none",
            borderRadius: "10px",
            backgroundColor: colors.mainColor,
            color: "#ffffff",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.5px",
            cursor: "pointer",
          }}
        >
          КАТАЛОГ ТОВАРІВ
        </Box>
      </Box>
    </AccountPageLayout>
  );
}
