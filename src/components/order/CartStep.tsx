import Box from "@mui/material/Box";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useNavigate } from "react-router-dom";
import NetworkImage from "../common/NetworkImage";
import NumericStepper from "../common/NumericStepper";
import CloseIcon from "../common/CloseIcon";
import ToProductButton from "../common/ToProductButton";
import { useCart } from "../../cart/CartContext";
import { colors } from "../../theme/theme";
import { iconHoverSx } from "../../theme/interactions";
import { ROUTES } from "../../routes";

// NOT ported from Dart — the Flutter source has no standalone cart page,
// only the CartDrawer (see cart_widget.dart/cart_list.dart), whose checkout
// button navigates straight to /order. This is step 0 of the order flow,
// built fresh to match the "МІЙ КОШИК" screenshot, reusing the same
// CartContext data the drawer uses.
export default function CartStep({ onNext }: { onNext: () => void }) {
  const cart = useCart();
  const navigate = useNavigate();
  const total = cart.items.reduce((sum, i) => sum + i.sum, 0);

  return (
    <Box>
      <Box component="h1" sx={{ m: 0, mb: 4, fontSize: 20, fontWeight: 700, textAlign: "center" }}>
        МІЙ КОШИК
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {cart.items.map((item) => (
          <Box
            key={item.productId}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              p: 2,
              borderRadius: "16px",
              backgroundColor: "rgba(0,0,0,0.03)",
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ width: 100, height: 100, flexShrink: 0 }}>
              <NetworkImage src={item.productImage} alt={item.productTitle} radius={8} />
            </Box>

            <Box sx={{ flex: "1 1 200px", minWidth: 160 }}>
              <Box sx={{ fontSize: 15, fontWeight: 700 }}>{item.productTitle}</Box>
              <Box sx={{ mt: "4px", fontSize: 13, color: colors.additionalTextColor }}>x {item.count}</Box>
            </Box>

            <NumericStepper
              value={item.count}
              onChange={(count) => cart.changeCount(item.productId, count)}
              minValue={1}
            />

            <Box sx={{ fontSize: 16, fontWeight: 700, minWidth: 90, textAlign: "right" }}>
              {item.sum.toFixed(0)} UAH
            </Box>

            <Box
              component="button"
              onClick={() => cart.removeItem(item.productId)}
              aria-label="Видалити товар"
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
              <CloseIcon size={16} color={colors.additionalTextColor} />
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <Box component="span" sx={{ fontSize: 18, fontWeight: 700 }}>
          Всього: {total.toFixed(0)} UAH
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2, mt: 5 }}>
        <Box
          component="button"
          onClick={() => navigate(ROUTES.products)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 700,
            color: colors.mainTextColor,
          }}
        >
          <ChevronLeftIcon sx={{ fontSize: 18 }} />
          ПОВЕРНУТИСЬ ДО ПОКУПОК
        </Box>

        <ToProductButton
          text="ОФОРМИТИ ЗАМОВЛЕННЯ"
          width={260}
          onClick={onNext}
          disabled={cart.items.length === 0}
        />
      </Box>
    </Box>
  );
}
