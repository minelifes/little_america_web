import type { AxiosInstance } from "axios";
import type { TokenData, UserTokenData } from "./types";

// Ported from lib/app/networking/services/http.dart (TokenInterceptor) +
// lib/app/networking/services/auth_api.dart (AuthApi.websiteLogin) +
// lib/app/networking/payload/requests/web_auth_request.dart
//
// The Flutter app exchanges a static, per-project client token for a
// short-lived Bearer token via POST /api/v2/auth/website, caches it
// (SharedPreferences + an in-memory SessionStorage singleton), and attaches
// it to every request except calls under /auth itself (to avoid recursion
// when fetching the token).
//
// NOTE: this PROJECT_TOKEN is a client-side "app secret" — it's already
// shipped inside the compiled Flutter web bundle (anyone can extract it from
// the JS/wasm output), so embedding it here doesn't expose anything that
// wasn't already public. It authenticates the *app*, not a user.
const PROJECT_ID = "little_america";
const PROJECT_TOKEN = "FPe8PnefrjYRrJALe4sQyfSC5qwqvUM6AMzzBEmPGMwKjyuApwEazjyXfdwsqD5=";

// Refetch slightly before actual expiry so an in-flight request never races
// a token that expires mid-flight.
const EXPIRY_BUFFER_MS = 2000;

// A tiny in-memory + localStorage cache, factored out so the anonymous
// "website" token and the logged-in user's token (see below) can each get
// their own independent slot with the same read/write/clear behavior.
//
// `write` optionally accepts `persist: false` — backing the "Зберегти
// данні" (remember me) checkbox on the login screen: unchecked, the token
// goes to sessionStorage instead (cleared when the tab closes) rather than
// localStorage. Not from Dart; a reasonable/standard interpretation of that
// checkbox since it's a purely client-side storage choice.
function createTokenStore<T extends { expire: number }>(storageKey: string) {
  let memory: T | null = null;

  const read = (): T | null => {
    if (memory) return memory;
    try {
      const raw = localStorage.getItem(storageKey) ?? sessionStorage.getItem(storageKey);
      if (!raw) return null;
      memory = JSON.parse(raw) as T;
      return memory;
    } catch {
      return null;
    }
  };

  const write = (data: T, persist = true) => {
    memory = data;
    try {
      if (persist) {
        localStorage.setItem(storageKey, JSON.stringify(data));
        sessionStorage.removeItem(storageKey);
      } else {
        sessionStorage.setItem(storageKey, JSON.stringify(data));
        localStorage.removeItem(storageKey);
      }
    } catch {
      // localStorage/sessionStorage can throw in private-browsing/quota-
      // exceeded cases — the in-memory cache still works for the rest of
      // the session.
    }
  };

  const clear = () => {
    memory = null;
    try {
      localStorage.removeItem(storageKey);
      sessionStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  };

  const isValid = (data: T | null): data is T => !!data && data.expire > Date.now() + EXPIRY_BUFFER_MS;

  return { read, write, clear, isValid };
}

const websiteTokenStore = createTokenStore<TokenData>("TokenData");

// NEW — not from Dart (no user-login flow exists in the Flutter source at
// all). Kept in a storage slot separate from the anonymous website token so
// "is someone logged in" is unambiguous, and so a logged-out visitor keeps
// working against the anonymous session exactly as before. See
// getValidToken() below for how the two interact.
const userTokenStore = createTokenStore<UserTokenData>("UserTokenData");

let pendingFetch: Promise<TokenData | null> | null = null;

async function requestNewWebsiteToken(client: AxiosInstance): Promise<TokenData | null> {
  try {
    const { data } = await client.post<TokenData>("/api/v2/auth/website", {
      project: PROJECT_ID,
      token: PROJECT_TOKEN,
    });
    websiteTokenStore.write(data);
    return data;
  } catch {
    return null;
  }
}

/**
 * Returns a valid Bearer token, preferring a logged-in user's token over the
 * anonymous website token when both are present and valid. Fetches (and
 * caches) a fresh website token if neither is available — same as before
 * user auth existed. If a user's token has expired, this quietly falls back
 * to the anonymous website token rather than blocking requests (there's no
 * refresh-token endpoint to renew a user session, so an expired login just
 * degrades to logged-out access instead of breaking the app).
 */
export async function getValidToken(client: AxiosInstance): Promise<string | null> {
  const cachedUser = userTokenStore.read();
  if (userTokenStore.isValid(cachedUser)) return cachedUser.token;

  const cachedWebsite = websiteTokenStore.read();
  if (websiteTokenStore.isValid(cachedWebsite)) return cachedWebsite.token;

  if (!pendingFetch) {
    pendingFetch = requestNewWebsiteToken(client).finally(() => {
      pendingFetch = null;
    });
  }
  const fresh = await pendingFetch;
  return fresh?.token ?? null;
}

export function clearCachedToken() {
  websiteTokenStore.clear();
}

/** Stores the token returned by a successful login/register response, replacing whatever was previously used for API auth (anonymous or a prior session). `remember: false` keeps it session-only (see createTokenStore). */
export function setUserToken(data: UserTokenData, remember = true) {
  userTokenStore.write(data, remember);
}

export function clearUserToken() {
  userTokenStore.clear();
}

export function hasValidUserToken(): boolean {
  return userTokenStore.isValid(userTokenStore.read());
}

export const AUTH_HEADERS_PROJECT_ID = PROJECT_ID;
