import { useState } from "react";
import FlatTextField from "../common/FlatTextField";
import AuthDrawerLayout from "./AuthDrawerLayout";
import AuthSubmitButton from "./AuthSubmitButton";
import AuthLoginOrRegisterLinks from "./AuthLoginOrRegisterLinks";
import { useAuth } from "../../auth/AuthContext";
import { authUserApi } from "../../api/services";
import { isPasswordValid } from "../../auth/validation";

// Step 3 of 3 — matches the reference screenshot. Only reachable after
// ForgotCodeScreen sets a verified `hash` (see AuthContext.resetHash);
// POSTs { hash, password } to /api/v2/client-auth/reset-password.
export default function ForgotNewPasswordScreen() {
  const auth = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = isPasswordValid(password) && confirmPassword === password;

  const handleSubmit = async () => {
    if (!valid || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await authUserApi.resetPassword({ hash: auth.resetHash, password });
      auth.setResetEmail("");
      auth.setResetHash("");
      auth.goTo("loginPhone");
    } catch {
      setError("Не вдалося зберегти новий пароль. Спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthDrawerLayout
      title="ВІДНОВЛЕННЯ ПАРОЛЯ"
      variant="back"
      onHeaderAction={() => auth.goTo("forgotCode")}
      error={error}
      footer={
        <>
          <AuthSubmitButton
            text="ЗБЕРЕГТИ"
            onClick={handleSubmit}
            disabled={!valid}
            loading={isSubmitting}
          />
          <AuthLoginOrRegisterLinks />
        </>
      }
    >
      <FlatTextField
        placeholder="Новий пароль"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <FlatTextField
        placeholder="Повторіть пароль"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
    </AuthDrawerLayout>
  );
}
