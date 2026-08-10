import { useState } from "react";
import Box from "@mui/material/Box";
import AccountPageLayout from "../components/account/AccountPageLayout";
import OrderListCard from "../components/account/OrderListCard";
import OrderListCardSkeleton from "../components/account/OrderListCardSkeleton";
import OrderPagination from "../components/account/OrderPagination";
import { useMyOrders } from "../api/hooks";
import { colors } from "../theme/theme";

type Tab = "current" | "past";

// NOT ported from Dart — matches the reference screenshots. Backed by the
// real GET /api/v2/order/web/list endpoint (see api/hooks.ts useMyOrders) —
// previously entirely local mock data (account/mockOrders.ts).
//
// KNOWN SIMPLIFICATION: the backend has no "current vs past" concept (just
// one ordered order list) — the two tabs here filter whatever page is
// currently loaded by status ("done" = past, everything else = current).
// Pagination (page numbers/totalPages) reflects the real, unfiltered list,
// so a given page may show a different number of cards per tab than its
// neighbors. A real status filter query param on the backend would be
// needed to make per-tab pagination fully accurate.
export default function OrdersPage() {
  const [tab, setTab] = useState<Tab>("current");
  const [page, setPage] = useState(1);
  // isFetching (not just isLoading) so the loader also reappears on a
  // background refetch — e.g. navigating away from this page and back —
  // not just on the very first load before anything was ever cached.
  const { data, isFetching: isLoading } = useMyOrders(page);

  const items = (data?.items ?? []).filter((o) => (tab === "past" ? o.status === "done" : o.status !== "done"));

  const switchTab = (next: Tab) => {
    setTab(next);
    setPage(1);
  };

  return (
    <AccountPageLayout active="orders">
      <Box sx={{ fontSize: 18, fontWeight: 600, mb: 3 }}>Замовлення</Box>

      <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
        <TabButton label="ТЕПЕРІШНІ" active={tab === "current"} onClick={() => switchTab("current")} />
        <TabButton label="МИНУЛІ" active={tab === "past"} onClick={() => switchTab("past")} />
      </Box>

      {isLoading && (
        <Box>
          {Array.from({ length: 3 }).map((_, i) => (
            <OrderListCardSkeleton key={i} />
          ))}
        </Box>
      )}

      {!isLoading && items.length === 0 && (
        <Box sx={{ fontSize: 14, color: colors.additionalTextColor }}>Замовлення ще не були зроблені.</Box>
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

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        height: 40,
        px: "18px",
        border: active ? `1px solid ${colors.mainTextColor}` : "1px solid transparent",
        borderRadius: "8px",
        background: "none",
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.5px",
        color: active ? colors.mainTextColor : colors.additionalTextColor,
      }}
    >
      {label}
    </Box>
  );
}
