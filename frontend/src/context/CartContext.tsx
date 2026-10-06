import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { CartItem } from "../types/cart";
import type { Product } from "../types/product";

const STORAGE_KEY = "clothing-store-cart";

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity: number, size: string, color: string) => void;
  removeItem: (productId: number, size: string, color: string) => void;
  updateQuantity: (productId: number, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function sameLine(item: CartItem, productId: number, size: string, color: string) {
  return item.product.id === productId && item.selectedSize === size && item.selectedColor === color;
}

function loadInitialCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadInitialCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable (private browsing, quota) - cart just won't survive a reload
    }
  }, [items]);

  function addItem(product: Product, quantity: number, size: string, color: string) {
    setItems((prev) => {
      const existing = prev.find((item) => sameLine(item, product.id, size, color));
      if (existing) {
        return prev.map((item) =>
          sameLine(item, product.id, size, color)
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { product, quantity, selectedSize: size, selectedColor: color }];
    });
  }

  function removeItem(productId: number, size: string, color: string) {
    setItems((prev) => prev.filter((item) => !sameLine(item, productId, size, color)));
  }

  function updateQuantity(productId: number, size: string, color: string, quantity: number) {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) => (sameLine(item, productId, size, color) ? { ...item, quantity } : item)),
    );
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  );

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
