import { useState } from "react";
import Box from "@mui/material/Box";
import FlatTextField from "../common/FlatTextField";
import AuthDrawerLayout from "./AuthDrawerLayout";
import AuthSubmitButton from "./AuthSubmitButton";
import AuthLinkRow from "./AuthLinkRow";
import TurnstileWidget from "./TurnstileWidget";
import { useAuth } from "../../auth/AuthContext";
import { authUserApi } from "../../api/services";
import { isEmailValid, isPasswordValid } from "../../auth/validation";
import { formatPhoneDisplay, parsePhoneDigits, toE164 } from "../../order/phone";
import { colors } from "../../theme/theme";

// NOT ported from Dart — no register screen/endpoint exists in the Flutter
// source. Built from the reference screenshot; POSTs to
// /api/v2/client-auth/register (tenant-scoped client registration — see
// ClientAuthController.kt). All six fields below are required by the backend
// (see api/types.ts RegisterRequest comment) — lastname/по-батькові/phone
// were added alongside name/email/password since the backend rejects a
// request missing any of them.
//
// Phone is the account's real identity now (see PhoneLoginDialog — it's the
// only login method). Email is still collected here and still required by
// the backend, but purely as a one-time verification channel (there's no
// SMS/OTP provider — see ClientAuthController's doc comments — so email is
// the only way to prove this registration isn't a bot/spam submission).
// It's never shown again anywhere after this (see AccountScreen/SettingsForm,
// which display phone instead) — the caption under the field says as much.
//
// Registration is now a two-step flow: this screen only creates the
// (unverified) account and triggers an emailed code, then hands off to
// RegisterVerifyScreen — see AuthController.register's doc comment on the
// backend for why (email verification + welcome email).
export default function RegisterScreen() {
  const auth = useAuth();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  // Pre-filled when handed off from PhoneLoginDialog's "not found" state, so
  // the user doesn't have to retype the number they already entered there.
  const [phone, setPhone] = useState(() => auth.registerPhone || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid =
    name.trim().length > 1 &&
    lastName.trim().length > 1 &&
    middleName.trim().length > 1 &&
    phone.length === 9 &&
    isEmailValid(email) &&
    isPasswordValid(password) &&
    confirmPassword === password;

  const handleSubmit = async () => {
    if (!valid || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await authUserApi.register({
        name: name.trim(),
        lastName: lastName.trim(),
        middleName: middleName.trim(),
        // Sent with country code — this is what actually gets stored as
        // ClientEntity.phone (see order/phone.ts's toE164 doc comment).
        // `phone` state itself stays bare 9-digit for the field/display.
        phone: toE164(phone),
        email: email.trim(),
        password,
        captchaToken,
      });
      auth.setRegisterEmail(result.email);
      auth.setRegisterPhone(phone);
      auth.goTo("registerVerify");
    } catch {
      setError("Не вдалося зареєструватися. Спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthDrawerLayout
      title="РЕЄСТРАЦІЯ"
      variant="close"
      onHeaderAction={auth.close}
      error={error}
      footer={
        <>
          <AuthSubmitButton
            text="ЗАРЕЄСТРУВАТИСЬ"
            onClick={handleSubmit}
            disabled={!valid}
            loading={isSubmitting}
          />
          <AuthLinkRow
            prefix="Вже маєте аккаунт?"
            linkText="Увійти"
            onClick={() => auth.goTo("loginPhone")}
          />
        </>
      }
    >
      <FlatTextField
        placeholder="Ім'я"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <FlatTextField
        placeholder="Прізвище"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <FlatTextField
        placeholder="По батькові"
        value={middleName}
        onChange={(e) => setMiddleName(e.target.value)}
      />
      <FlatTextField
        placeholder="Номер мобільного"
        type="tel"
        value={formatPhoneDisplay(phone)}
        onChange={(e) => setPhone(parsePhoneDigits(e.target.value))}
      />
      <FlatTextField
        placeholder="Пошта"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Box sx={{ mt: -1, fontSize: 12, color: colors.additionalTextColor }}>
        Використовується лише для підтвердження акаунту — вхід буде за номером
        телефону.
      </Box>
      <FlatTextField
        placeholder="Пароль"
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
      <TurnstileWidget
        onVerify={setCaptchaToken}
        onExpire={() => setCaptchaToken("")}
      />
    </AuthDrawerLayout>
  );
}
