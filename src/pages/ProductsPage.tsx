import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import GradientLine from "../components/common/GradientLine";
import ProductCard from "../components/home/ProductCard";
import ProductCardSkeleton from "../components/home/ProductCardSkeleton";
import FilterIcon from "../components/products/FilterIcon";
import CloseIcon from "../components/common/CloseIcon";
import CategoryTabs from "../components/products/CategoryTabs";
import FilterPanel from "../components/products/FilterPanel";
import FilterChip from "../components/products/FilterChip";
import { sortLabel } from "../components/products/SortChips";
import { PRICE_MAX, PRICE_MIN } from "../components/products/PriceRangeSlider";
import { useBrands, useCategories, useProductSearch } from "../api/hooks";
import { getSelfAndDescendantIds } from "../api/categoryTree";
import { scrollToTop } from "../utils/scroll";
import { colors } from "../theme/theme";
import { useSeo } from "../seo/useSeo";
import type { SearchFilters } from "../api/types";

const PRODUCTS_PER_PAGE = 20;
type SortValue = NonNullable<SearchFilters["sort"]>;

// NOT a port — see SearchFilters/services.ts/hooks.ts for why. The Flutter
// source's TopProductPage is a bare `getLast` grid with a dead filter icon
// (onPressed: () {}) and a fully commented-out filter panel; the tabs,
// brand/sort/price filters, and their wiring here are designed fresh to
// match the target screenshots.
//
// Always backed by the same paginated filter/search endpoint
// (useProductSearch), whether or not any filter is actually applied — an
// empty SearchFilters object just means "everything, sorted by the default".
// Previously the unfiltered "УСІ ТОВАРИ" view used a separate getLast-based
// "Більше" load-more button that accumulated pages client-side; replaced
// with the same numbered <Pagination> used everywhere else on this page, so
// there's one consistent pagination pattern instead of two different ones.
export default function ProductsPage() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  // Default sort is "popularity" — shown as the selected SortChip even
  // before the user opens the filter panel, matching "sort by popular by
  // default". hasActiveFilters below treats this default value as "nothing
  // applied" (same as null) so it doesn't show a removable chip for it.
  const DEFAULT_SORT: SortValue = "popularity";

  const [draftBrandId, setDraftBrandId] = useState<string | null>(null);
  const [draftSort, setDraftSort] = useState<SortValue | null>(DEFAULT_SORT);
  const [draftPrice, setDraftPrice] = useState<[number, number]>([
    PRICE_MIN,
    PRICE_MAX,
  ]);

  const [appliedBrandId, setAppliedBrandId] = useState<string | null>(null);
  const [appliedSort, setAppliedSort] = useState<SortValue | null>(
    DEFAULT_SORT,
  );
  const [appliedPrice, setAppliedPrice] = useState<[number, number]>([
    PRICE_MIN,
    PRICE_MAX,
  ]);

  const hasActiveFilters =
    activeCategoryId !== null ||
    appliedBrandId !== null ||
    (appliedSort !== null && appliedSort !== DEFAULT_SORT) ||
    appliedPrice[0] > PRICE_MIN ||
    appliedPrice[1] < PRICE_MAX;

  useEffect(() => {
    setPage(1);
  }, [activeCategoryId, appliedBrandId, appliedSort, appliedPrice]);

  const { data: categories } = useCategories();
  const topLevelCategories = (categories ?? []).filter(
    (c) => c.pid === null && c.visible,
  );
  // Best-effort — degrades to an empty (disabled) dropdown if this 404s.
  const { data: brands } = useBrands();

  // Category tabs only show top-level (parent) categories, but products are
  // assigned to leaf/subcategory ids, never the parent's own id — expand to
  // the parent + every descendant id before sending, or a selected category
  // would filter out every product. See getSelfAndDescendantIds.
  const filters: SearchFilters = {
    categoryIds:
      activeCategoryId !== null
        ? getSelfAndDescendantIds(categories ?? [], activeCategoryId)
        : undefined,
    brandId: appliedBrandId ?? undefined,
    sort: appliedSort ?? undefined,
    minPrice: appliedPrice[0] > PRICE_MIN ? appliedPrice[0] : undefined,
    maxPrice: appliedPrice[1] < PRICE_MAX ? appliedPrice[1] : undefined,
  };
  const {
    data: searchData,
    isLoading: searchLoading,
    isFetching: searchFetching,
    isError: searchError,
  } = useProductSearch(filters, page);
  // useProductSearch keeps the previous page's results visible while a new
  // filter/page loads (placeholderData: keepPreviousData) so the grid
  // doesn't flash empty — but that also means isLoading is only true on the
  // very first-ever fetch. Every filter/page change after that leaves
  // isLoading false with no visual feedback on its own — isFetching stays
  // accurate across every refetch, so that's what drives the loading
  // indicator below.
  const pageCount = searchData
    ? Math.ceil(searchData.total / PRODUCTS_PER_PAGE)
    : 0;

  const handleApply = () => {
    setAppliedBrandId(draftBrandId);
    setAppliedSort(draftSort);
    setAppliedPrice(draftPrice);
    setPanelOpen(false);
  };

  const handleClear = () => {
    setDraftBrandId(null);
    setDraftSort(DEFAULT_SORT);
    setDraftPrice([PRICE_MIN, PRICE_MAX]);
    setAppliedBrandId(null);
    setAppliedSort(DEFAULT_SORT);
    setAppliedPrice([PRICE_MIN, PRICE_MAX]);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    scrollToTop(true);
  };

  // Selected-filter chips shown next to the toggle button. Removing one
  // clears both the applied value and the panel's draft, so reopening the
  // panel doesn't show a stale selection.
  const categoryChipLabel =
    activeCategoryId !== null
      ? topLevelCategories.find((c) => c.id === activeCategoryId)?.name
      : undefined;
  const brandChipLabel =
    appliedBrandId !== null
      ? (brands ?? []).find((b) => b.id === appliedBrandId)?.name
      : undefined;
  const sortChipLabel =
    appliedSort && appliedSort !== DEFAULT_SORT
      ? sortLabel(appliedSort)
      : undefined;
  const priceChipLabel =
    appliedPrice[0] > PRICE_MIN || appliedPrice[1] < PRICE_MAX
      ? `Ціна: ${appliedPrice[0].toFixed(0)}–${appliedPrice[1].toFixed(0)} ₴`
      : undefined;

  const removeCategory = () => setActiveCategoryId(null);
  const removeBrand = () => {
    setAppliedBrandId(null);
    setDraftBrandId(null);
  };
  const removeSort = () => {
    setAppliedSort(DEFAULT_SORT);
    setDraftSort(DEFAULT_SORT);
  };
  const removePrice = () => {
    setAppliedPrice([PRICE_MIN, PRICE_MAX]);
    setDraftPrice([PRICE_MIN, PRICE_MAX]);
  };

  useSeo({
    title: "Каталог товарів",
    description:
      "Каталог американських товарів Little America: парфуми, косметика, солодощі, свічки, білизна, кава. Фільтруйте за категорією, брендом і ціною.",
  });

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      <Header />
      <Box component="main">
        <Box sx={{ height: { xs: 100, sm: 140 } }} />

        {/* Visually-hidden h1 — the design has no visible page-title text
          here (only category tabs/filters), but every page should have one
          real top-level heading for SEO/accessibility. Kept off-screen
          rather than adding a new visible heading, to not touch the
          pixel-matched layout. */}
        <Box
          component="h1"
          sx={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
            whiteSpace: "nowrap",
            m: 0,
            p: 0,
          }}
        >
          Каталог товарів
        </Box>

        <Box sx={{ px: { xs: 2, md: 4 }, maxWidth: 1400, mx: "auto" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 1,
                py: 1,
              }}
            >
              {categoryChipLabel && (
                <FilterChip
                  label={categoryChipLabel}
                  onRemove={removeCategory}
                />
              )}
              {brandChipLabel && (
                <FilterChip label={brandChipLabel} onRemove={removeBrand} />
              )}
              {sortChipLabel && (
                <FilterChip label={sortChipLabel} onRemove={removeSort} />
              )}
              {priceChipLabel && (
                <FilterChip label={priceChipLabel} onRemove={removePrice} />
              )}
              {/* Loading feedback for every filter/page change, not just the
                very first fetch — see the isFetching comment above. */}
              {searchFetching && (
                <CircularProgress
                  size={16}
                  sx={{ color: colors.mainTextColor }}
                />
              )}
            </Box>

            <Box
              component="button"
              onClick={() => setPanelOpen((v) => !v)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                // Same filled/outlined accent language as SortChips' active
                // state — reads as a real button instead of a bare icon, and
                // stays visibly "on" while the panel is open or a filter is
                // applied, not just on hover.
                backgroundColor:
                  panelOpen || hasActiveFilters
                    ? colors.mainColor
                    : "transparent",
                border: `1px solid ${panelOpen || hasActiveFilters ? colors.mainColor : "rgba(0,0,0,0.15)"}`,
                borderRadius: "999px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 700,
                color:
                  panelOpen || hasActiveFilters
                    ? "#ffffff"
                    : colors.mainTextColor,
                flexShrink: 0,
                px: "16px",
                py: "9px",
                transition:
                  "background-color 200ms ease, border-color 200ms ease, color 200ms ease",
                "&:hover": {
                  backgroundColor:
                    panelOpen || hasActiveFilters
                      ? colors.mainColor
                      : "rgba(0,0,0,0.05)",
                  borderColor:
                    panelOpen || hasActiveFilters
                      ? colors.mainColor
                      : "rgba(0,0,0,0.3)",
                },
              }}
            >
              {panelOpen && "ФІЛЬТРИ"}
              {panelOpen ? (
                <CloseIcon size={14} color="#ffffff" />
              ) : (
                <FilterIcon
                  width={15}
                  color={hasActiveFilters ? "#ffffff" : undefined}
                />
              )}
            </Box>
          </Box>

          <Collapse in={panelOpen} timeout={250} unmountOnExit>
            <Box sx={{ pt: 1 }}>
              <Box sx={{ overflowX: "auto" }}>
                <CategoryTabs
                  categories={topLevelCategories}
                  activeId={activeCategoryId}
                  onChange={setActiveCategoryId}
                />
              </Box>
              <GradientLine padding="16px 0" />
              <FilterPanel
                brands={brands ?? []}
                brandId={draftBrandId}
                onBrandChange={setDraftBrandId}
                sort={draftSort}
                onSortChange={setDraftSort}
                price={draftPrice}
                onPriceChange={setDraftPrice}
                onApply={handleApply}
                onClear={handleClear}
              />
            </Box>
          </Collapse>

          <GradientLine padding="16px 0 36px 0" />

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 2,
              pb: 4,
              opacity: searchFetching && !searchLoading ? 0.5 : 1,
              transition: "opacity 150ms ease",
            }}
          >
            {searchLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            ) : searchError ? (
              <Box sx={{ py: 4, color: "text.secondary", fontSize: 14 }}>
                Не вдалося завантажити товари
              </Box>
            ) : searchData && searchData.content.length > 0 ? (
              searchData.content.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))
            ) : (
              <Box sx={{ py: 4, color: "text.secondary", fontSize: 14 }}>
                Товарів не знайдено
              </Box>
            )}
          </Box>

          {pageCount > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", pb: 6 }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, p) => handlePageChange(p)}
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
      </Box>

      <Footer />
    </Box>
  );
}
