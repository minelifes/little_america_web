import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "../common/MenuIcon";
import CloseIcon from "../common/CloseIcon";
import MenuItem from "./MenuItem";
import { ROUTES } from "../../routes";
import { iconHoverSx } from "../../theme/interactions";

// Ported from lib/resources/widgets/appbar/hamburger_menu.dart +
// lib/resources/widgets/drawer_component.dart
export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        component="button"
        onClick={() => setOpen(true)}
        aria-label="menu"
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
        <MenuIcon />
      </Box>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 260, py: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", px: 2, mb: 1 }}>
            <Box
              component="button"
              onClick={() => setOpen(false)}
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...iconHoverSx,
              }}
            >
              <CloseIcon />
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <MenuItem text="Головна" route={ROUTES.home} onClick={() => setOpen(false)} />
            <MenuItem text="Товари" route={ROUTES.products} onClick={() => setOpen(false)} />
            <MenuItem text="Про нас" route={ROUTES.aboutUs} onClick={() => setOpen(false)} />
            <MenuItem text="Контакти" route={ROUTES.contacts} onClick={() => setOpen(false)} />
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
