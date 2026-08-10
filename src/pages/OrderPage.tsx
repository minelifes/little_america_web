import { useState } from "react";
import Box from "@mui/material/Box";
import { Navigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import GradientLine from "../components/common/GradientLine";
import CartStep from "../components/order/CartStep";
import OrderUserDataStep, {
  emptyPersonalData,
} from "../components/order/OrderUserDataStep";
import type { PersonalData } from "../components/order/OrderUserDataStep";
import OrderDeliveryStep, {
  emptyDeliveryData,
} from "../components/order/OrderDeliveryStep";
import type { DeliveryData } from "../components/order/OrderDeliveryStep";
import OrderSummary from "../components/order/OrderSummary";
import OrderConfirmation from "../components/order/OrderConfirmation";
import { useCart } from "../cart/CartContext";
import { orderApi } from "../api/services";
import { estimateDeliveryFee } from "../order/deliveryFee";
import { DELIVERY_METHODS, UKR_POST_ID } from "../order/deliveryMethods";
import { ROUTES } from "../routes";
import { scrollToTop } from "../utils/scroll";
import type { OrderRequest } from "../api/types";

const STEPS = ["КОШИК", "ОФОРМЛЕННЯ ДАННИХ", "ДОСТАВКА ТА ОПЛАТА"];

// Ported from lib/resources/pages/order_page/order_page.dart — the 2-step
// wizard (OrderUserData / OrderAddress) and its exact validation, plus a
// step 0 ("КОШИК") that doesn't exist in the Dart source at all (Flutter
// only has the CartDrawer, whose checkout button navigates straight here —
// see CartStep.tsx for why this step was added fresh). "Спосіб оплати" on
// step 2 and the invented delivery fee are also new — see
// OrderDeliveryStep.tsx / order/deliveryFee.ts for why.
export default function OrderPage() {
  const cart = useCart();
  const [step, setStep] = useState(0);
  const [personal, setPersonal] = useState<PersonalData>(emptyPersonalData);
  const [delivery, setDelivery] = useState<DeliveryData>(emptyDeliveryData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [confirmationImages, setConfirmationImages] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const subtotal = cart.items.reduce((sum, i) => sum + i.sum, 0);
  const deliveryFee = estimateDeliveryFee(delivery.methodId);

  // Ported from OrderPage.initState()'s empty-cart guard — but only before
  // an order has actually been placed, since createOrder() clears the cart
  // right before flipping to the confirmation screen (so the confirmation
  // screen would otherwise immediately bounce itself back to home).
  if (cart.items.length === 0 && !orderNumber) {
    return <Navigate to={ROUTES.home} replace />;
  }

  const goToStep = (s: number) => {
    setStep(s);
    scrollToTop(true);
  };

  const handleSubmit = async () => {
    if (delivery.methodId === null) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const method = DELIVERY_METHODS.find((m) => m.id === delivery.methodId)!;
      const request: OrderRequest = {
        orderDetails: cart.items.map((i) => ({
          product: i.productId,
          count: i.count,
          isPresent: false,
          // No real promo-code system is wired up (see OrderUserDataStep) —
          // always 0, not the product's own sale discount (already baked
          // into `sum`/the item's displayed price).
          promoDiscount: 0,
        })),
        client: {
          name: personal.name,
          lastname: personal.lastname,
          middlename: "",
          phone: personal.phone,
          email: personal.email || undefined,
          npCity: delivery.npCity ?? undefined,
          npWarehouse: delivery.npWarehouse ?? undefined,
          ukrpostCity:
            delivery.methodId === UKR_POST_ID
              ? delivery.ukrpostCity
              : undefined,
          ukrpostArea:
            delivery.methodId === UKR_POST_ID
              ? delivery.ukrpostArea
              : undefined,
          ukrpostDistrict:
            delivery.methodId === UKR_POST_ID
              ? delivery.ukrpostDistrict
              : undefined,
          ukrpostIndex:
            delivery.methodId === UKR_POST_ID
              ? delivery.ukrpostIndex
              : undefined,
          sex: 0,
          birthday: 0,
        },
        globalDiscount: 0,
        deliveryMethod: method,
        desires: "",
        sum: subtotal,
      };
      const number = await orderApi.save(request);
      setConfirmationImages(cart.items.map((i) => i.productImage));
      cart.clear();
      setOrderNumber(String(number));
    } catch {
      setSubmitError("Не вдалося оформити замовлення. Спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      <Header />
      <Box component="main">
        <Box sx={{ height: { xs: 100, sm: 140 } }} />

        {orderNumber ? (
          <OrderConfirmation
            orderNumber={orderNumber}
            decorativeImages={confirmationImages}
          />
        ) : (
          <Box sx={{ px: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 1,
              }}
            >
              {STEPS.map((label, i) => (
                <Box key={label} sx={{ display: "flex", alignItems: "center" }}>
                  {i > 0 && (
                    <Box
                      component="span"
                      sx={{ mx: 1, color: "rgba(0,0,0,0.2)", fontSize: 13 }}
                    >
                      ›
                    </Box>
                  )}
                  <Box
                    component={i < step ? "button" : "span"}
                    onClick={i < step ? () => goToStep(i) : undefined}
                    sx={{
                      background: "none",
                      border: "none",
                      cursor: i < step ? "pointer" : "default",
                      p: 0,
                      fontFamily: "inherit",
                      fontSize: 13,
                      fontWeight: i === step ? 700 : 400,
                      letterSpacing: "0.5px",
                      color: i === step ? "#161616" : "rgba(0,0,0,0.4)",
                    }}
                  >
                    {label}
                  </Box>
                </Box>
              ))}
            </Box>

            <GradientLine padding="16px 0 36px 0" />

            {step === 0 && <CartStep onNext={() => goToStep(1)} />}

            {step > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                <Box sx={{ flex: "2 1 480px" }}>
                  {step === 1 && (
                    <OrderUserDataStep
                      value={personal}
                      onChange={setPersonal}
                      onNext={() => goToStep(2)}
                    />
                  )}
                  {step === 2 && (
                    <>
                      <OrderDeliveryStep
                        value={delivery}
                        onChange={setDelivery}
                        onBack={() => goToStep(1)}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                      />
                      {submitError && (
                        <Box sx={{ mt: 2, color: "#e53935", fontSize: 13 }}>
                          {submitError}
                        </Box>
                      )}
                    </>
                  )}
                </Box>
                <Box sx={{ flex: "1 1 320px" }}>
                  <OrderSummary
                    items={cart.items}
                    subtotal={subtotal}
                    deliveryFee={step === 2 ? deliveryFee : 0}
                  />
                </Box>
              </Box>
            )}

            <Box sx={{ height: 60 }} />
          </Box>
        )}
      </Box>

      <Footer />
    </Box>
  );
}
