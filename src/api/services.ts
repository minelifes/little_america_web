import { httpClient } from "./client";
import type {
  BonusTransaction,
  BrandModel,
  CategoryModel,
  ChangePasswordRequest,
  ChangePasswordResponse,
  CheckPhoneRequest,
  CheckPhoneResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginByPhoneRequest,
  LoginRequest,
  NewsModel,
  NPCityInfo,
  NPWarehouse,
  OptimizedProductModel,
  OrderDetail,
  OrderRequest,
  PagedOrders,
  PaginatedResponse,
  ProductModel,
  RawCategoryModel,
  RegisterRequest,
  RegisterResponse,
  RegisterVerifyRequest,
  ResendVerificationRequest,
  ResendVerificationResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SearchFilters,
  SetPasswordByPhoneRequest,
  UpdateProfileRequest,
  UserProfile,
  UserTokenData,
  VerifyEmailCodeRequest,
  VerifyEmailCodeResponse,
  WalletModel,
} from "./types";

// Ported from lib/app/networking/services/news_api.dart
export const newsApi = {
  getNews: async (): Promise<NewsModel[]> => {
    const { data } = await httpClient.get<NewsModel[]>("/api/v2/news/list");
    return data;
  },
};

// A category is a top-level/master category when it has no parent — the API
// has been seen to express that either as a flat `pid`/`parentId` (null for
// root) or as a nested `parent: { id }` object (the shape the older Flutter
// source used). Normalize both into a single `pid: number | null` field so
// the rest of the app only has to check one thing.
function normalizeCategory(raw: RawCategoryModel): CategoryModel {
  const pid = raw.pid ?? raw.parentId ?? raw.parent?.id ?? null;
  return { ...raw, pid };
}

// Ported from lib/app/networking/services/category_api.dart
export const categoryApi = {
  getCategories: async (): Promise<CategoryModel[]> => {
    const { data } =
      await httpClient.get<RawCategoryModel[]>("/api/v2/category");
    return data.map(normalizeCategory);
  },
};

// Ported from lib/app/networking/services/product_api.dart
export const productApi = {
  getLast: async (
    limit: number,
    page: number,
  ): Promise<OptimizedProductModel[]> => {
    const { data } = await httpClient.get<OptimizedProductModel[]>(
      "/api/v2/product/last",
      { params: { page, limit } },
    );
    return data;
  },

  getByCategory: async (
    id: number,
    page = 1,
  ): Promise<PaginatedResponse<OptimizedProductModel>> => {
    const { data } = await httpClient.get<
      PaginatedResponse<OptimizedProductModel>
    >(`/api/v2/product/web/by/category/${id}`, { params: { page } });
    return data;
  },

  // NOTE: no equivalent endpoint exists in the current Flutter source for the
  // "АКЦІЙНІ ПРОПОЗИЦІЇ" (sale) grid seen in the target screenshots. Using
  // the same "last products" endpoint as a placeholder data source until the
  // real sale/promo endpoint is confirmed — swap this out once known.
  getSale: async (
    limit: number,
    page: number,
  ): Promise<OptimizedProductModel[]> => {
    const { data } = await httpClient.get<OptimizedProductModel[]>(
      "/api/v2/product/last",
      { params: { page, limit } },
    );
    return data;
  },

  getById: async (id: number): Promise<ProductModel> => {
    const { data } = await httpClient.get<ProductModel>(
      `/api/v2/product/${id}`,
    );
    return data;
  },

  /** Recommended product ids for a category — the product page filters out its own id and resolves the rest via getByIds. */
  recommendation: async (categoryId: number): Promise<number[]> => {
    const { data } = await httpClient.get<{ id: number }[]>(
      `/api/v2/product/recs/${categoryId}`,
    );
    return data.map((e) => e.id);
  },

  getByIds: async (ids: number[]): Promise<OptimizedProductModel[]> => {
    const { data } = await httpClient.post<OptimizedProductModel[]>(
      "/api/v2/product/optimized/byIds",
      { ids },
    );
    return data;
  },

  // Confirmed real endpoint — a dedicated route added on the backend for
  // this filter panel (POST /api/v2/product/optimized/filter, distinct from
  // the header live-search dropdown's /optimized/search). Body matches
  // SearchFilters 1:1 (ProductFilterRequest on the Kotlin side); response is
  // { content, total, pageable } — pageable is ignored here since
  // PaginatedResponse only reads content/total.
  search: async (
    filters: SearchFilters,
    page = 1,
  ): Promise<PaginatedResponse<OptimizedProductModel>> => {
    const { data } = await httpClient.post<
      PaginatedResponse<OptimizedProductModel>
    >("/api/v2/product/optimized/filter", filters, { params: { page } });
    return data;
  },
};

