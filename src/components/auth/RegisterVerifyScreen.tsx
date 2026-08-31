import { useState } from "react";
import Box from "@mui/material/Box";
import FlatTextField from "../common/FlatTextField";
import AuthDrawerLayout from "./AuthDrawerLayout";
import AuthSubmitButton from "./AuthSubmitButton";
import { useAuth } from "../../auth/AuthContext";
import { authUserApi } from "../../api/services";
import { nameFromToken } from "../../auth/userDisplay";
import { colors } from "../../theme/theme";

// Step 2 of registration — entered right after RegisterScreen submits and
// the backend emails a 6-digit code (see AuthController.register /
// verifyRegistrationEmail). Mirrors ForgotCodeScreen's layout/behavior;
// success here returns a real token, so it's this screen (not
// RegisterScreen) that actually logs the user in.
export default function RegisterVerifyScreen() {
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
      const token = await authUserApi.verifyRegistrationEmail({
        email: auth.registerEmail,
        code: code.trim(),
      });
      // Email isn't carried into userDisplay — it was only ever the
      // verification channel, not something shown again (see
      // RegisterScreen's doc comment). Phone is the account's real display
      // identity now, so that's what needs to survive across this step.
      auth.onAuthSuccess(
        token,
        { name: nameFromToken(token), phone: auth.registerPhone || undefined },
        true,
      );
    } catch {
      setError("Невірний або застарілий код підтвердження.");
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
      await authUserApi.resendVerificationEmail({ email: auth.registerEmail });
      setResent(true);
    } catch {
      setError("Не вдалося надіслати код повторно.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthDrawerLayout
      title="ПІДТВЕРДЖЕННЯ EMAIL"
      variant="close"
      onHeaderAction={auth.close}
      error={error}
      footer={
        <AuthSubmitButton
          text="ПІДТВЕРДИТИ"
          onClick={handleSubmit}
          disabled={!valid}
          loading={isSubmitting}
        />
      }
    >
      <Box
        sx={{
          fontSize: 13,
          color: colors.additionalTextColor,
          lineHeight: 1.5,
        }}
      >
        Введіть код підтвердження, надісланий на{" "}
        {auth.registerEmail || "вашу пошту"}.
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
        {resent
          ? "Код надіслано повторно"
          : "Не отримали код? Надіслати ще раз"}
      </Box>
    </AuthDrawerLayout>
  );
}
