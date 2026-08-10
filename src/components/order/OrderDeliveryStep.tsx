import { useState } from "react";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import type { SelectChangeEvent } from "@mui/material/Select";
import FlatTextField from "../common/FlatTextField";
import RequiredFieldsNote from "./RequiredFieldsNote";
import ToProductButton from "../common/ToProductButton";
import { useCitySearch, useWarehouses } from "../../api/hooks";
import { DELIVERY_METHODS, NOVA_POST_ID, SELF_PICKUP_ID, UKR_POST_ID } from "../../order/deliveryMethods";
import { estimateDeliveryFee } from "../../order/deliveryFee";
import { colors } from "../../theme/theme";
import type { NPCityInfo, NPWarehouse } from "../../api/types";

export type PaymentMethod = "cod" | "card";

export interface DeliveryData {
  methodId: number | null;
  npCity: NPCityInfo | null;
  npWarehouse: NPWarehouse | null;
  ukrpostIndex: string;
  ukrpostArea: string;
  ukrpostDistrict: string;
  ukrpostCity: string;
  // NOT ported from Dart — no payment-method field exists in ClientModel/
  // OrderModel at all (grepped the whole source, confirmed). This is
  // local-only UI state and is NOT sent with the order request.
  paymentMethod: PaymentMethod;
}

export const emptyDeliveryData: DeliveryData = {
  methodId: null,
  npCity: null,
  npWarehouse: null,
  ukrpostIndex: "",
  ukrpostArea: "",
  ukrpostDistrict: "",
  ukrpostCity: "",
  paymentMethod: "cod",
};

// Ported from OrderAddress.isAllDataPassed() in order_address.dart.
export function isDeliveryDataValid(data: DeliveryData): boolean {
  if (data.methodId === SELF_PICKUP_ID) return true;
  if (data.methodId === NOVA_POST_ID) return data.npCity !== null && data.npWarehouse !== null;
  if (data.methodId === UKR_POST_ID) {
    return data.ukrpostIndex.trim().length > 0 && data.ukrpostArea.trim().length > 2 && data.ukrpostCity.trim().length > 2;
  }
  return false;
}

interface OrderDeliveryStepProps {
  value: DeliveryData;
  onChange: (value: DeliveryData) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

// Ported from lib/resources/pages/order_page/widgets/order_address.dart +
// np_delivery_select.dart / np_delivery_city_select.dart / np_delivery_warehouse_select.dart
// / ukrpost_fields.dart. The "Спосіб оплати" section has no Dart source
// equivalent at all (see DeliveryData.paymentMethod above) — designed fresh
// to match the target screenshots.
export default function OrderDeliveryStep({ value, onChange, onBack, onSubmit, isSubmitting }: OrderDeliveryStepProps) {
  const set = (patch: Partial<DeliveryData>) => onChange({ ...value, ...patch });
  const valid = isDeliveryDataValid(value);

  const handleMethodChange = (e: SelectChangeEvent<string>) => {
    set({ ...emptyDeliveryData, methodId: Number(e.target.value), paymentMethod: value.paymentMethod });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Box sx={{ fontSize: 15, fontWeight: 700 }}>Доставка</Box>
        <RequiredFieldsNote />
      </Box>

      <Box sx={{ mt: 2, maxWidth: 420 }}>
        <Select
          value={value.methodId === null ? "" : String(value.methodId)}
          onChange={handleMethodChange}
          displayEmpty
          fullWidth
          sx={{
            height: 52,
            borderRadius: "10px",
            backgroundColor: "rgba(0,0,0,0.03)",
            fontSize: 14,
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
          }}
        >
          <MenuItem value="" disabled>
            Оберіть спосіб доставки
          </MenuItem>
          {DELIVERY_METHODS.map((m) => (
            <MenuItem key={m.id} value={String(m.id)}>
              {m.name}
              {m.id === NOVA_POST_ID && ` (від ${estimateDeliveryFee(NOVA_POST_ID)} ₴)`}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {value.methodId === NOVA_POST_ID && (
        <NovaPostFields
          city={value.npCity}
          warehouse={value.npWarehouse}
          onCityChange={(city) => set({ npCity: city, npWarehouse: null })}
          onWarehouseChange={(warehouse) => set({ npWarehouse: warehouse })}
        />
      )}

      {value.methodId === UKR_POST_ID && (
        <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 2, maxWidth: 640 }}>
          <Box sx={{ flex: "1 1 140px" }}>
            <FlatTextField
              placeholder="Індекс"
              required
              value={value.ukrpostIndex}
              onChange={(e) => set({ ukrpostIndex: e.target.value.replace(/\D/g, "") })}
            />
          </Box>
          <Box sx={{ flex: "1 1 200px" }}>
            <FlatTextField
              placeholder="Область"
              required
              value={value.ukrpostArea}
              onChange={(e) => set({ ukrpostArea: e.target.value })}
            />
          </Box>
          <Box sx={{ flex: "1 1 200px" }}>
            <FlatTextField
              placeholder="Район"
              value={value.ukrpostDistrict}
              onChange={(e) => set({ ukrpostDistrict: e.target.value })}
            />
          </Box>
          <Box sx={{ flex: "1 1 200px" }}>
            <FlatTextField
              placeholder="Місто/СМТ/Село"
              required
              value={value.ukrpostCity}
              onChange={(e) => set({ ukrpostCity: e.target.value })}
            />
          </Box>
        </Box>
      )}

      <Box sx={{ mt: 5, fontSize: 15, fontWeight: 700 }}>Спосіб оплати</Box>
      <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: "10px" }}>
        <PaymentOption
          label="При отриманні"
          checked={value.paymentMethod === "cod"}
          onClick={() => set({ paymentMethod: "cod" })}
        />
        <PaymentOption
          label="Онлайн картою"
          checked={value.paymentMethod === "card"}
          onClick={() => set({ paymentMethod: "card" })}
        />
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2, mt: 5 }}>
        <Box
          component="button"
          onClick={onBack}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 700,
            color: colors.mainTextColor,
          }}
        >
          <ChevronLeftIcon sx={{ fontSize: 18 }} />
          ПОВЕРНУТИСЬ
        </Box>

        {isSubmitting ? (
          <CircularProgress size={28} sx={{ color: colors.mainTextColor }} />
        ) : (
          <ToProductButton text="ОФОРМИТИ ЗАМОВЛЕННЯ" width={260} onClick={onSubmit} disabled={!valid} />
        )}
      </Box>
    </Box>
  );
}

