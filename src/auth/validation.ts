// NOT ported from Dart — no register/reset-password validation exists there
// to port. Reasonable, standard baseline rules for a fresh feature.
export function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// 8, not 6 — matches the backend's MIN_PASSWORD_LENGTH (see
// ClientAuthController.kt on the backend). This used to under-validate:
// a 6-7 char password looked fine here but the backend rejected it with
// WEAK_PASSWORD, so register/reset-password could fail after the user had
// already filled out the whole form.
export function isPasswordValid(password: string): boolean {
  return password.length >= 8;
}
