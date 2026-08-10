import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { Navigate, useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import GradientLine from "../components/common/GradientLine";
import Breadcrumbs from "../components/common/Breadcrumbs";
import ProductDescription from "../components/product/ProductDescription";
import ProductGrid from "../components/home/ProductGrid";
import { useCategories, useProduct, useRelatedProducts } from "../api/hooks";
import { getAncestors, getCategoryById } from "../api/categoryTree";
import { storageImageUrl } from "../api/constants";
import { ROUTES } from "../routes";
import { useSeo } from "../seo/useSeo";
import {
  useJsonLd,
  breadcrumbListJsonLd,
  productJsonLd,
  stripHtml as stripHtmlForSeo,
} from "../seo/structuredData";

// Ported from lib/resources/pages/product_page/product_page.dart
export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const { data: product, isLoading, isError } = useProduct(productId);
  const { data: categories } = useCategories();
  const { data: relatedProducts, isLoading: relatedLoading } =
    useRelatedProducts(product?.category.id, productId);

  // Hooks must run unconditionally, before the early returns below.
  const resolvedCategoryForSeo =
    (product &&
      categories &&
      getCategoryById(categories, product.category.id)) ||
    product?.category;
  const ancestorsForSeo =
    product && categories && resolvedCategoryForSeo
      ? getAncestors(categories, resolvedCategoryForSeo)
      : [];
  const breadcrumbItemsForSeo = product
    ? [
        { name: "Головна", path: ROUTES.home },
        ...ancestorsForSeo.map((a) => ({
          name: a.name,
          path: `${ROUTES.byCategory}${a.id}`,
        })),
        ...(resolvedCategoryForSeo
          ? [
              {
                name: resolvedCategoryForSeo.name,
                path: `${ROUTES.byCategory}${resolvedCategoryForSeo.id}`,
              },
            ]
          : []),
        { name: product.title, path: `${ROUTES.product}${product.id}` },
      ]
    : [];
  // BUG FIX: images[].url is a relative storage path (see storageImageUrl),
  // not a usable URL on its own — og:image/twitter:image/JSON-LD "image"
  // were pointing at a broken relative path before this was wrapped.
  const rawMainImage =
    product?.images.find((img) => img.isMain)?.url ?? product?.images[0]?.url;
  const mainImage = rawMainImage ? storageImageUrl(rawMainImage) : undefined;

  useSeo({
    title: product?.title ?? "Товар",
    description: product
      ? stripHtmlForSeo(product.content) || undefined
      : undefined,
    image: mainImage,
    type: "product",
    // Always declare the canonical /product/:id path, even when this page
    // was reached via the legacy /products/:id alias (old Flutter-site URLs
    // Google indexed) — keeps both paths consolidated onto one canonical
    // URL instead of being indexed as duplicate pages.
    canonicalPath: product ? `${ROUTES.product}${product.id}` : undefined,
  });
  useJsonLd(
    "breadcrumb-jsonld",
    breadcrumbItemsForSeo.length > 0
      ? breadcrumbListJsonLd(breadcrumbItemsForSeo)
      : null,
  );
  useJsonLd(
    "product-jsonld",
    product
      ? productJsonLd({
          title: product.title,
          content: product.content,
          price: product.price,
          image: mainImage,
          isInStore: product.isInStore,
        })
      : null,
  );

  if (!id || !Number.isFinite(productId)) {
    return <Navigate to={ROUTES.home} replace />;
  }

  if (isLoading) {
    return <ProductPageSkeleton />;
  }

  if (isError || !product) {
    return (
      <Box sx={{ width: "100%", pb: 3 }}>
        <Header />
        <Box component="main">
          <Box sx={{ height: { xs: 100, sm: 140 } }} />
          <Box
            sx={{
              py: 10,
              textAlign: "center",
              fontSize: 20,
              color: "text.secondary",
            }}
          >
            Товар не знайдено
          </Box>
        </Box>
        <Footer />
      </Box>
    );
  }

  const resolvedCategory =
    (categories && getCategoryById(categories, product.category.id)) ||
    product.category;
  const ancestors = categories
    ? getAncestors(categories, resolvedCategory)
    : [];
  const breadcrumbItems = [
    { name: "Головна", path: ROUTES.home },
    ...ancestors.map((a) => ({
      name: a.name,
      path: `${ROUTES.byCategory}${a.id}`,
    })),
    {
      name: resolvedCategory.name,
      path: `${ROUTES.byCategory}${resolvedCategory.id}`,
    },
    { name: product.title },
  ];

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      <Header />
      <Box component="main">
        <Box sx={{ height: { xs: 100, sm: 140 } }} />

        <Box sx={{ px: { xs: 2, md: 4 }, maxWidth: 1400, mx: "auto" }}>
          <Breadcrumbs items={breadcrumbItems} />
          <GradientLine padding="16px 0" />
          <Box sx={{ pt: 2 }} />
          <ProductDescription product={product} />
        </Box>

        <GradientLine />

        <ProductGrid
          title="Схожі товари"
          products={relatedProducts ?? []}
          isLoading={relatedLoading}
          showMoreButton={false}
        />

        <Box sx={{ height: 50 }} />
      </Box>
      <Footer />
    </Box>
  );
}

function ProductPageSkeleton() {
  return (
    <Box sx={{ width: "100%" }}>
      <Header />
      <Box component="main">
        <Box sx={{ height: { xs: 100, sm: 140 } }} />
        <Box sx={{ px: { xs: 2, md: 4 }, maxWidth: 1400, mx: "auto", pb: 2 }}>
          <Skeleton variant="text" width={280} height={24} />
          <GradientLine padding="16px 0" />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            <Skeleton
              variant="rounded"
              width={400}
              height={400}
              sx={{ flex: 1, minWidth: 280 }}
            />
            <Box sx={{ flex: 1, minWidth: 280 }}>
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton variant="text" width="70%" height={32} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="50%" height={20} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="90%" height={80} sx={{ mt: 4 }} />
              <Skeleton variant="text" width={140} height={36} sx={{ mt: 4 }} />
              <Skeleton
                variant="rounded"
                width={280}
                height={42}
                sx={{ mt: 3 }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