function PaymentOption({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "none",
        border: "none",
        cursor: "pointer",
        p: 0,
        fontFamily: "inherit",
        width: "fit-content",
      }}
    >
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: "4px",
          border: `1.5px solid ${checked ? colors.mainColor : "rgba(0,0,0,0.3)"}`,
          backgroundColor: checked ? colors.mainColor : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {checked && <CheckIcon sx={{ fontSize: 14, color: "#ffffff" }} />}
      </Box>
      <Box component="span" sx={{ fontSize: 14 }}>
        {label}
      </Box>
    </Box>
  );
}

function NovaPostFields({
  city,
  warehouse,
  onCityChange,
  onWarehouseChange,
}: {
  city: NPCityInfo | null;
  warehouse: NPWarehouse | null;
  onCityChange: (city: NPCityInfo | null) => void;
  onWarehouseChange: (warehouse: NPWarehouse | null) => void;
}) {
  return (
    <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 2, maxWidth: 640 }}>
      <Box sx={{ flex: "1 1 260px" }}>
        <CitySelect value={city} onChange={onCityChange} />
      </Box>
      {city && (
        <Box sx={{ flex: "1 1 260px" }}>
          <WarehouseSelect cityRef={city.npDeliveryCity} value={warehouse} onChange={onWarehouseChange} />
        </Box>
      )}
    </Box>
  );
}

// Ported from np_delivery_city_select.dart — live search, min 3 characters.
function CitySelect({ value, onChange }: { value: NPCityInfo | null; onChange: (city: NPCityInfo | null) => void }) {
  const [inputValue, setInputValue] = useState("");
  const { data, isFetching } = useCitySearch(inputValue);

  return (
    <Autocomplete
      options={data ?? []}
      value={value}
      onChange={(_, v) => onChange(v)}
      inputValue={inputValue}
      onInputChange={(_, v) => setInputValue(v)}
      getOptionLabel={(c) => c.title}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      loading={isFetching}
      noOptionsText={
        inputValue.trim().length < 3
          ? "Місто (введіть декілька літер для пошуку)"
          : "Нічого не знайдено, спробуйте щось ввести, або змінити запит."
      }
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <Box>
            <Box sx={{ fontSize: 14 }}>{option.title}</Box>
            <Box sx={{ fontSize: 12, color: colors.additionalTextColor2 }}>{option.area}</Box>
          </Box>
        </li>
      )}
      renderInput={(params) => (
        <Box ref={params.slotProps.input.ref} sx={{ position: "relative" }}>
          <FlatTextField
            placeholder="Оберіть місто"
            required
            inputProps={params.slotProps.htmlInput}
            endAdornment={isFetching ? <CircularProgress size={16} /> : undefined}
          />
        </Box>
      )}
    />
  );
}

// Ported from np_delivery_warehouse_select.dart — full list loads per city,
// then filtered client-side as the user types (not a live search).
function WarehouseSelect({
  cityRef,
  value,
  onChange,
}: {
  cityRef: string;
  value: NPWarehouse | null;
  onChange: (warehouse: NPWarehouse | null) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const { data, isFetching } = useWarehouses(cityRef);

  const warehouseSubtitle = (w: NPWarehouse) =>
    w.typeOfWarehouse === "f9316480-5f2d-425d-bc2c-ac7cd29decf0" ? "Поштомат" : "Відділення";

  return (
    <Autocomplete
      options={data ?? []}
      value={value}
      onChange={(_, v) => onChange(v)}
      inputValue={inputValue}
      onInputChange={(_, v) => setInputValue(v)}
      getOptionLabel={(w) => w.title}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      loading={isFetching}
      noOptionsText="Нічого не знайдено, спробуйте щось ввести, або змінити запит."
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <Box>
            <Box sx={{ fontSize: 14 }}>{option.title}</Box>
            <Box sx={{ fontSize: 12, color: colors.additionalTextColor2 }}>{warehouseSubtitle(option)}</Box>
          </Box>
        </li>
      )}
      renderInput={(params) => (
        <Box ref={params.slotProps.input.ref} sx={{ position: "relative" }}>
          <FlatTextField
            placeholder="Оберіть Склад/поштомат"
            required
            inputProps={params.slotProps.htmlInput}
            endAdornment={isFetching ? <CircularProgress size={16} /> : undefined}
          />
        </Box>
      )}
    />
  );
}
