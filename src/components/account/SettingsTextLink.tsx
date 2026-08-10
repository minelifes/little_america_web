import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import { colors } from "../../theme/theme";

interface SettingsTextLinkProps {
  text: string;
  icon?: ReactNode;
  onClick: () => void;
  color?: string;
  disabled?: boolean;
}

// Plain text+icon link used for the settings page's secondary actions
// (ЗМІНИТИ ПАРОЛЬ / СКАСУВАТИ / ЗБЕРЕГТИ ПАРОЛЬ / ЗБЕРЕГТИ) — matches the
// reference screenshot, distinct from the one primary solid button
// (РЕДАГУВАТИ).
export default function SettingsTextLink({ text, icon, onClick, color = colors.mainTextColor, disabled }: SettingsTextLinkProps) {
  return (
    <Box
      component="button"
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: "none",
        border: "none",
        p: 0,
        cursor: disabled ? "default" : "pointer",
        fontFamily: "inherit",
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.5px",
        color,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {text}
      {icon}
    </Box>
  );
}
