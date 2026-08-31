import Box from "@mui/material/Box";
import { useState } from "react";
import AccountPageLayout from "../components/account/AccountPageLayout";
import OrderListCard from "../components/account/OrderListCard";
import OrderListCardSkeleton from "../components/account/OrderListCardSkeleton";
import OrderPagination from "../components/account/OrderPagination";
import { useMyPurchases } from "../api/hooks";
import { colors } from "../theme/theme";

// NOT ported from Dart — "Мої покупки", the in-store counterpart of
// OrdersPage's "Замовлення". Backed by the same GET /api/v2/order/web/list
// endpoint but with online=false (see api/hooks.ts useMyPurchases) — these
// are sales a staff member rang up in-store and linked to this client by
// phone (see StoreClientDialog on the admin app), not orders the client
// placed themselves through this storefront. No current/past tabs here —
// an in-store sale is always a completed transaction, unlike a web order
// that can still be in progress.
export default function PurchasesPage() {
  const [page, setPage] = useState(1);
  // isFetching (not just isLoading) so the loader also reappears on a
  // background refetch — e.g. navigating away from this page and back —
  // not just on the very first load before anything was ever cached.
  const { data, isFetching: isLoading } = useMyPurchases(page);

  const items = data?.items ?? [];

  return (
    <AccountPageLayout active="purchases">
      <Box sx={{ fontSize: 18, fontWeight: 600, mb: 3 }}>Мої покупки</Box>

      {isLoading && (
        <Box>
          {Array.from({ length: 3 }).map((_, i) => (
            <OrderListCardSkeleton key={i} />
          ))}
        </Box>
      )}

      {!isLoading && items.length === 0 && (
        <Box sx={{ fontSize: 14, color: colors.additionalTextColor }}>Покупок ще не було.</Box>
      )}

      {!isLoading && items.length > 0 && (
        <Box>
          {items.map((order) => (
            <OrderListCard key={order.number} order={order} />
          ))}
        </Box>
      )}

      {!isLoading && <OrderPagination page={page} totalPages={data?.totalPages ?? 1} onChange={setPage} />}
    </AccountPageLayout>
  );
}
