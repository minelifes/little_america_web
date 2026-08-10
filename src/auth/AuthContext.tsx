import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { clearUserToken, hasValidUserToken, setUserToken } from "../api/auth";
import type { UserTokenData } from "../api/types";

// NOT ported from Dart — no login/register/reset-password UI or bloc exists
// anywhere in the Flutter source (see the "Account auth" block in
// api/types.ts). Designed fresh from the reference screenshots, following
// the same open/close-drawer pattern already used by CartContext.

export type AuthScreen =
  | "login"
  | "register"
  | "registerVerify"
  | "forgotEmail"
  | "forgotCode"
  | "forgotNewPassword"
  | "account";

interface UserDisplay {
  name?: string;
  email: string;
  /** NOT part of the login/register response — only ever set locally via the
   * settings page's profile form (see AccountSettingsPage), since no
   * update-profile endpoint exists to fetch/save it against the server. */
  phone?: string;
}

const USER_DISPLAY_STORAGE_KEY = "AuthUserDisplay";

interface AuthContextValue {
  isLoggedIn: boolean;
  /** Name/email shown in the account screen — captured client-side from the
   * login/register form on success, NOT returned by either endpoint (both
   * only return a token) and NOT re-verified against the server on reload. */
  userDisplay: UserDisplay | null;

  isOpen: boolean;
  screen: AuthScreen;
  open: (screen?: AuthScreen) => void;
  close: () => void;
  goTo: (screen: AuthScreen) => void;

  /** Called by LoginScreen/RegisterScreen after a successful API call — replaces the cached bearer token with the one from the response and marks the session as logged in. `remember: false` (login screen's "Зберегти данні" unchecked) keeps the session in sessionStorage instead of localStorage. */
  onAuthSuccess: (token: UserTokenData, user: UserDisplay, remember?: boolean) => void;
  logout: () => void;
  /** Merges a patch into userDisplay and re-persists it — used by the
   * settings page's "ЗБЕРЕГТИ" action. Local-only (see UserDisplay.phone). */
  updateUserDisplay: (patch: Partial<UserDisplay>) => void;

  /** Transient state carried across the forgot-password step sequence
   * (email -> code -> new password) so it survives screen switches without
   * prop-drilling through the drawer. */
  resetEmail: string;
  setResetEmail: (email: string) => void;
  resetHash: string;
  setResetHash: (hash: string) => void;

  /** Carried from RegisterScreen to RegisterVerifyScreen — the email the verification code was sent to. */
  registerEmail: string;
  setRegisterEmail: (email: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readUserDisplay(): UserDisplay | null {
  try {
    const raw = localStorage.getItem(USER_DISPLAY_STORAGE_KEY) ?? sessionStorage.getItem(USER_DISPLAY_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserDisplay) : null;
  } catch {
    return null;
  }
}

// Mirrors the token's own persist/session split (see api/auth.ts) so a
// non-"remembered" login doesn't leave a stale greeting behind in
// localStorage after its session-only token has already expired/cleared.
function writeUserDisplay(user: UserDisplay | null, persist = true) {
  try {
    localStorage.removeItem(USER_DISPLAY_STORAGE_KEY);
    sessionStorage.removeItem(USER_DISPLAY_STORAGE_KEY);
    if (user) (persist ? localStorage : sessionStorage).setItem(USER_DISPLAY_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // ignore (private browsing / quota)
  }
}

function detectPersistMode(): boolean {
  try {
    if (localStorage.getItem(USER_DISPLAY_STORAGE_KEY)) return true;
    if (sessionStorage.getItem(USER_DISPLAY_STORAGE_KEY)) return false;
  } catch {
    // ignore
  }
  return true;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(hasValidUserToken);
  const [userDisplay, setUserDisplayState] = useState<UserDisplay | null>(readUserDisplay);
  const [persistSession, setPersistSession] = useState(detectPersistMode);
  const [isOpen, setIsOpen] = useState(false);
  const [screen, setScreen] = useState<AuthScreen>("login");
  const [resetEmail, setResetEmail] = useState("");
  const [resetHash, setResetHash] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoggedIn,
      userDisplay,
      isOpen,
      screen,
      open: (initialScreen) => {
        setScreen(initialScreen ?? (isLoggedIn ? "account" : "login"));
        setIsOpen(true);
      },
      close: () => setIsOpen(false),
      goTo: setScreen,
      onAuthSuccess: (token, user, remember = true) => {
        setUserToken(token, remember);
        writeUserDisplay(user, remember);
        setUserDisplayState(user);
        setPersistSession(remember);
        setIsLoggedIn(true);
        setScreen("account");
        setIsOpen(false);
      },
      logout: () => {
        clearUserToken();
        writeUserDisplay(null);
        setUserDisplayState(null);
        setIsLoggedIn(false);
        setScreen("login");
        setIsOpen(false);
      },
      updateUserDisplay: (patch) => {
        setUserDisplayState((prev) => {
          if (!prev) return prev;
          const next = { ...prev, ...patch };
          writeUserDisplay(next, persistSession);
          return next;
        });
      },
      resetEmail,
      setResetEmail,
      resetHash,
      setResetHash,
      registerEmail,
      setRegisterEmail,
    }),
    [isLoggedIn, userDisplay, isOpen, screen, resetEmail, resetHash, registerEmail, persistSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
