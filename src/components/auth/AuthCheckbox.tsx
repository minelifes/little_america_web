import Box from "@mui/material/Box";
import CheckIcon from "@mui/icons-material/Check";
import { colors } from "../../theme/theme";

interface AuthCheckboxProps {
  label: string;
  checked: boolean;
  onClick: () => void;
}

// Matches the reference screenshot's "Зберегти данні" checkbox — same
// rounded-square visual pattern as OrderDeliveryStep's PaymentOption.
export default function AuthCheckbox({ label, checked, onClick }: AuthCheckboxProps) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "none",
        border: "none",
        cursor: "pointer",
        p: 0,
        fontFamily: "inherit",
      }}
    >
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: "4px",
          border: `1.5px solid ${checked ? colors.mainColor : "rgba(0,0,0,0.3)"}`,
          backgroundColor: checked ? colors.mainColor : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {checked && <CheckIcon sx={{ fontSize: 14, color: "#ffffff" }} />}
      </Box>
      <Box component="span" sx={{ fontSize: 13, color: colors.mainTextColor }}>
        {label}
      </Box>
    </Box>
  );
}
