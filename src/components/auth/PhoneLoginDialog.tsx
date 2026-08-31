import { useState } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import FlatTextField from "../common/FlatTextField";
import AuthSubmitButton from "./AuthSubmitButton";
import AuthCheckbox from "./AuthCheckbox";
import TurnstileWidget from "./TurnstileWidget";
import CloseIcon from "../common/CloseIcon";
import AuthLinkRow from "./AuthLinkRow";
import { useAuth } from "../../auth/AuthContext";
import { authUserApi } from "../../api/services";
import { isPasswordValid } from "../../auth/validation";
import { nameFromToken } from "../../auth/userDisplay";
import { formatPhoneDisplay, parsePhoneDigits, toE164 } from "../../order/phone";
import { colors } from "../../theme/theme";
import { iconHoverSx } from "../../theme/interactions";
import Typography from "@mui/material/Typography";

type Step = "phone" | "password" | "setPassword" | "notFound";

// Replaces PhoneLoginScreen's old first step (a lone phone field inside the
// side drawer, which read oddly on its own — see AuthDrawer's doc comment).
// This is a centered, rounded modal instead, matching the reference
// screenshot's "enter phone + accept agreements + Next" pattern but in the
// site's own flat/rounded style rather than the screenshot's purple theme.
//
// One field (phone) drives everything: checkPhone resolves it into exactly
// one of three states, and the button/fields morph in place rather than
// navigating to a new screen — password appears inline for a known number,
// or the button itself turns into "Зареєструватися" for an unknown one.
// Editing the phone again after a check always snaps back to the initial
// "next" state (see handlePhoneChange), since the previous check no longer
// applies to the new number.
//
// No Privacy Policy / Terms of Use pages exist anywhere in this app yet, so
// the two agreement checkboxes are plain consent text for now rather than
// links — wire them up if/when those pages get built.
//
// Actual account creation still happens on the full RegisterScreen (name/
// lastname/email are required by the backend and don't fit this compact
// dialog) — "Зареєструватися" here just hands the already-typed phone off
// to it via registerPhone (see AuthContext) and switches AuthDrawer over to
// its Drawer-based screens.
export default function PhoneLoginDialog() {
  const auth = useAuth();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedPrivacy, setAgreedPrivacy] = useState(true);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [captchaToken, setCaptchaToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const phoneValid = phone.length === 9;
  const agreed = agreedPrivacy && agreedTerms;

  const handlePhoneChange = (value: string) => {
    setPhone(parsePhoneDigits(value));
    if (step !== "phone") {
      setStep("phone");
      setPassword("");
      setConfirmPassword("");
      setError(null);
    }
  };

  const handleCheckPhone = async () => {
    if (!phoneValid || !agreed || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      // Sent with country code (see order/phone.ts's toE164 doc comment) —
      // `phone` itself stays the bare 9-digit form for local display/state.
      const status = await authUserApi.checkPhone({ phone: toE164(phone) });
      if (!status.exists) {
        setStep("notFound");
      } else if (status.hasPassword) {
        setStep("password");
      } else {
        setStep("setPassword");
      }
    } catch {
      setError("Не вдалося перевірити номер. Спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async () => {
    if (password.length === 0 || !agreed || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const token = await authUserApi.loginByPhone({
        phone: toE164(phone),
        password,
        captchaToken,
      });
      auth.onAuthSuccess(token, { name: nameFromToken(token), phone });
    } catch {
      setError("Невірний номер телефону або пароль.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetPassword = async () => {
    if (
      !isPasswordValid(password) ||
      confirmPassword !== password ||
      !agreed ||
      isSubmitting
    )
      return;
    setIsSubmitting(true);
    setError(null);
    try {
      const token = await authUserApi.setPasswordByPhone({
        phone: toE164(phone),
        password,
        captchaToken,
      });
      auth.onAuthSuccess(token, { name: nameFromToken(token), phone });
    } catch {
      setError("Не вдалося встановити пароль. Спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoRegister = () => {
    auth.setRegisterPhone(phone);
    auth.goTo("register");
  };

  const handleSubmit = () => {
    if (step === "phone") return handleCheckPhone();
    if (step === "password") return handleLogin();
    if (step === "setPassword") return handleSetPassword();
    return handleGoRegister();
  };

  const submitDisabled =
    !agreed ||
    (step === "phone" && !phoneValid) ||
    (step === "password" && password.length === 0) ||
    (step === "setPassword" &&
      (!isPasswordValid(password) || confirmPassword !== password));

  const submitText =
    step === "password"
      ? "УВІЙТИ"
      : step === "setPassword"
        ? "ЗБЕРЕГТИ ТА УВІЙТИ"
        : step === "notFound"
          ? "ЗАРЕЄСТРУВАТИСЯ"
          : "ПРОДОВЖИТИ";

  return (
    <Dialog
      open={auth.isOpen}
      onClose={auth.close}
      slotProps={{
        paper: {
          sx: {
            width: "100%",
            maxWidth: 400,
            borderRadius: "24px",
            backgroundColor: "#ffffff",
            m: 2,
          },
        },
      }}
    >
      <Box sx={{ position: "relative", p: 4 }}>
        <Box
          component="button"
          type="button"
          onClick={auth.close}
          aria-label="close"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            width: 36,
            height: 36,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...iconHoverSx,
          }}
        >
          <CloseIcon size={18} />
        </Box>

        <Box
          sx={{
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: "0.5px",
            textAlign: "center",
            mb: 1,
          }}
        >
          ВХІД
        </Box>
        <Box
          sx={{
            fontSize: 13,
            color: colors.additionalTextColor,
            textAlign: "center",
            lineHeight: 1.5,
            mb: 3,
          }}
        >
          Введіть номер телефону, щоб увійти або зареєструватися
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FlatTextField
            placeholder="Номер мобільного"
            type="tel"
            value={formatPhoneDisplay(phone)}
            startAdornment = { <Typography sx={{ mr: 1, color: 'text.secondary' }}>
              +38
            </Typography>}
            onChange={(e) => handlePhoneChange(e.target.value)}
          />

          {step === "notFound" && (
            <Box sx={{ fontSize: 13, color: colors.additionalTextColor, lineHeight: 1.5 }}>
              Клієнта з номером {formatPhoneDisplay(phone)} не знайдено.
              Зареєструйтесь, щоб продовжити.
            </Box>
          )}

          {step === "password" && (
            <>
              <FlatTextField
                placeholder="Пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -1 }}>
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
            </>
          )}

          {step === "setPassword" && (
            <>
              <Box sx={{ fontSize: 13, color: colors.additionalTextColor, lineHeight: 1.5 }}>
                Для номера {formatPhoneDisplay(phone)} ще не встановлено
                пароль. Придумайте його, щоб увійти.
              </Box>
              <FlatTextField
                placeholder="Пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <FlatTextField
                placeholder="Повторіть пароль"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px", mt: 1 }}>
            <AuthCheckbox
              label="Я погоджуюсь з Політикою конфіденційності"
              checked={agreedPrivacy}
              onClick={() => setAgreedPrivacy((v) => !v)}
            />
            <AuthCheckbox
              label="Я погоджуюсь з Умовами використання"
              checked={agreedTerms}
              onClick={() => setAgreedTerms((v) => !v)}
            />
          </Box>

          {error && (
            <Box sx={{ color: "#e53935", fontSize: 13 }} role="alert">
              {error}
            </Box>
          )}

          {/* checkPhone itself failed (network/server error, not a "not
              found" result) — without this, a failed check leaves the user
              stuck with no way to reach registration at all. */}
          {step === "phone" && error && (
            <AuthLinkRow
              prefix="Або"
              linkText="зареєструватися"
              onClick={handleGoRegister}
            />
          )}

          <TurnstileWidget
            onVerify={setCaptchaToken}
            onExpire={() => setCaptchaToken("")}
          />

          <AuthSubmitButton
            text={submitText}
            onClick={handleSubmit}
            disabled={submitDisabled}
            loading={isSubmitting}
          />
        </Box>
      </Box>
    </Dialog>
  );
}
