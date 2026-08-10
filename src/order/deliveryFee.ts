import { NOVA_POST_ID } from "./deliveryMethods";

// NOT ported from Dart — no delivery-cost-calculation API exists anywhere in
// the source (grepped, confirmed absent; OrderModel/OrderDetailModel/
// ClientModel have no cost field at all). This is an invented static
// placeholder purely for the UI's total display, matching the target
// screenshots ("Нова Пошта від 40₴"). It is deliberately NOT added into the
// `sum` sent to POST /api/v2/order/web/save — that field mirrors Dart's
// real contract, which has no delivery-cost concept.
export function estimateDeliveryFee(methodId: number | null): number {
  return methodId === NOVA_POST_ID ? 40 : 0;
}
