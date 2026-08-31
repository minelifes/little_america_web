// Ported from lib/app/models/*.dart

export interface ImageModel {
  id: string;
  isMain: boolean;
  url: string;
}

export interface NewsModel {
  id: number;
  image: ImageModel;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  bg1: string;
  // A single color means a solid (90%-opacity) background; two colors mean
  // a gradient between them — see SliderItem.
  bg2?: string;
  link?: string | null;
}

export interface CategoryModel {
  id: number;
  // Parent category id — null/undefined means this is a top-level (master)
  // category. Normalized in categoryApi.getCategories() from whatever shape
  // the API actually returns (a raw `pid`, or a nested `parent` object).
  pid: number | null;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  visible: boolean;
  image: ImageModel;
}

/** Raw shape as it may come back from the API, before normalization. */
export interface RawCategoryModel extends Omit<CategoryModel, "pid"> {
  pid?: number | null;
  parentId?: number | null;
  parent?: { id: number } | null;
}

export interface OptimizedProductModel {
  id: number;
  title: string;
  searchTitle: string;
  keywords: string;
  subTitle: string;
  image: string;
  content: string;
  contentDeltas: string;
  discount: number;
  shipmentSoon: boolean;
  published: boolean;
  isInStore: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  price: number;
  leftCount: number;
  // Confirmed real field — ProductEntity.bonus / OptimizedProductEntity.bonus
  // on the backend (added in this pass; admin sets it per-product, drives
  // WalletService bonus crediting on checkout). Still optional/defensive
  // since older cached responses or products with bonus=0 may omit/zero it.
  bonus?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  total: number;
}

// Ported from lib/app/models/product.dart — the full product-detail shape
// (as opposed to OptimizedProductModel, the lighter one used in list/grid
// views). Trimmed to the fields the product page actually renders.
export interface ProductModel {
  id: number;
  title: string;
  searchTitle: string;
  keywords: string;
  subTitle: string;
  category: CategoryModel;
  images: ImageModel[];
  content: string;
  contentDeltas: string;
  discount: number;
  isInStore: boolean;
  createdAt: string;
  updatedAt: string;
  price: number;
  /** Bonus/loyalty points this product earns when purchased — see WalletService on the backend. 0/absent means no bonus. */
  bonus?: number;
}

// Ported from lib/app/models/cart_item.dart. Variant/"smell" selection
// (size/color/flavor) isn't ported yet, so identity is just the product id.
export interface CartItem {
  productId: number;
  productTitle: string;
  productPrice: number;
  productImage: string;
  count: number;
  discount: number;
  sum: number;
}

// Ported from lib/app/models/token_data.dart
export interface TokenData {
  token: string;
  /** Epoch milliseconds. */
  expire: number;
}

// NOT ported from Dart — no equivalent exists. The Flutter source's
// SearchRequest (lib/app/networking/payload/requests/search_request.dart)
// has only a `text` field, and TopProductPage's filter UI is dead code (the
// icon's onPressed is a no-op and the filter panel widget tree is fully
// commented out). Backs the real POST /api/v2/product/optimized/filter
// endpoint (ProductFilterRequest on the Kotlin side) — see productApi.search
// in ./services.ts. "popularity" has no backing metric on the server yet and
// currently falls back to the same "recently added" default order as no
// sort at all.
export interface SearchFilters {
  text?: string;
  /** Products are assigned to leaf/subcategory ids, never to a parent
   * category's own id — the filter panel's tabs only show parents, so this
   * must be the parent id plus every descendant id (see
   * getSelfAndDescendantIds in ./categoryTree), not just the tapped tab's id. */
  categoryIds?: number[];
  /** brands.id is a UUID string on the backend (BrandEntity), not a number. */
  brandId?: string;
  sort?: "popularity" | "cheap" | "new" | "expensive";
  minPrice?: number;
  maxPrice?: number;
}

// NOT ported from Dart — no brand model exists in the Flutter source.
// Confirmed real shape from BrandEntity (Kotlin): id is a UUID string
// (not a number), backed by GET /api/v2/brands/ — see brandApi in ./services.ts.
export interface BrandModel {
  id: string;
  name: string;
}

// ---- Checkout / order — ported from lib/app/models/{delivery_method,client,order}.dart ----

