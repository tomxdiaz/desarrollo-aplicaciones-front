import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Product } from '../types/types';

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

type CartProviderProps = Readonly<{
  children: React.ReactNode;
}>;

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: CartProviderProps) {
  const [cartSession, setCartSession] = useState<CartSession | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);

  const cartCount = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);

  const cartTotal = useMemo(() => items.reduce((total, item) => total + item.price * item.quantity, 0), [items]);

  const hasTable = Boolean(cartSession?.tableCode);

  const setSession = useCallback((nextSession: CartSession) => {
    setCartSession((previousSession) => {
      const restaurantChanged = previousSession?.restaurantId !== nextSession.restaurantId;

      const tableChanged = previousSession?.tableCode !== nextSession.tableCode;

      if (restaurantChanged || tableChanged) {
        setItems([]);
      }

      return nextSession;
    });
  }, []);

  const clearSession = useCallback(() => {
    setCartSession(null);
    setItems([]);
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getProductQuantity = useCallback((productId: number) => items.find((item) => item.productId === productId)?.quantity ?? 0, [items]);

  const addProduct = useCallback((product: Product) => {
    setItems((previousItems) => {
      const existingItem = previousItems.find((item) => item.productId === product.id);

      if (existingItem) {
        return previousItems.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...previousItems,
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
    setItems((previousItems) =>
      previousItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  }, []);

  const decrementProduct = useCallback((productId: number) => {
    setItems((previousItems) => {
      const matchingItem = previousItems.find((item) => item.productId === productId);

      if (!matchingItem) {
        return previousItems;
      }

      if (matchingItem.quantity <= 1) {
        return previousItems.filter((item) => item.productId !== productId);
      }

      return previousItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item,
      );
    });
  }, []);

  const value = useMemo<CartContextType>(
    () => ({
      session: cartSession,
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
      cartSession,
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