// Confirmed real endpoint — GET /api/v2/brands/ (plural, trailing slash;
// not /api/v2/brand as originally guessed). Callers should still treat
// failures as "no brands available" rather than a hard error (see
// useBrands in ./hooks, which sets retry: false).
export const brandApi = {
  list: async (): Promise<BrandModel[]> => {
    const { data } = await httpClient.get<BrandModel[]>("/api/v2/brands/");
    return data;
  },
};

// Ported from lib/app/networking/services/np_api.dart's two live (non-commented-out)
// Nova Poshta endpoints — everything else in that file is dead/unused code.
export const npApi = {
  // POST /api/v2/newpost/city/search, body { CityName, Limit, Page } — only
  // called once the query is 3+ chars (see useCitySearch).
  searchCity: async (cityName: string): Promise<NPCityInfo[]> => {
    const { data } = await httpClient.post<NPCityInfo[]>(
      "/api/v2/newpost/city/search",
      {
        CityName: cityName,
        Limit: "50",
        Page: "1",
      },
    );
    return data;
  },

  // POST /api/v2/newpost/warehouse/by/city, body { cityRef } — cityRef here
  // is the selected city's `npDeliveryCity` field (not `id`/`npRef`), per
  // np_delivery_select.dart's loadWarehouses(selected.npDeliveryCity) call.
  // Loads the full warehouse list for the city up front; the UI then filters
  // client-side as the user types (not a live per-keystroke search).
  searchWarehouses: async (cityRef: string): Promise<NPWarehouse[]> => {
    const { data } = await httpClient.post<NPWarehouse[]>(
      "/api/v2/newpost/warehouse/by/city",
      { cityRef },
    );
    return data;
  },
};

// Ported from lib/app/networking/services/order_api.dart.
export const orderApi = {
  // POST /api/v2/order/web/save — only `data.number` is read from the
  // response in the Dart source; everything else in the response is ignored.
  save: async (order: OrderRequest): Promise<number> => {
    const { data } = await httpClient.post<{ number: number }>(
      "/api/v2/order/web/save",
      order,
    );
    return data.number;
  },

  // NOT ported — My Orders list/detail. Confirmed real endpoints added to
  // the Kotlin backend in this pass (see OrderController.getWebAll/getWebDetail).
  // Requires a logged-in user — the auth header is attached automatically
  // by the httpClient interceptor (see api/client.ts) whenever a real user
  // token is present.
  // `online` splits the customer's order history into two separate pages —
  // true for "Замовлення" (web/storefront checkout, the default — matches
  // the backend's own default so existing callers don't need to change),
  // false for "Мої покупки" (in-store sales staff linked to this client by
  // phone — see OrdersPage vs InStorePurchasesPage).
  getWebList: async (
    page = 1,
    count = 10,
    online = true,
  ): Promise<PagedOrders> => {
    const { data } = await httpClient.get<PagedOrders>(
      "/api/v2/order/web/list",
      { params: { page, count, online } },
    );
    return data;
  },

  getWebDetail: async (number: string): Promise<OrderDetail> => {
    const { data } = await httpClient.get<OrderDetail>(
      `/api/v2/order/web/${number}`,
    );
    return data;
  },
};

// NOT ported — bonus/loyalty wallet. Confirmed real endpoints added to the
// Kotlin backend in this pass (see WalletController) — the balance-read
// endpoint (GET /api/v2/wallet) already existed and worked before this
// change, but nothing ever credited a balance or exposed transaction
// history until now (see the per-product `bonus` field on OptimizedProductModel).
export const walletApi = {
  getWallet: async (): Promise<WalletModel> => {
    const { data } = await httpClient.get<WalletModel>("/api/v2/wallet");
    return data;
  },

  getHistory: async (page = 1, count = 50): Promise<BonusTransaction[]> => {
    const { data } = await httpClient.get<BonusTransaction[]>(
      "/api/v2/wallet/history",
      { params: { page, count } },
    );
    return data;
  },
};

