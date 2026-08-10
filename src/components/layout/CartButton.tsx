import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import CartIcon from "../common/CartIcon";
import { useCart } from "../../cart/CartContext";
import { iconHoverSx } from "../../theme/interactions";

// Ported from lib/resources/widgets/appbar/cart_button.dart. Opens the cart
// drawer (see CartDrawer, rendered once in Header) via CartContext state.
export default function CartButton() {
  const { count, toggle } = useCart();

  return (
    <Badge
      badgeContent={count}
      sx={{
        "& .MuiBadge-badge": {
          backgroundColor: "transparent",
          color: "#161616",
          fontSize: 13,
          fontWeight: 600,
          top: 2,
          right: 6,
        },
      }}
    >
      <Box
        component="button"
        onClick={toggle}
        aria-label="cart"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "none",
          border: "none",
          cursor: "pointer",
          ...iconHoverSx,
        }}
      >
        <CartIcon size={28} />
      </Box>
    </Badge>
  );
}
