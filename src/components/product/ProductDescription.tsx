import { useState } from "react";
import Box from "@mui/material/Box";
import useWindowWidth from "../../hooks/useWindowWidth";
import GradientLine from "../common/GradientLine";
import NumericStepper from "../common/NumericStepper";
import ToProductButton from "../common/ToProductButton";
import PackageIcon from "../common/PackageIcon";
import AlreadyInCart from "./AlreadyInCart";
import ImageGallery from "./ImageGallery";
import { storageImageUrl } from "../../api/constants";
import { colors } from "../../theme/theme";
import { useCart } from "../../cart/CartContext";
import type { ProductModel } from "../../api/types";

// Ported from lib/resources/pages/product_page/widgets/product_description.dart
export default function ProductDescription({ product }: { product: ProductModel }) {
  const width = useWindowWidth();
  const twoColumn = width > 800;
  const [count, setCount] = useState(1);
  const cart = useCart();

  const finalPrice = product.price - (product.price * product.discount) / 100;
  const outOfStock = !product.isInStore || product.price === 0;
  const inCart = cart.isInCart(product.id);

  const handleAddToCart = () => {
    cart.addItem({
      productId: product.id,
      productTitle: product.title,
      productPrice: product.price,
      productImage: product.images[0] ? storageImageUrl(product.images[0].url) : "",
      count,
      discount: product.discount,
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: twoColumn ? "row" : "column", gap: twoColumn ? 0 : 4 }}>
      <Box sx={{ width: twoColumn ? "50%" : "100%" }}>
        <ImageGallery images={product.images} title={product.title} />
      </Box>

      <Box sx={{ width: twoColumn ? "50%" : "100%", px: 2 }}>
        <Box sx={{ fontSize: 12, fontWeight: 700, color: colors.additionalTextColor2 }}>
          {product.category.name}
        </Box>
        {/* Real h1 — the single most prominent piece of text on the page,
            and previously just a styled div with no semantic heading at
            all (the whole page had no h1 anywhere). Margin/line-height
            reset so it stays pixel-identical to before. */}
        <Box component="h1" sx={{ m: 0, mt: 1, fontSize: 20, fontWeight: 700, lineHeight: "normal" }}>
          {product.title}
        </Box>
        <Box sx={{ mt: 1, fontSize: 14, color: "rgba(0,0,0,0.54)" }}>{product.subTitle}</Box>

        <Box sx={{ mt: 4, fontSize: 16, fontWeight: 700 }}>Опис</Box>
        <GradientLine padding="8px 0 16px 0" />
        <Box sx={{ fontSize: 14, whiteSpace: "pre-line" }}>{product.content}</Box>

        {product.price > 0 && (
          <Box sx={{ mt: 4, display: "flex", alignItems: "baseline", gap: 2 }}>
            {product.discount > 0 && (
              <Box
                component="span"
                sx={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: colors.additionalTextColor,
                  textDecoration: "line-through",
                  textDecorationColor: "#e53935",
                }}
              >
                {product.price.toFixed(2)} ₴
              </Box>
            )}
            <Box component="span" sx={{ fontSize: 24, fontWeight: 700 }}>
              {finalPrice.toFixed(2)} ₴
            </Box>
            {!!product.bonus && product.bonus > 0 && (
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  backgroundColor: "#DD5D79",
                  color: "#ffffff",
                  borderRadius: "999px",
                  fontSize: 12,
                  fontWeight: 700,
                  px: "10px",
                  py: "3px",
                }}
              >
                +{product.bonus} Б
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ mt: 3 }}>
          {outOfStock ? (
            <Box sx={{ color: "#e53935" }}>Немає в наявності</Box>
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 3 }}>
              <NumericStepper value={count} onChange={setCount} minValue={1} disabled={inCart} />
              {inCart ? (
                <AlreadyInCart />
              ) : (
                <ToProductButton
                  text="ДОДАТИ В КОШИК"
                  onClick={handleAddToCart}
                  icon={(color) => <PackageIcon color={color} width={18} />}
                />
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
