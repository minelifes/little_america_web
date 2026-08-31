import { AsYouType } from "libphonenumber-js";

/**
 * Ukrainian mobile phone helpers built on libphonenumber-js.
 *
 * Replaces the previous hand-rolled `value.replace(/\D/g, "").slice(0, 9)`
 * logic, which silently dropped the true last digit whenever someone typed
 * the number the way people actually write it — with the leading 0
 * (e.g. "0501234567") — because it blindly kept the first 9 raw digits
 * instead of recognizing the leading 0 isn't part of the significant number.
 *
 * `AsYouType('UA')` correctly strips a leading 0 (and also handles a pasted
 * "+380..." or "380..." prefix) and formats the number with spaces as the
 * user types, e.g. "0501234567" -> "050 123 4567".
 *
 * The *stored* value (PersonalData.phone) stays the raw 9-digit significant
 * number only — no spaces, no leading 0, no country code — matching
 * order_user_data.dart / phone_widget.dart's contract exactly
 * (`FilteringTextInputFormatter.digitsOnly`, `maxLength: 9`), so the order
 * submission payload needs no changes.
 */
const UA_NATIONAL_DIGITS = 9;

/** Parses arbitrary user input into the raw 9-digit national number. */
export function parsePhoneDigits(raw: string): string {
  const formatter = new AsYouType("UA");
  formatter.input(raw);
  const number = formatter.getNumber();
  return (number?.nationalNumber ?? "").slice(0, UA_NATIONAL_DIGITS);
}

/** Formats a stored raw national number back into a spaced display string. */
export function formatPhoneDisplay(nationalDigits: string): string {
  if (!nationalDigits) return "";
  return new AsYouType("UA").input(`0${nationalDigits}`);
}

/**
 * Converts the stored raw 9-digit national number into the full "+380..."
 * international (E.164) form the backend should actually store.
 *
 * BUG FIX: every place that sends a phone number to the backend (checkout,
 * register, phone login/check) used to send the bare 9-digit value straight
 * from state — no "+380", no leading 0. That's fine for *lookups* (the
 * backend's ClientService.findByPhone matches on the last 9 digits
 * regardless of format — see its doc comment), but registration/checkout
 * both *store* whatever string is sent as ClientEntity.phone verbatim. A
 * client created through this site therefore ended up with a phone number
 * that had no country code at all, unlike clients created through the admin
 * app (which always sends full "+380..." via its own PhoneField widget) —
 * an inconsistency that matters for anything that needs a real, dialable
 * number (SMS/WhatsApp/Viber notifications, the PRRO fiscal check, etc.),
 * not just for matching. Call this at the point a phone is actually sent to
 * the API — the stored/displayed state itself stays the plain 9-digit form
 * the rest of this file (and the UI) already expects.
 */
export function toE164(nationalDigits: string): string {
  return nationalDigits ? `+380${nationalDigits}` : "";
}
