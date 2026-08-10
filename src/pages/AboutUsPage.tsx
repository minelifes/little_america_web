import Box from "@mui/material/Box";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import AboutHero from "../components/about/AboutHero";
import AboutProductsIntro from "../components/about/AboutProductsIntro";
import AboutDeliveryPayment from "../components/about/AboutDeliveryPayment";
import AboutBrands from "../components/about/AboutBrands";
import AboutWhyWe from "../components/about/AboutWhyWe";
import aboutBg from "../assets/about/about_bg.webp";
import { useSeo } from "../seo/useSeo";

// Ported from lib/resources/pages/about_page.dart. Like HomePage, the fixed
// Header floats over the hero (no top spacer) rather than pushing content
// down, matching the Flutter version's Stack(CustomAppBar over the ListView).
export default function AboutUsPage() {
  useSeo({
    title: "Про нас",
    description:
      "Little America — американські парфуми, солодощі, свічки, косметика, кава і білизна. Привозимо товари брендів Victoria's Secret, Bath and Body Works, Starbucks, Carmex, iHerb та інших, а також продукцію українських виробників і товари з Європи та Азії.",
  });

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      <Header />

      <Box component="main">
        <AboutHero />

        <Box
          sx={{
            backgroundImage: `url(${aboutBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Box sx={{ maxWidth: 1200, mx: "auto", pt: "42px" }}>
            <AboutProductsIntro />
            <AboutDeliveryPayment />
            <AboutBrands />
            <AboutWhyWe />
          </Box>
        </Box>

        <Box sx={{ height: 50 }} />
      </Box>
      <Footer />
    </Box>
  );
}
