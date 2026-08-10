import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { useNavigate } from "react-router-dom";
import CartIcon from "../common/CartIcon";
import CloseIcon from "../common/CloseIcon";
import NumericStepper from "../common/NumericStepper";
import NetworkImage from "../common/NetworkImage";
import GradientLine from "../common/GradientLine";
import { useCart } from "../../cart/CartContext";
import { colors } from "../../theme/theme";
import { ROUTES } from "../../routes";
import { iconHoverSx } from "../../theme/interactions";
import type { CartItem } from "../../api/types";

// NOT ported from Dart source directly — the Flutter app's cart lives behind
// a full route (lib/resources/pages/cart_page), not a slide-out drawer. This
// follows the target screenshot instead: a right-side drawer, opened from
// the appbar cart icon, showing line items + total + a checkout CTA that
// hands off to the (still-placeholder) /order route.
export default function CartDrawer() {
  const cart = useCart();
  const navigate = useNavigate();
  const total = cart.items.reduce((sum, i) => sum + i.sum, 0);

  const handleCheckout = () => {
    cart.close();
    navigate(ROUTES.order);
  };

  return (
    <Drawer
      anchor="right"
      open={cart.isOpen}
      onClose={cart.close}
      slotProps={{ paper: { sx: { width: { xs: "100%", sm: 420 }, display: "flex", flexDirection: "column" } } }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, pt: 3, pb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box component="span" sx={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.5px" }}>
            МОЯ КОРЗИНА
          </Box>
          <CartIcon size={20} />
          <Box component="span" sx={{ fontSize: 14, fontWeight: 600 }}>
            {cart.count}
          </Box>
        </Box>
        <Box
          component="button"
          onClick={cart.close}
          aria-label="close cart"
          sx={{
            background: "none",
            border: "none",
            cursor: "pointer",
            width: 36,
            height: 36,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...iconHoverSx,
          }}
        >
          <CloseIcon size={20} />
        </Box>
      </Box>

      <GradientLine padding="0 24px 0 24px" />

      <Box sx={{ flex: 1, overflowY: "auto", px: 3 }}>
        {cart.items.length === 0 ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.additionalTextColor,
              fontSize: 14,
              textAlign: "center",
            }}
          >
            Кошик порожній
          </Box>
        ) : (
          cart.items.map((item) => (
            <CartLineItem
              key={item.productId}
              item={item}
              onRemove={() => cart.removeItem(item.productId)}
              onChangeCount={(count) => cart.changeCount(item.productId, count)}
            />
          ))
        )}
      </Box>

      {cart.items.length > 0 && (
        <Box sx={{ flexShrink: 0 }}>
          <GradientLine padding="16px 24px" />
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3 }}>
            <Box component="span" sx={{ fontSize: 14, color: colors.additionalTextColor }}>
              Усього
            </Box>
            <Box component="span" sx={{ fontSize: 22, fontWeight: 700 }}>
              {total.toFixed(2)} ₴
            </Box>
          </Box>

          <Box sx={{ p: 3 }}>
            <Box
              component="button"
              onClick={handleCheckout}
              sx={{
                width: "100%",
                height: 54,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
                border: "none",
                borderRadius: "16px",
                backgroundColor: colors.mainColor,
                color: "#ffffff",
                fontFamily: "inherit",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.5px",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
              }}
            >
              ОФОРМИТИ ЗАМОВЛЕННЯ
              <CartIcon size={20} color="#ffffff" />
            </Box>
          </Box>
        </Box>
      )}
    </Drawer>
  );
}

function CartLineItem({
  item,
  onRemove,
  onChangeCount,
}: {
  item: CartItem;
  onRemove: () => void;
  onChangeCount: (count: number) => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        py: 3,
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        "&:last-of-type": { borderBottom: "none" },
      }}
    >
      <Box sx={{ width: 72, height: 88, flexShrink: 0 }}>
        <NetworkImage src={item.productImage} alt={item.productTitle} radius={8} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, height: 88, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
          <Box
            component="span"
            sx={{
              fontSize: 14,
              fontWeight: 700,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {item.productTitle}
          </Box>
          <Box
            component="button"
            onClick={onRemove}
            aria-label="remove from cart"
            sx={{
              background: "none",
              border: "none",
              cursor: "pointer",
              width: 26,
              height: 26,
              borderRadius: "50%",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...iconHoverSx,
            }}
          >
            <CloseIcon size={14} color={colors.additionalTextColor} />
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box component="span" sx={{ fontSize: 15, fontWeight: 700 }}>
            {item.sum.toFixed(2)} ₴
          </Box>
          <NumericStepper value={item.count} onChange={onChangeCount} minValue={1} />
        </Box>
      </Box>
    </Box>
  );
}
