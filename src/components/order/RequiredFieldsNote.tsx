import Box from "@mui/material/Box";

// Legend explaining the red-asterisk convention used on required fields
// across the checkout wizard — new UI, not from Dart (see FlatTextField).
export default function RequiredFieldsNote() {
  return (
    <Box sx={{ fontSize: 12, color: "rgba(0,0,0,0.45)", whiteSpace: "nowrap" }}>
      <Box component="span" sx={{ color: "#e53935" }}>
        *
      </Box>{" "}
      — обов'язкові поля
    </Box>
  );
}
