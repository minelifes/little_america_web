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
