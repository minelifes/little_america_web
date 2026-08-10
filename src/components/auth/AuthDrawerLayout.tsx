import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import AuthDrawerHeader from "./AuthDrawerHeader";

interface AuthDrawerLayoutProps {
  title: string;
  variant: "close" | "back";
  onHeaderAction: () => void;
  /** Description/form fields — scrollable middle section. */
  children: ReactNode;
  /** Buttons + bottom link — pinned to the bottom, matching CartDrawer's header/scrollable-middle/pinned-footer structure. */
  footer: ReactNode;
  error?: string | null;
}

export default function AuthDrawerLayout({ title, variant, onHeaderAction, children, footer, error }: AuthDrawerLayoutProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <AuthDrawerHeader title={title} variant={variant} onAction={onHeaderAction} />

      <Box sx={{ flex: 1, overflowY: "auto", px: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        {children}
        {error && (
          <Box sx={{ color: "#e53935", fontSize: 13 }} role="alert">
            {error}
          </Box>
        )}
      </Box>

      <Box sx={{ flexShrink: 0, p: 3, display: "flex", flexDirection: "column", gap: 2 }}>{footer}</Box>
    </Box>
  );
}
