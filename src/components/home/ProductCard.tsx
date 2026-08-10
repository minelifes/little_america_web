import { useState } from "react";
import Box from "@mui/material/Box";
import NetworkImage from "../common/NetworkImage";
import ToProductButton from "../common/ToProductButton";
import PackageIcon from "../common/PackageIcon";
import { prepareImageUrl } from "../../api/constants";
import { colors } from "../../theme/theme";
import { ROUTES } from "../../routes";
import { useCart } from "../../cart/CartContext";
import type { OptimizedProductModel } from "../../api/types";

interface ProductCardProps {
  product: OptimizedProductModel;
  width?: number | string;
  /** Overrides the default "-X%" discount chip with a custom badge (e.g. "+300 ₴"). */
  badgeText?: string;
}

// Ported from lib/resources/widgets/product_item.dart
export default function ProductCard({ product, width = 264, badgeText }: ProductCardProps) {
  const cart = useCart();
  const [cartHover, setCartHover] = useState(false);
  const finalPrice = product.price - (product.price * product.discount) / 100;
  const outOfStock = !product.isInStore || product.price === 0;
  const badge = badgeText ?? (product.discount > 0 ? `-${product.discount}%` : null);
  const inCart = cart.isInCart(product.id);

  // Adds 1 unit straight from the card — the product page's own
  // ProductDescription flow (with its quantity stepper) still handles
  // choosing a specific count; this is just the quick "grab one" path so
  // people don't have to open every product to buy it.
  const handleAddToCart = () => {
    if (outOfStock || inCart) return;
    cart.addItem({
      productId: product.id,
      productTitle: product.title,
      productPrice: product.price,
      productImage: prepareImageUrl(product.image),
      count: 1,
      discount: product.discount,
    });
  };

  return (
    <Box sx={{ width, minHeight: 380, display: "flex", flexDirection: "column" }}>
      <Box sx={{ width, height: 200, flexShrink: 0, position: "relative" }}>
        <NetworkImage src={prepareImageUrl(product.image)} alt={product.title} />
        {badge && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: badgeText ? colors.orangeColor : "#FF5F5F",
              color: "#ffffff",
              fontSize: 12,
              fontWeight: 700,
              borderRadius: "8px",
              px: "10px",
              py: "4px",
            }}
          >
            {badge}
          </Box>
        )}
      </Box>

      <Box
        sx={{
          mt: 2,
          mb: "4px",
          flexShrink: 0,
          fontWeight: 700,
          fontSize: 16,
          lineHeight: 1.3,
          height: `${16 * 1.3 * 2}px`,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          textOverflow: "ellipsis",
        }}
      >
        {product.title}
      </Box>
      <Box
        sx={{
          flexShrink: 0,
          fontSize: 13,
          lineHeight: 1.3,
          height: `${13 * 1.3 * 2}px`,
          color: colors.additionalTextColor,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          textOverflow: "ellipsis",
        }}
      >
        {product.subTitle}
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 2 }}>
          {product.discount > 0 && (
            <Box
              component="span"
              sx={{ fontSize: 15, color: "grey.500", textDecoration: "line-through", textDecorationColor: "#ff5252" }}
            >
              {product.price.toFixed(2)} ₴
            </Box>
          )}
          <Box component="span" sx={{ fontSize: 15, fontWeight: 900 }}>
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
                fontSize: 11,
                fontWeight: 700,
                px: "8px",
                py: "2px",
              }}
            >
              +{product.bonus} Б
            </Box>
          )}
          {outOfStock && (
            <Box component="span" sx={{ fontSize: 12, fontWeight: 700, color: "#e53935" }}>
              немає в наявності
            </Box>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "stretch", gap: 1 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <ToProductButton width="100%" to={`${ROUTES.product}${product.id}`} />
          </Box>
          <Box
            component="button"
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock}
            onMouseEnter={() => setCartHover(true)}
            onMouseLeave={() => setCartHover(false)}
            aria-label={inCart ? "Товар у кошику" : "Додати в кошик"}
            title={inCart ? "Товар у кошику" : "Додати в кошик"}
            sx={{
              flexShrink: 0,
              width: 42,
              height: 42,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${inCart ? "#4caf50" : "#161616"}`,
              borderRadius: "6px",
              backgroundColor: outOfStock ? "#c4c4c4" : inCart ? "#4caf50" : cartHover ? "#ffffff" : "#161616",
              borderColor: outOfStock ? "#c4c4c4" : inCart ? "#4caf50" : "#161616",
              cursor: outOfStock || inCart ? "default" : "pointer",
              transition: "background-color 200ms ease-in-out",
              fontFamily: "inherit",
              p: 0,
            }}
          >
            {inCart ? (
              <Box component="span" sx={{ color: "#ffffff", fontSize: 18, lineHeight: 1, fontWeight: 700 }}>
                ✓
              </Box>
            ) : (
              <PackageIcon color={cartHover ? "#161616" : "#ffffff"} width={16} />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
