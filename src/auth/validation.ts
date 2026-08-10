// NOT ported from Dart — no register/reset-password validation exists there
// to port. Reasonable, standard baseline rules for a fresh feature.
export function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isPasswordValid(password: string): boolean {
  return password.length >= 6;
}
