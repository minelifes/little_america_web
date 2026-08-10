import Box from "@mui/material/Box";
import useWindowWidth from "../../hooks/useWindowWidth";
import HeaderDesktop from "./HeaderDesktop";
import HeaderMobile from "./HeaderMobile";
import CartDrawer from "../cart/CartDrawer";
import AuthDrawer from "../auth/AuthDrawer";

// Ported from lib/resources/widgets/appbar/app_bar.dart (breakpoint at 870px).
// Pinned to the viewport top so it stays visible while the page scrolls.
// Also owns the single CartDrawer/AuthDrawer instances — any CartButton/
// AccountButton (desktop or mobile) toggles them via CartContext/AuthContext.
export default function Header() {
  const width = useWindowWidth();
  return (
    <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1100 }}>
      {width < 870 ? <HeaderMobile /> : <HeaderDesktop />}
      <CartDrawer />
      <AuthDrawer />
    </Box>
  );
}
