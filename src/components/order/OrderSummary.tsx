import Box from "@mui/material/Box";
import NetworkImage from "../common/NetworkImage";
import { colors } from "../../theme/theme";
import type { CartItem } from "../../api/types";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  /** Only shown when >0 — see order/deliveryFee.ts for why this is a UI-only placeholder. */
  deliveryFee?: number;
}

// Ported from OrderCartList (order_cart_list.dart) — the order-summary card
// shown alongside the checkout wizard's steps 1-2.
export default function OrderSummary({ items, subtotal, deliveryFee = 0 }: OrderSummaryProps) {
  return (
    <Box sx={{ borderRadius: "16px", backgroundColor: "rgba(0,0,0,0.03)", p: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map((item) => (
          <Box key={item.productId} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ width: 64, height: 64, flexShrink: 0 }}>
              <NetworkImage src={item.productImage} alt={item.productTitle} radius={8} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{
                  fontSize: 14,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {item.productTitle}
              </Box>
              <Box sx={{ mt: "2px", fontSize: 12, color: colors.additionalTextColor }}>x {item.count}</Box>
            </Box>
            <Box component="span" sx={{ fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
              {item.sum.toFixed(0)} UAH
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ height: 1, backgroundColor: "rgba(0,0,0,0.08)", my: 3 }} />

      {deliveryFee > 0 && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Box component="span" sx={{ fontSize: 14, color: colors.additionalTextColor }}>
            Доставка:
          </Box>
          <Box component="span" sx={{ fontSize: 14 }}>
            {deliveryFee.toFixed(0)} UAH
          </Box>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box component="span" sx={{ fontSize: 15, fontWeight: 700 }}>
          Всього:
        </Box>
        <Box component="span" sx={{ fontSize: 16, fontWeight: 700 }}>
          {(subtotal + deliveryFee).toFixed(0)} UAH
        </Box>
      </Box>
    </Box>
  );
}
