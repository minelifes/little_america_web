import Box from "@mui/material/Box";
import { useAuth } from "../../auth/AuthContext";
import { colors } from "../../theme/theme";

// "Увійти або Зареєструватися" — bottom row shared by all three
// forgot-password steps, breaking out of the reset flow entirely.
export default function AuthLoginOrRegisterLinks() {
  const auth = useAuth();

  const linkSx = {
    background: "none",
    border: "none",
    p: 0,
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 13,
    fontWeight: 700,
    color: colors.mainTextColor,
    textDecoration: "underline",
  } as const;

  return (
    <Box
      sx={{
        textAlign: "center",
        fontSize: 13,
        color: colors.additionalTextColor,
      }}
    >
      <Box
        component="button"
        type="button"
        onClick={() => auth.goTo("loginPhone")}
        sx={linkSx}
      >
        Увійти
      </Box>{" "}
      або{" "}
      <Box
        component="button"
        type="button"
        onClick={() => auth.goTo("register")}
        sx={linkSx}
      >
        Зареєструватися
      </Box>
    </Box>
  );
}
