import type { UserTokenData } from "../api/types";

// The login/register response includes name/lastname (confirmed against the
// real backend) — prefer those over anything typed into the form, since
// they're the server's own record rather than whatever the person happened
// to type. `fallback` covers the (currently unconfirmed) case where the
// response omits them.
export function nameFromToken(token: UserTokenData, fallback?: string): string | undefined {
  const fromToken = [token.name, token.lastname].filter((part) => part && part.trim()).join(" ");
  return fromToken || fallback || undefined;
}
