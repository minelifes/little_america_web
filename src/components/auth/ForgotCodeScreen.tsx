import { useState } from "react";
import Box from "@mui/material/Box";
import FlatTextField from "../common/FlatTextField";
import AuthDrawerLayout from "./AuthDrawerLayout";
import AuthSubmitButton from "./AuthSubmitButton";
import AuthLoginOrRegisterLinks from "./AuthLoginOrRegisterLinks";
import { useAuth } from "../../auth/AuthContext";
import { authUserApi } from "../../api/services";
import { colors } from "../../theme/theme";

// Step 2 of 3 — NOT in any reference screenshot. The user explicitly asked
// for a code-verification step to be inserted here, between "enter email"
// and "set new password" (which the screenshots show as adjacent), using
// POST /api/v2/client-auth/verify-reset-code { email, code } -> { valid, hash }.
// Designed fresh to match the surrounding screens' visual style.
export default function ForgotCodeScreen() {
  const auth = useAuth();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  const valid = code.trim().length > 0;

  const handleSubmit = async () => {
    if (!valid || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await authUserApi.verifyEmailCode({ email: auth.resetEmail, code: code.trim() });
      if (!result.valid) {
        setError("Невірний код підтвердження.");
        return;
      }
      auth.setResetHash(result.hash);
      auth.goTo("forgotNewPassword");
    } catch {
      setError("Не вдалося перевірити код. Спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (isResending) return;
    setIsResending(true);
    setError(null);
    setResent(false);
    try {
      await authUserApi.forgotPassword({ email: auth.resetEmail });
      setResent(true);
    } catch {
      setError("Не вдалося надіслати код повторно.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthDrawerLayout
      title="ВІДНОВЛЕННЯ ПАРОЛЯ"
      variant="back"
      onHeaderAction={() => auth.goTo("forgotEmail")}
      error={error}
      footer={
        <>
          <AuthSubmitButton text="ПІДТВЕРДИТИ" onClick={handleSubmit} disabled={!valid} loading={isSubmitting} />
          <AuthLoginOrRegisterLinks />
        </>
      }
    >
      <Box sx={{ fontSize: 13, color: colors.additionalTextColor, lineHeight: 1.5 }}>
        Введіть код підтвердження, надісланий на {auth.resetEmail || "вашу пошту"}.
      </Box>
      <FlatTextField
        placeholder="Код підтвердження"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Box
        component="button"
        type="button"
        onClick={handleResend}
        disabled={isResending}
        sx={{
          alignSelf: "flex-start",
          background: "none",
          border: "none",
          p: 0,
          cursor: isResending ? "default" : "pointer",
          fontFamily: "inherit",
          fontSize: 13,
          color: colors.additionalTextColor,
          textDecoration: "underline",
        }}
      >
        {resent ? "Код надіслано повторно" : "Не отримали код? Надіслати ще раз"}
      </Box>
    </AuthDrawerLayout>
  );
}
