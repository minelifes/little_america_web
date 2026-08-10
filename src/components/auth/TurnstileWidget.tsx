import { useEffect, useRef } from "react";
import { TURNSTILE_SITE_KEY } from "../../api/constants";

// Cloudflare Turnstile captcha widget, shown on the login/register forms as
// a bot-mitigation layer alongside the backend's per-IP rate limiting (see
// RateLimitFilter.kt / TurnstileService.kt on the backend). While
// TURNSTILE_SITE_KEY stays a placeholder (see api/constants.ts), this
// renders nothing and onVerify is never called — forms still submit fine
// since the backend's captcha check no-ops until its matching secret key is
// also set.
declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js";
let scriptLoadingPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (scriptLoadingPromise) return scriptLoadingPromise;
  scriptLoadingPromise = new Promise((resolve) => {
    const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
  return scriptLoadingPromise;
}

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

export default function TurnstileWidget({ onVerify, onExpire }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || TURNSTILE_SITE_KEY.startsWith("PLACEHOLDER") || !containerRef.current) return;
    let cancelled = false;

    loadTurnstileScript().then(() => {
      if (cancelled || !window.turnstile || !containerRef.current) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: onVerify,
        "expired-callback": onExpire,
      });
    });

    return () => {
      cancelled = true;
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
    // Widget is rendered once on mount; onVerify/onExpire are read via the
    // latest closure at render time, no need to re-render the widget itself
    // if the parent's handler identity changes between renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!TURNSTILE_SITE_KEY || TURNSTILE_SITE_KEY.startsWith("PLACEHOLDER")) return null;

  return <div ref={containerRef} style={{ margin: "4px 0" }} />;
}
