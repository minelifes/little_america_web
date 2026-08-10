import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem } from "../api/types";

// Ported from lib/app/bloc/cart_bloc.dart + lib/app/models/cart.dart /
// cart_item.dart, trimmed down: no promocode/global-discount/order flow yet,
// and item identity is just productId (the Flutter app also keys on a
// "smell"/variant selection, which isn't ported). Persisted to localStorage
// the same way CartModel persists to SharedPreferences.
const STORAGE_KEY = "Cart";

interface CartContextValue {
  items: CartItem[];
  /** Number of distinct line items — matches the Flutter cart badge, which shows cartItems.length, not total quantity. */
  count: number;
  isInCart: (productId: number) => boolean;
  addItem: (item: Omit<CartItem, "sum">) => void;
  removeItem: (productId: number) => void;
  changeCount: (productId: number, count: number) => void;
  clear: () => void;
  /** Cart drawer open state — lives here (rather than local Header state) so any CartButton instance can toggle the single drawer rendered in Header. */
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readInitialItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function calculateSum(price: number, discount: number, count: number): number {
  return price * ((100 - discount) / 100) * count;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readInitialItems);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore (private browsing / quota)
    }
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.length,
      isInCart: (productId) => items.some((i) => i.productId === productId),
      addItem: (item) => {
        const sum = calculateSum(item.productPrice, item.discount, item.count);
        setItems((prev) => {
          const index = prev.findIndex((i) => i.productId === item.productId);
          if (index === -1) return [...prev, { ...item, sum }];
          const next = [...prev];
          next[index] = { ...item, sum };
          return next;
        });
      },
      removeItem: (productId) => {
        setItems((prev) => prev.filter((i) => i.productId !== productId));
      },
      changeCount: (productId, count) => {
        setItems((prev) =>
          prev.map((i) => (i.productId === productId ? { ...i, count, sum: calculateSum(i.productPrice, i.discount, count) } : i)),
        );
      },
      clear: () => setItems([]),
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((v) => !v),
    }),
    [items, isOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
