import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Pagination from "@mui/material/Pagination";
import { Navigate, useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import GradientLine from "../components/common/GradientLine";
import Breadcrumbs from "../components/common/Breadcrumbs";
import CategoryHero from "../components/category/CategoryHero";
import CategoryCard from "../components/home/CategoryCard";
import ProductCard from "../components/home/ProductCard";
import ProductCardSkeleton from "../components/home/ProductCardSkeleton";
import { useCategories, useProductsByCategory } from "../api/hooks";
import {
  getAncestors,
  getCategoryById,
  getChildren,
} from "../api/categoryTree";
import { scrollToTop } from "../utils/scroll";
import { ROUTES } from "../routes";
import { useSeo } from "../seo/useSeo";
import { useJsonLd, breadcrumbListJsonLd } from "../seo/structuredData";

const PRODUCTS_PER_PAGE = 20;

// Ported from lib/resources/pages/by_category/by_category_page.dart — decides
// whether to show subcategory tiles or a product grid purely by whether any
// other category has this one as its parent (see getChildren in categoryTree.ts).
export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id);
  const [page, setPage] = useState(1);

  // Same route (/category/:id) re-renders in place when navigating between
  // categories (e.g. a subcategory tile) rather than remounting — reset the
  // product-grid page whenever the id changes so a deep page on category A
  // doesn't carry over as an out-of-range page on category B.
  useEffect(() => {
    setPage(1);
  }, [categoryId]);

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();
  const category = categories
    ? getCategoryById(categories, categoryId)
    : undefined;
  const ancestorsForSeo =
    categories && category ? getAncestors(categories, category) : [];
  const breadcrumbItemsForSeo = category
    ? [
        { name: "Головна", path: ROUTES.home },
        ...ancestorsForSeo.map((a) => ({
          name: a.name,
          path: `${ROUTES.byCategory}${a.id}`,
        })),
        { name: category.name, path: `${ROUTES.byCategory}${category.id}` },
      ]
    : [];

  // Hooks must run unconditionally, before the early returns below.
  useSeo({
    title: category?.name ?? "Категорія товарів",
    description: category?.description || undefined,
  });
  useJsonLd(
    "breadcrumb-jsonld",
    breadcrumbItemsForSeo.length > 0
      ? breadcrumbListJsonLd(breadcrumbItemsForSeo)
      : null,
  );

  if (!id || !Number.isFinite(categoryId)) {
    return <Navigate to={ROUTES.home} replace />;
  }

  if (categoriesLoading) {
    return <CategoryPageSkeleton />;
  }

  if (categoriesError || !category) {
    return (
      <Box sx={{ width: "100%" }}>
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
            Категорію не знайдено
          </Box>
        </Box>
        <Footer />
      </Box>
    );
  }

  const children = getChildren(categories!, category.id);
  const ancestors = getAncestors(categories!, category);
  const breadcrumbItems = [
    { name: "Головна", path: ROUTES.home },
    ...ancestors.map((a) => ({
      name: a.name,
      path: `${ROUTES.byCategory}${a.id}`,
    })),
    { name: category.name },
  ];

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      <Header />
      <Box component="main">
        <CategoryHero category={category} />

        <Box sx={{ px: { xs: 2, md: 4 }, maxWidth: 1400, mx: "auto" }}>
          <Box sx={{ pt: 2 }} />
          <Breadcrumbs items={breadcrumbItems} />
          <GradientLine padding="16px 0" />

          {children.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 2,
                pb: 6,
              }}
            >
              {children.map((c) => (
                <CategoryCard key={c.id} category={c} />
              ))}
            </Box>
          ) : (
            <ProductsForCategory
              categoryId={category.id}
              page={page}
              onPageChange={(p) => {
                setPage(p);
                scrollToTop(true);
              }}
            />
          )}
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}

function ProductsForCategory({
  categoryId,
  page,
  onPageChange,
}: {
  categoryId: number;
  page: number;
  onPageChange: (page: number) => void;
}) {
  const { data, isLoading, isError } = useProductsByCategory(categoryId, page);
  const pageCount = data ? Math.ceil(data.total / PRODUCTS_PER_PAGE) : 0;

  return (
    <Box sx={{ pb: 6 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))
        ) : isError ? (
          <Box sx={{ py: 4, color: "text.secondary", fontSize: 14 }}>
            Не вдалося завантажити товари
          </Box>
        ) : data && data.content.length > 0 ? (
          data.content.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <Box sx={{ py: 4, color: "text.secondary", fontSize: 14 }}>
            У цій категорії поки немає товарів
          </Box>
        )}
      </Box>

      {pageCount > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, p) => onPageChange(p)}
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": { fontWeight: 700 },
              "& .Mui-selected": {
                backgroundColor: "#161616 !important",
                color: "#ffffff",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}

function CategoryPageSkeleton() {
  return (
    <Box sx={{ width: "100%" }}>
      <Header />
      <Box component="main">
        <Skeleton variant="rectangular" width="100%" height={360} />
        <Box sx={{ px: { xs: 2, md: 4 }, maxWidth: 1400, mx: "auto" }}>
          <Skeleton variant="text" width={240} height={30} sx={{ mt: 2 }} />
          <GradientLine padding="16px 0" />
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 2,
              pb: 6,
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
