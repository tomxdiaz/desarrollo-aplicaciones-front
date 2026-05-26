import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type CartSession = {
  restaurantId: string;
  restaurantName: string;
  tableCode?: string;
};

type CartContextType = {
  session: CartSession | null;
  items: Record<number, number>;
  cartCount: number;
  hasTable: boolean;
  setSession: (session: CartSession) => void;
  clearSession: () => void;
  getProductQuantity: (productId: number) => number;
  incrementProduct: (productId: number) => void;
  decrementProduct: (productId: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<CartSession | null>(null);
  const [items, setItems] = useState<Record<number, number>>({});

  const cartCount = useMemo(
    () => Object.values(items).reduce((total, quantity) => total + quantity, 0),
    [items],
  );
  const hasTable = Boolean(session?.tableCode);

  const setSession = useCallback((next: CartSession) => {
    setSessionState((prev) => {
      const restaurantChanged = prev?.restaurantId !== next.restaurantId;
      const tableChanged = prev?.tableCode !== next.tableCode;

      if (restaurantChanged || tableChanged) {
        setItems({});
      }

      return next;
    });
  }, []);

  const clearSession = useCallback(() => {
    setSessionState(null);
    setItems({});
  }, []);

  const clearCart = useCallback(() => {
    setItems({});
  }, []);

  const getProductQuantity = useCallback((productId: number) => items[productId] ?? 0, [items]);

  const incrementProduct = useCallback((productId: number) => {
    setItems((prev) => ({
      ...prev,
      [productId]: (prev[productId] ?? 0) + 1,
    }));
  }, []);

  const decrementProduct = useCallback((productId: number) => {
    setItems((prev) => {
      const current = prev[productId] ?? 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: current - 1 };
    });
  }, []);

  const value = useMemo(
    () => ({
      session,
      items,
      cartCount,
      hasTable,
      setSession,
      clearSession,
      getProductQuantity,
      incrementProduct,
      decrementProduct,
      clearCart,
    }),
    [
      session,
      items,
      cartCount,
      hasTable,
      setSession,
      clearSession,
      getProductQuantity,
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
