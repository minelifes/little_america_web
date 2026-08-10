import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import ArrowIcon from "../common/ArrowIcon";
import { useAuth } from "../../auth/AuthContext";
import { colors } from "../../theme/theme";
import { ROUTES } from "../../routes";

export type AccountSection = "settings" | "orders" | "bonuses";

interface AccountSidebarProps {
  active: AccountSection;
}

// NOT ported from Dart — left-nav for the logged-in account pages, matching
// the reference screenshot. Same icon set as AccountScreen's drawer menu.
export default function AccountSidebar({ active }: AccountSidebarProps) {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ width: 280, flexShrink: 0, display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <SidebarRow
          icon={<ManageAccountsOutlinedIcon sx={{ fontSize: 20 }} />}
          label="Налаштування"
          isActive={active === "settings"}
          onClick={active === "settings" ? undefined : () => navigate(ROUTES.accountSettings)}
        />
        <SidebarRow
          icon={<Inventory2OutlinedIcon sx={{ fontSize: 20 }} />}
          label="Замовлення"
          isActive={active === "orders"}
          onClick={active === "orders" ? undefined : () => navigate(ROUTES.accountOrders)}
        />
        <SidebarRow
          icon={<WorkspacePremiumOutlinedIcon sx={{ fontSize: 20 }} />}
          label="Бонуси"
          isActive={active === "bonuses"}
          onClick={active === "bonuses" ? undefined : () => navigate(ROUTES.accountBonuses)}
        />
      </Box>

      <Box sx={{ mt: "auto", pt: 6 }}>
        <Box
          component="button"
          type="button"
          onClick={auth.logout}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 14,
            fontWeight: 600,
            color: colors.mainTextColor,
          }}
        >
          <ArrowIcon width={20} rotate />
          Вийти
        </Box>
      </Box>
    </Box>
  );
}

function SidebarRow({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        width: "100%",
        py: "14px",
        background: "none",
        border: "none",
        cursor: onClick ? "pointer" : "default",
        fontFamily: "inherit",
        color: isActive ? colors.mainTextColor : colors.additionalTextColor,
      }}
    >
      {icon}
      <Box component="span" sx={{ fontSize: 14 }}>
        {label}
      </Box>
      {isActive && (
        <Box
          sx={{
            position: "absolute",
            right: -16,
            top: "18%",
            bottom: "18%",
            width: "1px",
            backgroundColor: "rgba(0,0,0,0.15)",
          }}
        />
      )}
    </Box>
  );
}