// Ported from lib/app/models/delivery_method.dart — plain id/name pairs, not
// a real enum in the Dart source either. Non-sequential ids (3,1,2) kept
// exactly as-is for parity.
export interface DeliveryMethod {
  id: number;
  name: string;
}

// Ported from the live (non-commented-out) shape in lib/app/networking/services/np_api.dart.
export interface NPCityInfo {
  id: string;
  npRef: string;
  npDeliveryCity: string;
  title: string;
  titleRu: string;
  area: string;
}

export interface NPWarehouse {
  id: string;
  ref: string;
  title: string;
  titleRu: string;
  shortAddress: string;
  shortAddressRu: string;
  typeOfWarehouse: string;
  siteKey: string;
}

// Ported from lib/app/models/client.dart. middlename/sex/birthday are
// collected nowhere in the Dart UI either (always "" / 0) — kept only
// because the order-save endpoint expects them.
export interface ClientModel {
  name: string;
  lastname: string;
  middlename: string;
  phone: string;
  email?: string;
  npCity?: NPCityInfo;
  npWarehouse?: NPWarehouse;
  ukrpostCity?: string;
  ukrpostArea?: string;
  ukrpostDistrict?: string;
  ukrpostIndex?: string;
  sex: number;
  birthday: number;
}

// Ported from CartItem.toDetailModel() in lib/app/models/cart_item.dart.
// Note the API key is "product" (the productId), not "productId".
export interface OrderDetailModel {
  product: number;
  count: number;
  isPresent: boolean;
  promoDiscount: number;
  promocode?: string;
  smellTitle?: string;
}

// Ported from OrderModel.toJson() in lib/app/models/order.dart — the exact
// body POSTed to /api/v2/order/web/save.
export interface OrderRequest {
  orderDetails: OrderDetailModel[];
  client: ClientModel;
  globalDiscount: number;
  promocodeId?: number;
  deliveryMethod: DeliveryMethod;
  desires: string;
  sum: number;
}

// ---- Account auth (login/register/reset-password) ----
//
// NOT ported from Dart: grepped the whole Flutter source (lib/app/networking/
// services/auth_api.dart etc.) — /api/v2/auth/login exists but is never
// actually called by any screen/bloc (its response is read as an untyped
// `Map<String, dynamic>`), and there's no register/forgot-password/
// verify-code endpoint anywhere at all. The endpoints and shapes below are
// exactly what the user specified directly (not guessed). The login/register
// response was originally assumed to be just {token, expire} (TokenData's
// shape) — confirmed against the real backend to also include name/lastname.

export interface UserTokenData {
  token: string;
  /** Epoch milliseconds. */
  expire: number;
  name?: string;
  lastname?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  /** Cloudflare Turnstile widget token — see components/auth/TurnstileWidget.tsx. Empty/omitted is fine until a real site/secret key pair is configured (backend no-ops the check until then). */
  captchaToken?: string;
}

// All six fields are required by the backend (AuthController.register
// validates and rejects a request with any blank field) — RegisterScreen
// now collects lastName/middleName/phone too, not just name/email/password.
export interface RegisterRequest {
  name: string;
  lastName: string;
  middleName: string;
  /** Raw 9-digit national number, no leading 0/country code — same convention as checkout's ClientModel.phone (see order/phone.ts). */
  phone: string;
  email: string;
  password: string;
  /** Cloudflare Turnstile widget token — see LoginRequest.captchaToken. */
  captchaToken?: string;
}

// Registration no longer logs the user in directly — it now requires a
// second step (email verification, see RegisterVerifyRequest below), so
// /auth/register returns this instead of a token.
export interface RegisterResponse {
  requiresVerification: boolean;
  email: string;
  message: string;
}

