import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AuthDrawerHeader from "./AuthDrawerHeader";
import ArrowIcon from "../common/ArrowIcon";
import { useAuth } from "../../auth/AuthContext";
import { useBonusBalance } from "../../api/hooks";
import { colors } from "../../theme/theme";
import { ROUTES } from "../../routes";
import { formatPhoneDisplay } from "../../order/phone";
import { useBonuses } from "../../api/constants";

// Matches the reference screenshot's logged-in account screen — replaces
// the previous minimal placeholder now that a real design exists. Shown
// automatically when a logged-in user taps the account icon (see
// AuthContext.open()).
//
// Avatar/name/phone are real (from AuthContext.userDisplay) — email used to
// be shown here but was retired as a display field (phone is the account's
// real identity now, see PhoneLoginDialog). The bonus
// balance is now real too — GET /api/v2/wallet via useBonusBalance (see
// api/hooks.ts) — previously hardcoded to "0". All three rows navigate to
// their real pages (settings/orders/bonuses).
const ACCENT_PINK = "#E28A9C";
const ACCENT_PINK_STRONG = "#DD5D79";
const ACCENT_PINK_LIGHT = "#FBEFF1";
// Matches the error-red used elsewhere in this app (e.g. SettingsForm's
// save-error text) — no dedicated error/danger color exists in theme.ts yet.
const LOGOUT_RED = "#e53935";

// Scattered "Б" watermark circles behind the balance pill — hand-placed to
// roughly match the reference crop (some cropped at the top/bottom edge by
// the outer box's overflow: hidden).
const BONUS_DECORATIONS = [
  { top: "-25%", left: "44%", size: 92, rotate: -10, opacity: 0.3 },
  { top: "8%", left: "60%", size: 66, rotate: 16, opacity: 0.22 },
  { top: "-14%", left: "70%", size: 52, rotate: 6, opacity: 0.16 },
  { top: "58%", left: "37%", size: 58, rotate: -8, opacity: 0.18 },
  { top: "62%", left: "50%", size: 46, rotate: 12, opacity: 0.26 },
  { top: "48%", left: "65%", size: 44, rotate: -18, opacity: 0.16 },
];

export default function AccountScreen() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { data: wallet } = useBonusBalance();
  const name = auth.userDisplay?.name?.trim();
  const phone = auth.userDisplay?.phone ?? "";
  const initial = (name?.[0] ?? "?").toUpperCase();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <AuthDrawerHeader title="АКАУНТ" variant="close" onAction={auth.close} />

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: ACCENT_PINK,
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {initial}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            {name && (
              <Box
                sx={{
                  fontSize: 15,
                  fontWeight: 700,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {name}
              </Box>
            )}
            <Box
              sx={{
                fontSize: 13,
                color: colors.additionalTextColor,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {phone ? formatPhoneDisplay(phone) : ""}
            </Box>
          </Box>
        </Box>

        {useBonuses && (
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "999px",
            backgroundColor: ACCENT_PINK_LIGHT,
            height: 68,
            flexShrink: 0,
          }}
        >
          {BONUS_DECORATIONS.map((d, i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                top: d.top,
                left: d.left,
                width: d.size,
                height: d.size,
                borderRadius: "50%",
                backgroundColor: ACCENT_PINK,
                opacity: d.opacity,
                transform: `rotate(${d.rotate}deg)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <Box
                component="span"
                sx={{
                  fontSize: d.size * 0.42,
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                Б
              </Box>
            </Box>
          ))}

          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 3,
            }}
          >
            <Box
              component="span"
              sx={{ fontSize: 13, color: "rgba(0,0,0,0.35)" }}
            >
              Баланс бонусів:
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "#ffffff",
                borderRadius: "999px",
                height: 46,
                pl: "6px",
                pr: "18px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.10)",
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${ACCENT_PINK_STRONG} 0%, #F3AABE 100%)`,
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                Б
              </Box>
              <Box
                component="span"
                sx={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: ACCENT_PINK_STRONG,
                }}
              >
                {wallet?.balance ?? 0}
              </Box>
            </Box>
          </Box>
        </Box>
        )}

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <AccountMenuRow
            icon={<ManageAccountsOutlinedIcon sx={{ fontSize: 22 }} />}
            label="Налаштування"
            onClick={() => {
              auth.close();
              navigate(ROUTES.accountSettings);
            }}
          />
          <AccountMenuRow
            icon={<Inventory2OutlinedIcon sx={{ fontSize: 22 }} />}
            label="Замовлення"
            onClick={() => {
              auth.close();
              navigate(ROUTES.accountOrders);
            }}
          />
          <AccountMenuRow
            icon={<StorefrontOutlinedIcon sx={{ fontSize: 22 }} />}
            label="Мої покупки"
            onClick={() => {
              auth.close();
              navigate(ROUTES.accountPurchases);
            }}
          />
          {useBonuses && (
            <AccountMenuRow
              icon={<WorkspacePremiumOutlinedIcon sx={{ fontSize: 22 }} />}
              label="Бонуси"
              onClick={() => {
                auth.close();
                navigate(ROUTES.accountBonuses);
              }}
            />
          )}
        </Box>
      </Box>

      <Box
        sx={{ flexShrink: 0, p: 3, display: "flex", justifyContent: "center" }}
      >
        <Box
          component="button"
          type="button"
          onClick={auth.logout}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: "18px",
            py: "10px",
            borderRadius: "999px",
            border: `1px solid ${LOGOUT_RED}`,
            background: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 14,
            fontWeight: 600,
            color: LOGOUT_RED,
          }}
        >
          Вийти
          <ArrowIcon width={20} color={LOGOUT_RED} />
        </Box>
      </Box>
    </Box>
  );
}

function AccountMenuRow({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        width: "100%",
        py: "16px",
        background: "none",
        border: "none",
        cursor: onClick ? "pointer" : "default",
        fontFamily: "inherit",
        color: colors.mainTextColor,
      }}
    >
      <Box sx={{ display: "flex", color: colors.mainTextColor }}>{icon}</Box>
      <Box component="span" sx={{ fontSize: 14, flex: 1, textAlign: "left" }}>
        {label}
      </Box>
      <ChevronRightIcon sx={{ fontSize: 20, color: "rgba(0,0,0,0.3)" }} />
    </Box>
  );
}
