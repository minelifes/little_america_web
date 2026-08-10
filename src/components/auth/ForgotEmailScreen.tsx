import { useState } from "react";
import Box from "@mui/material/Box";
import FlatTextField from "../common/FlatTextField";
import AuthDrawerLayout from "./AuthDrawerLayout";
import AuthSubmitButton from "./AuthSubmitButton";
import AuthLoginOrRegisterLinks from "./AuthLoginOrRegisterLinks";
import { useAuth } from "../../auth/AuthContext";
import { authUserApi } from "../../api/services";
import { isEmailValid } from "../../auth/validation";
import { colors } from "../../theme/theme";

// Step 1 of 3 in the reset-password flow — matches the reference screenshot
// exactly. On success, moves to ForgotCodeScreen (a step the user asked to
// be inserted here, with no screenshot of its own — see that file).
export default function ForgotEmailScreen() {
  const auth = useAuth();
  const [email, setEmail] = useState(auth.resetEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = isEmailValid(email);

  const handleSubmit = async () => {
    if (!valid || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await authUserApi.forgotPassword({ email: email.trim() });
      auth.setResetEmail(email.trim());
      auth.goTo("forgotCode");
    } catch {
      setError("Не вдалося надіслати лист. Перевірте пошту та спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthDrawerLayout
      title="ВІДНОВЛЕННЯ ПАРОЛЯ"
      variant="back"
      onHeaderAction={() => auth.goTo("login")}
      error={error}
      footer={
        <>
          <AuthSubmitButton text="ВІДПРАВИТИ" onClick={handleSubmit} disabled={!valid} loading={isSubmitting} />
          <AuthLoginOrRegisterLinks />
        </>
      }
    >
      <Box sx={{ fontSize: 13, color: colors.additionalTextColor, lineHeight: 1.5 }}>
        Залишите вашу поштову адресу, вам прийде повідомлення, дотримуйтесь подальших дій вказаних у ньому.
      </Box>
      <FlatTextField placeholder="Пошта" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
    </AuthDrawerLayout>
  );
}
