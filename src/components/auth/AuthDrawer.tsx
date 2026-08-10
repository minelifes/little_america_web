import Drawer from "@mui/material/Drawer";
import { useAuth } from "../../auth/AuthContext";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import RegisterVerifyScreen from "./RegisterVerifyScreen";
import ForgotEmailScreen from "./ForgotEmailScreen";
import ForgotCodeScreen from "./ForgotCodeScreen";
import ForgotNewPasswordScreen from "./ForgotNewPasswordScreen";
import AccountScreen from "./AccountScreen";

// NOT ported from Dart — mirrors CartDrawer's MUI Drawer pattern (right-side
// slide-out panel), matching the reference screenshots' layout.
export default function AuthDrawer() {
  const auth = useAuth();

  const screens = {
    login: <LoginScreen />,
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
      slotProps={{ paper: { sx: { width: { xs: "100%", sm: 480 }, display: "flex", flexDirection: "column" } } }}
    >
      {screens[auth.screen]}
    </Drawer>
  );
}
