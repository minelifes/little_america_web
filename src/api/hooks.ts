import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authUserApi, brandApi, categoryApi, newsApi, npApi, orderApi, productApi, walletApi } from "./services";
import { hasValidUserToken } from "./auth";
import { useBonuses } from "./constants";
import type { ChangePasswordRequest, SearchFilters, UpdateProfileRequest } from "./types";

export const useNews = () =>
  useQuery({
    queryKey: ["news"],
    queryFn: newsApi.getNews,
  });

// Ported from CategoryBloc.fetch() in lib/app/bloc/category_bloc.dart, which
// memoizes: it only calls the API if nothing is cached yet, and every page
// that needs categories reads from that same cache. staleTime: Infinity +
// refetch* : false reproduce that — the list is fetched once per full page
// load (browser refresh), never re-fetched just because another component
// mounted or the tab regained focus.
export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getCategories,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

export const useNewProducts = (limit = 5, page = 1) =>
  useQuery({
    queryKey: ["products", "last", limit, page],
    queryFn: () => productApi.getLast(limit, page),
  });

export const useSaleProducts = (limit = 4, page = 1) =>
  useQuery({
    queryKey: ["products", "sale", limit, page],
    queryFn: () => productApi.getSale(limit, page),
  });

export const useProductsByCategory = (categoryId: number, page = 1) =>
  useQuery({
    queryKey: ["products", "byCategory", categoryId, page],
    queryFn: () => productApi.getByCategory(categoryId, page),
    enabled: Number.isFinite(categoryId),
  });

export const useProduct = (id: number) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.getById(id),
    enabled: Number.isFinite(id),
  });

// Ported from ProductBloc._fetchRecs in lib/app/bloc/product_bloc.dart:
// fetch recommended ids for the product's category, drop the product's own
// id, then resolve those ids into full (optimized) product cards.
export const useRelatedProducts = (categoryId: number | undefined, excludeProductId: number) =>
  useQuery({
    queryKey: ["products", "recs", categoryId, excludeProductId],
    queryFn: async () => {
      const ids = (await productApi.recommendation(categoryId!)).filter((id) => id !== excludeProductId);
      if (ids.length === 0) return [];
      return productApi.getByIds(ids);
    },
    enabled: categoryId !== undefined,
  });

// Best-effort brand list for the "Бренд" filter dropdown — see brandApi.list.
// retry: false so a missing/guessed endpoint fails fast instead of retrying
// and delaying the filter panel; callers should treat `data` as possibly
// empty/undefined rather than blocking on it.
export const useBrands = () =>
  useQuery({
    queryKey: ["brands"],
    queryFn: brandApi.list,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

// Backs the Товари filter panel — see productApi.search / SearchFilters for
// why this is a from-scratch design rather than a port. keepPreviousData
// keeps the current grid visible (instead of flashing a skeleton) while a
// new filter/page loads. `enabled` lets ProductsPage only hit this
// unconfirmed endpoint once the user has actually applied a category/brand/
// sort/price filter — the default "УСІ ТОВАРИ" view uses the real
// productApi.getLast endpoint instead (see useTopProducts below).
export const useProductSearch = (filters: SearchFilters, page = 1, enabled = true) =>
  useQuery({
    queryKey: ["products", "search", filters, page],
    queryFn: () => productApi.search(filters, page),
    placeholderData: keepPreviousData,
    enabled,
  });

// Ported from search_widget.dart's _onSearch/searchFuture — the appbar's
// live-search dropdown. Same productApi.search endpoint as above, called
// with just `{ text }` (its only real, confirmed usage in the Dart source).
// Only fires once 3+ characters are entered, matching Dart's minimum.
export const useSearchSuggestions = (text: string) => {
  const trimmed = text.trim();
  return useQuery({
    queryKey: ["products", "search", "suggestions", trimmed],
    queryFn: () => productApi.search({ text: trimmed }, 1),
    enabled: trimmed.length >= 3,
  });
};

// Ported from NPDeliveryCitySelect.findBySearch in np_delivery_city_select.dart
// — only searches once 3+ characters are entered.
export const useCitySearch = (query: string) => {
  const trimmed = query.trim();
  return useQuery({
    queryKey: ["np", "city", trimmed],
    queryFn: () => npApi.searchCity(trimmed),
    enabled: trimmed.length >= 3,
  });
};

// Ported from NPDeliveryWarehouseSelect — the full warehouse list for a city
// loads eagerly once a city is selected; the UI filters it client-side as
// the user types (not a live per-keystroke search, unlike city search).
export const useWarehouses = (cityRef: string | undefined) =>
  useQuery({
    queryKey: ["np", "warehouses", cityRef],
    queryFn: () => npApi.searchWarehouses(cityRef!),
    enabled: !!cityRef,
    staleTime: Infinity,
  });

// ---- Account: profile / orders / bonuses ----
// NOT ported — see api/services.ts orderApi.getWebList/getWebDetail,
// walletApi, authUserApi.me/updateMe/changePassword for the endpoints.
// All `enabled: hasValidUserToken()` since these require a logged-in user —
// avoids firing a doomed request (and the console-noise 401) while the auth
// drawer is still open/anonymous.

/** My Orders list. There's no backend concept of "current vs past" orders
 * (OrdersPage's two tabs) — this always fetches the same real, paginated
 * endpoint; OrdersPage does the current/past split client-side by status
 * on whatever page is currently loaded (a known simplification — a real
 * status filter query param would be needed for the tab counts/pagination
 * to be fully accurate per-tab). */
export const useMyOrders = (page = 1, count = 20) =>
  useQuery({
    queryKey: ["account", "orders", page, count],
    queryFn: () => orderApi.getWebList(page, count, true),
    enabled: hasValidUserToken(),
    placeholderData: keepPreviousData,
  });

/** "Мої покупки" — the in-store counterpart of useMyOrders: sales staff
 * linked to this client by phone (see StoreClientDialog on the admin app),
 * not orders placed through this storefront. Same paginated endpoint,
 * `online=false` instead of the default `true`. */
export const useMyPurchases = (page = 1, count = 20) =>
  useQuery({
    queryKey: ["account", "purchases", page, count],
    queryFn: () => orderApi.getWebList(page, count, false),
    enabled: hasValidUserToken(),
    placeholderData: keepPreviousData,
  });

export const useOrderDetail = (number: string | undefined) =>
  useQuery({
    queryKey: ["account", "order", number],
    queryFn: () => orderApi.getWebDetail(number!),
    enabled: hasValidUserToken() && !!number,
  });

export const useBonusBalance = () =>
  useQuery({
    queryKey: ["account", "wallet"],
    queryFn: walletApi.getWallet,
    // Bonuses program isn't launched yet — see api/constants.ts's useBonuses
    // doc comment. Skips the fetch entirely while disabled.
    enabled: useBonuses && hasValidUserToken(),
  });

export const useBonusHistory = () =>
  useQuery({
    queryKey: ["account", "wallet", "history"],
    queryFn: () => walletApi.getHistory(),
    enabled: useBonuses && hasValidUserToken(),
  });

export const useProfile = () =>
  useQuery({
    queryKey: ["account", "profile"],
    queryFn: authUserApi.me,
    enabled: hasValidUserToken(),
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdateProfileRequest) => authUserApi.updateMe(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["account", "profile"] }),
  });
};

export const useChangePassword = () =>
  useMutation({
    mutationFn: (request: ChangePasswordRequest) => authUserApi.changePassword(request),
  });