// Account auth — client (storefront customer) endpoints, tenant-scoped on
// the backend (see ClientAuthController.kt). Deliberately under
// /api/v2/client-auth/**, NOT /api/v2/auth/** — the latter is the
// master-DB admin/worker login (used by e.g. the admin panel/POS app) and
// customers were wrongly wired into it in an earlier pass; clients are a
// completely separate identity that only ever exists inside one store's
// own tenant database (see multitenancy notes in ClientEntity.kt on the
// backend). Also: naming it "/client-auth" rather than "/auth/client"
// deliberately avoids httpClient's interceptor skip-headers-under-"/auth"
// check (see api/client.ts) — these calls DO need the ProjectID header
// (and, once logged in, the client's own Authorization token), unlike the
// truly header-less endpoints under /auth.
export const authUserApi = {
  login: async (request: LoginRequest): Promise<UserTokenData> => {
    const { data } = await httpClient.post<UserTokenData>(
      "/api/v2/client-auth/login",
      request,
    );
    return data;
  },

  // No longer returns a token directly — registration now requires a
  // second "verify your email" step (see verifyRegistrationEmail below).
  register: async (request: RegisterRequest): Promise<RegisterResponse> => {
    const { data } = await httpClient.post<RegisterResponse>(
      "/api/v2/client-auth/register",
      request,
    );
    return data;
  },

  // Step 2 of registration — submits the 6-digit code emailed after
  // register(). Success returns a real token, logging the user in.
  verifyRegistrationEmail: async (
    request: RegisterVerifyRequest,
  ): Promise<UserTokenData> => {
    const { data } = await httpClient.post<UserTokenData>(
      "/api/v2/client-auth/verify-registration-email",
      request,
    );
    return data;
  },

  resendVerificationEmail: async (
    request: ResendVerificationRequest,
  ): Promise<ResendVerificationResponse> => {
    const { data } = await httpClient.post<ResendVerificationResponse>(
      "/api/v2/client-auth/resend-verification-email",
      request,
    );
    return data;
  },

  forgotPassword: async (
    request: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> => {
    const { data } = await httpClient.post<ForgotPasswordResponse>(
      "/api/v2/client-auth/forgot-password",
      request,
    );
    return data;
  },

  verifyEmailCode: async (
    request: VerifyEmailCodeRequest,
  ): Promise<VerifyEmailCodeResponse> => {
    const { data } = await httpClient.post<VerifyEmailCodeResponse>(
      "/api/v2/client-auth/verify-reset-code",
      request,
    );
    return data;
  },

  resetPassword: async (
    request: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> => {
    const { data } = await httpClient.post<ResetPasswordResponse>(
      "/api/v2/client-auth/reset-password",
      request,
    );
    return data;
  },

  // Phone login — see PhoneLoginDialog. checkPhone tells the UI which form
  // to render next; loginByPhone/setPasswordByPhone mirror login()/register()
  // but keyed by phone instead of email (see api/types.ts doc comments).
  checkPhone: async (
    request: CheckPhoneRequest,
  ): Promise<CheckPhoneResponse> => {
    const { data } = await httpClient.post<CheckPhoneResponse>(
      "/api/v2/client-auth/check-phone",
      request,
    );
    return data;
  },

  loginByPhone: async (
    request: LoginByPhoneRequest,
  ): Promise<UserTokenData> => {
    const { data } = await httpClient.post<UserTokenData>(
      "/api/v2/client-auth/login-by-phone",
      request,
    );
    return data;
  },

  setPasswordByPhone: async (
    request: SetPasswordByPhoneRequest,
  ): Promise<UserTokenData> => {
    const { data } = await httpClient.post<UserTokenData>(
      "/api/v2/client-auth/set-password-by-phone",
      request,
    );
    return data;
  },

  // NOT ported — profile fetch/update + change-password. Confirmed real
  // endpoints added to the Kotlin backend in this pass (see
  // ClientAuthController /me, /change-password) — previously the account
  // screen/settings form only ever showed locally-cached name/email
  // captured at login time and never actually persisted edits (see
  // AuthContext.userDisplay comments).
  me: async (): Promise<UserProfile> => {
    const { data } = await httpClient.get<UserProfile>(
      "/api/v2/client-auth/me",
    );
    return data;
  },

  updateMe: async (request: UpdateProfileRequest): Promise<UserProfile> => {
    const { data } = await httpClient.put<UserProfile>(
      "/api/v2/client-auth/me",
      request,
    );
    return data;
  },

  changePassword: async (
    request: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> => {
    const { data } = await httpClient.post<ChangePasswordResponse>(
      "/api/v2/client-auth/change-password",
      request,
    );
    return data;
  },
};
