import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../../api/hooks";
import { ROUTES } from "../../routes";
import { backgroundGradient } from "../../theme/gradients";
import { colors } from "../../theme/theme";
import instaIcon from "../../assets/insta.svg";
import tiktokIcon from "../../assets/tiktok.webp";

const heading = { fontWeight: 700, fontSize: 14 } as const;
const dim = { color: colors.additionalTextColor, fontSize: 14 } as const;

function FooterLink({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: "none",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        py: "10px",
        px: "12px",
        mx: "-12px",
        fontSize: 14,
        fontFamily: "inherit",
        color: colors.mainTextColor,
        transition: "background-color 150ms ease-in-out",
        "&:hover": {
          backgroundColor: "rgba(0,0,0,0.08)",
        },
      }}
    >
      {children}
    </Box>
  );
}

function SocialLink({ icon, handle, href }: { icon: string; handle: string; href: string }) {
  return (
    <Box
      component="a"
      href={href}
      target="_blank"
      rel="noreferrer"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        py: "8px",
        px: "12px",
        mx: "-12px",
        borderRadius: "8px",
        textDecoration: "none",
        color: colors.mainTextColor,
        transition: "background-color 150ms ease-in-out",
        "&:hover": {
          backgroundColor: "rgba(0,0,0,0.08)",
        },
      }}
    >
      <Box component="img" src={icon} alt="" sx={{ width: 44, height: 44 }} />
      <Box component="span" sx={{ fontSize: 14 }}>
        {handle}
      </Box>
    </Box>
  );
}

// Ported from lib/resources/widgets/footer.dart
export default function Footer() {
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const topLevelCategories = (categories ?? []).filter((c) => c.pid === null && c.visible);

  return (
    <Box sx={{ width: "100%", background: backgroundGradient, px: 2 }}>
      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "32px",
          pt: "50px",
          pb: "70px",
        }}
      >
        <Box sx={{ width: 300 }}>
          <Box sx={heading}>АДРЕСА</Box>
          <Box sx={{ ...dim, mt: 2, mb: "6px" }}>м. Луцьк</Box>
          <Box sx={dim}>в. Богдана Хмельницького 40а/1</Box>

          <Box sx={{ ...heading, mt: "70px" }}>КОНТАКТИ</Box>
          <Box sx={{ fontSize: 14, mt: 1 }}>Viber, Telegram, WhatsApp</Box>
          <Box sx={{ ...dim, mt: 2, mb: 2 }}>093 706 2276</Box>
          <Box sx={{ fontSize: 14 }}>З приводу співпраці:</Box>
          <Box sx={{ ...dim, mt: 2, mb: 2 }}>066 409 4751</Box>
          <Box sx={{ fontSize: 14 }}>Соціальні мережі:</Box>
          <Box sx={{ ...dim, mt: 1 }}>@little_america_</Box>
          <Box sx={{ ...dim, mt: 1 }}>@makeup_queen_ua</Box>
        </Box>

        <Box sx={{ width: 300 }}>
          <Box sx={heading}>МАГАЗИН</Box>
          <Box sx={{ mt: 1 }}>
            {topLevelCategories.map((c) => (
              <FooterLink key={c.id} onClick={() => navigate(`${ROUTES.byCategory}${c.id}`)}>
                {c.name}
              </FooterLink>
            ))}
          </Box>
        </Box>

        <Box sx={{ width: 300, minWidth: 250 }}>
          <Box sx={heading}>ЗАГАЛЬНЕ</Box>
          <Box sx={{ mt: 1 }}>
            <FooterLink onClick={() => navigate(ROUTES.aboutUs)}>Про нас</FooterLink>
            <FooterLink onClick={() => navigate(ROUTES.aboutUs)}>Доставка та оплата</FooterLink>
          </Box>
        </Box>

        <Box sx={{ width: 300, minWidth: 250 }}>
          <Box sx={heading}>СОЦІАЛЬНІ МЕРЕЖІ</Box>
          <Box sx={{ mt: 1 }}>
            <SocialLink icon={instaIcon} handle="@little_america_" href="https://instagram.com/little_america_" />
            <SocialLink icon={tiktokIcon} handle="@little_america_" href="https://www.tiktok.com/@little_america_" />
            <Box sx={{ height: "102px" }} />
            <SocialLink icon={instaIcon} handle="@makeup_queen_ua" href="https://instagram.com/makeup_queen_ua" />
            <SocialLink icon={tiktokIcon} handle="@makeup_queen_ua" href="https://www.tiktok.com/@makeup_queen_ua" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
