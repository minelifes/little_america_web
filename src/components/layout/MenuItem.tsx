import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import { colors } from "../../theme/theme";

interface MenuItemProps {
  text: string;
  route: string;
  onClick?: () => void;
}

// Ported from lib/resources/widgets/appbar/menu_item.dart
export default function MenuItem({ text, route, onClick }: MenuItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isSelected = location.pathname === route;

  return (
    <Box
      component="button"
      onClick={() => {
        navigate(route);
        onClick?.();
      }}
      sx={{
        px: 2,
        py: 1,
        background: "none",
        border: "none",
        borderRadius: "999px",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "background-color 200ms ease",
        "&:hover": {
          backgroundColor: "rgba(0,0,0,0.06)",
        },
      }}
    >
      <Box
        component="span"
        sx={{
          color: colors.mainTextColor,
          fontSize: 14,
          fontWeight: 400,
          letterSpacing: "2px",
          textDecoration: isSelected ? "underline" : "none",
          textDecorationColor: colors.mainTextColor,
        }}
      >
        {text.toUpperCase()}
      </Box>
    </Box>
  );
}
