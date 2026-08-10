import Box from "@mui/material/Box";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import GradientLine from "../components/common/GradientLine";
import Slider from "../components/home/Slider";
import ProductGrid from "../components/home/ProductGrid";
import CategoryGrid from "../components/home/CategoryGrid";
import LifeAndInfo from "../components/home/LifeAndInfo";
import { useNewProducts } from "../api/hooks";
import { useSeo } from "../seo/useSeo";
import { useJsonLd } from "../seo/structuredData";

const HOME_ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Little America",
  url: typeof window !== "undefined" ? window.location.origin : undefined,
  logo:
    typeof window !== "undefined"
      ? `${window.location.origin}/favicon.svg`
      : undefined,
  sameAs: ["https://www.instagram.com/little_america_/"],
};

// Ported from lib/resources/pages/home_page.dart
export default function HomePage() {
  const {
    data: newProducts,
    isLoading: newLoading,
    isError: newError,
  } = useNewProducts(5, 1);
  // const { data: saleProducts, isLoading: saleLoading, isError: saleError } = useSaleProducts(4, 1);

  useSeo({
    title: "Американські товари в Україні",
    description:
      "Little America — інтернет-магазин американських товарів: парфуми, косметика, солодощі, свічки, білизна, кава. Victoria's Secret, Bath and Body Works, Starbucks, iHerb та інші відомі бренди з доставкою по Україні.",
  });
  useJsonLd("organization-jsonld", HOME_ORGANIZATION_JSON_LD);

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      <Header />

      <Box component="main">
        <Box sx={{ position: "relative", width: "100%", height: 700 }}>
          <Box sx={{ position: "absolute", inset: 0 }}>
            <Slider />
          </Box>
        </Box>

        <GradientLine />

        <ProductGrid
          title="НОВИНКИ + ПОПУЛЯРНІ ТОВАРИ"
          products={newProducts ?? []}
          isLoading={newLoading}
          isError={newError}
        />

        <GradientLine padding="170px 16px 16px 16px" />

        {/*<ProductGrid*/}
        {/*  title="АКЦІЙНІ ПРОПОЗИЦІЇ"*/}
        {/*  products={saleProducts ?? []}*/}
        {/*  isLoading={saleLoading}*/}
        {/*  isError={saleError}*/}
        {/*  badgeText={(p) => (p.bonus ? `+${p.bonus} ₴` : undefined)}*/}
        {/*/>*/}

        <CategoryGrid />

        <Box sx={{ height: 50 }} />
        <LifeAndInfo />
        <Box sx={{ height: 50 }} />
      </Box>

      <Footer />
    </Box>
  );
}
