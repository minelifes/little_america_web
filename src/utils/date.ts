// NOT ported — the backend returns order/bonus timestamps as plain
// ISO-8601 instants (see api/types.ts OrderDetail.createdAt / BonusTransaction.date);
// formatting into the Ukrainian "2 Жовтня 2023 12:00" style used throughout
// the account pages' receipt views is a frontend concern, kept in one place
// so it's consistent everywhere it's used.

const UA_MONTHS = [
  "Січня", "Лютого", "Березня", "Квітня", "Травня", "Червня",
  "Липня", "Серпня", "Вересня", "Жовтня", "Листопада", "Грудня",
];

/** "2 Жовтня 2023 12:00" — falls back to the raw string if it isn't a parseable date. */
export function formatUkrainianDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const day = date.getDate();
  const month = UA_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year} ${hh}:${mm}`;
}

/** "2 Жовтня 12:33" — same as above without the year, for the more compact bonus-transaction row. */
export function formatUkrainianDateShort(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const day = date.getDate();
  const month = UA_MONTHS[date.getMonth()];
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${hh}:${mm}`;
}
