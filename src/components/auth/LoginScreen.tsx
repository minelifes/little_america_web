import { useState } from "react";
import Box from "@mui/material/Box";
import FlatTextField from "../common/FlatTextField";
import AuthDrawerLayout from "./AuthDrawerLayout";
import AuthSubmitButton from "./AuthSubmitButton";
import AuthCheckbox from "./AuthCheckbox";
import GoogleButton from "./GoogleButton";
import AuthLinkRow from "./AuthLinkRow";
import TurnstileWidget from "./TurnstileWidget";
import { useAuth } from "../../auth/AuthContext";
import { authUserApi } from "../../api/services";
import { isEmailValid } from "../../auth/validation";
import { nameFromToken } from "../../auth/userDisplay";
import { colors } from "../../theme/theme";

// NOT ported from Dart — no login screen exists in the Flutter source.
// Built from the reference screenshot; POSTs to /api/v2/client-auth/login
// (tenant-scoped client login — see ClientAuthController.kt on the backend;
// distinct from the master-DB /api/v2/auth/login used by admin/POS staff).
export default function LoginScreen() {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = isEmailValid(email) && password.length > 0;

  const handleSubmit = async () => {
    if (!valid || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const token = await authUserApi.login({ email: email.trim(), password, captchaToken });
      auth.onAuthSuccess(token, { name: nameFromToken(token), email: email.trim() }, remember);
    } catch {
      setError("Невірна пошта або пароль.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthDrawerLayout
      title="ВХІД"
      variant="close"
      onHeaderAction={auth.close}
      error={error}
      footer={
        <>
          <AuthSubmitButton text="УВІЙТИ" onClick={handleSubmit} disabled={!valid} loading={isSubmitting} />
          <GoogleButton />
          <AuthLinkRow prefix="Не маєте акаунту?" linkText="Зареєструватися" onClick={() => auth.goTo("register")} />
        </>
      }
    >
      <FlatTextField
        placeholder="Пошта"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <FlatTextField
        placeholder="Пароль"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <AuthCheckbox label="Зберегти данні" checked={remember} onClick={() => setRemember((v) => !v)} />
        <Box
          component="button"
          type="button"
          onClick={() => auth.goTo("forgotEmail")}
          sx={{
            background: "none",
            border: "none",
            p: 0,
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 13,
            color: colors.additionalTextColor,
          }}
        >
          Забули пароль?
        </Box>
      </Box>
      <TurnstileWidget onVerify={setCaptchaToken} onExpire={() => setCaptchaToken("")} />
    </AuthDrawerLayout>
  );
}
