import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import type { InputBaseProps } from "@mui/material/InputBase";

// Shared flat/grey rounded input — originally built for the checkout
// wizard's forms (personal/contact data, promo code, Ukrposhta address
// fields), now reused by the auth drawer (login/register/reset-password)
// since both match the same flat, borderless, rounded-grey-background style
// in their reference screenshots. Not a Dart port.
//
// `required` shows a small red asterisk at the end of the field (and sets
// the native `required` attribute) — new UI, not from Dart, added so
// mandatory fields are visually obvious alongside a "* — обов'язкові поля"
// legend where one is shown.
export default function FlatTextField({ required, endAdornment, ...props }: InputBaseProps) {
  return (
    <InputBase
      {...props}
      required={required}
      endAdornment={
        endAdornment ??
        (required ? (
          <Box component="span" sx={{ color: "#e53935", fontSize: 16, lineHeight: 1, pointerEvents: "none" }}>
            *
          </Box>
        ) : undefined)
      }
      sx={{
        width: "100%",
        height: 52,
        px: "18px",
        borderRadius: "10px",
        backgroundColor: "rgba(0,0,0,0.03)",
        fontSize: 14,
        ...props.sx,
      }}
    />
  );
}
