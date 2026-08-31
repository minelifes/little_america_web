import Box from "@mui/material/Box";
import PersonIcon from "../common/PersonIcon";
import { useAuth } from "../../auth/AuthContext";
import { iconHoverSx } from "../../theme/interactions";

// NOT ported from Dart — no account icon exists in the Flutter appbar.
// Opens the auth drawer (see AuthDrawer, rendered once in Header) at the
// login screen if logged out, or the account screen if logged in — mirrors
// CartButton's pattern.
export default function AccountButton() {
  const auth = useAuth();
  // return (<></>);

  return (
    <Box
      component="button"
      onClick={() => auth.open()}
      aria-label="account"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "none",
        border: "none",
        cursor: "pointer",
        ...iconHoverSx,
      }}
    >
      <PersonIcon size={28} />
    </Box>
  );
}
