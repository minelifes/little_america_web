import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { ROUTES } from "../../routes";
import aboutBg from "../../assets/about/about_bg.webp";

interface OrderConfirmationProps {
  orderNumber: string;
  /** Product image URLs from the just-cleared cart, shown blurred/decorative in the background. */
  decorativeImages?: string[];
}

// Ported from lib/resources/pages/order_page/widgets/succes_create_order.dart.
export default function OrderConfirmation({ orderNumber, decorativeImages = [] }: OrderConfirmationProps) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: 500,
        overflow: "hidden",
        backgroundImage: `url(${aboutBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {decorativeImages.slice(0, 2).map((src, i) => (
        <Box
          key={i}
          component="img"
          src={src}
          alt=""
          sx={{
            position: "absolute",
            top: i === 0 ? "8%" : "55%",
            left: i === 0 ? "8%" : undefined,
            right: i === 0 ? undefined : "8%",
            width: 140,
            height: 140,
            objectFit: "contain",
            filter: "blur(10px)",
            opacity: 0.7,
            pointerEvents: "none",
          }}
        />
      ))}

      <Box sx={{ position: "relative", textAlign: "center", py: 10, px: 3 }}>
        <Box sx={{ fontSize: 18, fontWeight: 700 }}>Замовлення №{orderNumber}</Box>
        <Box sx={{ mt: 3, fontSize: 14, color: "rgba(0,0,0,0.54)", maxWidth: 480, mx: "auto" }}>
          Дякуємо, що обираєте нас. Ваше замовлення успішно оформлене. Деталі замовлення дивіться по посиланню на
          вашій пошті.
        </Box>

        <Box sx={{ mt: 8 }}>
          <Box
            component="button"
            onClick={() => navigate(ROUTES.home)}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: 18 }} />
            ПОВЕРНУТИСЬ НА ГОЛОВНУ
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
