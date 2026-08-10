import { useState } from "react";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FlatTextField from "../common/FlatTextField";
import RequiredFieldsNote from "./RequiredFieldsNote";
import ToProductButton from "../common/ToProductButton";
import { formatPhoneDisplay, parsePhoneDigits } from "../../order/phone";

export interface PersonalData {
  name: string;
  lastname: string;
  /** Raw 9-digit national number, no leading 0/country code/spaces — see order/phone.ts. Matches Dart's 9-digit phone field. */
  phone: string;
  email: string;
  promoCode: string;
}

export const emptyPersonalData: PersonalData = { name: "", lastname: "", phone: "", email: "", promoCode: "" };

// Ported from OrderUserData.isAllDataPassed() in order_user_data.dart.
export function isPersonalDataValid(data: PersonalData): boolean {
  const isNameValid = data.name.trim().length > 2;
  const isSurnameValid = data.lastname.trim().length > 2;
  const isPhoneValid = data.phone.length === 9;
  const isEmailValid = data.email.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim());
  return isNameValid && isSurnameValid && isPhoneValid && isEmailValid;
}

interface OrderUserDataStepProps {
  value: PersonalData;
  onChange: (value: PersonalData) => void;
  onNext: () => void;
}

// Ported from lib/resources/pages/order_page/widgets/order_user_data.dart —
// fields/validation rules match exactly (name/lastname length>2, phone===9
// digits, email valid-or-empty). The promo code field is new UI — Dart's own
// apply button is a commented-out no-op (`// widget.onPromoApplyPressed(); //TODO`)
// and there's no promo-validation endpoint anywhere in the source, so this
// field is purely local/inert: typing it doesn't affect the order total or
// get sent with the order.
export default function OrderUserDataStep({ value, onChange, onNext }: OrderUserDataStepProps) {
  const [promoOpen, setPromoOpen] = useState(false);
  const set = (patch: Partial<PersonalData>) => onChange({ ...value, ...patch });
  const valid = isPersonalDataValid(value);

  return (
    <Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Box sx={{ fontSize: 15, fontWeight: 700 }}>Особисті дані</Box>
        <RequiredFieldsNote />
      </Box>
      <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ flex: "1 1 220px" }}>
          <FlatTextField
            placeholder="Ім'я"
            required
            value={value.name}
            onChange={(e) => set({ name: e.target.value })}
          />
        </Box>
        <Box sx={{ flex: "1 1 220px" }}>
          <FlatTextField
            placeholder="Прізвище"
            required
            value={value.lastname}
            onChange={(e) => set({ lastname: e.target.value })}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 4, fontSize: 15, fontWeight: 700 }}>Контактні дані</Box>
      <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ flex: "1 1 220px" }}>
          <FlatTextField
            placeholder="Номер мобільного"
            type="tel"
            required
            value={formatPhoneDisplay(value.phone)}
            onChange={(e) => set({ phone: parsePhoneDigits(e.target.value) })}
          />
        </Box>
        <Box sx={{ flex: "1 1 220px" }}>
          <FlatTextField
            placeholder="Email"
            type="email"
            value={value.email}
            onChange={(e) => set({ email: e.target.value })}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Box
          component="button"
          onClick={() => setPromoOpen((v) => !v)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            background: "none",
            border: "none",
            cursor: "pointer",
            p: 0,
            fontFamily: "inherit",
            fontSize: 15,
            fontWeight: 700,
            color: "#161616",
          }}
        >
          Маєте промокод?
          <ExpandMoreIcon
            sx={{ fontSize: 20, transform: promoOpen ? "rotate(180deg)" : "none", transition: "transform 150ms" }}
          />
        </Box>

        {promoOpen && (
          <Box sx={{ mt: 2, maxWidth: 320 }}>
            <FlatTextField
              placeholder="Промокод"
              value={value.promoCode}
              onChange={(e) => set({ promoCode: e.target.value })}
            />
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 5 }}>
        <ToProductButton text="ДАЛІ" width={200} onClick={onNext} disabled={!valid} />
      </Box>
    </Box>
  );
}
