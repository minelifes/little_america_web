import Box from "@mui/material/Box";
import bilou from "../../assets/about/bilou.webp";

const TEXT =
  "Тут ви можете придбати парфуми, солодощі, свічки, косметику, каву, білизну і все, що забажаєте із самої Америки, адже крім основної продукції ми займаємося індивідуальними замовленнями.\nМи привозимо товари американських брендів таких як Victoria's Secret, Bath and Body Works, Starbucks, Carmex, iHerb та ін. А також в нас величезний асортимент товарів від українських виробників, та з країн Європи і Азії. Декоративна, доглядова косметика, парфуми.";

// Ported from the "Про продукцію" block in about_page.dart.
export default function AboutProductsIntro() {
  return (
    <Box sx={{ position: "relative", minHeight: { xs: 560, md: 400 }, px: { xs: 2, md: 4 } }}>
      <Box
        component="img"
        src={bilou}
        alt=""
        sx={{
          position: "absolute",
          top: 0,
          right: { xs: 8, md: 0 },
          width: { xs: 240, md: 400 },
          height: { xs: 240, md: 400 },
          objectFit: "contain",
        }}
      />
      <Box sx={{ maxWidth: { xs: "100%", md: "50%" }, pt: { xs: "260px", md: "100px" } }}>
        <Box sx={{ fontSize: 30 }}>Про продукцію</Box>
        <Box sx={{ mt: 4, fontSize: 15, whiteSpace: "pre-line" }}>{TEXT}</Box>
      </Box>
    </Box>
  );
}
