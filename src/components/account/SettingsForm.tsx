import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckIcon from "@mui/icons-material/Check";
import FlatTextField from "../common/FlatTextField";
import SettingsTextLink from "./SettingsTextLink";
import { useAuth } from "../../auth/AuthContext";
import { isPasswordValid } from "../../auth/validation";
import {
  useChangePassword,
  useProfile,
  useUpdateProfile,
} from "../../api/hooks";
import { colors } from "../../theme/theme";

type Mode = "view" | "edit";

const FIELD_PENCIL = (
  <EditOutlinedIcon sx={{ fontSize: 16, color: "rgba(0,0,0,0.3)" }} />
);

// NOT ported from Dart — profile-edit form matching the reference
// screenshots. Name/phone are now real (GET/PUT /api/v2/client-auth/me via
// useProfile/useUpdateProfile) and password changes are real too (POST
// /api/v2/client-auth/change-password via useChangePassword) — see api/hooks.ts.
// Email is intentionally NOT shown here at all — it's only ever collected at
// registration to deliver the one-time verification code (see
// RegisterScreen's doc comment); phone is the account's real, displayed
// identity (it's also the only login method — see PhoneLoginDialog).
export default function SettingsForm() {
  const auth = useAuth();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const [mode, setMode] = useState<Mode>("view");
  const [name, setName] = useState(auth.userDisplay?.name ?? "");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [phone, setPhone] = useState(auth.userDisplay?.phone ?? "");
  const [saveError, setSaveError] = useState<string | null>(null);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Once the real profile loads, prefer it over the locally-cached
  // userDisplay (which is only ever set at login/register time and can go
  // stale — see AuthContext comments).
  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setLastName(profile.lastname);
    setMiddleName(profile.middlename);
    setPhone(profile.phone);
  }, [profile]);

  const startEdit = () => {
    setName(profile?.name ?? auth.userDisplay?.name ?? "");
    setLastName(profile?.lastname ?? "");
    setMiddleName(profile?.middlename ?? "");
    setPhone(profile?.phone ?? auth.userDisplay?.phone ?? "");
    setSaveError(null);
    setMode("edit");
  };

  const handleSaveProfile = async () => {
    setSaveError(null);
    try {
      await updateProfile.mutateAsync({
        name: name.trim(),
        lastName: lastName.trim(),
        middleName: middleName.trim(),
        phone: phone.trim(),
      });
      auth.updateUserDisplay({
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      setMode("view");
    } catch {
      setSaveError("Не вдалося зберегти зміни. Спробуйте ще раз.");
    }
  };

  const cancelPasswordChange = () => {
    setIsChangingPassword(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError(null);
  };

  const handleSavePassword = async () => {
    if (
      oldPassword.length === 0 ||
      !isPasswordValid(newPassword) ||
      newPassword !== confirmPassword
    ) {
      setPasswordError(
        "Перевірте пароль — новий пароль має бути 6+ символів і збігатись у обох полях.",
      );
      return;
    }
    setPasswordError(null);
    try {
      await changePassword.mutateAsync({ oldPassword, newPassword });
      cancelPasswordChange();
    } catch {
      setPasswordError("Старий пароль введено невірно.");
    }
  };

  const disabled = mode === "view";

  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ fontSize: 18, fontWeight: 600, mb: 3 }}>Налаштування</Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, maxWidth: 900 }}>
        <Box sx={{ flex: "1 1 380px" }}>
          <FlatTextField
            placeholder="Ім'я"
            value={name}
            disabled={disabled}
            onChange={(e) => setName(e.target.value)}
            endAdornment={mode === "edit" ? FIELD_PENCIL : undefined}
          />
        </Box>
        <Box sx={{ flex: "1 1 380px" }}>
          <FlatTextField
            placeholder="Прізвище"
            value={lastName}
            disabled={disabled}
            onChange={(e) => setLastName(e.target.value)}
            endAdornment={mode === "edit" ? FIELD_PENCIL : undefined}
          />
        </Box>
        <Box sx={{ flex: "1 1 380px" }}>
          <FlatTextField
            placeholder="По батькові"
            value={middleName}
            disabled={disabled}
            onChange={(e) => setMiddleName(e.target.value)}
            endAdornment={mode === "edit" ? FIELD_PENCIL : undefined}
          />
        </Box>
        <Box sx={{ flex: "1 1 380px" }}>
          <FlatTextField
            placeholder="Номер мобільного"
            type="tel"
            value={phone}
            disabled={disabled}
            onChange={(e) => setPhone(e.target.value)}
            endAdornment={mode === "edit" ? FIELD_PENCIL : undefined}
          />
        </Box>
      </Box>

      {saveError && (
        <Box sx={{ color: "#e53935", fontSize: 13, mt: 2 }} role="alert">
          {saveError}
        </Box>
      )}

      <Box sx={{ mt: 5, fontSize: 18, fontWeight: 600, mb: 2 }}>Пароль</Box>
      <Box sx={{ maxWidth: 420 }}>
        {!isChangingPassword ? (
          <>
            <FlatTextField
              placeholder="Пароль"
              type="password"
              value="**********"
              disabled
            />
            {mode === "edit" && (
              <Box sx={{ mt: 2 }}>
                <SettingsTextLink
                  text="ЗМІНИТИ ПАРОЛЬ"
                  icon={<EditOutlinedIcon sx={{ fontSize: 15 }} />}
                  onClick={() => setIsChangingPassword(true)}
                />
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FlatTextField
              placeholder="Старий пароль"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <FlatTextField
              placeholder="Новий пароль"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <FlatTextField
              placeholder="Повторіть пароль"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {passwordError && (
              <Box sx={{ color: "#e53935", fontSize: 13 }} role="alert">
                {passwordError}
              </Box>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
              <SettingsTextLink
                text="СКАСУВАТИ"
                color="#e53935"
                onClick={cancelPasswordChange}
              />
              <SettingsTextLink
                text="ЗБЕРЕГТИ ПАРОЛЬ"
                icon={<EditOutlinedIcon sx={{ fontSize: 15 }} />}
                onClick={handleSavePassword}
                disabled={changePassword.isPending}
              />
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 6 }}>
        {mode === "view" ? (
          <Box
            component="button"
            type="button"
            onClick={startEdit}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              height: 48,
              px: "24px",
              border: "none",
              borderRadius: "10px",
              backgroundColor: colors.mainColor,
              color: "#ffffff",
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.5px",
              cursor: "pointer",
            }}
          >
            РЕДАГУВАТИ
            <EditOutlinedIcon sx={{ fontSize: 16 }} />
          </Box>
        ) : (
          <SettingsTextLink
            text="ЗБЕРЕГТИ"
            icon={<CheckIcon sx={{ fontSize: 16 }} />}
            onClick={handleSaveProfile}
            disabled={updateProfile.isPending}
          />
        )}
      </Box>
    </Box>
  );
}
