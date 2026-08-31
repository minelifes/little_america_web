import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import ProductsPage from "./pages/ProductsPage";
import AboutUsPage from "./pages/AboutUsPage";
import ContactsPage from "./pages/ContactsPage";
import OrderPage from "./pages/OrderPage";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import OrdersPage from "./pages/OrdersPage";
import PurchasesPage from "./pages/PurchasesPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import BonusesPage from "./pages/BonusesPage";
import BonusDetailPage from "./pages/BonusDetailPage";
import ScrollToTop from "./components/common/ScrollToTop";
import { ROUTES } from "./routes";
import { useBonuses } from "./api/constants";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path={ROUTES.home} element={<HomePage />} />
        {/* Legacy alias for old Flutter-site URLs Google indexed (/products/:id, plural) — renders the same ProductPage as /product/:id. */}
        <Route path={`${ROUTES.productLegacy}:id`} element={<ProductPage />} />
        <Route path={ROUTES.products} element={<ProductsPage />} />
        <Route path={`${ROUTES.byCategory}:id`} element={<CategoryPage />} />
        <Route path={`${ROUTES.product}:id`} element={<ProductPage />} />
        <Route path={ROUTES.aboutUs} element={<AboutUsPage />} />
        <Route path={ROUTES.contacts} element={<ContactsPage />} />
        <Route path={ROUTES.order} element={<OrderPage />} />
        <Route
          path={ROUTES.accountSettings}
          element={<AccountSettingsPage />}
        />
        <Route path={ROUTES.accountOrders} element={<OrdersPage />} />
        <Route path={ROUTES.accountPurchases} element={<PurchasesPage />} />
        <Route
          path={`${ROUTES.accountOrderDetail}:number`}
          element={<OrderDetailPage />}
        />
        {/* Bonuses program isn't launched yet — see api/constants.ts's
            useBonuses doc comment. Routes stay registered (so old links
            don't 404) but redirect to account settings while disabled. */}
        <Route
          path={ROUTES.accountBonuses}
          element={useBonuses ? <BonusesPage /> : <Navigate to={ROUTES.accountSettings} replace />}
        />
        <Route
          path={`${ROUTES.accountBonusDetail}:number`}
          element={useBonuses ? <BonusDetailPage /> : <Navigate to={ROUTES.accountSettings} replace />}
        />
      </Routes>
    </>
  );
}
