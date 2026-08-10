import axios from "axios";
import { REST_API_URL } from "./constants";
import { AUTH_HEADERS_PROJECT_ID, getValidToken } from "./auth";

// Ported from lib/app/networking/services/http.dart
export const httpClient = axios.create({
  baseURL: REST_API_URL,
  // Without a timeout, a hung/CORS-blocked request never settles and the
  // page's skeletons sit there indefinitely, which reads as a freeze.
  timeout: 10000,
});

// Ported from TokenInterceptor in lib/app/networking/services/http.dart:
// every request except calls under /auth gets a Bearer token attached,
// fetching/caching one first if needed.
httpClient.interceptors.request.use(async (config) => {
  if (config.url?.includes("/auth")) {
    return config;
  }

  const token = await getValidToken(httpClient);
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
    config.headers.set("ProjectID", AUTH_HEADERS_PROJECT_ID);
    config.headers.set("Accept", "application/json");
    config.headers.set("Content-Type", "application/json");
  }
  // Ported behavior: if the token fetch fails, the original Dart
  // interceptor swallows the error and still sends the request (without
  // auth headers) rather than blocking it — same here.
  return config;
});
