import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { colors } from "../../theme/theme";
import type { BrandModel } from "../../api/types";

interface BrandSelectProps {
  brands: BrandModel[];
  value: string | null;
  onChange: (id: string | null) => void;
}

// Backed by the confirmed GET /api/v2/brands/ endpoint — brands.id is a
// UUID string (BrandEntity), not a number. Degrades gracefully to a
// disabled placeholder if useBrands() returns nothing.
export default function BrandSelect({ brands, value, onChange }: BrandSelectProps) {
  const handleChange = (e: SelectChangeEvent<string>) => {
    const v = e.target.value;
    onChange(v === "" ? null : v);
  };

  return (
    <Select
      value={value ?? ""}
      onChange={handleChange}
      displayEmpty
      disabled={brands.length === 0}
      size="small"
      sx={{
        minWidth: 220,
        fontSize: 14,
        color: colors.mainTextColor,
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(0,0,0,0.15)" },
      }}
    >
      <MenuItem value="">
        <em style={{ fontStyle: "normal", color: colors.additionalTextColor }}>Оберіть бренд</em>
      </MenuItem>
      {brands.map((b) => (
        <MenuItem key={b.id} value={b.id}>
          {b.name}
        </MenuItem>
      ))}
    </Select>
  );
}
