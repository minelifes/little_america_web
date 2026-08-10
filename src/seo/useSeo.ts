import { useEffect } from "react";

export interface SeoOptions {
  title: string;
  description?: string;
  image?: string;
  type?: "website" | "product" | "article";
  noindex?: boolean;
  // Overrides the canonical/og:url path when the current URL shouldn't be
  // self-referential — e.g. the legacy /products/:id alias should still
  // declare /product/:id as canonical so crawlers consolidate onto one URL
  // instead of indexing both as duplicates.
  canonicalPath?: string;
}

const SITE_NAME = "Little America";
const DEFAULT_DESCRIPTION =
  "Little America — інтернет-магазин американських товарів у Луцьку: парфуми, косметика, солодощі, свічки, білизна, кава та товари відомих брендів Victoria's Secret, Bath and Body Works, Starbucks, iHerb.";
const DEFAULT_IMAGE = "/favicon.svg";

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    for (const [key, value] of Object.entries(attrs)) {
      if (key !== "content") el.setAttribute(key, value);
    }
    document.head.appendChild(el);
  }
  el.setAttribute("content", attrs.content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

// NOT ported from Dart — this is a pure client-side Vite SPA with no
// SSR/prerendering, so anything this hook writes to <head> is only visible
// to crawlers that execute JavaScript (Googlebot does this; many other bots,
// and social-media link-preview scrapers, do NOT). This gets titles,
// descriptions, Open Graph/Twitter tags, and the canonical link right for
// JS-executing crawlers, and index.html carries a sane static fallback for
// everyone else. A fully correct solution for non-JS crawlers/link
// unfurling would require SSR or prerendering — out of scope here.
export function useSeo({
  title,
  description,
  image,
  type = "website",
  noindex = false,
  canonicalPath,
}: SeoOptions) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const desc = description ?? DEFAULT_DESCRIPTION;
    const img = image ?? DEFAULT_IMAGE;
    const url = canonicalPath
      ? `${window.location.origin}${canonicalPath}`
      : window.location.href;

    document.title = fullTitle;

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: desc,
    });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: noindex ? "noindex, nofollow" : "index, follow",
    });

    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: fullTitle,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: desc,
    });
    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: type,
    });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: url });
    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: img,
    });
    upsertMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: SITE_NAME,
    });

    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: fullTitle,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: desc,
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: img,
    });

    upsertLink("canonical", url);
  }, [title, description, image, type, noindex]);
}
