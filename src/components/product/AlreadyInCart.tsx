import Box from "@mui/material/Box";

// Ported from lib/resources/pages/product_page/widgets/already_in_cart.dart
export default function AlreadyInCart() {
  return (
    <Box
      sx={{
        width: 200,
        height: 42,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #4caf50",
        borderRadius: "6px",
      }}
    >
      <Box component="span" sx={{ color: "#4caf50", fontSize: 13 }}>
        УЖЕ В КОРЗИНІ
      </Box>
    </Box>
  );
}
