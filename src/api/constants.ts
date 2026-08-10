// Ported 1:1 from lib/config/constants.dart
export const REST_API_URL = "https://api.sseller.online/";
// export const REST_API_URL = "http://localhost:8282";
export const CDN_URL = "https://cdn.sseller.online/";

// Category images use a separate fixed storage domain — ported as-is from
// CategoryItemWidget in lib/resources/widgets/categories/category_item_widget.dart
export const CATEGORY_STORAGE_URL = "https://storage.littleamerica.store";

export const prepareImageUrl = (url: string): string => `${CDN_URL}${url}`;

/** Builds a storage.littleamerica.store URL regardless of whether `url` already has a leading slash. */
export const storageImageUrl = (url: string): string =>
  `${CATEGORY_STORAGE_URL}${url.startsWith("/") ? "" : "/"}${url}`;

// PLACEHOLDER — Cloudflare Turnstile site key for the login/register captcha
// widget (see components/auth/TurnstileWidget.tsx). Get the real value from
// the Cloudflare dashboard: Turnstile -> Add site -> "Site Key" (the
// matching "Secret Key" goes in the backend's turnstile.secret-key
// property, not here). While this stays a placeholder, TurnstileWidget
// renders nothing and forms submit without a captcha token — the backend
// no-ops the check the same way until its secret key is also set, so
// nothing breaks before real keys exist.
export const TURNSTILE_SITE_KEY = "0x4AAAAAAEHKKkY1XUte-GT8";
