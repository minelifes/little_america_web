import Box from "@mui/material/Box";
import { colors } from "../../theme/theme";

interface AuthLinkRowProps {
  prefix: string;
  linkText: string;
  onClick: () => void;
}

// "Не маєте акаунту? Зареєструватися" / "Вже маєте аккаунт? Увійти" — the
// bottom link on the Login/Register screens.
export default function AuthLinkRow({ prefix, linkText, onClick }: AuthLinkRowProps) {
  return (
    <Box sx={{ textAlign: "center", fontSize: 13, color: colors.additionalTextColor }}>
      {prefix}{" "}
      <Box
        component="button"
        type="button"
        onClick={onClick}
        sx={{
          background: "none",
          border: "none",
          p: 0,
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: 13,
          fontWeight: 700,
          color: colors.mainTextColor,
          textDecoration: "underline",
        }}
      >
        {linkText}
      </Box>
    </Box>
  );
}