// Step 2 of registration — the 6-digit code emailed after /auth/register.
// Mirrors the shape of VerifyEmailCodeRequest (forgot-password's step 2)
// but posts to a different endpoint and, on success, returns a real
// UserTokenData (logging the user in) instead of a hash.
export interface RegisterVerifyRequest {
  email: string;
  code: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

// The "code verification" step itself (entering the code the user was
// emailed) has no Dart or screenshot precedent — the user asked for it to be
// inserted between the "enter email" and "set new password" screens, and
// gave this exact endpoint/response contract for it.
export interface VerifyEmailCodeRequest {
  email: string;
  code: string;
}

export interface VerifyEmailCodeResponse {
  valid: boolean;
  /** Short-lived proof-of-verification token, passed to resetPassword. */
  hash: string;
}

export interface ResetPasswordRequest {
  hash: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// Phone login — a separate path from the email login above, for accounts
// staff created via the admin app's order-editor phone-connect field (see
// backend ClientPhoneCheckField), which start out with no password set.
// Deliberately no OTP/SMS step (explicit product decision — see
// ClientAuthController.setPasswordByPhone's doc comment on the backend):
// checkPhone tells the UI which of the two forms below to show.
export interface CheckPhoneRequest {
  phone: string;
}

export interface CheckPhoneResponse {
  exists: boolean;
  hasPassword: boolean;
}

export interface LoginByPhoneRequest {
  phone: string;
  password: string;
  captchaToken?: string;
}

// Only succeeds once, for an account that has never had a password (see
// backend doc comment) — not a general "reset password by phone".
export interface SetPasswordByPhoneRequest {
  phone: string;
  password: string;
  captchaToken?: string;
}

// ---- Account: profile / orders / bonuses ----
//
// NOT ported from Dart. Backed by real endpoints added to the Kotlin
// backend in this pass: GET/PUT /api/v2/client-auth/me, POST /api/v2/client-auth/change-password,
// GET /api/v2/order/web/list, GET /api/v2/order/web/{number},
// GET /api/v2/wallet, GET /api/v2/wallet/history. Shapes mirror the
// backend's CustomerOrderDto.kt / BonusTransactionDto exactly.

/** Mirrors the backend's ClientProfileDto (see ClientAuthController.kt). */
export interface UserProfile {
  id: string;
  name: string;
  lastname: string;
  middlename: string;
  email: string;
  phone: string;
}

export interface UpdateProfileRequest {
  name?: string;
  lastName?: string;
  middleName?: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export type OrderStatus = "pending" | "shipping" | "arrived" | "done";

export interface OrderLineItem {
  title: string;
  variant: string;
  count: number;
  price: number;
  /** Relative storage path — wrap with storageImageUrl() before rendering, same as every other product image in this app. */
  image: string;
  bonusPoints?: number;
}

export interface OrderSummary {
  number: string;
  items: OrderLineItem[];
  sum: number;
  status: OrderStatus;
}

export interface OrderDelivery {
  phone: string;
  fullName: string;
  address: string;
  declarationNumber: string;
}

/** Payment breakdown for the downloadable PDF receipt (see receiptPdf.ts,
 * which mirrors the admin app's thermal-printer receipt's card/cash rows).
 * `type` / cash* / card* fields come from the order's bill — null `type`
 * means there's no bill at all (e.g. a certificate covered the full sum).
 * `certificateSum` is independent of `type`: a certificate can cover part
 * of an order with the remainder paid by card/cash, so both can be
 * non-null at once. */
export interface OrderPayment {
  type: "cash" | "card" | null;
  cashInput: number | null;
  cashOutput: number | null;
  cardSum: number | null;
  cardNumber: string | null;
  terminalId: string | null;
  authCode: string | null;
  rrn: string | null;
  billNumber: string | null;
  certificateSum: number | null;
}

export interface OrderDetail extends OrderSummary {
  /** ISO-8601 instant — format with formatUkrainianDateTime() from utils/date. */
  createdAt: string;
  /** Always 0 for now — OrderEntity has no persisted delivery-fee column on the backend yet. */
  deliveryFee: number;
  bonusesEarned: number;
  delivery: OrderDelivery;
  /** true = placed through this storefront's checkout ("Замовлення"), false
   * = an in-store sale linked to this client by phone ("Мої покупки" — see
   * OrderEntity.online on the backend). ReceiptView uses this to hide
   * delivery/TTN UI that doesn't apply to an in-store sale. */
  isOnline: boolean;
  payment: OrderPayment;
}

export interface PagedOrders {
  items: OrderSummary[];
  page: number;
  totalPages: number;
}

export interface BonusTransaction {
  orderNumber: string;
  /** ISO-8601 instant — format with formatUkrainianDateTime() from utils/date. */
  date: string;
  points: number;
  type: string;
  amount: number;
}

export interface WalletModel {
  id: string;
  userId: string;
  balance: number;
}
