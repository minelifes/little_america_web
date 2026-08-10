import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import { Navigate } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import GradientLine from "../common/GradientLine";
import AccountSidebar from "./AccountSidebar";
import type { AccountSection } from "./AccountSidebar";
import { useAuth } from "../../auth/AuthContext";
import { ROUTES } from "../../routes";

interface AccountPageLayoutProps {
  active: AccountSection;
  children: ReactNode;
}

// Shared shell (Header + "АКАУНТ" title + divider + sidebar) for the
// logged-in account pages (settings/orders/bonuses) — factored out of
// AccountSettingsPage once a second page (orders) needed the same layout.
export default function AccountPageLayout({
  active,
  children,
}: AccountPageLayoutProps) {
  const auth = useAuth();

  if (!auth.isLoggedIn) {
    return <Navigate to={ROUTES.home} replace />;
  }

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      <Header />
      <Box component="main" sx={{ display: "block" }}>
        <Box sx={{ height: { xs: 100, sm: 140 } }} />

        <Box
          sx={{
            textAlign: "center",
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "0.5px",
          }}
        >
          АКАУНТ
        </Box>
        <GradientLine padding="16px 32px 36px 32px" />

        <Box
          sx={{
            px: { xs: 2, md: 4 },
            pb: 8,
            maxWidth: 1200,
            mx: "auto",
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
          }}
        >
          <AccountSidebar active={active} />
          <Box sx={{ flex: "1 1 480px", minWidth: 0 }}>{children}</Box>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}
