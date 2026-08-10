import type { CategoryModel } from "./types";

// Ported from CategoryBloc.getById/getChildren in
// lib/app/bloc/category_bloc.dart — the whole category tree is fetched flat
// (once, see useCategories) and everything below is derived from it
// client-side by comparing ids, same as the Flutter bloc does.

export function getCategoryById(categories: CategoryModel[], id: number): CategoryModel | undefined {
  return categories.find((c) => c.id === id);
}

/** Direct children of a category — if this is empty, the category is a leaf (shows products, not subcategories). */
export function getChildren(categories: CategoryModel[], parentId: number): CategoryModel[] {
  return categories.filter((c) => c.pid === parentId && c.visible);
}

/**
 * A category's own id plus every descendant's id, at any depth — NOT
 * ported, added for the "Товари" filter panel's category tabs. Those tabs
 * only ever show top-level (parent) categories, but products are assigned
 * to leaf/subcategory ids, never to the parent itself — filtering by just
 * the parent's own id matched nothing. Expanding to the full subtree before
 * sending it to the backend fixes that (see productApi.search's
 * categoryIds and ProductsPage.tsx).
 */
export function getSelfAndDescendantIds(categories: CategoryModel[], id: number): number[] {
  const ids = [id];
  for (const child of getChildren(categories, id)) {
    ids.push(...getSelfAndDescendantIds(categories, child.id));
  }
  return ids;
}

/**
 * Ancestor chain for a category, root-first (Home > ... > immediate parent).
 *
 * The Flutter app's BreadcrumbsWidget builds this same walk but appends the
 * ancestors in nearest-parent-first order without reversing, so a 2+ level
 * deep category displays its breadcrumb backwards (immediate parent before
 * grandparent). Fixed here to the correct root-first order.
 */
export function getAncestors(categories: CategoryModel[], category: CategoryModel): CategoryModel[] {
  const ancestors: CategoryModel[] = [];
  const visited = new Set<number>([category.id]);
  let current = category;

  while (current.pid !== null) {
    const parent = getCategoryById(categories, current.pid);
    if (!parent || visited.has(parent.id)) break;
    ancestors.unshift(parent);
    visited.add(parent.id);
    current = parent;
  }

  return ancestors;
}
