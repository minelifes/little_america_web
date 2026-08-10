import Box from "@mui/material/Box";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { RECEIPT_ACCENT_PINK } from "./ReceiptView";
import { colors } from "../../theme/theme";
import { formatUkrainianDateShort } from "../../utils/date";
import type { BonusTransaction } from "../../api/types";

export default function BonusTransactionRow({ transaction, onClick }: { transaction: BonusTransaction; onClick: () => void }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        width: "100%",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: 2,
        backgroundColor: "rgba(0,0,0,0.02)",
        border: "none",
        borderRadius: "14px",
        cursor: "pointer",
        fontFamily: "inherit",
        p: 3,
        mb: 2,
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Box component="span" sx={{ fontSize: 13, color: colors.additionalTextColor }}>
            {formatUkrainianDateShort(transaction.date)}
          </Box>
          <Box component="span" sx={{ fontSize: 13, fontWeight: 700, color: RECEIPT_ACCENT_PINK }}>
            +{transaction.points} Б
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Box component="span" sx={{ fontSize: 14, fontWeight: 600 }}>
            {transaction.type}
          </Box>
          <Box component="span" sx={{ fontSize: 14 }}>
            {transaction.amount.toFixed(2)} UAH
          </Box>
        </Box>
      </Box>
      <ChevronRightIcon sx={{ fontSize: 20, color: "rgba(0,0,0,0.3)", flexShrink: 0 }} />
    </Box>
  );
}
