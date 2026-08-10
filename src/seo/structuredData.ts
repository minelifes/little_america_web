import { useEffect } from "react";

export interface BreadcrumbItem {
  name: string;
  path?: string;
}

function injectJsonLd(id: string, data: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeJsonLd(id: string) {
  document.getElementById(id)?.remove();
}

// Injects/updates a single JSON-LD <script type="application/ld+json"> in
// <head>, keyed by id, and removes it on unmount so navigating to a page
// that doesn't set structured data doesn't leave a stale block behind.
// Subject to the same "JS-executing crawlers only" caveat as useSeo.
export function useJsonLd(id: string, data: object | null | undefined) {
  useEffect(() => {
    if (!data) return;
    injectJsonLd(id, data);
    return () => removeJsonLd(id);
  }, [id, data]);
}

export function breadcrumbListJsonLd(items: BreadcrumbItem[]) {
  const origin = window.location.origin;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: `${origin}${item.path}` } : {}),
    })),
  };
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function productJsonLd(product: {
  title: string;
  content?: string;
  price: number;
  image?: string;
  isInStore?: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: stripHtml(product.content ?? "") || undefined,
    image: product.image ? [product.image] : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "UAH",
      price: product.price,
      availability:
        product.isInStore === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      url: window.location.href,
    },
  };
}

// Real business data extracted from ContactsPage.tsx (address/phone/hours,
// same coordinates as the Google Maps embed already in the codebase) — used
// for the LocalBusiness block on the Contacts page.
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Little America",
    image: `${window.location.origin}/favicon.svg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "вул. Богдана Хмельницького, 40а/1",
      addressLocality: "Луцьк",
      addressCountry: "UA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 50.743356280514526,
      longitude: 25.31798788221867,
    },
    telephone: "+380937062276",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "10:00",
        closes: "18:00",
      },
    ],
  };
}
