// Ported from lib/routes/route_names.dart
export const ROUTES = {
  home: "/",
  product: "/product/",
  // Legacy alias only — the old Flutter site served product pages at
  // /products/:id (plural) and Google indexed those URLs. Routes to the
  // same ProductPage as `product` above, but ProductPage forces its SEO
  // canonical link to the /product/:id form regardless of which path was
  // used to reach it, so search engines consolidate onto one URL instead
  // of indexing both as separate/duplicate pages.
  productLegacy: "/products/",
  byCategory: "/category/",
  products: "/products",
  aboutUs: "/aboutUs",
  contacts: "/contacts",
  order: "/order",
  // NOT ported from Dart — no account/settings or order-history page exists there.
  accountSettings: "/account/settings",
  accountOrders: "/account/orders",
  accountOrderDetail: "/account/orders/",
  accountBonuses: "/account/bonuses",
  accountBonusDetail: "/account/bonuses/",
} as const;
