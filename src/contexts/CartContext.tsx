import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  image: string | null;
  unitPrice: number;
  quantity: number;
  color: string | null;
  size: string | null;
  shoeSize: string | null;
  maxStock: number | null;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "key">) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "sneaky-cart";

const makeKey = (i: Omit<CartItem, "key">) =>
  [i.productId, i.color || "-", i.size || "-", i.shoeSize || "-"].join("|");

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota errors */
    }
  }, [items]);

  const addItem = useCallback((item: Omit<CartItem, "key">) => {
    const key = makeKey(item);
    const qty = Math.max(1, Math.floor(item.quantity || 1));
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        const cap = item.maxStock ?? existing.maxStock;
        const next = existing.quantity + qty;
        return prev.map((i) =>
          i.key === key
            ? { ...i, maxStock: cap, quantity: cap !== null ? Math.min(next, cap) : next }
            : i
        );
      }
      const capped = item.maxStock !== null ? Math.min(qty, Math.max(1, item.maxStock)) : qty;
      return [...prev, { ...item, quantity: capped, key }];
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.key !== key) return i;
        let q = Math.max(1, Math.floor(quantity || 1));
        if (i.maxStock !== null) q = Math.min(q, Math.max(1, i.maxStock));
        return { ...i, quantity: q };
      })
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextType>(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      totalItems: items.reduce((s, i) => s + i.quantity, 0),
      subtotal: items.reduce((s, i) => s + i.quantity * i.unitPrice, 0),
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }),
    [items, addItem, removeItem, updateQuantity, clear, isOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
