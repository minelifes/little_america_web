import Box from "@mui/material/Box";
import useWindowWidth from "../../hooks/useWindowWidth";
import headerBg from "../../assets/about/about_us_header_1.webp";
import headerPhoto from "../../assets/about/about_us_header_2.webp";

const TEXT =
  "Привіт! Вітаю тебе в магазині товарів з Америки Little America та магазині декоративної і доглядової косметики, парфумів Makeup_queen_ua.";

function TextPanel() {
  return (
    <Box
      sx={{
        backgroundImage: `url(${headerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Box sx={{ px: { xs: 2, md: 7 }, py: 4 }}>
        <Box component="h1" sx={{ m: 0, fontWeight: 700, color: "#ffffff", fontSize: 32, textAlign: "center" }}>
          Хто ми такі?
        </Box>
        <Box sx={{ mt: 4, color: "#ffffff", fontSize: 18, fontWeight: 500 }}>{TEXT}</Box>
      </Box>
    </Box>
  );
}

// Ported from lib/resources/widgets/about_us/header_desktop.dart +
// header_mobile.dart (breakpoint at 700px).
export default function AboutHero() {
  const width = useWindowWidth();
  const isMobile = width <= 700;

  if (isMobile) {
    return (
      <Box>
        <Box
          sx={{
            height: 200,
            backgroundImage: `url(${headerPhoto})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Box sx={{ minHeight: 250 }}>
          <TextPanel />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", height: 500 }}>
      <Box sx={{ flex: 1 }}>
        <TextPanel />
      </Box>
      <Box
        sx={{
          flex: 1,
          backgroundImage: `url(${headerPhoto})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </Box>
  );
}
