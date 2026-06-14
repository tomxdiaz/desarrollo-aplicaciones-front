import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Product } from '../types/types';

export type CartItem = {
  productId: number;
  name: string;
  description: string | null;
  image: string | null;
  price: number;
  quantity: number;
};

export type CartSession = {
  restaurantId: string;
  restaurantName: string;
  tableCode?: string;
};

type CartContextType = {
  session: CartSession | null;
  items: CartItem[];
  cartCount: number;
  cartTotal: number;
  hasTable: boolean;
  setSession: (session: CartSession) => void;
  clearSession: () => void;
  getProductQuantity: (productId: number) => number;
  addProduct: (product: Product) => void;
  incrementProduct: (productId: number) => void;
  decrementProduct: (productId: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<CartSession | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);

  const cartCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const cartTotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  const hasTable = Boolean(session?.tableCode);

  const setSession = useCallback((next: CartSession) => {
    setSessionState((prev) => {
      const restaurantChanged = prev?.restaurantId !== next.restaurantId;
      const tableChanged = prev?.tableCode !== next.tableCode;
      if (restaurantChanged || tableChanged) {
        setItems([]);
      }
      return next;
    });
  }, []);

  const clearSession = useCallback(() => {
    setSessionState(null);
    setItems([]);
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getProductQuantity = useCallback(
    (productId: number) => items.find((i) => i.productId === productId)?.quantity ?? 0,
    [items],
  );

  const addProduct = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          description: product.description,
          image: product.image,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  }, []);

  const incrementProduct = useCallback((productId: number) => {
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i)),
    );
  }, []);

  const decrementProduct = useCallback((productId: number) => {
    setItems((prev) => {
      const item = prev.find((i) => i.productId === productId);
      if (!item) return prev;
      if (item.quantity <= 1) return prev.filter((i) => i.productId !== productId);
      return prev.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i,
      );
    });
  }, []);

  const value = useMemo(
    () => ({
      session,
      items,
      cartCount,
      cartTotal,
      hasTable,
      setSession,
      clearSession,
      getProductQuantity,
      addProduct,
      incrementProduct,
      decrementProduct,
      clearCart,
    }),
    [
      session,
      items,
      cartCount,
      cartTotal,
      hasTable,
      setSession,
      clearSession,
      getProductQuantity,
      addProduct,
      incrementProduct,
      decrementProduct,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
