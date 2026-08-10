import Box from "@mui/material/Box";
import { RECEIPT_ACCENT_PINK } from "./ReceiptView";

// Small "Б {points}" pill — the compact version used on the Bonuses page's
// balance row (the drawer's AccountScreen has its own fancier decorated
// version of the same idea).
export default function BonusPill({ points }: { points: number }) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        backgroundColor: RECEIPT_ACCENT_PINK,
        color: "#ffffff",
        borderRadius: "999px",
        fontSize: 13,
        fontWeight: 700,
        px: "12px",
        py: "6px",
      }}
    >
      Б {points}
    </Box>
  );
}
