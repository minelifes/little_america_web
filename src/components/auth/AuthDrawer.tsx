import Drawer from "@mui/material/Drawer";
import { useAuth } from "../../auth/AuthContext";
import PhoneLoginDialog from "./PhoneLoginDialog";
import RegisterScreen from "./RegisterScreen";
import RegisterVerifyScreen from "./RegisterVerifyScreen";
import ForgotEmailScreen from "./ForgotEmailScreen";
import ForgotCodeScreen from "./ForgotCodeScreen";
import ForgotNewPasswordScreen from "./ForgotNewPasswordScreen";
import AccountScreen from "./AccountScreen";

// NOT ported from Dart — mirrors CartDrawer's MUI Drawer pattern (right-side
// slide-out panel), matching the reference screenshots' layout.
//
// "loginPhone" is the one exception: it renders as a centered modal
// (PhoneLoginDialog) instead of inside this Drawer — a single phone field
// looked out of place in a full-height side panel (see PhoneLoginDialog's
// doc comment). Every other screen still uses the Drawer as before.
export default function AuthDrawer() {
  const auth = useAuth();

  if (auth.screen === "loginPhone") {
    return <PhoneLoginDialog />;
  }

  const screens = {
    register: <RegisterScreen />,
    registerVerify: <RegisterVerifyScreen />,
    forgotEmail: <ForgotEmailScreen />,
    forgotCode: <ForgotCodeScreen />,
    forgotNewPassword: <ForgotNewPasswordScreen />,
    account: <AccountScreen />,
  };

  return (
    <Drawer
      anchor="right"
      open={auth.isOpen}
      onClose={auth.close}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 480 },
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      {screens[auth.screen]}
    </Drawer>
  );
}
