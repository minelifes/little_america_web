import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { colors } from "../../theme/theme";

interface AuthSubmitButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit";
}

// Full-width solid black CTA button used across the auth drawer (УВІЙТИ,
// ЗАРЕЄСТРУВАТИСЬ, ВІДПРАВИТИ, ПІДТВЕРДИТИ, ЗБЕРЕГТИ) — distinct from
// ToProductButton (outlined, hover-inverts, fixed width, arrow icon), which
// doesn't match this screenshot's plain solid-fill full-width style.
export default function AuthSubmitButton({ text, onClick, disabled, loading, type = "button" }: AuthSubmitButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Box
      component="button"
      type={type}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      sx={{
        width: "100%",
        height: 54,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        borderRadius: "10px",
        backgroundColor: disabled ? "#c4c4c4" : colors.mainColor,
        color: "#ffffff",
        fontFamily: "inherit",
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.5px",
        cursor: isDisabled ? "default" : "pointer",
      }}
    >
      {loading ? <CircularProgress size={20} sx={{ color: "#ffffff" }} /> : text}
    </Box>
  );
}
