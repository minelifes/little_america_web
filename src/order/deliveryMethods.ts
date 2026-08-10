import type { DeliveryMethod } from "../api/types";

// Ported from lib/app/models/delivery_method.dart — plain id/name constants,
// not a real enum in the Dart source either. Order kept exactly as the
// dropdown lists them there: Самовивіз, Нова Пошта, Укрпошта (non-sequential
// ids 3, 1, 2 — preserved for parity even though it looks odd).
export const SELF_PICKUP_ID = 3;
export const NOVA_POST_ID = 1;
export const UKR_POST_ID = 2;

export const DELIVERY_METHODS: DeliveryMethod[] = [
  { id: SELF_PICKUP_ID, name: "Самовивіз з магазину (м. Луцьк)" },
  { id: NOVA_POST_ID, name: "Нова Пошта" },
  { id: UKR_POST_ID, name: "Укрпошта" },
];
